import React, { createContext, useContext, useState, useEffect } from 'react';

const MarketplaceContext = createContext();

export const useMarketplace = () => {
  const context = useContext(MarketplaceContext);
  if (!context) {
    throw new Error('useMarketplace must be used within a MarketplaceProvider');
  }
  return context;
};

export const MarketplaceProvider = ({ children }) => {
  const [userCoins, setUserCoins] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [tradeProposals, setTradeProposals] = useState([]);

  // Reward amounts for different actions
  const REWARD_AMOUNTS = {
    LISTING: 50,
    PURCHASE: 100,
    TRADE: 75,
    SUCCESSFUL_TRADE: 150
  };

  const addCoins = (amount, description) => {
    setUserCoins(prev => prev + amount);
    const newTransaction = {
      id: Date.now(),
      type: 'earned',
      amount,
      description,
      date: new Date().toLocaleDateString()
    };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const useCoins = (amount, description) => {
    if (userCoins >= amount) {
      setUserCoins(prev => prev - amount);
      const newTransaction = {
        id: Date.now(),
        type: 'spent',
        amount,
        description,
        date: new Date().toLocaleDateString()
      };
      setTransactions(prev => [newTransaction, ...prev]);
      return true;
    }
    return false;
  };

  const proposeTrade = (proposal) => {
    const newProposal = {
      id: Date.now(),
      ...proposal,
      status: 'pending',
      date: new Date().toLocaleDateString()
    };
    setTradeProposals(prev => [newProposal, ...prev]);
    addCoins(REWARD_AMOUNTS.TRADE, 'Proposed a trade');
  };

  const respondToTrade = (proposalId, accepted) => {
    setTradeProposals(prev =>
      prev.map(proposal =>
        proposal.id === proposalId
          ? { ...proposal, status: accepted ? 'accepted' : 'rejected' }
          : proposal
      )
    );

    if (accepted) {
      addCoins(REWARD_AMOUNTS.SUCCESSFUL_TRADE, 'Completed a successful trade');
    }
  };

  const value = {
    userCoins,
    transactions,
    tradeProposals,
    addCoins,
    useCoins,
    proposeTrade,
    respondToTrade,
    REWARD_AMOUNTS
  };

  return (
    <MarketplaceContext.Provider value={value}>
      {children}
    </MarketplaceContext.Provider>
  );
};