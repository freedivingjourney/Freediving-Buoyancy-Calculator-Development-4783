import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { convertWeight } from '../utils/buoyancyCalculations';

const { FiTarget, FiAlertTriangle, FiInfo, FiSave, FiSettings, FiBook, FiWind, FiActivity, FiRefreshCw, FiMale, FiFemale, FiAnchor, FiCheckCircle } = FiIcons;

const BuoyancyResults = ({ results, onSave, instructorMode, onToggleInstructor }) => {
  const [displayUnit, setDisplayUnit] = React.useState('kg');
  
  if (!results) return null;

  const getSafetyLevel = () => {
    if (results.safetyWarnings.length === 0) return 'safe';
    if (results.safetyWarnings.some(w => w.severity === 'high')) return 'danger';
    return 'warning';
  };

  const getSafetyColor = (level) => {
    switch (level) {
      case 'safe': return 'text-green-600 bg-green-50 border-green-200';
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'danger': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const toggleDisplayUnit = () => {
    setDisplayUnit(prev => prev === 'kg' ? 'lbs' : 'kg');
  };

  const formatWeight = (weightInKg) => {
    if (displayUnit === 'kg') {
      return `${weightInKg.toFixed(1)} kg`;
    } else {
      const weightInLbs = convertWeight(weightInKg, 'kg', 'lbs');
      return `${weightInLbs.toFixed(1)} lbs`;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Weight Recommendations */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <SafeIcon icon={FiTarget} className="text-xl text-blue-600 mr-3" />
            <h3 className="text-xl font-semibold text-gray-900">Ballast Weight Recommendations</h3>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={toggleDisplayUnit}
              className="flex items-center px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm"
            >
              <SafeIcon icon={FiRefreshCw} className="mr-2" />
              {displayUnit === 'kg' ? 'Show lbs' : 'Show kg'}
            </button>
            <button
              onClick={onSave}
              className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              <SafeIcon icon={FiSave} className="mr-2" />
              Save
            </button>
            <button
              onClick={onToggleInstructor}
              className={`flex items-center px-3 py-2 rounded-lg transition-colors text-sm ${
                instructorMode 
                  ? 'bg-purple-600 text-white hover:bg-purple-700' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <SafeIcon icon={FiSettings} className="mr-2" />
              Instructor
            </button>
          </div>
        </div>

        {/* Baseline Ballast Weight Section - EMPHASIZED */}
        <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-center mb-3">
            <SafeIcon icon={FiAnchor} className="text-green-600 mr-2 text-xl" />
            <h4 className="font-semibold text-green-900">Baseline Ballast Weight Calculation</h4>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-white rounded-lg p-3 text-center">
              <div className="text-sm text-gray-600 mb-1">Wetsuit Baseline</div>
              <div className="text-xl font-bold text-green-700">
                {formatWeight(results.baselineBallastWeight)}
              </div>
              <div className="text-xs text-gray-500">1kg per 1mm thickness</div>
            </div>
            
            <div className="bg-white rounded-lg p-3 text-center">
              <div className="text-sm text-gray-600 mb-1">Adjusted Recommendation</div>
              <div className="text-xl font-bold text-blue-700">
                {formatWeight(results.ballastRecommendations.adjusted)}
              </div>
              <div className="text-xs text-gray-500">Based on your profile</div>
            </div>
            
            <div className="bg-white rounded-lg p-3 text-center">
              <div className="text-sm text-gray-600 mb-1">Current Total</div>
              <div className="text-xl font-bold text-gray-700">
                {formatWeight(results.currentTotalWeight)}
              </div>
              <div className="text-xs text-gray-500">Your current setup</div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-3">
            <h5 className="font-medium text-gray-900 mb-2">Ballast Weight Factors</h5>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex justify-between">
                <span>Body weight factor:</span>
                <span className={results.ballastRecommendations.factors.bodyWeight >= 0 ? 'text-red-600' : 'text-blue-600'}>
                  {results.ballastRecommendations.factors.bodyWeight >= 0 ? '+' : ''}{results.ballastRecommendations.factors.bodyWeight.toFixed(1)}kg
                </span>
              </div>
              <div className="flex justify-between">
                <span>Water type factor:</span>
                <span className={results.ballastRecommendations.factors.waterType >= 0 ? 'text-red-600' : 'text-blue-600'}>
                  {results.ballastRecommendations.factors.waterType >= 0 ? '+' : ''}{results.ballastRecommendations.factors.waterType.toFixed(1)}kg
                </span>
              </div>
              <div className="flex justify-between">
                <span>Gender factor:</span>
                <span className={results.ballastRecommendations.factors.gender >= 0 ? 'text-red-600' : 'text-blue-600'}>
                  {results.ballastRecommendations.factors.gender >= 0 ? '+' : ''}{results.ballastRecommendations.factors.gender.toFixed(1)}kg
                </span>
              </div>
              <div className="flex justify-between">
                <span>Body type factor:</span>
                <span className={results.ballastRecommendations.factors.bodyType >= 0 ? 'text-red-600' : 'text-blue-600'}>
                  {results.ballastRecommendations.factors.bodyType >= 0 ? '+' : ''}{results.ballastRecommendations.factors.bodyType.toFixed(1)}kg
                </span>
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-600 italic">
              Positive values indicate more weight needed, negative values indicate less weight needed.
            </div>
          </div>
        </div>

        {/* Target Depth Analysis - EMPHASIZED */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center mb-3">
            <SafeIcon icon={FiTarget} className="text-blue-600 mr-2 text-xl" />
            <h4 className="font-semibold text-blue-900">Target Neutral Buoyancy Analysis</h4>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
            <div className="bg-white rounded-lg p-3 text-center">
              <div className="text-sm text-gray-600 mb-1">Target Range</div>
              <div className="text-lg font-bold text-blue-700">
                {results.targetNeutralDepth.min}-{results.targetNeutralDepth.max}m
              </div>
              <div className="text-xs text-gray-500 capitalize">{results.waterType}</div>
            </div>
            
            <div className="bg-white rounded-lg p-3 text-center">
              <div className="text-sm text-gray-600 mb-1">Optimal Depth</div>
              <div className="text-lg font-bold text-green-700">
                {results.targetNeutralDepth.optimal}m
              </div>
              <div className="text-xs text-gray-500">Recommended</div>
            </div>
            
            <div className="bg-white rounded-lg p-3 text-center">
              <div className="text-sm text-gray-600 mb-1">Your Expected</div>
              <div className={`text-lg font-bold ${results.isWithinTargetRange ? 'text-green-700' : 'text-amber-700'}`}>
                {results.expectedNeutralDepth > 0 ? `${results.expectedNeutralDepth}m` : 'Surface'}
              </div>
              <div className="flex items-center justify-center text-xs">
                <SafeIcon 
                  icon={results.isWithinTargetRange ? FiCheckCircle : FiAlertTriangle} 
                  className={`mr-1 ${results.isWithinTargetRange ? 'text-green-600' : 'text-amber-600'}`}
                />
                <span className={results.isWithinTargetRange ? 'text-green-600' : 'text-amber-600'}>
                  {results.isWithinTargetRange ? 'On target' : 'Needs adjustment'}
                </span>
              </div>
            </div>
          </div>

          <div className={`p-3 rounded-lg ${results.isWithinTargetRange ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
            <div className="text-sm">
              {results.isWithinTargetRange 
                ? '✓ Your current ballast weight should achieve neutral buoyancy within the optimal depth range for freediving safety and performance.'
                : '⚠ Your ballast weight may need adjustment to achieve the target neutral buoyancy depth range. Consider the recommendations above.'
              }
            </div>
          </div>
        </div>

        {/* Gender & Lung Capacity Info */}
        <div className="bg-blue-50 rounded-lg p-3 mb-6">
          <div className="flex items-center">
            <SafeIcon 
              icon={results.gender === 'male' ? FiMale : FiFemale} 
              className={`text-xl mr-2 ${results.gender === 'male' ? 'text-blue-600' : 'text-pink-600'}`} 
            />
            <div>
              <div className="flex items-center">
                <span className="font-medium capitalize">{results.gender}</span>
                <span className="mx-2">•</span>
                <span>{results.lungCapacity}L lung capacity</span>
              </div>
              <div className="text-xs text-gray-600 mt-1">
                {results.gender === 'male' ? 'Men' : 'Women'} typically have {results.gender === 'male' ? 'higher' : 'lower'} lung capacity (avg: {results.gender === 'male' ? '5.5-6.5L' : '4-5L'})
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h5 className="font-medium text-gray-900 mb-3">Weight Adjustment Needed</h5>
          <div className="text-lg">
            {results.weightAdjustment > 0 ? (
              <span className="text-red-600">
                Add {formatWeight(results.weightAdjustment)} more weight
              </span>
            ) : results.weightAdjustment < 0 ? (
              <span className="text-blue-600">
                Remove {formatWeight(Math.abs(results.weightAdjustment))} weight
              </span>
            ) : (
              <span className="text-green-600">
                Current weight is optimal
              </span>
            )}
          </div>
        </div>

        {/* Real-World Adjustment Guidance - NEW SECTION */}
        <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-center mb-2">
            <SafeIcon icon={FiInfo} className="text-amber-600 mr-2" />
            <h5 className="font-medium text-amber-900">Real-World Ballast Adjustments</h5>
          </div>
          <div className="text-sm text-amber-800 space-y-2">
            <p><strong>Body Weight Influence:</strong> Heavier divers (&gt;80kg) may need +0.5kg; lighter divers (&lt;60kg) may need -0.5kg from baseline.</p>
            <p><strong>Water Salinity:</strong> Higher salinity increases buoyancy - may need additional weight in very salty water.</p>
            <p><strong>Personal Buoyancy Variation:</strong> Individual body fat distribution and muscle density can affect buoyancy by ±1kg.</p>
            <p><strong>Essential In-Water Testing:</strong> Start with calculated baseline, then adjust in shallow water while monitoring buoyancy at target depth.</p>
          </div>
        </div>

        {/* Wetsuit Guidance */}
        <div className="mt-6 p-4 bg-amber-50 rounded-lg">
          <div className="flex items-center mb-2">
            <SafeIcon icon={FiTarget} className="text-amber-600 mr-2" />
            <h5 className="font-medium text-amber-900">Wetsuit Weight Ratio</h5>
          </div>
          <div className="text-sm text-amber-800">
            <p>
              For your {results.wetsuitThickness}mm wetsuit, baseline ballast weight is 
              {results.wetsuitThickness > 0 ? ` ${formatWeight(results.wetsuitBuoyancy)}` : ' 0kg'} 
              (1kg per 1mm thickness)
            </p>
            <p className="mt-1">
              <strong>Baseline rule:</strong> Each 1mm of wetsuit thickness requires approximately 1kg (2.2lbs) of ballast weight
            </p>
          </div>
        </div>

        {/* Physics Insights */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center mb-2">
            <SafeIcon icon={FiActivity} className="text-blue-600 mr-2" />
            <h5 className="font-medium text-gray-900">Physics Insights</h5>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm text-blue-800">
            <div>
              <div className="font-medium">Body Density:</div>
              <div>{results.bodyDensity.toFixed(1)} kg/m³</div>
            </div>
            <div>
              <div className="font-medium">Body Volume:</div>
              <div>{(results.bodyVolume * 1000).toFixed(1)} L</div>
            </div>
            <div>
              <div className="font-medium">Surface Buoyancy:</div>
              <div>{results.buoyancyForceN.toFixed(1)} N</div>
            </div>
            <div>
              <div className="font-medium">Depth Buoyancy:</div>
              <div>{results.buoyancyAtDepthN.toFixed(1)} N</div>
            </div>
          </div>
        </div>

        {/* Lung Capacity Effects */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center mb-2">
            <SafeIcon icon={FiWind} className="text-blue-600 mr-2" />
            <h5 className="font-medium text-gray-900">Lung Compression</h5>
          </div>
          <div className="text-sm text-blue-800">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="font-medium">Surface Volume:</div>
                <div>{(results.lungVolumeSurface * 1000).toFixed(1)} L</div>
              </div>
              <div>
                <div className="font-medium">At {results.targetDepth}m:</div>
                <div>{(results.lungVolumeDepth * 1000).toFixed(1)} L</div>
              </div>
            </div>
            <p className="mt-2">
              Lung compression reduces buoyancy by approximately {formatWeight(results.lungCompressionEffect)} at {results.targetDepth}m
            </p>
            <p className="text-xs mt-1 text-blue-600">
              (Based on Boyle's Law: P₁V₁ = P₂V₂)
            </p>
          </div>
        </div>
      </div>

      {/* Safety Warnings */}
      {results.safetyWarnings.length > 0 && (
        <div className={`rounded-xl border-2 p-6 ${getSafetyColor(getSafetyLevel())}`}>
          <div className="flex items-start">
            <SafeIcon icon={FiAlertTriangle} className="text-xl mt-1 mr-3 flex-shrink-0" />
            <div>
              <h4 className="font-semibold mb-3">Safety Considerations</h4>
              <div className="space-y-2">
                {results.safetyWarnings.map((warning, index) => (
                  <div key={index} className="text-sm">
                    <span className="font-medium">{warning.type}:</span> {warning.message}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Equipment Guidance */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center mb-4">
          <SafeIcon icon={FiInfo} className="text-xl text-blue-600 mr-3" />
          <h4 className="text-lg font-semibold text-gray-900">Equipment Guidance & In-Water Testing</h4>
        </div>
        
        <div className="space-y-4">
          <div className="bg-green-50 rounded-lg p-4">
            <h5 className="font-medium text-green-900 mb-2">In-Water Testing Protocol</h5>
            <p className="text-sm text-green-800">
              1. Start with baseline ballast weight ({formatWeight(results.baselineBallastWeight)}) in shallow water<br/>
              2. With full breath, you should hover motionless at {results.targetNeutralDepth.optimal}m depth<br/>
              3. Adjust weight in 0.5kg increments until achieving perfect neutral buoyancy<br/>
              4. Test at various depths to ensure consistent performance
            </p>
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <h5 className="font-medium text-blue-900 mb-2">Target Depth Guidelines</h5>
            <p className="text-sm text-blue-800">
              • <strong>Saltwater:</strong> Achieve neutral buoyancy at 10-12m depth (optimal: 11m)<br/>
              • <strong>Freshwater:</strong> Achieve neutral buoyancy at 5-7m depth (optimal: 6m)<br/>
              • <strong>Safety margin:</strong> Should be slightly positive at surface for safety
            </p>
          </div>

          <div className="bg-amber-50 rounded-lg p-4">
            <h5 className="font-medium text-amber-900 mb-2">Ballast Weight Adjustments</h5>
            <p className="text-sm text-amber-800">
              • Thicker wetsuit (+1mm): Add ~1kg (2.2lbs)<br/>
              • Different water salinity: Adjust ±0.5kg as needed<br/>
              • Body composition changes: Re-evaluate ballast requirements<br/>
              • New wetsuit: May need +0.5kg initially until compressed
            </p>
          </div>

          {results.equipmentTips.length > 0 && (
            <div className="bg-green-50 rounded-lg p-4">
              <h5 className="font-medium text-green-900 mb-2">Tips for Your Setup</h5>
              <ul className="text-sm text-green-800 space-y-1">
                {results.equipmentTips.map((tip, index) => (
                  <li key={index}>• {tip}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Further Reading */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center mb-4">
          <SafeIcon icon={FiBook} className="text-xl text-blue-600 mr-3" />
          <h4 className="text-lg font-semibold text-gray-900">Learn More</h4>
        </div>
        
        <div className="space-y-3 text-sm">
          <a href="#" className="block p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
            <div className="font-medium text-blue-900">Ballast Weight Distribution</div>
            <div className="text-blue-700">Optimal placement of weights for streamlined diving</div>
          </a>
          <a href="#" className="block p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
            <div className="font-medium text-blue-900">Target Depth Training</div>
            <div className="text-blue-700">Techniques for achieving and maintaining neutral buoyancy at 10-12m</div>
          </a>
          <a href="#" className="block p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
            <div className="font-medium text-blue-900">In-Water Testing Methods</div>
            <div className="text-blue-700">Safe protocols for testing and adjusting ballast weights</div>
          </a>
        </div>
      </div>
    </motion.div>
  );
};

export default BuoyancyResults;