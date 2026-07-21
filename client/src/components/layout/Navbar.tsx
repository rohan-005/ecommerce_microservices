import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ShoppingBag, Menu, X, LogOut, User as UserIcon } from 'lucide-react';
import toast from 'react-hot-toast';

export const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Successfully logged out');
    navigate('/');
    setIsOpen(false);
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive
        ? 'text-primary bg-blue-50'
        : 'text-slate-600 hover:text-primary hover:bg-slate-50'
    }`;

  const mobileNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    `block px-3 py-2 rounded-md text-base font-medium transition-colors ${
      isActive
        ? 'text-primary bg-blue-50'
        : 'text-slate-600 hover:text-primary hover:bg-slate-50'
    }`;

  return (
    <nav className="sticky top-0 z-40 bg-white border-b border-slate-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <ShoppingBag className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg text-slate-800 tracking-tight">
                ShopSync <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-100 text-primary">Micro</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <NavLink to="/" className={navLinkClass}>
              Home
            </NavLink>

            {isAuthenticated ? (
              <>
                <NavLink to="/profile" className={navLinkClass}>
                  <span className="flex items-center gap-1.5">
                    <UserIcon className="w-4 h-4" />
                    Profile ({user?.name})
                  </span>
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className={navLinkClass}>
                  Login
                </NavLink>
                <NavLink to="/register" className={navLinkClass}>
                  Register
                </NavLink>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-slate-500 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary cursor-pointer"
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      <div className={`${isOpen ? 'block' : 'hidden'} md:hidden`} id="mobile-menu">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-slate-100">
          <NavLink
            to="/"
            onClick={() => setIsOpen(false)}
            className={mobileNavLinkClass}
          >
            Home
          </NavLink>

          {isAuthenticated ? (
            <>
              <NavLink
                to="/profile"
                onClick={() => setIsOpen(false)}
                className={mobileNavLinkClass}
              >
                Profile ({user?.name})
              </NavLink>
              <button
                onClick={handleLogout}
                className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors cursor-pointer"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                onClick={() => setIsOpen(false)}
                className={mobileNavLinkClass}
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                onClick={() => setIsOpen(false)}
                className={mobileNavLinkClass}
              >
                Register
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
