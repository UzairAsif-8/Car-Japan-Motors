import { Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import ScrollToTop from './components/ScrollToTop';
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import ProtectedRoute from './routes/ProtectedRoute';
import RouteLoader from './components/ui/RouteLoader';

const Home = lazy(() => import('./pages/Home'));
const Inventory = lazy(() => import('./pages/Inventory'));
const VehicleDetails = lazy(() => import('./pages/VehicleDetails'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const NotFound = lazy(() => import('./pages/NotFound'));

const AdminLogin = lazy(() => import('./pages/admin/Login'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const AdminCars = lazy(() => import('./pages/admin/Cars'));
const CarForm = lazy(() => import('./pages/admin/CarForm'));
const Inquiries = lazy(() => import('./pages/admin/Inquiries'));
const Reviews = lazy(() => import('./pages/admin/Reviews'));

export default function App() {
  const location = useLocation();

  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<RouteLoader />}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/inventory/:id" element={<VehicleDetails />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
            </Route>

            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="cars" element={<AdminCars />} />
              <Route path="cars/new" element={<CarForm />} />
              <Route path="cars/:id/edit" element={<CarForm />} />
              <Route path="inquiries" element={<Inquiries />} />
              <Route path="reviews" element={<Reviews />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
      </Suspense>
    </>
  );
}
