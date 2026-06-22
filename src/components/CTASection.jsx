import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const CTASection = () => {
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
    <section className="py-20 bg-gradient-to-br from-primary via-primary-dark to-secondary relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-10 left-10 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-white/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid lg:grid-cols-2 gap-12 items-center"
        >
          {/* Left side - Content */}
          <motion.div variants={itemVariants} className="space-y-8">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
                Ready to Start{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-white">
                  Trading?
                </span>
              </h2>
              
              <p className="text-xl text-white/90 leading-relaxed">
                Join your college community and start discovering amazing deals, 
                selling your items, and building connections with fellow students.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              {user ? (
                <>
                  <Link
                    to="/explore"
                    className="group relative px-8 py-4 bg-white text-primary rounded-xl font-semibold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
                  >
                    <span className="relative z-10">Start Exploring</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-white to-gray-100 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </Link>
                  
                  <Link
                    to="/sell"
                    className="group px-8 py-4 border-2 border-white text-white rounded-xl font-semibold text-lg hover:bg-white hover:text-primary transition-all duration-300 transform hover:scale-105"
                  >
                    List Your Items
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="group relative px-8 py-4 bg-white text-primary rounded-xl font-semibold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
                  >
                    <span className="relative z-10">Get Started</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-white to-gray-100 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </Link>
                  
                  <Link
                    to="/explore"
                    className="group px-8 py-4 border-2 border-white text-white rounded-xl font-semibold text-lg hover:bg-white hover:text-primary transition-all duration-300 transform hover:scale-105"
                  >
                    Browse Items
                  </Link>
                </>
              )}
            </div>

            {/* Features list */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="flex items-center space-x-3 text-white/90">
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span>Free to join</span>
              </div>
              <div className="flex items-center space-x-3 text-white/90">
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span>College verified</span>
              </div>
              <div className="flex items-center space-x-3 text-white/90">
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span>Safe transactions</span>
              </div>
              <div className="flex items-center space-x-3 text-white/90">
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span>On-campus only</span>
              </div>
            </div>
          </motion.div>

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
                className="absolute -top-6 -right-6 w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm"
                animate={{ 
                  y: [0, -15, 0],
                  rotate: [0, 10, 0]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <span className="text-3xl">🪙</span>
              </motion.div>
              
              <motion.div
                className="absolute -bottom-6 -left-6 w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm"
                animate={{ 
                  y: [0, 15, 0],
                  rotate: [0, -10, 0]
                }}
                transition={{ 
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5
                }}
              >
                <span className="text-2xl">📱</span>
              </motion.div>
              
              <motion.div
                className="absolute top-1/2 -left-10 w-18 h-18 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm"
                animate={{ 
                  x: [0, 8, 0],
                  rotate: [0, 15, 0]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
              >
                <span className="text-2xl">💻</span>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
