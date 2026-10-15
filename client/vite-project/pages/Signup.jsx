import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { axiosInstance } from '../axiosCalls/axios';

export default function Signup() {
  const [formData, setFormData] = useState({ name: '', uname: '', email: '', password: '' });
  const navigate = useNavigate();
  const [loading, setLoader] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoader(true);
    setError('');
    setSuccess('');

    try {
      await axiosInstance.post('/customers/register', formData);
      setSuccess('Account created successfully! Redirecting...');
      setTimeout(() => navigate('/login'), 1200);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoader(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F8F4] text-[#0B0F0E] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-[#E2E5DC]">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-[#0A3622]">Create Account</h2>
          <p className="text-[#525B56] text-sm mt-2">Enter your customer details below</p>
        </div>

        {error && (
          <div className="mb-4 p-3.5 bg-rose-50 border border-rose-200 text-rose-600 text-sm rounded-xl text-center font-medium">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-xl text-center font-medium">
            {success}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#525B56] uppercase tracking-wider mb-1.5">Full Name</label>
            <input 
              type="text" 
              name="name" 
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe" 
              className="w-full px-4 py-3 bg-[#F7F8F4] border border-[#D1D5CB] rounded-xl focus:outline-none focus:border-[#0A3622] text-[#0B0F0E] text-sm transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#525B56] uppercase tracking-wider mb-1.5">Username</label>
            <input 
              type="text" 
              name="uname" 
              required
              value={formData.uname}
              onChange={handleChange}
              placeholder="johndoe123" 
              className="w-full px-4 py-3 bg-[#F7F8F4] border border-[#D1D5CB] rounded-xl focus:outline-none focus:border-[#0A3622] text-[#0B0F0E] text-sm transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#525B56] uppercase tracking-wider mb-1.5">Email Address</label>
            <input 
              type="email" 
              name="email" 
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com" 
              className="w-full px-4 py-3 bg-[#F7F8F4] border border-[#D1D5CB] rounded-xl focus:outline-none focus:border-[#0A3622] text-[#0B0F0E] text-sm transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#525B56] uppercase tracking-wider mb-1.5">Password</label>
            <input 
              type="password" 
              name="password" 
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••" 
              className="w-full px-4 py-3 bg-[#F7F8F4] border border-[#D1D5CB] rounded-xl focus:outline-none focus:border-[#0A3622] text-[#0B0F0E] text-sm transition"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3.5 bg-[#0A3622] hover:bg-[#124E31] disabled:opacity-50 font-semibold text-white rounded-xl shadow-md transition flex items-center justify-center space-x-2 text-sm mt-3"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
                <span>Creating Account...</span>
              </>
            ) : (
              <span>Sign Up</span>
            )}
          </button>
        </form>

        <p className="text-center text-[#525B56] text-sm mt-6">
          Already have an account? <Link to="/login" className="text-[#0A3622] font-semibold hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}