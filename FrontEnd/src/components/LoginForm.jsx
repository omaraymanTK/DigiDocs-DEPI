import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { toast } from "sonner";

const DEMO_ACCOUNTS = {
  doctor: { username: "dr.smith", password: "doctor123" },
  assistant: { username: "Maria Garcia", password: "assistant123" },
};

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!username.trim()) {
      setError("Username is required");
      return;
    }

    if (!password.trim()) {
      setError("Password is required");
      return;
    }

    const isDoctorValid =
      username === DEMO_ACCOUNTS.doctor.username &&
      password === DEMO_ACCOUNTS.doctor.password;
    const isAssistantValid =
      username === DEMO_ACCOUNTS.assistant.username &&
      password === DEMO_ACCOUNTS.assistant.password;

if (isDoctorValid || isAssistantValid) {
  toast.success("Login successful!", {
    description: `Welcome back, ${username}!`,
  });
  console.log("Login successful:", { username });

  if (isDoctorValid) {
    navigate("/dashboard"); 
  } else if (isAssistantValid) {
    navigate("/assistant"); 
  }
} else {
  setError("Invalid username or password");
  toast.error("Login failed", {
    description: "Please check your credentials and try again.",
  });
}

  };

  const quickLogin = (type) => {
    const account = DEMO_ACCOUNTS[type];
    setUsername(account.username);
    setPassword(account.password);
    toast.info("Demo credentials loaded", {
      description: `Click Sign In to continue as ${type}`,
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl bg-white p-8 shadow-lg">
          {/* Header */}
          <div className="mb-8 flex flex-col items-center space-y-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary">
              <i className="fa-solid fa-stethoscope text-white text-3xl"></i>
            </div>

            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold text-gray-800">Neurotology Clinical System</h1>
         
            </div>

            <p className="text-sm text-gray-500">Please sign in to continue</p>
          </div>

          <div className="mb-6 rounded-lg bg-blue-50 border border-blue-200 p-4">
            <h3 className="text-xs font-semibold text-gray-700 mb-2">
              Demo Accounts
            </h3>
            <div className="space-y-2 text-xs text-gray-600">
              <div className="flex items-center justify-between">
                <span>Doctor: dr.smith / doctor123</span>
                <button
                  type="button"
                  onClick={() => quickLogin("doctor")}
                  className="text-blue-600 hover:underline"
                >
                  Use
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span>Assistant: Maria Garcia / assistant123</span>
                <button
                  type="button"
                  onClick={() => quickLogin("assistant")}
                  className="text-blue-600 hover:underline"
                >
                  Use
                </button>
              </div>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-600">
                <i className="fa-solid fa-circle-exclamation"></i>
                <span>{error}</span>
              </div>
            )}

            {/* Username */}
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-semibold text-gray-700">
                Username
              </label>
              <div className="relative">
                <i className="fa-solid fa-user absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setError("");
                  }}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-semibold text-gray-700">
                Password
              </label>
              <div className="relative">
                <i className="fa-solid fa-lock absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700 transition"
            >
              Sign In
            </button>

            {/* Link to Register */}
            <div className="text-center mt-4">
              <p className="text-sm text-gray-500">
                Need to register as an assistant?{" "}
                <Link to="/register" className="text-blue-600 hover:underline font-medium">
                  Create Account
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
