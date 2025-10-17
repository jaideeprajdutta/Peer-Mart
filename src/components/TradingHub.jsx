import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const TradingHub = () => {
  const { user } = useAuth();
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('received'); // received, sent, completed

  useEffect(() => {
    if (user) {
      fetchTrades();
    }
  }, [user]);

  const fetchTrades = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/trades', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setTrades(data);
      }
    } catch (error) {
      console.error('Error fetching trades:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTradeResponse = async (tradeId, status) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/trades/${tradeId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        fetchTrades(); // Refresh trades
      }
    } catch (error) {
      console.error('Error responding to trade:', error);
    }
  };

  const getFilteredTrades = () => {
    if (!user) return [];
    
    switch (activeTab) {
      case 'received':
        return trades.filter(trade => 
          trade.receiver._id === user.id && trade.status === 'pending'
        );
      case 'sent':
        return trades.filter(trade => 
          trade.proposer._id === user.id && trade.status === 'pending'
        );
      case 'completed':
        return trades.filter(trade => 
          (trade.receiver._id === user.id || trade.proposer._id === user.id) && 
          ['accepted', 'rejected', 'completed'].includes(trade.status)
        );
      default:
        return [];
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Please Sign In</h2>
          <p>You need to be signed in to view trades.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4">Loading trades...</p>
        </div>
      </div>
    );
  }

  const filteredTrades = getFilteredTrades();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Trading Hub</h1>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {[
                { key: 'received', label: 'Trade Requests', count: trades.filter(t => t.receiver._id === user.id && t.status === 'pending').length },
                { key: 'sent', label: 'Sent Proposals', count: trades.filter(t => t.proposer._id === user.id && t.status === 'pending').length },
                { key: 'completed', label: 'Trade History', count: trades.filter(t => (t.receiver._id === user.id || t.proposer._id === user.id) && ['accepted', 'rejected', 'completed'].includes(t.status)).length }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.key
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                  {tab.count > 0 && (
                    <span className="ml-2 bg-indigo-100 text-indigo-600 py-0.5 px-2 rounded-full text-xs">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Trade List */}
        <div className="space-y-6">
          {filteredTrades.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No trades found</h3>
              <p className="text-gray-500">
                {activeTab === 'received' && "You haven't received any trade requests yet."}
                {activeTab === 'sent' && "You haven't sent any trade proposals yet."}
                {activeTab === 'completed' && "You don't have any completed trades yet."}
              </p>
            </div>
          ) : (
            filteredTrades.map((trade) => (
              <TradeCard
                key={trade._id}
                trade={trade}
                currentUser={user}
                onResponse={handleTradeResponse}
                isReceived={activeTab === 'received'}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const TradeCard = ({ trade, currentUser, onResponse, isReceived }) => {
  const isProposer = trade.proposer._id === currentUser.id;
  const otherUser = isProposer ? trade.receiver : trade.proposer;
  const myItems = isProposer ? trade.proposerItems : trade.receiverItems;
  const theirItems = isProposer ? trade.receiverItems : trade.proposerItems;
  const myCoins = isProposer ? trade.proposerCoins : trade.receiverCoins;
  const theirCoins = isProposer ? trade.receiverCoins : trade.proposerCoins;

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold">
            Trade with {otherUser.name}
          </h3>
          <p className="text-sm text-gray-500">
            {new Date(trade.createdAt).toLocaleDateString()}
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(trade.status)}`}>
          {trade.status.charAt(0).toUpperCase() + trade.status.slice(1)}
        </span>
      </div>

      {trade.message && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-700">"{trade.message}"</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Your offer */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">
            {isProposer ? 'Your Offer' : 'Their Offer'}
          </h4>
          <div className="space-y-2">
            {myItems.map((item) => (
              <div key={item._id} className="flex items-center space-x-3 p-2 bg-gray-50 rounded">
                {item.images && item.images[0] && (
                  <img
                    src={`http://localhost:5000${item.images[0]}`}
                    alt={item.title}
                    className="w-12 h-12 object-cover rounded"
                  />
                )}
                <div className="flex-1">
                  <p className="font-medium text-sm">{item.title}</p>
                  <p className="text-xs text-gray-500">{item.condition}</p>
                </div>
              </div>
            ))}
            {myCoins > 0 && (
              <div className="flex items-center space-x-3 p-2 bg-yellow-50 rounded">
                <div className="w-12 h-12 bg-yellow-200 rounded flex items-center justify-center">
                  <span className="text-yellow-800 font-bold">💰</span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{myCoins} Coins</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Their request */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">
            {isProposer ? 'Their Offer' : 'Your Offer'}
          </h4>
          <div className="space-y-2">
            {theirItems.map((item) => (
              <div key={item._id} className="flex items-center space-x-3 p-2 bg-gray-50 rounded">
                {item.images && item.images[0] && (
                  <img
                    src={`http://localhost:5000${item.images[0]}`}
                    alt={item.title}
                    className="w-12 h-12 object-cover rounded"
                  />
                )}
                <div className="flex-1">
                  <p className="font-medium text-sm">{item.title}</p>
                  <p className="text-xs text-gray-500">{item.condition}</p>
                </div>
              </div>
            ))}
            {theirCoins > 0 && (
              <div className="flex items-center space-x-3 p-2 bg-yellow-50 rounded">
                <div className="w-12 h-12 bg-yellow-200 rounded flex items-center justify-center">
                  <span className="text-yellow-800 font-bold">💰</span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{theirCoins} Coins</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action buttons for received trades */}
      {isReceived && trade.status === 'pending' && (
        <div className="mt-6 flex space-x-3">
          <button
            onClick={() => onResponse(trade._id, 'accepted')}
            className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Accept Trade
          </button>
          <button
            onClick={() => onResponse(trade._id, 'rejected')}
            className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Reject Trade
          </button>
        </div>
      )}
    </div>
  );
};

export default TradingHub;