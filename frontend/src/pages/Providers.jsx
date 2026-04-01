import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Star, MapPin, ChevronRight, Clock } from 'lucide-react';
import Navbar from '../components/Navbar';

const API_URL = 'https://quickservice-3o93.onrender.com';

const categoryImages = {
  electrician: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=150&h=150&fit=crop',
  barber: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=150&h=150&fit=crop',
  'gas-service': 'https://images.unsplash.com/photo-1589802829985-817e51171b92?w=150&h=150&fit=crop',
  plumber: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=150&h=150&fit=crop',
};

const gPhone = (seed) => '+91 ' + Math.floor(9000000000 + (seed * 1234567) % 999999999);

// Domain-specific fallback providers per service category
const fallbackProviders = {
  electrician: [
    { _id: 'e1', name: 'Ramesh Yadav', service: 'Electrician', rating: 4.8, price: '₹350/hr', distance: '1.8 km', reviews: 142, phone: gPhone(1), image: categoryImages.electrician },
    { _id: 'e2', name: 'Sunil Tiwari', service: 'Electrician', rating: 4.7, price: '₹300/hr', distance: '2.5 km', reviews: 98, phone: gPhone(2), image: categoryImages.electrician },
    { _id: 'e3', name: 'Vikram Singh', service: 'Electrician', rating: 4.9, price: '₹400/hr', distance: '0.8 km', reviews: 210, phone: gPhone(3), image: categoryImages.electrician },
    { _id: 'e4', name: 'Ajay Rawat', service: 'Electrician', rating: 4.5, price: '₹280/hr', distance: '3.2 km', reviews: 67, phone: gPhone(4), image: categoryImages.electrician },
    { _id: 'e5', name: 'Naveen Gupta', service: 'Electrician', rating: 4.6, price: '₹320/hr', distance: '1.5 km', reviews: 115, phone: gPhone(5), image: categoryImages.electrician },
    { _id: 'e6', name: 'Pankaj Sharma', service: 'Electrician', rating: 4.4, price: '₹260/hr', distance: '4.0 km', reviews: 45, phone: gPhone(6), image: categoryImages.electrician },
    { _id: 'e7', name: 'Mohit Verma', service: 'Electrician', rating: 4.8, price: '₹380/hr', distance: '1.0 km', reviews: 189, phone: gPhone(7), image: categoryImages.electrician },
    { _id: 'e8', name: 'Raju Prasad', service: 'Electrician', rating: 4.3, price: '₹250/hr', distance: '5.0 km', reviews: 34, phone: gPhone(8), image: categoryImages.electrician },
    { _id: 'e9', name: 'Kishan Lal', service: 'Electrician', rating: 4.7, price: '₹340/hr', distance: '2.0 km', reviews: 132, phone: gPhone(9), image: categoryImages.electrician },
    { _id: 'e10', name: 'Deepak Joshi', service: 'Electrician', rating: 4.9, price: '₹420/hr', distance: '0.5 km', reviews: 276, phone: gPhone(10), image: categoryImages.electrician },
  ],
  barber: [
    { _id: 'b1', name: 'Arjun Nair', service: 'Barber', rating: 4.9, price: '₹200/hr', distance: '0.5 km', reviews: 312, phone: gPhone(11), image: categoryImages.barber },
    { _id: 'b2', name: 'Farhan Sheikh', service: 'Barber', rating: 4.6, price: '₹180/hr', distance: '1.2 km', reviews: 87, phone: gPhone(12), image: categoryImages.barber },
    { _id: 'b3', name: 'Karan Kapoor', service: 'Barber', rating: 4.8, price: '₹250/hr', distance: '2.0 km', reviews: 156, phone: gPhone(13), image: categoryImages.barber },
    { _id: 'b4', name: 'Rohit Malhotra', service: 'Barber', rating: 4.7, price: '₹220/hr', distance: '0.8 km', reviews: 201, phone: gPhone(14), image: categoryImages.barber },
    { _id: 'b5', name: 'Sahil Khan', service: 'Barber', rating: 4.5, price: '₹170/hr', distance: '1.5 km', reviews: 65, phone: gPhone(15), image: categoryImages.barber },
    { _id: 'b6', name: 'Aman Bhatt', service: 'Barber', rating: 4.9, price: '₹280/hr', distance: '0.3 km', reviews: 345, phone: gPhone(16), image: categoryImages.barber },
    { _id: 'b7', name: 'Vikas Chauhan', service: 'Barber', rating: 4.4, price: '₹160/hr', distance: '2.5 km', reviews: 48, phone: gPhone(17), image: categoryImages.barber },
    { _id: 'b8', name: 'Imran Ali', service: 'Barber', rating: 4.8, price: '₹240/hr', distance: '1.0 km', reviews: 178, phone: gPhone(18), image: categoryImages.barber },
    { _id: 'b9', name: 'Nikhil Raj', service: 'Barber', rating: 4.6, price: '₹190/hr', distance: '1.8 km', reviews: 92, phone: gPhone(19), image: categoryImages.barber },
    { _id: 'b10', name: 'Prateek Soni', service: 'Barber', rating: 4.7, price: '₹210/hr', distance: '0.9 km', reviews: 134, phone: gPhone(20), image: categoryImages.barber },
  ],
  'gas-service': [
    { _id: 'g1', name: 'Manoj Pandey', service: 'Gas Service', rating: 4.7, price: '₹500/hr', distance: '3.0 km', reviews: 64, phone: gPhone(21), image: categoryImages['gas-service'] },
    { _id: 'g2', name: 'Ravi Shankar', service: 'Gas Service', rating: 4.5, price: '₹450/hr', distance: '1.5 km', reviews: 42, phone: gPhone(22), image: categoryImages['gas-service'] },
    { _id: 'g3', name: 'Amit Dubey', service: 'Gas Service', rating: 4.8, price: '₹550/hr', distance: '2.2 km', reviews: 91, phone: gPhone(23), image: categoryImages['gas-service'] },
    { _id: 'g4', name: 'Rajendra Pal', service: 'Gas Service', rating: 4.3, price: '₹400/hr', distance: '4.5 km', reviews: 28, phone: gPhone(24), image: categoryImages['gas-service'] },
    { _id: 'g5', name: 'Santosh Kumar', service: 'Gas Service', rating: 4.6, price: '₹480/hr', distance: '1.8 km', reviews: 76, phone: gPhone(25), image: categoryImages['gas-service'] },
    { _id: 'g6', name: 'Bhupender Singh', service: 'Gas Service', rating: 4.4, price: '₹420/hr', distance: '3.5 km', reviews: 39, phone: gPhone(26), image: categoryImages['gas-service'] },
    { _id: 'g7', name: 'Gopal Das', service: 'Gas Service', rating: 4.9, price: '₹580/hr', distance: '0.9 km', reviews: 124, phone: gPhone(27), image: categoryImages['gas-service'] },
    { _id: 'g8', name: 'Harish Chandra', service: 'Gas Service', rating: 4.2, price: '₹380/hr', distance: '5.0 km', reviews: 19, phone: gPhone(28), image: categoryImages['gas-service'] },
    { _id: 'g9', name: 'Mukesh Yadav', service: 'Gas Service', rating: 4.7, price: '₹520/hr', distance: '2.0 km', reviews: 87, phone: gPhone(29), image: categoryImages['gas-service'] },
    { _id: 'g10', name: 'Anil Thakur', service: 'Gas Service', rating: 4.5, price: '₹460/hr', distance: '1.2 km', reviews: 58, phone: gPhone(30), image: categoryImages['gas-service'] },
  ],
  plumber: [
    { _id: 'p1', name: 'Sanjay Mishra', service: 'Plumber', rating: 4.6, price: '₹400/hr', distance: '1.0 km', reviews: 178, phone: gPhone(31), image: categoryImages.plumber },
    { _id: 'p2', name: 'Prakash Jha', service: 'Plumber', rating: 4.9, price: '₹450/hr', distance: '0.6 km', reviews: 234, phone: gPhone(32), image: categoryImages.plumber },
    { _id: 'p3', name: 'Dinesh Kumar', service: 'Plumber', rating: 4.4, price: '₹350/hr', distance: '3.5 km', reviews: 55, phone: gPhone(33), image: categoryImages.plumber },
    { _id: 'p4', name: 'Rajesh Patel', service: 'Plumber', rating: 4.7, price: '₹420/hr', distance: '1.2 km', reviews: 145, phone: gPhone(34), image: categoryImages.plumber },
    { _id: 'p5', name: 'Suresh Babu', service: 'Plumber', rating: 4.5, price: '₹380/hr', distance: '2.0 km', reviews: 89, phone: gPhone(35), image: categoryImages.plumber },
    { _id: 'p6', name: 'Narayan Das', service: 'Plumber', rating: 4.8, price: '₹440/hr', distance: '0.4 km', reviews: 198, phone: gPhone(36), image: categoryImages.plumber },
    { _id: 'p7', name: 'Govind Prasad', service: 'Plumber', rating: 4.3, price: '₹300/hr', distance: '4.0 km', reviews: 32, phone: gPhone(37), image: categoryImages.plumber },
    { _id: 'p8', name: 'Bhola Nath', service: 'Plumber', rating: 4.6, price: '₹370/hr', distance: '1.5 km', reviews: 110, phone: gPhone(38), image: categoryImages.plumber },
    { _id: 'p9', name: 'Mahendra Singh', service: 'Plumber', rating: 4.7, price: '₹410/hr', distance: '0.7 km', reviews: 167, phone: gPhone(39), image: categoryImages.plumber },
    { _id: 'p10', name: 'Ashok Thakur', service: 'Plumber', rating: 4.5, price: '₹360/hr', distance: '2.8 km', reviews: 73, phone: gPhone(40), image: categoryImages.plumber },
  ],
};

const Providers = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);

  const serviceName = id
    ? id.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
    : 'Service';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/providers?service=${serviceName}`);
        setProviders(res.data);
      } catch {
        // Use domain-specific fallback providers
        setProviders(fallbackProviders[id] || fallbackProviders.electrician);
      } finally { setLoading(false); }
    };
    fetchData();
  }, [id, serviceName]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-300">
      <Navbar showBack onBack={() => navigate(-1)} title={serviceName} />

      <main className="max-w-3xl mx-auto px-4 md:px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{serviceName} near you</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              {loading ? 'Finding...' : `${providers.length} providers available`}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {loading ? (
            [...Array(3)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-slate-900 p-4 rounded-2xl flex gap-4 border border-gray-100 dark:border-slate-800">
                <div className="skeleton w-24 h-24 rounded-xl flex-shrink-0"></div>
                <div className="flex-1 space-y-3 py-1">
                  <div className="skeleton h-4 w-2/3 rounded"></div>
                  <div className="skeleton h-3 w-1/2 rounded"></div>
                  <div className="skeleton h-3 w-1/3 rounded"></div>
                </div>
              </div>
            ))
          ) : providers.length === 0 ? (
            <div className="text-center py-20 text-gray-400 dark:text-gray-500 text-lg">No providers found.</div>
          ) : (
            providers.map((provider, index) => (
              <motion.div
                key={provider._id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.07 }}
                onClick={() => navigate(`/book/${provider._id}`, { state: { provider } })}
                className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-gray-100 dark:border-slate-800 hover:shadow-md cursor-pointer transition-all flex gap-4 group"
              >
                <div className="relative flex-shrink-0">
                  <img
                    src={provider.image}
                    alt={provider.name}
                    className="w-24 h-24 rounded-xl object-cover bg-gray-100"
                  />
                  {/* Discount overlay like Swiggy */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent rounded-b-xl px-2 py-1.5">
                    <span className="text-white text-[10px] font-extrabold uppercase tracking-wide">20% OFF</span>
                  </div>
                </div>
                <div className="flex-1 min-w-0 py-0.5">
                  <div className="flex items-start justify-between">
                    <h3 className="font-bold text-gray-900 dark:text-white truncate">{provider.name}</h3>
                    <div className="flex items-center gap-1 bg-green-600 text-white px-1.5 py-0.5 rounded text-xs font-bold shrink-0 ml-2">
                      {provider.rating} <Star size={10} className="fill-current" />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{provider.service}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-400 mt-2">
                    <span className="flex items-center gap-1"><MapPin size={12} /> {provider.distance}</span>
                    <span className="flex items-center gap-1"><Clock size={12} /> ~30 min</span>
                    {provider.reviews && <span>• {provider.reviews} reviews</span>}
                  </div>
                  <div className="mt-2.5 flex items-center justify-between">
                    <span className="font-bold text-gray-900 dark:text-white">{provider.price}</span>
                    <span className="text-brand-500 text-xs font-semibold flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                      Book Now <ChevronRight size={14} />
                    </span>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </main>
    </motion.div>
  );
};

export default Providers;
