import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Checkbox = ({ 
  checked = false, 
  onChange, 
  label,
  size = 'md',
  className = '' 
}) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const iconSizes = {
    sm: 12,
    md: 16,
    lg: 18
  };

  return (
    <label className={`flex items-center cursor-pointer ${className}`}>
      <div className="relative">
        <motion.div
          className={`
            ${sizes[size]} rounded-lg border-2 transition-all duration-200 flex items-center justify-center
            ${checked 
              ? 'bg-gradient-to-r from-primary to-secondary border-primary' 
              : 'bg-white border-gray-300 hover:border-gray-400'
            }
          `}
          whileTap={{ scale: 0.9 }}
        >
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: checked ? 1 : 0, 
              opacity: checked ? 1 : 0 
            }}
            transition={{ 
              type: 'spring', 
              stiffness: 500, 
              damping: 30 
            }}
          >
            <ApperIcon 
              name="Check" 
              size={iconSizes[size]} 
              className="text-white" 
            />
          </motion.div>
        </motion.div>
        
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
      </div>
      
      {label && (
        <span className="ml-3 text-gray-700 select-none">
          {label}
        </span>
      )}
    </label>
  );
};

export default Checkbox;