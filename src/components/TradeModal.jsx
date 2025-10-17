import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const TradeModal = ({ isOpen, onClose, product, userProducts, onTradeSubmit }) => {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [coinOffer, setCoinOffer] = useState(0);
  const [message, setMessage] = useState('');
  const [myProducts, setMyProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (isOpen && user) {
      fetchMyProducts();
    }
  }, [isOpen, user]);

  const fetchMyProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/products?userId=${user.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        // Filter to only show user's available products
        const availableProducts = data.filter(p => 
          p.seller._id === user.id && p.isAvailable && p._id !== product._id
        );
        setMyProducts(availableProducts);
      }
    } catch (error) {
      console.error('Error fetching user products:', error);
    }
  };

  const toggleProductSelection = (productId) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSubmit = async () => {
    if (selectedProducts.length === 0 && coinOffer === 0) {
      alert('Please select at least one item or offer some coins');
      return;
    }

    if (coinOffer > user.coins) {
      alert('You don\'t have enough coins');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/trades', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          receiverId: product.seller._id,
          proposerItems: selectedProducts,
          receiverItems: [product._id],
          proposerCoins: coinOffer,
          receiverCoins: 0,
          message
        })
      });

      if (response.ok) {
        alert('Trade proposal sent successfully!');
        onClose();
        // Reset form
        setSelectedProducts([]);
        setCoinOffer(0);
        setMessage('');
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to send trade proposal');
      }
    } catch (error) {
      console.error('Error sending trade proposal:', error);
      alert('Failed to send trade proposal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-lg shadow-xl w-full max-w-2xl"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Propose Trade</h2>
                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">You Want</h3>
                  <div className="border rounded-lg p-4">
                    <img
                      src={product.images && product.images[0] 
                        ? `http://localhost:5000${product.images[0]}` 
                        : '/api/placeholder/300/200'}
                      alt={product.title}
                      className="w-full h-48 object-cover rounded mb-3"
                    />
                    <h4 className="font-medium">{product.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Listed by {product.seller?.name}
                    </p>
                    <p className="text-sm text-indigo-600 font-medium mt-1">
                      {product.price} coins
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Your Offer</h3>
                  
                  {/* Coin offer */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Coins (You have {user?.coins || 0})
                    </label>
                    <input
                      type="number"
                      min="0"
                      max={user?.coins || 0}
                      value={coinOffer}
                      onChange={(e) => setCoinOffer(parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="0"
                    />
                  </div>

                  {/* Product selection */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Items
                    </label>
                    <div className="max-h-64 overflow-y-auto space-y-2">
                      {myProducts.length === 0 ? (
                        <p className="text-sm text-gray-500 text-center py-4">
                          You don't have any available items to trade
                        </p>
                      ) : (
                        myProducts.map((userProduct) => (
                          <div
                            key={userProduct._id}
                            onClick={() => toggleProductSelection(userProduct._id)}
                            className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                              selectedProducts.includes(userProduct._id) 
                                ? 'border-indigo-500 bg-indigo-50' 
                                : 'hover:border-gray-300'
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              <img
                                src={userProduct.images && userProduct.images[0] 
                                  ? `http://localhost:5000${userProduct.images[0]}` 
                                  : '/api/placeholder/60/60'}
                                alt={userProduct.title}
                                className="w-12 h-12 object-cover rounded"
                              />
                              <div className="flex-1">
                                <h4 className="font-medium text-sm">{userProduct.title}</h4>
                                <p className="text-xs text-gray-600">
                                  {userProduct.price} coins • {userProduct.condition}
                                </p>
                              </div>
                              {selectedProducts.includes(userProduct._id) && (
                                <div className="text-indigo-600">
                                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                </div>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message (optional)
                    </label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Add a message to your trade proposal..."
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading || (selectedProducts.length === 0 && coinOffer === 0)}
                  className={`px-6 py-2 rounded transition-colors ${
                    !loading && (selectedProducts.length > 0 || coinOffer > 0)
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {loading ? 'Sending...' : 'Propose Trade'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default TradeModal;