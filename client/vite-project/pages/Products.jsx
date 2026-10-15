import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { axiosInstance } from '../axiosCalls/axios';
import { useCart } from '../context/CartContext';

function Products() {
  const [products, setProducts] = useState([]);
  const [wishlistIds, setWishlistIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addingId, setAddingId] = useState(null);

  const { cart, addToCart, totalItemsCount } = useCart();
  
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const searchQuery = searchParams.get('search') || '';
  const categoryQuery = searchParams.get('category') || '';

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsRes, wishlistRes] = await Promise.all([
          axiosInstance.get('/products/all', {
            params: { search: searchQuery, category: categoryQuery }
          }),
          axiosInstance.get('/wishlist').catch(() => ({ data: { wishlist: [] } }))
        ]);

        if (productsRes.data.success) {
          setProducts(productsRes.data.products);
        } else {
          setError('Failed to load products');
        }

        if (wishlistRes.data && wishlistRes.data.wishlist) {
          const ids = new Set(wishlistRes.data.wishlist.map(item => item.product?._id || item.product || item._id));
          setWishlistIds(ids);
        }
      } catch (err) {
        setError('An error occurred while fetching products.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchQuery, categoryQuery]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const searchValue = e.target.elements.searchQueryInput.value.trim();
    const newParams = new URLSearchParams(searchParams);
    if (searchValue) newParams.set('search', searchValue);
    else newParams.delete('search');
    setSearchParams(newParams);
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    const newParams = new URLSearchParams(searchParams);
    if (value) newParams.set('category', value);
    else newParams.delete('category');
    setSearchParams(newParams);
  };

  const handleAddToCart = async (productId) => {
    setAddingId(productId);
    await addToCart(productId, 1);
    setAddingId(null);
  };

  const handleWishlistToggle = async (productId) => {
    const isAlreadyAdded = wishlistIds.has(productId);
    try {
      if (isAlreadyAdded) {
        const response = await axiosInstance.delete(`/wishlist/${productId}`);
        if (response.data.success) {
          setWishlistIds(prev => {
            const next = new Set(prev);
            next.delete(productId);
            return next;
          });
        }
      } else {
        const response = await axiosInstance.post(`/wishlist/${productId}`, { quantity: 1 });
        if (response.data.success) {
          setWishlistIds(prev => new Set(prev).add(productId));
        }
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update wishlist');
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#F7F8F4] flex items-center justify-center text-[#0A3622] font-medium">
      Loading exclusive inventory...
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-[#F7F8F4] flex items-center justify-center text-red-600 p-6 text-center">
      <p className="bg-red-50 border border-red-200 px-6 py-4 rounded-xl">{error}</p>
    </div>
  );

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
            onClick={() => navigate('/wishlist')}
            className="text-sm text-[#525B56] hover:text-[#0A3622] transition font-medium px-3 py-2 flex items-center gap-1.5"
          >
            <span>♥</span> Wishlist
          </button>
          <button 
            onClick={() => navigate('/cart')}
            className="px-4 py-2 bg-[#0A3622] hover:bg-[#124E31] text-white text-sm font-semibold rounded-xl transition flex items-center gap-2 shadow-sm"
          >
            <span>🛒</span>
            <span>Cart</span>
            <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full font-bold">
              {totalItemsCount}
            </span>
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-8 py-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-[#0B0F0E]">Explore Products</h1>
            <p className="text-[#525B56] text-sm mt-1">Browse our handpicked selection of high-grade goods.</p>
          </div>
          
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="flex gap-2 w-full sm:w-auto">
              <input 
                type="text"
                name="searchQueryInput"
                defaultValue={searchQuery}
                placeholder="Search products..."
                className="bg-white border border-[#D1D5CB] rounded-xl px-4 py-2.5 text-sm text-[#0B0F0E] placeholder-[#525B56] focus:outline-none focus:border-[#0A3622] transition w-full sm:w-64"
              />
              <button 
                type="submit"
                className="px-4 py-2.5 bg-[#0A3622] hover:bg-[#124E31] text-white text-sm font-semibold rounded-xl transition shadow-md whitespace-nowrap"
              >
                Search
              </button>
            </div>
            
            <select
              value={categoryQuery}
              onChange={handleCategoryChange}
              className="bg-white border border-[#D1D5CB] rounded-xl px-4 py-2.5 text-sm text-[#525B56] focus:outline-none focus:border-[#0A3622] transition"
            >
              <option value="">All Categories</option>
              <option value="Electronics">Electronics</option>
              <option value="Furniture">Furniture</option>
              <option value="Garments">Garments</option>
              <option value="Utensils">Utensils</option>
            </select>
          </form>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.length === 0 ? (
            <div className="col-span-full text-center py-20 bg-white border border-[#E2E5DC] rounded-3xl">
              <p className="text-[#525B56] font-medium">No products found matching your criteria.</p>
            </div>
          ) : (
            products.map((product) => {
              const isInCart = cart.some(item => (item.product?._id || item.product) === product._id);
              const isWishlisted = wishlistIds.has(product._id);
              const isAdding = addingId === product._id;

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

                    <h2 className="font-bold text-[#0B0F0E] text-base mb-1 line-clamp-1">{product.name}</h2>
                    <div className="flex items-center justify-between mt-2 mb-4">
                      <span className="text-lg font-extrabold text-[#0B0F0E]">₹{product.price.toLocaleString()}</span>
                      <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-md">
                        {product.stock} left
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <button 
                      onClick={() => navigate(`/products/${product._id}`)}
                      className="w-full bg-[#F7F8F4] hover:bg-[#E2E5DC] text-[#0B0F0E] text-sm font-semibold py-2.5 rounded-xl transition border border-[#D1D5CB]"
                    >
                      View Details
                    </button>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <button 
                        onClick={() => handleAddToCart(product._id)}
                        disabled={isAdding || product.stock === 0}
                        className="w-full py-2.5 bg-[#0A3622] hover:bg-[#124E31] text-white text-xs font-semibold rounded-xl transition shadow-md disabled:opacity-50 flex items-center justify-center gap-1"
                      >
                        <span>🛒</span>
                        <span>{isAdding ? '...' : isInCart ? '+1 More' : 'Add to Cart'}</span>
                      </button>

                      <button 
                        onClick={() => handleWishlistToggle(product._id)}
                        className={`w-full py-2.5 text-xs font-semibold rounded-xl transition flex items-center justify-center gap-1 border ${
                          isWishlisted 
                            ? 'bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-100' 
                            : 'bg-white hover:bg-[#F7F8F4] text-[#0B0F0E] border-[#D1D5CB]'
                        }`}
                      >
                        <span>{isWishlisted ? '♥' : '♡'}</span>
                        <span>{isWishlisted ? 'Saved' : 'Wishlist'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default Products;