import { useState } from 'react';
import { 
  Clock, 
  Download, 
  ChevronDown,
  ChevronRight,
  BookOpen
} from 'lucide-react';

const CourseLessons = ({ lessons = [] }) => {
  const [expandedLesson, setExpandedLesson] = useState(null);

  const toggleLesson = (lessonId) => {
    setExpandedLesson(expandedLesson === lessonId ? null : lessonId);
  };

  if (!lessons.length) {
    return (
      <div className="text-center py-8 text-gray-500">
        <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
        <p>El contenido se publicará pronto</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {lessons.map((lesson, index) => (
        <div key={lesson.id} className="border border-gray-200 rounded-lg overflow-hidden">
          <button
            onClick={() => toggleLesson(lesson.id)}
            className="w-full p-4 text-left hover:bg-gray-50 transition-colors flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                {index + 1}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  {lesson.title}
                </h3>
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {lesson.duration_minutes} min
                  </span>
                  <span className="flex items-center gap-1">
                    <Download className="w-4 h-4" />
                    Material incluido
                  </span>
                </div>
              </div>
            </div>
            {expandedLesson === lesson.id ? 
              <ChevronDown className="w-5 h-5 text-gray-400" /> : 
              <ChevronRight className="w-5 h-5 text-gray-400" />
            }
          </button>
          
          {expandedLesson === lesson.id && (
            <div className="px-4 pb-4 border-t bg-gray-50">
              <div className="pt-4">
                <p className="text-gray-700 mb-4">
                  {lesson.description || 'Descripción de la lección disponible una vez que comiences el curso.'}
                </p>
                <div className="flex items-center gap-2 text-sm text-blue-600">
                  <Download className="w-4 h-4" />
                  Material descargable disponible
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CourseLessons;
