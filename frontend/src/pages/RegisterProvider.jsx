import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Upload, Camera, ChevronDown, ArrowRight, X } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';

const API_URL = 'https://quickservice-3o93.onrender.com';

const SERVICE_OPTIONS = [
  'Electrician', 'Barber', 'Plumber', 'Gas Service',
  'Car Driver', 'Carpenter', 'Painter', 'AC Repair',
  'Pest Control', 'Custom'
];

const RegisterProvider = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [form, setForm] = useState({
    name: '', phone: '', email: '', service: '', customService: '',
    price: '', distance: '', description: '', image: ''
  });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be under 5MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result);
      setForm(prev => ({ ...prev, image: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const service = form.service === 'Custom' ? form.customService.trim() : form.service;
    if (!form.name || !form.phone || !service) {
      toast.error('Name, phone, and service type are required');
      return;
    }
    setLoading(true);
    try {
      const payload = { ...form, service };
      const res = await axios.post(`${API_URL}/api/register-provider`, payload);
      toast.success(res.data.message || 'Registered successfully!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all placeholder-gray-400";

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors">
      <Navbar showBack onBack={() => navigate(-1)} title="Become a Provider" />

      <main className="max-w-lg mx-auto px-4 py-8">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 p-6 shadow-sm">
          <h2 className="text-xl font-extrabold text-gray-900 dark:text-white mb-1">Register as Provider</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">List your services and start getting bookings!</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Profile Photo */}
            <div className="flex flex-col items-center mb-2">
              <div className="relative group">
                <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-slate-800 border-2 border-dashed border-gray-300 dark:border-slate-600 flex items-center justify-center overflow-hidden">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <Camera size={28} className="text-gray-400" />
                  )}
                </div>
                <label className="absolute bottom-0 right-0 w-8 h-8 bg-brand-500 text-white rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:bg-brand-600 transition-colors">
                  <Upload size={14} />
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
                {imagePreview && (
                  <button type="button" onClick={() => { setImagePreview(null); setForm(prev => ({ ...prev, image: '' })); }} className="absolute top-0 right-0 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center">
                    <X size={12} />
                  </button>
                )}
              </div>
              <p className="text-xs text-gray-400 mt-2">Upload photo or we'll generate one for you ✨</p>
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Full Name *</label>
              <input type="text" placeholder="Your full name" required className={inputClass} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Phone Number *</label>
              <input type="tel" placeholder="+91 9876543210" required className={inputClass} value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
              <input type="email" placeholder="you@example.com" className={inputClass} value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>

            {/* Service Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Service Type *</label>
              <div className="relative">
                <select required className={`${inputClass} appearance-none cursor-pointer`} value={form.service} onChange={e => setForm({ ...form, service: e.target.value })}>
                  <option value="">Select your profession</option>
                  {SERVICE_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Custom Service */}
            {form.service === 'Custom' && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Custom Service Name *</label>
                <input type="text" placeholder="e.g. Tailor, Tutor, Chef..." required className={inputClass} value={form.customService} onChange={e => setForm({ ...form, customService: e.target.value })} />
              </motion.div>
            )}

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Pricing</label>
              <input type="text" placeholder="e.g. ₹300/hr or ₹500/visit" className={inputClass} value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">About Your Service</label>
              <textarea placeholder="Describe your experience, specializations..." rows={3} className={`${inputClass} resize-none`} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading}
              className="w-full bg-brand-500 hover:bg-brand-600 active:scale-[0.98] transition-all text-white font-semibold rounded-xl flex justify-center items-center gap-2 py-3.5 text-sm mt-2 shadow-lg shadow-brand-500/30 disabled:opacity-50">
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Register Now <ArrowRight size={16} /></>
              )}
            </button>
          </form>
        </motion.div>
      </main>
    </motion.div>
  );
};

export default RegisterProvider;
