import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FloatingWhatsApp from '../components/FloatingWhatsApp';

export default function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}
