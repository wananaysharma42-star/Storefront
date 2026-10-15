import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '../axiosCalls/axios';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Home() {
  const navigate = useNavigate();
  const [loading, setLoader] = useState(false);
  const { setCustomer } = useAuth();
  const { totalItemsCount } = useCart();

  const handleLogout = async () => {
    setLoader(true);
    try {
      await axiosInstance.post('/customers/logout');
      setCustomer(null);
      navigate('/');
    } catch (err) {
      console.log(err.response?.data?.message);
    } finally {
      setLoader(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F8F4] text-[#0B0F0E]">
      <nav className="bg-white/80 backdrop-blur-md border-b border-[#E2E5DC] px-8 py-4 flex justify-between items-center sticky top-0 z-50">
        <h1 
          onClick={() => navigate('/home')} 
          className="text-xl font-extrabold text-[#0A3622] tracking-tight cursor-pointer"
        >
          Storefront
        </h1>
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => navigate('/products')}
            className="text-sm text-[#525B56] hover:text-[#0A3622] transition font-medium px-3 py-2"
          >
            Products
          </button>
          <button 
            onClick={() => navigate('/wishlist')}
            className="text-sm text-[#525B56] hover:text-[#0A3622] transition font-medium px-3 py-2"
          >
            Wishlist
          </button>
          <button 
            onClick={() => navigate('/orders')}
            className="text-sm text-[#525B56] hover:text-[#0A3622] transition font-medium px-3 py-2"
          >
            Orders
          </button>
          <button 
            onClick={() => navigate('/cart')}
            className="text-sm text-[#525B56] hover:text-[#0A3622] transition font-medium px-3 py-2 flex items-center gap-1.5"
          >
            <span>Cart</span>
            <span className="bg-[#0A3622] text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {totalItemsCount}
            </span>
          </button>
          <button 
            onClick={handleLogout}
            disabled={loading}
            className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-sm font-semibold rounded-xl transition"
          >
            {loading ? 'Logging out...' : 'Logout'}
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-8 py-12">
        <div className="mb-10">
          <h2 className="text-3xl font-extrabold text-[#0B0F0E] tracking-tight">Dashboard Overview</h2>
          <p className="text-[#525B56] text-sm mt-1">Manage your storefront catalogs and browse high-grade selections.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white border border-[#E2E5DC] p-6 rounded-3xl shadow-sm">
            <h3 className="text-[#525B56] text-xs font-bold uppercase tracking-wider">Categories Available</h3>
            <p className="text-4xl font-extrabold text-[#0A3622] mt-3">4</p>
          </div>
          <div className="bg-white border border-[#E2E5DC] p-6 rounded-3xl shadow-sm">
            <h3 className="text-[#525B56] text-xs font-bold uppercase tracking-wider">Quality Assurance</h3>
            <p className="text-4xl font-extrabold text-[#0A3622] mt-3">100%</p>
          </div>
          <div className="bg-white border border-[#E2E5DC] p-6 rounded-3xl shadow-sm">
            <h3 className="text-[#525B56] text-xs font-bold uppercase tracking-wider">Customer Support</h3>
            <p className="text-4xl font-extrabold text-[#0A3622] mt-3">24/7</p>
          </div>
        </div>

        <div className="bg-[#0A3622] text-white p-12 rounded-3xl text-center py-16 shadow-lg">
          <h3 className="text-2xl font-bold mb-3">Ready to explore our curated inventory?</h3>
          <p className="text-[#A3B8AD] max-w-md mx-auto mb-8 text-sm leading-relaxed">Discover top-tier electronic items, garments, utensils, and furniture built for professional standards.</p>
          <button 
            onClick={() => navigate('/products')}
            className="px-8 py-3.5 bg-white text-[#0A3622] hover:bg-[#F7F8F4] font-semibold rounded-2xl shadow transition"
          >
            Browse Catalog
          </button>
        </div>
      </main>
    </div>
  );
}