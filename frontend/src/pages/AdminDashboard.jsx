import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';
import { Users, Briefcase, IndianRupee, TrendingUp } from 'lucide-react';
import Navbar from '../components/Navbar';
import axios from 'axios';

const API_URL = 'https://quickservice-3o93.onrender.com';

const mockChartData = [
  { name: 'Mon', revenue: 4000, bookings: 24 },
  { name: 'Tue', revenue: 3000, bookings: 13 },
  { name: 'Wed', revenue: 2000, bookings: 98 },
  { name: 'Thu', revenue: 2780, bookings: 39 },
  { name: 'Fri', revenue: 1890, bookings: 48 },
  { name: 'Sat', revenue: 2390, bookings: 38 },
  { name: 'Sun', revenue: 3490, bookings: 43 },
];

const mockServiceData = [
  { name: 'Electrician', val: 40 },
  { name: 'Plumber', val: 30 },
  { name: 'Barber', val: 20 },
  { name: 'AC Repair', val: 10 },
];

const AdminDashboard = () => {
  const [stats, setStats] = useState({ total_bookings: 245, revenue: 125000, active_providers: 42, conversion: "18%" });

  useEffect(() => {
    // Optionally fetch real stats here
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Navbar />
      <div className="pt-24 px-6 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500 mt-1">Platform overview and business analytics.</p>
        </div>

        {/* Top KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="w-10 h-10 bg-orange-100 text-orange-500 rounded-lg flex items-center justify-center mb-4"><Briefcase size={20}/></div>
            <p className="text-gray-500 text-sm">Total Bookings</p>
            <h3 className="text-2xl font-bold">{stats.total_bookings}</h3>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="w-10 h-10 bg-green-100 text-green-500 rounded-lg flex items-center justify-center mb-4"><IndianRupee size={20}/></div>
            <p className="text-gray-500 text-sm">Total Revenue</p>
            <h3 className="text-2xl font-bold">₹{stats.revenue.toLocaleString()}</h3>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="w-10 h-10 bg-blue-100 text-blue-500 rounded-lg flex items-center justify-center mb-4"><Users size={20}/></div>
            <p className="text-gray-500 text-sm">Active Providers</p>
            <h3 className="text-2xl font-bold">{stats.active_providers}</h3>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="w-10 h-10 bg-purple-100 text-purple-500 rounded-lg flex items-center justify-center mb-4"><TrendingUp size={20}/></div>
            <p className="text-gray-500 text-sm">Conversion Rate</p>
            <h3 className="text-2xl font-bold">{stats.conversion}</h3>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-lg mb-6">Revenue Trend (Last 7 Days)</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockChartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB"/>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Line type="monotone" dataKey="revenue" stroke="#FC8019" strokeWidth={3} dot={{r:4}} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-lg mb-6">Top Performing Services</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockServiceData} layout="vertical" margin={{top: 0, right: 0, left: 30, bottom: 0}}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} />
                  <Tooltip cursor={{fill: 'transparent'}}/>
                  <Bar dataKey="val" fill="#FC8019" radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
