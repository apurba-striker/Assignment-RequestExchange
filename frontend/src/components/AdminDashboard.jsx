import {useState,useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {returnService} from "../services/api";
import {LogOut,Search,XCircle} from "lucide-react";

const Status_option = [
  {value:"pending",label:"Pending",color:"yellow"},
  {value:"approved",label:"Approved",color:"green"},
  {value:"rejected",label:"Rejected",color:"red" },
];

const Status_color = [
  { label:"Total Requests",key:"total_requests",color: "blue"},
  { label:"Pending",key:"pending"},
  { label:"Approved", key:"approved"},
  { label:"Rejected", key:"rejected"},
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [returns, setReturns] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedReturn, setSelectedReturn] = useState(null);
  const [statusUpdate, setStatusUpdate] = useState({ status: '', admin_notes: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [returnsRes, statsRes] = await Promise.all([
        returnService.getAll(),
        returnService.getStatistics(),
      ]);
      setReturns(returnsRes.data);
      setStatistics(statsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      const response = await returnService.getAll(searchTerm);
      setReturns(response.data);
    } catch (error) {
      console.error('Error searching:', error);
    }
  };

  const handleStatusUpdate = async (returnId) => {
    try {
      await returnService.updateStatus(returnId, statusUpdate);
      setSelectedReturn(null);
      setStatusUpdate({ status: '', admin_notes: '' });
      fetchData();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const getStatusColor = (status) => {
     const statusConfig = Status_option.find(
      (option) => option.value === status
    );
    if (!statusConfig) return "bg-gray-100 text-gray-800";

    return `bg-${statusConfig.color}-100 text-${statusConfig.color}-800`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-lg font-semibold text-gray-700">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-md flex justify-between items-center px-8 py-4">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          Admin Dashboard
        </h1>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-all"
        >
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </header>

      {statistics && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-8 max-w-7xl mx-auto">
          {Status_color.map((stat, i) => (
            <div
              key={i}
              className={`bg-white shadow-sm border-t-4 border-${stat.color}-500 rounded-xl p-6 hover:shadow-lg transition-all duration-200 hover:scale-105`}
            >
              <h3 className="text-gray-600 text-sm font-medium mb-2">
                {stat.label}
              </h3>
              <p className={`text-4xl font-bold text-${stat.color}-600`}>
                {statistics[stat.key] || 0}
              </p>
            </div>
          ))}
        </div>
      )}

      <div className="max-w-7xl mx-auto p-8">
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex flex-1 items-center border border-gray-300 rounded-md overflow-hidden">
            <Search className="ml-3 text-gray-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by barcode, username, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1 px-3 py-2 outline-none text-sm"
            />
          </div>
          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 text-sm"
          >
            Search
          </button>
          <button
            onClick={fetchData}
            className="bg-gray-500 text-white px-5 py-2 rounded-md hover:bg-gray-600 text-sm"
          >
            Reset
          </button>
        </div>

        <div className="bg-white shadow-sm rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-gray-700 uppercase text-xs font-semibold">
              <tr>
                <th className="px-6 py-3 text-left">ID</th>
                <th className="px-6 py-3 text-left">User</th>
                <th className="px-6 py-3 text-left">Barcode</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Date</th>
                <th className="px-6 py-3 text-left">Media</th>
                <th className="px-6 py-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {returns.map((returnItem) => (
                <tr
                  key={returnItem.id}
                  className="hover:bg-gray-50 transition-all"
                >
                  <td className="px-6 py-3">{returnItem.id}</td>
                  <td className="px-6 py-3">
                    <p className="font-medium">{returnItem.user_details.username}</p>
                    <p className="text-gray-500 text-xs">{returnItem.user_details.email}</p>
                  </td>
                  <td className="px-6 py-3">{returnItem.barcode}</td>
                  <td className="px-6 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        returnItem.status
                      )}`}
                    >
                      {returnItem.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    {new Date(returnItem.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-3">
                    {returnItem.media_files?.length || 0} file(s)
                  </td>
                  <td className="px-6 py-3">
                    <button
                      onClick={() => {
                        setSelectedReturn(returnItem);
                        setStatusUpdate({
                          status: returnItem.status,
                          admin_notes: returnItem.admin_notes || '',
                        });
                      }}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedReturn && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 relative animate-fadeIn">
            <button
              onClick={() => setSelectedReturn(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <XCircle className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-semibold mb-4">Return Request Details</h2>

            <div className="bg-gray-50 p-4 rounded-md mb-4 space-y-2 text-sm">
              <p><strong>User:</strong> {selectedReturn.user_details.username}</p>
              <p><strong>Email:</strong> {selectedReturn.user_details.email}</p>
              <p><strong>Barcode:</strong> {selectedReturn.barcode}</p>
              <p><strong>Status:</strong> {selectedReturn.status}</p>
              <p><strong>Submitted:</strong> {new Date(selectedReturn.created_at).toLocaleString()}</p>
            </div>

            {selectedReturn.media_files?.length > 0 && (
              <div className="mb-4">
                <h3 className="font-medium mb-2">Uploaded Media</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {selectedReturn.media_files.map((media) => (
                    <div key={media.id}>
                      {media.media_type === 'image' ? (
                        <img
                          src={media.file_url}
                          alt="proof"
                          className="w-full h-40 object-cover rounded-md"
                        />
                      ) : (
                        <video
                          src={media.file_url}
                          controls
                          className="w-full h-40 rounded-md"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h3 className="font-medium mb-2">Update Status</h3>
              <select
                value={statusUpdate.status}
                onChange={(e) =>
                  setStatusUpdate({ ...statusUpdate, status: e.target.value })
                }
                className="w-full border border-gray-300 rounded-md p-2 mb-3"
              >
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>

              <textarea
                placeholder="Admin notes (optional)"
                value={statusUpdate.admin_notes}
                onChange={(e) =>
                  setStatusUpdate({ ...statusUpdate, admin_notes: e.target.value })
                }
                className="w-full border border-gray-300 rounded-md p-2 h-24 mb-4"
              />

              <div className="flex gap-3">
                <button
                  onClick={() => handleStatusUpdate(selectedReturn.id)}
                  className="flex-1 bg-green-600 text-white py-2 rounded-md hover:bg-green-700"
                >
                  Update
                </button>
                <button
                  onClick={() => setSelectedReturn(null)}
                  className="flex-1 bg-gray-500 text-white py-2 rounded-md hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
