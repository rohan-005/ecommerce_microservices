import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import { Compass } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="flex items-center justify-center py-12">
      <Card className="w-full max-w-md text-center flex flex-col items-center space-y-6">
        <div className="p-4 bg-slate-50 rounded-full text-slate-400">
          <Compass className="w-12 h-12 animate-pulse" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">404</h1>
          <h2 className="text-xl font-bold text-slate-700">Page Not Found</h2>
          <p className="text-sm text-slate-500">
            The page you are looking for does not exist or has been moved.
          </p>
        </div>
        <Link to="/">
          <Button variant="primary">
            Go back Home
          </Button>
        </Link>
      </Card>
    </div>
  );
};

export default NotFound;
