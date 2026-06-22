import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const CategoriesSection = () => {
  const categories = [
    {
      name: 'Electronics',
      icon: '💻',
      count: '120+ items',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      description: 'Laptops, phones, gadgets',
    },
    {
      name: 'Books',
      icon: '📚',
      count: '340+ items',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      description: 'Textbooks, novels, study guides',
    },
    {
      name: 'Furniture',
      icon: '🪑',
      count: '85+ items',
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
      description: 'Desks, chairs, storage',
    },
    {
      name: 'Clothing',
      icon: '👕',
      count: '200+ items',
      color: 'from-pink-500 to-pink-600',
      bgColor: 'bg-pink-50',
      textColor: 'text-pink-600',
      description: 'Fashion, accessories',
    },
    {
      name: 'Sports',
      icon: '⚽',
      count: '95+ items',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      description: 'Equipment, gear, fitness',
    },
    {
      name: 'Music',
      icon: '🎵',
      count: '60+ items',
      color: 'from-indigo-500 to-indigo-600',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-600',
      description: 'Instruments, records, gear',
    },
    {
      name: 'Art',
      icon: '🎨',
      count: '45+ items',
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50',
      textColor: 'text-red-600',
      description: 'Supplies, crafts, decor',
    },
    {
      name: 'Kitchen',
      icon: '🍳',
      count: '75+ items',
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600',
      description: 'Appliances, utensils',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <section className="py-20 bg-neutral-light relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-24 h-24 bg-primary/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-secondary/15 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-accent/10 rounded-full blur-2xl"></div>
      </div>

      <div className="container mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            Explore Categories
          </h2>
          <p className="text-lg text-gray-600">
            Find exactly what you're looking for with our organized categories
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          {categories.map((category, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group"
            >
              <Link
                to={`/explore?category=${category.name}`}
                className="block"
              >
                <div className={`relative bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 group-hover:border-2 group-hover:border-primary/20 ${category.bgColor} border border-gray-100`}>
                  {/* Icon */}
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {category.icon}
                  </div>

                  {/* Content */}
                  <h3 className={`text-lg font-semibold mb-2 group-hover:text-primary transition-colors ${category.textColor}`}>
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    {category.description}
                  </p>
                  <div className="text-xs font-medium text-gray-500">
                    {category.count}
                  </div>

                  {/* Hover effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Arrow indicator */}
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* View All Categories CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-12"
        >
          <Link
            to="/explore"
            className="inline-flex items-center px-8 py-4 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
          >
            View All Categories
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default CategoriesSection;
