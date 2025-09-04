// components/MatchManagement.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaPlus, 
  FaEye, 
  FaEdit, 
  FaTrash, 
  FaFutbol, 
  FaCalendar, 
  FaMapMarkerAlt,
  FaUsers,
  FaTrophy,
  FaClock,
  FaPlay,
  FaPause,
  FaStop,
  FaSave
} from 'react-icons/fa';
import api from '../api.jsx';

const MatchManagement = () => {
  const [matches, setMatches] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [showMatchDetails, setShowMatchDetails] = useState(false);
  const [editingMatch, setEditingMatch] = useState(null);
  const [liveMatch, setLiveMatch] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    matchType: 'friendly',
    homeTeam: '',
    awayTeam: '',
    sport: '',
    venue: '',
    date: '',
    duration: 90,
    tournament: '',
    referee: '',
    ticketPrice: 0,
    club: '' // Add missing club field
  });

  useEffect(() => {
    fetchMatches();
    fetchClubs();
    fetchTournaments();
  }, []);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      const response = await api.get('/matches');
      setMatches(response.data.matches || []);
    } catch (error) {
      console.error('Error fetching matches:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchClubs = async () => {
    try {
      const response = await api.get('/clubs');
      setClubs(response.data || []);
    } catch (error) {
      console.error('Error fetching clubs:', error);
    }
  };

  const fetchTournaments = async () => {
    try {
      const response = await api.get('/tournaments');
      setTournaments(response.data.tournaments || []);
    } catch (error) {
      console.error('Error fetching tournaments:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await api.post('/matches', formData);
      setFormData({
        title: '',
        description: '',
        matchType: 'friendly',
        homeTeam: '',
        awayTeam: '',
        sport: '',
        venue: '',
        date: '',
        duration: 90,
        tournament: '',
        referee: '',
        ticketPrice: 0,
        club: ''
      });
      setShowCreateForm(false);
      fetchMatches();
    } catch (error) {
      console.error('Error creating match:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (matchId) => {
    if (window.confirm('Are you sure you want to delete this match?')) {
      try {
        await api.delete(`/matches/${matchId}`);
        fetchMatches();
      } catch (error) {
        console.error('Error deleting match:', error);
      }
    }
  };

  const startLiveMatch = (match) => {
    setLiveMatch({
      ...match,
      status: 'in_progress',
      startTime: new Date(),
      currentMinute: 0
    });
  };

  const updateLiveScore = async (matchId, homeScore, awayScore) => {
    try {
      await api.put(`/matches/${matchId}/score`, {
        homeScore,
        awayScore,
        status: 'in_progress'
      });
      fetchMatches();
    } catch (error) {
      console.error('Error updating score:', error);
    }
  };

  const endMatch = async (matchId) => {
    try {
      await api.put(`/matches/${matchId}/score`, {
        status: 'completed'
      });
      setLiveMatch(null);
      fetchMatches();
    } catch (error) {
      console.error('Error ending match:', error);
    }
  };

  const getMatchStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-900 text-blue-200';
      case 'in_progress': return 'bg-green-900 text-green-200';
      case 'completed': return 'bg-gray-700 text-gray-200';
      case 'cancelled': return 'bg-red-900 text-red-200';
      case 'postponed': return 'bg-yellow-900 text-yellow-200';
      default: return 'bg-gray-700 text-gray-200';
    }
  };

  const getMatchTypeIcon = (type) => {
    switch (type) {
      case 'friendly': return <FaUsers className="text-blue-500" />;
      case 'league': return <FaTrophy className="text-yellow-500" />;
      case 'tournament': return <FaTrophy className="text-purple-500" />;
      case 'training': return <FaPlay className="text-green-500" />;
      default: return <FaFutbol className="text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-extrabold text-white mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"
          >
            Match Management
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-300"
          >
            Create, manage, and monitor all matches and tournaments
          </motion.p>
        </div>

        {/* Action Buttons */}
        <div className="mb-6 flex flex-wrap gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCreateForm(true)}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:opacity-90 transition-all duration-300 shadow-lg"
          >
            <FaPlus />
            Create New Match
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowMatchDetails(true)}
            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:opacity-90 transition-all duration-300 shadow-lg"
          >
            <FaEye />
            View All Matches
          </motion.button>
        </div>

        {/* Live Match Display */}
        {liveMatch && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900/80 backdrop-blur-md border border-gray-700 rounded-2xl p-6 mb-6 shadow-2xl border-l-4 border-green-500"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">
                🟢 LIVE: {liveMatch.title}
              </h3>
              <div className="text-sm text-gray-300">
                Minute: {liveMatch.currentMinute}'
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-400">
                  {liveMatch.homeTeam?.name || 'Home Team'}
                </div>
                <div className="text-4xl font-bold text-white">
                  {liveMatch.homeScore || 0}
                </div>
              </div>
              
              <div className="flex items-center justify-center">
                <div className="text-gray-300 text-2xl">VS</div>
              </div>
              
              <div>
                <div className="text-2xl font-bold text-red-400">
                  {liveMatch.awayTeam?.name || 'Away Team'}
                </div>
                <div className="text-4xl font-bold text-white">
                  {liveMatch.awayScore || 0}
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-center gap-4">
              <button
                onClick={() => updateLiveScore(liveMatch._id, (liveMatch.homeScore || 0) + 1, liveMatch.awayScore || 0)}
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-all duration-300 shadow-lg"
              >
                Home Goal
              </button>
              <button
                onClick={() => updateLiveScore(liveMatch._id, liveMatch.homeScore || 0, (liveMatch.awayScore || 0) + 1)}
                className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-all duration-300 shadow-lg"
              >
                Away Goal
              </button>
              <button
                onClick={() => endMatch(liveMatch._id)}
                className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-all duration-300 shadow-lg"
              >
                End Match
              </button>
            </div>
          </motion.div>
        )}

        {/* Create Match Form */}
        {showCreateForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900/80 backdrop-blur-md border border-gray-700 rounded-2xl p-6 mb-6 shadow-2xl"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-white">
                Create New Match
              </h3>
              <button
                onClick={() => setShowCreateForm(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Match Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-gray-800 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Match Type
                  </label>
                  <select
                    name="matchType"
                    value={formData.matchType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-gray-800 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="friendly">Friendly</option>
                    <option value="league">League</option>
                    <option value="tournament">Tournament</option>
                    <option value="training">Training</option>
                    <option value="exhibition">Exhibition</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Home Team
                  </label>
                  <select
                    name="homeTeam"
                    value={formData.homeTeam}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-gray-800 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Home Team</option>
                    {clubs.map(club => (
                      <option key={club._id} value={club._id}>
                        {club.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Away Team
                  </label>
                  <select
                    name="awayTeam"
                    value={formData.awayTeam}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-gray-800 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Away Team</option>
                    {clubs.map(club => (
                      <option key={club._id} value={club._id}>
                        {club.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Sport
                  </label>
                  <input
                    type="text"
                    name="sport"
                    value={formData.sport}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-gray-800 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Club
                  </label>
                  <select
                    name="club"
                    value={formData.club}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-gray-800 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Club</option>
                    {clubs.map(club => (
                      <option key={club._id} value={club._id}>
                        {club.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Venue
                  </label>
                  <input
                    type="text"
                    name="venue"
                    value={formData.venue}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-gray-800 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-gray-800 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-gray-800 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="30"
                    max="180"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Tournament (optional)
                  </label>
                  <select
                    name="tournament"
                    value={formData.tournament}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-gray-800 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">No Tournament</option>
                    {tournaments.map(tournament => (
                      <option key={tournament._id} value={tournament._id}>
                        {tournament.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Ticket Price
                  </label>
                  <input
                    type="number"
                    name="ticketPrice"
                    value={formData.ticketPrice}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-gray-800 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-3 py-2 bg-gray-800 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-6 py-2 border border-gray-600 rounded-lg text-gray-300 hover:border-white hover:text-white transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg hover:opacity-90 transition-all duration-300 disabled:opacity-50 shadow-lg"
                >
                  {loading ? 'Creating...' : 'Create Match'}
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Matches List */}
        <div className="bg-gray-900/80 backdrop-blur-md border border-gray-700 rounded-2xl shadow-2xl">
          <div className="px-6 py-4 border-b border-gray-700">
            <h3 className="text-lg font-medium text-white">
              Recent Matches
            </h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Match
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Venue
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-900 divide-y divide-gray-700">
                {matches.map((match) => (
                  <tr key={match._id} className="hover:bg-gray-800 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {getMatchTypeIcon(match.matchType)}
                        </div>
                                                 <div className="ml-4">
                           <div className="text-sm font-medium text-white">
                             {match.title}
                           </div>
                           <div className="text-sm text-gray-300">
                             {match.homeTeam?.name} vs {match.awayTeam?.name}
                           </div>
                         </div>
                      </div>
                    </td>
                                         <td className="px-6 py-4 whitespace-nowrap">
                       <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900 text-blue-200">
                         {match.matchType}
                       </span>
                     </td>
                     <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                       {new Date(match.date).toLocaleDateString()}
                     </td>
                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                       {match.venue}
                     </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getMatchStatusColor(match.status)}`}>
                        {match.status.replace('_', ' ')}
                      </span>
                    </td>
                                         <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                       {match.homeScore} - {match.awayScore}
                     </td>
                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                       <div className="flex space-x-2">
                         <button
                           onClick={() => setSelectedMatch(match)}
                           className="text-blue-400 hover:text-blue-300 transition-colors"
                         >
                           <FaEye />
                         </button>
                         {match.status === 'scheduled' && (
                           <button
                             onClick={() => startLiveMatch(match)}
                             className="text-green-400 hover:text-green-300 transition-colors"
                           >
                             <FaPlay />
                         </button>
                         )}
                         <button
                           onClick={() => handleDelete(match._id)}
                           className="text-red-400 hover:text-red-300 transition-colors"
                         >
                           <FaTrash />
                         </button>
                       </div>
                     </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

                 {/* Match Details Modal */}
         {selectedMatch && (
           <motion.div
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
             onClick={() => setSelectedMatch(null)}
           >
             <motion.div
               initial={{ scale: 0.9, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               className="bg-gray-900/95 backdrop-blur-md border border-gray-700 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
               onClick={(e) => e.stopPropagation()}
             >
               <div className="p-6">
                 <div className="flex justify-between items-center mb-4">
                   <h3 className="text-xl font-semibold text-white">
                     Match Details
                   </h3>
                   <button
                     onClick={() => setSelectedMatch(null)}
                     className="text-gray-400 hover:text-white transition-colors"
                   >
                     ✕
                   </button>
                 </div>

                                 <div className="space-y-4">
                   <div>
                     <h4 className="text-lg font-medium text-white mb-2">
                       {selectedMatch.title}
                     </h4>
                     <p className="text-gray-300">{selectedMatch.description}</p>
                   </div>

                                     <div className="grid grid-cols-2 gap-4">
                     <div>
                       <label className="block text-sm font-medium text-gray-300">
                         Match Type
                       </label>
                       <p className="text-white">{selectedMatch.matchType}</p>
                     </div>
                     <div>
                       <label className="block text-sm font-medium text-gray-300">
                         Status
                       </label>
                       <p className="text-white">{selectedMatch.status}</p>
                     </div>
                     <div>
                       <label className="block text-sm font-medium text-gray-300">
                         Date
                       </label>
                       <p className="text-white">
                         {new Date(selectedMatch.date).toLocaleString()}
                       </p>
                     </div>
                     <div>
                       <label className="block text-sm font-medium text-gray-300">
                         Venue
                       </label>
                       <p className="text-white">{selectedMatch.venue}</p>
                     </div>
                   </div>

                                     <div className="border-t border-gray-700 pt-4">
                     <h5 className="text-md font-medium text-white mb-2">
                       Teams
                     </h5>
                     <div className="grid grid-cols-2 gap-4">
                       <div className="text-center">
                         <div className="text-lg font-medium text-blue-400">
                           {selectedMatch.homeTeam?.name}
                         </div>
                         <div className="text-3xl font-bold text-white">
                           {selectedMatch.homeScore || 0}
                         </div>
                       </div>
                       <div className="text-center">
                         <div className="text-lg font-medium text-red-400">
                           {selectedMatch.awayTeam?.name}
                         </div>
                         <div className="text-3xl font-bold text-white">
                           {selectedMatch.awayScore || 0}
                         </div>
                       </div>
                     </div>
                   </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MatchManagement;
