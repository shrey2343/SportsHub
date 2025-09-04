import { useEffect, useState, useContext } from "react"
import { motion } from "framer-motion"
import { Layout } from "../components/ui/Layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/Card"
import { Button } from "../components/ui/Button"
import { AuthContext } from "../context/AuthContext"
import api from "../api.jsx"
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
  User,
  Edit,
  Camera,
  Brain,
  CreditCard,
  ChartLine,
  MapPin,
  DollarSign,
  Users as PlayersIcon,
  CheckCircle,
  AlertCircle,
  Loader2,
  RefreshCw
} from 'lucide-react'
import { useToast } from '../components/ui/use-toast'

export default function PlayerDashboard() {
  const { user: authUser } = useContext(AuthContext)
  const { toast } = useToast()
  const [clubs, setClubs] = useState([])
  const [user, setUser] = useState(null)
  const [player, setPlayer] = useState(null)
  const [showProfile, setShowProfile] = useState(false)
  const [editingProfile, setEditingProfile] = useState(false)
  const [profileForm, setProfileForm] = useState({
    name: "",
    position: "",
    email: ""
  })
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [showEnrollment, setShowEnrollment] = useState(false)
  const [selectedClub, setSelectedClub] = useState(null)
  const [showAIAnalysis, setShowAIAnalysis] = useState(false)
  const [showTrainingRecommendations, setShowTrainingRecommendations] = useState(false)
  const [loading, setLoading] = useState(false)
  const [enrollingClub, setEnrollingClub] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [dataLoaded, setDataLoaded] = useState(false)

  // Load user data and clubs on component mount
  useEffect(() => {
    if (authUser) {
      loadUserData()
      loadClubs()
    }
  }, [authUser])

  // Initialize profile form when user data loads
  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || "",
        position: player?.position || "",
        email: user.email || ""
      })
    }
  }, [user, player])

  const loadUserData = async () => {
    try {
      setLoading(true)
      console.log('Loading user data for:', authUser)
      
      // Set initial user data from auth context
      if (authUser) {
        setUser(authUser)
      }
      
      // Try to load detailed profile data from backend
      try {
        // Load user profile data
        const userResponse = await api.get('/auth/profile')
        console.log('User profile response:', userResponse.data)
        
        if (userResponse.data.success && userResponse.data.user) {
          setUser(userResponse.data.user)
        }
        
        // Load player-specific data
        const playerResponse = await api.get('/players/me')
        console.log('Player profile response:', playerResponse.data)
        
        if (playerResponse.data) {
          setPlayer(playerResponse.data)
        } else {
          // Create a default player profile if none exists
    setPlayer({
            _id: authUser._id,
            position: authUser.position || 'Forward',
            avatarUrl: authUser.avatar || null
          })
        }
      } catch (apiError) {
        console.error('API Error loading user data:', apiError)
        
        // If API fails, use auth context data with defaults
        if (authUser) {
          setUser(authUser)
          setPlayer({
            _id: authUser._id,
            position: authUser.position || 'Forward',
            avatarUrl: authUser.avatar || null
          })
        }
      }
      
      setDataLoaded(true)
    } catch (error) {
      console.error('Error loading user data:', error)
      
      // Final fallback to auth context data
      if (authUser) {
        setUser(authUser)
    setPlayer({
          _id: authUser._id,
          position: authUser.position || 'Forward',
          avatarUrl: authUser.avatar || null
        })
      }
      setDataLoaded(true)
    } finally {
      setLoading(false)
    }
  }

  const loadClubs = async () => {
    try {
      const response = await api.get('/clubs')
      console.log('Clubs response:', response.data)
      
      const currentUserId = user?._id || user?.id
      const clubsData = response.data.map(club => ({
        ...club,
        // Prefer backend flag; fallback checks membership by populated player.user._id
        isMember: Boolean(club.isMember) || club.players?.some(p => String(p.user?._id) === String(currentUserId))
      }))
      setClubs(clubsData)
    } catch (error) {
      console.error('Error loading clubs:', error)
      
      // Fallback to mock data with better structure
    setClubs([
      {
        _id: '1',
        name: 'Elite Football Club',
        location: 'New York, NY',
        registrationFee: 150,
        sport: 'Football',
        players: [],
          isMember: false,
          description: 'Premier football training and development'
      },
      {
        _id: '2',
        name: 'Thunder Basketball Academy',
        location: 'Los Angeles, CA',
        registrationFee: 200,
        sport: 'Basketball',
        players: [],
          isMember: true,
          description: 'Professional basketball coaching and training'
      },
      {
        _id: '3',
        name: 'Phoenix Tennis Club',
        location: 'Miami, FL',
        registrationFee: 180,
        sport: 'Tennis',
        players: [],
          isMember: false,
          description: 'Elite tennis training and tournament play'
        },
        {
          _id: '4',
          name: 'Dragon Martial Arts Center',
          location: 'Chicago, IL',
          registrationFee: 120,
          sport: 'Martial Arts',
          players: [],
          isMember: false,
          description: 'Traditional and modern martial arts training'
        }
      ])
    }
  }

  const joinClub = async (clubId) => {
    try {
      setEnrollingClub(true)
      await api.post(`/players/join-club/${clubId}`)
      
      // Refresh membership flags from backend to avoid stale UI
      await loadClubs()
      
      setMessage({ type: 'success', text: 'Successfully joined the club!' })
      setTimeout(() => setMessage({ type: '', text: '' }), 3000)
    } catch (err) {
      console.error("Failed to join club:", err)
      setMessage({ 
        type: 'error', 
        text: err.response?.data?.message || 'Failed to join club' 
      })
      setTimeout(() => setMessage({ type: '', text: '' }), 3000)
    } finally {
      setEnrollingClub(false)
    }
  }

  const initiatePayment = async (club) => {
    try {
      setEnrollingClub(true)
      
      console.log('🚀 Initiating payment for club:', club.name, 'Amount:', club.registrationFee)
      
      // Create payment order - send amount in rupees (backend will convert to paise)
      const response = await api.post('/payments/create-order', {
        clubId: club._id,
        amount: club.registrationFee, // This should be in rupees
        currency: 'INR'
      })
      
      console.log('📡 Payment order response:', response.data)
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to create payment order')
      }
      
      const { order, paymentId, message } = response.data
      
      if (message) {
        console.log('ℹ️', message)
      }
      
      // Configure Razorpay options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount, // Backend already converts to paise
        currency: order.currency,
        name: 'SportsHub',
        description: `Enrollment in ${club.name}`,
        order_id: order.id,
        handler: async function (response) {
          console.log('💳 Razorpay payment response:', response)
          
          try {
            setEnrollingClub(true)
            
            // Verify payment
            const verifyResponse = await api.post('/payments/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              paymentId: paymentId
            })
            
            console.log('✅ Payment verification response:', verifyResponse.data)
            
            if (verifyResponse.data.success) {
              // Refresh clubs data to get updated membership status
              await loadClubs()
              
              setMessage({ 
                type: 'success', 
                text: 'Payment successful! You are now enrolled in the club!' 
              })
              setTimeout(() => setMessage({ type: '', text: '' }), 5000)
              
              // Close enrollment modal
              setShowEnrollment(false)
              setSelectedClub(null)
              
              // Show success toast
              toast({
                title: "🎉 Payment Successful!",
                description: "Welcome to the club!",
                variant: "default"
              })
              
            } else {
              throw new Error(verifyResponse.data.message || 'Payment verification failed')
            }
          } catch (error) {
            console.error('❌ Payment verification error:', error)
            
            const errorMessage = error.response?.data?.message || error.message || 'Payment verification failed'
            setMessage({ 
              type: 'error', 
              text: errorMessage 
            })
            setTimeout(() => setMessage({ type: '', text: '' }), 5000)
            
            // Show error toast
            toast({
              title: "❌ Payment Failed",
              description: errorMessage,
              variant: "destructive"
            })
          } finally {
            setEnrollingClub(false)
          }
        },
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
        },
        theme: {
          color: '#8B5CF6' // Purple theme
        },
        modal: {
          ondismiss: function() {
            console.log('🚫 Payment modal dismissed')
            setEnrollingClub(false)
          }
        },
        // Additional Razorpay options for better UX
        retry: {
          enabled: true,
          max_count: 3
        },
        remember_customer: true,
        notes: {
          clubName: club.name,
          clubLocation: club.location,
          clubSport: club.sport
        }
      }
      
      console.log('⚙️ Razorpay options:', options)
      
      // Initialize Razorpay
      if (!window.Razorpay) {
        throw new Error('Razorpay SDK not loaded. Please refresh the page and try again.')
      }
      
      const rzp = new window.Razorpay(options)
      
      // Add event listeners for better debugging
      rzp.on('payment.failed', function (response) {
        console.error('❌ Payment failed:', response.error)
        setMessage({ 
          type: 'error', 
          text: `Payment failed: ${response.error.description || 'Unknown error'}` 
        })
        setTimeout(() => setMessage({ type: '', text: '' }), 5000)
        toast({
          title: "❌ Payment Failed",
          description: response.error.description || 'Unknown error',
          variant: "destructive"
        })
        setEnrollingClub(false)
      })
      
      rzp.on('payment.cancelled', function () {
        console.log('🚫 Payment cancelled by user')
        setMessage({ 
          type: 'warning', 
          text: 'Payment was cancelled. You can try again anytime.' 
        })
        setTimeout(() => setMessage({ type: '', text: '' }), 5000)
        toast({
          title: "🚫 Payment Cancelled",
          description: "Payment was cancelled. You can try again anytime.",
          variant: "default"
        })
        setEnrollingClub(false)
      })
      
      // Open Razorpay
      rzp.open()
      
    } catch (error) {
      console.error('❌ Payment initiation failed:', error)
      
      let errorMessage = 'Failed to initiate payment'
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error.message) {
        errorMessage = error.message
      }
      
      setMessage({ 
        type: 'error', 
        text: errorMessage 
      })
      setTimeout(() => setMessage({ type: '', text: '' }), 5000)
      
      // Show error toast
      toast({
        title: "❌ Payment Error",
        description: errorMessage,
        variant: "destructive"
      })
      
    } finally {
      setEnrollingClub(false)
    }
  }

  const leaveClub = async (clubId) => {
    if (!confirm("Are you sure you want to leave this club?")) return
    
    try {
      setEnrollingClub(true)
      await api.delete(`/clubs/${clubId}/leave`)
      
      // Update local state
      const updatedClubs = clubs.map(club => 
        club._id === clubId ? { ...club, isMember: false } : club
      )
      setClubs(updatedClubs)
      
      setMessage({ type: 'success', text: 'Successfully left the club!' })
      setTimeout(() => setMessage({ type: '', text: '' }), 3000)
    } catch (err) {
      console.error("Failed to leave club:", err)
      setMessage({ 
        type: 'error', 
        text: err.response?.data?.message || 'Failed to leave club' 
      })
      setTimeout(() => setMessage({ type: '', text: '' }), 3000)
    } finally {
      setEnrollingClub(false)
    }
  }

  const updateProfile = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      
      // Update user profile
      const userUpdateData = {
        name: profileForm.name,
        email: profileForm.email
      }
      await api.put('/auth/profile', userUpdateData)
      
      // Update player profile
      const playerUpdateData = {
        position: profileForm.position
      }
      await api.put('/players/me', playerUpdateData)
      
      // Update local state
      setUser(prev => ({ ...prev, ...userUpdateData }))
      setPlayer(prev => ({ ...prev, ...playerUpdateData }))
      
      setEditingProfile(false)
      setMessage({ type: 'success', text: 'Profile updated successfully!' })
      setTimeout(() => setMessage({ type: '', text: '' }), 3000)
    } catch (err) {
      console.error("Failed to update profile:", err)
      setMessage({ 
        type: 'error', 
        text: err.response?.data?.message || 'Failed to update profile' 
      })
      setTimeout(() => setMessage({ type: '', text: '' }), 3000)
    } finally {
      setLoading(false)
    }
  }

  const handleEnrollment = (club) => {
    setSelectedClub(club)
    setShowEnrollment(true)
  }

  const handleEnrollmentComplete = async () => {
    console.log('🚀 handleEnrollmentComplete called')
    console.log('selectedClub:', selectedClub)
    
    if (!selectedClub) {
      console.error('❌ No club selected')
      return
    }
    
    try {
      console.log('✅ Starting enrollment process')
      setEnrollingClub(true)
      await initiatePayment(selectedClub)
    } catch (error) {
      console.error('❌ Enrollment failed:', error)
    } finally {
      setEnrollingClub(false)
    }
  }

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'File size must be less than 5MB' })
      setTimeout(() => setMessage({ type: '', text: '' }), 3000)
      return
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: 'Please select an image file' })
      setTimeout(() => setMessage({ type: '', text: '' }), 3000)
      return
    }

    setUploadingAvatar(true)
    try {
      const formData = new FormData()
      formData.append('avatar', file)
      
      const response = await api.post('/players/me/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      
      // Update local state with new avatar URL
      setPlayer(prev => ({ ...prev, avatarUrl: response.data.avatarUrl }))
      
      setMessage({ type: 'success', text: 'Profile picture updated successfully!' })
      setTimeout(() => setMessage({ type: '', text: '' }), 3000)
    } catch (err) {
      console.error("Failed to upload avatar:", err)
      setMessage({ 
        type: 'error', 
        text: err.response?.data?.message || 'Failed to upload profile picture' 
      })
      setTimeout(() => setMessage({ type: '', text: '' }), 3000)
    } finally {
      setUploadingAvatar(false)
    }
  }

  const showMessage = (type, text) => {
    setMessage({ type, text })
    setTimeout(() => setMessage({ type: '', text: '' }), 3000)
  }

  const refreshData = async () => {
    setLoading(true)
    try {
      await Promise.all([loadUserData(), loadClubs()])
      setMessage({ type: 'success', text: 'Data refreshed successfully!' })
      setTimeout(() => setMessage({ type: '', text: '' }), 3000)
    } catch (error) {
      console.error('Error refreshing data:', error)
      setMessage({ type: 'error', text: 'Failed to refresh data' })
      setTimeout(() => setMessage({ type: '', text: '' }), 3000)
    } finally {
      setLoading(false)
    }
  }

  // Show loading state if data is not loaded yet
  if (!dataLoaded) {
  return (
    <Layout>
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="dark-card-primary p-8 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary-400" />
            <p className="text-content-primary">Loading your dashboard...</p>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <>
      {/* Loading State */}
      {loading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="dark-card-primary p-8 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary-400" />
            <p className="text-content-primary">Loading your dashboard...</p>
          </div>
        </div>
      )}

      

      {/* Success/Error Messages */}
      {message.text && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm ${
            message.type === 'success' 
              ? 'bg-green-500 text-white border border-green-400' 
              : 'bg-red-500 text-white border border-red-400'
          }`}
        >
          <div className="flex items-center space-x-2">
            {message.type === 'success' ? (
              <CheckCircle className="h-5 w-5" />
            ) : (
              <AlertCircle className="h-5 w-5" />
            )}
            <span className="font-medium">{message.text}</span>
          </div>
        </motion.div>
      )}

      <div className="space-y-6">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="dark-card-elevated rounded-2xl p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-content-primary mb-2">
                Welcome back, {user?.name || 'Player'}! 👋
              </h1>
              <p className="text-content-secondary text-lg">
                Track your performance, manage club memberships, and access AI-powered insights
              </p>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <Button 
                variant="outline" 
                className="dark-btn-secondary"
                onClick={refreshData}
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
             
              <Button 
                className="dark-btn-primary"
                onClick={() => {
                  const firstAvailableClub = clubs.find(club => !club.isMember)
                  if (firstAvailableClub) {
                    handleEnrollment(firstAvailableClub)
                  } else {
                    setMessage({ type: 'info', text: 'No available clubs to join' })
                    setTimeout(() => setMessage({ type: '', text: '' }), 3000)
                  }
                }}
                disabled={clubs.length === 0}
              >
                <Plus className="h-4 w-4 mr-2" />
                Join Club
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Profile Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="dark-card-primary">
            <CardHeader>
              <CardTitle className="text-content-primary flex items-center">
                <User className="h-5 w-5 mr-2 text-primary-400" />
                My Profile
              </CardTitle>
              <CardDescription className="text-content-secondary">
                Manage your player profile and personal information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Profile Picture */}
                <div className="text-center">
                  <div className="relative inline-block">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-border-primary mx-auto mb-4">
                      {player?.avatarUrl ? (
                        <img 
                          src={player.avatarUrl} 
                          alt="Profile" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-surface-secondary flex items-center justify-center text-content-muted text-4xl">
                          <User />
                        </div>
                      )}
                    </div>
                    <label className="cursor-pointer dark-btn-primary px-4 py-2 rounded-lg transition duration-300 flex items-center gap-2 mx-auto w-fit">
                      <Camera className="h-4 w-4" />
                      {uploadingAvatar ? 'Uploading...' : 'Upload Photo'}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        className="hidden"
                        disabled={uploadingAvatar}
                      />
                    </label>
                  </div>
                </div>

                {/* Profile Information */}
                <div className="md:col-span-2">
                  {editingProfile ? (
                    <form onSubmit={updateProfile} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="dark-form-label">Name *</label>
                          <input
                            type="text"
                            value={profileForm.name}
                            onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                            className="dark-input-primary w-full"
                            required
                            minLength={2}
                            maxLength={50}
                            placeholder="Enter your full name"
                          />
                        </div>
                        <div>
                          <label className="dark-form-label">Position *</label>
                          <select
                            value={profileForm.position}
                            onChange={(e) => setProfileForm({...profileForm, position: e.target.value})}
                            className="dark-input-primary w-full"
                            required
                          >
                            <option value="">Select Position</option>
                            <option value="Forward">Forward</option>
                            <option value="Midfielder">Midfielder</option>
                            <option value="Defender">Defender</option>
                            <option value="Goalkeeper">Goalkeeper</option>
                            <option value="Winger">Winger</option>
                            <option value="Striker">Striker</option>
                            <option value="Center Back">Center Back</option>
                            <option value="Full Back">Full Back</option>
                            <option value="Central Midfielder">Central Midfielder</option>
                            <option value="Attacking Midfielder">Attacking Midfielder</option>
                            <option value="Defensive Midfielder">Defensive Midfielder</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="dark-form-label">Email *</label>
                        <input
                          type="email"
                          value={profileForm.email}
                          onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                          className="dark-input-primary w-full"
                          required
                          placeholder="Enter your email address"
                        />
                      </div>
                      <div className="flex gap-3">
                        <Button
                          type="submit"
                          disabled={loading || !profileForm.name || !profileForm.position || !profileForm.email}
                          className="dark-btn-primary"
                        >
                          {loading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            'Save Changes'
                          )}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setEditingProfile(false)
                            // Reset form to original values
                            setProfileForm({
                              name: user?.name || "",
                              position: player?.position || "",
                              email: user?.email || ""
                            })
                          }}
                          disabled={loading}
                          className="dark-btn-secondary"
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-content-muted text-sm mb-1">Name</label>
                        <p className="text-content-primary font-medium">{user?.name || "Not set"}</p>
                      </div>
                      <div>
                        <label className="block text-content-muted text-sm mb-1">Position</label>
                        <p className="text-content-primary font-medium">{player?.position || "Not set"}</p>
                      </div>
                      <div>
                        <label className="block text-content-muted text-sm mb-1">Email</label>
                        <p className="text-content-primary font-medium">{user?.email || "Not set"}</p>
                      </div>
                      <div>
                        <label className="block text-content-muted text-sm mb-1">Role</label>
                        <p className="text-content-primary font-medium capitalize">{user?.role || "Not set"}</p>
                      </div>
                    </div>
                  )}
                  
                  {!editingProfile && (
                    <div className="mt-6">
                      <Button
                        onClick={() => setEditingProfile(true)}
                        className="dark-btn-primary"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Profile
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        
               

        {/* Available Clubs Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="dark-card-primary">
            <CardHeader>
              <CardTitle className="text-content-primary flex items-center">
                <Trophy className="h-5 w-5 mr-2 text-sports-yellow" />
                Available Clubs
              </CardTitle>
              <CardDescription className="text-content-secondary">
                Join sports clubs and start your athletic journey
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {clubs.map((club, index) => (
                  <motion.div
                    key={club._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="dark-card-secondary rounded-2xl p-6 hover:bg-surface-tertiary transition-all duration-300"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-content-primary mb-2 flex items-center gap-2">
                          {club.name}
                          {club.isMember && (
                            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">
                              Enrolled
                            </span>
                          )}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-center text-content-secondary">
                            <MapPin className="h-4 w-4 mr-2 text-primary-400" />
                            {club.location}
                          </div>
                          <div className="flex items-center text-content-secondary">
                            <DollarSign className="h-4 w-4 mr-2 text-accent-400" />
                            Fee: ${club.registrationFee}
                          </div>
                          <div className="flex items-center text-content-secondary">
                            <Trophy className="h-4 w-4 mr-2 text-sports-yellow" />
                            {club.sport}
                          </div>
                          <div className="flex items-center text-content-secondary">
                            <PlayersIcon className="h-4 w-4 mr-2 text-secondary-400" />
                            {club.players?.length || 0} Players
                          </div>
                        </div>
                      </div>
                      <div className="ml-4 flex flex-col space-y-2">
                        {club.isMember ? (
                          <>
                            <div className="flex items-center text-green-400 text-sm mb-2">
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Enrolled
                            </div>
                          <Button
                            onClick={() => leaveClub(club._id)}
                            variant="outline"
                              className="border-red-500 text-red-400 hover:bg-red-500/10"
                              disabled={enrollingClub}
                            >
                              {enrollingClub ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Processing...
                                </>
                              ) : (
                                'Leave Club'
                              )}
                          </Button>
                          </>
                        ) : (
                          <Button
                            onClick={() => handleEnrollment(club)}
                            className="dark-btn-primary"
                            disabled={enrollingClub}
                          >
                            {enrollingClub ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Processing...
                              </>
                            ) : (
                              <>
                                <Plus className="mr-2 h-4 w-4" />
                            Enroll Now
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}

                {clubs.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12"
                  >
                    <p className="text-content-muted text-lg">No clubs available at the moment.</p>
                  </motion.div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Club Enrollment Modal */}
        {showEnrollment && selectedClub && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="dark-modal rounded-2xl p-3 w-full max-w-sm"
            >
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-bold text-content-primary">Enroll in {selectedClub.name}</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowEnrollment(false)}
                  className="text-content-secondary hover:text-primary-400 p-1"
                  disabled={enrollingClub}
                >
                  ✕
                </Button>
              </div>
              
              <div className="space-y-3">
                {/* Club Details */}
                <div className="dark-card-secondary rounded-lg p-2.5">
                  <div className="flex items-center space-x-2 mb-2">
                    <Trophy className="h-4 w-4 text-sports-yellow" />
                    <h3 className="text-sm font-semibold text-content-primary">{selectedClub.name}</h3>
                  </div>
                  <div className="grid grid-cols-1 gap-1.5 text-xs">
                    <div className="flex items-center text-content-secondary">
                      <MapPin className="h-3 w-3 mr-1.5 text-primary-400" />
                      {selectedClub.location}
                    </div>
                    <div className="flex items-center text-content-secondary">
                      <DollarSign className="h-3 w-3 mr-1.5 text-accent-400" />
                      Fee: ₹{selectedClub.registrationFee}
                    </div>
                    <div className="flex items-center text-content-secondary">
                      <Trophy className="h-3 w-3 mr-1.5 text-sports-yellow" />
                      {selectedClub.sport}
                    </div>
                    <div className="flex items-center text-content-secondary">
                      <PlayersIcon className="h-3 w-3 mr-1.5 text-secondary-400" />
                      {selectedClub.players?.length || 0} Players
                    </div>
                  </div>
                </div>
                
                {/* Payment Details */}
                <div className="dark-card-secondary rounded-lg p-2.5 w-2/3 mx-auto">
                  <h4 className="font-semibold text-content-primary mb-1.5 flex items-center text-xs">
                    <CreditCard className="h-3 w-3 mr-1.5 text-primary-400" />
                    Payment Details
                  </h4>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-content-secondary">Registration Fee:</span>
                      <span className="font-semibold text-content-primary">₹{selectedClub.registrationFee}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-content-secondary">Payment Method:</span>
                      <span className="text-content-primary">Razorpay</span>
                    </div>
                    <div className="border-t border-border-secondary pt-1 mt-1">
                      <div className="flex justify-between items-center font-semibold">
                        <span className="text-content-primary">Total:</span>
                        <span className="text-primary-400 text-xs">₹{selectedClub.registrationFee}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enrollment Benefits */}
                <div className="dark-card-secondary rounded-lg p-2.5">
                  <h4 className="font-semibold text-content-primary mb-1.5 text-xs">What you'll get:</h4>
                  <ul className="space-y-1 text-xs text-content-secondary">
                    <li className="flex items-center">
                      <CheckCircle className="h-3 w-3 mr-1.5 text-green-400" />
                      Access to training facilities
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-3 w-3 mr-1.5 text-green-400" />
                      Professional coaching sessions
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-3 w-3 mr-1.5 text-green-400" />
                      Participation in tournaments
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-3 w-3 mr-1.5 text-green-400" />
                      Performance tracking and analytics
                    </li>
                  </ul>
                </div>
                
                {/* Action Buttons */}
                <div className="space-y-2 border-t border-gray-600 pt-2">
                  <Button
                    onClick={handleEnrollmentComplete}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1.5 px-3 rounded-lg transition-colors duration-200 flex items-center justify-center text-xs"
                    disabled={enrollingClub}
                    style={{ display: 'block', visibility: 'visible', opacity: 1 }}
                  >
                    {enrollingClub ? (
                      <>
                        <Loader2 className="mr-1.5 h-3 w-3 animate-spin" />
                        Processing Payment...
                      </>
                    ) : (
                      <>
                        <CreditCard className="mr-1.5 h-3 w-3" />
                        Pay ₹{selectedClub.registrationFee} & Enroll
                      </>
                    )}
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => setShowEnrollment(false)}
                    className="w-full border border-gray-600 text-gray-300 hover:bg-gray-700 py-1.5 px-3 rounded-lg transition-colors duration-200 text-xs"
                    disabled={enrollingClub}
                    style={{ display: 'block', visibility: 'visible', opacity: 1 }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* AI Performance Analysis Modal */}
        {showAIAnalysis && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="dark-modal rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-content-primary">AI Performance Analysis</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAIAnalysis(false)}
                    className="text-content-secondary hover:text-primary-400"
                  >
                    ✕
                  </Button>
                </div>
                <div className="dark-card-secondary rounded-lg p-8 text-center">
                  <Brain className="text-6xl text-secondary-400 mx-auto mb-4" />
                  <h4 className="text-xl font-bold text-content-primary mb-2">AI Analysis Coming Soon</h4>
                  <p className="text-content-secondary">Advanced performance analytics powered by artificial intelligence</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* AI Training Recommendations Modal */}
        {showTrainingRecommendations && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="dark-modal rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-content-primary">AI Training Recommendations</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowTrainingRecommendations(false)}
                    className="text-content-secondary hover:text-primary-400"
                  >
                    ✕
                  </Button>
                </div>
                <div className="dark-card-secondary rounded-lg p-8 text-center">
                  <ChartLine className="text-6xl text-accent-400 mx-auto mb-4" />
                  <h4 className="text-xl font-bold text-content-primary mb-2">AI Training Coming Soon</h4>
                  <p className="text-content-secondary">Personalized training plans and recommendations</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </>
  )
}
