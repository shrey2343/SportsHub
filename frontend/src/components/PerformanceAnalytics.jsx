// components/PerformanceAnalytics.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaChartLine, 
  FaTrophy, 
  FaUsers, 
  FaFutbol, 
  FaRunning, 
  FaShieldAlt,
  FaPassport,
  FaStar,
  FaArrowUp,
  FaArrowDown,
  FaEye,
  FaFilter,
  FaDownload
} from 'react-icons/fa';
import api from '../api.jsx';

const PerformanceAnalytics = () => {
  const [performanceData, setPerformanceData] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [trends, setTrends] = useState([]);
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState('rating');
  const [selectedPeriod, setSelectedPeriod] = useState('seasonal');
  const [selectedSeason, setSelectedSeason] = useState('2024-2025');
  const [showFilters, setShowFilters] = useState(false);

  const metrics = [
    { key: 'rating', label: 'Rating', icon: FaStar, color: 'text-yellow-500' },
    { key: 'goals', label: 'Goals', icon: FaFutbol, color: 'text-green-500' },
    { key: 'assists', label: 'Assists', icon: FaPassport, color: 'text-blue-500' },
    { key: 'tackles', label: 'Tackles', icon: FaShieldAlt, color: 'text-red-500' },
    { key: 'distance', label: 'Distance', icon: FaRunning, color: 'text-purple-500' },
    { key: 'passes', label: 'Passes', icon: FaPassport, color: 'text-indigo-500' }
  ];

  const periods = [
    { key: 'weekly', label: 'Weekly' },
    { key: 'monthly', label: 'Monthly' },
    { key: 'seasonal', label: 'Seasonal' }
  ];

  useEffect(() => {
    fetchPerformanceData();
    fetchLeaderboard();
    fetchTrends();
    fetchInsights();
  }, [selectedMetric, selectedPeriod, selectedSeason]);

  const fetchPerformanceData = async () => {
    try {
      setLoading(true);
      // This would typically fetch data for the current user
      const response = await api.get(`/performance/player/me?season=${selectedSeason}&period=${selectedPeriod}`);
      setPerformanceData(response.data);
    } catch (error) {
      console.error('Error fetching performance data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const response = await api.get(`/performance/leaderboard?metric=${selectedMetric}&season=${selectedSeason}&period=${selectedPeriod}`);
      setLeaderboard(response.data.leaderboard || []);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    }
  };

  const fetchTrends = async () => {
    try {
      const response = await api.get(`/performance/player/me/trends?metric=${selectedMetric}&season=${selectedSeason}`);
      setTrends(response.data.trends || []);
    } catch (error) {
      console.error('Error fetching trends:', error);
    }
  };

  const fetchInsights = async () => {
    try {
      const response = await api.get(`/performance/player/me/insights?season=${selectedSeason}`);
      setInsights(response.data.insights || []);
    } catch (error) {
      console.error('Error fetching insights:', error);
    }
  };

  const getMetricIcon = (metricKey) => {
    const metric = metrics.find(m => m.key === metricKey);
    if (metric) {
      const IconComponent = metric.icon;
      return <IconComponent className={`${metric.color} text-2xl`} />;
    }
    return <FaChartLine className="text-gray-500 text-2xl" />;
  };

  const getMetricColor = (metricKey) => {
    const metric = metrics.find(m => m.key === metricKey);
    return metric ? metric.color : 'text-gray-500';
  };

  const formatValue = (value, metric) => {
    if (metric === 'rating') return value.toFixed(1);
    if (metric === 'distance') return `${(value / 1000).toFixed(1)}km`;
    if (metric === 'passes') return value.toLocaleString();
    return value.toLocaleString();
  };

  const getTrendIcon = (trend) => {
    if (trend > 0) return <FaArrowUp className="text-green-500" />;
    if (trend < 0) return <FaArrowDown className="text-red-500" />;
    return <FaChartLine className="text-gray-500" />;
  };

  const getInsightColor = (type) => {
    switch (type) {
      case 'positive': return 'border-l-green-500 bg-green-50';
      case 'warning': return 'border-l-yellow-500 bg-yellow-50';
      case 'improvement': return 'border-l-blue-500 bg-blue-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Performance Analytics
          </h1>
          <p className="text-gray-600">
            Track your performance, compare with others, and get insights to improve
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6 bg-white rounded-lg shadow p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <FaFilter className="text-gray-400" />
              <span className="text-sm font-medium text-gray-700">Filters:</span>
            </div>
            
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {metrics.map(metric => (
                <option key={metric.key} value={metric.key}>
                  {metric.label}
                </option>
              ))}
            </select>

            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {periods.map(period => (
                <option key={period.key} value={period.key}>
                  {period.period}
                </option>
              ))}
            </select>

            <select
              value={selectedSeason}
              onChange={(e) => setSelectedSeason(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="2024-2025">2024-2025</option>
              <option value="2023-2024">2023-2024</option>
              <option value="2022-2023">2022-2023</option>
            </select>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFilters(!showFilters)}
              className="ml-auto bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition-colors"
            >
              Advanced Filters
            </motion.button>
          </div>
        </div>

        {/* Performance Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric) => (
            <motion.div
              key={metric.key}
              whileHover={{ y: -5 }}
              className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500"
            >
              <div className="flex items-center justify-between mb-4">
                {getMetricIcon(metric.key)}
                <span className="text-sm text-gray-500">{metric.label}</span>
              </div>
              
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {performanceData ? formatValue(performanceData[metric.key] || 0, metric.key) : '0'}
              </div>
              
              <div className="flex items-center text-sm">
                {getTrendIcon(0)}
                <span className="ml-1 text-gray-600">+5.2% from last period</span>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Performance Trends Chart */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Performance Trends
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Metric:</span>
                <span className={`text-sm font-medium ${getMetricColor(selectedMetric)}`}>
                  {metrics.find(m => m.key === selectedMetric)?.label}
                </span>
              </div>
            </div>

            {trends.length > 0 ? (
              <div className="h-64 flex items-end justify-between gap-2">
                {trends.map((trend, index) => (
                  <motion.div
                    key={index}
                    initial={{ height: 0 }}
                    animate={{ height: `${(trend.value / Math.max(...trends.map(t => t.value))) * 100}%` }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-blue-500 rounded-t flex-1 relative group"
                  >
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      {formatValue(trend.value, selectedMetric)}
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-500">
                No trend data available
              </div>
            )}

            <div className="mt-4 flex justify-between text-xs text-gray-500">
              {trends.slice(0, 5).map((trend, index) => (
                <span key={index}>{trend.label}</span>
              ))}
            </div>
          </div>

          {/* Performance Insights */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Performance Insights
            </h3>
            
            <div className="space-y-3">
              {insights.map((insight, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-3 rounded-lg border-l-4 ${getInsightColor(insight.type)}`}
                >
                  <div className="text-sm font-medium text-gray-900 mb-1">
                    {insight.message}
                  </div>
                  <div className="text-xs text-gray-600">
                    {insight.suggestion}
                  </div>
                </motion.div>
              ))}
              
              {insights.length === 0 && (
                <div className="text-gray-500 text-sm text-center py-4">
                  No insights available yet
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="bg-white rounded-lg shadow mt-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">
                {metrics.find(m => m.key === selectedMetric)?.label} Leaderboard
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Top performers in</span>
                <span className={`text-sm font-medium ${getMetricColor(selectedMetric)}`}>
                  {metrics.find(m => m.key === selectedMetric)?.label}
                </span>
              </div>
            </div>
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
                    Club
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {metrics.find(m => m.key === selectedMetric)?.label}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Position
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {leaderboard.map((entry, index) => (
                  <tr key={entry.player._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {index < 3 ? (
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            index === 0 ? 'bg-yellow-100 text-yellow-800' :
                            index === 1 ? 'bg-gray-100 text-gray-800' :
                            'bg-orange-100 text-orange-800'
                          }`}>
                            <FaTrophy className="text-sm" />
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
                            src={entry.player.avatarUrl || '/default-avatar.png'}
                            alt=""
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {entry.player.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {entry.club?.name || 'No Club'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatValue(entry.stats[selectedMetric] || 0, selectedMetric)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {entry.player.position}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900">
                        <FaEye />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Career Statistics */}
        {performanceData && (
          <div className="bg-white rounded-lg shadow mt-8">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Career Statistics
              </h3>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {performanceData.careerTotals?.totalMatches || 0}
                  </div>
                  <div className="text-sm text-gray-500">Total Matches</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {performanceData.careerTotals?.totalGoals || 0}
                  </div>
                  <div className="text-sm text-gray-500">Total Goals</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {performanceData.careerTotals?.totalAssists || 0}
                  </div>
                  <div className="text-sm text-gray-500">Total Assists</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {performanceData.careerTotals?.averageRating?.toFixed(1) || '0.0'}
                  </div>
                  <div className="text-sm text-gray-500">Avg Rating</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PerformanceAnalytics;
