import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { format, parseISO } from 'date-fns';

const { FiTrendingUp, FiTrendingDown, FiMinus, FiTarget, FiActivity, FiArrowUp, FiArrowDown } = FiIcons;

const CalculationTrends = ({ data }) => {
  const getTrendIcon = (growthRate) => {
    if (growthRate > 5) return FiTrendingUp;
    if (growthRate < -5) return FiTrendingDown;
    return FiMinus;
  };

  const getTrendColor = (growthRate) => {
    if (growthRate > 5) return 'text-green-600';
    if (growthRate < -5) return 'text-red-600';
    return 'text-gray-600';
  };

  const getTrendBackground = (growthRate) => {
    if (growthRate > 5) return 'bg-green-50';
    if (growthRate < -5) return 'bg-red-50';
    return 'bg-gray-50';
  };

  const calculateWeightTrend = () => {
    if (data.weightTrends.length < 2) return { trend: 'stable', change: 0 };
    
    const recent = data.weightTrends.slice(-3);
    const earlier = data.weightTrends.slice(-6, -3);
    
    if (recent.length === 0 || earlier.length === 0) return { trend: 'stable', change: 0 };
    
    const recentAvg = recent.reduce((sum, item) => sum + item.weight, 0) / recent.length;
    const earlierAvg = earlier.reduce((sum, item) => sum + item.weight, 0) / earlier.length;
    
    const change = recentAvg - earlierAvg;
    const percentChange = earlierAvg > 0 ? (change / earlierAvg) * 100 : 0;
    
    return {
      trend: Math.abs(percentChange) < 2 ? 'stable' : (percentChange > 0 ? 'increasing' : 'decreasing'),
      change: Math.abs(change),
      percentChange: Math.abs(percentChange)
    };
  };

  const calculateDepthTrend = () => {
    if (data.depthTrends.length < 2) return { trend: 'stable', change: 0 };
    
    const recent = data.depthTrends.slice(-3);
    const earlier = data.depthTrends.slice(-6, -3);
    
    if (recent.length === 0 || earlier.length === 0) return { trend: 'stable', change: 0 };
    
    const recentAvg = recent.reduce((sum, item) => sum + item.targetDepth, 0) / recent.length;
    const earlierAvg = earlier.reduce((sum, item) => sum + item.targetDepth, 0) / earlier.length;
    
    const change = recentAvg - earlierAvg;
    
    return {
      trend: Math.abs(change) < 1 ? 'stable' : (change > 0 ? 'increasing' : 'decreasing'),
      change: Math.abs(change)
    };
  };

  const weightTrend = calculateWeightTrend();
  const depthTrend = calculateDepthTrend();

  const recentCalculations = data.dailyCalculations.slice(-7);
  const averageDaily = recentCalculations.length > 0 ? 
    recentCalculations.reduce((sum, day) => sum + day.count, 0) / recentCalculations.length : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-6"
    >
      <div className="flex items-center mb-6">
        <SafeIcon icon={FiTrendingUp} className="text-xl text-blue-600 mr-3" />
        <h3 className="text-xl font-semibold text-gray-900">Calculation Trends</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Usage Growth */}
        <div className={`rounded-lg p-4 ${getTrendBackground(data.growthRate)}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Usage Growth</span>
            <SafeIcon 
              icon={getTrendIcon(data.growthRate)} 
              className={`text-lg ${getTrendColor(data.growthRate)}`} 
            />
          </div>
          <div className={`text-2xl font-bold ${getTrendColor(data.growthRate)}`}>
            {data.growthRate > 0 ? '+' : ''}{data.growthRate}%
          </div>
          <div className="text-xs text-gray-600">vs previous period</div>
        </div>

        {/* Weight Trend */}
        <div className={`rounded-lg p-4 ${
          weightTrend.trend === 'increasing' ? 'bg-orange-50' :
          weightTrend.trend === 'decreasing' ? 'bg-blue-50' :
          'bg-gray-50'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Weight Trend</span>
            <SafeIcon 
              icon={
                weightTrend.trend === 'increasing' ? FiArrowUp :
                weightTrend.trend === 'decreasing' ? FiArrowDown :
                FiMinus
              } 
              className={`text-lg ${
                weightTrend.trend === 'increasing' ? 'text-orange-600' :
                weightTrend.trend === 'decreasing' ? 'text-blue-600' :
                'text-gray-600'
              }`} 
            />
          </div>
          <div className={`text-lg font-bold ${
            weightTrend.trend === 'increasing' ? 'text-orange-600' :
            weightTrend.trend === 'decreasing' ? 'text-blue-600' :
            'text-gray-600'
          }`}>
            {weightTrend.trend === 'stable' ? 'Stable' : 
             `±${weightTrend.change.toFixed(1)}kg`}
          </div>
          <div className="text-xs text-gray-600 capitalize">{weightTrend.trend}</div>
        </div>

        {/* Depth Trend */}
        <div className={`rounded-lg p-4 ${
          depthTrend.trend === 'increasing' ? 'bg-green-50' :
          depthTrend.trend === 'decreasing' ? 'bg-red-50' :
          'bg-gray-50'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Target Depth</span>
            <SafeIcon 
              icon={
                depthTrend.trend === 'increasing' ? FiArrowUp :
                depthTrend.trend === 'decreasing' ? FiArrowDown :
                FiMinus
              } 
              className={`text-lg ${
                depthTrend.trend === 'increasing' ? 'text-green-600' :
                depthTrend.trend === 'decreasing' ? 'text-red-600' :
                'text-gray-600'
              }`} 
            />
          </div>
          <div className={`text-lg font-bold ${
            depthTrend.trend === 'increasing' ? 'text-green-600' :
            depthTrend.trend === 'decreasing' ? 'text-red-600' :
            'text-gray-600'
          }`}>
            {depthTrend.trend === 'stable' ? 'Stable' : 
             `±${depthTrend.change.toFixed(1)}m`}
          </div>
          <div className="text-xs text-gray-600 capitalize">{depthTrend.trend}</div>
        </div>
      </div>

      {/* Daily Activity Chart */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-900 mb-3 flex items-center">
          <SafeIcon icon={FiActivity} className="mr-2 text-blue-600" />
          Daily Activity (Last 7 Days)
        </h4>
        
        <div className="flex items-end space-x-2 h-32">
          {recentCalculations.map((day, index) => {
            const maxCount = Math.max(...recentCalculations.map(d => d.count));
            const height = maxCount > 0 ? (day.count / maxCount) * 100 : 0;
            
            return (
              <div key={day.date} className="flex-1 flex flex-col items-center">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${height}%` }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="w-full bg-blue-500 rounded-t min-h-[4px] relative group"
                  style={{ maxHeight: '100px' }}
                >
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                    {day.count} calculations
                  </div>
                </motion.div>
                <div className="text-xs text-gray-600 mt-2 text-center">
                  {format(new Date(day.date), 'MMM dd')}
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-4 text-sm text-gray-600 text-center">
          Average: {averageDaily.toFixed(1)} calculations per day
        </div>
      </div>

      {/* Weight vs Neutral Depth Correlation */}
      {data.weightTrends.length > 0 && (
        <div>
          <h4 className="font-medium text-gray-900 mb-3 flex items-center">
            <SafeIcon icon={FiTarget} className="mr-2 text-purple-600" />
            Weight vs Neutral Depth Correlation
          </h4>
          
          <div className="relative h-40 bg-gray-50 rounded-lg p-4">
            <svg className="w-full h-full" viewBox="0 0 300 120">
              {/* Grid */}
              {[0, 30, 60, 90, 120].map(y => (
                <line
                  key={y}
                  x1="0"
                  y1={y}
                  x2="300"
                  y2={y}
                  stroke="#e5e7eb"
                  strokeWidth="1"
                />
              ))}
              
              {/* Data points */}
              {data.weightTrends.slice(-10).map((point, index) => {
                const x = (index / Math.max(1, data.weightTrends.slice(-10).length - 1)) * 280 + 10;
                const weightY = 120 - (point.weight / Math.max(...data.weightTrends.map(p => p.weight))) * 100;
                const depthY = 120 - (point.neutralDepth / Math.max(...data.weightTrends.map(p => p.neutralDepth || 0))) * 100;
                
                return (
                  <g key={index}>
                    {/* Weight point */}
                    <motion.circle
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      cx={x}
                      cy={weightY}
                      r="3"
                      fill="#3b82f6"
                    />
                    
                    {/* Depth point */}
                    <motion.circle
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
                      cx={x}
                      cy={depthY}
                      r="3"
                      fill="#10b981"
                    />
                    
                    {/* Connection line */}
                    <motion.line
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.3 }}
                      transition={{ duration: 0.5, delay: index * 0.1 + 0.4 }}
                      x1={x}
                      y1={weightY}
                      x2={x}
                      y2={depthY}
                      stroke="#6b7280"
                      strokeWidth="1"
                      strokeDasharray="2,2"
                    />
                  </g>
                );
              })}
            </svg>
            
            {/* Legend */}
            <div className="absolute top-2 right-2 space-y-1">
              <div className="flex items-center text-xs">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-1"></div>
                <span>Weight (kg)</span>
              </div>
              <div className="flex items-center text-xs">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
                <span>Neutral Depth (m)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Trend Insights */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h5 className="font-medium text-blue-900 mb-2">Trend Insights</h5>
        <div className="space-y-1 text-sm text-blue-800">
          {data.growthRate > 10 && (
            <p>• High usage growth indicates increased engagement with the calculator</p>
          )}
          {weightTrend.trend === 'increasing' && (
            <p>• Weight recommendations are trending upward - consider equipment or technique changes</p>
          )}
          {weightTrend.trend === 'decreasing' && (
            <p>• Weight recommendations are trending downward - possible improvement in buoyancy control</p>
          )}
          {depthTrend.trend === 'increasing' && (
            <p>• Target depths are increasing - progressing to deeper dives</p>
          )}
          {averageDaily > 2 && (
            <p>• High daily usage suggests active training or frequent adjustments needed</p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default CalculationTrends;