import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiBarChart3, FiTrendingUp, FiPieChart, FiActivity } = FiIcons;

const AnalyticsCharts = ({ data, timeRange }) => {
  const renderBarChart = (chartData, title, color = 'blue') => {
    const maxValue = Math.max(...chartData.map(d => d.count || d.value || 0));
    
    return (
      <div className="bg-white rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-3">{title}</h4>
        <div className="space-y-2">
          {chartData.slice(0, 5).map((item, index) => (
            <div key={index} className="flex items-center">
              <div className="w-24 text-sm text-gray-600 truncate">
                {item.label || item.date || item.name}
              </div>
              <div className="flex-1 mx-3">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${((item.count || item.value || 0) / maxValue) * 100}%` }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    className={`bg-${color}-500 h-2 rounded-full`}
                  />
                </div>
              </div>
              <div className="w-12 text-sm text-gray-900 text-right">
                {item.count || item.value || 0}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderLineChart = (chartData, title, color = 'blue') => {
    const maxValue = Math.max(...chartData.map(d => d.weight || d.count || 0));
    const minValue = Math.min(...chartData.map(d => d.weight || d.count || 0));
    const range = maxValue - minValue || 1;

    return (
      <div className="bg-white rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-3">{title}</h4>
        <div className="relative h-32">
          <svg className="w-full h-full" viewBox="0 0 300 100">
            {/* Grid lines */}
            {[0, 25, 50, 75, 100].map(y => (
              <line
                key={y}
                x1="0"
                y1={y}
                x2="300"
                y2={y}
                stroke="#f3f4f6"
                strokeWidth="1"
              />
            ))}
            
            {/* Data line */}
            {chartData.length > 1 && (
              <motion.polyline
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5 }}
                fill="none"
                stroke={`rgb(59 130 246)`} // blue-500
                strokeWidth="2"
                points={chartData.map((point, index) => {
                  const x = (index / (chartData.length - 1)) * 300;
                  const y = 100 - (((point.weight || point.count || 0) - minValue) / range) * 100;
                  return `${x},${y}`;
                }).join(' ')}
              />
            )}
            
            {/* Data points */}
            {chartData.map((point, index) => {
              const x = (index / (chartData.length - 1)) * 300;
              const y = 100 - (((point.weight || point.count || 0) - minValue) / range) * 100;
              return (
                <motion.circle
                  key={index}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  cx={x}
                  cy={y}
                  r="3"
                  fill={`rgb(59 130 246)`} // blue-500
                />
              );
            })}
          </svg>
          
          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500 -ml-8">
            <span>{maxValue.toFixed(1)}</span>
            <span>{((maxValue + minValue) / 2).toFixed(1)}</span>
            <span>{minValue.toFixed(1)}</span>
          </div>
        </div>
      </div>
    );
  };

  const renderPieChart = (chartData, title) => {
    const total = Object.values(chartData).reduce((sum, value) => sum + value, 0);
    let currentAngle = 0;
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

    return (
      <div className="bg-white rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-3">{title}</h4>
        <div className="flex items-center">
          <div className="relative w-32 h-32">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              {Object.entries(chartData).map(([key, value], index) => {
                const percentage = (value / total) * 100;
                const angle = (value / total) * 360;
                const startAngle = currentAngle;
                const endAngle = currentAngle + angle;
                currentAngle += angle;

                const startAngleRad = (startAngle * Math.PI) / 180;
                const endAngleRad = (endAngle * Math.PI) / 180;

                const largeArcFlag = angle > 180 ? 1 : 0;
                const x1 = 50 + 40 * Math.cos(startAngleRad);
                const y1 = 50 + 40 * Math.sin(startAngleRad);
                const x2 = 50 + 40 * Math.cos(endAngleRad);
                const y2 = 50 + 40 * Math.sin(endAngleRad);

                const pathData = [
                  `M 50 50`,
                  `L ${x1} ${y1}`,
                  `A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                  'Z'
                ].join(' ');

                return (
                  <motion.path
                    key={key}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    d={pathData}
                    fill={colors[index % colors.length]}
                  />
                );
              })}
            </svg>
          </div>
          
          <div className="ml-4 space-y-1">
            {Object.entries(chartData).map(([key, value], index) => (
              <div key={key} className="flex items-center text-sm">
                <div
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: colors[index % colors.length] }}
                />
                <span className="text-gray-600 capitalize">{key}</span>
                <span className="ml-auto font-medium">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Daily Calculations Trend */}
      {data.trends.dailyCalculations.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {renderLineChart(
            data.trends.dailyCalculations.slice(-14), // Last 14 days
            `Daily Calculations (${timeRange})`
          )}
        </motion.div>
      )}

      {/* Weight Trends */}
      {data.trends.weightTrends.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {renderLineChart(
            data.trends.weightTrends,
            'Weight Recommendation Trends',
            'green'
          )}
        </motion.div>
      )}

      {/* Gender Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {renderPieChart(data.userBehavior.genderDistribution, 'Gender Distribution')}
      </motion.div>

      {/* Body Type Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        {renderBarChart(
          Object.entries(data.userBehavior.bodyTypeDistribution).map(([key, value]) => ({
            label: key,
            count: value
          })),
          'Body Type Distribution',
          'purple'
        )}
      </motion.div>

      {/* Wetsuit Usage */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        {renderBarChart(
          Object.entries(data.userBehavior.wetsuitUsage).map(([key, value]) => ({
            label: key,
            count: value
          })),
          'Wetsuit Thickness Usage',
          'orange'
        )}
      </motion.div>

      {/* Water Type Preference */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        {renderPieChart(data.userBehavior.waterTypePreference, 'Water Type Preference')}
      </motion.div>
    </div>
  );
};

export default AnalyticsCharts;