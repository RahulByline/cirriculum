import React, { useState } from 'react';
import { Shield, AlertCircle, CheckCircle, LogOut, Lock } from 'lucide-react';

interface AdminAuthProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

const ADMIN_PASSCODE = '8411848666';

const AdminAuth: React.FC<AdminAuthProps> = ({ children, requireAuth = false }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePasscodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    // Simulate a small delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500));

    if (passcode === ADMIN_PASSCODE) {
      setIsAdmin(true);
      setPasscode('');
    } else {
      setError('Invalid passcode. Please try again.');
    }
    
    setIsSubmitting(false);
  };

  const handleLogout = () => {
    setIsAdmin(false);
    setPasscode('');
    setError('');
  };

  // Show passcode modal only if auth is required and user is not admin
  if (requireAuth && !isAdmin) {
    return (
      <>
        {children}
        
        {/* Passcode Modal */}
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-center mb-6">
                <div className="bg-blue-100 p-3 rounded-full">
                  <Shield className="w-8 h-8 text-blue-600" />
                </div>
              </div>
              
              <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">
                Admin Access Required
              </h2>
              <p className="text-center text-gray-600 mb-6">
                Please enter the admin passcode to continue
              </p>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
                  <div className="flex items-center">
                    <AlertCircle className="w-4 h-4 text-red-600 mr-2" />
                    <p className="text-red-800 text-sm">{error}</p>
                  </div>
                </div>
              )}

              {/* Passcode Form */}
              <form onSubmit={handlePasscodeSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Lock className="w-4 h-4 inline mr-1" />
                    Admin Passcode
                  </label>
                  <input
                    type="password"
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-lg tracking-widest"
                    placeholder="Enter passcode"
                    maxLength={10}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || passcode.length === 0}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Access Admin Panel</span>
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="text-center">
                  <p className="text-xs text-gray-500">
                    Enter the correct passcode to access administrative features.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Show authenticated admin content with logout option only if user is admin
  if (isAdmin) {
    return (
      <div>
        {/* Admin Status Bar */}
        <div className="bg-green-600 text-white px-4 py-2 text-sm">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4" />
              <span>Admin access granted</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-1 hover:bg-green-700 px-2 py-1 rounded transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Exit Admin</span>
            </button>
          </div>
        </div>
        {children}
      </div>
    );
  }

  // For regular users, just show the content without any auth requirements
  return <>{children}</>;
};

export default AdminAuth;