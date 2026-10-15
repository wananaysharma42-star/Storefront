import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { axiosInstance } from '../axiosCalls/axios';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get('/orders');
        if (res.data.success) {
          setOrders(res.data.orders);
        } else {
          setError(true);
        }
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) {
    return <div className="min-h-screen bg-[#F7F8F4] flex items-center justify-center text-[#0A3622] font-medium">Loading orders...</div>;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F7F8F4] flex flex-col items-center justify-center p-6 text-center">
        <p className="text-red-600 font-semibold mb-4">Unable to load orders.</p>
        <button onClick={() => window.location.reload()} className="px-5 py-2 bg-[#0A3622] text-white rounded-xl text-sm font-semibold">Try Again</button>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-[#F7F8F4] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-white border border-[#E2E5DC] rounded-3xl flex items-center justify-center text-3xl mb-6 shadow-sm">📦</div>
        <h2 className="text-2xl font-extrabold mb-2">You have not placed any orders yet.</h2>
        <p className="text-[#525B56] text-sm mb-8">Start shopping to see your purchase history here.</p>
        <Link to="/products" className="px-6 py-3 bg-[#0A3622] text-white rounded-xl text-sm font-semibold shadow-md">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F8F4] text-[#0B0F0E]">
      <nav className="bg-white/85 backdrop-blur-md border-b border-[#E2E5DC] sticky top-0 z-50 px-8 py-4 flex justify-between items-center">
        <h1 onClick={() => navigate('/home')} className="text-xl font-extrabold text-[#0A3622] cursor-pointer">Storefront</h1>
        <div className="flex space-x-4">
          <button onClick={() => navigate('/products')} className="text-sm text-[#525B56] hover:text-[#0A3622] font-medium px-3 py-2">Products</button>
          <button onClick={() => navigate('/cart')} className="text-sm text-[#525B56] hover:text-[#0A3622] font-medium px-3 py-2">Cart</button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-extrabold mb-8">My Orders</h1>

        <div className="space-y-6">
          {orders.map(order => (
            <div key={order._id} className="bg-white border border-[#E2E5DC] rounded-3xl p-6 shadow-sm space-y-4">
              <div className="flex justify-between items-start border-b border-[#E2E5DC] pb-4">
                <div>
                  <span className="text-xs font-mono text-[#525B56]">Order ID: {order._id}</span>
                  <p className="text-xs text-[#525B56] mt-1">{new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}</p>
                </div>
                <span className="text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full uppercase">
                  {order.status}
                </span>
              </div>

              <div className="space-y-2">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-sm">
                    <span className="text-[#525B56]">{item.name} × {item.quantity}</span>
                    <span className="font-bold">₹{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center border-t border-[#E2E5DC] pt-4">
                <span className="text-sm font-bold text-[#525B56]">Total Amount</span>
                <span className="text-lg font-black text-[#0A3622]">₹{order.totalAmount.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}