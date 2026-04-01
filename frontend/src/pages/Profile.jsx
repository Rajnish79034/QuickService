import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Calendar, Shield, ArrowRight, LogOut } from 'lucide-react';
import Navbar from '../components/Navbar';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) { navigate('/login'); return; }
    setUser(JSON.parse(storedUser));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  if (!user) return null;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors">
      <Navbar showBack onBack={() => navigate(-1)} title="My Profile" />

      <main className="max-w-lg mx-auto px-4 py-8 space-y-4">
        {/* Avatar & Name */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-gray-100 dark:border-slate-800 flex flex-col items-center shadow-sm">
          <div className="w-20 h-20 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center text-3xl font-extrabold border-2 border-brand-200 shadow-md mb-4">
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <h2 className="text-xl font-extrabold text-gray-900 dark:text-white">{user.name}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1"><Mail size={14} /> {user.email}</p>
        </motion.div>

        {/* Actions */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}
          className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 overflow-hidden shadow-sm">

          <button onClick={() => navigate('/register-provider')}
            className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors border-b border-gray-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-50 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                <Shield size={18} className="text-green-600" />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">Become a Provider</p>
                <p className="text-xs text-gray-400">Register and offer your services</p>
              </div>
            </div>
            <ArrowRight size={16} className="text-gray-400" />
          </button>

          <button onClick={() => navigate('/vendor-panel')}
            className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors border-b border-gray-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-50 dark:bg-orange-900/30 rounded-xl flex items-center justify-center">
                <Calendar size={18} className="text-orange-500" />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">Vendor Panel</p>
                <p className="text-xs text-gray-400">Manage your bookings</p>
              </div>
            </div>
            <ArrowRight size={16} className="text-gray-400" />
          </button>

          <button onClick={() => navigate('/admin')}
            className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors border-b border-gray-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                <User size={18} className="text-blue-500" />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">Admin Dashboard</p>
                <p className="text-xs text-gray-400">Platform analytics & data</p>
              </div>
            </div>
            <ArrowRight size={16} className="text-gray-400" />
          </button>

          <button onClick={handleLogout}
            className="w-full px-5 py-4 flex items-center justify-between hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-50 dark:bg-red-900/30 rounded-xl flex items-center justify-center">
                <LogOut size={18} className="text-red-500" />
              </div>
              <p className="text-sm font-semibold text-red-600 dark:text-red-400">Log Out</p>
            </div>
          </button>
        </motion.div>
      </main>
    </motion.div>
  );
};

export default Profile;
