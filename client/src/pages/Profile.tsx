import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import { User as UserIcon, Shield, Mail, LogOut, FileCode } from 'lucide-react';
import toast from 'react-hot-toast';

export const Profile: React.FC = () => {
  const { user, logout, accessToken, refreshToken } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Successfully logged out');
    navigate('/');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 md:p-8 rounded-xl border border-slate-100 shadow-xs">
        <div className="flex items-center space-x-4">
          <div className="p-4 bg-blue-50 rounded-full text-primary">
            <UserIcon className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
              Welcome back, {user?.name || 'User'}!
            </h1>
            <p className="text-sm text-slate-500">
              Your session is active and authenticated in-memory.
            </p>
          </div>
        </div>
        <Button variant="danger" onClick={handleLogout} className="flex items-center gap-1.5 self-start md:self-auto cursor-pointer">
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* User Details Card */}
        <Card className="md:col-span-1 flex flex-col justify-between h-full space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-3 mb-4">
              Profile Info
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Full Name
                </label>
                <div className="flex items-center gap-2 mt-1 text-slate-700 font-medium">
                  <UserIcon className="w-4 h-4 text-slate-400" />
                  {user?.name}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Email Address
                </label>
                <div className="flex items-center gap-2 mt-1 text-slate-700 font-medium">
                  <Mail className="w-4 h-4 text-slate-400" />
                  {user?.email}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  User Role
                </label>
                <div className="flex items-center gap-2 mt-1 text-slate-700 font-medium">
                  <Shield className="w-4 h-4 text-slate-400" />
                  <span className="px-2 py-0.5 rounded text-xs font-bold bg-slate-100 text-slate-800 uppercase">
                    {user?.role || 'User'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Debug / Session Tokens Panel */}
        <Card className="md:col-span-2 space-y-6">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <FileCode className="w-5 h-5 text-primary" /> Active Session State
              </h3>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-100">
                Connected
              </span>
            </div>
            <p className="text-sm text-slate-500 mb-4">
              These tokens are saved strictly inside the application's memory (`AuthContext`). Refreshing the browser window will purge this state to test login recovery patterns.
            </p>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Access Token (In Memory)
                </label>
                <div className="mt-1.5 bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <code className="text-xs text-slate-600 block break-all font-mono select-all">
                    {accessToken || 'None'}
                  </code>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Refresh Token (In Memory)
                </label>
                <div className="mt-1.5 bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <code className="text-xs text-slate-600 block break-all font-mono select-all">
                    {refreshToken || 'None'}
                  </code>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
