import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiShield, FiEye, FiAlertTriangle, FiCheckCircle, FiUsers, FiDroplet, FiWind, FiActivity, FiRefreshCw, FiMale, FiFemale } = FiIcons;

const InstructorMode = ({ inputs, onChange, results }) => {
  const [weightDisplayUnit, setWeightDisplayUnit] = React.useState('kg');
  
  const toggleWeightUnit = () => {
    setWeightDisplayUnit(prev => prev === 'kg' ? 'lbs' : 'kg');
  };
  
  const formatWeight = (weightInKg) => {
    if (!weightInKg && weightInKg !== 0) return '–';
    if (weightDisplayUnit === 'kg') {
      return `${weightInKg.toFixed(1)} kg`;
    } else {
      const weightInLbs = weightInKg * 2.20462;
      return `${weightInLbs.toFixed(1)} lbs`;
    }
  };
  
  const getOverallSafetyRating = () => {
    if (!results) return 'unknown';
    
    const warnings = results.safetyWarnings;
    const highSeverity = warnings.filter(w => w.severity === 'high').length;
    const mediumSeverity = warnings.filter(w => w.severity === 'medium').length;
    
    if (highSeverity > 0) return 'high-risk';
    if (mediumSeverity > 1) return 'medium-risk';
    if (warnings.length > 0) return 'low-risk';
    return 'safe';
  };

  const getSafetyColor = (rating) => {
    switch (rating) {
      case 'safe': return 'text-green-600 bg-green-50 border-green-200';
      case 'low-risk': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'medium-risk': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'high-risk': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getSafetyIcon = (rating) => {
    switch (rating) {
      case 'safe': return FiCheckCircle;
      case 'low-risk':
      case 'medium-risk':
      case 'high-risk': return FiAlertTriangle;
      default: return FiShield;
    }
  };

  const safetyRating = getOverallSafetyRating();

  // Calculate default lung capacity based on gender and body type
  const calculateDefaultLungCapacity = (gender, bodyType) => {
    if (gender === 'male') {
      switch (bodyType) {
        case 'lean': return 6.5;
        case 'muscular': return 6.3;
        case 'broad': return 6.8;
        case 'higher-fat': return 5.8;
        default: return 6.0; // average
      }
    } else { // female
      switch (bodyType) {
        case 'lean': return 5.0;
        case 'muscular': return 4.8;
        case 'broad': return 5.0;
        case 'higher-fat': return 4.2;
        default: return 4.5; // average
      }
    }
  };

  // Get the default lung capacity for the current gender and body type
  const defaultLungCapacity = calculateDefaultLungCapacity(inputs.gender, inputs.bodyType);

  // Real-world calibration data
  const calibrationData = {
    weight: 72,
    height: 173,
    gender: 'male',
    bodyType: 'average',
    lungCapacity: 5.0,
    wetsuitThickness: 2,
    weightBelt: 2,
    waterType: 'saltwater',
    neutralDepthRange: '10-12m'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-purple-50 border-2 border-purple-200 rounded-xl p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <SafeIcon icon={FiShield} className="text-xl text-purple-600 mr-3" />
          <h3 className="text-lg font-semibold text-purple-900">Instructor Oversight</h3>
        </div>
        <button
          onClick={toggleWeightUnit}
          className="flex items-center px-3 py-1 bg-purple-200 text-purple-800 rounded-lg hover:bg-purple-300 transition-colors text-sm"
        >
          <SafeIcon icon={FiRefreshCw} className="mr-1" />
          {weightDisplayUnit === 'kg' ? 'Show lbs' : 'Show kg'}
        </button>
      </div>

      {/* Real-World Calibration Data */}
      <div className="bg-green-50 rounded-lg p-4 mb-6 border-2 border-green-200">
        <div className="flex items-center mb-3">
          <SafeIcon icon={FiCheckCircle} className="text-xl text-green-600 mr-2" />
          <h4 className="font-medium text-green-900">Formula Calibration Data</h4>
        </div>
        
        <div className="text-sm space-y-1 text-green-800">
          <p>The buoyancy formula has been calibrated using real-world data:</p>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2">
            <li>• Weight: {calibrationData.weight}kg</li>
            <li>• Height: {calibrationData.height}cm</li>
            <li>• Gender: {calibrationData.gender}</li>
            <li>• Body type: {calibrationData.bodyType}</li>
            <li>• Lung capacity: {calibrationData.lungCapacity}L</li>
            <li>• Wetsuit: {calibrationData.wetsuitThickness}mm</li>
            <li>• Weight belt: {calibrationData.weightBelt}kg</li>
            <li>• Neutral depth: {calibrationData.neutralDepthRange}</li>
          </ul>
          <p className="mt-2 font-medium">Key finding: 1mm wetsuit requires 1kg of weight</p>
        </div>
      </div>

      {/* Gender & Body Type Summary */}
      <div className="bg-white rounded-lg p-4 mb-6">
        <div className="flex items-center mb-3">
          <SafeIcon 
            icon={inputs.gender === 'male' ? FiMale : FiFemale} 
            className={`text-xl mr-2 ${inputs.gender === 'male' ? 'text-blue-600' : 'text-pink-600'}`} 
          />
          <h4 className="font-medium text-gray-900">Student Profile</h4>
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="p-2 bg-blue-50 rounded">
            <div className="font-medium">Gender:</div>
            <div className="capitalize">{inputs.gender}</div>
          </div>
          <div className="p-2 bg-blue-50 rounded">
            <div className="font-medium">Body Type:</div>
            <div className="capitalize">{inputs.bodyType}</div>
          </div>
          <div className="p-2 bg-blue-50 rounded">
            <div className="font-medium">Current Lung Capacity:</div>
            <div>{inputs.lungCapacity}L</div>
          </div>
          <div className="p-2 bg-blue-50 rounded">
            <div className="font-medium">Default Capacity:</div>
            <div>{defaultLungCapacity}L</div>
          </div>
        </div>
        
        <div className="mt-3 text-xs text-gray-600">
          {inputs.gender === 'male' 
            ? 'Males typically have larger lung capacity (5.5-6.5L) and lower body fat percentage'
            : 'Females typically have smaller lung capacity (4-5L) and higher body fat percentage'
          }
        </div>
      </div>

      {/* Safety Assessment */}
      <div className={`rounded-lg border-2 p-4 mb-6 ${getSafetyColor(safetyRating)}`}>
        <div className="flex items-center mb-3">
          <SafeIcon icon={getSafetyIcon(safetyRating)} className="text-xl mr-2" />
          <h4 className="font-semibold">Safety Assessment</h4>
        </div>
        
        <div className="text-sm space-y-2">
          <div className="flex justify-between">
            <span>Overall Risk Level:</span>
            <span className="font-medium capitalize">{safetyRating.replace('-', ' ')}</span>
          </div>
          
          {results && (
            <>
              <div className="flex justify-between">
                <span>Active Warnings:</span>
                <span className="font-medium">{results.safetyWarnings.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Weight Deviation:</span>
                <span className="font-medium">
                  {formatWeight(Math.abs(results.weightAdjustment))}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Expected Neutral Depth:</span>
                <span className="font-medium">
                  {results.expectedNeutralDepth}m
                </span>
              </div>
              <div className="flex justify-between">
                <span>Empirical Correction:</span>
                <span className="font-medium">
                  {results.empiricalCorrectionFactor.toFixed(2)}x
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Physics Model Details */}
      <div className="bg-white rounded-lg p-4 mb-6">
        <div className="flex items-center mb-3">
          <SafeIcon icon={FiActivity} className="text-lg text-purple-600 mr-2" />
          <h4 className="font-medium text-gray-900">Physics Model</h4>
        </div>
        
        <div className="space-y-3 text-sm">
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2 bg-blue-50 rounded">
              <div className="font-medium">Body Density:</div>
              <div>{results?.bodyDensity?.toFixed(1) || '–'} kg/m³</div>
            </div>
            <div className="p-2 bg-blue-50 rounded">
              <div className="font-medium">Water Density:</div>
              <div>{results?.waterDensity || '–'} kg/m³</div>
            </div>
            <div className="p-2 bg-blue-50 rounded">
              <div className="font-medium">Body Volume:</div>
              <div>{results ? (results.bodyVolume * 1000).toFixed(1) : '–'} L</div>
            </div>
            <div className="p-2 bg-blue-50 rounded">
              <div className="font-medium">BMI:</div>
              <div>{results?.bmi?.toFixed(1) || '–'}</div>
            </div>
          </div>
          <div className="p-3 bg-blue-50 rounded-lg">
            <div className="font-medium mb-1">Buoyancy Forces</div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <div>Surface: {results?.buoyancyForceN?.toFixed(1) || '–'} N</div>
                <div>({formatWeight(results?.buoyancyValue)} equivalent)</div>
              </div>
              <div>
                <div>At Depth: {results?.buoyancyAtDepthN?.toFixed(1) || '–'} N</div>
                <div>Depth: {results?.targetDepth || '–'}m</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Natural Neutral Depth Information */}
      <div className="bg-white rounded-lg p-4 mb-6">
        <div className="flex items-center mb-3">
          <SafeIcon icon={FiDroplet} className="text-lg text-purple-600 mr-2" />
          <h4 className="font-medium text-gray-900">Natural Neutral Depth</h4>
        </div>
        
        <div className="space-y-3 text-sm">
          <p>Average freedivers reach natural neutral buoyancy at full breath:</p>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-blue-50 p-2 rounded">
              <span className="font-medium">Saltwater:</span> 10-12m
            </div>
            <div className="bg-blue-50 p-2 rounded">
              <span className="font-medium">Freshwater:</span> 5-7m
            </div>
          </div>
          <p className="text-xs text-gray-600 italic">
            Note: These are average values and will vary by individual body composition, lung capacity, and water salinity.
          </p>
        </div>
      </div>

      {/* Gender-Specific Considerations */}
      <div className="bg-white rounded-lg p-4 mb-6">
        <div className="flex items-center mb-3">
          <SafeIcon 
            icon={inputs.gender === 'male' ? FiMale : FiFemale} 
            className={`text-lg ${inputs.gender === 'male' ? 'text-blue-600' : 'text-pink-600'} mr-2`} 
          />
          <h4 className="font-medium text-gray-900">
            {inputs.gender === 'male' ? 'Male' : 'Female'} Diver Considerations
          </h4>
        </div>
        
        <div className="space-y-2 text-sm">
          {inputs.gender === 'male' ? (
            <>
              <p>Males typically have:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Higher average lung capacity (5.5-6.5L)</li>
                <li>Higher muscle mass and density</li>
                <li>Lower body fat percentage</li>
                <li>Greater overall body weight</li>
              </ul>
              <p className="mt-2">Implications for weighting:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>May need more weight to offset muscle density</li>
                <li>Larger lung volume creates more positive buoyancy at surface</li>
                <li>Typically need 0.5-1kg more weight than females of similar size and build</li>
              </ul>
            </>
          ) : (
            <>
              <p>Females typically have:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Lower average lung capacity (4-5L)</li>
                <li>Lower muscle mass and density</li>
                <li>Higher body fat percentage</li>
                <li>Different weight distribution</li>
              </ul>
              <p className="mt-2">Implications for weighting:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Natural buoyancy from higher body fat may require less weight</li>
                <li>Smaller lung volume creates less positive buoyancy at surface</li>
                <li>May need 0.5-1kg less weight than males of similar size and build</li>
                <li>Weight needs may fluctuate with menstrual cycle due to fluid retention</li>
              </ul>
            </>
          )}
        </div>
      </div>

      {/* Wetsuit Weight Calculation - UPDATED for 1kg per 1mm */}
      <div className="bg-white rounded-lg p-4 mb-6">
        <div className="flex items-center mb-3">
          <SafeIcon icon={FiDroplet} className="text-lg text-purple-600 mr-2" />
          <h4 className="font-medium text-gray-900">Wetsuit Analysis</h4>
        </div>
        
        <div className="space-y-3 text-sm">
          <p>Updated wetsuit buoyancy calculation:</p>
          <div className="p-3 bg-amber-50 rounded-lg">
            <p className="font-medium">1mm wetsuit = 1kg (2.2lbs) of buoyancy</p>
            <p className="mt-1">Current wetsuit adds: {formatWeight(inputs.wetsuitThickness * 1.0)} buoyancy</p>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <div className="p-2 bg-blue-50 rounded">
              <div className="font-medium">Wetsuit Volume:</div>
              <div>{results?.wetsuitVolume ? (results.wetsuitVolume * 1000).toFixed(1) : '–'} L</div>
            </div>
            <div className="p-2 bg-blue-50 rounded">
              <div className="font-medium">At {inputs.targetDepth}m:</div>
              <div>{results?.wetsuitVolumeDepth ? (results.wetsuitVolumeDepth * 1000).toFixed(1) : '–'} L</div>
            </div>
          </div>
          <p className="text-xs text-gray-600">
            Wetsuit compression: ~10% volume reduction per 10m depth
          </p>
        </div>
      </div>

      {/* Advanced Lung Controls */}
      <div className="bg-white rounded-lg p-4 mb-6">
        <div className="flex items-center mb-3">
          <SafeIcon icon={FiWind} className="text-lg text-purple-600 mr-2" />
          <h4 className="font-medium text-gray-900">Lung Capacity Settings</h4>
        </div>
        
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Student Lung Capacity (liters)
            </label>
            <input
              type="number"
              value={inputs.lungCapacity || 5.5}
              onChange={(e) => onChange('lungCapacity', parseFloat(e.target.value) || 5.5)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
              min="3"
              max="10"
              step="0.1"
            />
            <div className="flex justify-between mt-1">
              <p className="text-xs text-gray-500">
                Default for {inputs.gender === 'male' ? 'males' : 'females'}: {defaultLungCapacity}L
              </p>
              <button
                onClick={() => onChange('lungCapacity', defaultLungCapacity)}
                className="text-xs text-purple-600 hover:text-purple-800"
              >
                Reset to default
              </button>
            </div>
          </div>
          
          <div className="p-3 bg-blue-50 rounded-lg text-sm">
            <p className="font-medium mb-1">Lung Compression Effects</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <div className="font-medium">Surface Volume:</div>
                <div>{results?.lungVolumeSurface ? (results.lungVolumeSurface * 1000).toFixed(1) : '–'} L</div>
              </div>
              <div>
                <div className="font-medium">At {inputs.targetDepth}m:</div>
                <div>{results?.lungVolumeDepth ? (results.lungVolumeDepth * 1000).toFixed(1) : '–'} L</div>
              </div>
            </div>
            <p className="mt-2 text-gray-700">
              Compression reduces buoyancy by ~{formatWeight(results?.lungCompressionEffect)} at depth
            </p>
          </div>

          <div className="p-3 bg-purple-50 rounded-lg text-sm">
            <p className="font-medium mb-1">Typical Lung Capacity Ranges</p>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <div className="font-medium">Males:</div>
                <div>4.8-7.0L (avg: 6.0L)</div>
              </div>
              <div>
                <div className="font-medium">Females:</div>
                <div>3.5-5.5L (avg: 4.5L)</div>
              </div>
            </div>
            <p className="mt-2 text-gray-700">
              Body type affects capacity: Larger/broader individuals typically have higher volume
            </p>
          </div>
        </div>
      </div>

      {/* Empirical Correction Controls - Updated with new calibration factor */}
      <div className="bg-white rounded-lg p-4 mb-6">
        <div className="flex items-center mb-3">
          <SafeIcon icon={FiActivity} className="text-lg text-purple-600 mr-2" />
          <h4 className="font-medium text-gray-900">Real-World Adjustments</h4>
        </div>
        
        <div className="space-y-3">
          <p className="text-sm">
            Theoretical buoyancy calculations often underestimate required weight. The model applies a correction factor to match real-world observations.
          </p>
          
          <div className="p-3 bg-amber-50 rounded-lg text-sm">
            <p className="font-medium">Empirical Correction: 5% Additional Weight</p>
            <p className="mt-1">This correction factor has been updated from 10% to 5% based on real-world calibration data from an average male diver with a 2mm wetsuit requiring 2kg of weight.</p>
          </div>
          
          <div className="p-3 bg-blue-50 rounded-lg text-sm">
            <div className="font-medium mb-1">Specific Case Analysis</div>
            <p>Your student's parameters:</p>
            <ul className="mt-1 space-y-1">
              <li>• Gender: {inputs.gender === 'male' ? 'Male' : 'Female'}</li>
              <li>• Weight: {inputs.weight}kg</li>
              <li>• Height: {inputs.height}cm</li>
              <li>• Wetsuit: {inputs.wetsuitThickness}mm</li>
              <li>• Current weights: {inputs.weightBelt}{inputs.weightBeltUnit} belt, {inputs.neckWeight}{inputs.neckWeightUnit} neck</li>
              <li>• Lung capacity: {inputs.lungCapacity}L</li>
            </ul>
            <p className="mt-2">
              Based on similar profiles, most {inputs.gender === 'male' ? 'male' : 'female'} freedivers with these characteristics need {formatWeight(results?.recommendedWeight)} of weight for optimal buoyancy.
            </p>
          </div>
        </div>
      </div>

      {/* Student Profile Override */}
      <div className="bg-white rounded-lg p-4 mb-6">
        <div className="flex items-center mb-4">
          <SafeIcon icon={FiUsers} className="text-lg text-purple-600 mr-2" />
          <h4 className="font-medium text-gray-900">Student Profile Adjustments</h4>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Experience Level Override
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm">
              <option value="">Auto (based on inputs)</option>
              <option value="beginner">Beginner (0-10 dives)</option>
              <option value="intermediate">Intermediate (10-50 dives)</option>
              <option value="advanced">Advanced (50+ dives)</option>
              <option value="instructor">Instructor Level</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Safety Margin Adjustment
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm">
              <option value="standard">Standard Safety Margin</option>
              <option value="conservative">Conservative (+0.5kg)</option>
              <option value="aggressive">Aggressive (-0.5kg)</option>
              <option value="custom">Custom Override</option>
            </select>
          </div>
        </div>
      </div>

      {/* Instructor Notes */}
      <div className="bg-white rounded-lg p-4 mb-6">
        <div className="flex items-center mb-4">
          <SafeIcon icon={FiEye} className="text-lg text-purple-600 mr-2" />
          <h4 className="font-medium text-gray-900">Instructor Notes</h4>
        </div>
        
        <textarea
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
          rows="3"
          placeholder="Add notes about this student's buoyancy characteristics, previous observations, or specific recommendations..."
        />
      </div>

      {/* Quick Actions */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-900 text-sm">Quick Actions</h4>
        
        <div className="grid grid-cols-2 gap-2">
          <button className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm">
            Flag for Review
          </button>
          <button className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm">
            Approve Setup
          </button>
          <button className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
            Schedule Pool Test
          </button>
          <button className="px-3 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-sm">
            Request Consultation
          </button>
        </div>
      </div>

      {/* Certification Requirements */}
      <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <h5 className="font-medium text-amber-900 mb-2">Certification Requirements</h5>
        <div className="text-sm text-amber-800 space-y-1">
          <div>• Pool buoyancy test required before open water</div>
          <div>• Weight drop skills must be demonstrated</div>
          <div>• Instructor approval needed for depths &gt; 20m</div>
        </div>
      </div>
    </motion.div>
  );
};

export default InstructorMode;