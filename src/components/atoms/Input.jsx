import { forwardRef } from 'react';
import ApperIcon from '@/components/ApperIcon';

const Input = forwardRef(({
  type = 'text',
  label,
  error,
  icon,
  placeholder,
  className = '',
  ...props
}, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <ApperIcon name={icon} size={16} className="text-gray-400" />
          </div>
        )}
        
        <input
          ref={ref}
          type={type}
          placeholder={placeholder}
          className={`
            w-full px-4 py-3 rounded-2xl border transition-all duration-200
            ${icon ? 'pl-10' : ''}
            ${error 
              ? 'border-error bg-red-50 focus:ring-error/20 focus:border-error' 
              : 'border-gray-200 bg-white hover:border-gray-300 focus:ring-primary/20 focus:border-primary'
            }
            focus:outline-none focus:ring-4
            placeholder:text-gray-400
            ${className}
          `}
          {...props}
        />
      </div>
      
      {error && (
        <p className="mt-2 text-sm text-error flex items-center">
          <ApperIcon name="AlertCircle" size={14} className="mr-1" />
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;