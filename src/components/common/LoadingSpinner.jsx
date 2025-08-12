import React from 'react';
import { motion } from 'framer-motion';
import { Loader2, Circle, RotateCw, Zap } from 'lucide-react';
import { cn } from '../../lib/utils';

const LoadingSpinner = ({ 
  size = 'md', 
  variant = 'default',
  text = '',
  fullScreen = false,
  className = '',
  color = 'primary'
}) => {
  // Size configurations
  const sizeConfig = {
    xs: { spinner: 16, text: 'text-xs', padding: 'p-2' },
    sm: { spinner: 20, text: 'text-sm', padding: 'p-3' },
    md: { spinner: 24, text: 'text-base', padding: 'p-4' },
    lg: { spinner: 32, text: 'text-lg', padding: 'p-6' },
    xl: { spinner: 40, text: 'text-xl', padding: 'p-8' }
  };

  // Color configurations
  const colorConfig = {
    primary: 'text-blue-500',
    secondary: 'text-purple-500',
    success: 'text-green-500',
    warning: 'text-yellow-500',
    danger: 'text-red-500',
    white: 'text-white',
    muted: 'text-gray-400'
  };

  const config = sizeConfig[size];
  const spinnerColor = colorConfig[color];

  // Animation variants for different spinner types
  const spinVariants = {
    animate: {
      rotate: 360,
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: "linear"
      }
    }
  };

  const pulseVariants = {
    animate: {
      scale: [1, 1.2, 1],
      opacity: [0.5, 1, 0.5],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const bounceVariants = {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 0.8,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const dotsVariants = {
    animate: {
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const dotVariants = {
    animate: {
      y: [0, -8, 0],
      transition: {
        duration: 0.6,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  // Different spinner components
  const SpinnerDefault = () => (
    <motion.div
      variants={spinVariants}
      animate="animate"
      className={cn(spinnerColor)}
    >
      <Loader2 size={config.spinner} />
    </motion.div>
  );

  const SpinnerCircle = () => (
    <motion.div
      variants={spinVariants}
      animate="animate"
      className={cn(spinnerColor)}
    >
      <Circle size={config.spinner} />
    </motion.div>
  );

  const SpinnerRotate = () => (
    <motion.div
      variants={spinVariants}
      animate="animate"
      className={cn(spinnerColor)}
    >
      <RotateCw size={config.spinner} />
    </motion.div>
  );

  const SpinnerPulse = () => (
    <motion.div
      variants={pulseVariants}
      animate="animate"
      className={cn(
        'rounded-full border-2 border-current',
        spinnerColor
      )}
      style={{
        width: config.spinner,
        height: config.spinner
      }}
    />
  );

  const SpinnerDots = () => (
    <motion.div
      variants={dotsVariants}
      animate="animate"
      className="flex space-x-1"
    >
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          variants={dotVariants}
          className={cn(
            'w-2 h-2 rounded-full',
            spinnerColor.replace('text-', 'bg-')
          )}
        />
      ))}
    </motion.div>
  );

  const SpinnerBounce = () => (
    <motion.div
      variants={bounceVariants}
      animate="animate"
      className={cn(spinnerColor)}
    >
      <Zap size={config.spinner} />
    </motion.div>
  );

  // Render appropriate spinner based on variant
  const renderSpinner = () => {
    switch (variant) {
      case 'circle':
        return <SpinnerCircle />;
      case 'rotate':
        return <SpinnerRotate />;
      case 'pulse':
        return <SpinnerPulse />;
      case 'dots':
        return <SpinnerDots />;
      case 'bounce':
        return <SpinnerBounce />;
      default:
        return <SpinnerDefault />;
    }
  };

  // Container component
  const SpinnerContainer = ({ children }) => {
    const baseClasses = cn(
      'flex flex-col items-center justify-center',
      config.padding,
      className
    );

    if (fullScreen) {
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={cn(
            baseClasses,
            'fixed inset-0 z-50',
            'bg-black/20 backdrop-blur-sm',
            'glassmorphic-overlay'
          )}
        >
          <div className={cn(
            'glassmorphic rounded-2xl p-8',
            'bg-white/10 backdrop-blur-md',
            'border border-white/20',
            'shadow-xl'
          )}>
            {children}
          </div>
        </motion.div>
      );
    }

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className={baseClasses}
      >
        {children}
      </motion.div>
    );
  };

  return (
    <SpinnerContainer>
      <div className="flex items-center justify-center mb-2">
        {renderSpinner()}
      </div>
      
      {text && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={cn(
            config.text,
            'text-center font-medium',
            color === 'white' ? 'text-white/80' : 'text-gray-600'
          )}
        >
          {text}
        </motion.p>
      )}
    </SpinnerContainer>
  );
};

export default LoadingSpinner;