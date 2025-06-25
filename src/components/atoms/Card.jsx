import { motion } from 'framer-motion';

const Card = ({ 
  children, 
  className = '', 
  hover = true,
  onClick,
  ...props 
}) => {
  const Component = onClick ? motion.div : 'div';
  
  const cardProps = onClick ? {
    whileHover: hover ? { scale: 1.02, y: -2 } : {},
    whileTap: { scale: 0.98 },
    className: `
      bg-white rounded-2xl shadow-soft p-6 transition-all duration-200 cursor-pointer
      hover:shadow-xl border border-pink-50
      ${className}
    `,
    onClick
  } : {
    className: `
      bg-white rounded-2xl shadow-soft p-6 border border-pink-50
      ${className}
    `
  };

  return (
    <Component {...cardProps} {...props}>
      {children}
    </Component>
  );
};

export default Card;