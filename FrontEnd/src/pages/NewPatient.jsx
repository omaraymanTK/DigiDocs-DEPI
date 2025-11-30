import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LogOut, Users, Calendar, LayoutDashboard, 
  Stethoscope, ArrowLeft 
} from 'lucide-react';

const NewPatient = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => navigate('/');
  const handleCancel = () => navigate('/patients');

  const handleSubmit = (e) => {
    e.preventDefault();

    const newPatient = {
      name: e.target.name.value,
      phone: e.target.phone.value,
      dob: e.target.dob.value,
      age: e.target.dob.value, 
      gender: e.target.gender.value,
      address: e.target.address.value,
      chronicDiseases: e.target.chronicDiseases.value,
      allergies: e.target.allergies.value,
      medicalHistory: e.target.medicalHistory.value,
      avatar: "bg-blue-100 text-blue-600",
      conditions: e.target.chronicDiseases.value,
    };

    navigate('/patients', { state: { newPatient } });
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-sm">
              <Stethoscope className="w-5 h-5" />
            </div>
            <span className="text-blue-600 font-semibold text-lg">Neurotology</span>
          </div>
          <p className="text-sm text-gray-500">Doctor Portal</p>
          <p className="text-sm font-medium text-gray-800 mt-1">Dr. John Smith</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 text-gray-800 transition"
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="font-medium">Dashboard</span>
          </button>

          <button
            onClick={() => navigate('/patients')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 text-gray-800 transition"
          >
            <Users className="w-5 h-5" />
            <span className="font-medium">Patients</span>
          </button>

          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 text-gray-800 transition">
            <Calendar className="w-5 h-5" />
            <span className="font-medium">Appointments</span>
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

      <div className="flex-1 overflow-auto">
        <div className="p-8 max-w-4xl mx-auto">

          <button
            onClick={() => navigate('/patients')}
            className="flex items-center gap-2 text-gray-700 hover:text-blue-600 mb-6 font-medium transition"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Patients
          </button>

          <div className="bg-white p-8 rounded-xl shadow-md border border-gray-200">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">New Patient Registration</h1>

            <form onSubmit={handleSubmit} className="space-y-6">

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter patient name"
                    required
                    className="w-full h-11 px-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-1">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="+1-555-0000"
                    required
                    className="w-full h-11 px-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-1">
                    Date of Birth <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="dob"
                    required
                    className="w-full h-11 px-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-1">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="gender"
                    required
                    className="w-full h-11 px-3 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="">Select gender...</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1">Address</label>
                <input
                  type="text"
                  name="address"
                  placeholder="Enter full address"
                  className="w-full h-11 px-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1">Chronic Diseases</label>
                <textarea
                  name="chronicDiseases"
                  placeholder="List chronic conditions"
                  className="w-full min-h-24 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1">Allergies</label>
                <textarea
                  name="allergies"
                  placeholder="List known allergies"
                  className="w-full min-h-24 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1">Medical History</label>
                <textarea
                  name="medicalHistory"
                  placeholder="Relevant medical history"
                  className="w-full min-h-24 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                />
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-8 h-11 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-8 h-11 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition shadow-sm"
                >
                  Add Patient
                </button>
              </div>
            </form>

          </div>
        </div>
      </div>
    </div>
  );
};

export default NewPatient;
