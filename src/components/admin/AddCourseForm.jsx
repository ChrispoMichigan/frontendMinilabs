import React, { useState } from 'react';
import { Save, Upload, X, AlertCircle, Plus, Trash2, FileText, Eye } from 'lucide-react';

const AddCourseForm = ({ onCourseCreated, categories = [] }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    general_objective: '',
    price: '',
    age_min: '5',
    age_max: '16',
    difficulty_level: 'beginner',
    category: '',
    components_included: '',
    activities_count: '',
    duration_hours: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [coverImage, setCoverImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  
  // Estado para las lecciones
  const [lessons, setLessons] = useState([]);
  const [showPreview, setShowPreview] = useState(false);

  // Manejar cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  // Manejar selección de imagen
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Funciones para manejar lecciones
  const addLesson = () => {
    const newLesson = {
      id: Date.now(), // ID temporal para React
      title: '',
      description: '',
      duration_minutes: 30,
      pdfFile: null,
      pdfName: ''
    };
    setLessons([...lessons, newLesson]);
  };

  const removeLesson = (lessonId) => {
    setLessons(lessons.filter(lesson => lesson.id !== lessonId));
  };

  const updateLesson = (lessonId, field, value) => {
    setLessons(lessons.map(lesson => 
      lesson.id === lessonId 
        ? { ...lesson, [field]: value }
        : lesson
    ));
  };

  const handleLessonPdfChange = (lessonId, file) => {
    if (file) {
      updateLesson(lessonId, 'pdfFile', file);
      updateLesson(lessonId, 'pdfName', file.name);
    } else {
      updateLesson(lessonId, 'pdfFile', null);
      updateLesson(lessonId, 'pdfName', '');
    }
  };

  // Subir PDF de lección
  const uploadLessonPdf = async (pdfFile) => {
    if (!pdfFile) return null;

    try {
      const token = localStorage.getItem('adminToken');
      const pdfFormData = new FormData();
      pdfFormData.append('pdf', pdfFile);

      const response = await fetch('http://localhost:3001/api/courses/files/upload-pdf', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: pdfFormData
      });

      const data = await response.json();
      
      if (data.success) {
        return {
          file_id: data.data.id,
          url: data.data.cloudinary_url,
          filename: data.data.original_name
        };
      } else {
        throw new Error(data.message || 'Error al subir PDF');
      }
    } catch (error) {
      console.error('Error al subir PDF:', error);
      throw error;
    }
  };

  // Subir imagen de portada
  const uploadCoverImage = async () => {
    if (!coverImage) return null;

    try {
      const token = localStorage.getItem('adminToken');
      const imageFormData = new FormData();
      imageFormData.append('image', coverImage);

      const response = await fetch('http://localhost:3001/api/courses/files/upload-image', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: imageFormData
      });

      const data = await response.json();
      
      if (data.success) {
        return {
          url: data.data.cloudinary_url,
          public_id: data.data.cloudinary_public_id
        };
      } else {
        throw new Error(data.message || 'Error al subir imagen');
      }
    } catch (error) {
      console.error('Error al subir imagen:', error);
      throw error;
    }
  };

  // Crear lecciones después de crear el curso
  const createLessons = async (courseId) => {
    const token = localStorage.getItem('adminToken');
    
    for (let i = 0; i < lessons.length; i++) {
      const lesson = lessons[i];
      
      try {
        // Subir PDF si existe
        let pdfData = null;
        if (lesson.pdfFile) {
          pdfData = await uploadLessonPdf(lesson.pdfFile);
        }

        // Crear la lección
        const lessonData = {
          course_id: courseId,
          title: lesson.title,
          description: lesson.description,
          lesson_order: i + 1,
          duration_minutes: lesson.duration_minutes,
          is_active: 1
        };

        const lessonResponse = await fetch('http://localhost:3001/api/courses/lessons', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(lessonData)
        });

        const lessonResult = await lessonResponse.json();
        
        if (lessonResult.success && pdfData) {
          // Asociar el PDF con la lección
          await fetch('http://localhost:3001/api/courses/lessons/files', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              lesson_id: lessonResult.data.id,
              file_id: pdfData.file_id,
              file_purpose: 'lesson_pdf',
              display_order: 1
            })
          });
        }
        
      } catch (error) {
        console.error(`Error al crear lección ${i + 1}:`, error);
        // Continuar con las siguientes lecciones aunque una falle
      }
    }
  };

  // Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Validaciones
      if (!formData.title || !formData.description || !formData.general_objective || !formData.category) {
        throw new Error('Título, descripción, objetivo general y categoría son requeridos');
      }

      let imageData = null;
      
      // Subir imagen si se seleccionó
      if (coverImage) {
        try {
          imageData = await uploadCoverImage();
        } catch {
          throw new Error('Error al subir la imagen de portada');
        }
      }

      // Preparar datos del curso
      const courseData = {
        ...formData,
        price: parseFloat(formData.price) || 0,
        age_min: parseInt(formData.age_min) || 5,
        age_max: parseInt(formData.age_max) || 16,
        activities_count: parseInt(formData.activities_count) || 0,
        duration_hours: parseInt(formData.duration_hours) || 0,
        ...(imageData && {
          cover_image_url: imageData.url,
          cover_image_public_id: imageData.public_id
        })
      };

      // Crear el curso
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:3001/api/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(courseData)
      });

      const data = await response.json();

      if (data.success) {
        const createdCourse = data.data;
        
        // Crear lecciones si existen
        if (lessons.length > 0) {
          await createLessons(createdCourse.id);
        }
        
        setSuccess('Curso creado exitosamente con todas sus lecciones');
        setTimeout(() => {
          onCourseCreated();
        }, 1500);
      } else {
        throw new Error(data.message || 'Error al crear el curso');
      }

    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Limpiar formulario
  const handleReset = () => {
    setFormData({
      title: '',
      description: '',
      general_objective: '',
      price: '',
      age_min: '5',
      age_max: '16',
      difficulty_level: 'beginner',
      category: '',
      components_included: '',
      activities_count: '',
      duration_hours: ''
    });
    setCoverImage(null);
    setImagePreview('');
    setLessons([]);
    setError('');
    setSuccess('');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Crear Nuevo Curso</h2>
        <p className="text-gray-600">
          Completa la información del nuevo kit educativo de robótica
        </p>
      </div>

      {/* Mensajes de estado */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <span className="text-red-700">{error}</span>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <span className="text-green-700">{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Información básica */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Información Básica</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título del Curso *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ej: Kit de Robótica Básica para Principiantes"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoría *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Seleccionar categoría</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
                <option value="Robótica Básica">Robótica Básica</option>
                <option value="Programación">Programación</option>
                <option value="Electrónica">Electrónica</option>
                <option value="Mecánica">Mecánica</option>
                <option value="Sensores">Sensores</option>
                <option value="Proyectos Avanzados">Proyectos Avanzados</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nivel de Dificultad
              </label>
              <select
                name="difficulty_level"
                value={formData.difficulty_level}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="beginner">Principiante</option>
                <option value="intermediate">Intermedio</option>
                <option value="advanced">Avanzado</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Precio (USD)
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Edad Mínima
              </label>
              <input
                type="number"
                name="age_min"
                value={formData.age_min}
                onChange={handleInputChange}
                min="3"
                max="18"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Edad Máxima
              </label>
              <input
                type="number"
                name="age_max"
                value={formData.age_max}
                onChange={handleInputChange}
                min="3"
                max="18"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Número de Actividades
              </label>
              <input
                type="number"
                name="activities_count"
                value={formData.activities_count}
                onChange={handleInputChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duración (horas)
              </label>
              <input
                type="number"
                name="duration_hours"
                value={formData.duration_hours}
                onChange={handleInputChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0"
              />
            </div>
          </div>
        </div>

        {/* Descripción */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Contenido del Curso</h3>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe brevemente el contenido y beneficios del curso..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Objetivo General *
              </label>
              <textarea
                name="general_objective"
                value={formData.general_objective}
                onChange={handleInputChange}
                required
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="¿Qué aprenderán los estudiantes al completar este curso?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Componentes Incluidos
              </label>
              <textarea
                name="components_included"
                value={formData.components_included}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Lista los componentes físicos incluidos en el kit (Arduino, sensores, cables, etc.)"
              />
            </div>
          </div>
        </div>

        {/* Imagen de portada */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Imagen de Portada</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Seleccionar imagen
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-sm text-gray-500 mt-1">
                Formatos soportados: JPG, PNG, GIF. Tamaño máximo: 10MB
              </p>
            </div>

            {imagePreview && (
              <div className="relative inline-block">
                <img
                  src={imagePreview}
                  alt="Vista previa"
                  className="w-40 h-40 object-cover rounded-lg border border-gray-300"
                />
                <button
                  type="button"
                  onClick={() => {
                    setCoverImage(null);
                    setImagePreview('');
                  }}
                  className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Lecciones del curso */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Lecciones del Curso</h3>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                {showPreview ? 'Ocultar' : 'Vista Previa'}
              </button>
              <button
                type="button"
                onClick={addLesson}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Agregar Lección
              </button>
            </div>
          </div>

          {/* Vista previa del curso */}
          {showPreview && (
            <div className="mb-6 p-4 border border-blue-200 rounded-lg bg-blue-50">
              <h4 className="font-medium text-blue-900 mb-3">Vista Previa - Como se verá en producción</h4>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h5 className="text-lg font-semibold text-gray-900 mb-2">
                  {formData.title || 'Título del Curso'}
                </h5>
                <p className="text-gray-600 mb-4">
                  {formData.description || 'Descripción del curso aparecerá aquí...'}
                </p>
                <div className="space-y-3">
                  {lessons.length === 0 ? (
                    <p className="text-gray-400 italic">No hay lecciones añadidas aún</p>
                  ) : (
                    lessons.map((lesson, index) => (
                      <div key={lesson.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded">
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h6 className="font-medium text-gray-900">
                            {lesson.title || `Lección ${index + 1}`}
                          </h6>
                          <p className="text-sm text-gray-600">
                            {lesson.description || 'Sin descripción'}
                          </p>
                          <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                            <span>⏱️ {lesson.duration_minutes} min</span>
                            {lesson.pdfName && (
                              <span className="flex items-center gap-1">
                                <FileText className="w-3 h-3" />
                                {lesson.pdfName}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Lista de lecciones para editar */}
          <div className="space-y-4">
            {lessons.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p>No hay lecciones añadidas.</p>
                <p className="text-sm">Haz clic en "Agregar Lección" para comenzar.</p>
              </div>
            ) : (
              lessons.map((lesson, index) => (
                <div key={lesson.id} className="border border-gray-200 rounded-lg p-4 bg-white">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900">Lección {index + 1}</h4>
                    <button
                      type="button"
                      onClick={() => removeLesson(lesson.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Título de la Lección *
                      </label>
                      <input
                        type="text"
                        value={lesson.title}
                        onChange={(e) => updateLesson(lesson.id, 'title', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Ej: Introducción a la robótica"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Duración (minutos)
                      </label>
                      <input
                        type="number"
                        value={lesson.duration_minutes}
                        onChange={(e) => updateLesson(lesson.id, 'duration_minutes', parseInt(e.target.value) || 30)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        min="1"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Descripción
                      </label>
                      <textarea
                        value={lesson.description}
                        onChange={(e) => updateLesson(lesson.id, 'description', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Describe brevemente el contenido de esta lección..."
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Archivo PDF de la Lección
                      </label>
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={(e) => handleLessonPdfChange(lesson.id, e.target.files[0])}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      {lesson.pdfName && (
                        <div className="mt-2 flex items-center gap-2 text-sm text-green-600">
                          <FileText className="w-4 h-4" />
                          <span>{lesson.pdfName}</span>
                        </div>
                      )}
                      <p className="text-sm text-gray-500 mt-1">
                        Formato soportado: PDF. Tamaño máximo: 10MB
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Botones */}
        <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={handleReset}
            disabled={loading}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            Limpiar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Creando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Crear Curso
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCourseForm;
