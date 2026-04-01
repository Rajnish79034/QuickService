import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Providers from './pages/Providers';
import Booking from './pages/Booking';
import Confirmation from './pages/Confirmation';
import Profile from './pages/Profile';
import RegisterProvider from './pages/RegisterProvider';
import ChatAssistant from './components/ChatAssistant';
import ProviderPanel from './pages/ProviderPanel';
import AdminDashboard from './pages/AdminDashboard';
const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/services/:id/providers" element={<Providers />} />
        <Route path="/book/:providerId" element={<Booking />} />
        <Route path="/confirmation" element={<Confirmation />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/register-provider" element={<RegisterProvider />} />
        <Route path="/vendor-panel" element={<ProviderPanel />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
        <Toaster position="bottom-right" />
        <AnimatedRoutes />
        <ChatAssistant />
      </div>
    </Router>
  );
}

export default App;
