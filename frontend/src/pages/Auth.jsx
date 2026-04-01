import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mail, User, ArrowRight, Lock } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = 'http://localhost:5001';

const Auth = () => {
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setIsLogin(params.get('mode') !== 'signup');
  }, [location.search]);

  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLogin && formData.password.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }

    setLoading(true);
    try {
      const endpoint = isLogin ? '/api/login' : '/api/signup';
      const res = await axios.post(`${API_URL}${endpoint}`, formData);
      if (res.data.user) {
        localStorage.setItem('user', JSON.stringify(res.data.user));
        toast.success(res.data.message || (isLogin ? 'Successfully logged in!' : 'Account created successfully!'));
        navigate('/dashboard');
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Something went wrong. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex relative overflow-hidden text-gray-100"
    >
      {/* Global Dynamic Background */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-1000 hover:scale-105"
        style={{ backgroundImage: "url('/bg-home-services.png')" }}
      ></div>
      {/* Global gradient overlays for cinematic effect and readability */}
      <div className="absolute inset-0 z-0 bg-gray-900/60 mix-blend-multiply backdrop-blur-[2px]"></div>
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-black/60 to-transparent lg:w-1/2 hidden lg:block"></div>

      {/* Left: Branding panel (Only visible on large screens) */}
      <div className="hidden lg:flex flex-col justify-center items-center flex-1 p-12 relative z-10">
        <div className="relative flex flex-col items-center">
          <motion.img 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            src="/logo.png" 
            alt="FixKaro" 
            className="w-24 h-24 mb-8 rounded-3xl bg-white/10 backdrop-blur-md p-4 shadow-2xl border border-white/20" 
          />
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-5xl font-extrabold text-white mb-4 text-center leading-tight drop-shadow-lg"
          >
            Home Services,<br />Done Right.
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-white/90 text-xl text-center max-w-md font-medium drop-shadow-md"
          >
            Trusted professionals at your doorstep. Book electricians, plumbers, barbers & more in minutes.
          </motion.p>
        </div>
      </div>

      {/* Right: Auth form */}
      <div className="flex-1 flex items-center justify-center p-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md bg-white/10 dark:bg-slate-900/40 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl p-8"
        >
          <div className="flex items-center gap-2 mb-8 lg:hidden justify-center">
            <img src="/logo.png" alt="FixKaro" className="w-10 h-10 rounded-xl bg-white/10 p-1" />
            <span className="text-2xl font-extrabold text-white drop-shadow-md">FixKaro</span>
          </div>

          <h2 className="text-3xl font-extrabold text-white mb-2 text-center lg:text-left drop-shadow-md">
            {isLogin ? 'Welcome back' : 'Create your account'}
          </h2>
          <p className="text-gray-300 mb-8 text-center lg:text-left font-medium">
            {isLogin ? 'Log in to book services instantly' : 'Sign up and get started in seconds'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  key="name"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <label className="block text-sm font-medium text-gray-200 mb-1.5 drop-shadow-sm">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                    <input
                      type="text"
                      placeholder="Your Name"
                      required={!isLogin}
                      className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 text-white rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all placeholder-gray-400 backdrop-blur-sm"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1.5 drop-shadow-sm">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                <input
                  type="email"
                  placeholder="you@example.com"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 text-white rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all placeholder-gray-400 backdrop-blur-sm"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1.5 drop-shadow-sm">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                <input
                  type="password"
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 text-white rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all placeholder-gray-400 backdrop-blur-sm"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-500 hover:bg-brand-600 active:scale-[0.98] transition-all text-white font-semibold rounded-xl flex justify-center items-center gap-2 py-3.5 text-base mt-4 shadow-lg shadow-brand-500/30"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  {isLogin ? 'Log In' : 'Create Account'}
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-brand-300 hover:text-brand-200 font-semibold text-sm transition-colors drop-shadow-sm"
            >
              {isLogin ? "New to FixKaro? Create an account" : 'Already have an account? Log in'}
            </button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Auth;
