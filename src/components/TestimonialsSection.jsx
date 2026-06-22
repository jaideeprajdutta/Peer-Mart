import React from 'react';
import { motion } from 'framer-motion';

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: 'Sarah Chen',
      college: 'Stanford University',
      avatar: 'SC',
      rating: 5,
      text: 'PeerMart made selling my textbooks so easy! I got 3x more than what the bookstore offered, and the buyer was super friendly.',
      category: 'Books',
      item: 'Calculus Textbook',
    },
    {
      name: 'Marcus Johnson',
      college: 'UC Berkeley',
      avatar: 'MJ',
      rating: 5,
      text: 'Found an amazing MacBook for half the retail price. The seller was in my dorm building, so we just met in the lobby!',
      category: 'Electronics',
      item: 'MacBook Pro',
    },
    {
      name: 'Emily Rodriguez',
      college: 'NYU',
      avatar: 'ER',
      rating: 5,
      text: 'Trading my old bike for a mini-fridge was the best decision ever. The platform made it so safe and convenient.',
      category: 'Furniture',
      item: 'Mini Fridge',
    },
    {
      name: 'David Kim',
      college: 'MIT',
      avatar: 'DK',
      rating: 5,
      text: 'The chat feature is amazing. I could ask questions about the item and negotiate the price before meeting up.',
      category: 'Electronics',
      item: 'Gaming Console',
    },
    {
      name: 'Lisa Wang',
      college: 'Harvard University',
      avatar: 'LW',
      rating: 5,
      text: 'As an international student, PeerMart helped me find affordable furniture for my dorm. The community is so welcoming!',
      category: 'Furniture',
      item: 'Desk & Chair Set',
    },
    {
      name: 'Alex Thompson',
      college: 'UCLA',
      avatar: 'AT',
      rating: 5,
      text: 'Sold my old textbooks and used the coins to buy art supplies. The circular economy aspect is really cool!',
      category: 'Art',
      item: 'Art Supplies',
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
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-32 h-32 bg-primary/5 rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-secondary/10 rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-accent/5 rounded-full blur-3xl"></div>
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
            What Students Are Saying
          </h2>
          <p className="text-lg text-gray-600">
            Join thousands of students who are already trading and saving money on campus
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -5, scale: 1.02 }}
              className="group"
            >
              <div className="relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group-hover:border-primary/20">
                {/* Rating */}
                <div className="flex items-center mb-4">
                  {renderStars(testimonial.rating)}
                </div>

                {/* Testimonial text */}
                <blockquote className="text-gray-700 mb-6 leading-relaxed">
                  "{testimonial.text}"
                </blockquote>

                {/* Item info */}
                <div className="mb-6">
                  <div className="inline-flex items-center px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                    {testimonial.category}
                  </div>
                  <div className="text-sm text-gray-600 mt-2">
                    {testimonial.item}
                  </div>
                </div>

                {/* User info */}
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-semibold mr-4">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      {testimonial.college}
                    </div>
                  </div>
                </div>

                {/* Hover effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary mb-2">4.9/5</div>
              <div className="text-gray-600">Average Rating</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-secondary mb-2">98%</div>
              <div className="text-gray-600">Success Rate</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-accent mb-2">10K+</div>
              <div className="text-gray-600">Happy Students</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
