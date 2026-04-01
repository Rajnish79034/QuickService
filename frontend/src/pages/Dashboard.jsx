import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MapPin, Search, Zap, Scissors, Flame, Wrench, Sparkles, ChevronRight, Briefcase, Car, Paintbrush, ShieldCheck } from 'lucide-react';
import Navbar from '../components/Navbar';

const API_URL = 'https://quickservice-3o93.onrender.com';

// Dynamic icon mapping based on service name content
const getServiceIcon = (name, className) => {
  const s = name.toLowerCase();
  if (s.includes('electric') || s.includes('wire')) return <Zap size={28} className={className} />;
  if (s.includes('barber') || s.includes('salon') || s.includes('hair')) return <Scissors size={28} className={className} />;
  if (s.includes('gas') || s.includes('fire')) return <Flame size={28} className={className} />;
  if (s.includes('plumb') || s.includes('pipe')) return <Wrench size={28} className={className} />;
  if (s.includes('car') || s.includes('drive')) return <Car size={28} className={className} />;
  if (s.includes('clean') || s.includes('wash') || s.includes('paint')) return <Paintbrush size={28} className={className} />;
  return <Sparkles size={28} className={className} />;
};

const colorMap = {
  amber: { bg: 'bg-amber-50', text: 'text-amber-500', border: 'border-amber-100' },
  rose: { bg: 'bg-rose-50', text: 'text-rose-500', border: 'border-rose-100' },
  orange: { bg: 'bg-orange-50', text: 'text-orange-500', border: 'border-orange-100' },
  blue: { bg: 'bg-blue-50', text: 'text-blue-500', border: 'border-blue-100' },
};

const Dashboard = () => {
  const whatsOnYourMind = [
    { id: 'electrician', name: 'Electrician', icon: 'Zap', color: 'amber' },
    { id: 'barber', name: 'Barber', icon: 'Scissors', color: 'rose' },
    { id: 'gas-service', name: 'Gas Stove', icon: 'Flame', color: 'orange' },
    { id: 'plumber', name: 'Plumber', icon: 'Wrench', color: 'blue' },
    { id: 'car-wash', name: 'Car Wash', icon: 'Sparkles', color: 'blue' },
    { id: 'ac-repair', name: 'AC Repair', icon: 'Sparkles', color: 'blue' },
    { id: 'cleaning', name: 'Cleaning', icon: 'Sparkles', color: 'blue' },
  ];

  const [services, setServices] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) { navigate('/login'); return; }
    setUser(JSON.parse(storedUser));

    const fetchServices = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/services`);
        setServices(res.data);
      } catch {
        setServices([
          { id: 'electrician', name: 'Electrician', icon: 'Zap', color: 'amber' },
          { id: 'barber', name: 'Barber', icon: 'Scissors', color: 'rose' },
          { id: 'gas-service', name: 'Gas Service', icon: 'Flame', color: 'orange' },
          { id: 'plumber', name: 'Plumber', icon: 'Wrench', color: 'blue' },
        ]);
      } finally { setLoading(false); }
    };
    fetchServices();
  }, [navigate]);

  const filteredServices = services.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-300">
      <Navbar title="FixKaro" showLocation showSearch searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <main className="max-w-6xl mx-auto px-4 md:px-6 py-6">
        {/* Greeting */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white">
            Hello, {user?.name?.split(' ')[0] || 'there'} 👋
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">What service do you need today?</p>
        </div>

        {/* Mobile search */}
        <div className="flex gap-2 mb-8 md:hidden">
          <div className="flex-1 bg-white dark:bg-slate-900 rounded-2xl flex items-center px-4 py-3 shadow-md border border-gray-100 dark:border-slate-800">
            <Search size={20} className="text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search services or providers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-sm w-full font-medium text-gray-800 dark:text-gray-200 placeholder-gray-400"
            />
          </div>
          <button className="bg-white dark:bg-slate-900 rounded-2xl px-4 py-3 shadow-md border border-gray-100 dark:border-slate-800 text-brand-500 font-bold hover:bg-brand-50 transition flex items-center justify-center">
            <MapPin size={20} />
          </button>
        </div>

        {/* What's on your mind? (Swiggy circular icons) */}
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-5">What's on your mind?</h2>
        {loading ? (
          <div className="flex gap-8 mb-10 justify-center">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div className="skeleton w-20 h-20 rounded-full"></div>
                <div className="skeleton w-16 h-3 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-hide -mx-2 px-2 snap-x">
                {whatsOnYourMind.map((svc, idx) => {
                  const c = colorMap[svc.color] || colorMap.blue;
                  const IconElement = getServiceIcon(svc.name, c.text);
                  return (
                    <motion.div
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate(`/services/${svc.id}/providers`, { state: { serviceName: svc.name } })}
                      key={idx}
                      className="flex flex-col items-center gap-2 min-w-[72px] cursor-pointer snap-start group"
                    >
                      <div className={`w-16 h-16 rounded-full ${c.bg} flex items-center justify-center border ${c.border} group-hover:scale-105 transition-transform shadow-sm`}>
                        {IconElement}
                      </div>
                      <span className="text-[11px] font-semibold text-gray-700 text-center leading-tight max-w-[64px] group-hover:text-brand-600">
                        {svc.name}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
        )}

        {/* FixKaro Trust & Safety Banner (Unique Feature) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="my-8 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 dark:from-green-900/20 dark:to-emerald-900/10 dark:border-green-900/30 rounded-2xl p-4 flex items-center justify-between shadow-sm cursor-pointer group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white dark:bg-green-900/50 rounded-full flex items-center justify-center shadow-sm">
              <ShieldCheck size={24} className="text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-green-50 text-sm md:text-base flex items-center gap-1">
                FixKaro Guarantee <Sparkles size={14} className="text-green-500" />
              </h3>
              <p className="text-xs text-gray-600 dark:text-green-200/70 mt-0.5 max-w-[200px] md:max-w-none">
                Verified Professionals. 100% Quality Assured. ₹10k Damage Protection.
              </p>
            </div>
          </div>
          <ChevronRight size={20} className="text-green-400 group-hover:text-green-600 transition-colors hidden md:block" />
        </motion.div>

        {/* Service cards grid (Swiggy restaurant-card style) */}
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-5">Browse All Services</h2>
        {filteredServices.length === 0 && !loading ? (
          <div className="text-center py-10 bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800">
            <p className="text-gray-500 dark:text-gray-400">No services found for "{searchQuery}".</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(loading ? [...Array(4)] : filteredServices).map((service, index) =>
              loading ? (
                <div key={index} className="skeleton h-24 rounded-2xl"></div>
              ) : (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate(`/services/${service.id}/providers`, { state: { serviceName: service.name } })}
                  className={`bg-white dark:bg-slate-900 rounded-2xl p-4 border border-gray-100 dark:border-slate-800 shadow-sm cursor-pointer hover:shadow-md transition-all flex items-center justify-between group`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-xl ${colorMap[service.color]?.bg || 'bg-gray-50'} dark:bg-opacity-20 flex items-center justify-center border ${colorMap[service.color]?.border || 'border-gray-100'} dark:border-opacity-10 group-hover:scale-105 transition-transform`}>
                      {getServiceIcon(service.name, colorMap[service.color]?.text || 'text-gray-500')}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white text-base">{service.name}</h3>
                      <p className="text-xs text-gray-400 mt-0.5">3+ pros near you</p>
                    </div>
                    <ChevronRight size={16} className="text-gray-300 group-hover:text-brand-500 transition-colors" />
                  </div>
                </motion.div>
              )
            )}
          </div>
        )}

        {/* Promo Banner (Swiggy offer style) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-10 bg-brand-500 rounded-2xl p-6 md:p-8 text-white flex justify-between items-center shadow-lg relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-10 -mt-10 blur-xl"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles size={16} className="text-yellow-300" />
              <span className="text-yellow-200 text-xs font-bold uppercase tracking-wider">Limited Offer</span>
            </div>
            <h3 className="text-xl md:text-2xl font-extrabold">Flat 20% OFF</h3>
            <p className="text-brand-100 text-sm">on your first booking</p>
          </div>
          <div className="relative z-10 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/30 font-mono font-bold tracking-widest">
            FIRST20
          </div>
        </motion.div>
      </main>
    </motion.div>
  );
};

export default Dashboard;
