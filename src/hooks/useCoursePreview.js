import { useState } from 'react';

export const useCoursePreview = () => {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  const openPreview = (course) => {
    setSelectedCourse(course);
    setShowPreview(true);
  };

  const closePreview = () => {
    setShowPreview(false);
    setSelectedCourse(null);
  };

  return {
    selectedCourse,
    showPreview,
    openPreview,
    closePreview
  };
};

export default useCoursePreview;
