import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const CelebrationOverlay = ({ show, onClose, task }) => {
  const [confetti, setConfetti] = useState([]);

  useEffect(() => {
    if (show) {
      // Generate confetti particles
      const particles = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * window.innerWidth,
        delay: Math.random() * 0.5,
        color: ['#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3'][Math.floor(Math.random() * 4)]
      }));
      setConfetti(particles);
      
      // Auto close after 3 seconds
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  const messages = [
    "Amazing work! 🎉",
    "You're on fire! 🔥",
    "Keep it up! ⭐",
    "Fantastic! 💫",
    "You're crushing it! 💪"
  ];

  const randomMessage = messages[Math.floor(Math.random() * messages.length)];

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          onClick={onClose}
        >
          {/* Confetti */}
          {confetti.map((particle) => (
            <motion.div
              key={particle.id}
              initial={{ 
                y: window.innerHeight + 20, 
                x: particle.x,
                rotate: 0,
                opacity: 1
              }}
              animate={{ 
                y: -100, 
                rotate: 720,
                opacity: 0
              }}
              transition={{ 
                duration: 3,
                delay: particle.delay,
                ease: 'easeOut'
              }}
              className="absolute w-3 h-3 rounded-full"
              style={{ backgroundColor: particle.color }}
            />
          ))}

          {/* Floating Hearts */}
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={`heart-${i}`}
              initial={{ 
                scale: 0,
                y: 50,
                x: (i - 2) * 100,
                opacity: 0
              }}
              animate={{ 
                scale: [0, 1.2, 1],
                y: -100,
                opacity: [0, 1, 0]
              }}
              transition={{ 
                duration: 2,
                delay: i * 0.2,
                ease: 'easeOut'
              }}
              className="absolute"
            >
              <ApperIcon name="Heart" size={24} className="text-primary" />
            </motion.div>
          ))}

          {/* Main celebration card */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className="bg-white rounded-3xl shadow-xl p-8 text-center max-w-sm w-full mx-4"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 1 }}
              className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <ApperIcon name="CheckCircle" size={32} className="text-white" />
            </motion.div>

            <h2 className="text-2xl font-heading gradient-text mb-2">
              Task Complete!
            </h2>

            <p className="text-lg text-gray-700 mb-4">
              {randomMessage}
            </p>

            <div className="bg-pink-50 rounded-2xl p-4 mb-6">
              <p className="text-sm font-medium text-gray-900 truncate">
                "{task.title}"
              </p>
            </div>

            <button
              onClick={onClose}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              Continue
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CelebrationOverlay;