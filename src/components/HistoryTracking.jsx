import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiClock, FiTrendingUp, FiTarget, FiDroplet, FiWind, FiMale, FiFemale } = FiIcons;

const HistoryTracking = ({ history }) => {
  const getBuoyancyColor = (status) => {
    switch (status) {
      case 'positive': return 'text-red-600 bg-red-50';
      case 'neutral': return 'text-green-600 bg-green-50';
      case 'negative': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getWeightTrend = () => {
    if (history.length < 2) return null;
    const recent = history[0].results.recommendedWeight;
    const previous = history[1].results.recommendedWeight;
    const diff = recent - previous;
    if (Math.abs(diff) < 0.1) return { trend: 'stable', value: 0 };
    return { trend: diff > 0 ? 'increasing' : 'decreasing', value: Math.abs(diff) };
  };

  const formatWeight = (entry) => {
    const { weightBeltUnit, neckWeightUnit } = entry.inputs;
    const beltValue = entry.inputs.weightBelt;
    const neckValue = entry.inputs.neckWeight;
    
    return `${beltValue}${weightBeltUnit} + ${neckValue}${neckWeightUnit}`;
  };

  const trend = getWeightTrend();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* History Header */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <SafeIcon icon={FiClock} className="text-xl text-blue-600 mr-3" />
            <h3 className="text-xl font-semibold text-gray-900">Calculation History</h3>
          </div>
          {trend && (
            <div className="flex items-center text-sm">
              <SafeIcon icon={FiTrendingUp} className="mr-1" />
              <span className={`font-medium ${trend.trend === 'increasing' ? 'text-red-600' : trend.trend === 'decreasing' ? 'text-blue-600' : 'text-green-600'}`}>
                {trend.trend === 'stable' ? 'Stable' : `${trend.trend === 'increasing' ? '+' : '-'}${trend.value.toFixed(1)}kg`}
              </span>
            </div>
          )}
        </div>

        {history.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <SafeIcon icon={FiClock} className="text-4xl mx-auto mb-2 opacity-50" />
            <p>No calculations saved yet</p>
            <p className="text-sm mt-1">Save your current calculation to start tracking</p>
          </div>
        ) : (
          <div className="text-center text-gray-600">
            <div className="text-2xl font-bold text-blue-600">{history.length}</div>
            <div className="text-sm">Saved calculations</div>
          </div>
        )}
      </div>

      {/* History List */}
      {history.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h4 className="font-semibold text-gray-900 mb-4">Recent Calculations</h4>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {history.map((entry, index) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="text-sm text-gray-600">
                    {format(new Date(entry.date), 'MMM dd, yyyy HH:mm')}
                  </div>
                  <div className={`px-2 py-1 rounded text-xs font-medium ${getBuoyancyColor(entry.results.surfaceBuoyancy)}`}>
                    {entry.results.surfaceBuoyancy}
                  </div>
                </div>

                <div className="flex items-center mb-3">
                  <SafeIcon 
                    icon={entry.inputs.gender === 'male' ? FiMale : FiFemale} 
                    className={`mr-2 ${entry.inputs.gender === 'male' ? 'text-blue-500' : 'text-pink-500'}`} 
                  />
                  <span className="text-sm capitalize">{entry.inputs.gender}</span>
                  <span className="mx-1 text-gray-400">•</span>
                  <span className="text-sm">{entry.inputs.lungCapacity}L</span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="font-medium text-gray-900">Weight</div>
                    <div className="text-gray-600">{entry.inputs.weight}kg</div>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Wetsuit</div>
                    <div className="text-gray-600">{entry.inputs.wetsuitThickness}mm</div>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Weights</div>
                    <div className="text-gray-600">
                      {formatWeight(entry)}
                    </div>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Water</div>
                    <div className="text-gray-600 capitalize">{entry.inputs.waterType}</div>
                  </div>
                </div>

                <div className="mt-2 grid grid-cols-2 gap-4 text-xs">
                  <div className="flex items-center">
                    <SafeIcon icon={FiTarget} className="mr-1 text-blue-500" />
                    <span>{entry.inputs.targetDepth}m target</span>
                  </div>
                  <div className="flex items-center">
                    <SafeIcon icon={FiWind} className="mr-1 text-blue-500" />
                    <span>{entry.inputs.bodyType} build</span>
                  </div>
                </div>

                {entry.results.expectedNeutralDepth && (
                  <div className="mt-2 text-xs bg-blue-50 p-2 rounded">
                    Neutral at: {entry.results.expectedNeutralDepth}m
                  </div>
                )}

                {entry.results.safetyWarnings.length > 0 && (
                  <div className="mt-1 flex items-center text-xs text-amber-600">
                    <SafeIcon icon={FiTarget} className="mr-1" />
                    {entry.results.safetyWarnings.length} safety consideration(s)
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Stats */}
      {history.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h4 className="font-semibold text-gray-900 mb-4">Quick Stats</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-blue-50 rounded-lg p-3">
              <div className="font-medium text-blue-900">Avg. Weight</div>
              <div className="text-xl font-bold text-blue-800">
                {(history.reduce((sum, entry) => sum + entry.results.recommendedWeight, 0) / history.length).toFixed(1)}kg
              </div>
            </div>
            <div className="bg-green-50 rounded-lg p-3">
              <div className="font-medium text-green-900">Most Common</div>
              <div className="text-lg font-semibold text-green-800">
                {history.length > 0 ? `${history[0].inputs.wetsuitThickness}mm suit` : 'N/A'}
              </div>
            </div>
          </div>

          {/* Natural Neutral Depth Reference */}
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <h5 className="font-medium text-gray-700 mb-2">Reference Points</h5>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <div className="font-medium">Saltwater</div>
                <div className="text-gray-600">Neutral at 10-12m</div>
              </div>
              <div>
                <div className="font-medium">Freshwater</div>
                <div className="text-gray-600">Neutral at 5-7m</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default HistoryTracking;