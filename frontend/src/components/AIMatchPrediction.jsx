import React, { useState, useEffect } from 'react';
import { FaBrain, FaChartBar, FaUsers, FaTrophy, FaRandom, FaLightbulb } from 'react-icons/fa';
import api from '../api.jsx';

const AIMatchPrediction = ({ matchId, onPredictionComplete }) => {
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [matchData, setMatchData] = useState(null);
  const [analysis, setAnalysis] = useState(null);

  useEffect(() => {
    if (matchId) {
      fetchMatchData();
    }
  }, [matchId]);

  const fetchMatchData = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/matches/${matchId}`);
      setMatchData(response.data);
      generatePrediction(response.data);
    } catch (error) {
      console.error('Error fetching match data:', error);
      setError('Failed to fetch match data');
    } finally {
      setLoading(false);
    }
  };

  const generatePrediction = async (match) => {
    try {
      // Get player performance data for both teams
      const team1Players = await Promise.all(
        match.team1.players.map(playerId => 
          api.get(`/performance/player/${playerId}`).catch(() => null)
        )
      );

      const team2Players = await Promise.all(
        match.team2.players.map(playerId => 
          api.get(`/performance/player/${playerId}`).catch(() => null)
        )
      );

      // Calculate team strengths
      const team1Strength = calculateTeamStrength(team1Players);
      const team2Strength = calculateTeamStrength(team2Players);

      // Generate AI prediction
      const predictionData = {
        team1: {
          name: match.team1.name,
          strength: team1Strength,
          winProbability: calculateWinProbability(team1Strength, team2Strength),
          keyPlayers: identifyKeyPlayers(team1Players),
          advantages: identifyAdvantages(team1Players, team2Players),
          strategy: generateStrategy(team1Players, team2Players)
        },
        team2: {
          name: match.team2.name,
          strength: team2Strength,
          winProbability: calculateWinProbability(team2Strength, team1Strength),
          keyPlayers: identifyKeyPlayers(team2Players),
          advantages: identifyAdvantages(team2Players, team1Players),
          strategy: generateStrategy(team2Players, team1Players)
        },
        predictedWinner: team1Strength > team2Strength ? match.team1.name : match.team2.name,
        confidence: calculateConfidence(team1Strength, team2Strength),
        factors: identifyKeyFactors(team1Players, team2Players),
        recommendations: generateRecommendations(team1Players, team2Players),
        timestamp: new Date().toISOString()
      };

      setPrediction(predictionData);
      setAnalysis(generateDetailedAnalysis(predictionData));
      onPredictionComplete && onPredictionComplete(predictionData);

    } catch (error) {
      console.error('Error generating prediction:', error);
      setError('Failed to generate prediction');
    }
  };

  const calculateTeamStrength = (players) => {
    if (!players || players.length === 0) return 0;
    
    const validPlayers = players.filter(p => p && p.data);
    if (validPlayers.length === 0) return 0;

    const totalStrength = validPlayers.reduce((sum, player) => {
      const performance = player.data;
      let playerStrength = 0;
      
      if (performance.metrics) {
        const scores = Object.values(performance.metrics);
        playerStrength = scores.reduce((s, score) => s + score, 0) / scores.length;
      }
      
      if (performance.skills) {
        const skillScores = Object.values(performance.skills);
        const skillStrength = skillScores.reduce((s, score) => s + score, 0) / skillScores.length;
        playerStrength = (playerStrength + skillStrength) / 2;
      }
      
      return sum + playerStrength;
    }, 0);

    return totalStrength / validPlayers.length;
  };

  const calculateWinProbability = (team1Strength, team2Strength) => {
    const totalStrength = team1Strength + team2Strength;
    if (totalStrength === 0) return 0.5;
    
    const probability = team1Strength / totalStrength;
    return Math.max(0.1, Math.min(0.9, probability)); // Clamp between 10% and 90%
  };

  const identifyKeyPlayers = (players) => {
    if (!players || players.length === 0) return [];
    
    const validPlayers = players.filter(p => p && p.data);
    if (validPlayers.length === 0) return [];

    return validPlayers
      .map(player => {
        const performance = player.data;
        let score = 0;
        
        if (performance.metrics) {
          const scores = Object.values(performance.metrics);
          score = scores.reduce((s, val) => s + val, 0) / scores.length;
        }
        
        return {
          id: player.data.user,
          name: player.data.name || 'Unknown Player',
          score: score,
          role: performance.role || 'Player'
        };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 3); // Top 3 players
  };

  const identifyAdvantages = (team1Players, team2Players) => {
    const advantages = [];
    
    // Analyze different aspects
    const team1Avg = calculateTeamStrength(team1Players);
    const team2Avg = calculateTeamStrength(team2Players);
    
    if (team1Avg > team2Avg * 1.1) {
      advantages.push('Overall team strength');
    }
    
    // Add more specific advantages based on player data
    if (team1Players.length > team2Players.length) {
      advantages.push('Team depth and substitutes');
    }
    
    return advantages;
  };

  const generateStrategy = (team1Players, team2Players) => {
    const strategies = [];
    
    // Analyze opponent weaknesses
    const team2Weaknesses = identifyTeamWeaknesses(team2Players);
    
    if (team2Weaknesses.includes('defense')) {
      strategies.push('Focus on aggressive attacking plays');
    }
    
    if (team2Weaknesses.includes('speed')) {
      strategies.push('Use quick counter-attacks and fast breaks');
    }
    
    if (team2Weaknesses.includes('stamina')) {
      strategies.push('Maintain high tempo throughout the match');
    }
    
    return strategies.length > 0 ? strategies : ['Maintain balanced approach', 'Focus on team coordination'];
  };

  const identifyTeamWeaknesses = (players) => {
    const weaknesses = [];
    const validPlayers = players.filter(p => p && p.data);
    
    if (validPlayers.length === 0) return weaknesses;
    
    // Analyze common weaknesses
    let totalDefense = 0, totalSpeed = 0, totalStamina = 0;
    let playerCount = 0;
    
    validPlayers.forEach(player => {
      const performance = player.data;
      if (performance.skills) {
        if (performance.skills.defense !== undefined) totalDefense += performance.skills.defense;
        if (performance.skills.speed !== undefined) totalSpeed += performance.skills.speed;
        if (performance.skills.stamina !== undefined) totalStamina += performance.skills.stamina;
        playerCount++;
      }
    });
    
    if (playerCount > 0) {
      if (totalDefense / playerCount < 0.6) weaknesses.push('defense');
      if (totalSpeed / playerCount < 0.6) weaknesses.push('speed');
      if (totalStamina / playerCount < 0.6) weaknesses.push('stamina');
    }
    
    return weaknesses;
  };

  const calculateConfidence = (team1Strength, team2Strength) => {
    const difference = Math.abs(team1Strength - team2Strength);
    const totalStrength = team1Strength + team2Strength;
    
    if (totalStrength === 0) return 0.5;
    
    const relativeDifference = difference / totalStrength;
    
    if (relativeDifference > 0.3) return 0.9; // High confidence
    if (relativeDifference > 0.15) return 0.7; // Medium confidence
    return 0.5; // Low confidence
  };

  const identifyKeyFactors = (team1Players, team2Players) => {
    const factors = [];
    
    // Team experience
    const team1Experience = calculateTeamExperience(team1Players);
    const team2Experience = calculateTeamExperience(team2Players);
    
    if (Math.abs(team1Experience - team2Experience) > 2) {
      factors.push('Team experience difference');
    }
    
    // Recent form
    factors.push('Recent performance trends');
    
    // Head-to-head history
    factors.push('Previous matchups');
    
    // Home/away advantage
    factors.push('Venue advantage');
    
    return factors;
  };

  const calculateTeamExperience = (players) => {
    if (!players || players.length === 0) return 0;
    
    const validPlayers = players.filter(p => p && p.data);
    if (validPlayers.length === 0) return 0;
    
    // This would ideally use actual experience data
    // For now, return a random value between 1-10
    return Math.floor(Math.random() * 10) + 1;
  };

  const generateRecommendations = (team1Players, team2Players) => {
    const recommendations = [];
    
    // Analyze team composition
    const team1Roles = analyzeTeamRoles(team1Players);
    const team2Roles = analyzeTeamRoles(team2Players);
    
    // Identify gaps
    if (team1Roles.attackers < 2) {
      recommendations.push('Consider adding more attacking players');
    }
    
    if (team1Roles.defenders < 2) {
      recommendations.push('Strengthen defensive line');
    }
    
    return recommendations;
  };

  const analyzeTeamRoles = (players) => {
    const roles = { attackers: 0, midfielders: 0, defenders: 0, goalkeepers: 0 };
    
    players.forEach(player => {
      if (player && player.data && player.data.role) {
        const role = player.data.role.toLowerCase();
        if (role.includes('attack')) roles.attackers++;
        else if (role.includes('mid')) roles.midfielders++;
        else if (role.includes('defend')) roles.defenders++;
        else if (role.includes('goal')) roles.goalkeepers++;
      }
    });
    
    return roles;
  };

  const generateDetailedAnalysis = (predictionData) => {
    return {
      summary: `AI predicts ${predictionData.predictedWinner} to win with ${(predictionData.confidence * 100).toFixed(0)}% confidence`,
      keyInsights: [
        `${predictionData.team1.name} has ${(predictionData.team1.winProbability * 100).toFixed(1)}% win probability`,
        `${predictionData.team2.name} has ${(predictionData.team2.winProbability * 100).toFixed(1)}% win probability`,
        `Key factors: ${predictionData.factors.join(', ')}`
      ],
      tacticalAnalysis: {
        team1: predictionData.team1.strategy,
        team2: predictionData.team2.strategy
      }
    };
  };

  if (loading) {
    return (
      <div className="bg-gray-900 rounded-2xl p-6">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
          <span className="ml-3 text-white">Generating AI Prediction...</span>
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

  if (!prediction) {
    return (
      <div className="bg-gray-900 rounded-2xl p-6 text-center">
        <p className="text-gray-400">No prediction available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* AI Prediction Header */}
      <div className="bg-gradient-to-r from-purple-900 to-blue-900 rounded-2xl p-6">
        <div className="flex items-center mb-4">
          <FaBrain className="text-3xl text-purple-400 mr-3" />
          <div>
            <h3 className="text-2xl font-bold text-white">AI Match Prediction</h3>
            <p className="text-purple-200">Advanced analysis powered by artificial intelligence</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-black/20 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-white">
              {prediction.predictedWinner}
            </div>
            <div className="text-purple-200 text-sm">Predicted Winner</div>
          </div>
          <div className="bg-black/20 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-white">
              {(prediction.confidence * 100).toFixed(0)}%
            </div>
            <div className="text-purple-200 text-sm">Confidence</div>
          </div>
          <div className="bg-black/20 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-white">
              {prediction.factors.length}
            </div>
            <div className="text-purple-200 text-sm">Key Factors</div>
          </div>
        </div>
      </div>

      {/* Team Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Team 1 */}
        <div className="bg-gray-900 rounded-2xl p-6">
          <h4 className="text-xl font-bold text-white mb-4 flex items-center">
            <FaUsers className="text-blue-400 mr-2" />
            {prediction.team1.name}
          </h4>
          
          <div className="space-y-4">
            <div className="bg-gray-800 rounded-xl p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-300">Win Probability</span>
                <span className="text-2xl font-bold text-blue-400">
                  {(prediction.team1.winProbability * 100).toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${prediction.team1.winProbability * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div className="bg-gray-800 rounded-xl p-4">
              <h5 className="font-semibold text-white mb-2">Key Players</h5>
              <div className="space-y-2">
                {prediction.team1.keyPlayers.map((player, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="text-gray-300">{player.name}</span>
                    <span className="text-blue-400">{(player.score * 100).toFixed(0)}%</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-gray-800 rounded-xl p-4">
              <h5 className="font-semibold text-white mb-2">Strategy</h5>
              <ul className="text-sm text-gray-300 space-y-1">
                {prediction.team1.strategy.map((strategy, index) => (
                  <li key={index} className="flex items-start">
                    <FaLightbulb className="text-yellow-400 mr-2 mt-1 text-xs" />
                    {strategy}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Team 2 */}
        <div className="bg-gray-900 rounded-2xl p-6">
          <h4 className="text-xl font-bold text-white mb-4 flex items-center">
            <FaUsers className="text-green-400 mr-2" />
            {prediction.team2.name}
          </h4>
          
          <div className="space-y-4">
            <div className="bg-gray-800 rounded-xl p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-300">Win Probability</span>
                <span className="text-2xl font-bold text-green-400">
                  {(prediction.team2.winProbability * 100).toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${prediction.team2.winProbability * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div className="bg-gray-800 rounded-xl p-4">
              <h5 className="font-semibold text-white mb-2">Key Players</h5>
              <div className="space-y-2">
                {prediction.team2.keyPlayers.map((player, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="text-gray-300">{player.name}</span>
                    <span className="text-green-400">{(player.score * 100).toFixed(0)}%</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-gray-800 rounded-xl p-4">
              <h5 className="font-semibold text-white mb-2">Strategy</h5>
              <ul className="text-sm text-gray-300 space-y-1">
                {prediction.team2.strategy.map((strategy, index) => (
                  <li key={index} className="flex items-start">
                    <FaLightbulb className="text-yellow-400 mr-2 mt-1 text-xs" />
                    {strategy}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Key Factors & Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-900 rounded-2xl p-6">
          <h4 className="text-xl font-bold text-white mb-4 flex items-center">
            <FaChartBar className="text-yellow-500 mr-2" />
            Key Factors
          </h4>
          <div className="space-y-2">
            {prediction.factors.map((factor, index) => (
              <div key={index} className="flex items-center text-gray-300">
                <FaRandom className="text-yellow-500 mr-2 text-sm" />
                {factor}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-900 rounded-2xl p-6">
          <h4 className="text-xl font-bold text-white mb-4 flex items-center">
            <FaLightbulb className="text-indigo-500 mr-2" />
            AI Recommendations
          </h4>
          <div className="space-y-2">
            {prediction.recommendations.map((rec, index) => (
              <div key={index} className="flex items-center text-gray-300">
                <FaTrophy className="text-indigo-500 mr-2 text-sm" />
                {rec}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Refresh Button */}
      <div className="text-center">
        <button
          onClick={() => generatePrediction(matchData)}
          className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200"
        >
          Refresh AI Prediction
        </button>
      </div>
    </div>
  );
};

export default AIMatchPrediction;
