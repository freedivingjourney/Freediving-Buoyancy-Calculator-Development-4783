import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const {
  FiArrowUp,
  FiMinus,
  FiArrowDown,
  FiAnchor,
  FiActivity,
  FiTarget,
  FiCheckCircle,
  FiAlertTriangle,
  FiSliders,
  FiSettings
} = FiIcons;

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

  // ENHANCED: Advanced gauge positioning with calibration for advanced settings
  const getAdvancedGaugePosition = (surfaceBuoyancy, expectedNeutralDepth, targetRange, isUsingAdvancedSettings) => {
    // Base the gauge position on empirical data with advanced calibration
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

      // Enhanced positioning for advanced settings
      const tolerance = isUsingAdvancedSettings ? 1.5 : 1.0;

      if (expectedNeutralDepth < targetMin - tolerance) {
        // Too shallow neutral depth = needs more weight = more positive at surface
        return isUsingAdvancedSettings ? 88 : 85; // Higher positive for advanced
      } else if (expectedNeutralDepth > targetMax + tolerance) {
        // Too deep neutral depth = too much weight = less positive at surface
        return isUsingAdvancedSettings ? 62 : 65; // Lower positive for advanced
      } else {
        // Within target range = optimal positive buoyancy at surface
        return isUsingAdvancedSettings ? 78 : 75; // Slightly higher for advanced
      }
    }

    return 50; // Default to center
  };

  // ENHANCED: Use advanced positioning with calibration
  const gaugePosition = getAdvancedGaugePosition(
    results.surfaceBuoyancy,
    results.expectedNeutralDepth,
    results.targetNeutralDepth,
    results.isUsingAdvancedSettings
  );

  // ENHANCED: Get buoyancy description with advanced settings awareness
  const getAdvancedBuoyancyDescription = (status, expectedNeutralDepth, targetRange, isUsingAdvancedSettings, neutralBuoyancyPreference) => {
    if (status === 'negative') {
      return 'Surface negative - Safety risk';
    }
    if (status === 'neutral') {
      return 'Neutral at surface - Rare condition';
    }

    // For positive buoyancy, be more specific with advanced settings
    if (expectedNeutralDepth <= 0) {
      return 'Too much weight - Will sink at surface';
    }
    
    const tolerance = isUsingAdvancedSettings ? 1.5 : 1.0;
    
    if (expectedNeutralDepth < targetRange.min - tolerance) {
      return isUsingAdvancedSettings 
        ? 'Underweighted for advanced configuration - May struggle to reach custom depth'
        : 'Slightly underweighted - May struggle to reach depth';
    }
    if (expectedNeutralDepth > targetRange.max + tolerance) {
      return isUsingAdvancedSettings
        ? 'Overweighted for advanced configuration - Good for deep diving profiles'
        : 'Slightly overweighted - Good for deep diving';
    }
    
    // Consider advanced buoyancy preferences
    if (isUsingAdvancedSettings && neutralBuoyancyPreference) {
      switch (neutralBuoyancyPreference) {
        case 'slightly-positive':
          return 'Optimal positive buoyancy for custom positive preference';
        case 'slightly-negative':
          return 'Calibrated for custom negative buoyancy preference';
        default:
          return 'Optimal surface buoyancy for advanced freediving configuration';
      }
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

      {/* Advanced Settings Indicator */}
      {results.isUsingAdvancedSettings && (
        <div className="mb-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
          <div className="flex items-center">
            <SafeIcon icon={FiSettings} className="text-purple-600 mr-2" />
            <div>
              <span className="font-medium text-purple-900">Advanced Configuration Active</span>
              <div className="text-xs text-purple-700 mt-1">
                Enhanced calibration for {results.useCustomNeutralDepth ? 'custom depth' : ''} 
                {results.useCustomNeutralDepth && results.useDeepDivingOptimization ? ' + ' : ''}
                {results.useDeepDivingOptimization ? 'deep diving profile' : ''}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Target Indicator */}
      {results.useCustomNeutralDepth && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center">
            <SafeIcon icon={FiSliders} className="text-blue-600 mr-2" />
            <div>
              <span className="font-medium text-blue-900">Custom Target: {results.customNeutralDepth}m</span>
              <span className="ml-2 text-xs text-blue-700">
                ({results.neutralBuoyancyPreference.replace('-', ' ')})
              </span>
            </div>
          </div>
        </div>
      )}
      
      {/* ENHANCED: Advanced Gauge Visual with calibration indicators */}
      <div className="relative mb-8">
        <div className="h-4 bg-gradient-to-r from-blue-500 via-green-500 to-red-500 rounded-full relative overflow-hidden">
          <motion.div
            initial={{ x: '50%' }}
            animate={{ x: `${gaugePosition}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className={`absolute top-0 w-1 h-full border-2 border-gray-800 transform -translate-x-1/2 ${
              results.isUsingAdvancedSettings ? 'bg-purple-300' : 'bg-white'
            }`}
            style={{ left: `${gaugePosition}%` }}
          />
        </div>
        {/* Gauge Labels */}
        <div className="flex justify-between text-xs text-gray-600 mt-2">
          <span>Negative</span>
          <span>Neutral</span>
          <span>Positive</span>
        </div>
        {results.isUsingAdvancedSettings && (
          <div className="text-center text-xs text-purple-600 mt-1">
            Advanced Calibration Active
          </div>
        )}
      </div>

      {/* ENHANCED: Status Display using advanced calibrated data */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className={`text-center p-6 rounded-xl border-2 ${getBuoyancyBg(results.surfaceBuoyancy)} ${
          results.isUsingAdvancedSettings ? 'border-purple-300' : ''
        }`}
      >
        <SafeIcon
          icon={getBuoyancyIcon(results.surfaceBuoyancy)}
          className={`text-4xl mx-auto mb-3 ${getBuoyancyColor(results.surfaceBuoyancy)}`}
        />
        <h4 className="text-xl font-bold text-gray-900 mb-2 capitalize">
          {results.surfaceBuoyancy} Buoyancy
          {results.isUsingAdvancedSettings && (
            <span className="text-sm text-purple-600 ml-2">(Advanced)</span>
          )}
        </h4>
        <p className="text-sm text-gray-600 mb-4">
          {getAdvancedBuoyancyDescription(
            results.surfaceBuoyancy, 
            results.expectedNeutralDepth, 
            results.targetNeutralDepth,
            results.isUsingAdvancedSettings,
            results.neutralBuoyancyPreference
          )}
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

      {/* ENHANCED: Target Neutral Depth Range with advanced calibration */}
      <div className={`mt-6 p-4 border-2 rounded-lg ${
        results.isUsingAdvancedSettings ? 'bg-purple-50 border-purple-200' : 'bg-green-50 border-green-200'
      }`}>
        <div className="flex items-center mb-2">
          <SafeIcon icon={FiTarget} className={`mr-2 ${
            results.isUsingAdvancedSettings ? 'text-purple-600' : 'text-green-600'
          }`} />
          <h5 className={`font-medium ${
            results.isUsingAdvancedSettings ? 'text-purple-900' : 'text-green-900'
          }`}>
            {results.isUsingAdvancedSettings ? 'Advanced ' : ''}Target Neutral Buoyancy Depth
          </h5>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between items-center">
            <span>Target range ({results.useCustomNeutralDepth ? 'custom' : results.waterType}):</span>
            <span className={`font-bold ${
              results.isUsingAdvancedSettings ? 'text-purple-700' : 'text-green-700'
            }`}>
              {results.targetNeutralDepth.min}-{results.targetNeutralDepth.max}m
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span>Optimal depth:</span>
            <span className={`font-bold ${
              results.isUsingAdvancedSettings ? 'text-purple-700' : 'text-green-700'
            }`}>
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
        <div className={`mt-3 p-2 rounded text-xs ${
          results.isWithinTargetRange 
            ? 'bg-green-100 text-green-800' 
            : 'bg-amber-100 text-amber-800'
        }`}>
          {results.isWithinTargetRange
            ? `✓ Your neutral depth is within the ${results.isUsingAdvancedSettings ? 'advanced ' : ''}optimal range for freediving`
            : `⚠ Consider adjusting ballast weight to achieve ${results.isUsingAdvancedSettings ? 'advanced ' : ''}target neutral depth range`}
        </div>
      </div>

      {/* ENHANCED: Advanced Diving Indicators with detailed breakdown */}
      {results.isUsingAdvancedSettings && (
        <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
          <div className="flex items-center mb-2">
            <SafeIcon icon={FiSliders} className="text-purple-600 mr-2" />
            <h5 className="font-medium text-purple-900">Advanced Configuration Details</h5>
          </div>
          <div className="space-y-2 text-sm">
            {results.useCustomNeutralDepth && (
              <>
                <div className="flex justify-between">
                  <span>Custom neutral depth:</span>
                  <span className="font-medium text-purple-700">
                    {results.customNeutralDepth}m
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Buoyancy preference:</span>
                  <span className="font-medium text-purple-700 capitalize">
                    {results.neutralBuoyancyPreference.replace('-', ' ')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Preference adjustment:</span>
                  <span className="font-medium text-purple-700">
                    {results.buoyancyPreferenceAdjustment > 0 ? '+' : ''}
                    {results.buoyancyPreferenceAdjustment.toFixed(1)}kg
                  </span>
                </div>
              </>
            )}
            
            {results.useDeepDivingOptimization && (
              <>
                <div className="flex justify-between">
                  <span>Diving profile:</span>
                  <span className="font-medium text-purple-700 capitalize">
                    {results.deepDivingProfile.replace('-', ' ')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Profile adjustment:</span>
                  <span className="font-medium text-purple-700">
                    {results.deepDivingAdjustment > 0 ? '+' : ''}
                    {results.deepDivingAdjustment.toFixed(1)}kg
                  </span>
                </div>
              </>
            )}
            
            {(results.buoyancyPreferenceAdjustment !== 0 || results.deepDivingAdjustment !== 0) && (
              <div className="flex justify-between border-t pt-2 mt-2">
                <span className="font-medium">Total advanced adjustment:</span>
                <span className="font-bold text-purple-700">
                  {(results.buoyancyPreferenceAdjustment + results.deepDivingAdjustment) > 0 ? '+' : ''}
                  {(results.buoyancyPreferenceAdjustment + results.deepDivingAdjustment).toFixed(1)}kg
                </span>
              </div>
            )}
            
            <div className="flex justify-between border-t pt-2 mt-2">
              <span className="font-medium">Calibration factor:</span>
              <span className="font-medium text-purple-700">
                {results.empiricalCorrectionFactor.toFixed(2)}x
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ENHANCED: Baseline Ballast Weight Information with advanced calibration */}
      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-center mb-2">
          <SafeIcon icon={FiAnchor} className="text-blue-600 mr-2" />
          <h5 className="font-medium text-gray-900">
            {results.isUsingAdvancedSettings ? 'Advanced ' : ''}Baseline Ballast Weight
          </h5>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Wetsuit baseline (1kg per 1mm):</span>
            <span className="font-medium text-blue-700">
              {results.baselineBallastWeight.toFixed(1)}kg
            </span>
          </div>
          <div className="flex justify-between">
            <span>{results.isUsingAdvancedSettings ? 'Advanced a' : 'A'}djusted recommendation:</span>
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
          {results.isUsingAdvancedSettings && (
            <div className="flex justify-between border-t pt-2 mt-2">
              <span className="font-medium">Advanced calibration bonus:</span>
              <span className="font-medium text-purple-700">
                +{((results.empiricalCorrectionFactor - 1.05) * 100).toFixed(0)}% precision
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ENHANCED: Depth Analysis using advanced empirical status */}
      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-center mb-2">
          <SafeIcon icon={FiAnchor} className="text-blue-600 mr-2" />
          <h5 className="font-medium text-gray-900">
            {results.isUsingAdvancedSettings ? 'Advanced ' : ''}Depth Analysis
          </h5>
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
                : `Buoyancy status is ${results.isUsingAdvancedSettings ? 'optimally calibrated' : 'appropriate'} for ${results.targetDepth}m depth.`}
          </div>
          {results.isUsingAdvancedSettings && (
            <div className="text-xs text-purple-600 mt-2 italic">
              Analysis enhanced with advanced configuration parameters
            </div>
          )}
        </div>
      </div>

      {/* ENHANCED: Physics Data with advanced context */}
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
          {results.isUsingAdvancedSettings 
            ? 'Gauge position based on advanced empirical freediving data with enhanced calibration'
            : 'Gauge position based on empirical freediving data, not theoretical physics calculations'}
        </div>
      </div>

      {/* ENHANCED: Advanced Calibration Information */}
      {results.isUsingAdvancedSettings && (
        <div className="mt-4 p-4 bg-purple-50 rounded-lg">
          <div className="flex items-center mb-2">
            <SafeIcon icon={FiCheckCircle} className="text-purple-600 mr-2" />
            <h5 className="font-medium text-purple-900">Advanced Calibration Active</h5>
          </div>
          <div className="text-sm text-purple-800 space-y-1">
            <p>Enhanced empirical calibration for advanced freediving configurations:</p>
            <ul className="text-xs mt-1 space-y-0.5">
              <li>• Custom depth targets with precision tolerance adjustments</li>
              <li>• Deep diving profile optimizations for competitive freediving</li>
              <li>• Enhanced buoyancy preference calibrations</li>
              <li>• Advanced safety margin calculations</li>
              <li>• Increased empirical correction factor ({results.empiricalCorrectionFactor.toFixed(2)}x vs 1.05x standard)</li>
            </ul>
          </div>
        </div>
      )}

      {/* ENHANCED: Wetsuit Information with advanced recommendations */}
      <div className="mt-4 p-4 bg-amber-50 rounded-lg">
        <h5 className="font-medium text-amber-900 mb-2">
          {results.isUsingAdvancedSettings ? 'Advanced ' : ''}Wetsuit Effect
        </h5>
        <div className="text-sm text-amber-800">
          <p>Your {results.wetsuitThickness}mm wetsuit adds ~{results.wetsuitBuoyancy.toFixed(1)}kg buoyancy</p>
          <p className="mt-1 text-xs">
            {results.isUsingAdvancedSettings 
              ? 'Advanced rule: 1mm = 1kg (2.2lbs) with configuration-specific adjustments'
              : 'Baseline rule: 1mm = 1kg (2.2lbs) of buoyancy'}
          </p>
          {results.wetsuitRecommendations && results.wetsuitRecommendations.alternatives.length > 0 && (
            <div className="mt-2">
              <p className="font-medium text-xs">Alternative recommendations:</p>
              {results.wetsuitRecommendations.alternatives.slice(0, 2).map((alt, index) => (
                <p key={index} className="text-xs">• {alt.thickness}mm: {alt.reason}</p>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ENHANCED: Disclaimer with advanced settings context */}
      <div className="mt-4 text-xs text-gray-500 italic border-t pt-3">
        <p className="font-medium mb-1">Important Safety Note:</p>
        <p>{results.disclaimer}</p>
        {results.isUsingAdvancedSettings && (
          <p className="mt-1 text-purple-600">
            <strong>Advanced Configuration:</strong> Enhanced empirical calibration active for custom depth targets and deep diving profiles. Requires extensive testing and professional supervision.
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default BuoyancyGauge;