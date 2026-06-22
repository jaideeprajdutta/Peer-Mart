import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const HeroSection = () => {
  const { user } = useAuth();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const mascotVariants = {
    hidden: { opacity: 0, scale: 0.8, rotate: -10 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
    hover: {
      scale: 1.1,
      rotate: 5,
      transition: { duration: 0.3 },
    },
  };

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-primary/5 via-neutral-light to-secondary/10 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative container mx-auto px-4 py-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]"
        >
          {/* Left side - Content */}
          <div className="space-y-8">
            <motion.div variants={itemVariants} className="space-y-6">
              <div className="inline-flex items-center px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
                <span className="w-2 h-2 bg-primary rounded-full mr-2 animate-pulse"></span>
                Campus Marketplace
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Trade, Sell &{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                  Discover
                </span>{' '}
                on Campus
              </h1>
              
              <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
                Connect with fellow students, trade items, and discover amazing deals right on your campus. 
                Safe, simple, and built for college communities.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/explore"
                className="group relative px-8 py-4 bg-primary text-white rounded-xl font-semibold text-lg hover:bg-primary-dark transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
              >
                <span className="relative z-10">Start Exploring</span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary-dark rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
              
              <Link
                to="/sell"
                className="group px-8 py-4 border-2 border-primary text-primary rounded-xl font-semibold text-lg hover:bg-primary hover:text-white transition-all duration-300 transform hover:scale-105"
              >
                List Your Items
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div variants={itemVariants} className="grid grid-cols-3 gap-8 pt-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">500+</div>
                <div className="text-sm text-gray-600">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary">1.2K+</div>
                <div className="text-sm text-gray-600">Items Listed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">98%</div>
                <div className="text-sm text-gray-600">Success Rate</div>
              </div>
            </motion.div>
          </div>

          {/* Right side - Mascot and Visual */}
          <motion.div 
            variants={mascotVariants}
            whileHover="hover"
            className="relative flex justify-center lg:justify-end"
          >
            <div className="relative">
              {/* Mascot Image */}
              <motion.img
                src="/Mascot 1.png"
                alt="Loopi - PeerMart Mascot"
                className="w-80 h-80 object-contain drop-shadow-2xl"
                whileHover={{ 
                  scale: 1.05,
                  rotate: [0, -5, 5, 0],
                  transition: { duration: 0.5 }
                }}
              />
              
              {/* Floating elements around mascot */}
              <motion.div
                className="absolute -top-4 -right-4 w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center"
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [0, 5, 0]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <span className="text-2xl">🪙</span>
              </motion.div>
              
              <motion.div
                className="absolute -bottom-4 -left-4 w-12 h-12 bg-secondary/30 rounded-full flex items-center justify-center"
                animate={{ 
                  y: [0, 10, 0],
                  rotate: [0, -5, 0]
                }}
                transition={{ 
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5
                }}
              >
                <span className="text-lg">📚</span>
              </motion.div>
              
              <motion.div
                className="absolute top-1/2 -left-8 w-14 h-14 bg-accent/20 rounded-full flex items-center justify-center"
                animate={{ 
                  x: [0, 5, 0],
                  rotate: [0, 10, 0]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
              >
                <span className="text-xl">💻</span>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
          <motion.div
            className="w-1 h-3 bg-gray-400 rounded-full mt-2"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
