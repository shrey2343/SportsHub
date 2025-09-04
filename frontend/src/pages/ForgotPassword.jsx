import { useState } from "react";
import api from "../api.jsx";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaBaseballBall, FaTableTennis, FaFootballBall } from "react-icons/fa";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/forgot-password", { email });
      setMessage(res.data.message || "Password reset email sent!");
      setEmail("");
      setTimeout(() => navigate("/login"), 4000);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 overflow-hidden">
      {/* 🔥 Animated Sports Icons */}
      <motion.div
        className="absolute text-yellow-400 text-6xl"
        initial={{ x: -100, y: 0, opacity: 0 }}
        animate={{ x: "100vw", y: [0, 60, -60, 0], opacity: 0.3 }}
        transition={{ repeat: Infinity, duration: 16, ease: "linear" }}
      >
        <FaBaseballBall />
      </motion.div>

      <motion.div
        className="absolute text-pink-400 text-6xl"
        initial={{ x: "100vw", y: -120, opacity: 0 }}
        animate={{ x: "-100vw", y: [0, -70, 70, 0], opacity: 0.3 }}
        transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
      >
        <FaTableTennis />
      </motion.div>

      <motion.div
        className="absolute text-green-400 text-7xl"
        initial={{ y: "100vh", opacity: 0 }}
        animate={{ y: "-100vh", opacity: 0.3 }}
        transition={{ repeat: Infinity, duration: 22, ease: "linear" }}
      >
        <FaFootballBall />
      </motion.div>

      {/* 💡 Glassmorphism Card */}
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.7 }}
        className="relative z-10 bg-gray-900/80 backdrop-blur-md border border-gray-700 shadow-2xl rounded-2xl p-8 w-full max-w-md"
      >
        <div className="text-center mb-6">
          <div className="text-4xl mb-4">🔐</div>
          <h2 className="text-3xl font-extrabold text-white mb-2">
            Forgot Password?
          </h2>
          <p className="text-gray-400">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-300 mb-1">Email Address</label>
            <input
              type="email"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 bg-gray-800 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-semibold shadow-lg hover:opacity-90 transition duration-300 disabled:opacity-50"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Sending...
              </div>
            ) : (
              "Send Reset Link"
            )}
          </button>
        </form>

        {message && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 bg-green-600/70 text-white px-4 py-3 rounded-lg text-center"
          >
            ✅ {message}
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 bg-red-600/70 text-white px-4 py-3 rounded-lg text-center"
          >
            ❌ {error}
          </motion.div>
        )}

        {/* 🔗 Back to Login */}
        <div className="text-center mt-6">
          <Link
            to="/login"
            className="text-blue-400 hover:underline transition"
          >
            ← Back to Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default ForgotPassword;
