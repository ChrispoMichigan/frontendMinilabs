const CourseInfo = ({ course }) => {
  const formatPrice = (price) => {
    return price > 0 ? `$${parseFloat(price).toFixed(2)} MXN` : 'Gratis';
  };

  const getDifficultyText = (level) => {
    switch (level) {
      case 'beginner': return 'Principiante';
      case 'intermediate': return 'Intermedio';
      case 'advanced': return 'Avanzado';
      default: return level || 'No definido';
    }
  };

  return (
    <div className="space-y-4">
      {/* Detalles del curso */}
      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Nivel:</span>
          <span className="font-medium">{getDifficultyText(course.difficulty_level)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Duración:</span>
          <span className="font-medium">{course.duration_hours || 0} horas</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Actividades:</span>
          <span className="font-medium">{course.activities_count || 0}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Edad:</span>
          <span className="font-medium">{course.age_min}-{course.age_max} años</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Precio:</span>
          <span className="font-bold text-lg">{formatPrice(course.price)}</span>
        </div>
      </div>

      {/* Beneficios incluidos */}
      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-green-500">✓</span>
          <span>Acceso de por vida</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-green-500">✓</span>
          <span>Todos los materiales incluidos</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-green-500">✓</span>
          <span>Soporte técnico</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-green-500">✓</span>
          <span>Certificado de completación</span>
        </div>
      </div>
    </div>
  );
};

export default CourseInfo;
