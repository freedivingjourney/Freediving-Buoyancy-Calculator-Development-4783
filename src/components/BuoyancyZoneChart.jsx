import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiTarget, FiUser, FiActivity, FiTrendingUp, FiInfo } = FiIcons;

const BuoyancyZoneChart = ({ results }) => {
  if (!results || !results.buoyancyZones) return null;

  const { zones, diverPositions, neutralDepthMarkers, maxDepth, waterType } = results.buoyancyZones;

  // Chart dimensions
  const chartHeight = 400;
  const chartWidth = 100; // percentage
  const depthScale = chartHeight / maxDepth;

  const getBuoyancyIcon = (status) => {
    switch (status) {
      case 'positive': return '↑';
      case 'neutral': return '○';
      case 'negative': return '↓';
      default: return '○';
    }
  };

  const getBuoyancyColor = (status) => {
    switch (status) {
      case 'positive': return '#ef4444'; // red-500
      case 'neutral': return '#22c55e'; // green-500
      case 'negative': return '#3b82f6'; // blue-500
      default: return '#6b7280'; // gray-500
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-xl shadow-lg p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <SafeIcon icon={FiActivity} className="text-xl text-blue-600 mr-3" />
          <h3 className="text-xl font-semibold text-gray-900">Buoyancy Zones Visualization</h3>
        </div>
        <div className="text-sm text-gray-600 capitalize">
          {waterType} environment
        </div>
      </div>

      {/* Chart Container */}
      <div className="relative bg-gradient-to-b from-blue-100 to-blue-300 rounded-lg p-4 mb-6">
        <div 
          className="relative mx-auto bg-white rounded-lg shadow-inner overflow-hidden"
          style={{ width: '80%', height: `${chartHeight}px` }}
        >
          {/* Depth Scale */}
          <div className="absolute left-0 top-0 h-full w-12 bg-gray-50 border-r border-gray-200">
            {Array.from({ length: Math.ceil(maxDepth / 5) + 1 }, (_, i) => i * 5).map(depth => (
              <div
                key={depth}
                className="absolute left-0 w-full border-t border-gray-300 text-xs text-gray-600 pl-1"
                style={{ top: `${(depth * depthScale)}px` }}
              >
                {depth}m
              </div>
            ))}
          </div>

          {/* Buoyancy Zones */}
          <div className="absolute left-12 top-0 right-0 h-full">
            {zones.map((zone, index) => {
              const zoneTop = Math.max(0, zone.range[0] * depthScale);
              const zoneBottom = Math.min(chartHeight, zone.range[1] * depthScale);
              const zoneHeight = zoneBottom - zoneTop;

              if (zoneHeight <= 0) return null;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scaleY: 0 }}
                  animate={{ opacity: 0.7, scaleY: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="absolute left-0 right-0 border border-gray-200"
                  style={{
                    top: `${zoneTop}px`,
                    height: `${zoneHeight}px`,
                    backgroundColor: zone.color,
                  }}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-white text-xs font-medium text-center px-2 py-1 bg-black bg-opacity-30 rounded">
                      {zone.name}
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {/* Neutral Depth Markers */}
            {neutralDepthMarkers.map((marker, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.2 }}
                className="absolute left-0 right-0 flex items-center"
                style={{ top: `${marker.depth * depthScale}px` }}
              >
                <div
                  className={`w-full h-1 ${marker.isActive ? 'border-2 border-dashed' : 'border border-dashed'}`}
                  style={{ borderColor: marker.color }}
                />
                <div
                  className={`absolute right-2 px-2 py-1 rounded text-xs font-medium text-white`}
                  style={{ backgroundColor: marker.color }}
                >
                  {marker.label}: {marker.depth}m
                </div>
              </motion.div>
            ))}

            {/* Diver Position Markers */}
            {diverPositions.map((position, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 + index * 0.2 }}
                className="absolute flex items-center"
                style={{ 
                  top: `${position.depth * depthScale}px`,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  zIndex: 10
                }}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold shadow-lg ${
                    position.isTarget ? 'ring-4 ring-yellow-300' : ''
                  }`}
                  style={{ backgroundColor: getBuoyancyColor(position.status) }}
                >
                  {getBuoyancyIcon(position.status)}
                </div>
                <div className="ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap">
                  {position.label}
                  <br />
                  <span className="capitalize">{position.status}</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Surface Water Line */}
          <div className="absolute left-12 right-0 top-0 h-1 bg-blue-500 flex items-center">
            <div className="absolute right-2 text-xs text-blue-600 font-medium">
              Surface
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Buoyancy Zones Legend */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
            <SafeIcon icon={FiTarget} className="mr-2 text-blue-600" />
            Buoyancy Zones
          </h4>
          <div className="space-y-2">
            {zones.map((zone, index) => (
              <div key={index} className="flex items-center text-sm">
                <div
                  className="w-4 h-4 rounded mr-2 border"
                  style={{ backgroundColor: zone.color }}
                />
                <div>
                  <span className="font-medium">{zone.name}</span>
                  <span className="text-gray-600 ml-2">
                    ({zone.range[0]}-{zone.range[1]}m)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Markers Legend */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
            <SafeIcon icon={FiUser} className="mr-2 text-blue-600" />
            Your Position
          </h4>
          <div className="space-y-2">
            {diverPositions.map((position, index) => (
              <div key={index} className="flex items-center text-sm">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold mr-2 ${
                    position.isTarget ? 'ring-2 ring-yellow-300' : ''
                  }`}
                  style={{ backgroundColor: getBuoyancyColor(position.status) }}
                >
                  {getBuoyancyIcon(position.status)}
                </div>
                <div>
                  <span className="font-medium">{position.label}</span>
                  <span className="text-gray-600 ml-2 capitalize">
                    ({position.status})
                  </span>
                </div>
              </div>
            ))}
            
            {/* Neutral Depth Markers */}
            <div className="mt-3 pt-3 border-t border-gray-200">
              <h5 className="font-medium text-gray-700 mb-2">Neutral Depths</h5>
              {neutralDepthMarkers.map((marker, index) => (
                <div key={index} className="flex items-center text-sm">
                  <div
                    className="w-4 h-1 mr-2 border-dashed border-2"
                    style={{ borderColor: marker.color }}
                  />
                  <div>
                    <span className={`font-medium ${marker.isActive ? 'text-purple-700' : 'text-gray-600'}`}>
                      {marker.label}
                    </span>
                    <span className="text-gray-600 ml-2">
                      {marker.depth}m
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Insights */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-center mb-2">
          <SafeIcon icon={FiTrendingUp} className="text-blue-600 mr-2" />
          <h5 className="font-medium text-blue-900">Model Comparison Insights</h5>
        </div>
        <div className="text-sm text-blue-800 space-y-1">
          <p>
            <strong>Empirical Model:</strong> {results.expectedNeutralDepth}m neutral depth 
            (used for results and recommendations)
          </p>
          <p>
            <strong>Theoretical Physics:</strong> {results.theoreticalPhysics.neutralDepth}m neutral depth 
            (physics calculation for comparison)
          </p>
          <p className="text-xs text-blue-600 mt-2">
            The empirical model incorporates real-world freediving experience and is used for all calculations and safety recommendations.
          </p>
        </div>
      </div>

      {/* Advanced Settings Indicator */}
      {results.isUsingAdvancedSettings && (
        <div className="mt-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
          <div className="flex items-center">
            <SafeIcon icon={FiInfo} className="text-purple-600 mr-2" />
            <div className="text-sm">
              <span className="font-medium text-purple-900">Advanced Configuration Active</span>
              <p className="text-purple-700 mt-1">
                Visualization includes enhanced calibration for 
                {results.useCustomNeutralDepth ? ' custom depth targets' : ''}
                {results.useCustomNeutralDepth && results.useDeepDivingOptimization ? ' and' : ''}
                {results.useDeepDivingOptimization ? ' deep diving profiles' : ''}
              </p>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default BuoyancyZoneChart;