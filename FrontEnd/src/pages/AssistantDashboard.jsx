import { useNavigate } from 'react-router-dom';
import { Clock, Users, Plus, LogOut, Stethoscope } from 'lucide-react';

const AssistantDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-gray-50 text-gray-800">
      <div className="w-64 bg-white border-r flex flex-col">
        <div className="p-6 border-b">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
              <Stethoscope className="w-5 h-5 text-white" />
            </div>
            <span className="text-blue-600 font-semibold text-lg">Neurotology</span>
          </div>
          <p className="text-sm text-gray-500 mt-2">Assistant Portal</p>
          <p className="text-sm font-medium">Welcome, Maria Garcia</p>
        </div>
        <nav className="flex-1 p-4">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-blue-600 text-white mb-2 hover:bg-blue-700 transition">
            <Clock className="w-5 h-5" />
            <span className="font-medium">Patient Queue</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 text-gray-700 mb-2 transition">
            <Users className="w-5 h-5" />
            <span className="font-medium">All Patients</span>
          </button>

          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 text-gray-700 transition">
            <Plus className="w-5 h-5" />
            <span className="font-medium">New Patient</span>
          </button>
        </nav>
        <div className="p-4 border-t">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-start gap-3 text-gray-700 hover:text-blue-600 transition"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-auto p-8">
        <h1 className="text-3xl font-bold mb-2">Patient Queue</h1>
        <p className="text-gray-500 mb-8">Today's appointments and waiting list</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-white shadow-sm rounded-xl p-6 border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-2">Waiting</p>
                <p className="text-3xl font-bold text-yellow-600">0</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
          <div className="bg-white shadow-sm rounded-xl p-6 border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-2">In Progress</p>
                <p className="text-3xl font-bold text-blue-600">0</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white shadow-sm rounded-xl p-6 border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-2">Completed</p>
                <p className="text-3xl font-bold text-green-600">0</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white shadow-sm rounded-xl p-6 border">
          <h2 className="text-xl font-semibold mb-4">Today's Appointments (0)</h2>
          <div className="flex items-center justify-center py-16">
            <p className="text-gray-500">No appointments scheduled for today</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssistantDashboard;
