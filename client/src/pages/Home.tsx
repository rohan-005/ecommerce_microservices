import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import { ArrowRight, ShoppingBag, ShieldCheck, Database, Layers } from 'lucide-react';

export const Home: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center text-center space-y-12 max-w-4xl mx-auto py-4">
      {/* Hero Section */}
      <div className="space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-primary border border-blue-100 text-xs font-semibold uppercase tracking-wider mb-2 animate-pulse">
          <Layers className="w-3.5 h-3.5" /> Backend Testing Client
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Verify Your E-Commerce <br />
          <span className="bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
            Microservices
          </span>
        </h1>
        <p className="text-base md:text-xl text-slate-500 max-w-2xl mx-auto">
          A clean, responsive dashboard designed specifically to test backend authentication, state synchronization, and endpoints.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
        {isAuthenticated ? (
          <Link to="/profile">
            <Button size="lg" className="group">
              Go to Profile
              <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        ) : (
          <>
            <Link to="/login">
              <Button variant="outline" size="lg">
                Login to Account
              </Button>
            </Link>
            <Link to="/register">
              <Button size="lg" className="group">
                Get Started
                <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </>
        )}
      </div>

      {/* Feature Grids */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full pt-8">
        <Card className="flex flex-col items-center text-center p-6 space-y-3">
          <div className="p-3 bg-blue-50 rounded-lg text-primary">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-semibold text-lg text-slate-800">Secure Auth Flow</h3>
          <p className="text-sm text-slate-500">
            Verify register, login, and 6-digit OTP verification microservices with state synchronization.
          </p>
        </Card>

        <Card className="flex flex-col items-center text-center p-6 space-y-3">
          <div className="p-3 bg-blue-50 rounded-lg text-primary">
            <Database className="w-6 h-6" />
          </div>
          <h3 className="font-semibold text-lg text-slate-800">In-Memory Tokens</h3>
          <p className="text-sm text-slate-500">
            Handles Access and Refresh tokens strictly in-memory (no localStorage) for secure API headers.
          </p>
        </Card>

        <Card className="flex flex-col items-center text-center p-6 space-y-3">
          <div className="p-3 bg-blue-50 rounded-lg text-primary">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <h3 className="font-semibold text-lg text-slate-800">No Products Yet</h3>
          <p className="text-sm text-slate-500">
            This module focuses solely on user onboarding. Catalog and ordering microservices coming soon.
          </p>
        </Card>
      </div>
    </div>
  );
};

export default Home;
