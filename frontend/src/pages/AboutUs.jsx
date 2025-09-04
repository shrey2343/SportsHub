import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaUsers, FaTrophy, FaHeart, FaShieldAlt, FaBaseballBall, FaTableTennis, FaFootballBall, FaBasketballBall } from "react-icons/fa";
import { GiTennisRacket, GiCricketBat, GiHockey } from "react-icons/gi";

export default function AboutUs() {
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

      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-6 py-20 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl font-extrabold mb-6 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent"
        >
          About SportsHub
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto"
        >
          We're passionate about bringing sports communities together through innovative technology. 
          Our platform connects coaches, players, and clubs in a seamless, efficient way.
        </motion.p>
      </section>

      {/* Mission & Vision */}
      <section className="relative z-10 container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-gray-900/80 backdrop-blur-md border border-gray-700 rounded-2xl p-8 shadow-2xl"
          >
            <div className="flex items-center gap-3 mb-4">
              <FaHeart className="text-red-400 text-3xl" />
              <h2 className="text-2xl font-bold text-white">Our Mission</h2>
            </div>
            <p className="text-gray-300 leading-relaxed">
              To revolutionize sports management by providing a comprehensive platform that empowers 
              coaches, players, and clubs to connect, grow, and succeed together. We believe in 
              making sports accessible to everyone through technology.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-gray-900/80 backdrop-blur-md border border-gray-700 rounded-2xl p-8 shadow-2xl"
          >
            <div className="flex items-center gap-3 mb-4">
              <FaTrophy className="text-yellow-400 text-3xl" />
              <h2 className="text-2xl font-bold text-white">Our Vision</h2>
            </div>
            <p className="text-gray-300 leading-relaxed">
              To become the leading sports management platform globally, fostering communities 
              where every athlete can find their perfect team, every coach can grow their club, 
              and every sports enthusiast can be part of something bigger.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="relative z-10 bg-gray-900/50 py-16">
        <div className="container mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl font-bold text-center mb-12 text-white"
          >
            Our Values
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <FaUsers className="text-4xl text-blue-400" />,
                title: "Community First",
                desc: "We believe in building strong, supportive sports communities where everyone feels welcome and valued."
              },
              {
                icon: <FaShieldAlt className="text-4xl text-green-400" />,
                title: "Trust & Security",
                desc: "Your data and privacy are our top priorities. We maintain the highest standards of security."
              },
              {
                icon: <FaHeart className="text-4xl text-red-400" />,
                title: "Passion for Sports",
                desc: "We're driven by our love for sports and commitment to helping athletes achieve their dreams."
              }
            ].map((value, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
                className="bg-gray-900/80 backdrop-blur-md border border-gray-700 rounded-2xl p-8 text-center shadow-2xl"
              >
                <div className="flex justify-center mb-4">{value.icon}</div>
                <h3 className="text-xl font-semibold mb-3 text-white">{value.title}</h3>
                <p className="text-gray-400">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="relative z-10 container mx-auto px-6 py-16">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl font-bold text-center mb-12 text-white"
        >
          Meet Our Team
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              name: "Shrey Nigam",
              role: "Founder & CEO",
              desc: "Former professional athlete with 15+ years in sports management.",
              avatar: "👨‍💼"
            },
            {
              name: "Shreya Chouhan",
              role: "Head of Technology",
              desc: "Tech enthusiast passionate about building scalable sports solutions.",
              avatar: "👩‍💻"
            }
          ].map((member, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              className="bg-gray-900/80 backdrop-blur-md border border-gray-700 rounded-2xl p-8 text-center shadow-2xl"
            >
              <div className="text-6xl mb-4">{member.avatar}</div>
              <h3 className="text-xl font-semibold mb-2 text-white">{member.name}</h3>
              <p className="text-blue-400 mb-3 font-medium">{member.role}</p>
              <p className="text-gray-400">{member.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-md py-16">
        <div className="container mx-auto px-6 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-3xl font-bold mb-4 text-white"
          >
            Ready to Join Our Community?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-6 text-gray-300"
          >
            Start your journey with SportsHub today and be part of something amazing.
          </motion.p>
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            onClick={() => navigate('/register')}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:opacity-90 transition-all duration-300 shadow-lg"
          >
            Get Started Today
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
