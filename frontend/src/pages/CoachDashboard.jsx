import React, { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import { Layout } from "../components/ui/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { AuthContext } from "../context/AuthContext";
import api from "../api.jsx";
import { useToast } from '../components/ui/use-toast';
import { 
  Users, 
  Trophy, 
  Calendar, 
  TrendingUp, 
  Plus, 
  ArrowRight,
  Star,
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
  Shield,
  Settings,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  RefreshCw,
  Clock,

  BookOpen,
  Users as PlayersIcon
} from 'lucide-react';

const CoachDashboard = () => {
  const { user } = useContext(AuthContext);
  const { toast } = useToast();
  const [myClubs, setMyClubs] = useState([]);
  const [assignedPlayers, setAssignedPlayers] = useState([]);
  const [trainingSchedules, setTrainingSchedules] = useState([]);

  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedView, setSelectedView] = useState('overview');
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  // filters removed
  const [showCreateClubModal, setShowCreateClubModal] = useState(false);
  const [clubFormData, setClubFormData] = useState({
    name: '',
    sport: '',
    location: '',
    description: '',
    registrationFee: '',
    maxPlayers: '',
    facilities: ''
  });
  const [isNameChecking, setIsNameChecking] = useState(false);
  const [isNameTaken, setIsNameTaken] = useState(false);
  const [nameCheckMessage, setNameCheckMessage] = useState('');
  const [allClubNames, setAllClubNames] = useState(null);
  const [creatingClub, setCreatingClub] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  useEffect(() => {
    fetchCoachData();
    
    // Set up real-time data refresh every 30 seconds
    const interval = setInterval(() => {
      fetchCoachData();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchCoachData = async () => {
    try {
      setLoading(true);
      
      // Fetch all coach data in parallel with real-time data
      const [clubsRes, playersRes, schedulesRes] = await Promise.all([
        api.get('/coaches/my-clubs').catch((error) => {
          console.log('Clubs fetch error:', error.response?.status, error.response?.data?.message);
          if (error.response?.status === 404) {
            toast({
              title: "Coach Profile Not Found",
              description: "Please ensure your coach profile is properly set up.",
              variant: "destructive",
              duration: 5000,
            });
          }
          return { data: { clubs: [] } };
        }),
        api.get('/coaches/assigned-players').catch((error) => {
          console.log('Players fetch error:', error.response?.status, error.response?.data?.message);
          toast({
            title: "Player Data Fetch Error",
            description: error.response?.data?.message || "Failed to fetch player data",
            variant: "destructive",
            duration: 3000,
          });
          return { data: { players: [] } };
        }),
        api.get('/coaches/training-schedules').catch((error) => {
          console.log('Schedules fetch error:', error.response?.status, error.response?.data?.message);
          return { data: { schedules: [] } };
        }),

      ]);
      
      // Set real-time data from database
      console.log('📊 Fetched data:', {
        clubs: clubsRes.data.clubs?.length || 0,
        players: playersRes.data.players?.length || 0,
        schedules: schedulesRes.data.schedules?.length || 0
      });
      
      setMyClubs(clubsRes.data.clubs || []);
      setAssignedPlayers(playersRes.data.players || []);
      setTrainingSchedules(schedulesRes.data.schedules || []);
      
      // Calculate coach-specific stats from real data
      setStats({
        totalClubs: clubsRes.data.clubs?.length || 0,
        totalPlayers: playersRes.data.players?.length || 0,
        activeSchedules: schedulesRes.data.schedules?.filter(s => s.status === 'active')?.length || 0
      });
    } catch (error) {
      console.error('Error fetching coach data:', error);
      toast({
        title: "Error Loading Data",
        description: "Failed to load dashboard data. Please try refreshing.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTraining = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const trainingData = {
      title: formData.get('title'),
      date: formData.get('date'),
      time: formData.get('time'),
      venue: formData.get('venue'),
      clubId: formData.get('clubId') || null
    };
    
    try {
      setLoading(true);
      await api.post('/coaches/training-schedules', trainingData);
      
      toast({
        title: "Training Schedule Created",
        description: "Your training schedule has been created successfully.",
        duration: 3000,
      });
      
      fetchCoachData(); // Refresh data
      closeModal();
    } catch (error) {
      console.error('Error creating training schedule:', error);
      
      let errorMessage = "Failed to create training schedule";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      toast({
        title: "Creation Failed",
        description: errorMessage,
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };



  const handleAssignPlayerToClub = async (playerId, clubId) => {
    try {
      setLoading(true);
      await api.post(`/coaches/players/${playerId}/assign-club`, { clubId });
      alert('Player assigned to club successfully');
      fetchCoachData(); // Refresh data
    } catch (error) {
      console.error('Error assigning player to club:', error);
      alert('Failed to assign player to club');
    } finally {
      setLoading(false);
    }
  };

  const handleAssignPlayerToClubModal = async (playerId) => {
    // Show a modal to select which club to assign the player to
    const availableClubs = myClubs.filter(club => club.status === 'approved');
    
    if (availableClubs.length === 0) {
      toast({
        title: "No Approved Clubs",
        description: "You need to have at least one approved club to assign players.",
        variant: "destructive",
        duration: 5000,
      });
      return;
    }
    
    const clubName = prompt(
      `Select a club to assign this player to:\n\n${availableClubs.map((club, index) => `${index + 1}. ${club.name} (${club.sport})`).join('\n')}\n\nEnter the club number (1-${availableClubs.length}):`
    );
    
    if (!clubName) return;
    
    const clubIndex = parseInt(clubName) - 1;
    if (isNaN(clubIndex) || clubIndex < 0 || clubIndex >= availableClubs.length) {
      toast({
        title: "Invalid Selection",
        description: "Please enter a valid club number.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    
    const selectedClub = availableClubs[clubIndex];
    
    try {
      setLoading(true);
      await api.post(`/coaches/players/${playerId}/assign-club`, { clubId: selectedClub._id });
      
      toast({
        title: "Player Assigned Successfully",
        description: `Player has been assigned to ${selectedClub.name}`,
        duration: 3000,
      });
      
      fetchCoachData(); // Refresh data
    } catch (error) {
      console.error('Error assigning player to club:', error);
      
      let errorMessage = "Failed to assign player to club";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      toast({
        title: "Assignment Failed",
        description: errorMessage,
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemovePlayerFromClub = async (playerId, clubId) => {
    if (!confirm('Are you sure you want to remove this player from the club? This action cannot be undone.')) {
      return;
    }

    try {
      setLoading(true);
      await api.delete(`/coaches/clubs/${clubId}/players/${playerId}`);
      
      toast({
        title: "Player Removed Successfully",
        description: "The player has been removed from the club.",
        duration: 3000,
      });
      
      fetchCoachData(); // Refresh data
    } catch (error) {
      console.error('Error removing player from club:', error);
      
      let errorMessage = "Failed to remove player from club";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      toast({
        title: "Failed to Remove Player",
        description: errorMessage,
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClub = async (e) => {
    e.preventDefault();
    try {
      setCreatingClub(true);
      
      // Check if club name already exists
      if (myClubs.some(club => club.name.toLowerCase().trim() === clubFormData.name.toLowerCase().trim())) {
        toast({
          title: "Club Name Already Exists",
          description: "A club with this name already exists. Please choose a different name.",
          variant: "destructive",
          duration: 5000,
        });
        // Re-enable submit button if we early-return
        setCreatingClub(false);
        return;
      }
      
      const response = await api.post('/clubs', {
        ...clubFormData,
        registrationFee: Number(clubFormData.registrationFee),
        maxPlayers: Number(clubFormData.maxPlayers),
        coach: user._id || user.id, // Try both _id and id
        status: 'pending' // All coach-created clubs start as pending
      });
      
      if (response.data.success) {
        toast({
          title: "Club Created Successfully! 🎉",
          description: "Your club creation request has been submitted and is pending admin approval. You'll be notified once it's reviewed.",
          duration: 5000,
        });
        setShowCreateClubModal(false);
        setClubFormData({
          name: '',
          sport: '',
          location: '',
          description: '',
          registrationFee: '',
          maxPlayers: '',
          facilities: ''
        });
        fetchCoachData(); // Refresh data to show new club
      }
    } catch (error) {
      console.error('Error creating club:', error);
      
      let errorMessage = "An error occurred while creating the club";
      if (error.response?.status === 409) {
        errorMessage = "A club with this name already exists. Please choose a different name.";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Failed to Create Club",
        description: errorMessage,
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setCreatingClub(false);
    }
  };

  const handleClubFormChange = (e) => {
    setClubFormData({
      ...clubFormData,
      [e.target.name]: e.target.value
    });
  };

  // Live club name availability check (debounced)
  useEffect(() => {
    const name = clubFormData.name?.trim();
    if (!showCreateClubModal) return;
    if (!name) {
      setIsNameTaken(false);
      setNameCheckMessage('');
      return;
    }

    // Immediate client-side check against myClubs to give fast feedback
    const duplicateMine = myClubs.some(
      (club) => club.name?.trim().toLowerCase() === name.toLowerCase()
    );
    if (duplicateMine) {
      setIsNameTaken(true);
      setNameCheckMessage('You already have a club with this name. Choose another.');
      return;
    }

    let cancelled = false;
    setIsNameChecking(true);
    setIsNameTaken(false);
    setNameCheckMessage('');

    const timer = setTimeout(async () => {
      try {
        // Fetch all club names once and cache during modal session
        if (!allClubNames) {
          const res = await api.get('/clubs');
          const names = Array.isArray(res.data)
            ? res.data.map((c) => String(c.name || '').trim().toLowerCase()).filter(Boolean)
            : [];
          if (!cancelled) setAllClubNames(names);
          if (!cancelled) {
            const taken = names.includes(name.toLowerCase());
            setIsNameTaken(taken);
            setNameCheckMessage(taken ? 'This club name is already taken.' : 'Name is available.');
          }
        } else {
          const taken = allClubNames.includes(name.toLowerCase());
          if (!cancelled) {
            setIsNameTaken(taken);
            setNameCheckMessage(taken ? 'This club name is already taken.' : 'Name is available.');
          }
        }
      } catch (err) {
        // On error, do not block submit; rely on server 409
        if (!cancelled) {
          setIsNameTaken(false);
          setNameCheckMessage('');
        }
      } finally {
        if (!cancelled) setIsNameChecking(false);
      }
    }, 400); // debounce

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [clubFormData.name, showCreateClubModal, myClubs, allClubNames]);

  const openModal = (type, item = null) => {
    setModalType(type);
    setSelectedItem(item);
    if (type === 'edit' && item) {
      setEditingItem(item);
      setEditFormData({
        name: item.name || '',
        sport: item.sport || '',
        location: item.location || '',
        description: item.description || '',
        registrationFee: item.registrationFee || '',
        maxPlayers: item.maxPlayers || '',
        facilities: item.facilities || '',
        // For schedules
        title: item.title || '',
        date: item.date || '',
        time: item.time || '',
        venue: item.venue || ''
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedItem(null);
    setModalType('');
    setEditingItem(null);
    setEditFormData({});
  };

  const handleEditFormChange = (e) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      if (selectedView === 'clubs') {
        await api.put(`/clubs/${selectedItem._id}`, editFormData);
        toast({
          title: "Club Updated Successfully",
          description: "Your club details have been updated.",
          duration: 3000,
        });
      } else if (selectedView === 'schedules') {
        await api.put(`/coaches/training-schedules/${selectedItem._id}`, editFormData);
        toast({
          title: "Schedule Updated Successfully",
          description: "Your training schedule has been updated.",
          duration: 3000,
        });
      }
      
      fetchCoachData();
      closeModal();
    } catch (error) {
      console.error('Error updating item:', error);
      toast({
        title: "Update Failed",
        description: error.response?.data?.message || "Failed to update item",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  const renderModalContent = () => {
    if (modalType === 'view') {
      return (
        <div className="space-y-6">
          {selectedView === 'clubs' && selectedItem && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-content-secondary mb-1">Club Name</label>
                  <p className="text-content-primary font-medium">{selectedItem.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-content-secondary mb-1">Sport</label>
                  <p className="text-content-primary font-medium">{selectedItem.sport}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-content-secondary mb-1">Location</label>
                  <p className="text-content-primary font-medium">{selectedItem.location}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-content-secondary mb-1">Status</label>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    selectedItem.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                    selectedItem.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                    selectedItem.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                    'bg-gray-500/20 text-gray-400'
                  }`}>
                    {selectedItem.status}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-content-secondary mb-1">Registration Fee</label>
                  <p className="text-content-primary font-medium">₹{selectedItem.registrationFee}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-content-secondary mb-1">Max Players</label>
                  <p className="text-content-primary font-medium">{selectedItem.maxPlayers || 'Unlimited'}</p>
                </div>
              </div>
              {selectedItem.description && (
                <div>
                  <label className="block text-sm font-medium text-content-secondary mb-1">Description</label>
                  <p className="text-content-primary">{selectedItem.description}</p>
                </div>
              )}
              {selectedItem.facilities && (
                <div>
                  <label className="block text-sm font-medium text-content-secondary mb-1">Facilities</label>
                  <p className="text-content-primary">{selectedItem.facilities}</p>
                </div>
              )}
            </div>
          )}
          
          {selectedView === 'schedules' && selectedItem && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-content-secondary mb-1">Title</label>
                  <p className="text-content-primary font-medium">{selectedItem.title}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-content-secondary mb-1">Date</label>
                  <p className="text-content-primary font-medium">{selectedItem.date}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-content-secondary mb-1">Time</label>
                  <p className="text-content-primary font-medium">{selectedItem.time}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-content-secondary mb-1">Venue</label>
                  <p className="text-content-primary font-medium">{selectedItem.venue}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-content-secondary mb-1">Status</label>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    selectedItem.status === 'active' ? 'bg-green-500/20 text-green-400' :
                    selectedItem.status === 'completed' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-gray-500/20 text-gray-400'
                  }`}>
                    {selectedItem.status}
                  </span>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex justify-end pt-4">
            <Button variant="outline" onClick={closeModal}>
              Close
            </Button>
          </div>
        </div>
      );
    }
    
    if (modalType === 'edit') {
      return (
        <form onSubmit={handleEditSubmit} className="space-y-6">
          {selectedView === 'clubs' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-content-primary mb-2">Club Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={editFormData.name}
                    onChange={handleEditFormChange}
                    required
                    className="dark-input-primary w-full"
                    placeholder="Enter club name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-content-primary mb-2">Sport *</label>
                  <input
                    type="text"
                    name="sport"
                    value={editFormData.sport}
                    onChange={handleEditFormChange}
                    required
                    className="dark-input-primary w-full"
                    placeholder="e.g., Football, Cricket"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-content-primary mb-2">Location *</label>
                  <input
                    type="text"
                    name="location"
                    value={editFormData.location}
                    onChange={handleEditFormChange}
                    required
                    className="dark-input-primary w-full"
                    placeholder="Enter location"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-content-primary mb-2">Registration Fee (₹) *</label>
                  <input
                    type="number"
                    name="registrationFee"
                    value={editFormData.registrationFee}
                    onChange={handleEditFormChange}
                    required
                    min="0"
                    className="dark-input-primary w-full"
                    placeholder="Enter fee amount"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-content-primary mb-2">Max Players</label>
                  <input
                    type="number"
                    name="maxPlayers"
                    value={editFormData.maxPlayers}
                    onChange={handleEditFormChange}
                    min="1"
                    className="dark-input-primary w-full"
                    placeholder="Enter max players"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-content-primary mb-2">Facilities</label>
                  <input
                    type="text"
                    name="facilities"
                    value={editFormData.facilities}
                    onChange={handleEditFormChange}
                    className="dark-input-primary w-full"
                    placeholder="e.g., Gym, Pool, Field"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-content-primary mb-2">Description</label>
                <textarea
                  name="description"
                  value={editFormData.description}
                  onChange={handleEditFormChange}
                  rows="3"
                  className="dark-input-primary w-full"
                  placeholder="Describe your club and what makes it special..."
                />
              </div>
            </div>
          )}
          
          {selectedView === 'schedules' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-content-primary mb-2">Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={editFormData.title}
                    onChange={handleEditFormChange}
                    required
                    className="dark-input-primary w-full"
                    placeholder="Enter training title"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-content-primary mb-2">Date *</label>
                  <input
                    type="date"
                    name="date"
                    value={editFormData.date}
                    onChange={handleEditFormChange}
                    required
                    className="dark-input-primary w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-content-primary mb-2">Time *</label>
                  <input
                    type="time"
                    name="time"
                    value={editFormData.time}
                    onChange={handleEditFormChange}
                    required
                    className="dark-input-primary w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-content-primary mb-2">Venue *</label>
                  <input
                    type="text"
                    name="venue"
                    value={editFormData.venue}
                    onChange={handleEditFormChange}
                    required
                    className="dark-input-primary w-full"
                    placeholder="Enter venue"
                  />
                </div>
              </div>
            </div>
          )}
          
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Edit className="h-4 w-4 mr-2" />
                  Update {selectedView?.slice(0, -1) || 'Item'}
                </>
              )}
            </Button>
            
            <Button
              type="button"
              variant="outline"
              onClick={closeModal}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      );
    }
    
    if (modalType === 'create-schedule') {
      return (
        <form onSubmit={handleCreateTraining} className="space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-content-primary mb-2">Title *</label>
                <input
                  type="text"
                  name="title"
                  required
                  className="dark-input-primary w-full"
                  placeholder="Enter training title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-content-primary mb-2">Date *</label>
                <input
                  type="date"
                  name="date"
                  required
                  className="dark-input-primary w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-content-primary mb-2">Time *</label>
                <input
                  type="time"
                  name="time"
                  required
                  className="dark-input-primary w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-content-primary mb-2">Venue *</label>
                <input
                  type="text"
                  name="venue"
                  required
                  className="dark-input-primary w-full"
                  placeholder="Enter venue"
                />
              </div>
            </div>
            
            {myClubs.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-content-primary mb-2">Club (Optional)</label>
                <select
                  name="clubId"
                  className="dark-input-primary w-full"
                >
                  <option value="">Select a club (optional)</option>
                  {myClubs.filter(club => club.status === 'approved').map(club => (
                    <option key={club._id} value={club._id}>
                      {club.name} ({club.sport})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating Schedule...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Training Schedule
                </>
              )}
            </Button>
            
            <Button
              type="button"
              variant="outline"
              onClick={closeModal}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      );
    }
    
    return (
      <div className="text-content-secondary">
        Modal content for {modalType} {selectedView?.slice(0, -1) || 'item'} coming soon...
      </div>
    );
  };

  const filteredData = () => {
    let data = [];
    
    if (selectedView === 'players') {
      data = assignedPlayers;
    } else if (selectedView === 'clubs') {
      data = myClubs;
    } else if (selectedView === 'schedules') {
      data = trainingSchedules;
    }
    
    // search removed
    
    return data;
  };

  const renderStatsCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <Card className="dark-card-primary">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className={`h-12 w-12 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center`}>
              <Trophy className="h-6 w-6 text-white" />
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-content-primary">{stats.totalClubs || 0}</p>
              <p className="text-content-secondary">My Clubs</p>
              {myClubs.length > 0 && (
                <div className="text-xs text-content-muted mt-1">
                  {myClubs.filter(c => c.status === 'pending').length} pending, {myClubs.filter(c => c.status === 'approved').length} approved
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="dark-card-primary">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className={`h-12 w-12 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center`}>
              <Users className="h-6 w-6 text-white" />
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-content-primary">{stats.totalPlayers || 0}</p>
              <p className="text-content-secondary">Assigned Players</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="dark-card-primary">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className={`h-12 w-12 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center`}>
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-content-primary">{stats.activeSchedules || 0}</p>
              <p className="text-content-secondary">Active Schedules</p>
            </div>
          </div>
        </CardContent>
      </Card>


            </div>
  );

  const renderNavigationTabs = () => (
    <div className="flex flex-wrap gap-2 mb-6">
      {[
        { id: 'overview', label: 'Overview', icon: Target },
        { id: 'clubs', label: 'My Clubs', icon: Trophy },
        { id: 'players', label: 'Players', icon: Users },
        { id: 'schedules', label: 'Training', icon: Calendar }
      ].map((tab) => (
        <Button
          key={tab.id}
          variant={selectedView === tab.id ? "default" : "outline"}
          onClick={() => setSelectedView(tab.id)}
          className="flex items-center gap-2"
        >
          <tab.icon className="h-4 w-4" />
          {tab.label}
        </Button>
      ))}
      
      {/* Create Buttons */}
      {selectedView === 'clubs' && (
      <Button
        onClick={() => setShowCreateClubModal(true)}
        disabled={loading}
        className="ml-auto bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        ) : (
          <Plus className="h-4 w-4 mr-2" />
        )}
        {loading ? 'Loading...' : 'Create Club'}
      </Button>
      )}
      
      {selectedView === 'schedules' && (
        <Button
          onClick={() => openModal('create-schedule')}
          disabled={loading}
          className="ml-auto bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Plus className="h-4 w-4 mr-2" />
          )}
          {loading ? 'Loading...' : 'Create Schedule'}
        </Button>
      )}
    </div>
  );

  const renderDataTable = () => {
    const data = filteredData();
    
    if (data.length === 0) {
      return (
        <Card className="dark-card-primary">
          <CardContent className="p-8 text-center">
            <Users className="h-12 w-12 text-content-muted mx-auto mb-4" />
            <p className="text-content-secondary">No {selectedView} found</p>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card className="dark-card-primary">
        <CardHeader>
          <CardTitle className="text-content-primary">
            {selectedView.charAt(0).toUpperCase() + selectedView.slice(1)} Management
          </CardTitle>
          <CardDescription className="text-content-secondary">
            Manage your {selectedView} and assignments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border-primary">
                  <th className="text-left p-3 text-content-primary font-semibold">
                    {selectedView === 'schedules' ? 'Title' : 'Name'}
                  </th>
                  <th className="text-left p-3 text-content-primary font-semibold">Details</th>
                  <th className="text-left p-3 text-content-primary font-semibold">Status</th>
                  <th className="text-left p-3 text-content-primary font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item) => (
                  <tr key={item._id} className="border-b border-border-secondary hover:bg-surface-secondary">
                    <td className="p-3 text-content-primary">
                      {selectedView === 'schedules' ? item.title : item.name}
                    </td>
                    <td className="p-3 text-content-secondary">
                      {selectedView === 'players' && (
                      <div>
                          <p className="text-sm">{item.position || 'N/A'}</p>
                          <p className="text-xs text-content-muted">{item.email}</p>
                          {item.club && (
                            <div className="mt-1">
                              <p className="text-xs text-blue-400">
                                🏆 {item.club.name} ({item.club.sport})
                              </p>
                              <p className="text-xs text-content-muted">{item.club.location}</p>
                            </div>
                          )}
                          {!item.club && (
                            <p className="text-xs text-orange-400 mt-1">⚠️ Not assigned to any club</p>
                          )}
                      </div>
                      )}
                      {selectedView === 'clubs' && (
                        <div>
                          <p className="text-sm">{item.location}</p>
                          <p className="text-xs text-content-muted">{item.sport}</p>
                          {item.description && (
                            <p className="text-xs text-content-muted mt-1">{item.description}</p>
                          )}
                          {item.maxPlayers && (
                            <p className="text-xs text-content-muted">Max: {item.maxPlayers} players</p>
                          )}
                        </div>
                      )}
                      {selectedView === 'schedules' && (
                              <div>
                          <p className="text-sm">{item.date} at {item.time}</p>
                          <p className="text-xs text-content-muted">{item.venue}</p>
                          {item.players && item.players.length > 0 && (
                            <p className="text-xs text-blue-400 mt-1">
                              👥 {item.players.length} players enrolled
                            </p>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                        item.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                        item.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                        item.status === 'active' ? 'bg-blue-500/20 text-blue-400' :
                        item.status === 'inactive' ? 'bg-gray-500/20 text-gray-400' :
                        'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {item.status || 'pending'}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openModal('view', item)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openModal('edit', item)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>

                        {selectedView === 'players' && item.club && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRemovePlayerFromClub(item._id, item.club._id || item.club)}
                            className="text-red-400 hover:text-red-600 hover:bg-red-50"
                            title="Remove from club"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                        {selectedView === 'players' && !item.club && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleAssignPlayerToClubModal(item._id)}
                            className="text-green-400 hover:text-green-600 hover:bg-green-50"
                            title="Assign to club"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                                )}
                              </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {renderStatsCards()}
      
      {/* Clubs Status Overview */}
      <Card className="dark-card-primary">
        <CardHeader>
          <CardTitle className="text-content-primary">My Clubs Status</CardTitle>
          <CardDescription className="text-content-secondary">
            Overview of your club creation requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          {myClubs.length === 0 ? (
            <div className="text-center py-8">
              <Trophy className="h-12 w-12 text-content-muted mx-auto mb-4" />
              <p className="text-content-secondary mb-4">You haven't created any clubs yet</p>
              <Button
                onClick={() => setShowCreateClubModal(true)}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Club
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {myClubs.map((club) => (
                <div key={club._id} className="flex items-center justify-between p-4 bg-surface-secondary rounded-lg border border-border-secondary">
                  <div className="flex-1">
                    <h3 className="font-semibold text-content-primary">{club.name}</h3>
                    <p className="text-sm text-content-secondary">{club.sport} • {club.location}</p>
                    {club.description && (
                      <p className="text-xs text-content-muted mt-1">{club.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      club.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                      club.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                      club.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      {club.status === 'pending' ? '⏳ Pending Approval' :
                       club.status === 'approved' ? '✅ Approved' :
                       club.status === 'rejected' ? '❌ Rejected' :
                       club.status}
                    </span>
                    {club.status === 'pending' && (
                      <div className="text-xs text-yellow-400">
                        Waiting for admin review
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="dark-card-primary hover:bg-surface-secondary transition-colors cursor-pointer">
          <CardContent className="p-6 text-center">
            <Trophy className="h-12 w-12 text-green-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-content-primary mb-2">Create Club</h3>
            <p className="text-content-secondary text-sm mb-4">Start a new sports club</p>
            <Button 
              onClick={() => setShowCreateClubModal(true)}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Club
            </Button>
          </CardContent>
        </Card>

        <Card className="dark-card-primary hover:bg-surface-secondary transition-colors cursor-pointer">
          <CardContent className="p-6 text-center">
            <Calendar className="h-12 w-12 text-primary-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-content-primary mb-2">Create Training Schedule</h3>
            <p className="text-content-secondary text-sm mb-4">Plan new training sessions for your players</p>
            <Button onClick={() => openModal('create-schedule')}>
              <Plus className="h-4 w-4 mr-2" />
              Create Schedule
            </Button>
          </CardContent>
        </Card>

        <Card className="dark-card-primary hover:bg-surface-secondary transition-colors cursor-pointer">
          <CardContent className="p-6 text-center">
            <Users className="h-12 w-12 text-secondary-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-content-primary mb-2">Manage Players</h3>
            <p className="text-content-secondary text-sm mb-4">View and manage your assigned players</p>
            <Button onClick={() => setSelectedView('players')}>
              <ArrowRight className="h-4 w-4 mr-2" />
              View Players
            </Button>
          </CardContent>
        </Card>


      </div>


                    </div>
  );

  const renderContent = () => {
    switch (selectedView) {
      case 'overview':
        return renderOverview();
      case 'clubs':
      case 'players':
      case 'schedules':
        return renderDataTable();

      default:
        return renderOverview();
    }
  };

  return (<>
              <h1 className="text-3xl font-bold text-content-primary">
                Coach Dashboard
              </h1>
    
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-5 mb-8">
              <div className="px-3 py-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full">
                <span className="text-white text-sm font-medium">
                  Coach {user?.name}
                </span>
              </div>
            </div>
            <p className="text-content-secondary text-lg">
              Welcome back, <span className="text-primary-400 font-semibold">{user?.name}</span>! Ready to manage your clubs and players?
            </p>
            {myClubs.length === 0 && !loading && (
              <div className="mt-2 p-3 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
                <p className="text-sm text-yellow-400">
                  💡 <strong>Tip:</strong> Create your first club to get started with managing players and training schedules.
                </p>
              </div>
            )}
            <div className="flex items-center gap-2 mt-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-content-muted">Real-time data updates every 30 seconds</span>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={fetchCoachData}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Refreshing...' : 'Refresh'}
            </Button>
            <Button onClick={() => openModal('create-schedule')}>
              <Plus className="h-4 w-4 mr-2" />
              New Training
            </Button>
          </div>
        </div>
      </div>
    
      {/* Filters removed */}

      {/* Navigation Tabs */}
      {renderNavigationTabs()}

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary-400" />
        </div>
      ) : (
        renderContent()
      )}

      {/* Create Club Modal */}
      {showCreateClubModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="dark-modal rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-content-primary">Create New Club</h2>
              <Button variant="ghost" onClick={() => setShowCreateClubModal(false)}>
                <XCircle className="h-5 w-5" />
              </Button>
            </div>
            
            <form onSubmit={handleCreateClub} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-content-primary mb-2">Club Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={clubFormData.name}
                    onChange={handleClubFormChange}
                    required
                    className="dark-input-primary w-full"
                    placeholder="Enter club name"
                  />
                  {clubFormData.name && (
                    <div className="mt-1 text-xs">
                      {isNameChecking && (
                        <span className="text-content-muted">Checking name availability...</span>
                      )}
                      {!isNameChecking && isNameTaken && (
                        <span className="text-red-400">{nameCheckMessage}</span>
                      )}
                      {!isNameChecking && !isNameTaken && nameCheckMessage && (
                        <span className="text-green-400">{nameCheckMessage}</span>
                      )}
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-content-primary mb-2">Sport *</label>
                  <select
                    name="sport"
                    value={clubFormData.sport}
                    onChange={handleClubFormChange}
                    required
                    className="dark-input-primary w-full"
                  >
                    <option value="">Select Sport</option>
                    <option value="Football">Football</option>
                    <option value="Basketball">Basketball</option>
                    <option value="Tennis">Tennis</option>
                    <option value="Cricket">Cricket</option>
                    <option value="Swimming">Swimming</option>
                    <option value="Athletics">Athletics</option>
                    <option value="Badminton">Badminton</option>
                    <option value="Table Tennis">Table Tennis</option>
                    <option value="Volleyball">Volleyball</option>
                    <option value="Hockey">Hockey</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-content-primary mb-2">Location *</label>
                  <input
                    type="text"
                    name="location"
                    value={clubFormData.location}
                    onChange={handleClubFormChange}
                    required
                    className="dark-input-primary w-full"
                    placeholder="Enter location"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-content-primary mb-2">Registration Fee (₹) *</label>
                  <input
                    type="number"
                    name="registrationFee"
                    value={clubFormData.registrationFee}
                    onChange={handleClubFormChange}
                    required
                    min="0"
                    className="dark-input-primary w-full"
                    placeholder="Enter fee amount"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-content-primary mb-2">Max Players</label>
                  <input
                    type="number"
                    name="maxPlayers"
                    value={clubFormData.maxPlayers}
                    onChange={handleClubFormChange}
                    min="1"
                    className="dark-input-primary w-full"
                    placeholder="Enter max players"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-content-primary mb-2">Facilities</label>
                  <input
                    type="text"
                    name="facilities"
                    value={clubFormData.facilities}
                    onChange={handleClubFormChange}
                    className="dark-input-primary w-full"
                    placeholder="e.g., Gym, Pool, Field"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-content-primary mb-2">Description</label>
                <textarea
                  name="description"
                  value={clubFormData.description}
                  onChange={handleClubFormChange}
                  rows="3"
                  className="dark-input-primary w-full"
                  placeholder="Describe your club and what makes it special..."
                />
              </div>
              
              <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-3">
                <div className="flex items-center gap-2 text-yellow-400">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">Important Notice</span>
                </div>
                <p className="text-yellow-400 text-sm mt-1">
                  All club creation requests require admin approval. Your club will be reviewed and you'll be notified of the decision.
                </p>
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={creatingClub || isNameChecking || isNameTaken}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                >
                  {creatingClub ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating Club...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Submit Club Request
                    </>
                  )}
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCreateClubModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Placeholder */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="dark-modal rounded-2xl p-6 w-full max-w-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-content-primary">
                {modalType === 'create-schedule' ? 'Create Training Schedule' : 
                 modalType === 'edit' ? 'Edit' : 'View'} {selectedView?.slice(0, -1) || 'Item'}
              </h2>
              <Button variant="ghost" onClick={closeModal}>
                <XCircle className="h-5 w-5" />
              </Button>
            </div>
            {renderModalContent()}
          </div>
        </div>
      )}
    
</>
  );
};
export default CoachDashboard;
