import { useNavigate } from "react-router-dom";

export default function PublicNavbar() {
  const navigate = useNavigate();

  return (
    <nav className="relative z-20 bg-gray-900/80 backdrop-blur-md border-b border-gray-700">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-2xl font-bold text-yellow-400">
            <span>🏆</span>
            <span>SportsHub</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="text-gray-300 hover:text-white font-medium transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => navigate('/about')}
              className="text-gray-300 hover:text-white font-medium transition-colors"
            >
              About
            </button>
            <button
              onClick={() => navigate('/contact')}
              className="text-gray-300 hover:text-white font-medium transition-colors"
            >
              Contact
            </button>
            <button
              onClick={() => navigate('/help')}
              className="text-gray-300 hover:text-white font-medium transition-colors"
            >
              Help
            </button>
            <button
              onClick={() => navigate('/login')}
              className="text-gray-300 hover:text-white font-medium transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate('/register')}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-all duration-300"
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
