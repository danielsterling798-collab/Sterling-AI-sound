import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export const Tooltip: React.FC<TooltipProps> = ({ 
  content, 
  children, 
  position = 'top' 
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2'
  };

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.1 }}
            className={`absolute z-[100] px-2 py-1 bg-zinc-800 border border-white/10 rounded text-[10px] font-mono text-white whitespace-nowrap pointer-events-none shadow-xl ${positionClasses[position]}`}
          >
            {content}
            {/* Arrow */}
            <div className={`absolute w-2 h-2 bg-zinc-800 border-r border-b border-white/10 rotate-45 ${
              position === 'top' ? 'top-full left-1/2 -translate-x-1/2 -translate-y-1/2 border-t-0 border-l-0' :
              position === 'bottom' ? 'bottom-full left-1/2 -translate-x-1/2 translate-y-1/2 border-b-0 border-r-0 rotate-[225deg]' :
              position === 'left' ? 'left-full top-1/2 -translate-y-1/2 -translate-x-1/2 border-l-0 border-b-0 rotate-[-45deg]' :
              'right-full top-1/2 -translate-y-1/2 translate-x-1/2 border-r-0 border-t-0 rotate-[135deg]'
            }`} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
