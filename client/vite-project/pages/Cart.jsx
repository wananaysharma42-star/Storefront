import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { cart, loading, error, fetchCart, updateQuantity, removeFromCart, grandTotal } = useCart();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F8F4] flex items-center justify-center text-[#0A3622] font-medium">
        Loading your cart...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F7F8F4] flex flex-col items-center justify-center p-6 text-center">
        <p className="text-red-600 text-lg font-semibold mb-2">Unable to load your cart.</p>
        <button 
          onClick={fetchCart} 
          className="px-5 py-2.5 bg-[#0A3622] hover:bg-[#124E31] text-white rounded-xl font-semibold transition shadow-md text-sm"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#F7F8F4] text-[#0B0F0E] flex flex-col items-center justify-center p-6">
        <div className="w-20 h-20 bg-white border border-[#E2E5DC] rounded-3xl flex items-center justify-center text-3xl mb-6 shadow-sm">
          🛒
        </div>
        <h2 className="text-2xl font-extrabold text-[#0B0F0E] mb-2">Your cart is empty</h2>
        <p className="text-[#525B56] text-sm mb-8 text-center max-w-sm">Looks like you haven't added anything yet.</p>
        <Link 
          to="/products" 
          className="px-6 py-3 bg-[#0A3622] hover:bg-[#124E31] text-white rounded-xl text-sm font-semibold transition shadow-md"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F8F4] text-[#0B0F0E]">
      <nav className="bg-white/80 backdrop-blur-md border-b border-[#E2E5DC] sticky top-0 z-50 px-8 py-4 flex justify-between items-center">
        <h1 onClick={() => navigate('/home')} className="text-xl font-extrabold tracking-tight text-[#0A3622] cursor-pointer">
          Storefront
        </h1>
        <div className="flex items-center space-x-4">
          <button onClick={() => navigate('/products')} className="text-sm text-[#525B56] hover:text-[#0A3622] transition font-medium px-3 py-2">
            Products
          </button>
          <button onClick={() => navigate('/wishlist')} className="text-sm text-[#525B56] hover:text-[#0A3622] transition font-medium px-3 py-2">
            Wishlist
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-8 py-10">
        <h1 className="text-3xl font-extrabold tracking-tight text-[#0B0F0E] mb-8">My Cart</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map(item => {
              const product = item.product;
              if (!product) return null;
              const itemSubtotal = product.price * item.quantity;

              return (
                <div key={product._id} className="bg-white border border-[#E2E5DC] rounded-3xl p-5 flex items-center justify-between shadow-sm">
                  <div className="flex items-center space-x-4">
                    <img src={product.image} alt={product.name} className="w-20 h-20 object-cover rounded-2xl bg-[#F7F8F4] border border-[#E2E5DC]" />
                    <div>
                      <h3 className="font-bold text-[#0B0F0E] text-base">{product.name}</h3>
                      <p className="text-sm font-extrabold text-[#0B0F0E] mt-1">₹{product.price.toLocaleString()}</p>
                      
                      <div className="flex items-center space-x-3 mt-3">
                        <div className="flex items-center space-x-2 bg-[#F7F8F4] border border-[#E2E5DC] px-2 py-1 rounded-lg">
                          <button 
                            onClick={() => updateQuantity(product._id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="w-5 h-5 bg-white text-xs rounded flex items-center justify-center font-bold border disabled:opacity-30"
                          >
                            -
                          </button>
                          <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => {
                              if (item.quantity + 1 > product.stock) {
                                alert(`Only ${product.stock} units available.`);
                                return;
                              }
                              updateQuantity(product._id, item.quantity + 1);
                            }}
                            className="w-5 h-5 bg-white text-xs rounded flex items-center justify-center font-bold border"
                          >
                            +
                          </button>
                        </div>
                        <button 
                          onClick={() => removeFromCart(product._id)}
                          className="text-xs font-semibold text-rose-600 hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-[#525B56] block">Subtotal</span>
                    <span className="text-base font-extrabold text-[#0A3622]">₹{itemSubtotal.toLocaleString()}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary Panel */}
          <div className="bg-white border border-[#E2E5DC] p-6 rounded-3xl h-fit shadow-sm">
            <h2 className="text-xl font-extrabold text-[#0B0F0E] mb-4">Order Summary</h2>
            <div className="flex justify-between text-sm text-[#525B56] mb-2">
              <span>Items</span>
              <span className="font-bold text-[#0B0F0E]">{cart.reduce((acc, i) => acc + i.quantity, 0)}</span>
            </div>
            <div className="flex justify-between text-base font-extrabold text-[#0B0F0E] border-t border-[#E2E5DC] pt-4 mb-6">
              <span>Subtotal</span>
              <span className="text-[#0A3622]">₹{grandTotal.toLocaleString()}</span>
            </div>
            <button 
              onClick={() => navigate('/checkout')} 
              className="w-full py-3 bg-[#0A3622] hover:bg-[#124E31] text-white rounded-xl font-semibold transition shadow-md text-sm text-center block"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}