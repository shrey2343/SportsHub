import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card'
import { 
  Trophy, 
  Users, 
  BarChart3, 
  Calendar, 
  Star, 
  ArrowRight, 
  CheckCircle,
  Zap,
  Shield,
  Globe
} from 'lucide-react'

const LandingPage = () => {
  const features = [
    {
      icon: Users,
      title: 'Player Management',
      description: 'Comprehensive player profiles, performance tracking, and team organization tools.',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Trophy,
      title: 'Tournament Organization',
      description: 'Create and manage tournaments with automated brackets, scheduling, and results.',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: BarChart3,
      title: 'Performance Analytics',
      description: 'Advanced statistics and insights to track progress and identify areas for improvement.',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      icon: Calendar,
      title: 'Smart Scheduling',
      description: 'Intelligent match scheduling with conflict detection and venue management.',
      gradient: 'from-orange-500 to-red-500'
    }
  ]

  const sports = [
    { name: 'Football', icon: '⚽', color: 'from-blue-500 to-blue-600' },
    { name: 'Basketball', icon: '🏀', color: 'from-orange-500 to-red-500' },
    { name: 'Tennis', icon: '🎾', color: 'from-green-500 to-emerald-500' },
    { name: 'Cricket', icon: '🏏', color: 'from-yellow-500 to-orange-500' },
    { name: 'Swimming', icon: '🏊', color: 'from-cyan-500 to-blue-500' },
    { name: 'Athletics', icon: '🏃', color: 'from-purple-500 to-pink-500' }
  ]

  const testimonials = [
    {
      name: 'Sania Mirza',
      role: 'Indian former tennis player',
      content: 'SportsHub has transformed how we manage our club. The performance analytics are game-changing.',
      rating: 5,
      avatar: '👩‍💼'
    },
    {
      name: 'Christiano Ronaldo',
      role: 'Football Legend',
      content: 'The tournament management features save us hours every week. Highly recommended!',
      rating: 5,
      avatar: '👨‍💼'
    },
    {
      name: 'Smriti Mandhana',
      role: 'Womens Cricket Team Captain ( India )',
      content: 'Our players love tracking their progress. The app has increased engagement significantly.',
      rating: 4,
      avatar: '👩‍🎓'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ 
            rotate: [360, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 25, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            rotate: [0, 360],
            scale: [1.1, 1, 1.1]
          }}
          transition={{ 
            duration: 30, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          className="absolute -bottom-40 -right-40 w-80 h-80 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl"
        />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-6 lg:px-8">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
            <Trophy className="h-6 w-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-white">SportsHub</span>
        </div>
        
        <div className="hidden md:flex items-center space-x-8">
          <a href="#features" className="text-white hover:text-blue-300 transition-colors font-medium">Features</a>
          <a href="#sports" className="text-white hover:text-blue-300 transition-colors font-medium">Sports</a>
          <a href="#testimonials" className="text-white hover:text-blue-300 transition-colors font-medium">Testimonials</a>
          <Link to="/contact" className="text-white hover:text-blue-300 transition-colors font-medium">Contact</Link>
        </div>

        <div className="flex items-center space-x-4">
          <Link to="/login" className="text-white hover:text-blue-300 transition-colors font-medium">
            Sign In
          </Link>
          <Link to="/register">
            <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-glow text-white">
              Get Started
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 px-6 py-20 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-400 to-white bg-clip-text text-transparent">
              Revolutionize
            </span>
            <br />
            <span className="text-white">Sports Management</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white mb-8 max-w-3xl mx-auto leading-relaxed">
            The ultimate platform for managing sports clubs, tournaments, and player performance. 
            Built for coaches, players, and administrators who demand excellence.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register">
              <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-glow text-lg px-8 py-4 text-white">
                Start Free Trial <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 px-6 py-20 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Everything You Need to
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> Succeed</span>
            </h2>
            <p className="text-xl text-white max-w-3xl mx-auto">
              Powerful tools designed specifically for sports organizations to streamline operations, 
              enhance performance, and drive success.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="bg-gray-800/80 border-gray-700/80 hover:bg-gray-800/90 transition-all duration-300 hover:scale-105 h-full">
                  <CardContent className="p-6 text-center">
                    <div className={`h-16 w-16 rounded-2xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center mx-auto mb-6`}>
                      <feature.icon className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-white text-xl mb-4">{feature.title}</CardTitle>
                    <CardDescription className="text-white text-base leading-relaxed opacity-90">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sports Support Section */}
      <section id="sports" className="relative z-10 px-6 py-20 lg:px-8 bg-gray-800/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Supporting All
              <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent"> Sports</span>
            </h2>
            <p className="text-xl text-white max-w-3xl mx-auto">
              From football to swimming, our platform adapts to your sport's unique requirements 
              and provides specialized tools for optimal management.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {sports.map((sport, index) => (
              <motion.div
                key={sport.name}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center group cursor-pointer"
              >
                <div className={`h-20 w-20 rounded-2xl bg-gradient-to-r ${sport.color} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <span className="text-3xl">{sport.icon}</span>
                </div>
                <h3 className="text-white font-semibold text-lg">{sport.name}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="relative z-10 px-6 py-20 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Trusted by Sports
              <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent"> Professionals</span>
            </h2>
            <p className="text-xl text-white max-w-3xl mx-auto">
              Join thousands of coaches, administrators, and players who have transformed 
              their sports organizations with SportsHub.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="bg-gray-800/80 border-gray-700/80 hover:bg-gray-800/90 transition-all duration-300 h-full">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-2xl mr-4">
                        {testimonial.avatar}
                      </div>
                      <div>
                        <h4 className="text-white font-semibold text-lg">{testimonial.name}</h4>
                        <p className="text-white text-base opacity-90">{testimonial.role}</p>
                      </div>
                    </div>
                    <p className="text-white mb-4 leading-relaxed opacity-90">"{testimonial.content}"</p>
                    <div className="flex items-center">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-6 py-20 lg:px-8 bg-gradient-to-r from-blue-600/30 to-purple-600/30">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Transform Your
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> Sports Organization?</span>
            </h2>
            <p className="text-xl text-white mb-8 max-w-2xl mx-auto">
              Join thousands of sports professionals who have already revolutionized 
              their operations with SportsHub.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register">
                <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-glow text-lg px-8 py-4 text-white">
                  Start Free Trial <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900 text-lg px-8 py-4">
                  Contact Sales
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-12 lg:px-8 border-t border-gray-700">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                  <Trophy className="h-6 w-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-white">SportsHub</span>
              </div>
              <p className="text-white mb-4 max-w-md opacity-90">
                The ultimate platform for managing sports clubs, tournaments, and player performance. 
                Built for excellence.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-white hover:text-blue-300 transition-colors">
                  <Globe className="h-5 w-5" />
                </a>
                <a href="#" className="text-white hover:text-blue-300 transition-colors">
                  <Shield className="h-5 w-5" />
                </a>
                <a href="#" className="text-white hover:text-blue-300 transition-colors">
                  <Zap className="h-5 w-5" />
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-white hover:text-blue-300 transition-colors opacity-90">Features</a></li>
                <li><a href="#" className="text-white hover:text-blue-300 transition-colors opacity-90">Pricing</a></li>
                <li><a href="#" className="text-white hover:text-blue-300 transition-colors opacity-90">API</a></li>
                <li><a href="#" className="text-white hover:text-blue-300 transition-colors opacity-90">Integrations</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="/about" className="text-white hover:text-blue-300 transition-colors opacity-90">About</a></li>
                <li><a href="/help" className="text-white hover:text-blue-300 transition-colors opacity-90">Careers</a></li>
                <li><Link to="/contact" className="text-white hover:text-blue-300 transition-colors opacity-90">Contact</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row items-center justify-between">
            <p className="text-white text-sm opacity-90">
              © 2025 SportsHub. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="/privacy" className="text-white hover:text-blue-300 transition-colors text-sm opacity-90">Privacy Policy</a>
              <a href="/terms" className="text-white hover:text-blue-300 transition-colors text-sm opacity-90">Terms of Service</a>
              
              
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
