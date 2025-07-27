import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiArrowUp, FiMinus, FiArrowDown, FiAnchor, FiActivity, FiTarget, FiCheckCircle, FiAlertTriangle } = FiIcons;

const BuoyancyGauge = ({ results }) => {
  if (!results) return null;

  const getBuoyancyIcon = (status) => {
    switch (status) {
      case 'positive': return FiArrowUp;
      case 'neutral': return FiMinus;
      case 'negative': return FiArrowDown;
      default: return FiMinus;
    }
  };

  const getBuoyancyColor = (status) => {
    switch (status) {
      case 'positive': return 'text-red-500';
      case 'neutral': return 'text-green-500';
      case 'negative': return 'text-blue-500';
      default: return 'text-gray-500';
    }
  };

  const getBuoyancyBg = (status) => {
    switch (status) {
      case 'positive': return 'bg-red-50 border-red-200';
      case 'neutral': return 'bg-green-50 border-green-200';
      case 'negative': return 'bg-blue-50 border-blue-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  // FIXED: Use empirical buoyancy status instead of theoretical physics value
  const getEmpiricalGaugePosition = (surfaceBuoyancy, expectedNeutralDepth, targetRange) => {
    // Base the gauge position on empirical data rather than theoretical physics
    
    if (surfaceBuoyancy === 'negative') {
      return 15; // Far left (negative zone)
    }
    
    if (surfaceBuoyancy === 'neutral') {
      return 50; // Center (neutral zone)
    }
    
    // For positive buoyancy, position based on how far from target neutral depth
    if (surfaceBuoyancy === 'positive') {
      if (expectedNeutralDepth <= 0) {
        return 10; // Very negative (surface negative)
      }
      
      // Calculate position based on expected neutral depth vs target range
      const targetOptimal = targetRange.optimal;
      const targetMin = targetRange.min;
      const targetMax = targetRange.max;
      
      if (expectedNeutralDepth < targetMin) {
        // Too shallow neutral depth = needs more weight = more positive at surface
        return 85; // High positive
      } else if (expectedNeutralDepth > targetMax) {
        // Too deep neutral depth = too much weight = less positive at surface
        return 65; // Moderate positive
      } else {
        // Within target range = optimal positive buoyancy at surface
        return 75; // Optimal positive
      }
    }
    
    return 50; // Default to center
  };

  // FIXED: Use empirical positioning instead of theoretical physics
  const gaugePosition = getEmpiricalGaugePosition(
    results.surfaceBuoyancy, 
    results.expectedNeutralDepth, 
    results.targetNeutralDepth
  );

  // Get buoyancy description based on empirical status
  const getBuoyancyDescription = (status, expectedNeutralDepth, targetRange) => {
    if (status === 'negative') {
      return 'Surface negative - Safety risk';
    }
    
    if (status === 'neutral') {
      return 'Neutral at surface - Rare condition';
    }
    
    // For positive buoyancy, be more specific
    if (expectedNeutralDepth <= 0) {
      return 'Too much weight - Will sink at surface';
    }
    
    if (expectedNeutralDepth < targetRange.min) {
      return 'Slightly underweighted - May struggle to reach depth';
    }
    
    if (expectedNeutralDepth > targetRange.max) {
      return 'Slightly overweighted - Good for deep diving';
    }
    
    return 'Optimal surface buoyancy for freediving';
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-xl shadow-lg p-6"
    >
      <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">
        Buoyancy Status
      </h3>

      {/* FIXED: Empirical Gauge Visual */}
      <div className="relative mb-8">
        <div className="h-4 bg-gradient-to-r from-blue-500 via-green-500 to-red-500 rounded-full relative overflow-hidden">
          <motion.div
            initial={{ x: '50%' }}
            animate={{ x: `${gaugePosition}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="absolute top-0 w-1 h-full bg-white border-2 border-gray-800 transform -translate-x-1/2"
            style={{ left: `${gaugePosition}%` }}
          />
        </div>
        {/* Gauge Labels */}
        <div className="flex justify-between text-xs text-gray-600 mt-2">
          <span>Negative</span>
          <span>Neutral</span>
          <span>Positive</span>
        </div>
      </div>

      {/* FIXED: Status Display using empirical data */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className={`text-center p-6 rounded-xl border-2 ${getBuoyancyBg(results.surfaceBuoyancy)}`}
      >
        <SafeIcon
          icon={getBuoyancyIcon(results.surfaceBuoyancy)}
          className={`text-4xl mx-auto mb-3 ${getBuoyancyColor(results.surfaceBuoyancy)}`}
        />
        <h4 className="text-xl font-bold text-gray-900 mb-2 capitalize">
          {results.surfaceBuoyancy} Buoyancy
        </h4>
        <p className="text-sm text-gray-600 mb-4">
          {getBuoyancyDescription(results.surfaceBuoyancy, results.expectedNeutralDepth, results.targetNeutralDepth)}
        </p>

        {/* Buoyancy Zones */}
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="bg-blue-100 text-blue-800 p-2 rounded">
            <div className="font-medium">Negative</div>
            <div>Sinks easily</div>
          </div>
          <div className="bg-green-100 text-green-800 p-2 rounded">
            <div className="font-medium">Neutral</div>
            <div>Eye level float</div>
          </div>
          <div className="bg-red-100 text-red-800 p-2 rounded">
            <div className="font-medium">Positive</div>
            <div>Floats high</div>
          </div>
        </div>
      </motion.div>

      {/* Target Neutral Depth Range - EMPHASIZED */}
      <div className="mt-6 p-4 bg-green-50 border-2 border-green-200 rounded-lg">
        <div className="flex items-center mb-2">
          <SafeIcon icon={FiTarget} className="text-green-600 mr-2" />
          <h5 className="font-medium text-green-900">Target Neutral Buoyancy Depth</h5>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between items-center">
            <span>Target range ({results.waterType}):</span>
            <span className="font-bold text-green-700">
              {results.targetNeutralDepth.min}-{results.targetNeutralDepth.max}m
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span>Optimal depth:</span>
            <span className="font-bold text-green-700">
              {results.targetNeutralDepth.optimal}m
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span>Your expected neutral depth:</span>
            <div className="flex items-center">
              <span className={`font-medium ${results.isWithinTargetRange ? 'text-green-700' : 'text-amber-700'}`}>
                {results.expectedNeutralDepth > 0 ? `${results.expectedNeutralDepth}m` : 'Surface negative'}
              </span>
              <SafeIcon
                icon={results.isWithinTargetRange ? FiCheckCircle : FiAlertTriangle}
                className={`ml-2 ${results.isWithinTargetRange ? 'text-green-600' : 'text-amber-600'}`}
              />
            </div>
          </div>
        </div>
        <div className={`mt-3 p-2 rounded text-xs ${results.isWithinTargetRange ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
          {results.isWithinTargetRange 
            ? '✓ Your neutral depth is within the optimal range for freediving'
            : '⚠ Consider adjusting ballast weight to achieve target neutral depth range'
          }
        </div>
      </div>

      {/* Baseline Ballast Weight Information */}
      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-center mb-2">
          <SafeIcon icon={FiAnchor} className="text-blue-600 mr-2" />
          <h5 className="font-medium text-gray-900">Baseline Ballast Weight</h5>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Wetsuit baseline (1kg per 1mm):</span>
            <span className="font-medium text-blue-700">
              {results.baselineBallastWeight.toFixed(1)}kg
            </span>
          </div>
          <div className="flex justify-between">
            <span>Adjusted recommendation:</span>
            <span className="font-medium text-blue-700">
              {results.ballastRecommendations.adjusted.toFixed(1)}kg
            </span>
          </div>
          <div className="flex justify-between">
            <span>Your current total weight:</span>
            <span className="font-medium text-blue-700">
              {results.currentTotalWeight.toFixed(1)}kg
            </span>
          </div>
        </div>
      </div>

      {/* FIXED: Depth Analysis using empirical status */}
      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-center mb-2">
          <SafeIcon icon={FiAnchor} className="text-blue-600 mr-2" />
          <h5 className="font-medium text-gray-900">Depth Analysis</h5>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>At {results.targetDepth}m:</span>
            <span className={`font-medium ${getBuoyancyColor(results.depthBuoyancy)}`}>
              {results.depthBuoyancy.charAt(0).toUpperCase() + results.depthBuoyancy.slice(1)}
            </span>
          </div>
          <div className="text-xs text-gray-600 mt-2">
            {results.depthBuoyancy === 'positive' && results.targetDepth > results.expectedNeutralDepth 
              ? `Still floating at ${results.targetDepth}m. Neutral depth expected at ${results.expectedNeutralDepth}m.`
              : results.depthBuoyancy === 'negative' && results.targetDepth < results.expectedNeutralDepth
              ? `Already sinking at ${results.targetDepth}m. Neutral depth expected at ${results.expectedNeutralDepth}m.`
              : `Buoyancy status is appropriate for ${results.targetDepth}m depth.`
            }
          </div>
        </div>
      </div>

      {/* Physics Data - Updated with empirical context */}
      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center mb-2">
          <SafeIcon icon={FiActivity} className="text-gray-600 mr-2" />
          <h5 className="font-medium text-gray-900">Physics Data</h5>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex justify-between">
            <span>Theoretical Force:</span>
            <span className="font-medium">{results.buoyancyForceN.toFixed(1)} N</span>
          </div>
          <div className="flex justify-between">
            <span>Body Density:</span>
            <span className="font-medium">{results.bodyDensity.toFixed(0)} kg/m³</span>
          </div>
        </div>
        <div className="mt-2 text-xs text-gray-500 italic">
          Note: Gauge position is based on empirical freediving data, not theoretical physics calculations.
        </div>
      </div>

      {/* Empirical Calibration Information - NEW */}
      <div className="mt-4 p-4 bg-green-50 rounded-lg">
        <div className="flex items-center mb-2">
          <SafeIcon icon={FiCheckCircle} className="text-green-600 mr-2" />
          <h5 className="font-medium text-green-900">Empirical Calibration</h5>
        </div>
        <div className="text-sm text-green-800 space-y-1">
          <p>This gauge is calibrated using real-world freediving data:</p>
          <ul className="text-xs mt-1 space-y-0.5">
            <li>• 72kg male with 2mm wetsuit and 2kg weight = 11m neutral depth</li>
            <li>• Surface buoyancy: Positive (safe for freediving)</li>
            <li>• Target range: 10-12m saltwater, 5-7m freshwater</li>
            <li>• Gauge position based on expected neutral depth vs target range</li>
          </ul>
        </div>
      </div>

      {/* Wetsuit Information */}
      <div className="mt-4 p-4 bg-amber-50 rounded-lg">
        <h5 className="font-medium text-amber-900 mb-2">Wetsuit Effect</h5>
        <div className="text-sm text-amber-800">
          <p>Your {results.wetsuitThickness}mm wetsuit adds ~{results.wetsuitBuoyancy.toFixed(1)}kg buoyancy</p>
          <p className="mt-1 text-xs">Baseline rule: 1mm = 1kg (2.2lbs) of buoyancy</p>
        </div>
      </div>

      {/* Enhanced Disclaimer */}
      <div className="mt-4 text-xs text-gray-500 italic border-t pt-3">
        <p className="font-medium mb-1">Important Safety Note:</p>
        <p>{results.disclaimer}</p>
        <p className="mt-1">
          <strong>Empirical Calibration:</strong> This gauge uses real-world freediving data instead of theoretical physics for more accurate buoyancy assessment.
        </p>
      </div>
    </motion.div>
  );
};

export default BuoyancyGauge;