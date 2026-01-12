import { useNavigate } from "react-router-dom";

export default function Page() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-700 text-white">

      <h1 className="text-4xl font-bold mb-4">Welcome to the Platform</h1>
      <p className="text-lg opacity-90 mb-8">
        Manage your projects. Track your progress. Grow faster.
      </p>

      <button
        onClick={() => navigate("/login")}
        className="px-8 py-3 rounded-full bg-white text-indigo-600 font-semibold 
                   hover:bg-indigo-100 transition-all duration-200 shadow-lg"
      >
        Go to Login
      </button>

    </div>
  );
}
