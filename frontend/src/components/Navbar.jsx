import { Link, NavLink, useNavigate } from "react-router-dom";
import { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { FaTrophy, FaBars, FaTimes, FaUser, FaSignOutAlt, FaChevronDown, FaBell, FaCog } from "react-icons/fa";
import ThemeToggle from "./ThemeToggle";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFeaturesOpen, setIsFeaturesOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const featuresRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (featuresRef.current && !featuresRef.current.contains(event.target)) {
        setIsFeaturesOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleFeatures = () => setIsFeaturesOpen(!isFeaturesOpen);
  const toggleProfile = () => setIsProfileOpen(!isProfileOpen);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className={`dark-nav ${isScrolled ? 'scrolled' : ''} transition-all duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-600 rounded-xl flex items-center justify-center shadow-dark-glow group-hover:shadow-dark-glow-purple transition-all duration-300">
              <FaTrophy className="text-white text-lg" />
            </div>
            <span className="text-2xl font-bold text-content-primary group-hover:text-content-primary transition-colors duration-300">
              SportsHub
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <NavLink 
              to="/dashboard" 
              className="dark-nav-item font-medium px-4 py-2 rounded-lg transition-all duration-200 hover:bg-surface-tertiary"
            >
              Dashboard
            </NavLink>
            
            {/* Features Dropdown */}
            <div className="relative" ref={featuresRef}>
              <button
                onClick={toggleFeatures}
                className="dark-nav-item font-medium px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 hover:bg-surface-tertiary"
              >
                Features
                <FaChevronDown className={`text-sm transition-transform duration-200 ${isFeaturesOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isFeaturesOpen && (
                <div className="absolute right-0 mt-2 w-56 dark-card-elevated rounded-xl shadow-dark-large py-2 z-50 animate-fade-in">
                  <Link to="/matches" className="block px-4 py-2 text-content-primary hover:text-content-primary hover:bg-surface-tertiary transition-colors duration-200">
                    Match Management
                  </Link>
                  <Link to="/tournaments" className="block px-4 py-2 text-content-primary hover:text-content-primary hover:bg-surface-tertiary transition-colors duration-200">
                    Tournament Organization
                  </Link>
                  <Link to="/performance" className="block px-4 py-2 text-content-primary hover:text-content-primary hover:bg-surface-tertiary transition-colors duration-200">
                    Performance Analytics
                  </Link>
                  <Link to="/achievements" className="block px-4 py-2 text-content-primary hover:text-content-primary hover:bg-surface-tertiary transition-colors duration-200">
                    Achievement System
                  </Link>
                </div>
              )}
            </div>

            <NavLink 
              to="/about" 
              className="dark-nav-item font-medium px-4 py-2 rounded-lg transition-all duration-200 hover:bg-surface-tertiary"
            >
              About
            </NavLink>
            
            <NavLink 
              to="/contact" 
              className="dark-nav-item font-medium px-4 py-2 rounded-lg transition-all duration-200 hover:bg-surface-tertiary"
            >
              Contact
            </NavLink>
          </div>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Notifications */}
            <button className="relative p-2 text-content-secondary hover:text-content-primary hover:bg-surface-tertiary rounded-lg transition-all duration-200">
              <FaBell className="text-lg" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
            </button>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* User Profile or Sign In */}
            {user ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={toggleProfile}
                  className="flex items-center space-x-2 p-2 text-content-secondary hover:text-content-primary hover:bg-surface-tertiary rounded-lg transition-all duration-200"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-600 rounded-full flex items-center justify-center">
                    <FaUser className="text-white text-sm" />
                  </div>
                  <span className="font-medium">{user.name}</span>
                  <FaChevronDown className={`text-sm transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 dark-card-elevated rounded-xl shadow-dark-large py-2 z-50 animate-fade-in">
                    <Link to="/profile" className="block px-4 py-2 text-content-primary hover:text-content-primary hover:bg-surface-tertiary transition-colors duration-200">
                      <FaUser className="mr-2" />
                      Profile
                    </Link>
                    <Link to="/settings" className="block px-4 py-2 text-content-primary hover:text-content-primary hover:bg-surface-tertiary transition-colors duration-200">
                      <FaCog className="mr-2" />
                      Settings
                    </Link>
                    <div className="border-t border-border-secondary my-1"></div>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors duration-200"
                    >
                      <FaSignOutAlt className="mr-2" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="dark-btn-secondary"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="dark-btn-primary"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <button
              onClick={toggleMenu}
              className="p-2 text-content-secondary hover:text-content-primary hover:bg-surface-tertiary rounded-lg transition-all duration-200"
            >
              {isMenuOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden dark-card-secondary border-t border-border-primary">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/dashboard"
              className="block px-3 py-2 text-content-secondary hover:text-content-primary hover:bg-surface-tertiary rounded-lg transition-all duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              to="/matches"
              className="block px-3 py-2 text-content-secondary hover:text-content-primary hover:bg-surface-tertiary rounded-lg transition-all duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              Match Management
            </Link>
            <Link
              to="/tournaments"
              className="block px-3 py-2 text-content-secondary hover:text-content-primary hover:bg-surface-tertiary rounded-lg transition-all duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              Tournament Organization
            </Link>
            <Link
              to="/performance"
              className="block px-3 py-2 text-content-secondary hover:text-content-primary hover:bg-surface-tertiary rounded-lg transition-all duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              Performance Analytics
            </Link>
            <Link
              to="/about"
              className="block px-3 py-2 text-content-secondary hover:text-content-primary hover:bg-surface-tertiary rounded-lg transition-all duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link
              to="/contact"
              className="block px-3 py-2 text-content-secondary hover:text-content-primary hover:bg-surface-tertiary rounded-lg transition-all duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            
            {user ? (
              <>
                <div className="border-t border-border-secondary my-2"></div>
                <Link
                  to="/profile"
                  className="block px-3 py-2 text-content-secondary hover:text-content-primary hover:bg-surface-tertiary rounded-lg transition-all duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all duration-200"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <div className="border-t border-border-secondary my-2"></div>
                <Link
                  to="/login"
                  className="block px-3 py-2 text-content-secondary hover:text-content-primary hover:bg-surface-tertiary rounded-lg transition-all duration-200"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="block px-3 py-2 text-content-secondary hover:text-content-primary hover:bg-surface-tertiary rounded-lg transition-all duration-200"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
