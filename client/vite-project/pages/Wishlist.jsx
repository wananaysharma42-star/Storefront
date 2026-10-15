import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { axiosInstance } from '../axiosCalls/axios';

export default function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const loadWishlist = async () => {
    setLoading(true);
    setError(false);
    try {
      const response = await axiosInstance.get('/wishlist');
      if (response.data.success) {
        setWishlist(response.data.wishlist);
      } else {
        setError(true);
      }
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWishlist();
  }, []);

  const handleRemove = async (productId) => {
    try {
      const response = await axiosInstance.delete(`/wishlist/${productId}`);
      if (response.data.success) {
        setWishlist(prev => prev.filter(item => (item.product?._id || item._id || item) !== productId));
      }
    } catch (err) {
      console.error('Failed to remove item', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F8F4] flex items-center justify-center text-[#0A3622] font-medium">
        Loading your wishlist...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F7F8F4] flex flex-col items-center justify-center p-6 text-center">
        <p className="text-red-600 text-lg font-semibold mb-2">Something went wrong.</p>
        <p className="text-[#525B56] text-sm mb-6">We couldn't load your wishlist right now.</p>
        <button 
          onClick={loadWishlist} 
          className="px-5 py-2.5 bg-[#0A3622] hover:bg-[#124E31] text-white rounded-xl font-semibold transition shadow-md text-sm"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen bg-[#F7F8F4] text-[#0B0F0E] flex flex-col items-center justify-center p-6">
        <div className="w-20 h-20 bg-white border border-[#E2E5DC] rounded-3xl flex items-center justify-center text-3xl mb-6 shadow-sm">
          ❤️
        </div>
        <h2 className="text-2xl font-extrabold text-[#0B0F0E] mb-2">Your wishlist is empty</h2>
        <p className="text-[#525B56] text-sm mb-8 text-center max-w-sm">Save products you love while browsing and find them conveniently right here later.</p>
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
        <h1 
          onClick={() => navigate('/home')} 
          className="text-xl font-extrabold tracking-tight text-[#0A3622] cursor-pointer"
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
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-8 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-[#0B0F0E]">My Wishlist</h1>
          <p className="text-[#525B56] text-sm mt-1">{wishlist.length} products saved for later</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlist.map(item => {
            const product = item.product || item;
            if (!product || !product._id) return null;

            return (
              <div 
                key={product._id} 
                className="bg-white border border-[#E2E5DC] rounded-3xl p-5 flex flex-col justify-between hover:border-[#0A3622]/40 transition duration-300 shadow-sm group"
              >
                <div>
                  <div className="relative overflow-hidden rounded-2xl mb-4 bg-[#F7F8F4] aspect-square border border-[#E2E5DC]">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-[#0A3622] text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border border-[#E2E5DC]">
                      {product.category}
                    </span>
                  </div>

                  <h3 className="font-bold text-[#0B0F0E] text-base mb-1 line-clamp-1">{product.name}</h3>
                  <div className="flex items-center justify-between mt-2 mb-3">
                    <div>
                      <span className="text-xs text-[#525B56] block">Price</span>
                      <span className="text-base font-extrabold text-[#0B0F0E]">₹{product.price?.toLocaleString()}</span>
                    </div>
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-md h-fit">
                      {product.stock} left
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Link 
                    to={`/products/${product._id}`} 
                    className="w-full bg-[#F7F8F4] hover:bg-[#E2E5DC] text-[#0B0F0E] text-sm font-semibold py-2.5 rounded-xl transition border border-[#D1D5CB] text-center"
                  >
                    View Details
                  </Link>
                  <button 
                    onClick={() => handleRemove(product._id)}
                    className="w-full py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-sm font-semibold rounded-xl transition flex items-center justify-center gap-1.5"
                  >
                    <span>Remove</span>
                    <span>♥</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}