// components/TournamentManagement.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaTrophy, 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaEye, 
  FaUsers, 
  FaCalendar,
  FaMapMarkerAlt,
  FaPlay,
  FaPause,
  FaStop,
  FaCheck,
  FaTimes,
  FaDownload,
  FaShare,
  FaFilter,
  FaSearch
} from 'react-icons/fa';
import api from '../api.jsx';

const TournamentManagement = () => {
  const [tournaments, setTournaments] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [showBrackets, setShowBrackets] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    sport: '',
    format: 'knockout',
    startDate: '',
    endDate: '',
    registrationDeadline: '',
    maxTeams: 8,
    minTeams: 2,
    entryFee: 0,
    prizePool: { first: 0, second: 0, third: 0 },
    rules: [],
    ageGroups: [],
    genderCategories: [],
    venues: [],
    referees: []
  });

  const formats = [
    { key: 'knockout', label: 'Knockout' },
    { key: 'league', label: 'League' },
    { key: 'group_knockout', label: 'Group + Knockout' },
    { key: 'round_robin', label: 'Round Robin' }
  ];

  const statuses = [
    { key: 'all', label: 'All Statuses' },
    { key: 'upcoming', label: 'Upcoming' },
    { key: 'registration', label: 'Registration Open' },
    { key: 'in_progress', label: 'In Progress' },
    { key: 'completed', label: 'Completed' },
    { key: 'cancelled', label: 'Cancelled' }
  ];

  useEffect(() => {
    fetchTournaments();
    fetchClubs();
  }, [selectedStatus]);

  const fetchTournaments = async () => {
    try {
      setLoading(true);
      let url = '/api/tournaments';
      if (selectedStatus !== 'all') {
        url += `?status=${selectedStatus}`;
      }
      const response = await api.get(url);
      setTournaments(response.data.tournaments || []);
    } catch (error) {
      console.error('Error fetching tournaments:', error);
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePrizePoolChange = (position, value) => {
    setFormData(prev => ({
      ...prev,
      prizePool: {
        ...prev.prizePool,
        [position]: parseFloat(value) || 0
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await api.post('/tournaments', formData);
      setFormData({
        name: '',
        description: '',
        sport: '',
        format: 'knockout',
        startDate: '',
        endDate: '',
        registrationDeadline: '',
        maxTeams: 8,
        minTeams: 2,
        entryFee: 0,
        prizePool: { first: 0, second: 0, third: 0 },
        rules: [],
        ageGroups: [],
        genderCategories: [],
        venues: [],
        referees: []
      });
      setShowCreateForm(false);
      fetchTournaments();
    } catch (error) {
      console.error('Error creating tournament:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (tournamentId) => {
    if (window.confirm('Are you sure you want to delete this tournament?')) {
      try {
        await axios.delete(`/api/tournaments/${tournamentId}`);
        fetchTournaments();
      } catch (error) {
        console.error('Error deleting tournament:', error);
      }
    }
  };

  const updateTournamentStatus = async (tournamentId, newStatus) => {
    try {
      await axios.put(`/api/tournaments/${tournamentId}/status`, { status: newStatus });
      fetchTournaments();
    } catch (error) {
      console.error('Error updating tournament status:', error);
    }
  };

  const generateBrackets = async (tournamentId) => {
    try {
      await api.post(`/tournaments/${tournamentId}/brackets`);
      fetchTournaments();
      // Show success message
    } catch (error) {
      console.error('Error generating brackets:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'registration': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getFormatIcon = (format) => {
    switch (format) {
      case 'knockout': return <FaTrophy className="text-yellow-500" />;
      case 'league': return <FaUsers className="text-blue-500" />;
      case 'group_knockout': return <FaTrophy className="text-purple-500" />;
      case 'round_robin': return <FaUsers className="text-green-500" />;
      default: return <FaTrophy className="text-gray-500" />;
    }
  };

  const filteredTournaments = tournaments.filter(tournament =>
    tournament.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tournament.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Tournament Management
          </h1>
          <p className="text-gray-600">
            Create, manage, and monitor tournaments with advanced features
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mb-6 flex flex-wrap gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCreateForm(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
          >
            <FaPlus />
            Create Tournament
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowBrackets(true)}
            className="bg-green-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-green-700 transition-colors"
          >
            <FaTrophy />
            View Brackets
          </motion.button>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <FaFilter className="text-gray-400" />
              <span className="text-sm font-medium text-gray-700">Filters:</span>
            </div>
            
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {statuses.map(status => (
                <option key={status.key} value={status.key}>
                  {status.label}
                </option>
              ))}
            </select>

            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Search tournaments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <FaSearch className="text-gray-400" />
            </div>
          </div>
        </div>

        {/* Create Tournament Form */}
        {showCreateForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-lg p-6 mb-6"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900">
                Create New Tournament
              </h3>
              <button
                onClick={() => setShowCreateForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tournament Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sport
                  </label>
                  <input
                    type="text"
                    name="sport"
                    value={formData.sport}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Format
                  </label>
                  <select
                    name="format"
                    value={formData.format}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {formats.map(format => (
                      <option key={format.key} value={format.key}>
                        {format.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Teams
                  </label>
                  <input
                    type="number"
                    name="maxTeams"
                    value={formData.maxTeams}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="2"
                    max="64"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="datetime-local"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="datetime-local"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Registration Deadline
                  </label>
                  <input
                    type="datetime-local"
                    name="registrationDeadline"
                    value={formData.registrationDeadline}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Entry Fee
                  </label>
                  <input
                    type="number"
                    name="entryFee"
                    value={formData.entryFee}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              {/* Prize Pool */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prize Pool
                </label>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">1st Place</label>
                    <input
                      type="number"
                      value={formData.prizePool.first}
                      onChange={(e) => handlePrizePoolChange('first', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">2nd Place</label>
                    <input
                      type="number"
                      value={formData.prizePool.second}
                      onChange={(e) => handlePrizePoolChange('second', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">3rd Place</label>
                    <input
                      type="number"
                      value={formData.prizePool.third}
                      onChange={(e) => handlePrizePoolChange('third', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Creating...' : 'Create Tournament'}
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Tournaments List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Tournaments
            </h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tournament
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Format
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dates
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Teams
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTournaments.map((tournament) => (
                  <tr key={tournament._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {getFormatIcon(tournament.format)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {tournament.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {tournament.sport}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {tournament.format.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>
                        <div>Start: {new Date(tournament.startDate).toLocaleDateString()}</div>
                        <div>End: {new Date(tournament.endDate).toLocaleDateString()}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {tournament.teams?.length || 0}/{tournament.maxTeams}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(tournament.status)}`}>
                        {tournament.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setSelectedTournament(tournament)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <FaEye />
                        </button>
                        
                        {tournament.status === 'registration' && tournament.teams?.length >= tournament.minTeams && (
                          <button
                            onClick={() => generateBrackets(tournament._id)}
                            className="text-green-600 hover:text-green-900"
                            title="Generate Brackets"
                          >
                            <FaPlay />
                          </button>
                        )}
                        
                        {tournament.status === 'registration' && (
                          <button
                            onClick={() => updateTournamentStatus(tournament._id, 'in_progress')}
                            className="text-yellow-600 hover:text-yellow-900"
                            title="Start Tournament"
                          >
                            <FaCheck />
                          </button>
                        )}
                        
                        {tournament.status === 'in_progress' && (
                          <button
                            onClick={() => updateTournamentStatus(tournament._id, 'completed')}
                            className="text-green-600 hover:text-green-900"
                            title="Complete Tournament"
                          >
                            <FaStop />
                          </button>
                        )}
                        
                        <button
                          onClick={() => handleDelete(tournament._id)}
                          className="text-red-600 hover:text-red-900"
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

        {/* Tournament Details Modal */}
        {selectedTournament && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedTournament(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    {getFormatIcon(selectedTournament.format)}
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {selectedTournament.name}
                      </h3>
                      <p className="text-gray-600">{selectedTournament.description}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedTournament(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Tournament Details</h4>
                    <div className="space-y-2 text-sm">
                      <div><span className="font-medium">Sport:</span> {selectedTournament.sport}</div>
                      <div><span className="font-medium">Format:</span> {selectedTournament.format}</div>
                      <div><span className="font-medium">Status:</span> 
                        <span className={`ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedTournament.status)}`}>
                          {selectedTournament.status.replace('_', ' ')}
                        </span>
                      </div>
                      <div><span className="font-medium">Teams:</span> {selectedTournament.teams?.length || 0}/{selectedTournament.maxTeams}</div>
                      <div><span className="font-medium">Entry Fee:</span> ${selectedTournament.entryFee}</div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Dates</h4>
                    <div className="space-y-2 text-sm">
                      <div><span className="font-medium">Start:</span> {new Date(selectedTournament.startDate).toLocaleString()}</div>
                      <div><span className="font-medium">End:</span> {new Date(selectedTournament.endDate).toLocaleString()}</div>
                      <div><span className="font-medium">Registration Deadline:</span> {new Date(selectedTournament.registrationDeadline).toLocaleString()}</div>
                    </div>
                  </div>
                </div>

                {/* Prize Pool */}
                {selectedTournament.prizePool && (
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Prize Pool</h4>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-yellow-50 p-3 rounded text-center">
                        <div className="text-lg font-bold text-yellow-600">1st</div>
                        <div className="text-sm text-gray-600">${selectedTournament.prizePool.first}</div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded text-center">
                        <div className="text-lg font-bold text-gray-600">2nd</div>
                        <div className="text-sm text-gray-600">${selectedTournament.prizePool.second}</div>
                      </div>
                      <div className="bg-orange-50 p-3 rounded text-center">
                        <div className="text-lg font-bold text-orange-600">3rd</div>
                        <div className="text-sm text-gray-600">${selectedTournament.prizePool.third}</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Teams */}
                {selectedTournament.teams && selectedTournament.teams.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Registered Teams</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {selectedTournament.teams.map((team, index) => (
                        <div key={index} className="bg-gray-50 p-3 rounded">
                          <div className="text-sm font-medium text-gray-900">{team.team?.name || 'Team'}</div>
                          <div className="text-xs text-gray-500">{team.status}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-4">
                  <button
                    onClick={() => setSelectedTournament(null)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Close
                  </button>
                  
                  {selectedTournament.status === 'registration' && selectedTournament.teams?.length >= selectedTournament.minTeams && (
                    <button
                      onClick={() => generateBrackets(selectedTournament._id)}
                      className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                    >
                      Generate Brackets
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default TournamentManagement;
