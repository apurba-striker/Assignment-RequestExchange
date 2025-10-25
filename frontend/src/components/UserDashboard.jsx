import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { returnService, authService } from '../services/api';
import { LogOut } from 'lucide-react';

const UserDashboard = () => {
  const navigate = useNavigate();
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [returnsRes, profileRes] = await Promise.all([
        returnService.getAll(),
        authService.getProfile(),
      ]);
      setReturns(returnsRes.data);
      setUser(profileRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const getStatusBadgeClasses = (status) => {
    const baseClasses = "inline-block px-4 py-1 rounded-full text-xs font-bold text-white";
    const statusClasses = {
      pending: 'bg-yellow-500',
      approved: 'bg-green-600',
      rejected: 'bg-red-600',
    };
    return `${baseClasses} ${statusClasses[status] || 'bg-gray-600'}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-xl">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="px-10 py-5 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">User Dashboard</h1>
          <div className="flex items-center gap-5">
            <span className="font-semibold text-gray-700">
              Welcome, {user?.username}
            </span>
            <button
             onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-all"
            >
            <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-10 py-10">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-semibold text-gray-900">My Return Requests</h2>
          <button
            onClick={() => navigate('/create-return')}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
          >
            + New Return Request
          </button>
        </div>
        {returns.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm text-center py-16 px-5">
            <p className="text-gray-600 text-lg mb-6">No return requests yet</p>
            <button
              onClick={() => navigate('/create-return')}
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
            >
              Create Your First Request
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {returns.map((returnItem) => (
              <div
                key={returnItem.id}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6"
              >
                {/* Card Header */}
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Barcode: {returnItem.barcode}
                  </h3>
                  <span className={getStatusBadgeClasses(returnItem.status)}>
                    {returnItem.status.toUpperCase()}
                  </span>
                </div>

                {/* Date */}
                <p className="text-sm text-gray-500 mb-4">
                  Submitted: {new Date(returnItem.created_at).toLocaleDateString()}
                </p>

                {/* Media Files */}
                {returnItem.media_files && returnItem.media_files.length > 0 && (
                  <div className="mt-5">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">
                      Uploaded Media ({returnItem.media_files.length})
                    </h4>
                    <div className="grid grid-cols-3 gap-2">
                      {returnItem.media_files.map((media) => (
                        <div key={media.id} className="relative">
                          {media.media_type === 'image' ? (
                            <img
                              src={media.file_url}
                              alt="Return proof"
                              className="w-full h-24 object-cover rounded-lg"
                            />
                          ) : (
                            <video
                              src={media.file_url}
                              className="w-full h-24 object-cover rounded-lg"
                              controls
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Admin Notes */}
                {returnItem.admin_notes && (
                  <div className="mt-4 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                    <p className="text-sm font-semibold text-gray-900 mb-1">
                      Admin Notes:
                    </p>
                    <p className="text-sm text-gray-700">{returnItem.admin_notes}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default UserDashboard;
