import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Star, Shield, Clock, Zap, Scissors, Flame, Wrench, MapPin } from 'lucide-react';
import Navbar from '../components/Navbar';

const services = [
  { id: 'electrician', icon: <Zap size={32} />, name: 'Electrician', bg: 'bg-amber-50', text: 'text-amber-500', border: 'border-amber-100' },
  { id: 'barber', icon: <Scissors size={32} />, name: 'Barber', bg: 'bg-rose-50', text: 'text-rose-500', border: 'border-rose-100' },
  { id: 'gas-service', icon: <Flame size={32} />, name: 'Gas Service', bg: 'bg-orange-50', text: 'text-orange-500', border: 'border-orange-100' },
  { id: 'plumber', icon: <Wrench size={32} />, name: 'Plumber', bg: 'bg-blue-50', text: 'text-blue-500', border: 'border-blue-100' },
];

const stats = [
  { value: '10K+', label: 'Happy Customers' },
  { value: '500+', label: 'Verified Pros' },
  { value: '4.8★', label: 'Average Rating' },
  { value: '<30 min', label: 'Avg. Arrival' },
];

const backgrounds = [
  '/bg-home-services.png',
  '/bg-electrician.png',
  '/bg-plumber.png',
  '/bg-barber.png'
];

const Landing = () => {
  const navigate = useNavigate();
  const [bgIndex, setBgIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % backgrounds.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300"
    >
      <Navbar />

      {/* ── Hero Banner (Dynamic Background Carousel) ─────────── */}
      <section className="relative overflow-hidden bg-gray-900 min-h-[500px]">
        <AnimatePresence mode="popLayout">
          <motion.div 
            key={bgIndex}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0 z-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${backgrounds[bgIndex]}')` }}
          />
        </AnimatePresence>
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 z-10 bg-slate-900/70 mix-blend-multiply backdrop-blur-[2px]"></div>
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-slate-950 via-slate-900/60 to-transparent"></div>
        <div className="absolute inset-0 z-10 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
        <div className="relative z-20 max-w-6xl mx-auto px-6 py-16 md:py-24 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 text-center md:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 bg-brand-500/10 border border-brand-500/20 rounded-full px-4 py-1.5 mb-6"
            >
              <MapPin size={14} className="text-brand-500" />
              <span className="text-brand-400 text-sm font-medium">Available in your city</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl md:text-6xl font-extrabold text-white leading-tight tracking-tight mb-5"
            >
              Home Services,
              <br />
              <span className="text-brand-500">Done Right.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-gray-400 text-lg md:text-xl mb-8 max-w-lg"
            >
              Electricians, plumbers, barbers & more — trusted professionals at your doorstep within 30 minutes.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center gap-4"
            >
              <Link to="/login?mode=signup" className="btn-primary text-lg px-8 py-4 inline-flex items-center gap-2 rounded-2xl">
                Get Started <ArrowRight size={20} />
              </Link>
              <Link to="/login" className="text-gray-400 hover:text-white font-medium transition-colors">
                Already a member? →
              </Link>
            </motion.div>
          </div>

          {/* Right: Service preview cards */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="hidden md:grid grid-cols-2 gap-4 flex-shrink-0"
          >
            {services.map((s, i) => (
              <motion.div
                key={s.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(`/services/${s.id}/providers`)}
                className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-5 flex flex-col items-center gap-2 w-36 hover:bg-white/15 transition-colors cursor-pointer"
              >
                <div className={`w-14 h-14 rounded-full ${s.bg} ${s.text} flex items-center justify-center`}>
                  {s.icon}
                </div>
                <span className="text-white text-sm font-medium">{s.name}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Stats Bar ────────────────────────────────────────── */}
      <section className="bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800 transition-colors">
        <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className="text-2xl md:text-3xl font-extrabold text-brand-500">{s.value}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── What's on your mind? (Swiggy circular icons) ──── */}
      <section className="max-w-6xl mx-auto px-6 py-14">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">What do you need help with?</h2>
        <div className="flex justify-center gap-8 md:gap-16 flex-wrap">
          {services.map((s, i) => (
            <motion.div
              key={s.name}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(`/services/${s.id}/providers`)}
              className="flex flex-col items-center gap-3 cursor-pointer"
            >
              <div className={`w-20 h-20 md:w-24 md:h-24 rounded-full ${s.bg} ${s.text} border-2 ${s.border} flex items-center justify-center shadow-sm hover:shadow-md transition-shadow`}>
                {s.icon}
              </div>
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{s.name}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Why FixKaro? ─────────────────────────────────────── */}
      <section className="bg-gray-50 dark:bg-slate-900/50 py-16 transition-colors">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-10 text-center">Why FixKaro?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: <Star className="text-yellow-500" size={24} />, title: 'Top Rated Professionals', desc: 'Every provider is rated 4.5+ by thousands of customers.' },
              { icon: <Shield className="text-brand-500" size={24} />, title: 'Verified & Trusted', desc: 'Background-checked and fully vetted before onboarding.' },
              { icon: <Clock className="text-green-500" size={24} />, title: 'Lightning Fast', desc: 'Professionals arrive at your doorstep in under 30 minutes.' },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-100 dark:border-slate-700 hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 rounded-xl bg-gray-50 dark:bg-slate-700 flex items-center justify-center mb-4">
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────── */}
      <footer className="bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800 py-8 text-center transition-colors">
        <div className="flex items-center justify-center gap-2 mb-2">
          <img src="/logo.png" alt="FixKaro" className="w-6 h-6" />
          <span className="font-bold text-gray-900 dark:text-white">FixKaro</span>
        </div>
        <p className="text-sm text-gray-400 dark:text-gray-500">© 2026 FixKaro — Home Services, Done Right.</p>
      </footer>
    </motion.div>
  );
};

export default Landing;
