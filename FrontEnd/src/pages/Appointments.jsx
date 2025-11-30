import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import Sidebar from "./Sidebar";

const Appointments = () => {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar currentPage="appointments" userName="Dr. John Smith" />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8 max-w-6xl mx-auto">
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Appointments</h1>
              <p className="text-gray-500">Manage patient visits and examinations</p>
            </div>
            <button
              className="bg-black text-white px-4 py-2 rounded-lg flex items-center hover:bg-black/90"
              onClick={() => navigate("/new-appointment")}
            >
              <Plus className="w-4 h-4 mr-2" />
              New Visit
            </button>
          </div>

          {/* Today's Appointments */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Today's Appointments</h2>
            <p className="text-sm text-gray-500">0 appointments scheduled</p>
          </div>

          {/* Empty State */}
          <div className="bg-white shadow rounded-lg p-16 flex items-center justify-center">
            <p className="text-gray-500">No appointments scheduled for today</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Appointments;
