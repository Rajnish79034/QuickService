import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, Home, Calendar, Clock, Star, Phone, MessageCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

const Confirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { provider, date, timeSlot } = location.state || {};

  useEffect(() => {
    const duration = 2500;
    const end = Date.now() + duration;
    const colors = ['#FC8019', '#fbbf24', '#f472b6', '#60a5fa'];
    const frame = () => {
      confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0 }, colors });
      confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1 }, colors });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="min-h-screen bg-gray-50 dark:bg-slate-950 flex flex-col items-center justify-center px-6 transition-colors duration-300"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-lg w-full max-w-sm text-center border border-gray-100 dark:border-slate-800"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.3 }}
          className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <CheckCircle size={44} className="text-green-500" />
        </motion.div>

        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-1">Booking Confirmed!</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">Your service has been scheduled.</p>

        {provider && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-gray-50 dark:bg-slate-800 rounded-xl p-4 text-left mb-6"
          >
            <div className="flex items-center gap-3 mb-3 pb-3 border-b border-gray-200 dark:border-slate-700">
              <img src={provider.image} alt={provider.name} className="w-11 h-11 rounded-lg object-cover" />
              <div>
                <p className="font-bold text-gray-900 dark:text-white text-sm">{provider.name}</p>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Star size={10} className="text-yellow-500 fill-yellow-500" />
                  {provider.rating} • {provider.service}
                </div>
              </div>
            </div>
            <div className="space-y-1.5 text-sm text-gray-700 dark:text-gray-300">
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-brand-500" />
                <span className="font-medium">{date || 'Today'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-brand-500" />
                <span className="font-medium">{timeSlot}</span>
              </div>
            </div>

            <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-slate-700">
              <button 
                onClick={() => window.open(`https://wa.me/${(provider.phone || '919876543210').replace('+','')}?text=Hi%20${encodeURIComponent(provider.name)},%20I%20just%20booked%20your%20${encodeURIComponent(provider.service)}%20services%20for%20${encodeURIComponent(date)}%20at%20${encodeURIComponent(timeSlot)}.`, '_blank')}
                className="w-full py-2.5 flex items-center justify-center gap-2 bg-green-50 text-green-600 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-xl font-bold text-sm hover:bg-green-100 transition-colors shadow-sm"
              >
                <MessageCircle size={16} /> Chat on WhatsApp
              </button>
              <button 
                onClick={() => window.location.href = `tel:${provider.phone || '+919876543210'}`}
                className="w-full py-2.5 flex items-center justify-center gap-2 bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded-xl font-bold text-sm hover:bg-blue-100 transition-colors shadow-sm"
              >
                <Phone size={16} /> Call Provider
              </button>
            </div>
          </motion.div>
        )}

        <button
          onClick={() => navigate('/dashboard')}
          className="w-full btn-primary flex justify-center items-center gap-2 py-3"
        >
          <Home size={16} /> Back to Home
        </button>
      </motion.div>

      <p className="text-xs text-gray-400 mt-6">
        Booking ID: #{Math.random().toString(36).substring(2, 10).toUpperCase()}
      </p>
    </motion.div>
  );
};

export default Confirmation;
