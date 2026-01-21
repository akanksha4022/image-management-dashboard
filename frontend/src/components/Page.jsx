import { useNavigate } from "react-router-dom";

export default function Page() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br text-[#fbaea6]">

      <h1 className="text-4xl font-bold mb-4">Welcome</h1>
      

      <button
        onClick={() => navigate("/login")}
        className="px-8 py-3 rounded-full bg-white text-[#f4a89f] font-semibold 
                   hover:bg-[#ffdeda] transition-all duration-200 shadow-lg"
      >
        Go to Login
      </button>

    </div>
  );
}
