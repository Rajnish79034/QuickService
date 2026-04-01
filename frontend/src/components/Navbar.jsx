import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, MapPin, Search, Sun, Moon, User, Shield, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

const Navbar = ({ showBack, onBack, title, showSearch, showLocation, searchQuery, onSearchChange }) => {
  const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark');
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) setUser(JSON.parse(storedUser));
    } catch { /* ignore */ }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setDropdownOpen(false);
    navigate('/');
  };

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [dark]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <header className="bg-white dark:bg-slate-900 px-4 md:px-8 py-3 shadow-sm flex items-center justify-between sticky top-0 z-50 border-b border-gray-100 dark:border-slate-800 transition-colors duration-300">
      <div className="flex items-center gap-3">
        {showBack && (
          <button
            onClick={onBack}
            className="p-2 -ml-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors"
          >
            <ChevronLeft size={22} className="text-gray-700 dark:text-gray-300" />
          </button>
        )}
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="FixKaro" className="w-8 h-8 object-contain" />
          <span className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            {title || 'FixKaro'}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {showLocation && (
          <div className="hidden md:flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 cursor-pointer hover:text-brand-500 transition-colors">
            <MapPin size={16} className="text-brand-500" />
            <span className="font-medium">Chandigarh</span>
            <ChevronLeft size={14} className="rotate-[-90deg]" />
          </div>
        )}
        {showSearch && (
          <div className="hidden md:flex items-center bg-gray-100 dark:bg-slate-800 rounded-xl px-4 py-2.5 w-64">
            <Search size={16} className="text-gray-400 mr-2" />
            <input
              type="text"
              value={searchQuery || ''}
              onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
              placeholder="Search for services..."
              className="bg-transparent text-sm outline-none w-full placeholder:text-gray-400 text-gray-900 dark:text-white"
            />
          </div>
        )}
        <div className="h-6 w-px bg-gray-200 dark:bg-slate-700 mx-1 hidden sm:block"></div>
        {user ? (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 px-2 py-1.5 rounded-xl transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center text-xs font-bold border border-brand-200 shadow-sm">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <span className="hidden sm:inline">{user.name?.split(' ')[0]}</span>
              <ChevronLeft size={14} className="rotate-[-90deg] text-gray-400" />
            </button>

            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 shadow-xl overflow-hidden z-50"
                >
                  <div className="px-4 py-3 border-b border-gray-100 dark:border-slate-700">
                    <p className="text-sm font-bold text-gray-900 dark:text-white">{user.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>

                  <button onClick={() => { setDropdownOpen(false); navigate('/profile'); }}
                    className="w-full px-4 py-2.5 text-left flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                    <User size={16} className="text-gray-400" /> My Profile
                  </button>

                  <button onClick={() => { setDropdownOpen(false); navigate('/register-provider'); }}
                    className="w-full px-4 py-2.5 text-left flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                    <Shield size={16} className="text-green-500" /> Register as Provider
                  </button>

                  <div className="border-t border-gray-100 dark:border-slate-700">
                    <button onClick={handleLogout}
                      className="w-full px-4 py-2.5 text-left flex items-center gap-3 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">
                      <LogOut size={16} /> Log Out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <div className="flex items-center gap-3 mr-1">
            <button onClick={() => navigate('/login')} className="hidden sm:block text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-brand-500 transition-colors">
              Log In
            </button>
            <button onClick={() => navigate('/login?mode=signup')} className="bg-brand-500 hover:bg-brand-600 active:scale-95 text-white px-4 py-1.5 rounded-xl text-sm font-semibold transition-all shadow-sm">
              Sign Up
            </button>
          </div>
        )}
        <button
          onClick={() => setDark(!dark)}
          className="p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-all duration-300"
          aria-label="Toggle dark mode"
        >
          {dark ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-gray-500" />}
        </button>
      </div>
    </header>
  );
};

export default Navbar;
