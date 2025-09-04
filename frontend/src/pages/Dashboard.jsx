import { motion } from 'framer-motion'
import { useContext } from 'react'
import { Layout } from '../components/ui/Layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { AuthContext } from '../context/AuthContext'
import { 
  Users, 
  Trophy, 
  Calendar, 
  TrendingUp, 
  Plus, 
  ArrowRight,
  Star,
  Activity,
  Target,
  Award,
  Shield,
  Settings
} from 'lucide-react'

const Dashboard = () => {
  const { user } = useContext(AuthContext)
  const userRole = user?.role || 'player'
  
  const stats = [
    {
      title: 'Total Players',
      value: '1,247',
      change: '+12%',
      changeType: 'positive',
      icon: Users,
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Active Clubs',
      value: '89',
      change: '+5%',
      changeType: 'positive',
      icon: Trophy,
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      title: 'Upcoming Matches',
      value: '23',
      change: '+8%',
      changeType: 'positive',
      icon: Calendar,
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Performance Score',
      value: '94.2',
      change: '+2.1%',
      changeType: 'positive',
      icon: TrendingUp,
      gradient: 'from-orange-500 to-red-500'
    }
  ]

  const recentActivities = [
    {
      id: 1,
      type: 'match',
      title: 'Elite FC vs Thunder United',
      description: 'Match scheduled for tomorrow at 3:00 PM',
      time: '2 hours ago',
      icon: Calendar,
      color: 'text-blue-400'
    },
    {
      id: 2,
      type: 'player',
      title: 'New player registration',
      description: 'Sarah Johnson joined Phoenix Tennis Club',
      time: '4 hours ago',
      icon: Users,
      color: 'text-green-400'
    },
    {
      id: 3,
      type: 'tournament',
      title: 'Summer Championship 2024',
      description: 'Tournament brackets have been finalized',
      time: '6 hours ago',
      icon: Trophy,
      color: 'text-purple-400'
    },
    {
      id: 4,
      type: 'performance',
      title: 'Monthly performance report',
      description: 'Performance analytics updated for all clubs',
      time: '1 day ago',
      icon: TrendingUp,
      color: 'text-orange-400'
    }
  ]

  const quickActions = [
    {
      title: 'Schedule Match',
      description: 'Create a new match or tournament',
      icon: Calendar,
      gradient: 'from-blue-500 to-cyan-500',
      action: 'Schedule'
    },
    {
      title: 'Add Player',
      description: 'Register a new player to the system',
      icon: Users,
      gradient: 'from-green-500 to-emerald-500',
      action: 'Add Player'
    },
    {
      title: 'Create Club',
      description: 'Set up a new sports club',
      icon: Trophy,
      gradient: 'from-purple-500 to-pink-500',
      action: 'Create Club'
    },
    {
      title: 'View Reports',
      description: 'Access performance analytics',
      icon: TrendingUp,
      gradient: 'from-orange-500 to-red-500',
      action: 'View'
    }
  ]

  const upcomingMatches = [
    {
      id: 1,
      homeTeam: 'Elite FC',
      awayTeam: 'Thunder United',
      date: 'Tomorrow',
      time: '3:00 PM',
      venue: 'Central Stadium',
      competition: 'Premier League'
    },
    {
      id: 2,
      homeTeam: 'Phoenix Tennis',
      awayTeam: 'Swift Athletics',
      date: 'Dec 2',
      time: '2:00 PM',
      venue: 'Tennis Complex',
      competition: 'City Championship'
    },
    {
      id: 3,
      homeTeam: 'Dragon Martial Arts',
      awayTeam: 'Elite Karate',
      date: 'Dec 3',
      time: '6:00 PM',
      venue: 'Martial Arts Center',
      competition: 'Regional Tournament'
    }
  ]

  return (
    <Layout>
      {/* Role Indicator and Navigation */}
      <div className="mb-6 p-4 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-lg border border-blue-500/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${
              userRole === 'admin' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
              userRole === 'coach' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
              'bg-green-500/20 text-green-400 border border-green-500/30'
            }`}>
              {userRole.toUpperCase()}
            </div>
            <span className="text-white opacity-80 text-sm">
              {userRole === 'admin' ? 'System Administrator' : 
               userRole === 'coach' ? 'Sports Coach' : 'Player'}
            </span>
          </div>
          <div className="flex space-x-2">
            {userRole === 'admin' && (
              <Button size="sm" variant="outline" className="border-blue-500 text-blue-400 hover:bg-blue-500/10" onClick={() => window.location.href = '/admin-dashboard'}>
                Admin Dashboard
              </Button>
            )}
            {userRole === 'coach' && (
              <Button size="sm" variant="outline" className="border-blue-500 text-blue-400 hover:bg-blue-500/10" onClick={() => window.location.href = '/coach-dashboard'}>
                Coach Dashboard
              </Button>
            )}
            {userRole === 'player' && (
              <Button size="sm" variant="outline" className="border-blue-500 text-blue-400 hover:bg-blue-500/10" onClick={() => window.location.href = '/player-dashboard'}>
                Player Dashboard
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl p-8 border border-blue-500/20"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Welcome back, {userRole === 'admin' ? 'Admin' : userRole === 'coach' ? 'Coach' : 'Player'}! 👋
              </h1>
              <p className="text-white text-lg opacity-90">
                {userRole === 'admin' 
                  ? 'Here\'s your system administration overview'
                  : userRole === 'coach' 
                  ? 'Here\'s what\'s happening with your sports organization today'
                  : 'Here\'s your personal sports dashboard'
                }
              </p>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900">
                <Activity className="h-4 w-4 mr-2" />
                View Reports
              </Button>
              <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Quick Action
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
            >
              <Card className="bg-gray-800/80 border-gray-700/80 hover:bg-gray-800/90 transition-all duration-300 hover:scale-105">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`h-12 w-12 rounded-xl bg-gradient-to-r ${stat.gradient} flex items-center justify-center`}>
                      <stat.icon className="h-6 w-6 text-white" />
                    </div>
                    <div className={`text-sm font-medium ${
                      stat.changeType === 'positive' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {stat.change}
                    </div>
                  </div>
                  <div>
                    <p className="text-white text-2xl font-bold mb-1">{stat.value}</p>
                    <p className="text-white opacity-90 text-sm">{stat.title}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Recent Activities and Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activities */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-gray-800/80 border-gray-700/80">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Activity className="h-5 w-5 mr-2 text-blue-400" />
                  Recent Activities
                </CardTitle>
                <CardDescription className="text-white opacity-90">
                  Latest updates from your sports organization
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-700/50 transition-colors">
                      <div className={`h-8 w-8 rounded-lg bg-gray-700/50 flex items-center justify-center ${activity.color}`}>
                        <activity.icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium text-sm">{activity.title}</p>
                        <p className="text-white opacity-90 text-sm">{activity.description}</p>
                        <p className="text-white opacity-70 text-xs mt-1">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <Button variant="outline" className="w-full border-gray-600 text-white hover:bg-gray-700 hover:text-white">
                    View All Activities
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-gray-800/80 border-gray-700/80">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Target className="h-5 w-5 mr-2 text-green-400" />
                  Quick Actions
                </CardTitle>
                <CardDescription className="text-white opacity-90">
                  Common tasks to get you started
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {quickActions.map((action, index) => (
                    <motion.div
                      key={action.title}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4 + index * 0.05 }}
                    >
                      <Card className="bg-gray-700/50 border-gray-600/50 hover:bg-gray-700/70 transition-all duration-300">
                        <CardContent className="p-4">
                          <div className={`h-10 w-10 rounded-lg bg-gradient-to-r ${action.gradient} flex items-center justify-center mb-3`}>
                            <action.icon className="h-5 w-5 text-white" />
                          </div>
                          <h3 className="text-white font-medium text-sm mb-1">{action.title}</h3>
                          <p className="text-white opacity-90 text-xs mb-3">{action.description}</p>
                          <Button size="sm" className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white">
                            {action.action}
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Upcoming Matches */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-gray-800/80 border-gray-700/80">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-orange-400" />
                Upcoming Matches
              </CardTitle>
              <CardDescription className="text-white opacity-90">
                Your next scheduled matches and tournaments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingMatches.map((match, index) => (
                  <motion.div
                    key={match.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="flex items-center justify-between p-4 rounded-lg bg-gray-700/50 border border-gray-600/50 hover:bg-gray-700/70 transition-all duration-300"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                        <Trophy className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-white font-medium">
                          {match.homeTeam} vs {match.awayTeam}
                        </h3>
                        <p className="text-white opacity-90 text-sm">{match.competition}</p>
                        <p className="text-white opacity-70 text-xs">{match.venue}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-medium">{match.date}</p>
                      <p className="text-white opacity-90 text-sm">{match.time}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="mt-6 pt-4 border-t border-gray-700">
                <Button variant="outline" className="w-full border-gray-600 text-white hover:bg-gray-700 hover:text-white">
                  View Full Schedule
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Performance Chart Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="bg-gray-800/80 border-gray-700/80">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-green-400" />
                Performance Overview
              </CardTitle>
              <CardDescription className="text-white opacity-90">
                Track your organization's performance metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gray-700/50 rounded-lg border border-gray-600/50 flex items-center justify-center">
                <div className="text-center">
                  <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-white opacity-70">Performance chart will be displayed here</p>
                  <p className="text-white opacity-50 text-sm">Advanced analytics coming soon</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </Layout>
  )
}

export default Dashboard
