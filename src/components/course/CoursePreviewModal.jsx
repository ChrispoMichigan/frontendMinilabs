import Modal from '../ui/Modal';
import CourseDetailsModal from './CourseDetailsModal';

const CoursePreviewModal = ({ course, isOpen, onClose }) => {
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      size="full"
      showCloseButton={true}
      className="!max-w-[95vw] !max-h-[95vh] overflow-hidden"
    >
      <CourseDetailsModal 
        course={course} 
        isOpen={isOpen} 
        onClose={onClose} 
      />
    </Modal>
  );
};

export default CoursePreviewModal;
