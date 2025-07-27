import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { 
  FiUser, 
  FiLayers, 
  FiAnchor, 
  FiDroplet, 
  FiTarget, 
  FiWind, 
  FiRefreshCw, 
  FiMale, 
  FiFemale,
  FiSettings,
  FiInfo
} = FiIcons;

const BuoyancyInputs = ({ inputs, onChange, calculateDefaultLungCapacity }) => {
  const bodyTypes = [
    { value: 'lean', label: 'Lean/Athletic', description: 'Low body fat, high muscle density' },
    { value: 'average', label: 'Average', description: 'Typical body composition' },
    { value: 'muscular', label: 'Muscular', description: 'High muscle mass, lower fat' },
    { value: 'broad', label: 'Broad', description: 'Larger frame, average composition' },
    { value: 'higher-fat', label: 'Above Average Body Fat', description: 'Higher body fat percentage' }
  ];

  const wetsuitOptions = [
    { value: 0, label: 'None (Skin diving)' },
    { value: 1, label: '1mm' },
    { value: 2, label: '2mm' },
    { value: 3, label: '3mm' },
    { value: 5, label: '5mm' },
    { value: 7, label: '7mm' }
  ];

  const toggleWeightUnit = (fieldName) => {
    const currentUnit = inputs[`${fieldName}Unit`];
    const newUnit = currentUnit === 'kg' ? 'lbs' : 'kg';
    
    // Convert the value when changing units
    let newValue = inputs[fieldName];
    if (currentUnit === 'kg' && newUnit === 'lbs') {
      newValue = Math.round(newValue * 2.20462 * 10) / 10; // kg to lbs with 1 decimal
    } else if (currentUnit === 'lbs' && newUnit === 'kg') {
      newValue = Math.round(newValue * 0.453592 * 10) / 10; // lbs to kg with 1 decimal
    }
    
    onChange(fieldName, newValue);
    onChange(`${fieldName}Unit`, newUnit);
  };

  // Handle manual override of lung capacity
  const handleLungCapacityChange = (value) => {
    onChange('lungCapacity', value);
  };

  // Get the default lung capacity based on current selections
  const defaultLungCapacity = calculateDefaultLungCapacity(inputs.gender, inputs.bodyType);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-xl shadow-lg p-6"
    >
      <div className="flex items-center mb-6">
        <SafeIcon icon={FiUser} className="text-xl text-blue-600 mr-3" />
        <h2 className="text-xl font-semibold text-gray-900">Diver Profile</h2>
      </div>

      <div className="space-y-6">
        {/* Weight & Height */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Weight (kg)
            </label>
            <input
              type="number"
              value={inputs.weight}
              onChange={(e) => onChange('weight', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="30"
              max="150"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Height (cm)
            </label>
            <input
              type="number"
              value={inputs.height}
              onChange={(e) => onChange('height', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="120"
              max="220"
            />
          </div>
        </div>

        {/* Gender Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Gender
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label
              className={`flex items-center justify-center p-3 border ${
                inputs.gender === 'male'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:bg-gray-50'
              } rounded-lg cursor-pointer transition-colors`}
            >
              <input
                type="radio"
                name="gender"
                value="male"
                checked={inputs.gender === 'male'}
                onChange={() => onChange('gender', 'male')}
                className="sr-only"
              />
              <div className="flex flex-col items-center">
                <SafeIcon icon={FiMale} className="text-2xl mb-1" />
                <span className="font-medium">Male</span>
              </div>
            </label>
            <label
              className={`flex items-center justify-center p-3 border ${
                inputs.gender === 'female'
                  ? 'border-pink-500 bg-pink-50 text-pink-700'
                  : 'border-gray-200 hover:bg-gray-50'
              } rounded-lg cursor-pointer transition-colors`}
            >
              <input
                type="radio"
                name="gender"
                value="female"
                checked={inputs.gender === 'female'}
                onChange={() => onChange('gender', 'female')}
                className="sr-only"
              />
              <div className="flex flex-col items-center">
                <SafeIcon icon={FiFemale} className="text-2xl mb-1" />
                <span className="font-medium">Female</span>
              </div>
            </label>
          </div>
        </div>

        {/* Body Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Body Type
          </label>
          <div className="space-y-2">
            {bodyTypes.map((type) => (
              <label
                key={type.value}
                className={`flex items-center p-3 border ${
                  inputs.bodyType === type.value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:bg-gray-50'
                } rounded-lg cursor-pointer transition-colors`}
              >
                <input
                  type="radio"
                  name="bodyType"
                  value={type.value}
                  checked={inputs.bodyType === type.value}
                  onChange={(e) => onChange('bodyType', e.target.value)}
                  className="mr-3 text-blue-600"
                />
                <div>
                  <div className="font-medium text-gray-900">{type.label}</div>
                  <div className="text-sm text-gray-500">{type.description}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Lung Capacity */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <SafeIcon icon={FiWind} className="mr-2" />
            Lung Capacity (liters)
          </label>
          <div className="relative">
            <input
              type="number"
              value={inputs.lungCapacity}
              onChange={(e) => handleLungCapacityChange(parseFloat(e.target.value) || defaultLungCapacity)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="3"
              max="10"
              step="0.1"
              placeholder={defaultLungCapacity.toString()}
            />
            <div className="mt-1 flex justify-between items-center text-xs">
              <span className="text-gray-500">
                Default: {defaultLungCapacity}L ({inputs.gender === 'male' ? 'Male' : 'Female'}, {bodyTypes.find(t => t.value === inputs.bodyType)?.label})
              </span>
              {inputs.lungCapacity !== defaultLungCapacity && (
                <button
                  onClick={() => handleLungCapacityChange(defaultLungCapacity)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Reset to default
                </button>
              )}
            </div>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Typical range: Males 4.8-7.0L, Females 3.5-5.5L at full breath
          </p>
        </div>

        {/* Equipment Section */}
        <div className="border-t pt-6">
          <div className="flex items-center mb-4">
            <SafeIcon icon={FiLayers} className="text-lg text-blue-600 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Equipment</h3>
          </div>

          {/* Wetsuit */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Wetsuit Thickness
            </label>
            <select
              value={inputs.wetsuitThickness}
              onChange={(e) => onChange('wetsuitThickness', parseFloat(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {wetsuitOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-gray-500">1mm of wetsuit ≈ 1kg (2.2lbs) of buoyancy</p>
          </div>

          {/* Weights with unit toggles */}
          <div className="grid grid-cols-1 gap-4 mb-4">
            {/* Weight Belt */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <SafeIcon icon={FiAnchor} className="inline mr-1" />
                Weight Belt
              </label>
              <div className="flex">
                <input
                  type="number"
                  value={inputs.weightBelt}
                  onChange={(e) => onChange('weightBelt', parseFloat(e.target.value) || 0)}
                  className="flex-grow px-3 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                  max={inputs.weightBeltUnit === 'kg' ? 20 : 45}
                  step="0.1"
                />
                <button
                  type="button"
                  onClick={() => toggleWeightUnit('weightBelt')}
                  className="flex items-center justify-center px-3 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-r-lg transition-colors"
                >
                  <span className="mr-1">{inputs.weightBeltUnit}</span>
                  <SafeIcon icon={FiRefreshCw} className="text-sm" />
                </button>
              </div>
            </div>

            {/* Neck Weight */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Neck Weight
              </label>
              <div className="flex">
                <input
                  type="number"
                  value={inputs.neckWeight}
                  onChange={(e) => onChange('neckWeight', parseFloat(e.target.value) || 0)}
                  className="flex-grow px-3 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                  max={inputs.neckWeightUnit === 'kg' ? 5 : 11}
                  step="0.1"
                />
                <button
                  type="button"
                  onClick={() => toggleWeightUnit('neckWeight')}
                  className="flex items-center justify-center px-3 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-r-lg transition-colors"
                >
                  <span className="mr-1">{inputs.neckWeightUnit}</span>
                  <SafeIcon icon={FiRefreshCw} className="text-sm" />
                </button>
              </div>
            </div>

            <div className="text-xs text-gray-500 mt-1">
              Click on the unit (kg/lbs) button to toggle between measurement systems
            </div>
          </div>
        </div>

        {/* Environment Section */}
        <div className="border-t pt-6">
          <div className="flex items-center mb-4">
            <SafeIcon icon={FiDroplet} className="text-lg text-blue-600 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Environment</h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Water Type
              </label>
              <select
                value={inputs.waterType}
                onChange={(e) => onChange('waterType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="saltwater">Saltwater</option>
                <option value="freshwater">Freshwater</option>
              </select>
              <p className="mt-1 text-xs text-gray-500">
                Natural neutral depth at full breath: {inputs.waterType === 'saltwater' ? '10-12m' : '5-7m'}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <SafeIcon icon={FiTarget} className="inline mr-1" />
                Target Depth (m)
              </label>
              <input
                type="number"
                value={inputs.targetDepth}
                onChange={(e) => onChange('targetDepth', parseFloat(e.target.value) || 10)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="5"
                max="40"
              />
            </div>
          </div>
        </div>

        {/* Advanced Buoyancy Options */}
        <div className="border-t pt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <SafeIcon icon={FiSettings} className="text-lg text-blue-600 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">Advanced Buoyancy Options</h3>
            </div>
            <div className="flex items-center">
              <SafeIcon icon={FiInfo} className="text-blue-500 mr-1" />
              <span className="text-xs text-blue-600">For deep diving & competitions</span>
            </div>
          </div>

          <div className="space-y-4">
            {/* Custom Neutral Depth Setting */}
            <div>
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700">
                  Preferred Neutral Buoyancy Depth
                </label>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={inputs.useCustomNeutralDepth}
                    onChange={(e) => onChange('useCustomNeutralDepth', e.target.checked)}
                    className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-xs text-gray-600">Enable custom depth</span>
                </div>
              </div>
              
              {inputs.useCustomNeutralDepth && (
                <div className="mt-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <input
                        type="number"
                        value={inputs.customNeutralDepth}
                        onChange={(e) => onChange('customNeutralDepth', parseFloat(e.target.value) || inputs.targetDepth)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        min="0"
                        max="40"
                        step="0.5"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Preferred neutral depth (m)
                      </p>
                    </div>
                    <div>
                      <select
                        value={inputs.neutralBuoyancyPreference}
                        onChange={(e) => onChange('neutralBuoyancyPreference', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="neutral">Perfect Neutral</option>
                        <option value="slightly-positive">Slightly Positive</option>
                        <option value="slightly-negative">Slightly Negative</option>
                      </select>
                      <p className="mt-1 text-xs text-gray-500">
                        Buoyancy preference at target
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg text-sm text-blue-800">
                    {inputs.neutralBuoyancyPreference === 'neutral' && (
                      <>
                        <p className="font-medium">Perfect Neutral Buoyancy</p>
                        <p className="text-xs mt-1">Optimal for precise depth control and long static dives</p>
                      </>
                    )}
                    {inputs.neutralBuoyancyPreference === 'slightly-positive' && (
                      <>
                        <p className="font-medium">Slightly Positive Buoyancy</p>
                        <p className="text-xs mt-1">Safer for beginners; easier to maintain depth with minimal effort</p>
                      </>
                    )}
                    {inputs.neutralBuoyancyPreference === 'slightly-negative' && (
                      <>
                        <p className="font-medium">Slightly Negative Buoyancy</p>
                        <p className="text-xs mt-1">For advanced freedivers; easier descent but requires active finning to maintain depth</p>
                      </>
                    )}
                  </div>
                </div>
              )}
              
              {!inputs.useCustomNeutralDepth && (
                <div className="p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
                  <p>Using standard neutral buoyancy target: {inputs.waterType === 'saltwater' ? '10-12m' : '5-7m'}</p>
                  <p className="text-xs mt-1">Enable custom depth for competition or advanced training</p>
                </div>
              )}
            </div>

            {/* Deep Diving Optimization */}
            <div className="mt-4">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700">
                  Deep Diving Optimization
                </label>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={inputs.useDeepDivingOptimization}
                    onChange={(e) => onChange('useDeepDivingOptimization', e.target.checked)}
                    className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-xs text-gray-600">Enable optimization</span>
                </div>
              </div>
              
              {inputs.useDeepDivingOptimization && (
                <div className="mt-2">
                  <select
                    value={inputs.deepDivingProfile}
                    onChange={(e) => onChange('deepDivingProfile', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="constant-weight">Constant Weight (CWT)</option>
                    <option value="free-immersion">Free Immersion (FIM)</option>
                    <option value="variable-weight">Variable Weight (VWT)</option>
                    <option value="no-limits">No Limits (NLT)</option>
                  </select>
                  
                  <div className="mt-3 p-3 bg-purple-50 rounded-lg text-sm text-purple-800">
                    {inputs.deepDivingProfile === 'constant-weight' && (
                      <p>Optimized for Constant Weight: Balanced weighting for efficient descent and controlled ascent</p>
                    )}
                    {inputs.deepDivingProfile === 'free-immersion' && (
                      <p>Optimized for Free Immersion: Slightly negative at depth for efficient rope pulling technique</p>
                    )}
                    {inputs.deepDivingProfile === 'variable-weight' && (
                      <p>Optimized for Variable Weight: Considers drop weight and slightly positive buoyancy for ascent</p>
                    )}
                    {inputs.deepDivingProfile === 'no-limits' && (
                      <p>Optimized for No Limits: Maximum negative descent with sled and positive ascent with lift bag</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BuoyancyInputs;