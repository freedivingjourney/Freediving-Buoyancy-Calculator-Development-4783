import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import BuoyancyInputs from './BuoyancyInputs';
import BuoyancyResults from './BuoyancyResults';
import BMICard from './BMICard';
import BuoyancyGauge from './BuoyancyGauge';
import HistoryTracking from './HistoryTracking';
import InstructorMode from './InstructorMode';
import { calculateBuoyancy } from '../utils/buoyancyCalculations';

const BuoyancyCalculator = () => {
  const [userInputs, setUserInputs] = useState({
    weight: 72,
    height: 173,
    gender: 'male',
    bodyType: 'average',
    wetsuitThickness: 2,
    weightBelt: 2,  // Updated to 2kg based on real-world calibration
    weightBeltUnit: 'kg',
    neckWeight: 0,
    neckWeightUnit: 'kg',
    waterType: 'saltwater',
    targetDepth: 11, // Updated to optimal target depth
    lungCapacity: 5.0  // Updated to 5L based on real-world calibration
  });
  
  const [results, setResults] = useState(null);
  const [instructorMode, setInstructorMode] = useState(false);
  const [history, setHistory] = useState([]);

  // Update lung capacity when gender or body type changes
  useEffect(() => {
    const newLungCapacity = calculateDefaultLungCapacity(userInputs.gender, userInputs.bodyType);
    setUserInputs(prev => ({
      ...prev,
      lungCapacity: newLungCapacity
    }));
  }, [userInputs.gender, userInputs.bodyType]);

  useEffect(() => {
    const calculatedResults = calculateBuoyancy(userInputs);
    setResults(calculatedResults);
  }, [userInputs]);

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

  const handleInputChange = (field, value) => {
    setUserInputs(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const saveToHistory = () => {
    const entry = {
      id: Date.now(),
      date: new Date().toISOString(),
      inputs: {...userInputs},
      results: {...results}
    };
    setHistory(prev => [entry, ...prev.slice(0, 9)]);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Freediving Buoyancy Calculator</h1>
        <p className="text-lg text-gray-600">
          Calculate optimal ballast weight for neutral buoyancy at target depth (10-12m saltwater)
        </p>
        <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700">
          <strong>Enhanced Guidance:</strong> This calculator provides baseline ballast weight recommendations (1kg per 1mm wetsuit thickness) 
          and targets neutral buoyancy at 10-12m in saltwater (5-7m in freshwater). 
          <strong> Always conduct in-water testing</strong> and adjust based on personal buoyancy, water salinity, and body composition variations.
        </div>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left Column - Inputs */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="xl:col-span-1"
        >
          <div className="space-y-6">
            <BMICard weight={userInputs.weight} height={userInputs.height} />
            <BuoyancyInputs 
              inputs={userInputs} 
              onChange={handleInputChange} 
              calculateDefaultLungCapacity={calculateDefaultLungCapacity}
            />
            {instructorMode && (
              <InstructorMode 
                inputs={userInputs} 
                onChange={handleInputChange}
                results={results}
              />
            )}
          </div>
        </motion.div>

        {/* Center Column - Results */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="xl:col-span-1"
        >
          <div className="space-y-6">
            <BuoyancyGauge results={results} />
            <BuoyancyResults 
              results={results} 
              onSave={saveToHistory}
              instructorMode={instructorMode}
              onToggleInstructor={() => setInstructorMode(!instructorMode)}
            />
          </div>
        </motion.div>

        {/* Right Column - History */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="xl:col-span-1"
        >
          <HistoryTracking history={history} />
        </motion.div>
      </div>
    </div>
  );
};

export default BuoyancyCalculator;