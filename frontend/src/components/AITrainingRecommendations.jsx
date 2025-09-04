import React, { useState, useEffect } from 'react';
import { FaBrain, FaDumbbell, FaRunning, FaCalendarAlt, FaChartLine, FaLightbulb, FaBullseye } from 'react-icons/fa';
import api from '../api.jsx';

const AITrainingRecommendations = ({ playerId }) => {
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [trainingPlan, setTrainingPlan] = useState(null);
  const [weeklySchedule, setWeeklySchedule] = useState(null);

  useEffect(() => {
    if (playerId) {
      generateTrainingRecommendations();
    }
  }, [playerId]);

  const generateTrainingRecommendations = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get player performance and profile data
      const [performanceResponse, profileResponse] = await Promise.all([
        api.get('/performance/player/me'),
        api.get('/players/me')
      ]);

      const performance = performanceResponse.data;
      const profile = profileResponse.data;

      // Generate AI training recommendations
      const aiRecommendations = generateRecommendations(performance, profile);
      setRecommendations(aiRecommendations);

      // Generate personalized training plan
      const plan = generateTrainingPlan(performance, profile, aiRecommendations);
      setTrainingPlan(plan);

      // Generate weekly schedule
      const schedule = generateWeeklySchedule(plan);
      setWeeklySchedule(schedule);

    } catch (error) {
      console.error('AI Training Recommendations error:', error);
      setError('Failed to generate training recommendations');
    } finally {
      setLoading(false);
    }
  };

  const generateRecommendations = (performance, profile) => {
    const recommendations = [];

    // Analyze current performance levels
    if (performance.skills) {
      Object.entries(performance.skills).forEach(([skill, score]) => {
        if (score < 0.5) {
          recommendations.push({
            type: 'critical',
            skill: skill,
            priority: 'high',
            description: `Your ${skill} skills need immediate attention. Focus on fundamentals.`,
            exercises: getSkillSpecificExercises(skill, 'beginner'),
            frequency: 'Daily',
            duration: '30-45 minutes'
          });
        } else if (score < 0.7) {
          recommendations.push({
            type: 'improvement',
            skill: skill,
            priority: 'medium',
            description: `Your ${skill} skills are developing. Focus on technique refinement.`,
            exercises: getSkillSpecificExercises(skill, 'intermediate'),
            frequency: '3-4 times per week',
            duration: '45-60 minutes'
          });
        } else if (score < 0.85) {
          recommendations.push({
            type: 'advanced',
            skill: skill,
            priority: 'low',
            description: `Your ${skill} skills are strong. Focus on advanced techniques and consistency.`,
            exercises: getSkillSpecificExercises(skill, 'advanced'),
            frequency: '2-3 times per week',
            duration: '60-90 minutes'
          });
        }
      });
    }

    // Analyze performance trends
    if (performance.trends && performance.trends.length > 0) {
      const recentTrend = performance.trends[performance.trends.length - 1];
      const previousTrend = performance.trends[performance.trends.length - 2];

      if (recentTrend && previousTrend) {
        const improvement = ((recentTrend.score - previousTrend.score) / previousTrend.score) * 100;
        
        if (improvement < -5) {
          recommendations.push({
            type: 'recovery',
            skill: 'overall',
            priority: 'high',
            description: 'Your performance has declined. Focus on recovery and rebuilding fundamentals.',
            exercises: ['Light stretching', 'Low-intensity cardio', 'Technique drills'],
            frequency: 'Daily',
            duration: '20-30 minutes'
          });
        }
      }
    }

    // Add sport-specific recommendations
    if (profile.sport) {
      const sportRecommendations = getSportSpecificRecommendations(profile.sport, performance);
      recommendations.push(...sportRecommendations);
    }

    return recommendations;
  };

  const getSkillSpecificExercises = (skill, level) => {
    const exerciseDatabase = {
      shooting: {
        beginner: ['Basic shooting form', 'Wall shooting', 'Free throw practice'],
        intermediate: ['Moving shots', 'Contested shots', 'Game situation shooting'],
        advanced: ['Complex shot combinations', 'Pressure shooting', 'Advanced footwork']
      },
      passing: {
        beginner: ['Basic passing form', 'Wall passing', 'Partner passing'],
        intermediate: ['Moving passes', 'One-touch passing', 'Passing under pressure'],
        advanced: ['Creative passing', 'Long-range passing', 'Passing in traffic']
      },
      dribbling: {
        beginner: ['Basic dribbling', 'Stationary drills', 'Walking dribbling'],
        intermediate: ['Moving dribbling', 'Change of direction', 'Speed dribbling'],
        advanced: ['Advanced moves', 'Combination dribbling', 'Game situation dribbling']
      },
      defense: {
        beginner: ['Defensive stance', 'Basic footwork', 'Positioning'],
        intermediate: ['Moving defense', 'Contest shots', 'Help defense'],
        advanced: ['Advanced techniques', 'Team defense', 'Defensive strategies']
      },
      speed: {
        beginner: ['Basic sprinting', 'Agility ladder', 'Light jogging'],
        intermediate: ['Interval training', 'Plyometrics', 'Speed drills'],
        advanced: ['Advanced plyometrics', 'Sport-specific speed', 'Competition speed']
      },
      stamina: {
        beginner: ['Light cardio', 'Walking', 'Basic endurance'],
        intermediate: ['Moderate cardio', 'Interval training', 'Endurance building'],
        advanced: ['High-intensity training', 'Sport-specific endurance', 'Competition preparation']
      }
    };

    return exerciseDatabase[skill]?.[level] || ['General skill development', 'Technique practice', 'Game simulation'];
  };

  const getSportSpecificRecommendations = (sport, performance) => {
    const recommendations = [];

    switch (sport.toLowerCase()) {
      case 'football':
        recommendations.push({
          type: 'sport-specific',
          skill: 'football-specific',
          priority: 'medium',
          description: 'Focus on football-specific skills and tactics.',
          exercises: ['Ball control drills', 'Passing combinations', 'Tactical training'],
          frequency: '3-4 times per week',
          duration: '60-90 minutes'
        });
        break;
      case 'basketball':
        recommendations.push({
          type: 'sport-specific',
          skill: 'basketball-specific',
          priority: 'medium',
          description: 'Focus on basketball fundamentals and game situations.',
          exercises: ['Shooting practice', 'Ball handling', 'Game simulation'],
          frequency: '3-4 times per week',
          duration: '60-90 minutes'
        });
        break;
      case 'tennis':
        recommendations.push({
          type: 'sport-specific',
          skill: 'tennis-specific',
          priority: 'medium',
          description: 'Focus on tennis technique and match play.',
          exercises: ['Stroke practice', 'Footwork drills', 'Match simulation'],
          frequency: '3-4 times per week',
          duration: '60-90 minutes'
        });
        break;
      default:
        recommendations.push({
          type: 'general',
          skill: 'general fitness',
          priority: 'medium',
          description: 'Focus on general fitness and athletic development.',
          exercises: ['Cardio training', 'Strength training', 'Flexibility work'],
          frequency: '3-4 times per week',
          duration: '45-60 minutes'
        });
    }

    return recommendations;
  };

  const generateTrainingPlan = (performance, profile, recommendations) => {
    const plan = {
      duration: '12 weeks',
      phases: [
        {
          name: 'Foundation Phase',
          duration: '4 weeks',
          focus: 'Build fundamental skills and fitness base',
          intensity: 'Low to Moderate',
          sessions: 4
        },
        {
          name: 'Development Phase',
          duration: '4 weeks',
          focus: 'Improve specific skills and increase intensity',
          intensity: 'Moderate to High',
          sessions: 5
        },
        {
          name: 'Performance Phase',
          duration: '4 weeks',
          focus: 'Peak performance and competition preparation',
          intensity: 'High',
          sessions: 6
        }
      ],
      weeklyStructure: {
        monday: 'Skill Development + Strength Training',
        tuesday: 'Cardio + Endurance',
        wednesday: 'Technique + Tactics',
        thursday: 'Recovery + Flexibility',
        friday: 'Game Simulation + Speed',
        saturday: 'Competition + Analysis',
        sunday: 'Active Recovery + Planning'
      },
      goals: generateGoals(performance, profile),
      milestones: generateMilestones(performance, profile)
    };

    return plan;
  };

  const generateGoals = (performance, profile) => {
    const goals = [];
    
    if (performance.skills) {
      Object.entries(performance.skills).forEach(([skill, score]) => {
        const currentLevel = score < 0.5 ? 'beginner' : score < 0.7 ? 'intermediate' : 'advanced';
        const targetLevel = score < 0.5 ? 'intermediate' : score < 0.7 ? 'advanced' : 'expert';
        
        goals.push({
          skill: skill,
          currentLevel: currentLevel,
          targetLevel: targetLevel,
          timeframe: '12 weeks',
          measurable: `Improve ${skill} score from ${(score * 100).toFixed(0)}% to ${Math.min(100, (score + 0.2) * 100).toFixed(0)}%`
        });
      });
    }

    return goals;
  };

  const generateMilestones = (performance, profile) => {
    const milestones = [];
    
    // Week 4 milestone
    milestones.push({
      week: 4,
      description: 'Complete foundation phase with improved fundamentals',
      target: 'All basic skills at 60%+ proficiency'
    });

    // Week 8 milestone
    milestones.push({
      week: 8,
      description: 'Complete development phase with enhanced skills',
      target: 'All skills at 70%+ proficiency'
    });

    // Week 12 milestone
    milestones.push({
      week: 12,
      description: 'Achieve performance phase goals',
      target: 'All skills at 80%+ proficiency, ready for competition'
    });

    return milestones;
  };

  const generateWeeklySchedule = (plan) => {
    const schedule = {
      currentWeek: 1,
      totalWeeks: 12,
      days: Object.entries(plan.weeklyStructure).map(([day, activity]) => ({
        day: day.charAt(0).toUpperCase() + day.slice(1),
        activity: activity,
        duration: getActivityDuration(activity),
        intensity: getActivityIntensity(activity),
        focus: getActivityFocus(activity)
      }))
    };

    return schedule;
  };

  const getActivityDuration = (activity) => {
    if (activity.includes('Recovery')) return '30-45 min';
    if (activity.includes('Cardio')) return '45-60 min';
    if (activity.includes('Strength')) return '60-75 min';
    if (activity.includes('Game')) return '90-120 min';
    return '60 min';
  };

  const getActivityIntensity = (activity) => {
    if (activity.includes('Recovery')) return 'Low';
    if (activity.includes('Cardio')) return 'Medium-High';
    if (activity.includes('Strength')) return 'High';
    if (activity.includes('Game')) return 'High';
    return 'Medium';
  };

  const getActivityFocus = (activity) => {
    if (activity.includes('Skill')) return 'Technical Development';
    if (activity.includes('Strength')) return 'Physical Conditioning';
    if (activity.includes('Cardio')) return 'Endurance Building';
    if (activity.includes('Game')) return 'Competition Preparation';
    if (activity.includes('Recovery')) return 'Recovery & Maintenance';
    return 'General Training';
  };

  if (loading) {
    return (
      <div className="bg-gray-900 rounded-2xl p-6">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
          <span className="ml-3 text-white">Generating AI Training Recommendations...</span>
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
      {/* AI Training Header */}
      <div className="bg-gradient-to-r from-green-900 to-blue-900 rounded-2xl p-6">
        <div className="flex items-center mb-4">
          <FaBrain className="text-3xl text-green-400 mr-3" />
          <div>
            <h3 className="text-2xl font-bold text-white">AI Training Recommendations</h3>
            <p className="text-green-200">Personalized training plans powered by artificial intelligence</p>
          </div>
        </div>
        
        {trainingPlan && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-black/20 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-white">
                {trainingPlan.duration}
              </div>
              <div className="text-green-200 text-sm">Program Duration</div>
            </div>
            <div className="bg-black/20 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-white">
                {recommendations?.length || 0}
              </div>
              <div className="text-green-200 text-sm">AI Recommendations</div>
            </div>
            <div className="bg-black/20 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-white">
                {trainingPlan.phases.length}
              </div>
              <div className="text-green-200 text-sm">Training Phases</div>
            </div>
          </div>
        )}
      </div>

      {/* Training Plan Overview */}
      {trainingPlan && (
        <div className="bg-gray-900 rounded-2xl p-6">
          <h4 className="text-xl font-bold text-white mb-4 flex items-center">
            <FaCalendarAlt className="text-blue-400 mr-2" />
            Training Plan Overview
          </h4>
          
          <div className="space-y-4">
            {trainingPlan.phases.map((phase, index) => (
              <div key={index} className="bg-gray-800 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="font-semibold text-white">{phase.name}</h5>
                  <span className="text-blue-400 text-sm">{phase.duration}</span>
                </div>
                <p className="text-gray-300 text-sm mb-2">{phase.focus}</p>
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>Intensity: {phase.intensity}</span>
                  <span>{phase.sessions} sessions/week</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Weekly Schedule */}
      {weeklySchedule && (
        <div className="bg-gray-900 rounded-2xl p-6">
          <h4 className="text-xl font-bold text-white mb-4 flex items-center">
            <FaCalendarAlt className="text-green-400 mr-2" />
            Weekly Training Schedule
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-3">
            {weeklySchedule.days.map((day, index) => (
              <div key={index} className="bg-gray-800 rounded-xl p-3 text-center">
                <div className="text-sm font-semibold text-white mb-2">{day.day}</div>
                <div className="text-xs text-gray-300 mb-1">{day.activity}</div>
                <div className="text-xs text-blue-400 mb-1">{day.duration}</div>
                <div className="text-xs text-green-400">{day.intensity}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Recommendations */}
      {recommendations && recommendations.length > 0 && (
        <div className="bg-gray-900 rounded-2xl p-6">
          <h4 className="text-xl font-bold text-white mb-4 flex items-center">
            <FaLightbulb className="text-yellow-500 mr-2" />
            AI Training Recommendations
          </h4>
          
          <div className="space-y-4">
            {recommendations.map((rec, index) => (
              <div key={index} className={`p-4 rounded-xl border-l-4 ${
                rec.priority === 'high' ? 'bg-red-900/20 border-red-500' :
                rec.priority === 'medium' ? 'bg-yellow-900/20 border-yellow-500' :
                'bg-blue-900/20 border-blue-500'
              }`}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h5 className="font-semibold text-white mb-1">
                      {rec.skill.charAt(0).toUpperCase() + rec.skill.slice(1)} Training
                    </h5>
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
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                  <div>
                    <span className="text-gray-400">Frequency:</span>
                    <div className="text-white">{rec.frequency}</div>
                  </div>
                  <div>
                    <span className="text-gray-400">Duration:</span>
                    <div className="text-white">{rec.duration}</div>
                  </div>
                  <div>
                    <span className="text-gray-400">Focus:</span>
                    <div className="text-white">{rec.type}</div>
                  </div>
                </div>
                
                <div className="mt-3">
                  <span className="text-gray-400 text-sm">Recommended Exercises:</span>
                  <ul className="text-white text-sm mt-1 space-y-1">
                    {rec.exercises.map((exercise, idx) => (
                      <li key={idx} className="flex items-center">
                        <FaBullseye className="text-green-400 mr-2 text-xs" />
                        {exercise}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Training Goals & Milestones */}
      {trainingPlan && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-900 rounded-2xl p-6">
            <h4 className="text-xl font-bold text-white mb-4 flex items-center">
                              <FaBullseye className="text-purple-400 mr-2" />
              Training Goals
            </h4>
            <div className="space-y-3">
              {trainingPlan.goals.map((goal, index) => (
                <div key={index} className="bg-gray-800 rounded-xl p-3">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-semibold text-white">{goal.skill}</span>
                    <span className="text-purple-400 text-sm">{goal.timeframe}</span>
                  </div>
                  <p className="text-gray-300 text-sm mb-2">{goal.measurable}</p>
                  <div className="text-xs text-gray-400">
                    {goal.currentLevel} → {goal.targetLevel}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-900 rounded-2xl p-6">
            <h4 className="text-xl font-bold text-white mb-4 flex items-center">
              <FaChartLine className="text-green-400 mr-2" />
              Milestones
            </h4>
            <div className="space-y-3">
              {trainingPlan.milestones.map((milestone, index) => (
                <div key={index} className="bg-gray-800 rounded-xl p-3">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-semibold text-white">Week {milestone.week}</span>
                    <span className="text-green-400 text-sm">Milestone</span>
                  </div>
                  <p className="text-gray-300 text-sm mb-2">{milestone.description}</p>
                  <div className="text-xs text-gray-400">{milestone.target}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Refresh Button */}
      <div className="text-center">
        <button
          onClick={generateTrainingRecommendations}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200"
        >
          Refresh AI Recommendations
        </button>
      </div>
    </div>
  );
};

export default AITrainingRecommendations;
