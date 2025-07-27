import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiShield, FiAlertTriangle, FiCheckCircle, FiXCircle, FiInfo, FiTrendingUp, FiTarget } = FiIcons;

const SafetyMetrics = ({ data }) => {
  const getSafetyScoreColor = (score) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSafetyScoreBackground = (score) => {
    if (score >= 90) return 'bg-green-50';
    if (score >= 70) return 'bg-yellow-50';
    return 'bg-red-50';
  };

  const getRiskLevelColor = (level) => {
    switch (level) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getRiskLevelIcon = (level) => {
    switch (level) {
      case 'high': return FiXCircle;
      case 'medium': return FiAlertTriangle;
      case 'low': return FiInfo;
      default: return FiCheckCircle;
    }
  };

  const totalRiskIncidents = Object.values(data.riskLevels).reduce((sum, count) => sum + count, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-6"
    >
      <div className="flex items-center mb-6">
        <SafeIcon icon={FiShield} className="text-xl text-green-600 mr-3" />
        <h3 className="text-xl font-semibold text-gray-900">Safety Metrics</h3>
      </div>

      {/* Safety Score Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {/* Overall Safety Score */}
        <div className={`rounded-lg p-4 ${getSafetyScoreBackground(data.safetyScore)}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Safety Score</span>
            <SafeIcon 
              icon={data.safetyScore >= 90 ? FiCheckCircle : FiAlertTriangle} 
              className={getSafetyScoreColor(data.safetyScore)} 
            />
          </div>
          <div className={`text-3xl font-bold ${getSafetyScoreColor(data.safetyScore)}`}>
            {data.safetyScore}
          </div>
          <div className="text-xs text-gray-600">out of 100</div>
        </div>

        {/* Total Warnings */}
        <div className="bg-orange-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Total Warnings</span>
            <SafeIcon icon={FiAlertTriangle} className="text-orange-600" />
          </div>
          <div className="text-2xl font-bold text-orange-600">
            {data.totalWarnings}
          </div>
          <div className="text-xs text-gray-600">safety alerts</div>
        </div>

        {/* High Risk Incidents */}
        <div className="bg-red-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">High Risk</span>
            <SafeIcon icon={FiXCircle} className="text-red-600" />
          </div>
          <div className="text-2xl font-bold text-red-600">
            {data.riskLevels.high || 0}
          </div>
          <div className="text-xs text-gray-600">incidents</div>
        </div>

        {/* Safety Rate */}
        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Safe Calculations</span>
            <SafeIcon icon={FiCheckCircle} className="text-green-600" />
          </div>
          <div className="text-2xl font-bold text-green-600">
            {Math.round(data.safetyScore)}%
          </div>
          <div className="text-xs text-gray-600">no warnings</div>
        </div>
      </div>

      {/* Risk Level Breakdown */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-900 mb-3 flex items-center">
          <SafeIcon icon={FiTrendingUp} className="mr-2 text-blue-600" />
          Risk Level Distribution
        </h4>
        
        <div className="space-y-3">
          {Object.entries(data.riskLevels).map(([level, count]) => {
            const percentage = totalRiskIncidents > 0 ? (count / totalRiskIncidents) * 100 : 0;
            
            return (
              <motion.div
                key={level}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center"
              >
                <div className="w-16 text-sm font-medium text-gray-700 capitalize">
                  {level}
                </div>
                <div className="flex-1 mx-3">
                  <div className="w-full bg-gray-200 rounded-full h-3 relative overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                      className={`h-3 rounded-full ${
                        level === 'high' ? 'bg-red-500' :
                        level === 'medium' ? 'bg-yellow-500' :
                        'bg-blue-500'
                      }`}
                    />
                  </div>
                </div>
                <div className="w-20 text-sm text-gray-600 text-right">
                  {count} ({percentage.toFixed(0)}%)
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Warning Types Analysis */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-900 mb-3 flex items-center">
          <SafeIcon icon={FiAlertTriangle} className="mr-2 text-orange-600" />
          Most Common Warning Types
        </h4>
        
        <div className="space-y-2">
          {Object.entries(data.safetyWarningTypes)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5)
            .map(([type, count], index) => {
              const percentage = data.totalWarnings > 0 ? (count / data.totalWarnings) * 100 : 0;
              
              return (
                <motion.div
                  key={type}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center">
                    <SafeIcon 
                      icon={FiAlertTriangle} 
                      className="mr-2 text-orange-500" 
                    />
                    <span className="text-sm font-medium text-gray-900">{type}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                      <div
                        className="bg-orange-500 h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 w-12 text-right">{count}</span>
                  </div>
                </motion.div>
              );
            })}
        </div>
      </div>

      {/* Improvement Areas */}
      {data.improvementAreas.length > 0 && (
        <div className="mb-6">
          <h4 className="font-medium text-gray-900 mb-3 flex items-center">
            <SafeIcon icon={FiTarget} className="mr-2 text-purple-600" />
            Priority Improvement Areas
          </h4>
          
          <div className="space-y-3">
            {data.improvementAreas.map((area, index) => (
              <motion.div
                key={area.type}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="p-4 border border-purple-200 rounded-lg bg-purple-50"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-purple-900">{area.type}</span>
                  <span className="text-sm text-purple-700">{area.count} occurrences</span>
                </div>
                <div className="text-sm text-purple-800">
                  {getImprovementSuggestion(area.type)}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Safety Recommendations */}
      <div className="p-4 bg-blue-50 rounded-lg">
        <h5 className="font-medium text-blue-900 mb-2 flex items-center">
          <SafeIcon icon={FiShield} className="mr-2" />
          Safety Recommendations
        </h5>
        <div className="space-y-1 text-sm text-blue-800">
          {data.safetyScore < 70 && (
            <p>• Review safety protocols and consider additional training</p>
          )}
          {data.riskLevels.high > 0 && (
            <p>• Address high-risk configurations immediately</p>
          )}
          {data.totalWarnings > 10 && (
            <p>• Consider more conservative weight recommendations</p>
          )}
          {Object.keys(data.safetyWarningTypes).length > 5 && (
            <p>• Multiple warning types suggest need for comprehensive safety review</p>
          )}
          <p>• Always conduct in-water testing with proper supervision</p>
          <p>• Regular equipment checks and maintenance recommended</p>
        </div>
      </div>
    </motion.div>
  );
};

// Helper function to provide improvement suggestions
const getImprovementSuggestion = (warningType) => {
  const suggestions = {
    'Target Depth Warning': 'Review ballast weight calculations and ensure proper wetsuit compensation',
    'Overweighting Risk': 'Consider reducing total weight and conducting gradual in-water testing',
    'Surface Safety Critical': 'Immediate weight reduction required - never dive with negative surface buoyancy',
    'High BMI': 'Consult with instructor for personalized weight recommendations',
    'Unusual Lung Capacity': 'Verify lung capacity measurements and consider professional assessment',
    'Deep Diving Alert': 'Requires advanced training and professional supervision'
  };
  
  return suggestions[warningType] || 'Review configuration and consult with certified instructor';
};

export default SafetyMetrics;