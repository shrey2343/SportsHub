import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaBaseballBall, FaTableTennis, FaFootballBall, FaBasketballBall } from "react-icons/fa";

export default function TermsOfService() {
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
            Terms of Service
          </h1>
          
          <div className="bg-gray-900/80 backdrop-blur-md border border-gray-700 rounded-2xl p-8 space-y-8 shadow-2xl">
            <div>
              <h2 className="text-2xl font-semibold mb-4 text-white">1. Acceptance of Terms</h2>
              <p className="text-gray-300 leading-relaxed">
                By accessing and using SportsHub, you accept and agree to be bound by the terms and 
                provision of this agreement. If you do not agree to abide by the above, please do not 
                use this service.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4 text-white">2. Description of Service</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                SportsHub provides a platform for sports management, including:
              </p>
              <ul className="text-gray-300 space-y-2 ml-6">
                <li>• Club creation and management for coaches</li>
                <li>• Player registration and profile management</li>
                <li>• Communication tools between coaches and players</li>
                <li>• Sports community building features</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4 text-white">3. User Accounts</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                To use certain features of SportsHub, you must create an account. You agree to:
              </p>
              <ul className="text-gray-300 space-y-2 ml-6">
                <li>• Provide accurate and complete information</li>
                <li>• Maintain the security of your account credentials</li>
                <li>• Notify us immediately of any unauthorized use</li>
                <li>• Accept responsibility for all activities under your account</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4 text-white">4. User Conduct</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                You agree not to use SportsHub to:
              </p>
              <ul className="text-gray-300 space-y-2 ml-6">
                <li>• Violate any applicable laws or regulations</li>
                <li>• Harass, abuse, or harm other users</li>
                <li>• Upload malicious content or spam</li>
                <li>• Attempt to gain unauthorized access to our systems</li>
                <li>• Interfere with the proper functioning of the platform</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4 text-white">5. Content and Intellectual Property</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                You retain ownership of content you upload to SportsHub. By uploading content, you grant 
                us a license to use, display, and distribute your content as necessary to provide our services.
              </p>
              <p className="text-gray-300 leading-relaxed">
                SportsHub and its original content, features, and functionality are owned by SportsHub 
                and are protected by international copyright, trademark, and other intellectual property laws.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4 text-white">6. Privacy and Data Protection</h2>
              <p className="text-gray-300 leading-relaxed">
                Your privacy is important to us. Please review our Privacy Policy, which also governs 
                your use of SportsHub, to understand our practices regarding the collection and use 
                of your personal information.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4 text-white">7. Termination</h2>
              <p className="text-gray-300 leading-relaxed">
                We may terminate or suspend your account and access to SportsHub immediately, without 
                prior notice, for any reason, including breach of these Terms of Service. Upon termination, 
                your right to use SportsHub will cease immediately.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4 text-white">8. Disclaimers</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                SportsHub is provided "as is" without warranties of any kind. We do not guarantee:
              </p>
              <ul className="text-gray-300 space-y-2 ml-6">
                <li>• Uninterrupted or error-free service</li>
                <li>• Accuracy of information provided by users</li>
                <li>• Compatibility with all devices or browsers</li>
                <li>• Security of data transmission</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4 text-white">9. Limitation of Liability</h2>
              <p className="text-gray-300 leading-relaxed">
                In no event shall SportsHub be liable for any indirect, incidental, special, consequential, 
                or punitive damages, including without limitation, loss of profits, data, use, goodwill, 
                or other intangible losses, resulting from your use of the service.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4 text-white">10. Governing Law</h2>
              <p className="text-gray-300 leading-relaxed">
                These Terms of Service shall be governed by and construed in accordance with the laws 
                of the jurisdiction in which SportsHub operates, without regard to its conflict of law provisions.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4 text-white">11. Changes to Terms</h2>
              <p className="text-gray-300 leading-relaxed">
                We reserve the right to modify these terms at any time. We will notify users of any 
                material changes by posting the new terms on this page and updating the "Last Updated" date.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4 text-white">12. Contact Information</h2>
              <p className="text-gray-300 leading-relaxed">
                If you have any questions about these Terms of Service, please contact us at 
                <span className="text-blue-400"> legal@sportshub.com</span>
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
