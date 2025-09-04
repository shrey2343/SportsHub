import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaBaseballBall, FaTableTennis, FaFootballBall, FaBasketballBall } from "react-icons/fa";

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white overflow-hidden">
      {/* Animated Sports Icons Background */}
      <motion.div className="absolute text-yellow-400 text-6xl" initial={{ x: -100, y: 0, opacity: 0 }} animate={{ x: "100vw", y: [0, 60, -60, 0], opacity: 0.3 }} transition={{ repeat: Infinity, duration: 16, ease: "linear" }}><FaBaseballBall /></motion.div>
      <motion.div className="absolute text-pink-400 text-6xl" initial={{ x: "100vw", y: -120, opacity: 0 }} animate={{ x: "-100vw", y: [0, -70, 70, 0], opacity: 0.3 }} transition={{ repeat: Infinity, duration: 20, ease: "linear" }}><FaTableTennis /></motion.div>
      <motion.div className="absolute text-green-400 text-7xl" initial={{ y: "100vh", opacity: 0 }} animate={{ y: "-100vh", opacity: 0.3 }} transition={{ repeat: Infinity, duration: 22, ease: "linear" }}><FaFootballBall /></motion.div>
      <motion.div className="absolute text-blue-400 text-5xl" initial={{ x: -50, y: "100vh", opacity: 0 }} animate={{ x: "100vw", y: "-100vh", opacity: 0.3 }} transition={{ repeat: Infinity, duration: 18, ease: "linear" }}><FaBasketballBall /></motion.div>

      {/* Navigation Bar */}
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

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
            Privacy Policy
          </h1>
          
          <div className="bg-gray-900/80 backdrop-blur-md border border-gray-700 rounded-2xl p-8 space-y-8 shadow-2xl">
            <div>
              <h2 className="text-2xl font-semibold mb-4 text-white">1. Information We Collect</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                We collect information you provide directly to us, such as when you create an account, 
                register for a club, or contact us for support.
              </p>
              <ul className="text-gray-300 space-y-2 ml-6">
                <li>• Personal information (name, email address, phone number)</li>
                <li>• Profile information (sports preferences, position, profile pictures)</li>
                <li>• Club and membership information</li>
                <li>• Communication preferences</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4 text-white">2. How We Use Your Information</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                We use the information we collect to provide, maintain, and improve our services:
              </p>
              <ul className="text-gray-300 space-y-2 ml-6">
                <li>• Process your registrations and manage your account</li>
                <li>• Connect you with clubs and other users</li>
                <li>• Send you important updates and notifications</li>
                <li>• Provide customer support</li>
                <li>• Improve our platform and develop new features</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4 text-white">3. Information Sharing</h2>
              <p className="text-gray-300 leading-relaxed">
                We do not sell, trade, or otherwise transfer your personal information to third parties 
                without your consent, except as described in this policy. We may share information with 
                club administrators and other members as necessary to provide our services.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4 text-white">4. Data Security</h2>
              <p className="text-gray-300 leading-relaxed">
                We implement appropriate security measures to protect your personal information against 
                unauthorized access, alteration, disclosure, or destruction. However, no method of 
                transmission over the internet is 100% secure.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4 text-white">5. Your Rights</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                You have the right to:
              </p>
              <ul className="text-gray-300 space-y-2 ml-6">
                <li>• Access and update your personal information</li>
                <li>• Delete your account and associated data</li>
                <li>• Opt out of marketing communications</li>
                <li>• Request a copy of your data</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4 text-white">6. Cookies and Tracking</h2>
              <p className="text-gray-300 leading-relaxed">
                We use cookies and similar technologies to enhance your experience, analyze usage, 
                and provide personalized content. You can control cookie settings through your browser.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4 text-white">7. Children's Privacy</h2>
              <p className="text-gray-300 leading-relaxed">
                Our services are not intended for children under 13. We do not knowingly collect 
                personal information from children under 13. If you believe we have collected such 
                information, please contact us immediately.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4 text-white">8. Changes to This Policy</h2>
              <p className="text-gray-300 leading-relaxed">
                We may update this privacy policy from time to time. We will notify you of any 
                changes by posting the new policy on this page and updating the "Last Updated" date.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4 text-white">9. Contact Us</h2>
              <p className="text-gray-300 leading-relaxed">
                If you have any questions about this privacy policy, please contact us at 
                <span className="text-blue-400"> privacy@sportshub.com</span>
              </p>
            </div>

            <div className="border-t border-gray-700 pt-6">
              <p className="text-gray-400 text-sm">
                Last Updated: August 2025
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 bg-gray-900/90 backdrop-blur-md border-t border-gray-700">
        <div className="container mx-auto px-6 py-8 text-center">
          <p className="text-gray-400">
            © 2025 SportsHub. All rights reserved. Made with ❤️ for sports enthusiasts.
          </p>
        </div>
      </footer>
    </div>
  );
}
