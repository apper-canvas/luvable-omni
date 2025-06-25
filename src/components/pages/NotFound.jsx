import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
          className="mb-8"
        >
          <div className="w-24 h-24 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full flex items-center justify-center mx-auto">
            <ApperIcon name="Heart" size={48} className="text-primary" />
          </div>
        </motion.div>
        
        <h1 className="text-6xl font-heading gradient-text mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Oops! The page you're looking for doesn't exist. But don't worry, 
          there are plenty of tasks waiting for your attention! 💕
        </p>
        
        <div className="flex justify-center space-x-4">
          <Button onClick={() => navigate('/')} icon="Home">
            Go Home
          </Button>
          <Button variant="secondary" onClick={() => navigate(-1)} icon="ArrowLeft">
            Go Back
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;