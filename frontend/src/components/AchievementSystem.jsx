// components/AchievementSystem.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaTrophy, 
  FaMedal, 
  FaStar, 
  FaLock, 
  FaUnlock, 
  FaShare, 
  FaDownload,
  FaFilter,
  FaSearch,
  FaCrown,
  FaGem,
  FaFire,
  FaHeart,
  FaEye,
  FaCheck,
  FaTimes,
  FaClock
} from 'react-icons/fa';
import api from '../api.jsx';

const AchievementSystem = () => {
  const [achievements, setAchievements] = useState([]);
  const [userAchievements, setUserAchievements] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showUnlockedOnly, setShowUnlockedOnly] = useState(false);
  const [selectedAchievement, setSelectedAchievement] = useState(null);

  const categories = [
    { key: 'all', label: 'All Categories', icon: FaTrophy, color: 'text-gray-500' },
    { key: 'scoring', label: 'Scoring', icon: FaStar, color: 'text-yellow-500' },
    { key: 'defense', label: 'Defense', icon: FaMedal, color: 'text-blue-500' },
    { key: 'teamwork', label: 'Teamwork', icon: FaHeart, color: 'text-red-500' },
    { key: 'fitness', label: 'Fitness', icon: FaFire, color: 'text-orange-500' },
    { key: 'special', label: 'Special', icon: FaGem, color: 'text-purple-500' }
  ];

  const levels = [
    { key: 'all', label: 'All Levels', color: 'text-gray-500' },
    { key: 'bronze', label: 'Bronze', color: 'text-orange-600' },
    { key: 'silver', label: 'Silver', color: 'text-gray-400' },
    { key: 'gold', label: 'Gold', color: 'text-yellow-500' },
    { key: 'platinum', label: 'Platinum', color: 'text-blue-500' },
    { key: 'diamond', label: 'Diamond', color: 'text-purple-500' }
  ];

  useEffect(() => {
    fetchAchievements();
    fetchUserAchievements();
    fetchLeaderboard();
  }, [selectedCategory, selectedLevel]);

  const fetchAchievements = async () => {
    try {
      setLoading(true);
      let url = '/api/achievements';
      const params = new URLSearchParams();
      
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      if (selectedLevel !== 'all') params.append('level', selectedLevel);
      
      if (params.toString()) url += `?${params.toString()}`;
      
      const response = await api.get(url);
      setAchievements(response.data.achievements || []);
    } catch (error) {
      console.error('Error fetching achievements:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserAchievements = async () => {
    try {
      // This would typically fetch achievements for the current user
      const response = await api.get('/achievements/user/me');
      setUserAchievements(response.data.userAchievements || []);
    } catch (error) {
      console.error('Error fetching user achievements:', error);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const response = await api.get('/achievements/leaderboard');
      setLeaderboard(response.data.leaderboard || []);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    }
  };

  const getAchievementIcon = (category) => {
    const cat = categories.find(c => c.key === category);
    if (cat) {
      const IconComponent = cat.icon;
      return <IconComponent className={`${cat.color} text-2xl`} />;
    }
    return <FaTrophy className="text-gray-500 text-2xl" />;
  };

  const getLevelColor = (level) => {
    const lvl = levels.find(l => l.key === level);
    return lvl ? lvl.color : 'text-gray-500';
  };

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'common': return 'bg-gray-100 text-gray-800';
      case 'uncommon': return 'bg-green-100 text-green-800';
      case 'rare': return 'bg-blue-100 text-blue-800';
      case 'epic': return 'bg-purple-100 text-purple-800';
      case 'legendary': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 60) return 'bg-yellow-500';
    if (percentage >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const isAchievementUnlocked = (achievementId) => {
    return userAchievements.some(ua => 
      ua.achievement._id === achievementId && ua.status === 'unlocked'
    );
  };

  const getUserAchievement = (achievementId) => {
    return userAchievements.find(ua => ua.achievement._id === achievementId);
  };

  const getProgressPercentage = (achievement) => {
    const userAchievement = getUserAchievement(achievement._id);
    if (userAchievement && userAchievement.progress) {
      return Math.min(100, (userAchievement.progress.current / userAchievement.progress.required) * 100);
    }
    return 0;
  };

  const filteredAchievements = achievements.filter(achievement => {
    const matchesSearch = achievement.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         achievement.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesUnlocked = !showUnlockedOnly || isAchievementUnlocked(achievement._id);
    return matchesSearch && matchesUnlocked;
  });

  const unlockedCount = userAchievements.filter(ua => ua.status === 'unlocked').length;
  const totalCount = achievements.length;
  const completionPercentage = totalCount > 0 ? (unlockedCount / totalCount) * 100 : 0;

  const shareAchievement = async (achievementId, platform) => {
    try {
      await api.post(`/achievements/user/me/share/${achievementId}`, { platform });
      // Show success message
    } catch (error) {
      console.error('Error sharing achievement:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Achievement System
          </h1>
          <p className="text-gray-600">
            Unlock achievements, track your progress, and compete with other players
          </p>
        </div>

        {/* Progress Overview */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Achievement Progress
            </h3>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">
                {unlockedCount}/{totalCount}
              </div>
              <div className="text-sm text-gray-500">Achievements Unlocked</div>
            </div>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-3">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${completionPercentage}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className={`h-3 rounded-full ${getProgressColor(completionPercentage)}`}
            />
          </div>
          
          <div className="mt-2 text-sm text-gray-600">
            {completionPercentage.toFixed(1)}% Complete
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <FaFilter className="text-gray-400" />
              <span className="text-sm font-medium text-gray-700">Filters:</span>
            </div>
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map(category => (
                <option key={category.key} value={category.key}>
                  {category.label}
                </option>
              ))}
            </select>

            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {levels.map(level => (
                <option key={level.key} value={level.key}>
                  {level.label}
                </option>
              ))}
            </select>

            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Search achievements..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <FaSearch className="text-gray-400" />
            </div>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={showUnlockedOnly}
                onChange={(e) => setShowUnlockedOnly(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Show unlocked only</span>
            </label>
          </div>
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredAchievements.map((achievement) => {
            const isUnlocked = isAchievementUnlocked(achievement._id);
            const userAchievement = getUserAchievement(achievement._id);
            const progressPercentage = getProgressPercentage(achievement);
            
            return (
              <motion.div
                key={achievement._id}
                whileHover={{ y: -5, scale: 1.02 }}
                className={`bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer transition-all duration-200 ${
                  isUnlocked ? 'ring-2 ring-yellow-400' : ''
                }`}
                onClick={() => setSelectedAchievement(achievement)}
              >
                {/* Achievement Header */}
                <div className={`p-4 ${isUnlocked ? 'bg-gradient-to-r from-yellow-400 to-orange-400' : 'bg-gray-100'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getAchievementIcon(achievement.category)}
                      <div>
                        <h4 className={`font-semibold ${isUnlocked ? 'text-white' : 'text-gray-900'}`}>
                          {achievement.name}
                        </h4>
                        <p className={`text-sm ${isUnlocked ? 'text-yellow-100' : 'text-gray-600'}`}>
                          {achievement.category}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className={`text-2xl ${isUnlocked ? 'text-white' : getLevelColor(achievement.level)}`}>
                        {isUnlocked ? <FaUnlock /> : <FaLock />}
                      </div>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRarityColor(achievement.rarity)}`}>
                        {achievement.rarity}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Achievement Content */}
                <div className="p-4">
                  <p className="text-sm text-gray-600 mb-4">
                    {achievement.description}
                  </p>
                  
                  {/* Progress Bar */}
                  {!isUnlocked && (
                    <div className="mb-4">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Progress</span>
                        <span>{progressPercentage.toFixed(0)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${getProgressColor(progressPercentage)}`}
                          style={{ width: `${progressPercentage}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Achievement Footer */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-medium ${getLevelColor(achievement.level)}`}>
                        {achievement.level}
                      </span>
                      <span className="text-xs text-gray-500">
                        Difficulty: {achievement.difficulty}/10
                      </span>
                    </div>
                    
                    {isUnlocked && userAchievement && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">
                          Unlocked {new Date(userAchievement.unlockedAt).toLocaleDateString()}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            shareAchievement(achievement._id, 'twitter');
                          }}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <FaShare />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Leaderboard */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Achievement Leaderboard
            </h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rank
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Player
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Achievements
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Points
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rarity Score
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {leaderboard.map((entry, index) => (
                  <tr key={entry._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {index < 3 ? (
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            index === 0 ? 'bg-yellow-100 text-yellow-800' :
                            index === 1 ? 'bg-gray-100 text-gray-800' :
                            'bg-orange-100 text-orange-800'
                          }`}>
                            <FaCrown className="text-sm" />
                          </div>
                        ) : (
                          <span className="text-sm font-medium text-gray-900">
                            #{index + 1}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img
                            className="h-10 w-10 rounded-full"
                            src={entry.avatar || '/default-avatar.png'}
                            alt=""
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {entry.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {entry.achievements?.length || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {entry.points || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {entry.rarityScore || 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Achievement Details Modal */}
        {selectedAchievement && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedAchievement(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    {getAchievementIcon(selectedAchievement.category)}
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {selectedAchievement.name}
                      </h3>
                      <p className="text-gray-600">{selectedAchievement.description}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedAchievement(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Category</label>
                    <p className="text-gray-900">{selectedAchievement.category}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Level</label>
                    <p className={`text-gray-900 ${getLevelColor(selectedAchievement.level)}`}>
                      {selectedAchievement.level}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Rarity</label>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRarityColor(selectedAchievement.rarity)}`}>
                      {selectedAchievement.rarity}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Difficulty</label>
                    <p className="text-gray-900">{selectedAchievement.difficulty}/10</p>
                  </div>
                </div>

                {selectedAchievement.requirements && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Requirements</h4>
                    <div className="bg-gray-50 p-3 rounded">
                      <pre className="text-sm text-gray-600 whitespace-pre-wrap">
                        {JSON.stringify(selectedAchievement.requirements, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}

                {selectedAchievement.rewards && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Rewards</h4>
                    <div className="bg-yellow-50 p-3 rounded">
                      <pre className="text-sm text-gray-600 whitespace-pre-wrap">
                        {JSON.stringify(selectedAchievement.rewards, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-4">
                  <button
                    onClick={() => setSelectedAchievement(null)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Close
                  </button>
                  {isAchievementUnlocked(selectedAchievement._id) && (
                    <button
                      onClick={() => shareAchievement(selectedAchievement._id, 'twitter')}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    >
                      Share Achievement
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

export default AchievementSystem;
