import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { returnService, authService } from "../services/api";
import { LogOut } from "lucide-react";

const UserDashboard = () => {
  const navigate = useNavigate();
  const [returns, setReturns] = useState([]);
  const [filteredReturns, setFilteredReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterReturns();
  }, [searchTerm, statusFilter, returns]);

  const fetchData = async () => {
    try {
      const [returnsRes, profileRes] = await Promise.all([
        returnService.getAll(),
        authService.getProfile(),
      ]);
      setReturns(returnsRes.data);
      setFilteredReturns(returnsRes.data);
      setUser(profileRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterReturns = () => {
    let filtered = returns;
    if (searchTerm) {
      filtered = filtered.filter((returnItem) =>
        returnItem.barcode.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (returnItem) => returnItem.status === statusFilter
      );
    }

    setFilteredReturns(filtered);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const getStatusBadgeClasses = (status) => {
    const baseClasses =
      "inline-block px-4 py-1 rounded-full text-xs font-bold text-white";
    const statusClasses = {
      pending: "bg-yellow-500",
      approved: "bg-green-600",
      rejected: "bg-red-600",
    };
    return `${baseClasses} ${statusClasses[status] || "bg-gray-600"}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-xl">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p>Loading...</p>
        </div>
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
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              My Return Requests
            </h2>
            <button
              onClick={() => navigate("/create-return")}
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
            >
              + New Return Request
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="max-w-2xl">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search by Barcode
                </label>
                <div className="relative w-full">
                  <input
                    type="text"
                    placeholder="Enter barcode..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 pl-15 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <svg
                    className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between text-sm">
              <p className="text-gray-600">
                Showing{" "}
                <span className="font-semibold">{filteredReturns.length}</span>{" "}
                of <span className="font-semibold">{returns.length}</span>{" "}
                return requests
              </p>
              {(searchTerm || statusFilter !== "all") && (
                <p className="text-blue-600 font-medium">Filters active</p>
              )}
            </div>
          </div>
        </div>
        {filteredReturns.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm text-center py-16 px-5">
            {returns.length === 0 ? (
              <>
                <svg
                  className="mx-auto h-12 w-12 text-gray-400 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <p className="text-gray-600 text-lg mb-6">
                  No return requests yet
                </p>
                <button
                  onClick={() => navigate("/create-return")}
                  className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
                >
                  Create Your First Request
                </button>
              </>
            ) : (
              <>
                <svg
                  className="mx-auto h-12 w-12 text-gray-400 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <p className="text-gray-600 text-lg mb-4">
                  No return requests found
                </p>
                <p className="text-gray-500 mb-6">
                  Try adjusting your search or filters
                </p>
                <button
                  onClick={handleClearFilters}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors font-medium"
                >
                  Clear Filters
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredReturns.map((returnItem) => (
              <div
                key={returnItem.id}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Barcode</p>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {returnItem.barcode}
                    </h3>
                  </div>
                  <span className={getStatusBadgeClasses(returnItem.status)}>
                    {returnItem.status.toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <svg
                    className="h-4 w-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  Submitted:{" "}
                  {new Date(returnItem.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </div>
                {returnItem.media_files &&
                  returnItem.media_files.length > 0 && (
                    <div className="mt-5">
                      <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                        <svg
                          className="h-4 w-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        Uploaded Media ({returnItem.media_files.length})
                      </h4>
                      <div className="grid grid-cols-3 gap-2">
                        {returnItem.media_files.map((media) => (
                          <div key={media.id} className="relative group">
                            {media.media_type === "image" ? (
                              <img
                                src={media.file_url}
                                alt="Return proof"
                                className="w-full h-24 object-cover rounded-lg cursor-pointer hover:opacity-75 transition-opacity"
                              />
                            ) : (
                              <video
                                src={media.file_url}
                                className="w-full h-24 object-cover rounded-lg cursor-pointer"
                                controls
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                {returnItem.admin_notes && (
                  <div className="mt-4 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                    <p className="text-sm font-semibold text-gray-900 mb-1 flex items-center">
                      <svg
                        className="h-4 w-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                        />
                      </svg>
                      Admin Notes:
                    </p>
                    <p className="text-sm text-gray-700">
                      {returnItem.admin_notes}
                    </p>
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
