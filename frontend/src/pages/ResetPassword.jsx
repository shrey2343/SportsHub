import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Confetti from "react-confetti";
import { motion } from "framer-motion";
import { FaBaseballBall, FaTableTennis, FaFootballBall } from "react-icons/fa";

const ResetPassword = () => {
  const { token } = useParams(); // token from URL
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [variant, setVariant] = useState("info");
  const [success, setSuccess] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("Passwords do not match!");
      setVariant("danger");
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/auth/reset-password/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();
      setMessage(data.message);
      setVariant(data.success ? "success" : "danger");

      if (data.success) {
        setSuccess(true);
        setTimeout(() => navigate("/login"), 3000); // redirect after 3s
      }
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong!");
      setVariant("danger");
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

      {success && <Confetti recycle={false} numberOfPieces={400} />}

      {/* 💡 Glassmorphism Card */}
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.7 }}
        className="relative z-10 bg-gray-900/80 backdrop-blur-md border border-gray-700 shadow-2xl rounded-2xl p-8 w-full max-w-md"
      >
        <div className="text-center mb-6">
          <div className="text-4xl mb-4">🔑</div>
          <h2 className="text-3xl font-extrabold text-white mb-2">
            Reset Password
          </h2>
          <p className="text-gray-400">
            Enter your new password below
          </p>
        </div>

        <form onSubmit={handleReset} className="space-y-5">
          <div>
            <label className="block text-gray-300 mb-1">New Password</label>
            <input
              type="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 bg-gray-800 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-1">Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3 bg-gray-800 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-semibold shadow-lg hover:opacity-90 transition duration-300"
          >
            Reset Password
          </button>
        </form>

        {message && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-4 px-4 py-3 rounded-lg text-center ${
              variant === "success" 
                ? "bg-green-600/70 text-white" 
                : "bg-red-600/70 text-white"
            }`}
          >
            {variant === "success" ? "✅" : "❌"} {message}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default ResetPassword;
