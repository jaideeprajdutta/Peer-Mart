import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import FeaturesSection from './components/FeaturesSection';
import HowItWorksSection from './components/HowItWorksSection';
import CategoriesSection from './components/CategoriesSection';
import ProductGrid from './components/ProductGrid';
import TestimonialsSection from './components/TestimonialsSection';
import CTASection from './components/CTASection';
import SignIn from './components/SignIn';
import SellProduct from './components/SellProduct';
import TradingHub from './components/TradingHub';
import MyListings from './components/MyListings';
import Chat from './components/Chat';

const HomePage = () => (
  <div className="min-h-screen">
    <HeroSection />
    <FeaturesSection />
    <HowItWorksSection />
    <CategoriesSection />
    <ProductGrid />
    <TestimonialsSection />
    <CTASection />
  </div>
);

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-neutral-light">
        <Navbar />
        <div className="pt-16"> {/* Add padding top to account for fixed navbar */}
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/explore" element={<ProductGrid />} />
            <Route path="/sell" element={<SellProduct />} />
            <Route path="/trades" element={<TradingHub />} />
            <Route path="/my-listings" element={<MyListings />} />
            <Route path="/messages" element={<Chat />} />
            <Route path="/login" element={<SignIn />} />
            <Route path="/profile" element={<div className="min-h-screen flex items-center justify-center"><h2 className="text-2xl">Profile Page (Coming Soon)</h2></div>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;