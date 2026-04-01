import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Calendar, Clock, CheckCircle2, Star, MapPin, Edit3, Zap, Video, Shield } from 'lucide-react';
import Navbar from '../components/Navbar';

const API_URL = 'https://quickservice-3o93.onrender.com';
const timeSlots = ['09:00 AM', '10:30 AM', '12:00 PM', '02:00 PM', '04:30 PM', '06:00 PM'];

// Convert "02:30 PM" -> minutes since midnight (870)
const toMinutes = (slot) => {
  const [time, period] = slot.split(' ');
  let [h, m] = time.split(':').map(Number);
  if (period === 'PM' && h !== 12) h += 12;
  if (period === 'AM' && h === 12) h = 0;
  return h * 60 + m;
};

const Booking = () => {
  const { providerId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const provider = location.state?.provider;

  const [selectedDate, setSelectedDate] = useState('Today');
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [customTime, setCustomTime] = useState('');
  const [showCustom, setShowCustom] = useState(false);
  const [loading, setLoading] = useState(false);
  const [bookingType, setBookingType] = useState('Scheduled'); // Scheduled, Instant, Emergency
  const [isPlusMember, setIsPlusMember] = useState(false);
  const [addVideoConsult, setAddVideoConsult] = useState(false);

  // Filter out past time slots if "Today" is selected
  const availableSlots = useMemo(() => {
    if (selectedDate !== 'Today') return timeSlots;
    const now = new Date();
    const nowMinutes = now.getHours() * 60 + now.getMinutes();
    return timeSlots.filter(slot => toMinutes(slot) > nowMinutes);
  }, [selectedDate]);

  // When switching date, clear slot if it's no longer available
  const handleDateChange = (d) => {
    setSelectedDate(d);
    setSelectedSlot(null);
    setCustomTime('');
    setShowCustom(false);
  };

  // Format 24h "HH:MM" to "hh:mm AM/PM"
  const formatCustomTime = (t) => {
    if (!t) return '';
    let [h, m] = t.split(':').map(Number);
    const period = h >= 12 ? 'PM' : 'AM';
    if (h === 0) h = 12;
    else if (h > 12) h -= 12;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')} ${period}`;
  };

  const handleCustomTimeConfirm = () => {
    if (!customTime) return;
    const formatted = formatCustomTime(customTime);
    // Validate if today: must be in the future
    if (selectedDate === 'Today') {
      const now = new Date();
      const nowMinutes = now.getHours() * 60 + now.getMinutes();
      if (toMinutes(formatted) <= nowMinutes) {
        alert('Please select a time in the future.');
        return;
      }
    }
    setSelectedSlot(formatted);
    setShowCustom(false);
  };

  // Get min time for the time input (only for Today)
  const getMinTime = () => {
    if (selectedDate !== 'Today') return undefined;
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    return `${h}:${m}`;
  };

  if (!provider) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors">
        <Navbar showBack onBack={() => navigate(-1)} title="Booking" />
        <div className="flex items-center justify-center h-[70vh] text-gray-400 dark:text-gray-500">
          Provider not found. Please go back.
        </div>
      </div>
    );
  }

  const handleBook = async () => {
    if (!selectedSlot) return;
    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      await axios.post(`${API_URL}/api/book`, {
        user_id: user.id || 'guest',
        provider_id: providerId,
        date: selectedDate,
        time_slot: selectedSlot,
        booking_type: bookingType,
        is_plus_member: isPlusMember,
        video_consult: addVideoConsult,
      });
    } catch { /* Graceful fallback for demo */ }
    navigate('/confirmation', { state: { provider, date: selectedDate, timeSlot: selectedSlot, bookingType } });
    setLoading(false);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen bg-gray-50 dark:bg-slate-950 pb-32 transition-colors duration-300">
      <Navbar showBack onBack={() => navigate(-1)} title="Confirm Booking" />

      <main className="max-w-lg mx-auto px-4 md:px-6 py-6 space-y-4">
        {/* Provider summary */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-gray-100 dark:border-slate-800 flex items-center gap-4">
          <img src={provider.image} alt={provider.name} className="w-14 h-14 rounded-xl object-cover" />
          <div className="flex-1">
            <h2 className="font-bold text-gray-900 dark:text-white">{provider.name}</h2>
            <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
              <span className="flex items-center gap-0.5"><Star size={11} className="text-yellow-500 fill-yellow-500" /> {provider.rating}</span>
              <span>•</span>
              <span className="flex items-center gap-0.5"><MapPin size={11} /> {provider.distance}</span>
            </div>
          </div>
          <span className="font-bold text-brand-500">{provider.price}</span>
        </div>

        {/* Date */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-gray-100 dark:border-slate-800">
          <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2 text-sm">
            <Calendar size={16} className="text-brand-500" /> Select Date
          </h3>
          <div className="flex gap-3">
            {['Today', 'Tomorrow'].map(d => (
              <button
                key={d}
                onClick={() => handleDateChange(d)}
                className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all ${
                  selectedDate === d
                    ? 'bg-brand-500 text-white shadow-sm'
                    : 'bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-700'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Booking Type */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-gray-100 dark:border-slate-800">
           <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2 text-sm">
             <Zap size={16} className="text-orange-500" /> Booking Type
           </h3>
           <div className="flex flex-col gap-2">
              <button onClick={() => setBookingType('Scheduled')} className={`p-3 rounded-xl border flex justify-between items-center text-sm font-semibold transition-all ${bookingType === 'Scheduled' ? 'border-brand-500 bg-brand-50 text-brand-600' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                 <span>📅 Scheduled (Standard)</span>
                 <span>No extra charge</span>
              </button>
              <button onClick={() => { setBookingType('Instant'); setSelectedDate('Today'); }} className={`p-3 rounded-xl border flex justify-between items-center text-sm font-semibold transition-all ${bookingType === 'Instant' ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                 <span>⚡ Instant Booking (ASAP)</span>
                 <span>+ ₹100</span>
              </button>
              <button onClick={() => { setBookingType('Emergency'); setSelectedDate('Today'); }} className={`p-3 rounded-xl border flex justify-between items-center text-sm font-semibold transition-all ${bookingType === 'Emergency' ? 'border-red-500 bg-red-50 text-red-600' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                 <span>🚨 Emergency Requirement</span>
                 <span>+ ₹250</span>
              </button>
           </div>
        </div>

        {/* Time */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-gray-100 dark:border-slate-800">
          <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2 text-sm">
            <Clock size={16} className="text-brand-500" /> Select Time
          </h3>

          {availableSlots.length > 0 ? (
            <div className="grid grid-cols-3 gap-2">
              {availableSlots.map(slot => (
                <motion.button
                  key={slot}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => { setSelectedSlot(slot); setShowCustom(false); }}
                  className={`py-3 rounded-xl text-xs font-semibold transition-all ${
                    selectedSlot === slot && !showCustom
                      ? 'bg-brand-500 text-white shadow-sm'
                      : 'bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-700'
                  }`}
                >
                  {slot}
                </motion.button>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-4">
              No preset slots available for today. Use custom time below ↓
            </p>
          )}

          {/* Custom time picker */}
          <div className="mt-3 border-t border-gray-100 dark:border-slate-700 pt-3">
            {!showCustom ? (
              <button
                onClick={() => { setShowCustom(true); setSelectedSlot(null); }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold text-brand-500 bg-brand-50 dark:bg-brand-900/20 hover:bg-brand-100 dark:hover:bg-brand-900/30 transition-colors border border-brand-200 dark:border-brand-800"
              >
                <Edit3 size={14} /> Choose Custom Time
              </button>
            ) : (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2">
                <input
                  type="time"
                  value={customTime}
                  min={getMinTime()}
                  onChange={e => setCustomTime(e.target.value)}
                  className="flex-1 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-500"
                />
                <button
                  onClick={handleCustomTimeConfirm}
                  disabled={!customTime}
                  className="px-4 py-2.5 bg-brand-500 text-white rounded-xl text-sm font-semibold hover:bg-brand-600 disabled:opacity-40 transition-all"
                >
                  Set
                </button>
                <button
                  onClick={() => { setShowCustom(false); setCustomTime(''); }}
                  className="px-3 py-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-sm"
                >
                  ✕
                </button>
              </motion.div>
            )}
            {selectedSlot && !timeSlots.includes(selectedSlot) && (
              <p className="text-xs text-brand-500 font-medium mt-2 text-center">
                ✓ Custom time set: {selectedSlot}
              </p>
            )}
          </div>
        </div>

        {/* Video Consult Addon */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-gray-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex gap-3">
            <div className="w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center">
              <Video size={18} className="text-purple-500" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-sm">Pre-visit Video Consult</h3>
              <p className="text-xs text-gray-500 max-w-[200px]">10 min video call to diagnose the issue before arrival. Faster resolution.</p>
              <span className="text-xs font-bold text-purple-600 mt-1 block">+ ₹49</span>
            </div>
          </div>
          <button 
            onClick={() => setAddVideoConsult(!addVideoConsult)}
            className={`w-12 h-6 rounded-full transition-colors relative ${addVideoConsult ? 'bg-purple-500' : 'bg-gray-200'}`}
          >
            <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${addVideoConsult ? 'left-7' : 'left-1'}`} />
          </button>
        </div>

        {/* FixKaro Plus Subscription */}
        <div className="bg-gradient-to-r from-gray-900 to-slate-800 rounded-2xl p-5 border border-gray-800 flex items-center justify-between text-white shadow-lg">
          <div className="flex gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
              <Shield size={18} className="text-white" />
            </div>
            <div>
              <h3 className="font-bold text-yellow-400 text-sm">FixKaro Plus</h3>
              <p className="text-xs text-gray-300 max-w-[200px]">Get flat 15% off on this and all future bookings for 3 months.</p>
              <span className="text-xs font-bold text-white mt-1 block">₹199 / 3 months</span>
            </div>
          </div>
          <button 
            onClick={() => setIsPlusMember(!isPlusMember)}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${isPlusMember ? 'bg-green-500 text-white' : 'bg-white text-gray-900'}`}
          >
            {isPlusMember ? 'ADDED ✓' : 'ADD'}
          </button>
        </div>
      </main>

      {/* Sticky footer */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800 shadow-[0_-8px_30px_rgba(0,0,0,0.06)] z-30">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div>
            <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Total Payable</p>
            <p className="text-lg font-extrabold text-gray-900 dark:text-white">
              {provider.price} 
              {bookingType === 'Instant' ? ' + ₹100' : bookingType === 'Emergency' ? ' + ₹250' : ''}
              {addVideoConsult ? ' + ₹49' : ''}
              {isPlusMember ? ' + ₹199 (Plus)' : ''}
            </p>
            {isPlusMember && <p className="text-[10px] text-green-500 font-bold">- 15% Discount Applied!</p>}
          </div>
          <button
            disabled={!selectedSlot || loading}
            onClick={handleBook}
            className={`btn-primary px-6 py-3 flex items-center gap-2 text-sm ${
              (!selectedSlot || loading) ? 'opacity-40 cursor-not-allowed' : ''
            }`}
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>Confirm <CheckCircle2 size={16} /></>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default Booking;
