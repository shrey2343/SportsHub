import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaSearch, FaQuestionCircle, FaUser, FaUsers, FaTrophy, FaCog, FaBaseballBall, FaTableTennis, FaFootballBall, FaBasketballBall } from "react-icons/fa";

export default function HelpCenter() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("general");

  const faqData = {
    general: [
      {
        question: "What is SportsHub?",
        answer: "SportsHub is a comprehensive sports management platform that connects coaches, players, and clubs. It provides tools for club management, player registration, and community building."
      },
      {
        question: "How do I get started?",
        answer: "Simply register for an account, choose your role (coach or player), and start exploring the platform. Coaches can create clubs while players can join existing ones."
      },
      {
        question: "Is SportsHub free to use?",
        answer: "SportsHub offers both free and premium features. Basic club management and player registration are free, while advanced features may require a subscription."
      }
    ],
    coaches: [
      {
        question: "How do I create a club?",
        answer: "After registering as a coach, go to your Coach Dashboard and click 'Create Club'. Fill in the required information including club name, location, sport, and registration fee."
      },
      {
        question: "How do I manage my club members?",
        answer: "In your Coach Dashboard, you can view all club members, remove players, and manage club settings. You'll see a list of all players who have joined your club."
      },
      {
        question: "Can I delete my club?",
        answer: "Yes, you can delete your club from the Coach Dashboard. This will remove all club data and notify all members that the club has been deleted."
      }
    ],
    players: [
      {
        question: "How do I join a club?",
        answer: "Browse available clubs in your Player Dashboard and click 'Join Club' on any club you're interested in. You can only join one club at a time."
      },
      {
        question: "How do I update my profile?",
        answer: "Click the 'Profile' button in your Player Dashboard, then click 'Edit' to modify your position, upload a profile picture, and update other information."
      },
      {
        question: "Can I leave a club?",
        answer: "Yes, you can leave your current club at any time. This will make you available to join other clubs."
      }
    ],
    technical: [
      {
        question: "I forgot my password. How do I reset it?",
        answer: "Click 'Forgot Password' on the login page, enter your email address, and follow the instructions sent to your email to reset your password."
      },
      {
        question: "How do I upload a profile picture?",
        answer: "In your profile settings, click 'Upload Image' and select a PNG or JPEG file. The maximum file size is 20MB."
      },
      {
        question: "What browsers are supported?",
        answer: "SportsHub works on all modern browsers including Chrome, Firefox, Safari, and Edge. We recommend using the latest version for the best experience."
      }
    ]
  };

  const categories = [
    { id: "general", name: "General", icon: <FaQuestionCircle /> },
    { id: "coaches", name: "For Coaches", icon: <FaTrophy /> },
    { id: "players", name: "For Players", icon: <FaUser /> },
    { id: "technical", name: "Technical", icon: <FaCog /> }
  ];

  const filteredFAQs = faqData[activeCategory].filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-6 py-20 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl font-extrabold mb-6 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent"
        >
          Help Center
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto"
        >
          Find answers to frequently asked questions and get the support you need.
        </motion.p>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="max-w-2xl mx-auto mb-12"
        >
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search for help..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-gray-800 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </motion.div>
      </section>

      {/* Categories */}
      <section className="relative z-10 container mx-auto px-6 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {categories.map((category) => (
            <motion.button
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              onClick={() => setActiveCategory(category.id)}
              className={`p-6 rounded-2xl border transition-all duration-300 shadow-2xl ${
                activeCategory === category.id
                  ? "bg-blue-500/20 border-blue-500 text-blue-400"
                  : "bg-gray-900/80 border-gray-700 text-gray-300 hover:border-gray-600"
              }`}
            >
              <div className="flex flex-col items-center gap-3">
                <div className="text-2xl">{category.icon}</div>
                <span className="font-semibold">{category.name}</span>
              </div>
            </motion.button>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative z-10 container mx-auto px-6 py-16">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl font-bold text-center mb-12 text-white"
        >
          Frequently Asked Questions
        </motion.h2>

        <div className="max-w-4xl mx-auto space-y-6">
          {filteredFAQs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="bg-gray-900/80 backdrop-blur-md border border-gray-700 rounded-2xl p-6 shadow-2xl"
            >
              <h3 className="text-xl font-semibold mb-3 text-white">{faq.question}</h3>
              <p className="text-gray-400 leading-relaxed">{faq.answer}</p>
            </motion.div>
          ))}
        </div>

        {filteredFAQs.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-gray-400 text-lg">No questions found matching your search.</p>
          </motion.div>
        )}
      </section>

      {/* Contact Support */}
      <section className="relative z-10 bg-gray-900/50 py-16">
        <div className="container mx-auto px-6 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-3xl font-bold mb-4 text-white"
          >
            Still Need Help?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-6 text-gray-300"
          >
            Can't find what you're looking for? Our support team is here to help.
          </motion.p>
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            onClick={() => navigate('/contact')}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:opacity-90 transition-all duration-300 shadow-lg"
          >
            Contact Support
          </motion.button>
        </div>
      </section>

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
