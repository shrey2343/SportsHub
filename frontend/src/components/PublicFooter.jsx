import { useNavigate } from "react-router-dom";

export default function PublicFooter() {
  const navigate = useNavigate();

  return (
    <footer className="relative z-10 bg-gray-900/90 backdrop-blur-md border-t border-gray-700">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 text-2xl font-bold text-yellow-400 mb-4">
              <span>🏆</span>
              <span>SportsHub</span>
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              The ultimate sports management platform for clubs, coaches, and players. 
              Join thousands of sports enthusiasts in our community.
            </p>
            <div className="flex gap-4">
              <button className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Facebook</span>
                📘
              </button>
              <button className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Twitter</span>
                🐦
              </button>
              <button className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Instagram</span>
                📷
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => navigate('/register')}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Register
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate('/login')}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Sign In
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate('/about')}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  About Us
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate('/contact')}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => navigate('/help')}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Help Center
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate('/privacy')}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate('/terms')}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate('/help')}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  FAQ
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2024 SportsHub. All rights reserved. Made with ❤️ for sports enthusiasts.
          </p>
        </div>
      </div>
    </footer>
  );
}
