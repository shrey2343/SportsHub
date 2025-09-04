import React, { useState, useEffect } from 'react';
import { FaBrain, FaChartLine, FaLightbulb, FaBullseye, FaTrophy, FaExclamationTriangle } from 'react-icons/fa';
import api from '../api.jsx';

const AIPerformanceAnalysis = ({ playerId }) => {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [insights, setInsights] = useState([]);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    if (playerId) {
      generateAIAnalysis();
    }
  }, [playerId]);

  const generateAIAnalysis = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get player performance data
      const performanceResponse = await api.get('/performance/player/me');
      const performance = performanceResponse.data;

      // Generate AI insights
      const aiInsights = generateInsights(performance);
      setInsights(aiInsights);

      // Generate AI recommendations
      const aiRecommendations = generateRecommendations(performance, aiInsights);
      setRecommendations(aiRecommendations);

      // Create comprehensive analysis
      const analysisData = {
        overallScore: calculateOverallScore(performance),
        strengths: identifyStrengths(performance),
        weaknesses: identifyWeaknesses(performance),
        improvementAreas: identifyImprovementAreas(performance),
        predictedProgress: predictProgress(performance),
        nextMilestones: generateNextMilestones(performance),
        timestamp: new Date().toISOString()
      };

      setAnalysis(analysisData);

    } catch (error) {
      console.error('AI Analysis error:', error);
      setError('Failed to generate AI analysis');
    } finally {
      setLoading(false);
    }
  };

  const generateInsights = (performance) => {
    const insights = [];

    // Performance trend analysis
    if (performance.trends && performance.trends.length > 0) {
      const recentTrend = performance.trends[performance.trends.length - 1];
      const previousTrend = performance.trends[performance.trends.length - 2];

      if (recentTrend && previousTrend) {
        const improvement = ((recentTrend.score - previousTrend.score) / previousTrend.score) * 100;
        
        if (improvement > 10) {
          insights.push({
            type: 'positive',
            title: 'Significant Improvement',
            description: `Your performance has improved by ${improvement.toFixed(1)}% in recent sessions. Keep up the great work!`,
            icon: FaTrophy
          });
        } else if (improvement < -5) {
          insights.push({
            type: 'warning',
            title: 'Performance Dip',
            description: `Your performance has decreased by ${Math.abs(improvement).toFixed(1)}%. Consider reviewing your training routine.`,
            icon: FaExclamationTriangle
          });
        }
      }
    }

    // Consistency analysis
    if (performance.consistency) {
      if (performance.consistency > 0.8) {
        insights.push({
          type: 'positive',
          title: 'High Consistency',
          description: 'You show excellent consistency in your performance. This is a key trait of successful athletes.',
          icon: FaBullseye
        });
      } else if (performance.consistency < 0.6) {
        insights.push({
          type: 'warning',
          title: 'Inconsistent Performance',
          description: 'Your performance varies significantly. Focus on maintaining consistent training habits.',
          icon: FaExclamationTriangle
        });
      }
    }

    // Skill gap analysis
    if (performance.skills) {
      const weakestSkill = Object.entries(performance.skills)
        .sort(([,a], [,b]) => a - b)[0];
      
      if (weakestSkill) {
        insights.push({
          type: 'info',
          title: 'Skill Development Opportunity',
          description: `Focus on improving your ${weakestSkill[0]} skills. This could significantly boost your overall performance.`,
          icon: FaLightbulb
        });
      }
    }

    return insights;
  };

  const generateRecommendations = (performance, insights) => {
    const recommendations = [];

    // Training intensity recommendations
    if (performance.fatigue && performance.fatigue > 0.7) {
      recommendations.push({
        type: 'training',
        title: 'Reduce Training Intensity',
        description: 'Your fatigue levels are high. Consider lighter training sessions or rest days to prevent burnout.',
        priority: 'high'
      });
    }

    // Skill-specific recommendations
    if (performance.skills) {
      Object.entries(performance.skills).forEach(([skill, score]) => {
        if (score < 0.6) {
          recommendations.push({
            type: 'skill',
            title: `Improve ${skill.charAt(0).toUpperCase() + skill.slice(1)}`,
            description: `Dedicate 20-30 minutes daily to ${skill} practice. Focus on fundamentals and gradually increase difficulty.`,
            priority: 'medium'
          });
        }
      });
    }

    // Recovery recommendations
    if (performance.recovery && performance.recovery < 0.5) {
      recommendations.push({
        type: 'recovery',
        title: 'Prioritize Recovery',
        description: 'Your recovery rate is low. Ensure adequate sleep, nutrition, and consider active recovery techniques.',
        priority: 'high'
      });
    }

    return recommendations;
  };

  const calculateOverallScore = (performance) => {
    if (!performance.metrics) return 0;
    
    const scores = Object.values(performance.metrics);
    return scores.reduce((sum, score) => sum + score, 0) / scores.length;
  };

  const identifyStrengths = (performance) => {
    if (!performance.skills) return [];
    
    return Object.entries(performance.skills)
      .filter(([, score]) => score > 0.7)
      .map(([skill]) => skill);
  };

  const identifyWeaknesses = (performance) => {
    if (!performance.skills) return [];
    
    return Object.entries(performance.skills)
      .filter(([, score]) => score < 0.5)
      .map(([skill]) => skill);
  };

  const identifyImprovementAreas = (performance) => {
    if (!performance.skills) return [];
    
    return Object.entries(performance.skills)
      .filter(([, score]) => score >= 0.5 && score < 0.7)
      .map(([skill]) => skill);
  };

  const predictProgress = (performance) => {
    if (!performance.trends || performance.trends.length < 2) return 'Insufficient data';
    
    const recentScores = performance.trends.slice(-3).map(t => t.score);
    const trend = recentScores[recentScores.length - 1] - recentScores[0];
    
    if (trend > 0.1) return 'Strong upward trajectory';
    if (trend > 0) return 'Steady improvement';
    if (trend > -0.1) return 'Maintaining level';
    return 'Needs attention';
  };

  const generateNextMilestones = (performance) => {
    const milestones = [];
    
    if (performance.skills) {
      Object.entries(performance.skills).forEach(([skill, score]) => {
        if (score < 0.8) {
          const nextTarget = Math.min(0.8, score + 0.1);
          milestones.push({
            skill,
            current: score,
            target: nextTarget,
            timeframe: '2-3 weeks'
          });
        }
      });
    }
    
    return milestones;
  };

  if (loading) {
    return (
      <div className="bg-gray-900 rounded-2xl p-6">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
          <span className="ml-3 text-white">Generating AI Analysis...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-900 rounded-2xl p-6">
        <div className="text-center text-red-400">
          <FaExclamationTriangle className="text-2xl mx-auto mb-2" />
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* AI Analysis Header */}
      <div className="bg-gradient-to-r from-purple-900 to-indigo-900 rounded-2xl p-6">
        <div className="flex items-center mb-4">
          <FaBrain className="text-3xl text-purple-400 mr-3" />
          <div>
            <h3 className="text-2xl font-bold text-white">AI Performance Analysis</h3>
            <p className="text-purple-200">Intelligent insights powered by artificial intelligence</p>
          </div>
        </div>
        
        {analysis && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-black/20 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-white">
                {(analysis.overallScore * 100).toFixed(0)}%
              </div>
              <div className="text-purple-200 text-sm">Overall Score</div>
            </div>
            <div className="bg-black/20 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-white">
                {analysis.strengths.length}
              </div>
              <div className="text-purple-200 text-sm">Strengths</div>
            </div>
            <div className="bg-black/20 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-white">
                {analysis.weaknesses.length}
              </div>
              <div className="text-purple-200 text-sm">Areas to Improve</div>
            </div>
          </div>
        )}
      </div>

      {/* AI Insights */}
      {insights.length > 0 && (
        <div className="bg-gray-900 rounded-2xl p-6">
          <h4 className="text-xl font-bold text-white mb-4 flex items-center">
            <FaLightbulb className="text-yellow-500 mr-2" />
            AI Insights
          </h4>
          <div className="space-y-4">
            {insights.map((insight, index) => (
              <div key={index} className={`p-4 rounded-xl border-l-4 ${
                insight.type === 'positive' ? 'bg-green-900/20 border-green-500' :
                insight.type === 'warning' ? 'bg-yellow-900/20 border-yellow-500' :
                'bg-blue-900/20 border-blue-500'
              }`}>
                <div className="flex items-start">
                  <insight.icon className={`text-xl mr-3 mt-1 ${
                    insight.type === 'positive' ? 'text-green-400' :
                    insight.type === 'warning' ? 'text-yellow-400' :
                    'text-blue-400'
                  }`} />
                  <div>
                    <h5 className="font-semibold text-white mb-1">{insight.title}</h5>
                    <p className="text-gray-300 text-sm">{insight.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Recommendations */}
      {recommendations.length > 0 && (
        <div className="bg-gray-900 rounded-2xl p-6">
          <h4 className="text-xl font-bold text-white mb-4 flex items-center">
                            <FaBullseye className="text-indigo-500 mr-2" />
            AI Recommendations
          </h4>
          <div className="space-y-4">
            {recommendations.map((rec, index) => (
              <div key={index} className={`p-4 rounded-xl border-l-4 ${
                rec.priority === 'high' ? 'bg-red-900/20 border-red-500' :
                rec.priority === 'medium' ? 'bg-yellow-900/20 border-yellow-500' :
                'bg-blue-900/20 border-blue-500'
              }`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h5 className="font-semibold text-white mb-1">{rec.title}</h5>
                    <p className="text-gray-300 text-sm">{rec.description}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    rec.priority === 'high' ? 'bg-red-500 text-white' :
                    rec.priority === 'medium' ? 'bg-yellow-500 text-white' :
                    'bg-blue-500 text-white'
                  }`}>
                    {rec.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Progress Prediction */}
      {analysis && (
        <div className="bg-gray-900 rounded-2xl p-6">
          <h4 className="text-xl font-bold text-white mb-4 flex items-center">
            <FaChartLine className="text-green-500 mr-2" />
            Progress Prediction
          </h4>
          <div className="space-y-4">
            <div className="bg-gray-800 rounded-xl p-4">
              <h5 className="font-semibold text-white mb-2">Current Trajectory</h5>
              <p className="text-gray-300">{analysis.predictedProgress}</p>
            </div>
            
            {analysis.nextMilestones.length > 0 && (
              <div className="bg-gray-800 rounded-xl p-4">
                <h5 className="font-semibold text-white mb-3">Next Milestones</h5>
                <div className="space-y-2">
                  {analysis.nextMilestones.map((milestone, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <span className="text-gray-300">{milestone.skill}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-400">
                          {(milestone.current * 100).toFixed(0)}% → {(milestone.target * 100).toFixed(0)}%
                        </span>
                        <span className="text-green-400">{milestone.timeframe}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Refresh Button */}
      <div className="text-center">
        <button
          onClick={generateAIAnalysis}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200"
        >
          Refresh AI Analysis
        </button>
      </div>
    </div>
  );
};

export default AIPerformanceAnalysis;
