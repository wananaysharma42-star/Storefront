import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function OrderSuccess() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F7F8F4] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-20 h-20 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-3xl flex items-center justify-center text-3xl mb-6 shadow-sm">
        ✅
      </div>
      <h2 className="text-3xl font-extrabold text-[#0B0F0E] mb-2">Order Placed Successfully!</h2>
      <p className="text-[#525B56] text-sm mb-2">Your payment was verified and your order has been saved.</p>
      <p className="text-xs text-[#525B56] font-mono mb-8">Order ID: {id}</p>

      <div className="flex gap-4">
        <button 
          onClick={() => navigate('/orders')} 
          className="px-6 py-3 bg-[#0A3622] hover:bg-[#124E31] text-white rounded-xl text-sm font-semibold transition shadow-md"
        >
          View My Orders
        </button>
        <button 
          onClick={() => navigate('/products')} 
          className="px-6 py-3 bg-white hover:bg-[#F7F8F4] text-[#0A3622] border border-[#E2E5DC] rounded-xl text-sm font-semibold transition"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
}