import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import TradeModal from './TradeModal';

const ProductCard = ({ product, userProducts, onTradeSubmit, onPurchase }) => {
  const [isTradeModalOpen, setIsTradeModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handlePurchase = async () => {
    if (!user) {
      alert('Please sign in to purchase');
      return;
    }

    if (user.coins < product.price) {
      alert('Insufficient coins');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/purchase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ productId: product._id })
      });

      if (response.ok) {
        alert('Purchase successful!');
        if (onPurchase) onPurchase();
      } else {
        const error = await response.json();
        alert(error.message || 'Purchase failed');
      }
    } catch (error) {
      console.error('Purchase error:', error);
      alert('Purchase failed');
    } finally {
      setLoading(false);
    }
  };

  const handleContactSeller = async () => {
    if (!user) {
      alert('Please sign in to contact seller');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/chats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ otherUserId: product.seller._id })
      });

      if (response.ok) {
        navigate('/messages');
      } else {
        alert('Failed to start chat');
      }
    } catch (error) {
      console.error('Error starting chat:', error);
      alert('Failed to start chat');
    }
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg shadow-md overflow-hidden group"
    >
      <div className="relative overflow-hidden">
        <img
          src={product.images && product.images[0] 
            ? `http://localhost:5000${product.images[0]}` 
            : '/api/placeholder/300/200'}
          alt={product.title}
          className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-2 left-2 flex gap-2">
          <span className={`px-2 py-1 rounded-full text-xs font-bold text-white ${
            product.condition === 'New' ? 'bg-green-500' :
            product.condition === 'Like New' ? 'bg-blue-500' :
            product.condition === 'Good' ? 'bg-yellow-500' :
            product.condition === 'Fair' ? 'bg-orange-500' : 'bg-red-500'
          }`}>
            {product.condition}
          </span>
          {product.isForTrade && (
            <span className="bg-purple-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              TRADE
            </span>
          )}
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <p className="text-white text-sm">{product.description.substring(0, 60)}...</p>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium text-gray-800 group-hover:text-indigo-600 transition-colors">
            {product.title}
          </h3>
          <span className="font-bold text-indigo-600">{product.price} 🪙</span>
        </div>
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold">{product.seller?.name?.charAt(0) || 'U'}</span>
            </div>
            <span className="text-xs text-gray-600">{product.seller?.name || 'Unknown'}</span>
          </div>
          <div className="flex items-center space-x-1 text-xs text-gray-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{formatTimeAgo(product.createdAt)}</span>
          </div>
        </div>

        <div className="flex items-center justify-between mb-3">
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
            {product.category}
          </span>
          <span className="text-xs text-gray-500">
            {product.college?.name || 'Unknown College'}
          </span>
        </div>

        {product.tradePreferences && product.tradePreferences.length > 0 && (
          <div className="mb-3">
            <p className="text-xs text-gray-500 mb-1">Looking for:</p>
            <div className="flex flex-wrap gap-1">
              {product.tradePreferences.slice(0, 2).map((pref, index) => (
                <span key={index} className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full">
                  {pref}
                </span>
              ))}
              {product.tradePreferences.length > 2 && (
                <span className="text-xs text-gray-500">+{product.tradePreferences.length - 2} more</span>
              )}
            </div>
          </div>
        )}

        <div className="space-y-2">
          <div className="flex gap-2">
            <button
              onClick={handlePurchase}
              disabled={loading || !user || user.id === product.seller?._id}
              className="flex-1 bg-indigo-600 text-white py-2 px-3 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {loading ? 'Buying...' : 'Buy Now'}
            </button>
            
            {product.isForTrade && user && user.id !== product.seller?._id && (
              <button
                onClick={() => setIsTradeModalOpen(true)}
                className="flex-1 border border-indigo-600 text-indigo-600 py-2 px-3 rounded-md hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              >
                Trade
              </button>
            )}
          </div>
          
          {user && user.id !== product.seller?._id && (
            <button
              onClick={() => handleContactSeller()}
              className="w-full border border-gray-300 text-gray-700 py-2 px-3 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 text-sm"
            >
              Contact Seller
            </button>
          )}
        </div>
      </div>

      <TradeModal
        isOpen={isTradeModalOpen}
        onClose={() => setIsTradeModalOpen(false)}
        product={product}
        userProducts={userProducts}
        onTradeSubmit={onTradeSubmit}
      />
    </motion.div>
  );
};

export default ProductCard;