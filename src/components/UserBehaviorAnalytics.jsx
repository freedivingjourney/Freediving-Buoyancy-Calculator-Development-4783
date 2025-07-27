import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiUsers, FiClock, FiTarget, FiTrendingUp } = FiIcons;

const UserBehaviorAnalytics = ({ data }) => {
  const getUsageIntensity = (hour) => {
    const count = data.sessionsByHour[hour] || 0;
    const maxCount = Math.max(...Object.values(data.sessionsByHour));
    return maxCount > 0 ? (count / maxCount) * 100 : 0;
  };

  const getTimeOfDayLabel = (hour) => {
    if (hour >= 6 && hour < 12) return 'Morning';
    if (hour >= 12 && hour < 18) return 'Afternoon';
    if (hour >= 18 && hour < 22) return 'Evening';
    return 'Night';
  };

  const hourlyData = Array.from({ length: 24 }, (_, hour) => ({
    hour,
    count: data.sessionsByHour[hour] || 0,
    intensity: getUsageIntensity(hour),
    label: getTimeOfDayLabel(hour)
  }));

  const timeOfDayStats = hourlyData.reduce((acc, { hour, count, label }) => {
    acc[label] = (acc[label] || 0) + count;
    return acc;
  }, {});

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-6"
    >
      <div className="flex items-center mb-6">
        <SafeIcon icon={FiUsers} className="text-xl text-blue-600 mr-3" />
        <h3 className="text-xl font-semibold text-gray-900">User Behavior Analysis</h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Usage Heatmap */}
        <div>
          <h4 className="font-medium text-gray-900 mb-4 flex items-center">
            <SafeIcon icon={FiClock} className="mr-2 text-blue-600" />
            Usage Heatmap (24 Hours)
          </h4>
          <div className="grid grid-cols-6 gap-1">
            {hourlyData.map(({ hour, intensity, count }) => (
              <div
                key={hour}
                className="relative group"
                title={`${hour}:00 - ${count} calculations`}
              >
                <div
                  className={`w-8 h-8 rounded flex items-center justify-center text-xs font-medium transition-all duration-200 ${
                    intensity > 75 ? 'bg-blue-600 text-white' :
                    intensity > 50 ? 'bg-blue-400 text-white' :
                    intensity > 25 ? 'bg-blue-200 text-blue-800' :
                    intensity > 0 ? 'bg-blue-100 text-blue-600' :
                    'bg-gray-100 text-gray-400'
                  }`}
                >
                  {hour}
                </div>
                
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                  {hour}:00 - {count} uses
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
            <span>Less active</span>
            <div className="flex space-x-1">
              <div className="w-3 h-3 bg-gray-100 rounded"></div>
              <div className="w-3 h-3 bg-blue-100 rounded"></div>
              <div className="w-3 h-3 bg-blue-200 rounded"></div>
              <div className="w-3 h-3 bg-blue-400 rounded"></div>
              <div className="w-3 h-3 bg-blue-600 rounded"></div>
            </div>
            <span>More active</span>
          </div>
        </div>

        {/* Time of Day Analysis */}
        <div>
          <h4 className="font-medium text-gray-900 mb-4 flex items-center">
            <SafeIcon icon={FiTrendingUp} className="mr-2 text-green-600" />
            Time of Day Patterns
          </h4>
          
          <div className="space-y-3">
            {Object.entries(timeOfDayStats)
              .sort(([,a], [,b]) => b - a)
              .map(([timeOfDay, count]) => {
                const percentage = count > 0 ? (count / Object.values(timeOfDayStats).reduce((sum, val) => sum + val, 0)) * 100 : 0;
                const isActive = count > 0;
                
                return (
                  <motion.div
                    key={timeOfDay}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex items-center"
                  >
                    <div className="w-20 text-sm font-medium text-gray-700">
                      {timeOfDay}
                    </div>
                    <div className="flex-1 mx-3">
                      <div className="w-full bg-gray-200 rounded-full h-3 relative overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 0.8, delay: 0.2 }}
                          className={`h-3 rounded-full ${
                            timeOfDay === 'Morning' ? 'bg-yellow-400' :
                            timeOfDay === 'Afternoon' ? 'bg-orange-400' :
                            timeOfDay === 'Evening' ? 'bg-blue-500' :
                            'bg-purple-500'
                          }`}
                        />
                      </div>
                    </div>
                    <div className="w-16 text-sm text-gray-600 text-right">
                      {count} ({percentage.toFixed(0)}%)
                    </div>
                  </motion.div>
                );
              })}
          </div>

          {/* Peak Usage Insight */}
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center">
              <SafeIcon icon={FiTarget} className="text-blue-600 mr-2" />
              <div>
                <p className="text-sm font-medium text-blue-900">Peak Usage</p>
                <p className="text-xs text-blue-700">
                  Most active at {data.peakUsageHour}:00 
                  ({getTimeOfDayLabel(parseInt(data.peakUsageHour))} user)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User Profile Insights */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="font-medium text-gray-900 mb-4">Profile Distribution Insights</h4>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Most Common Gender */}
          <div className="bg-pink-50 rounded-lg p-3">
            <div className="text-2xl font-bold text-pink-600">
              {Object.entries(data.genderDistribution).reduce((a, b) => 
                data.genderDistribution[a[0]] > data.genderDistribution[b[0]] ? a : b, ['unknown', 0]
              )[0]}
            </div>
            <div className="text-xs text-pink-700">Most common gender</div>
          </div>

          {/* Most Common Body Type */}
          <div className="bg-green-50 rounded-lg p-3">
            <div className="text-sm font-bold text-green-600 capitalize">
              {Object.entries(data.bodyTypeDistribution).reduce((a, b) => 
                data.bodyTypeDistribution[a[0]] > data.bodyTypeDistribution[b[0]] ? a : b, ['unknown', 0]
              )[0]}
            </div>
            <div className="text-xs text-green-700">Most common body type</div>
          </div>

          {/* Most Popular Wetsuit */}
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="text-sm font-bold text-blue-600">
              {Object.entries(data.wetsuitUsage).reduce((a, b) => 
                data.wetsuitUsage[a[0]] > data.wetsuitUsage[b[0]] ? a : b, ['None', 0]
              )[0]}
            </div>
            <div className="text-xs text-blue-700">Most popular wetsuit</div>
          </div>

          {/* Water Type Preference */}
          <div className="bg-purple-50 rounded-lg p-3">
            <div className="text-sm font-bold text-purple-600 capitalize">
              {Object.entries(data.waterTypePreference).reduce((a, b) => 
                data.waterTypePreference[a[0]] > data.waterTypePreference[b[0]] ? a : b, ['unknown', 0]
              )[0]}
            </div>
            <div className="text-xs text-purple-700">Preferred water type</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default UserBehaviorAnalytics;