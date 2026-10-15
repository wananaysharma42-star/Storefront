import { createContext, useContext, useState, useEffect } from 'react';
import { axiosInstance } from '../axiosCalls/axios';
import { useAuth } from './AuthContext'; 

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { customer } = useAuth(); 

  const fetchCart = async () => {
    if (!customer) {
      setCart([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(false);
    try {
      const response = await axiosInstance.get('/cart');
      if (response.data.success) {
        setCart(response.data.cart);
      } else {
        setError(true);
      }
    } catch (err) {
      setError(true);
      setCart([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [customer]);

  const addToCart = async (productId, quantity = 1) => {
    try {
      const response = await axiosInstance.post(`/cart/${productId}`, { quantity });
      if (response.data.success) {
        setCart(response.data.cart);
        return { success: true };
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add to cart');
      return { success: false, message: err.response?.data?.message };
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    try {
      const response = await axiosInstance.patch(`/cart/${productId}`, { quantity: newQuantity });
      if (response.data.success) {
        setCart(response.data.cart);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update quantity');
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const response = await axiosInstance.delete(`/cart/${productId}`);
      if (response.data.success) {
        setCart(response.data.cart);
      }
    } catch (err) {
      alert('Failed to remove item');
    }
  };

  const totalItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const grandTotal = cart.reduce((acc, item) => {
    if (!item.product) return acc;
    return acc + (item.product.price * item.quantity);
  }, 0);

  return (
    <CartContext.Provider 
      value={{ 
        cart, 
        loading, 
        error, 
        fetchCart, 
        addToCart, 
        updateQuantity, 
        removeFromCart, 
        totalItemsCount, 
        grandTotal 
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);