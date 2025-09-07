import Header from '../components/Header';
import Hero from '../components/Hero';
import CoursesGrid from '../components/CoursesGrid';
import Footer from '../components/Footer';
import AuthModal from '../components/AuthModal';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Hero />
      <CoursesGrid />
      <Footer />
      <AuthModal />
    </div>
  );
};

export default HomePage;
