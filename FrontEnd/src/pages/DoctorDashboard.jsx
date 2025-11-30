import Sidebar from "./Sidebar";
import { Users, CalendarCheck, Pill } from "lucide-react";

const DoctorDashboard = () => {
  const stats = [
    { label: "Total Patients", value: "3", icon: Users, color: "bg-blue-100 text-blue-600" },
    { label: "Today's Appointments", value: "0", icon: CalendarCheck, color: "bg-green-100 text-green-600" },
    { label: "Active Medicines", value: "6", icon: Pill, color: "bg-purple-100 text-purple-600" },
  ];

  const appointmentStatus = [
    { status: "Waiting", count: 0, color: "bg-yellow-500" },
    { status: "In Progress", count: 0, color: "bg-blue-500" },
    { status: "Completed", count: 0, color: "bg-green-500" },
  ];

  

  const symptomCategories = [
    { name: "Hearing Issues", color: "border-blue-500" },
    { name: "Tinnitus", color: "border-purple-500" },
    { name: "Vertigo", color: "border-red-500" },
    { name: "Balance Disorders", color: "border-yellow-500" },
  ];

  const recentPatients = [
    { name: "John Anderson", phone: "+1-555-0123", gender: "Male", avatar: "bg-blue-100 text-blue-600" },
    { name: "Sarah Mitchell", phone: "+1-555-0456", gender: "Female", avatar: "bg-blue-100 text-blue-600" },
    { name: "Robert Chen", phone: "+1-555-0789", gender: "Male", avatar: "bg-blue-100 text-blue-600" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar currentPage="dashboard" userName="Dr. John Smith" />

      <div className="flex-1 overflow-auto p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Doctor Dashboard</h1>
          <p className="text-gray-500">Welcome back, Dr. John Smith</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
                </div>
                <div className={`p-4 rounded-full ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Appointments & Symptoms */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-6">Today's Appointments Status</h2>
            <div className="space-y-4">
              {appointmentStatus.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                    <span className="text-gray-700">{item.status}</span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    item.count > 0 ? "bg-gray-900 text-white" : "bg-gray-200 text-gray-500"
                  }`}>
                    {item.count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-6">Symptom Categories</h2>
            <div className="grid grid-cols-2 gap-4">
              {symptomCategories.map((category, index) => (
                <div key={index} className={`p-4 rounded-lg border-l-4 ${category.color} bg-white hover:bg-gray-100 cursor-pointer transition`}>
                  <span className="text-gray-700 font-medium">{category.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Patients */}
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">RECENT PATIENTS</h2>
          <div className="space-y-4">
            {recentPatients.map((patient, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-100 transition">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full ${patient.avatar} flex items-center justify-center`}>
                    <Users className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{patient.name}</p>
                    <p className="text-sm text-gray-500">{patient.phone}</p>
                  </div>
                </div>
                <span className="px-4 py-1 rounded-full border border-gray-300 text-sm text-gray-700">{patient.gender}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
