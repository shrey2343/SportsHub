import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Layout } from '../components/ui/Layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { 
  Users, 
  Plus, 
  Search, 
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  MapPin,
  Calendar,
  Star
} from 'lucide-react'

const ClubManagement = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')

  const clubs = [
    {
      id: 1,
      name: 'Elite Football Club',
      location: 'New York, NY',
      members: 156,
      founded: '2010',
      rating: 4.8,
      status: 'active',
      description: 'Premier football club with focus on youth development and competitive play.',
      image: '⚽'
    },
    {
      id: 2,
      name: 'Thunder Basketball Academy',
      location: 'Los Angeles, CA',
      members: 89,
      founded: '2015',
      rating: 4.6,
      status: 'active',
      description: 'Elite basketball training and development program for aspiring athletes.',
      image: '🏀'
    },
    {
      id: 3,
      name: 'Phoenix Tennis Club',
      location: 'Miami, FL',
      members: 234,
      founded: '2008',
      rating: 4.9,
      status: 'active',
      description: 'Professional tennis coaching and tournament organization.',
      image: '🎾'
    },
    {
      id: 4,
      name: 'Dragon Martial Arts',
      location: 'Chicago, IL',
      members: 67,
      founded: '2012',
      rating: 4.7,
      status: 'active',
      description: 'Traditional martial arts training with modern fitness approaches.',
      image: '🥋'
    },
    {
      id: 5,
      name: 'Swift Athletics Club',
      location: 'Boston, MA',
      members: 123,
      founded: '2018',
      rating: 4.5,
      status: 'active',
      description: 'Track and field excellence with Olympic-level coaching.',
      image: '🏃'
    },
    {
      id: 6,
      name: 'Aqua Swim Team',
      location: 'Seattle, WA',
      members: 78,
      founded: '2013',
      rating: 4.4,
      status: 'active',
      description: 'Competitive swimming and water sports training facility.',
      image: '🏊'
    }
  ]

  const filteredClubs = clubs.filter(club => {
    const matchesSearch = club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         club.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = selectedFilter === 'all' || club.status === selectedFilter
    return matchesSearch && matchesFilter
  })

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Club Management</h1>
            <p className="text-white opacity-90">
              Manage your sports clubs, members, and activities
            </p>
          </div>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-glow hover:shadow-glow-purple text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Club
          </Button>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white" />
            <Input
              type="text"
              placeholder="Search clubs by name or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-700/80 border-gray-600 text-white placeholder-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="px-4 py-2 bg-gray-700/80 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Clubs</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          <Card className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border-blue-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-300 text-sm font-medium">Total Clubs</p>
                  <p className="text-2xl font-bold text-white">{clubs.length}</p>
                </div>
                <Users className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-300 text-sm font-medium">Total Members</p>
                  <p className="text-2xl font-bold text-white">
                    {clubs.reduce((sum, club) => sum + club.members, 0).toLocaleString()}
                  </p>
                </div>
                <Users className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-300 text-sm font-medium">Active Clubs</p>
                  <p className="text-2xl font-bold text-white">
                    {clubs.filter(club => club.status === 'active').length}
                  </p>
                </div>
                <Star className="h-8 w-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500/20 to-red-500/20 border-orange-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-300 text-sm font-medium">Avg Rating</p>
                  <p className="text-2xl font-bold text-white">
                    {(clubs.reduce((sum, club) => sum + club.rating, 0) / clubs.length).toFixed(1)}
                  </p>
                </div>
                <Star className="h-8 w-8 text-orange-400" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Clubs Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredClubs.map((club, index) => (
            <motion.div
              key={club.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
            >
              <Card className="bg-gray-800/80 border-gray-700/80 hover:bg-gray-800/90 transition-all duration-300 hover:scale-105 group">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-2xl">
                        {club.image}
                      </div>
                      <div>
                        <CardTitle className="text-white text-lg group-hover:text-blue-300 transition-colors">
                          {club.name}
                        </CardTitle>
                        <div className="flex items-center space-x-1 text-white opacity-90">
                          <MapPin className="h-3 w-3" />
                          <span className="text-sm">{club.location}</span>
                        </div>
                      </div>
                    </div>
                    <div className="relative">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-white hover:text-blue-300">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-white opacity-90 text-sm mb-4 line-clamp-2">
                    {club.description}
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white opacity-70">Members</span>
                      <span className="text-white font-medium">{club.members.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white opacity-70">Founded</span>
                      <span className="text-white font-medium">{club.founded}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white opacity-70">Rating</span>
                      <div className="flex items-center space-x-1">
                        <Star className="h-3 w-3 text-yellow-400 fill-current" />
                        <span className="text-white font-medium">{club.rating}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 mt-4 pt-4 border-t border-gray-700/50">
                    <Button size="sm" variant="outline" className="flex-1 border-gray-600 text-white hover:bg-gray-700 hover:text-white">
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1 border-gray-600 text-white hover:bg-gray-700 hover:text-white">
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button size="sm" variant="outline" className="border-red-600 text-red-400 hover:bg-red-600/20">
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Create Club Modal */}
        <AnimatePresence>
          {isCreateModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setIsCreateModalOpen(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-gray-800 rounded-2xl p-6 w-full max-w-md border border-gray-700/50"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white">Create New Club</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="text-white hover:text-blue-300"
                  >
                    ✕
                  </Button>
                </div>

                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Club Name
                    </label>
                    <Input
                      placeholder="Enter club name"
                      className="bg-gray-700/80 border-gray-600 text-white placeholder-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Location
                    </label>
                    <Input
                      placeholder="Enter location"
                      className="bg-gray-700/80 border-gray-600 text-white placeholder-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Description
                    </label>
                    <textarea
                      placeholder="Enter club description"
                      rows={3}
                      className="w-full px-3 py-2 bg-gray-700/80 border border-gray-600 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="flex items-center space-x-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsCreateModalOpen(false)}
                      className="flex-1 border-gray-600 text-white hover:bg-gray-700 hover:text-white"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                    >
                      Create Club
                    </Button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  )
}

export default ClubManagement
