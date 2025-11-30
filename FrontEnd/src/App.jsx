import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
// Main pages
import Index from "./pages/Index";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import DoctorDashboard from "./pages/DoctorDashboard.jsx";
import AssistantDashboard from "./pages/AssistantDashboard.jsx";
import NewPatient from "./pages/NewPatient.jsx";
import Patients from "./pages/Patients.jsx";
import Appointments from "./pages/Appointments.jsx";
const queryClient = new QueryClient();
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* Toast notifications */}
      <Toaster position="top-right" />
      {/* App routing configuration */}
      <BrowserRouter>
        <Routes>
          {/* Home page */}
          <Route path="/" element={<Index />} />

          {/* Registration page */}
          <Route path="/register" element={<Register />} />

          <Route path="/dashboard" element={<DoctorDashboard />} />
          <Route path="/assistant" element={<AssistantDashboard />} />
          <Route path="/patients" element={<Patients />} />
          <Route path="/new-patient" element={<NewPatient />} />
          <Route path="/appointments" element={<Appointments />} />

          {/* 404 - Not Found page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
