import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Search, Phone, User, AlertTriangle } from "lucide-react";
import Sidebar from "./Sidebar";

const Patients = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const initialPatients = [
    { id: 1, name: "John Anderson", gender: "Male", phone: "+1-555-0123", age: "60 years old", allergies: "Penicillin", conditions: "Type 2 Diabetes, Hypertension", avatar: "bg-blue-100 text-blue-600" },
    { id: 2, name: "Sarah Mitchell", gender: "Female", phone: "+1-555-0456", age: "47 years old", allergies: null, conditions: "Migraine disorder", avatar: "bg-purple-100 text-purple-600" },
    { id: 3, name: "Robert Chen", gender: "Male", phone: "+1-555-0789", age: "35 years old", allergies: "Sulfa drugs", conditions: "Asthma", avatar: "bg-green-100 text-green-600" },
  ];

  const [patients, setPatients] = useState(initialPatients);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (location.state?.newPatient) {
      const newPatient = { ...location.state.newPatient, id: Date.now() };
      setPatients((prev) => [newPatient, ...prev]);
      navigate(location.pathname, { replace: true });
    }
  }, [location.state, navigate]);

  const filteredPatients = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.phone.includes(searchQuery)
  );

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar currentPage="patients" userName="Dr. John Smith" />

      <div className="flex-1 overflow-auto">
        <div className="p-8 max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Patient Records</h1>
          <p className="text-gray-600 text-lg mb-8">Manage patient information and medical history</p>

          <div className="flex gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search patients by name or phone..."
                className="pl-10 h-12 w-full bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button
              onClick={() => navigate("/new-patient")}
              className="h-12 px-6 bg-blue-700 text-white rounded-lg shadow hover:bg-blue-800 transition flex items-center gap-2"
            >
              New Patient
            </button>
          </div>

          <div className="space-y-4">
            {filteredPatients.map((patient) => (
              <div key={patient.id} className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition">
                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 rounded-full ${patient.avatar} flex items-center justify-center shadow`}>
                    <User className="w-7 h-7" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{patient.name}</h3>
                      <span className="px-3 py-1 text-xs rounded-full bg-gray-200 text-gray-700 font-medium">{patient.gender}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-4 h-4" />
                        <span>{patient.phone}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <User className="w-4 h-4" />
                        <span>{patient.age}</span>
                      </div>
                    </div>
                    {patient.allergies && (
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="w-4 h-4 text-orange-600" />
                        <span className="text-sm font-medium text-orange-600">Allergies: {patient.allergies}</span>
                      </div>
                    )}
                    <div className="text-sm text-gray-800">
                      <span className="font-medium">Conditions:</span> <span className="text-gray-600">{patient.conditions}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Patients;
