import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, Check, Trash2, Settings, Archive } from 'lucide-react';
import { Button } from '../ui/button';

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  type = 'default',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isLoading = false
}) => {
  const getTypeConfig = (type) => {
    switch (type) {
      case 'delete':
        return {
          icon: Trash2,
          iconColor: 'text-red-400',
          confirmButtonClass: 'bg-red-500/20 border-red-500/30 text-red-300 hover:bg-red-500/30',
          title: title || 'Delete Item',
          message: message || 'This action cannot be undone. Are you sure you want to delete this item?'
        };
      case 'archive':
        return {
          icon: Archive,
          iconColor: 'text-yellow-400',
          confirmButtonClass: 'bg-yellow-500/20 border-yellow-500/30 text-yellow-300 hover:bg-yellow-500/30',
          title: title || 'Archive Item',
          message: message || 'Are you sure you want to archive this item?'
        };
      case 'settings':
        return {
          icon: Settings,
          iconColor: 'text-blue-400',
          confirmButtonClass: 'bg-blue-500/20 border-blue-500/30 text-blue-300 hover:bg-blue-500/30',
          title: title || 'Apply Settings',
          message: message || 'Are you sure you want to apply these changes?'
        };
      default:
        return {
          icon: AlertTriangle,
          iconColor: 'text-orange-400',
          confirmButtonClass: 'bg-orange-500/20 border-orange-500/30 text-orange-300 hover:bg-orange-500/30',
          title,
          message
        };
    }
  };

  const config = getTypeConfig(type);
  const IconComponent = config.icon;

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  const dialogVariants = {
    hidden: { 
      opacity: 0,
      scale: 0.8,
      y: 20
    },
    visible: { 
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: 'spring',
        damping: 25,
        stiffness: 300
      }
    },
    exit: { 
      opacity: 0,
      scale: 0.8,
      y: 20,
      transition: {
        duration: 0.2
      }
    }
  };

  const iconVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: { 
      scale: 1, 
      rotate: 0,
      transition: {
        type: 'spring',
        damping: 15,
        stiffness: 300,
        delay: 0.1
      }
    }
  };

  const buttonVariants = {
    hover: { scale: 1.02 },
    tap: { scale: 0.98 }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'Enter') {
      onConfirm();
    }
  };

  React.useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            variants={dialogVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md mx-auto bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Glass effect overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-white/10 to-transparent pointer-events-none" />
            
            {/* Close button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 text-white/70 hover:text-white transition-colors rounded-full hover:bg-white/10"
            >
              <X size={20} />
            </motion.button>

            <div className="relative p-6 pt-8">
              {/* Icon */}
              <div className="flex justify-center mb-4">
                <motion.div
                  variants={iconVariants}
                  initial="hidden"
                  animate="visible"
                  className={`p-3 rounded-full bg-white/10 border border-white/20 ${config.iconColor}`}
                >
                  <IconComponent size={24} />
                </motion.div>
              </div>

              {/* Title */}
              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl font-semibold text-white text-center mb-2"
              >
                {config.title}
              </motion.h3>

              {/* Message */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-white/80 text-center mb-6 leading-relaxed"
              >
                {config.message}
              </motion.p>

              {/* Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex gap-3"
              >
                <motion.button
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  onClick={onClose}
                  disabled={isLoading}
                  className="flex-1 px-4 py-3 bg-white/10 border border-white/20 text-white rounded-xl font-medium hover:bg-white/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {cancelText}
                </motion.button>

                <motion.button
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  onClick={onConfirm}
                  disabled={isLoading}
                  className={`flex-1 px-4 py-3 border rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${config.confirmButtonClass} ${
                    isLoading ? 'cursor-wait' : ''
                  }`}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
                      />
                      Processing...
                    </div>
                  ) : (
                    confirmText
                  )}
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmDialog;