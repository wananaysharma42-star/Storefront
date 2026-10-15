import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { axiosInstance } from '../axiosCalls/axios';

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function Checkout() {
  const { cart, grandTotal, fetchCart } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    addressLine1: '',
    city: '',
    state: '',
    pincode: ''
  });

  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFormErrors({ ...formErrors, [e.target.name]: '' });
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.fullName.trim()) errors.fullName = 'Full Name is required';
    if (!formData.phone.trim() || !/^\d{10}$/.test(formData.phone.trim())) errors.phone = 'Valid 10-digit phone number required';
    if (!formData.addressLine1.trim()) errors.addressLine1 = 'Address is required';
    if (!formData.city.trim()) errors.city = 'City is required';
    if (!formData.state.trim()) errors.state = 'State is required';
    if (!formData.pincode.trim() || !/^\d{6}$/.test(formData.pincode.trim())) errors.pincode = 'Pincode must be 6 digits';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (cart.length === 0) {
      alert('Your cart is empty');
      navigate('/cart');
      return;
    }

    setLoading(true);
    try {
      const resLoaded = await loadRazorpayScript();
      if (!resLoaded) {
        alert('Razorpay SDK failed to load.');
        setLoading(false);
        return;
      }

      const response = await axiosInstance.post('/orders/create-payment-order', {
        shippingAddress: formData
      });

      if (!response.data.success) {
        alert(response.data.message || 'Failed to initialize checkout');
        setLoading(false);
        return;
      }

      const { shopKartOrderId, razorpayOrderId, amount, currency, key } = response.data;

      const options = {
        key: key,
        amount: amount,
        currency: currency,
        name: "ShopKart",
        description: "Complete your purchase",
        order_id: razorpayOrderId,
        handler: async function (paymentResponse) {
          try {
            const verifyRes = await axiosInstance.post('/orders/verify-payment', {
              shopKartOrderId,
              razorpay_order_id: paymentResponse.razorpay_order_id,
              razorpay_payment_id: paymentResponse.razorpay_payment_id,
              razorpay_signature: paymentResponse.razorpay_signature
            });

            if (verifyRes.data.success) {
              await fetchCart();
              navigate(`/order-success/${verifyRes.data.orderId}`);
            } else {
              alert('Payment verification failed');
            }
          } catch (err) {
            alert(err.response?.data?.message || 'Payment verification error');
          }
        },
        prefill: {
          name: formData.fullName,
          contact: formData.phone
        },
        theme: {
          color: "#0A3622"
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        alert(`Payment failed: ${response.error.description}`);
      });
      rzp.open();
    } catch (err) {
      alert(err.response?.data?.message || 'Checkout error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F8F4] text-[#0B0F0E]">
      <nav className="bg-white/80 backdrop-blur-md border-b border-[#E2E5DC] sticky top-0 z-50 px-8 py-4 flex justify-between items-center">
        <h1 
          onClick={() => navigate('/home')} 
          className="text-xl font-extrabold tracking-tight text-[#0A3622] cursor-pointer"
        >
          Storefront
        </h1>
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => navigate('/cart')}
            className="text-sm text-[#525B56] hover:text-[#0A3622] transition font-medium px-3 py-2"
          >
            Back to Cart
          </button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto py-10 px-6">
        <h1 className="text-3xl font-extrabold mb-8">Checkout</h1>

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white border border-[#E2E5DC] p-6 rounded-3xl shadow-sm space-y-4">
            <h2 className="text-xl font-bold mb-4">Shipping Details</h2>

            <div>
              <label className="text-xs font-bold text-[#525B56] block mb-1">Full Name</label>
              <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="w-full bg-[#F7F8F4] border border-[#E2E5DC] rounded-xl px-4 py-2.5 text-sm"/>
              {formErrors.fullName && <p className="text-xs text-rose-600 mt-1">{formErrors.fullName}</p>}
            </div>

            <div>
              <label className="text-xs font-bold text-[#525B56] block mb-1">Phone Number</label>
              <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-[#F7F8F4] border border-[#E2E5DC] rounded-xl px-4 py-2.5 text-sm"/>
              {formErrors.phone && <p className="text-xs text-rose-600 mt-1">{formErrors.phone}</p>}
            </div>

            <div>
              <label className="text-xs font-bold text-[#525B56] block mb-1">Address</label>
              <input type="text" name="addressLine1" value={formData.addressLine1} onChange={handleChange} className="w-full bg-[#F7F8F4] border border-[#E2E5DC] rounded-xl px-4 py-2.5 text-sm"/>
              {formErrors.addressLine1 && <p className="text-xs text-rose-600 mt-1">{formErrors.addressLine1}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-[#525B56] block mb-1">City</label>
                <input type="text" name="city" value={formData.city} onChange={handleChange} className="w-full bg-[#F7F8F4] border border-[#E2E5DC] rounded-xl px-4 py-2.5 text-sm"/>
                {formErrors.city && <p className="text-xs text-rose-600 mt-1">{formErrors.city}</p>}
              </div>
              <div>
                <label className="text-xs font-bold text-[#525B56] block mb-1">State</label>
                <input type="text" name="state" value={formData.state} onChange={handleChange} className="w-full bg-[#F7F8F4] border border-[#E2E5DC] rounded-xl px-4 py-2.5 text-sm"/>
                {formErrors.state && <p className="text-xs text-rose-600 mt-1">{formErrors.state}</p>}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-[#525B56] block mb-1">Pincode</label>
              <input type="text" name="pincode" value={formData.pincode} onChange={handleChange} className="w-full bg-[#F7F8F4] border border-[#E2E5DC] rounded-xl px-4 py-2.5 text-sm"/>
              {formErrors.pincode && <p className="text-xs text-rose-600 mt-1">{formErrors.pincode}</p>}
            </div>
          </div>

          <div className="bg-white border border-[#E2E5DC] p-6 rounded-3xl shadow-sm h-fit space-y-6">
            <h2 className="text-xl font-bold">Order Summary</h2>

            <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
              {cart.map(item => {
                const product = item.product;
                if (!product) return null;
                return (
                  <div key={product._id} className="flex justify-between items-center text-sm">
                    <span className="text-[#525B56] line-clamp-1">{product.name} × {item.quantity}</span>
                    <span className="font-bold">₹{(product.price * item.quantity).toLocaleString()}</span>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-[#E2E5DC] pt-4 flex justify-between items-center text-lg font-black">
              <span>Total Amount</span>
              <span className="text-[#0A3622]">₹{grandTotal.toLocaleString()}</span>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-3.5 bg-[#0A3622] hover:bg-[#124E31] text-white rounded-xl font-semibold transition shadow-md disabled:opacity-50 text-center"
            >
              {loading ? 'Processing...' : 'Pay with Razorpay'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}