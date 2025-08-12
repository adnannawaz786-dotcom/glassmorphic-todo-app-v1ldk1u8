import React from 'react';
import { motion } from 'framer-motion';
import BottomNavigation from './BottomNavigation';

const Layout = ({ children, currentView, onViewChange }) => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background Layers */}
      <div className="fixed inset-0 z-0">
        {/* Primary Gradient Background */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-500"
        />
        
        {/* Secondary Overlay Gradient */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{ duration: 2, delay: 0.5 }}
          className="absolute inset-0 bg-gradient-to-tr from-pink-500/30 via-transparent to-amber-400/20"
        />
        
        {/* Animated Geometric Shapes */}
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl"
        />
        
        <motion.div
          animate={{
            x: [0, -80, 0],
            y: [0, 100, 0],
            rotate: [0, -180, -360],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/3 right-20 w-48 h-48 bg-cyan-300/20 rounded-full blur-2xl"
        />
        
        <motion.div
          animate={{
            x: [0, 50, 0],
            y: [0, -80, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-1/3 left-1/4 w-24 h-24 bg-purple-400/30 rounded-full blur-lg"
        />
        
        <motion.div
          animate={{
            x: [0, -60, 0],
            y: [0, 40, 0],
            rotate: [0, 90, 180, 270, 360],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-20 right-10 w-40 h-40 bg-pink-300/15 rounded-full blur-xl"
        />
        
        {/* Floating Particles */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -100, 0],
              x: [0, Math.random() * 100 - 50, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              delay: i * 0.5,
              ease: "easeInOut"
            }}
            className={`absolute w-2 h-2 bg-white/40 rounded-full blur-sm`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
        
        {/* Backdrop Blur Overlay */}
        <div className="absolute inset-0 backdrop-blur-[1px] bg-black/5" />
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header with Glassmorphic Effect */}
        <motion.header
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="sticky top-0 z-20 backdrop-blur-md bg-white/10 border-b border-white/20 shadow-lg"
        >
          <div className="px-4 py-4">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex items-center justify-center"
            >
              <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                Todo Glass
              </h1>
            </motion.div>
          </div>
        </motion.header>

        {/* Main Content Area */}
        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex-1 px-4 py-6 pb-24 overflow-hidden"
        >
          {/* Content Wrapper with Glassmorphic Container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="h-full max-w-md mx-auto"
          >
            <div className="h-full backdrop-blur-lg bg-white/10 rounded-3xl border border-white/20 shadow-2xl overflow-hidden">
              <div className="h-full p-6">
                {children}
              </div>
            </div>
          </motion.div>
        </motion.main>

        {/* Bottom Navigation */}
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
          className="fixed bottom-0 left-0 right-0 z-30"
        >
          <BottomNavigation currentView={currentView} onViewChange={onViewChange} />
        </motion.div>
      </div>

      {/* Additional Ambient Effects */}
      <div className="fixed inset-0 pointer-events-none z-5">
        {/* Subtle Vignette Effect */}
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black/20" />
        
        {/* Corner Highlights */}
        <motion.div
          animate={{
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-3xl"
        />
        
        <motion.div
          animate={{
            opacity: [0.1, 0.25, 0.1],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute bottom-0 right-0 w-40 h-40 bg-cyan-300/10 rounded-full blur-3xl"
        />
      </div>
    </div>
  );
};

export default Layout;