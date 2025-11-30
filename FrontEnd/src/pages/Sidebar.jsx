import { useNavigate } from "react-router-dom";
import { Stethoscope, LayoutDashboard, Users, Calendar, LogOut } from "lucide-react";

const Sidebar = ({ currentPage, userName }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-sm">
            <Stethoscope className="w-5 h-5" />
          </div>
          <span className="text-blue-600 font-semibold text-lg">Neurotology</span>
        </div>
        <p className="text-sm text-gray-500">Doctor Portal</p>
        <p className="text-sm font-medium text-gray-800 mt-1">{userName}</p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        <button
          onClick={() => navigate("/dashboard")}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-800 transition ${
            currentPage === "dashboard" ? "bg-blue-600 text-white shadow" : "hover:bg-gray-100"
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          Dashboard
        </button>

        <button
          onClick={() => navigate("/patients")}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-800 transition ${
            currentPage === "patients" ? "bg-blue-600 text-white shadow" : "hover:bg-gray-100"
          }`}
        >
          <Users className="w-5 h-5" />
          Patients
        </button>

        <button
          onClick={() => navigate("/appointments")}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-800 transition ${
            currentPage === "appointments" ? "bg-blue-600 text-white shadow" : "hover:bg-gray-100"
          }`}
        >
          <Calendar className="w-5 h-5" />
          Appointments
        </button>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 text-gray-800 transition"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
