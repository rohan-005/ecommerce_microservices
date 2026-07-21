import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
}

export const Loader: React.FC<LoaderProps> = ({ size = 'md', fullScreen = false }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  };

  const containerClasses = fullScreen
    ? 'fixed inset-0 z-50 flex items-center justify-center bg-slate-900/10 backdrop-blur-xs'
    : 'flex items-center justify-center p-8';

  return (
    <div className={containerClasses}>
      <Loader2 className={`${sizeClasses[size]} animate-spin text-primary`} />
    </div>
  );
};

export default Loader;
