import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { axiosInstance } from '../axiosCalls/axios';
import { useCart } from '../context/CartContext';

function ProductDetails() {
  const { id } = useParams(); 
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [adding, setAdding] = useState(false);

  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProductAndWishlist = async () => {
      try {
        setLoading(true);
        const [productRes, wishlistRes] = await Promise.all([
          axiosInstance.get(`/products/${id}`),
          axiosInstance.get('/wishlist').catch(() => ({ data: { wishlist: [] } }))
        ]);

        if (productRes.data.success) {
          setProduct(productRes.data.product);
          if (wishlistRes.data && wishlistRes.data.wishlist) {
            const exists = wishlistRes.data.wishlist.some(
              item => (item.product?._id || item.product || item._id) === id
            );
            setIsWishlisted(exists);
          }
        } else {
          setError('Product not found');
        }
      } catch (err) {
        if (err.response && err.response.data && err.response.data.message) {
          setError(err.response.data.message);
        } else {
          setError('An error occurred while fetching product details.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProductAndWishlist();
  }, [id]);

  const handleAddToCart = async () => {
    setAdding(true);
    await addToCart(product._id, 1);
    setAdding(false);
  };

  const handleWishlistToggle = async () => {
    try {
      if (isWishlisted) {
        const response = await axiosInstance.delete(`/wishlist/${product._id}`);
        if (response.data.success) setIsWishlisted(false);
      } else {
        const response = await axiosInstance.post(`/wishlist/${product._id}`, { quantity: 1 });
        if (response.data.success) setIsWishlisted(true);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update wishlist');
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#F7F8F4] flex items-center justify-center text-[#0A3622] font-medium">
      Loading details...
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-[#F7F8F4] flex flex-col items-center justify-center p-6">
      <p className="text-red-600 text-lg font-semibold mb-4">{error}</p>
      <button 
        onClick={() => navigate('/products')}
        className="bg-[#0A3622] hover:bg-[#124E31] text-white px-5 py-2.5 rounded-xl font-semibold transition"
      >
        Back to Products
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F7F8F4] text-[#0B0F0E]">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <button 
          onClick={() => navigate(-1)}
          className="mb-8 text-[#0A3622] hover:underline font-semibold text-sm flex items-center gap-2 transition"
        >
          &larr; Back to catalog
        </button>

        <div className="bg-white border border-[#E2E5DC] rounded-3xl p-8 md:p-12 shadow-xl grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="rounded-2xl overflow-hidden bg-[#F7F8F4] border border-[#E2E5DC] aspect-square">
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-[#0A3622] uppercase tracking-widest bg-[#0A3622]/10 border border-[#0A3622]/20 px-3 py-1 rounded-full">
                {product.category}
              </span>
              <h1 className="text-3xl font-extrabold text-[#0B0F0E] mt-4 mb-2">
                {product.name}
              </h1>
              <p className="text-3xl font-black text-[#0B0F0E] mb-6">
                ₹{product.price.toLocaleString()}
              </p>
              
              <div className="mb-6 border-t border-[#E2E5DC] pt-6">
                <h3 className="text-xs font-bold text-[#525B56] uppercase tracking-wider mb-2">Description</h3>
                <p className="text-[#525B56] text-sm leading-relaxed">
                  {product.description}
                </p>
              </div>

              <div className="mb-8 flex items-center gap-2">
                <span className="text-sm text-[#525B56]">Availability:</span>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md">
                  {product.stock} units left
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button 
                onClick={handleAddToCart}
                disabled={adding || product.stock === 0}
                className="w-full py-3.5 bg-[#0A3622] hover:bg-[#124E31] text-white font-semibold rounded-xl transition shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span>🛒</span>
                <span>{adding ? 'Adding to Cart...' : 'Add to Cart'}</span>
              </button>

              <button 
                onClick={handleWishlistToggle}
                className={`w-full py-3.5 rounded-xl font-semibold transition border flex items-center justify-center gap-2 shadow-sm ${
                  isWishlisted 
                    ? 'bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-100' 
                    : 'bg-white hover:bg-[#F7F8F4] text-[#0B0F0E] border-[#D1D5CB]'
                }`}
              >
                <span>{isWishlisted ? '♥' : '♡'}</span>
                <span>{isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;