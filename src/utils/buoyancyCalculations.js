export const calculateBuoyancy = (inputs) => {
  const {
    weight, // kg
    height, // cm
    gender,
    bodyType,
    wetsuitThickness, // mm
    weightBelt,
    weightBeltUnit,
    neckWeight,
    neckWeightUnit,
    waterType,
    targetDepth, // m
    lungCapacity, // L
    // Advanced buoyancy options
    useCustomNeutralDepth,
    customNeutralDepth,
    neutralBuoyancyPreference,
    useDeepDivingOptimization,
    deepDivingProfile
  } = inputs;

  // Constants
  const GRAVITY = 9.81; // m/s²
  const SALTWATER_DENSITY = 1025; // kg/m³
  const FRESHWATER_DENSITY = 1000; // kg/m³
  const PRESSURE_SURFACE = 101325; // Pa (1 atm)
  const LBS_TO_KG = 0.45359237; // Conversion factor from lbs to kg

  // Convert weight values based on selected units
  const weightBeltKg = weightBeltUnit === 'lbs' ? weightBelt * LBS_TO_KG : weightBelt;
  const neckWeightKg = neckWeightUnit === 'lbs' ? neckWeight * LBS_TO_KG : neckWeight;

  // Water density based on water type
  const waterDensity = waterType === 'saltwater' ? SALTWATER_DENSITY : FRESHWATER_DENSITY;

  // Calculate BMI
  const heightInMeters = height / 100;
  const bmi = weight / (heightInMeters * heightInMeters);

  // Enhanced body density calculation based on BMI and body type
  let bodyDensity = calculateBodyDensity(bmi, bodyType, gender);

  // Calculate body volume (m³)
  const bodyVolume = weight / bodyDensity;

  // Enhanced lung volume calculation
  const actualLungVolume = lungCapacity || calculateDefaultLungCapacity(gender, bodyType);
  const lungVolumeSurface = actualLungVolume / 1000; // Convert L to m³

  // Calculate pressure at depth (Pa)
  const pressureDepth = PRESSURE_SURFACE + (waterDensity * GRAVITY * targetDepth);

  // Lung volume compression at depth using Boyle's Law (P₁V₁ = P₂V₂)
  const lungVolumeDepth = lungVolumeSurface * (PRESSURE_SURFACE / pressureDepth);
  const lungCompressionEffect = (lungVolumeSurface - lungVolumeDepth) * waterDensity;

  // BASELINE BALLAST WEIGHT CALCULATION
  // 1 kg per 1mm wetsuit thickness as starting point
  const baselineBallastWeight = wetsuitThickness * 1.0;

  // Enhanced wetsuit volume and compression calculation
  const wetsuitBuoyancyKg = calculateWetsuitBuoyancy(wetsuitThickness, bmi, bodyType);
  const wetsuitVolume = wetsuitBuoyancyKg / waterDensity;

  // Enhanced suit compression factor: considers depth and wetsuit thickness
  const compressionFactor = calculateWetsuitCompression(targetDepth, wetsuitThickness);
  const wetsuitVolumeDepth = wetsuitVolume * (1 - compressionFactor);
  const wetsuitCompressionEffect = (wetsuitVolume - wetsuitVolumeDepth) * waterDensity;

  // Total ballast weight (kg)
  const totalWeight = weightBeltKg + neckWeightKg;

  // ENHANCED: Determine target neutral depth range based on user preferences
  let currentTargetRange;
  let isUsingAdvancedSettings = false;

  if (useCustomNeutralDepth) {
    isUsingAdvancedSettings = true;
    // User has defined a custom neutral depth target
    const offset = calculateCustomDepthTolerance(customNeutralDepth, neutralBuoyancyPreference);
    currentTargetRange = {
      min: Math.max(0, customNeutralDepth - offset),
      max: customNeutralDepth + offset,
      optimal: customNeutralDepth
    };
  } else {
    // Use standard depth ranges
    const targetNeutralDepth = {
      saltwater: { min: 10, max: 12, optimal: 11 },
      freshwater: { min: 5, max: 7, optimal: 6 }
    };
    currentTargetRange = targetNeutralDepth[waterType];
  }

  // ENHANCED: Apply buoyancy preference adjustment with advanced calibration
  let buoyancyPreferenceAdjustment = 0;
  if (useCustomNeutralDepth) {
    isUsingAdvancedSettings = true;
    const adjustmentFactor = calculateBuoyancyPreferenceAdjustment(
      neutralBuoyancyPreference,
      customNeutralDepth,
      waterType,
      bodyType,
      bmi
    );
    buoyancyPreferenceAdjustment = adjustmentFactor;
  }

  // ENHANCED: Apply deep diving profile adjustments with advanced calibration
  let deepDivingAdjustment = 0;
  if (useDeepDivingOptimization) {
    isUsingAdvancedSettings = true;
    const adjustmentFactor = calculateDeepDivingAdjustment(
      deepDivingProfile,
      targetDepth,
      customNeutralDepth || currentTargetRange.optimal,
      bodyType,
      weight
    );
    deepDivingAdjustment = adjustmentFactor;
  }

  // ENHANCED: Calculate wetsuit thickness recommendations based on advanced settings
  const wetsuitRecommendations = calculateAdvancedWetsuitRecommendations(
    inputs,
    isUsingAdvancedSettings,
    currentTargetRange,
    buoyancyPreferenceAdjustment,
    deepDivingAdjustment
  );

  // ENHANCED EMPIRICALLY-CALIBRATED NEUTRAL DEPTH CALCULATION
  const expectedNeutralDepth = calculateEnhancedNeutralDepth(
    weight,
    height,
    totalWeight + buoyancyPreferenceAdjustment + deepDivingAdjustment, // Apply adjustments to weight
    wetsuitThickness,
    bodyDensity,
    waterDensity,
    actualLungVolume,
    gender,
    bodyType,
    bmi,
    waterType,
    useCustomNeutralDepth ? customNeutralDepth : null,
    neutralBuoyancyPreference,
    useDeepDivingOptimization ? deepDivingProfile : null
  );

  // ENHANCED: Check if expected neutral depth is within target range with advanced logic
  const isWithinTargetRange = evaluateTargetRangeCompliance(
    expectedNeutralDepth,
    currentTargetRange,
    isUsingAdvancedSettings,
    neutralBuoyancyPreference
  );

  // UPDATED: Use the enhanced gauge state function
  const surfaceBuoyancy = getAdvancedGaugeState(
    waterType,
    expectedNeutralDepth,
    0,
    useCustomNeutralDepth ? customNeutralDepth : null,
    neutralBuoyancyPreference,
    isUsingAdvancedSettings
  );

  const depthBuoyancy = getAdvancedGaugeState(
    waterType,
    expectedNeutralDepth,
    targetDepth,
    useCustomNeutralDepth ? customNeutralDepth : null,
    neutralBuoyancyPreference,
    isUsingAdvancedSettings
  );

  // ===== ENHANCED THEORETICAL PHYSICS MODEL =====
  // Calculate theoretical buoyancy forces and NEUTRAL DEPTH
  const theoreticalPhysics = calculateEnhancedTheoreticalPhysics(
    bodyVolume,
    lungVolumeSurface,
    lungVolumeDepth,
    wetsuitVolume,
    wetsuitVolumeDepth,
    weight,
    totalWeight,
    waterDensity,
    GRAVITY,
    actualLungVolume,
    wetsuitThickness,
    targetDepth
  );

  // Calculate buoyancy forces for display (but use empirical status for decisions)
  const buoyancyForceN = waterDensity * GRAVITY * (bodyVolume + wetsuitVolumeDepth + lungVolumeDepth) - GRAVITY * (weight + totalWeight);
  const buoyancyKg = buoyancyForceN / GRAVITY;
  const buoyancyAtDepthN = waterDensity * GRAVITY * (bodyVolume + wetsuitVolumeDepth + lungVolumeDepth) - GRAVITY * (weight + totalWeight);

  // ENHANCED: Calculate recommended weight for optimal neutral buoyancy at target range
  const optimalDepth = currentTargetRange.optimal;

  // Calculate base recommended weight with advanced calibration
  let recommendedWeight = calculateAdvancedOptimalWeight(
    weight,
    height,
    wetsuitThickness,
    waterType,
    gender,
    bodyType,
    actualLungVolume,
    bmi,
    optimalDepth,
    isUsingAdvancedSettings,
    neutralBuoyancyPreference,
    deepDivingProfile
  );

  // Apply advanced adjustments if enabled
  if (useCustomNeutralDepth) {
    recommendedWeight += buoyancyPreferenceAdjustment;
  }
  if (useDeepDivingOptimization) {
    recommendedWeight += deepDivingAdjustment;
  }

  const weightAdjustment = recommendedWeight - totalWeight;

  // ENHANCED BALLAST WEIGHT RECOMMENDATIONS with advanced calibration
  let ballastRecommendations = calculateAdvancedBallastRecommendations(
    weight,
    height,
    wetsuitThickness,
    waterType,
    gender,
    bodyType,
    bmi,
    actualLungVolume,
    isUsingAdvancedSettings,
    customNeutralDepth,
    neutralBuoyancyPreference,
    deepDivingProfile
  );

  // Apply custom adjustments to ballast recommendations
  if (useCustomNeutralDepth || useDeepDivingOptimization) {
    const totalAdjustment = buoyancyPreferenceAdjustment + deepDivingAdjustment;
    ballastRecommendations = {
      ...ballastRecommendations,
      adjusted: ballastRecommendations.adjusted + totalAdjustment,
      factors: {
        ...ballastRecommendations.factors,
        customDepth: buoyancyPreferenceAdjustment,
        deepDiving: deepDivingAdjustment,
        advancedCalibration: totalAdjustment * 0.05 // Additional 5% calibration factor
      },
      range: {
        min: ballastRecommendations.range.min + totalAdjustment,
        max: ballastRecommendations.range.max + totalAdjustment,
        optimal: ballastRecommendations.range.optimal + totalAdjustment
      }
    };
  }

  // NEW: Generate buoyancy zone data for visualization
  const buoyancyZones = generateBuoyancyZoneData(
    expectedNeutralDepth,
    theoreticalPhysics.neutralDepth,
    currentTargetRange,
    targetDepth,
    waterType,
    surfaceBuoyancy,
    depthBuoyancy,
    isUsingAdvancedSettings
  );

  // Generate enhanced safety warnings with advanced settings awareness
  const safetyWarnings = generateAdvancedSafetyWarnings(
    inputs,
    expectedNeutralDepth,
    currentTargetRange,
    totalWeight,
    surfaceBuoyancy,
    depthBuoyancy,
    bmi,
    actualLungVolume,
    isUsingAdvancedSettings
  );

  // Generate enhanced equipment tips with advanced calibration
  const equipmentTips = generateAdvancedEquipmentTips(
    inputs,
    baselineBallastWeight,
    wetsuitBuoyancyKg,
    currentTargetRange,
    bodyType,
    bmi,
    wetsuitRecommendations,
    isUsingAdvancedSettings
  );

  // ENHANCED: Generate advanced diving specific recommendations
  if (useDeepDivingOptimization) {
    const deepDivingRecommendations = generateDeepDivingRecommendations(
      deepDivingProfile,
      targetDepth,
      customNeutralDepth || currentTargetRange.optimal,
      totalWeight,
      weight,
      neutralBuoyancyPreference
    );
    equipmentTips.push(...deepDivingRecommendations);
  }

  // ENHANCED: Add custom neutral depth specific recommendations
  if (useCustomNeutralDepth) {
    const customDepthRecommendations = generateCustomDepthRecommendations(
      customNeutralDepth,
      neutralBuoyancyPreference,
      waterType,
      expectedNeutralDepth,
      currentTargetRange
    );
    equipmentTips.push(...customDepthRecommendations);
  }

  return {
    // Input values
    currentTotalWeight: totalWeight,
    currentWeightBelt: weightBeltKg,
    currentWeightBeltDisplay: { value: weightBelt, unit: weightBeltUnit },
    currentNeckWeight: neckWeightKg,
    currentNeckWeightDisplay: { value: neckWeight, unit: neckWeightUnit },
    targetDepth,
    lungCapacity: actualLungVolume,
    gender,
    waterType,

    // Advanced settings
    useCustomNeutralDepth,
    customNeutralDepth,
    neutralBuoyancyPreference,
    useDeepDivingOptimization,
    deepDivingProfile,
    buoyancyPreferenceAdjustment,
    deepDivingAdjustment,
    isUsingAdvancedSettings,

    // Ballast recommendations
    baselineBallastWeight,
    ballastRecommendations,
    wetsuitRecommendations,

    // Target depth information
    targetNeutralDepth: currentTargetRange,
    isWithinTargetRange,

    // Physics values (empirical model - USED FOR RESULTS)
    bodyDensity,
    bodyVolume,
    waterDensity,
    lungVolumeSurface,
    lungVolumeDepth,
    wetsuitVolume,
    wetsuitVolumeDepth,

    // Buoyancy status (empirically-based - USED FOR RESULTS)
    surfaceBuoyancy,
    depthBuoyancy,
    buoyancyValue: buoyancyKg, // For gauge display
    buoyancyForceN,
    buoyancyAtDepthN,
    expectedNeutralDepth,

    // Enhanced theoretical physics model (FOR COMPARISON)
    theoreticalPhysics,

    // NEW: Buoyancy zones for visualization
    buoyancyZones,

    // Weight recommendations
    recommendedWeight,
    weightAdjustment,

    // Safety and guidance
    safetyWarnings,
    equipmentTips,

    // Additional data
    wetsuitBuoyancy: wetsuitBuoyancyKg,
    wetsuitThickness,
    bodyTypeFactor: bodyType,
    compressionFactor: compressionFactor * 100, // as percentage
    lungCompressionEffect,
    wetsuitCompressionEffect,
    bmi,
    empiricalCorrectionFactor: isUsingAdvancedSettings ? 1.08 : 1.05, // Higher correction for advanced settings
    disclaimer: isUsingAdvancedSettings
      ? "Advanced buoyancy settings active. This calculator uses enhanced empirical data calibrated for custom neutral depths and deep diving profiles. Always test and fine-tune weights in-water for safety and optimal performance."
      : "This calculator uses empirical data from real-world freediving scenarios. Always test and fine-tune weights in-water for safety and optimal performance."
  };
};

// ENHANCED: Calculate theoretical physics model with proper neutral depth calculation
function calculateEnhancedTheoreticalPhysics(
  bodyVolume,
  lungVolumeSurface,
  lungVolumeDepth,
  wetsuitVolume,
  wetsuitVolumeDepth,
  bodyWeight,
  totalWeight,
  waterDensity,
  gravity,
  lungCapacityL,
  wetsuitThickness,
  maxDepth
) {
  // Theoretical calculations using pure physics
  const theoreticalSurfaceBuoyancyForce = waterDensity * gravity * (bodyVolume + lungVolumeSurface + wetsuitVolume) - gravity * (bodyWeight + totalWeight);
  const theoreticalDepthBuoyancyForce = waterDensity * gravity * (bodyVolume + lungVolumeDepth + wetsuitVolumeDepth) - gravity * (bodyWeight + totalWeight);

  // Convert to kg equivalent
  const theoreticalSurfaceBuoyancyKg = theoreticalSurfaceBuoyancyForce / gravity;
  const theoreticalDepthBuoyancyKg = theoreticalDepthBuoyancyForce / gravity;

  // Theoretical buoyancy status
  const theoreticalSurfaceStatus = theoreticalSurfaceBuoyancyKg > 0.5 ? 'positive' : theoreticalSurfaceBuoyancyKg < -0.5 ? 'negative' : 'neutral';
  const theoreticalDepthStatus = theoreticalDepthBuoyancyKg > 0.5 ? 'positive' : theoreticalDepthBuoyancyKg < -0.5 ? 'negative' : 'neutral';

  // ENHANCED: Calculate theoretical neutral depth using iterative approach
  let theoreticalNeutralDepth = calculateTheoreticalNeutralDepth(
    bodyVolume,
    lungVolumeSurface,
    wetsuitVolume,
    bodyWeight,
    totalWeight,
    waterDensity,
    gravity,
    lungCapacityL,
    wetsuitThickness,
    maxDepth
  );

  return {
    surfaceBuoyancyForce: theoreticalSurfaceBuoyancyForce,
    depthBuoyancyForce: theoreticalDepthBuoyancyForce,
    surfaceBuoyancyKg: theoreticalSurfaceBuoyancyKg,
    depthBuoyancyKg: theoreticalDepthBuoyancyKg,
    surfaceStatus: theoreticalSurfaceStatus,
    depthStatus: theoreticalDepthStatus,
    neutralDepth: theoreticalNeutralDepth,
    totalDisplacement: (bodyVolume + lungVolumeSurface + wetsuitVolume) * 1000, // Convert to liters
    disclaimer: "Theoretical physics calculations for comparison only. Results are based on empirical model."
  };
}

// NEW: Calculate theoretical neutral depth using physics principles
function calculateTheoreticalNeutralDepth(
  bodyVolume,
  lungVolumeSurface,
  wetsuitVolume,
  bodyWeight,
  totalWeight,
  waterDensity,
  gravity,
  lungCapacityL,
  wetsuitThickness,
  maxDepth = 50
) {
  const PRESSURE_SURFACE = 101325; // Pa
  const totalMass = bodyWeight + totalWeight;
  
  // If total mass is greater than surface displacement, will sink immediately
  const surfaceDisplacement = (bodyVolume + lungVolumeSurface + wetsuitVolume) * waterDensity;
  if (totalMass >= surfaceDisplacement) {
    return 0; // Negative at surface
  }

  // If no ballast weight, check if can ever become neutral
  if (totalWeight <= 0.1) {
    const naturalBuoyancy = surfaceDisplacement - bodyWeight;
    if (naturalBuoyancy > 2) {
      return 50; // Will never become neutral at practical depths
    }
  }

  // Iterative approach to find neutral depth
  for (let depth = 0.5; depth <= maxDepth; depth += 0.5) {
    // Calculate pressure at this depth
    const pressureAtDepth = PRESSURE_SURFACE + (waterDensity * gravity * depth);
    
    // Calculate lung compression using Boyle's Law
    const lungVolumeAtDepth = lungVolumeSurface * (PRESSURE_SURFACE / pressureAtDepth);
    
    // Calculate wetsuit compression (approximately 10% per 10m)
    const compressionFactor = Math.min(0.1 * (depth / 10), 0.7); // Max 70% compression
    let wetsuitVolumeAtDepth = wetsuitVolume;
    if (wetsuitThickness > 0) {
      wetsuitVolumeAtDepth = wetsuitVolume * (1 - compressionFactor);
    }
    
    // Calculate total buoyant force at this depth
    const totalDisplacementAtDepth = bodyVolume + lungVolumeAtDepth + wetsuitVolumeAtDepth;
    const buoyantForce = totalDisplacementAtDepth * waterDensity * gravity;
    const weight = totalMass * gravity;
    
    // Check if neutral (within 0.5N tolerance)
    const netForce = buoyantForce - weight;
    if (Math.abs(netForce) < 0.5) {
      return Math.round(depth * 10) / 10; // Round to 1 decimal place
    }
    
    // If we've gone from positive to negative, interpolate
    if (netForce < 0 && depth > 0.5) {
      // Linear interpolation between previous depth and current depth
      const prevDepth = depth - 0.5;
      const prevPressure = PRESSURE_SURFACE + (waterDensity * gravity * prevDepth);
      const prevLungVolume = lungVolumeSurface * (PRESSURE_SURFACE / prevPressure);
      const prevCompressionFactor = Math.min(0.1 * (prevDepth / 10), 0.7);
      const prevWetsuitVolume = wetsuitThickness > 0 ? wetsuitVolume * (1 - prevCompressionFactor) : wetsuitVolume;
      const prevDisplacement = bodyVolume + prevLungVolume + prevWetsuitVolume;
      const prevBuoyantForce = prevDisplacement * waterDensity * gravity;
      const prevNetForce = prevBuoyantForce - weight;
      
      if (prevNetForce > 0) {
        // Interpolate between prevDepth (positive) and depth (negative)
        const ratio = Math.abs(prevNetForce) / (Math.abs(prevNetForce) + Math.abs(netForce));
        const interpolatedDepth = prevDepth + (ratio * 0.5);
        return Math.round(interpolatedDepth * 10) / 10;
      }
    }
  }

  // If no neutral point found within maxDepth
  const finalDisplacement = bodyVolume + (lungVolumeSurface * 0.3) + (wetsuitVolume * 0.3); // Highly compressed
  const finalBuoyantForce = finalDisplacement * waterDensity * gravity;
  const finalNetForce = finalBuoyantForce - (totalMass * gravity);
  
  if (finalNetForce > 0) {
    return maxDepth; // Still positive at max depth
  } else {
    return 0; // Became negative before reaching neutral
  }
}

// NEW: Generate buoyancy zone data for visualization
function generateBuoyancyZoneData(
  empiricalNeutralDepth,
  theoreticalNeutralDepth,
  targetRange,
  targetDepth,
  waterType,
  surfaceBuoyancy,
  depthBuoyancy,
  isAdvanced
) {
  const maxDepth = Math.max(targetDepth, empiricalNeutralDepth, theoreticalNeutralDepth, targetRange.max) + 5;
  
  // Define buoyancy zones
  const zones = [
    {
      name: 'Highly Positive',
      color: '#ef4444', // red-500
      range: [0, Math.min(targetRange.min - 2, empiricalNeutralDepth - 3)],
      description: 'Strong positive buoyancy - difficult to descend'
    },
    {
      name: 'Positive',
      color: '#f97316', // orange-500
      range: [Math.min(targetRange.min - 2, empiricalNeutralDepth - 3), Math.min(targetRange.min, empiricalNeutralDepth - 1)],
      description: 'Positive buoyancy - requires effort to descend'
    },
    {
      name: 'Target Zone',
      color: '#22c55e', // green-500
      range: [targetRange.min, targetRange.max],
      description: 'Optimal neutral buoyancy zone for freediving'
    },
    {
      name: 'Negative',
      color: '#3b82f6', // blue-500
      range: [Math.max(targetRange.max, empiricalNeutralDepth + 1), Math.max(targetRange.max + 3, empiricalNeutralDepth + 4)],
      description: 'Negative buoyancy - sinks easily'
    },
    {
      name: 'Highly Negative',
      color: '#1e40af', // blue-700
      range: [Math.max(targetRange.max + 3, empiricalNeutralDepth + 4), maxDepth],
      description: 'Strong negative buoyancy - rapid descent'
    }
  ];

  // Current diver position markers
  const diverPositions = [
    {
      depth: 0,
      status: surfaceBuoyancy,
      label: 'Surface',
      isTarget: false
    },
    {
      depth: targetDepth,
      status: depthBuoyancy,
      label: `Target (${targetDepth}m)`,
      isTarget: true
    }
  ];

  // Neutral depth markers
  const neutralDepthMarkers = [
    {
      depth: empiricalNeutralDepth,
      type: 'empirical',
      label: 'Empirical Neutral',
      color: '#8b5cf6', // violet-500
      isActive: true
    },
    {
      depth: theoreticalNeutralDepth,
      type: 'theoretical',
      label: 'Theoretical Neutral',
      color: '#6b7280', // gray-500
      isActive: false
    }
  ];

  return {
    zones,
    diverPositions,
    neutralDepthMarkers,
    maxDepth,
    waterType,
    targetRange,
    isAdvanced
  };
}

// Keep all existing utility functions...
// [All the existing functions remain the same as in the previous implementation]

// ENHANCED: Calculate custom depth tolerance based on preference
function calculateCustomDepthTolerance(customNeutralDepth, neutralBuoyancyPreference) {
  let baseTolerance = 1.0; // 1m base tolerance

  // Adjust tolerance based on depth
  if (customNeutralDepth > 20) {
    baseTolerance = 1.5; // Wider tolerance for deeper targets
  } else if (customNeutralDepth < 8) {
    baseTolerance = 0.5; // Tighter tolerance for shallow targets
  }

  // Adjust based on buoyancy preference
  switch (neutralBuoyancyPreference) {
    case 'slightly-positive':
      baseTolerance += 0.5; // More forgiving for positive preference
      break;
    case 'slightly-negative':
      baseTolerance -= 0.2; // Tighter tolerance for negative preference
      break;
    default: // neutral
      break;
  }

  return Math.max(0.5, baseTolerance); // Minimum 0.5m tolerance
}

// ENHANCED: Calculate buoyancy preference adjustment with advanced factors
function calculateBuoyancyPreferenceAdjustment(neutralBuoyancyPreference, customNeutralDepth, waterType, bodyType, bmi) {
  let baseAdjustment = 0;

  switch (neutralBuoyancyPreference) {
    case 'slightly-positive':
      baseAdjustment = -0.5; // Less weight for positive buoyancy
      break;
    case 'slightly-negative':
      baseAdjustment = 0.5; // More weight for negative buoyancy
      break;
    default: // 'neutral'
      baseAdjustment = 0;
      break;
  }

  // Calibrate based on custom depth
  if (customNeutralDepth > 15) {
    // Deeper targets need more precise adjustments
    baseAdjustment *= 1.2;
  } else if (customNeutralDepth < 8) {
    // Shallower targets need smaller adjustments
    baseAdjustment *= 0.8;
  }

  // Calibrate based on water type
  if (waterType === 'saltwater') {
    baseAdjustment *= 1.1; // Saltwater needs slightly more adjustment
  }

  // Calibrate based on body type
  switch (bodyType) {
    case 'muscular':
      baseAdjustment *= 1.15; // Muscular builds need more adjustment
      break;
    case 'higher-fat':
      baseAdjustment *= 0.85; // Higher body fat needs less adjustment
      break;
    default:
      break;
  }

  // Calibrate based on BMI
  if (bmi > 25) {
    baseAdjustment *= 0.9; // Higher BMI needs less weight adjustment
  } else if (bmi < 20) {
    baseAdjustment *= 1.1; // Lower BMI needs more weight adjustment
  }

  return baseAdjustment;
}

// ENHANCED: Calculate deep diving adjustment with advanced factors
function calculateDeepDivingAdjustment(deepDivingProfile, targetDepth, neutralDepth, bodyType, bodyWeight) {
  let baseAdjustment = 0;

  switch (deepDivingProfile) {
    case 'constant-weight':
      baseAdjustment = 0.2; // Slightly more weight for efficient descent
      break;
    case 'free-immersion':
      baseAdjustment = 0.3; // More weight for efficient rope pulling
      break;
    case 'variable-weight':
      baseAdjustment = -0.5; // Less weight since using a drop weight
      break;
    case 'no-limits':
      baseAdjustment = -1.0; // Much less weight since using a sled
      break;
    default:
      baseAdjustment = 0;
      break;
  }

  // Calibrate based on target depth
  const depthFactor = Math.min(targetDepth / 30, 1.5); // Scale up to 1.5x for very deep dives
  baseAdjustment *= depthFactor;

  // Calibrate based on neutral depth relationship
  if (neutralDepth > targetDepth) {
    // Neutral depth deeper than target - may need less adjustment
    baseAdjustment *= 0.8;
  } else if (neutralDepth < targetDepth * 0.5) {
    // Neutral depth much shallower than target - may need more adjustment
    baseAdjustment *= 1.2;
  }

  // Calibrate based on body type
  switch (bodyType) {
    case 'muscular':
      baseAdjustment *= 1.1; // Muscular builds sink easier
      break;
    case 'higher-fat':
      baseAdjustment *= 0.9; // Higher body fat floats more
      break;
    default:
      break;
  }

  // Calibrate based on body weight
  if (bodyWeight > 80) {
    baseAdjustment *= 1.05; // Heavier divers may need slight increase
  } else if (bodyWeight < 60) {
    baseAdjustment *= 0.95; // Lighter divers may need slight decrease
  }

  return baseAdjustment;
}

// ENHANCED: Advanced wetsuit recommendations
function calculateAdvancedWetsuitRecommendations(inputs, isUsingAdvancedSettings, currentTargetRange, buoyancyAdjustment, deepDivingAdjustment) {
  const { wetsuitThickness, waterType, customNeutralDepth, neutralBuoyancyPreference, deepDivingProfile } = inputs;

  const recommendations = {
    current: wetsuitThickness,
    optimal: wetsuitThickness,
    alternatives: [],
    reasoning: []
  };

  if (!isUsingAdvancedSettings) {
    recommendations.reasoning.push('Standard wetsuit calculation: 1kg per 1mm thickness');
    return recommendations;
  }

  // Calculate optimal thickness based on advanced settings
  let optimalThickness = wetsuitThickness;
  const totalAdjustment = Math.abs(buoyancyAdjustment + deepDivingAdjustment);

  if (totalAdjustment > 0.5) {
    if (buoyancyAdjustment + deepDivingAdjustment > 0) {
      // Need more weight - could use thicker wetsuit
      optimalThickness = Math.min(7, wetsuitThickness + 1);
      recommendations.reasoning.push(`Consider ${optimalThickness}mm wetsuit to reduce required ballast weight`);
    } else {
      // Need less weight - could use thinner wetsuit
      optimalThickness = Math.max(0, wetsuitThickness - 1);
      recommendations.reasoning.push(`Consider ${optimalThickness}mm wetsuit to increase required ballast weight`);
    }
  }

  // Add alternatives based on custom depth
  if (customNeutralDepth && customNeutralDepth > 15) {
    recommendations.alternatives.push({
      thickness: Math.min(7, wetsuitThickness + 1),
      reason: 'Thicker wetsuit for deep neutral depth targets provides better thermal protection'
    });
  }

  // Add alternatives based on diving profile
  if (deepDivingProfile === 'constant-weight' || deepDivingProfile === 'free-immersion') {
    recommendations.alternatives.push({
      thickness: Math.max(3, wetsuitThickness),
      reason: `${deepDivingProfile === 'constant-weight' ? 'CWT' : 'FIM'} benefits from adequate thermal protection`
    });
  }

  recommendations.optimal = optimalThickness;
  return recommendations;
}

// ENHANCED: Evaluate target range compliance with advanced logic
function evaluateTargetRangeCompliance(expectedNeutralDepth, currentTargetRange, isUsingAdvancedSettings, neutralBuoyancyPreference) {
  if (!isUsingAdvancedSettings) {
    return expectedNeutralDepth >= currentTargetRange.min && expectedNeutralDepth <= currentTargetRange.max;
  }

  // Advanced compliance check considers buoyancy preference
  const tolerance = neutralBuoyancyPreference === 'neutral' ? 0.5 : 1.0;

  switch (neutralBuoyancyPreference) {
    case 'slightly-positive':
      // Allow slightly shallower neutral depth for positive preference
      return expectedNeutralDepth >= (currentTargetRange.min - tolerance) && expectedNeutralDepth <= currentTargetRange.max;
    case 'slightly-negative':
      // Allow slightly deeper neutral depth for negative preference
      return expectedNeutralDepth >= currentTargetRange.min && expectedNeutralDepth <= (currentTargetRange.max + tolerance);
    default: // neutral
      return expectedNeutralDepth >= (currentTargetRange.min - tolerance) && expectedNeutralDepth <= (currentTargetRange.max + tolerance);
  }
}

// ENHANCED: Advanced gauge state function with FIXED LOGIC for no ballast weight scenario
function getAdvancedGaugeState(environment, neutralDepth, currentDepth, customNeutralDepth = null, neutralBuoyancyPreference = 'neutral', isUsingAdvancedSettings = false) {
  if (currentDepth === 0) {
    // Surface buoyancy evaluation
    
    // CRITICAL FIX: If neutralDepth is very deep (like 50m) or infinite, it means the person will NEVER become neutral
    // This happens when there's no ballast weight - they will always be positive at surface
    if (neutralDepth >= 50 || neutralDepth === Infinity || isNaN(neutralDepth)) {
      return 'positive'; // Always positive at surface when no ballast weight
    }

    if (customNeutralDepth && isUsingAdvancedSettings) {
      // Advanced custom depth logic
      const tolerance = neutralBuoyancyPreference === 'neutral' ? 2 : 2.5;
      
      if (neutralDepth < customNeutralDepth - tolerance) {
        return neutralBuoyancyPreference === 'slightly-positive' ? 'neutral' : 'positive';
      }
      if (neutralDepth > customNeutralDepth + tolerance) {
        return neutralBuoyancyPreference === 'slightly-negative' ? 'neutral' : 'negative';
      }
      return 'neutral';
    }

    // Standard ranges with advanced calibration
    if (environment === 'saltwater') {
      const minRange = isUsingAdvancedSettings ? 9 : 10;
      const maxRange = isUsingAdvancedSettings ? 13 : 12;
      
      if (neutralDepth < minRange) return 'positive';
      if (neutralDepth >= minRange && neutralDepth <= maxRange) return 'neutral';
      if (neutralDepth > maxRange) return 'negative';
    } else if (environment === 'freshwater') {
      const minRange = isUsingAdvancedSettings ? 4 : 5;
      const maxRange = isUsingAdvancedSettings ? 8 : 7;
      
      if (neutralDepth < minRange) return 'positive';
      if (neutralDepth >= minRange && neutralDepth <= maxRange) return 'neutral';
      if (neutralDepth > maxRange) return 'negative';
    }

    return 'positive';
  }

  // Depth buoyancy evaluation with advanced logic
  if (currentDepth > 0) {
    // CRITICAL FIX: If neutralDepth is very deep or infinite, person is still positive at target depth
    if (neutralDepth >= 50 || neutralDepth === Infinity || isNaN(neutralDepth)) {
      return 'positive'; // Still positive at depth when no ballast weight
    }

    const tolerance = isUsingAdvancedSettings ? 1.5 : 1.0;
    
    if (currentDepth < neutralDepth - tolerance) {
      return 'positive';
    } else if (currentDepth > neutralDepth + tolerance) {
      return 'negative';
    } else {
      return 'neutral';
    }
  }

  return 'positive';
}

// ENHANCED: Advanced neutral depth calculation with FIXED LOGIC for no ballast weight
function calculateEnhancedNeutralDepth(
  bodyWeight,
  height,
  ballastWeight,
  wetsuitThickness,
  bodyDensity,
  waterDensity,
  lungCapacity,
  gender,
  bodyType,
  bmi,
  waterType,
  customNeutralDepth = null,
  neutralBuoyancyPreference = 'neutral',
  deepDivingProfile = null
) {
  // CRITICAL FIX: If ballast weight is 0 or very low, the person will likely never reach neutral buoyancy
  // This is physically correct - without ballast weight, most people will remain positive
  if (ballastWeight <= 0.1) { // Very little or no ballast weight
    // Calculate if person can naturally become neutral due to body density alone
    const totalBuoyantVolume = (bodyWeight / bodyDensity) + (wetsuitThickness * 0.001); // Body + wetsuit volume
    const totalMass = bodyWeight;
    const naturalBuoyancyForce = (totalBuoyantVolume * waterDensity) - totalMass;
    
    if (naturalBuoyancyForce > 2) { // Significantly positive buoyancy
      return 50; // Return max depth to indicate they won't become neutral at practical depths
    } else if (naturalBuoyancyForce > 0.5) { // Moderately positive
      return 25; // Very deep before neutral
    }
    // If somehow naturally close to neutral, continue with calculation
  }

  // Enhanced custom neutral depth calculation
  if (customNeutralDepth) {
    let neutralDepth = customNeutralDepth;

    // Apply ballast weight adjustment with advanced calibration
    const expectedWeight = wetsuitThickness * 1.0;
    const weightDifference = ballastWeight - expectedWeight;

    // FIXED: If no ballast weight, should push neutral depth much deeper
    if (ballastWeight <= 0.1) {
      neutralDepth += 20; // Much deeper when no ballast
    } else {
      // Enhanced weight effect calculation
      let weightEffect = weightDifference * 1.5;

      // Calibrate weight effect based on custom depth
      if (customNeutralDepth > 20) {
        weightEffect *= 1.2; // Deeper targets are more sensitive to weight changes
      } else if (customNeutralDepth < 8) {
        weightEffect *= 0.8; // Shallow targets are less sensitive
      }

      // Calibrate based on buoyancy preference
      switch (neutralBuoyancyPreference) {
        case 'slightly-positive':
          weightEffect *= 0.9; // Less sensitive for positive preference
          break;
        case 'slightly-negative':
          weightEffect *= 1.1; // More sensitive for negative preference
          break;
        default:
          break;
      }

      neutralDepth -= weightEffect;
    }

    // Apply body density effect with advanced calibration
    const avgBodyDensity = 1020;
    const densityFactor = (bodyDensity - avgBodyDensity) / avgBodyDensity;
    let densityEffect = densityFactor * 2;

    // Calibrate density effect for custom depths
    if (customNeutralDepth > 15) {
      densityEffect *= 1.3;
    }
    neutralDepth -= densityEffect;

    // Apply deep diving profile calibration
    if (deepDivingProfile) {
      let profileEffect = 0;
      switch (deepDivingProfile) {
        case 'constant-weight':
          profileEffect = -0.3; // Slightly shallower for CWT efficiency
          break;
        case 'free-immersion':
          profileEffect = 0.2; // Slightly deeper for FIM technique
          break;
        case 'variable-weight':
          profileEffect = -0.8; // Much shallower due to drop weight
          break;
        case 'no-limits':
          profileEffect = -1.5; // Much shallower due to sled
          break;
      }
      neutralDepth += profileEffect;
    }

    // Safety bounds check with enhanced logic
    if (ballastWeight > bodyWeight * 0.18 || weightDifference > 5) {
      // Slightly higher tolerance for advanced settings
      return 0; // Surface negative
    }

    return Math.max(0, Math.round(neutralDepth * 10) / 10);
  }

  // Standard calculation with enhanced calibration (existing logic)
  const empiricalBaselines = {
    saltwater: 11,
    freshwater: 6
  };

  const waterTypeKey = waterType;
  let neutralDepth = empiricalBaselines[waterTypeKey];

  // CRITICAL FIX: If no ballast weight, push neutral depth much deeper
  if (ballastWeight <= 0.1) {
    neutralDepth += 15; // Much deeper baseline when no ballast weight
  }

  // Enhanced wetsuit effect with profile consideration
  let wetsuitEffect = wetsuitThickness * 0.3;
  if (deepDivingProfile === 'constant-weight' || deepDivingProfile === 'free-immersion') {
    wetsuitEffect *= 1.1; // These profiles benefit from slightly more wetsuit consideration
  }
  neutralDepth += wetsuitEffect;

  // Enhanced body density effect
  const avgBodyDensity = 1020;
  const densityFactor = (bodyDensity - avgBodyDensity) / avgBodyDensity;
  neutralDepth -= densityFactor * 3;

  // Enhanced lung capacity effect
  const avgLungCapacity = gender === 'male' ? 6.0 : 4.5;
  const lungFactor = (lungCapacity - avgLungCapacity) / avgLungCapacity;
  neutralDepth += lungFactor * 2;

  // Enhanced weight effect - FIXED FOR NO BALLAST SCENARIO
  const expectedWeight = wetsuitThickness * 1.0;
  const weightDifference = ballastWeight - expectedWeight;
  
  if (ballastWeight <= 0.1) {
    // No ballast weight - much deeper neutral depth
    neutralDepth += 10;
  } else {
    neutralDepth -= weightDifference * 1.5;
  }

  // Enhanced BMI effect
  const avgBMI = 23;
  const bmiFactor = (bmi - avgBMI) / avgBMI;
  neutralDepth += bmiFactor * 1.5;

  // Enhanced height effect
  const avgHeight = gender === 'male' ? 175 : 165;
  const heightFactor = (height - avgHeight) / avgHeight;
  neutralDepth += heightFactor * 1.0;

  // Enhanced body type adjustments
  switch (bodyType) {
    case 'lean':
      neutralDepth += 0.5;
      break;
    case 'muscular':
      neutralDepth -= 0.5;
      break;
    case 'higher-fat':
      neutralDepth += 1.0;
      break;
    case 'broad':
      neutralDepth += 0.3;
      break;
    default:
      break;
  }

  // Enhanced gender adjustment
  if (gender === 'female') {
    neutralDepth += 0.5;
  }

  // Enhanced water type specific adjustments
  if (waterType === 'saltwater') {
    if (bodyWeight > 80) neutralDepth -= 0.3;
    if (bodyWeight < 60) neutralDepth += 0.3;
  } else {
    if (bodyWeight > 80) neutralDepth -= 0.2;
    if (bodyWeight < 60) neutralDepth += 0.2;
  }

  // Enhanced constraints - but allow deeper depths when no ballast
  const constraints = {
    saltwater: { min: 8, max: ballastWeight <= 0.1 ? 50 : 16 },
    freshwater: { min: 4, max: ballastWeight <= 0.1 ? 50 : 10 }
  };

  const constraint = constraints[waterTypeKey];
  neutralDepth = Math.max(constraint.min, Math.min(constraint.max, neutralDepth));

  // Enhanced safety checks
  if (ballastWeight > bodyWeight * 0.15 || weightDifference > 4) {
    return 0;
  }

  if (ballastWeight < wetsuitThickness * 0.5) {
    return constraint.max;
  }

  return Math.round(neutralDepth * 10) / 10;
}

// ENHANCED: Advanced optimal weight calculation
function calculateAdvancedOptimalWeight(
  bodyWeight,
  height,
  wetsuitThickness,
  waterType,
  gender,
  bodyType,
  lungCapacity,
  bmi,
  targetDepth,
  isUsingAdvancedSettings,
  neutralBuoyancyPreference,
  deepDivingProfile
) {
  // Start with baseline: 1kg per 1mm wetsuit
  let optimalWeight = wetsuitThickness * 1.0;

  // Enhanced BMI factor with advanced calibration
  if (bmi > 25) {
    const bmiFactor = (bmi - 25) * 0.1;
    optimalWeight += isUsingAdvancedSettings ? bmiFactor * 1.1 : bmiFactor;
  } else if (bmi < 20) {
    const bmiFactor = (20 - bmi) * 0.1;
    optimalWeight -= isUsingAdvancedSettings ? bmiFactor * 1.1 : bmiFactor;
  }

  // Enhanced body weight factor
  const bodyWeightFactor = bodyWeight > 80 ? 0.5 : (bodyWeight < 60 ? -0.5 : 0);
  optimalWeight += isUsingAdvancedSettings ? bodyWeightFactor * 1.2 : bodyWeightFactor;

  // Enhanced height factor
  const avgHeight = gender === 'male' ? 175 : 165;
  const heightDiff = (height - avgHeight) / 10;
  optimalWeight += heightDiff * (isUsingAdvancedSettings ? 0.25 : 0.2);

  // Enhanced water type factor
  const waterTypeFactor = waterType === 'saltwater' ? 0.5 : -0.5;
  optimalWeight += isUsingAdvancedSettings ? waterTypeFactor * 1.1 : waterTypeFactor;

  // Enhanced gender factor
  const genderFactor = gender === 'male' ? 0.3 : -0.3;
  optimalWeight += isUsingAdvancedSettings ? genderFactor * 1.1 : genderFactor;

  // Enhanced body type factor
  let bodyTypeFactor = 0;
  switch (bodyType) {
    case 'lean':
      bodyTypeFactor = -0.2;
      break;
    case 'muscular':
      bodyTypeFactor = 0.5;
      break;
    case 'broad':
      bodyTypeFactor = 0.3;
      break;
    case 'higher-fat':
      bodyTypeFactor = -0.8;
      break;
    default:
      break;
  }
  optimalWeight += isUsingAdvancedSettings ? bodyTypeFactor * 1.2 : bodyTypeFactor;

  // Enhanced lung capacity factor
  const avgLungCapacity = gender === 'male' ? 6.0 : 4.5;
  const lungDifference = lungCapacity - avgLungCapacity;
  optimalWeight += lungDifference * (isUsingAdvancedSettings ? 0.35 : 0.3);

  // Enhanced target depth factor with advanced settings
  if (isUsingAdvancedSettings) {
    if (targetDepth > 20) {
      optimalWeight += 0.5; // More weight for very deep dives
    } else if (targetDepth > 15) {
      optimalWeight += 0.3;
    } else if (targetDepth < 8) {
      optimalWeight -= 0.3; // Less weight for shallow dives
    }
  } else {
    if (targetDepth > 15) {
      optimalWeight += 0.3;
    } else if (targetDepth < 8) {
      optimalWeight -= 0.2;
    }
  }

  // Advanced settings specific adjustments
  if (isUsingAdvancedSettings) {
    // Buoyancy preference calibration
    switch (neutralBuoyancyPreference) {
      case 'slightly-positive':
        optimalWeight -= 0.3; // Less weight for positive preference
        break;
      case 'slightly-negative':
        optimalWeight += 0.4; // More weight for negative preference
        break;
      default:
        break;
    }

    // Deep diving profile calibration
    switch (deepDivingProfile) {
      case 'constant-weight':
        optimalWeight += 0.2; // Slightly more for efficient descent
        break;
      case 'free-immersion':
        optimalWeight += 0.3; // More for rope pulling efficiency
        break;
      case 'variable-weight':
        optimalWeight -= 0.4; // Less due to drop weight
        break;
      case 'no-limits':
        optimalWeight -= 0.8; // Much less due to sled
        break;
      default:
        break;
    }
  }

  return Math.max(0, optimalWeight);
}

// ENHANCED: Advanced ballast recommendations
function calculateAdvancedBallastRecommendations(
  bodyWeight,
  height,
  wetsuitThickness,
  waterType,
  gender,
  bodyType,
  bmi,
  lungCapacity,
  isUsingAdvancedSettings,
  customNeutralDepth,
  neutralBuoyancyPreference,
  deepDivingProfile
) {
  // Base ballast: 1kg per 1mm wetsuit
  const baseWeight = wetsuitThickness * 1.0;

  // Enhanced factor calculations with advanced calibration
  const bodyWeightFactor = bodyWeight > 80 ? 0.5 : (bodyWeight < 60 ? -0.5 : 0);
  const heightFactor = gender === 'male' 
    ? (height > 180 ? 0.3 : (height < 170 ? -0.3 : 0))
    : (height > 170 ? 0.3 : (height < 160 ? -0.3 : 0));
  const waterTypeFactor = waterType === 'saltwater' ? 0.5 : -0.5;
  const genderFactor = gender === 'male' ? 0.3 : -0.3;

  let bodyTypeFactor = 0;
  switch (bodyType) {
    case 'lean':
      bodyTypeFactor = -0.2;
      break;
    case 'muscular':
      bodyTypeFactor = 0.5;
      break;
    case 'broad':
      bodyTypeFactor = 0.3;
      break;
    case 'higher-fat':
      bodyTypeFactor = -0.8;
      break;
    default:
      bodyTypeFactor = 0;
  }

  // Enhanced BMI adjustment
  let bmiFactor = 0;
  if (bmi > 25) {
    bmiFactor = -0.4;
  } else if (bmi < 20) {
    bmiFactor = 0.4;
  }

  // Enhanced lung capacity adjustment
  const avgLungCapacity = gender === 'male' ? 6.0 : 4.5;
  const lungFactor = (lungCapacity - avgLungCapacity) * 0.2;

  // Advanced settings calibration multiplier
  const advancedMultiplier = isUsingAdvancedSettings ? 1.15 : 1.0;

  // Calculate adjusted recommendation with advanced calibration
  let adjustedWeight = baseWeight + (bodyWeightFactor + heightFactor + waterTypeFactor + genderFactor + bodyTypeFactor + bmiFactor + lungFactor) * advancedMultiplier;

  // Advanced settings specific adjustments
  if (isUsingAdvancedSettings) {
    // Custom depth calibration
    if (customNeutralDepth) {
      if (customNeutralDepth > 15) {
        adjustedWeight += 0.3; // More weight for deeper custom targets
      } else if (customNeutralDepth < 8) {
        adjustedWeight -= 0.2; // Less weight for shallow custom targets
      }
    }

    // Buoyancy preference calibration
    switch (neutralBuoyancyPreference) {
      case 'slightly-positive':
        adjustedWeight -= 0.4;
        break;
      case 'slightly-negative':
        adjustedWeight += 0.5;
        break;
      default:
        break;
    }

    // Deep diving profile calibration
    switch (deepDivingProfile) {
      case 'constant-weight':
        adjustedWeight += 0.2;
        break;
      case 'free-immersion':
        adjustedWeight += 0.3;
        break;
      case 'variable-weight':
        adjustedWeight -= 0.5;
        break;
      case 'no-limits':
        adjustedWeight -= 1.0;
        break;
      default:
        break;
    }
  }

  adjustedWeight = Math.max(0, adjustedWeight);

  const recommendations = {
    baseline: baseWeight,
    adjusted: adjustedWeight,
    factors: {
      bodyWeight: bodyWeightFactor * advancedMultiplier,
      height: heightFactor * advancedMultiplier,
      waterType: waterTypeFactor * advancedMultiplier,
      gender: genderFactor * advancedMultiplier,
      bodyType: bodyTypeFactor * advancedMultiplier,
      bmi: bmiFactor * advancedMultiplier,
      lungCapacity: lungFactor * advancedMultiplier
    },
    range: {
      min: Math.max(0, adjustedWeight - (isUsingAdvancedSettings ? 1.5 : 1)),
      max: adjustedWeight + (isUsingAdvancedSettings ? 1.5 : 1),
      optimal: adjustedWeight
    }
  };

  // Add advanced factors if using advanced settings
  if (isUsingAdvancedSettings) {
    recommendations.factors.advancedCalibration = (adjustedWeight - baseWeight) * 0.15;
    
    if (customNeutralDepth) {
      recommendations.factors.customDepthCalibration = customNeutralDepth > 15 ? 0.3 : (customNeutralDepth < 8 ? -0.2 : 0);
    }
  }

  return recommendations;
}

// ENHANCED: Generate deep diving specific recommendations
function generateDeepDivingRecommendations(deepDivingProfile, targetDepth, neutralDepth, totalWeight, bodyWeight, neutralBuoyancyPreference) {
  const recommendations = [];

  switch (deepDivingProfile) {
    case 'constant-weight':
      recommendations.push('CWT Optimization: Weight distribution should be 70% belt, 20% neck, 10% ankles for streamlined descent');
      recommendations.push('CWT Technique: Practice smooth, efficient finning to maintain controlled descent rate');
      
      if (neutralDepth < targetDepth * 0.6) {
        recommendations.push('CWT Warning: Neutral depth is quite shallow for target depth - consider adding 0.5kg weight');
      }
      
      if (neutralBuoyancyPreference === 'slightly-negative') {
        recommendations.push('CWT Safety: Negative buoyancy aids descent but increases ascent effort - ensure adequate energy reserves');
      }
      break;

    case 'free-immersion':
      recommendations.push('FIM Optimization: Focus on upper body strength and efficient rope pulling technique');
      recommendations.push('FIM Setup: Consider slightly negative buoyancy at target depth for easier descent control');
      
      if (totalWeight < bodyWeight * 0.08) {
        recommendations.push('FIM Warning: May need additional weight for efficient rope pulling - consider adding 0.5-1kg');
      }
      recommendations.push('FIM Technique: Practice smooth hand-over-hand technique to minimize energy expenditure');
      break;

    case 'variable-weight':
      const dropWeightEstimate = Math.max(2, totalWeight * 0.6);
      recommendations.push(`VWT Drop Weight: Estimated drop weight needed: ${dropWeightEstimate.toFixed(1)}kg for ${targetDepth}m dive`);
      recommendations.push('VWT Safety: Ensure positive buoyancy after weight drop for safe ascent');
      recommendations.push('VWT Equipment: Practice sled release mechanism extensively in shallow water');
      
      if (neutralDepth > 5) {
        recommendations.push('VWT Calibration: Consider reducing ballast weight as drop weight will provide descent assistance');
      }
      break;

    case 'no-limits':
      const sledWeightEstimate = Math.max(8, bodyWeight * 0.15);
      recommendations.push(`NLT Sled Weight: Estimated sled weight needed: ${sledWeightEstimate.toFixed(1)}kg for efficient descent`);
      recommendations.push('NLT Lift Bag: Ensure lift bag provides minimum 15kg positive buoyancy for safe ascent');
      recommendations.push('NLT Safety: Always dive with multiple safety divers and emergency ascent procedures');
      recommendations.push('NLT Equipment: Test all mechanical systems extensively before attempting record depths');
      
      if (totalWeight > bodyWeight * 0.05) {
        recommendations.push('NLT Calibration: Consider minimal ballast weight as sled provides primary descent force');
      }
      break;
  }

  // Depth-specific recommendations
  if (targetDepth > 30) {
    recommendations.push(`Deep Diving Alert: ${targetDepth}m requires advanced training, medical clearance, and professional supervision`);
    recommendations.push('Deep Diving Safety: Implement progressive depth training with 5m increments');
  }

  return recommendations;
}

// ENHANCED: Generate custom depth specific recommendations
function generateCustomDepthRecommendations(customNeutralDepth, neutralBuoyancyPreference, waterType, expectedNeutralDepth, currentTargetRange) {
  const recommendations = [];

  // Custom depth analysis
  const standardOptimal = waterType === 'saltwater' ? 11 : 6;
  const depthDifference = customNeutralDepth - standardOptimal;

  if (Math.abs(depthDifference) > 3) {
    if (depthDifference > 0) {
      recommendations.push(`Deep Custom Target: ${customNeutralDepth}m is ${depthDifference.toFixed(1)}m deeper than standard - requires gradual adaptation`);
      recommendations.push('Deep Adaptation: Practice at intermediate depths (2-3m increments) before attempting full target depth');
    } else {
      recommendations.push(`Shallow Custom Target: ${customNeutralDepth}m is ${Math.abs(depthDifference).toFixed(1)}m shallower than standard - ensure adequate safety margin`);
      recommendations.push('Shallow Safety: Verify positive surface buoyancy with current weight configuration');
    }
  }

  // Buoyancy preference analysis
  switch (neutralBuoyancyPreference) {
    case 'slightly-positive':
      recommendations.push('Positive Preference: Provides safety margin but may require more effort to reach and maintain depth');
      recommendations.push('Positive Technique: Practice gentle finning to overcome positive buoyancy at target depth');
      
      if (expectedNeutralDepth < customNeutralDepth - 1) {
        recommendations.push('Positive Calibration: Current setup may be too positive - consider adding 0.5kg weight');
      }
      break;

    case 'slightly-negative':
      recommendations.push('Negative Preference: Aids descent but requires active finning for depth maintenance and ascent');
      recommendations.push('Negative Safety: Ensure adequate energy reserves for ascent - negative buoyancy increases blackout risk');
      
      if (expectedNeutralDepth > customNeutralDepth + 1) {
        recommendations.push('Negative Calibration: Current setup may be too negative - consider reducing 0.5kg weight');
      }
      break;

    case 'neutral':
      recommendations.push('Perfect Neutral: Optimal for precise depth control and oxygen conservation');
      recommendations.push('Neutral Technique: Practice minimal movement to maintain exact depth position');
      break;
  }

  // Target achievement analysis
  const achievementDifference = Math.abs(expectedNeutralDepth - customNeutralDepth);
  if (achievementDifference > 2) {
    recommendations.push(`Target Adjustment: Expected neutral depth (${expectedNeutralDepth}m) differs significantly from target (${customNeutralDepth}m)`);
    
    if (expectedNeutralDepth > customNeutralDepth) {
      recommendations.push('Weight Reduction: Consider reducing ballast weight by 1-2kg to achieve shallower neutral depth');
    } else {
      recommendations.push('Weight Addition: Consider adding ballast weight by 1-2kg to achieve deeper neutral depth');
    }
  }

  // Training recommendations
  if (customNeutralDepth > 20) {
    recommendations.push('Advanced Training: Deep custom targets require specialized training and supervision');
    recommendations.push('Progressive Training: Build depth tolerance gradually with proper equalization techniques');
  }

  return recommendations;
}

// ENHANCED: Advanced safety warnings generation
function generateAdvancedSafetyWarnings(
  inputs,
  expectedNeutralDepth,
  currentTargetRange,
  totalWeight,
  surfaceBuoyancy,
  depthBuoyancy,
  bmi,
  actualLungVolume,
  isUsingAdvancedSettings
) {
  const safetyWarnings = [];
  const { weight, gender, bodyType, targetDepth, waterType, useDeepDivingOptimization, deepDivingProfile, useCustomNeutralDepth, customNeutralDepth, neutralBuoyancyPreference } = inputs;

  // Enhanced target depth alignment with advanced settings consideration
  const tolerance = isUsingAdvancedSettings ? 1.5 : 1.0;
  
  if (expectedNeutralDepth < currentTargetRange.min - tolerance) {
    safetyWarnings.push({
      type: 'Target Depth Warning',
      message: `Neutral buoyancy at ${expectedNeutralDepth}m is above target range (${currentTargetRange.min}-${currentTargetRange.max}m). Consider adding weight.`,
      severity: isUsingAdvancedSettings ? 'high' : 'medium'
    });
  } else if (expectedNeutralDepth > currentTargetRange.max + tolerance) {
    safetyWarnings.push({
      type: 'Target Depth Warning',
      message: `Neutral buoyancy at ${expectedNeutralDepth}m is below target range (${currentTargetRange.min}-${currentTargetRange.max}m). Consider reducing weight.`,
      severity: isUsingAdvancedSettings ? 'high' : 'medium'
    });
  }

  // Enhanced overweighting check with advanced settings
  const maxWeightRatio = isUsingAdvancedSettings ? 0.18 : 0.15; // Allow slightly more weight for advanced settings
  if (totalWeight > weight * maxWeightRatio) {
    safetyWarnings.push({
      type: 'Overweighting Risk',
      message: `Total weight exceeds ${(maxWeightRatio * 100).toFixed(0)}% of body weight. Consider reducing weight.`,
      severity: 'high'
    });
  }

  // CRITICAL FIX: Add warning for no ballast weight scenario
  if (totalWeight <= 0.1) {
    safetyWarnings.push({
      type: 'No Ballast Weight Detected',
      message: 'Without ballast weight, you will likely remain positive at surface and target depth. This is normal but may make reaching depth difficult.',
      severity: 'medium'
    });
  }

  // Advanced settings specific warnings
  if (isUsingAdvancedSettings) {
    // Custom neutral depth warnings
    if (useCustomNeutralDepth) {
      if (customNeutralDepth > 25) {
        safetyWarnings.push({
          type: 'Extreme Depth Target',
          message: `Custom neutral depth of ${customNeutralDepth}m requires expert-level training and supervision.`,
          severity: 'high'
        });
      }

      if (neutralBuoyancyPreference === 'slightly-negative' && customNeutralDepth > 15) {
        safetyWarnings.push({
          type: 'Deep Negative Buoyancy Risk',
          message: 'Negative buoyancy at deep custom depths significantly increases blackout risk during ascent.',
          severity: 'high'
        });
      }

      const standardDepth = waterType === 'saltwater' ? 11 : 6;
      if (Math.abs(customNeutralDepth - standardDepth) > 8) {
        safetyWarnings.push({
          type: 'Extreme Custom Depth',
          message: `Custom depth differs significantly from standard (${standardDepth}m). Requires gradual adaptation.`,
          severity: 'medium'
        });
      }
    }

    // Deep diving profile warnings
    if (useDeepDivingOptimization) {
      if (deepDivingProfile === 'variable-weight' || deepDivingProfile === 'no-limits') {
        safetyWarnings.push({
          type: 'Advanced Discipline Risk',
          message: `${deepDivingProfile === 'no-limits' ? 'No Limits' : 'Variable Weight'} diving requires specialized equipment, training, and safety team.`,
          severity: 'high'
        });
      }

      if (targetDepth > 40 && (deepDivingProfile === 'constant-weight' || deepDivingProfile === 'free-immersion')) {
        safetyWarnings.push({
          type: 'Extreme Depth Warning',
          message: `${deepDivingProfile === 'constant-weight' ? 'CWT' : 'FIM'} beyond 40m requires world-class training and medical monitoring.`,
          severity: 'high'
        });
      }
    }
  }

  // Enhanced BMI warnings with advanced calibration
  if (bmi < 18.5) {
    safetyWarnings.push({
      type: 'Underweight BMI',
      message: 'BMI below 18.5 may require additional weight and instructor consultation.',
      severity: isUsingAdvancedSettings ? 'high' : 'medium'
    });
  } else if (bmi > 30) {
    safetyWarnings.push({
      type: 'High BMI',
      message: 'BMI above 30 may require less weight and medical clearance for freediving.',
      severity: 'high'
    });

    if (isUsingAdvancedSettings && (useCustomNeutralDepth || useDeepDivingOptimization)) {
      safetyWarnings.push({
        type: 'High BMI Advanced Settings',
        message: 'High BMI with advanced settings requires careful monitoring and professional guidance.',
        severity: 'high'
      });
    }
  }

  // Enhanced surface safety check
  if (surfaceBuoyancy === 'negative') {
    safetyWarnings.push({
      type: 'Surface Safety Critical',
      message: 'Negative buoyancy at surface poses serious safety risk. Reduce weight immediately.',
      severity: 'high'
    });
  }

  // Enhanced depth control warnings
  if (depthBuoyancy === 'positive' && targetDepth > 15) {
    const severity = isUsingAdvancedSettings && targetDepth > 25 ? 'high' : 'medium';
    safetyWarnings.push({
      type: 'Depth Control Issue',
      message: `Still positive at ${targetDepth}m. May struggle to reach depth efficiently.`,
      severity: severity
    });
  }

  // Enhanced lung capacity warnings
  const expectedLungCapacity = gender === 'male' ? 6.0 : 4.5;
  const lungCapacityDiff = Math.abs(actualLungVolume - expectedLungCapacity);
  if (lungCapacityDiff > 2) {
    safetyWarnings.push({
      type: 'Unusual Lung Capacity',
      message: `Lung capacity of ${actualLungVolume}L is significantly different from average for ${gender}. Verify measurement and consider instructor consultation.`,
      severity: isUsingAdvancedSettings ? 'high' : 'medium'
    });
  }

  // Body type specific warnings with advanced calibration
  if (bodyType === 'muscular' && totalWeight < inputs.wetsuitThickness * 1.2) {
    safetyWarnings.push({
      type: 'Muscular Build Consideration',
      message: 'Muscular build detected. May need 20% more weight than baseline recommendation.',
      severity: isUsingAdvancedSettings ? 'medium' : 'low'
    });
  }

  // Water type specific warnings
  if (waterType === 'freshwater' && totalWeight < 1) {
    safetyWarnings.push({
      type: 'Freshwater Safety',
      message: 'Freshwater diving with minimal weight. Ensure adequate ballast for safety.',
      severity: 'medium'
    });
  }

  // Advanced equipment interaction warnings
  if (isUsingAdvancedSettings) {
    const equipmentComplexity = (useCustomNeutralDepth ? 1 : 0) + (useDeepDivingOptimization ? 1 : 0);
    if (equipmentComplexity === 2) {
      safetyWarnings.push({
        type: 'Complex Configuration',
        message: 'Multiple advanced settings active. Requires extensive testing and professional supervision.',
        severity: 'medium'
      });
    }
  }

  return safetyWarnings;
}

// ENHANCED: Advanced equipment tips generation
function generateAdvancedEquipmentTips(
  inputs,
  baselineBallastWeight,
  wetsuitBuoyancyKg,
  currentTargetRange,
  bodyType,
  bmi,
  wetsuitRecommendations,
  isUsingAdvancedSettings
) {
  const equipmentTips = [];
  const { gender, wetsuitThickness, waterType, useCustomNeutralDepth, customNeutralDepth, neutralBuoyancyPreference, useDeepDivingOptimization, deepDivingProfile } = inputs;

  // Enhanced baseline ballast guidance
  if (isUsingAdvancedSettings) {
    equipmentTips.push(`Advanced baseline ballast: ${baselineBallastWeight.toFixed(1)}kg (1kg per 1mm wetsuit + advanced calibration factors)`);
    equipmentTips.push('Advanced Configuration: Settings optimized for custom depth targets and/or deep diving profiles');
  } else {
    equipmentTips.push(`Enhanced baseline ballast: ${baselineBallastWeight.toFixed(1)}kg (1kg per 1mm wetsuit + individual factors)`);
  }

  // Enhanced BMI-specific tips with advanced calibration
  if (bmi > 25) {
    const tip = isUsingAdvancedSettings 
      ? 'Higher BMI detected - natural buoyancy from body fat significantly reduces weight requirements in advanced configurations'
      : 'Higher BMI detected - natural buoyancy from body fat may reduce weight requirements';
    equipmentTips.push(tip);
  } else if (bmi < 20) {
    const tip = isUsingAdvancedSettings 
      ? 'Lower BMI detected - may need additional weight due to lower body fat, especially important for custom depth targets'
      : 'Lower BMI detected - may need additional weight due to lower body fat percentage';
    equipmentTips.push(tip);
  }

  // Enhanced gender-specific tips
  if (gender === 'female') {
    const tip = isUsingAdvancedSettings 
      ? 'Female divers typically need 0.5-1kg less weight than males - this factor is amplified in advanced configurations'
      : 'Female divers typically need 0.5-1kg less weight than males due to body composition differences';
    equipmentTips.push(tip);
  } else {
    const tip = isUsingAdvancedSettings 
      ? 'Male divers typically need 0.5-1kg more weight than females - consider additional 0.2-0.3kg for advanced settings'
      : 'Male divers typically need 0.5-1kg more weight than females due to higher muscle density';
    equipmentTips.push(tip);
  }

  // Enhanced wetsuit guidance with recommendations
  if (wetsuitThickness > 0) {
    equipmentTips.push(`Your ${wetsuitThickness}mm wetsuit adds ${wetsuitBuoyancyKg.toFixed(1)}kg of buoyancy (adjusted for body type)`);
    
    if (wetsuitRecommendations.alternatives.length > 0) {
      equipmentTips.push('Wetsuit Alternatives:');
      wetsuitRecommendations.alternatives.forEach(alt => {
        equipmentTips.push(`• ${alt.thickness}mm: ${alt.reason}`);
      });
    }
  }

  if (wetsuitThickness === 0) {
    const tip = isUsingAdvancedSettings 
      ? 'No wetsuit detected - consider thermal protection impact on advanced depth targets and extended dive times'
      : 'No wetsuit detected - consider thermal protection and its buoyancy effects';
    equipmentTips.push(tip);
  }

  // Enhanced target depth guidance with advanced settings
  if (useCustomNeutralDepth) {
    equipmentTips.push(`Custom neutral buoyancy target: ${customNeutralDepth}m (${neutralBuoyancyPreference.replace('-', ' ')} preference)`);
    
    if (customNeutralDepth > 15) {
      equipmentTips.push('Deep Custom Target: Requires progressive adaptation and enhanced safety protocols');
    } else if (customNeutralDepth < 8) {
      equipmentTips.push('Shallow Custom Target: Ensure adequate surface safety margin');
    }
  } else {
    const tip = isUsingAdvancedSettings 
      ? `Target neutral buoyancy depth for ${waterType}: ${currentTargetRange.min}-${currentTargetRange.max}m (optimal: ${currentTargetRange.optimal}m) - enhanced tolerance for advanced settings`
      : `Target neutral buoyancy depth for ${waterType}: ${currentTargetRange.min}-${currentTargetRange.max}m (optimal: ${currentTargetRange.optimal}m)`;
    equipmentTips.push(tip);
  }

  // Enhanced body type specific tips with advanced considerations
  switch (bodyType) {
    case 'muscular':
      const muscularTip = isUsingAdvancedSettings 
        ? 'Muscular build: Higher muscle density requires more weight - consider 15-25% above baseline for advanced configurations'
        : 'Muscular build: Higher muscle density requires more weight - consider 10-20% above baseline';
      equipmentTips.push(muscularTip);
      break;
    case 'lean':
      const leanTip = isUsingAdvancedSettings 
        ? 'Lean build: Lower body fat may require slightly more weight for neutral buoyancy - enhanced for custom depth targets'
        : 'Lean build: Lower body fat may require slightly more weight for neutral buoyancy';
      equipmentTips.push(leanTip);
      break;
    case 'higher-fat':
      const higherFatTip = isUsingAdvancedSettings 
        ? 'Higher body fat: Natural buoyancy may require 25-35% less weight than baseline in advanced configurations'
        : 'Higher body fat: Natural buoyancy may require 20-30% less weight than baseline';
      equipmentTips.push(higherFatTip);
      break;
    case 'broad':
      const broadTip = isUsingAdvancedSettings 
        ? 'Broad build: Larger frame may require more wetsuit coverage and adjusted weight distribution - critical for advanced depths'
        : 'Broad build: Larger frame may require more wetsuit coverage and adjusted weight distribution';
      equipmentTips.push(broadTip);
      break;
    default:
      const averageTip = isUsingAdvancedSettings 
        ? 'Average build: Baseline recommendations with advanced calibration should work well with minor adjustments'
        : 'Average build: Baseline recommendations should work well with minor adjustments';
      equipmentTips.push(averageTip);
  }

  // Enhanced water type specific tips
  if (waterType === 'saltwater') {
    const tip = isUsingAdvancedSettings 
      ? 'Saltwater provides ~2.5% more buoyancy than freshwater - may need additional 0.5-0.8kg for advanced configurations'
      : 'Saltwater provides ~2.5% more buoyancy than freshwater - may need additional 0.5kg';
    equipmentTips.push(tip);
  } else {
    const tip = isUsingAdvancedSettings 
      ? 'Freshwater provides less buoyancy - ensure adequate weight for safety and precise depth control in advanced settings'
      : 'Freshwater provides less buoyancy - ensure adequate weight for safety and depth control';
    equipmentTips.push(tip);
  }

  // Advanced diving profile specific tips
  if (useDeepDivingOptimization) {
    equipmentTips.push(`Deep Diving Profile: ${deepDivingProfile.replace('-', ' ')} optimization active`);
    
    switch (deepDivingProfile) {
      case 'constant-weight':
        equipmentTips.push('CWT Equipment: Consider streamlined weight distribution and hydrodynamic positioning');
        break;
      case 'free-immersion':
        equipmentTips.push('FIM Equipment: Focus on grip strength and efficient upper body positioning');
        break;
      case 'variable-weight':
        equipmentTips.push('VWT Equipment: Ensure reliable sled release mechanism and proper drop weight calculation');
        break;
      case 'no-limits':
        equipmentTips.push('NLT Equipment: Verify all mechanical systems and emergency ascent procedures');
        break;
    }
  }

  // Advanced calibration summary
  if (isUsingAdvancedSettings) {
    equipmentTips.push('Advanced Calibration: All recommendations have been enhanced for your custom configuration');
    equipmentTips.push('Testing Protocol: Conduct extensive shallow water testing before attempting target depths');
  }

  return equipmentTips;
}

// Keep existing utility functions
export const getBMICategory = (bmi) => {
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal';
  if (bmi < 30) return 'Overweight';
  return 'Obese';
};

export const getBuoyancyRecommendations = (gender, bodyType, waterType, experience = 'intermediate') => {
  const recommendationsByBodyType = {
    'lean': {
      saltwater: { min: 2, max: 4, optimal: 3 },
      freshwater: { min: 1, max: 3, optimal: 2 }
    },
    'average': {
      saltwater: { min: 3, max: 6, optimal: 4.5 },
      freshwater: { min: 2, max: 5, optimal: 3.5 }
    },
    'muscular': {
      saltwater: { min: 4, max: 8, optimal: 6 },
      freshwater: { min: 3, max: 7, optimal: 5 }
    },
    'broad': {
      saltwater: { min: 4, max: 7, optimal: 5.5 },
      freshwater: { min: 3, max: 6, optimal: 4.5 }
    },
    'higher-fat': {
      saltwater: { min: 5, max: 9, optimal: 7 },
      freshwater: { min: 4, max: 8, optimal: 6 }
    }
  };

  const baseRec = recommendationsByBodyType[bodyType]?.[waterType] || recommendationsByBodyType['average'][waterType];
  const genderAdjustment = gender === 'female' ? -0.5 : 0;
  const experienceAdjustments = {
    'beginner': 0.5,
    'intermediate': 0,
    'advanced': -0.5,
    'instructor': -1.0
  };
  const expAdjustment = experienceAdjustments[experience] || 0;
  const totalAdjustment = genderAdjustment + expAdjustment;

  return {
    min: Math.max(0, baseRec.min + totalAdjustment),
    max: baseRec.max + totalAdjustment,
    optimal: baseRec.optimal + totalAdjustment
  };
};

export const convertWeight = (value, fromUnit, toUnit) => {
  if (fromUnit === toUnit) return value;
  
  const LBS_TO_KG = 0.45359237;
  const KG_TO_LBS = 2.20462262;
  
  if (fromUnit === 'kg' && toUnit === 'lbs') {
    return value * KG_TO_LBS;
  } else if (fromUnit === 'lbs' && toUnit === 'kg') {
    return value * LBS_TO_KG;
  }
  
  return value;
};

export const calculateDefaultLungCapacity = (gender, bodyType) => {
  if (gender === 'male') {
    switch (bodyType) {
      case 'lean': return 6.5;
      case 'muscular': return 6.3;
      case 'broad': return 6.8;
      case 'higher-fat': return 5.8;
      default: return 6.0;
    }
  } else {
    switch (bodyType) {
      case 'lean': return 5.0;
      case 'muscular': return 4.8;
      case 'broad': return 5.0;
      case 'higher-fat': return 4.2;
      default: return 4.5;
    }
  }
};

// ENHANCED: Body density calculation considering BMI and body type
function calculateBodyDensity(bmi, bodyType, gender) {
  let baseDensity;

  // Base density from body type
  switch (bodyType) {
    case 'lean':
      baseDensity = 1060;
      break;
    case 'average':
      baseDensity = 1020;
      break;
    case 'muscular':
      baseDensity = 1070;
      break;
    case 'broad':
      baseDensity = 1035;
      break;
    case 'higher-fat':
      baseDensity = 965;
      break;
    default:
      baseDensity = 1020;
  }

  // BMI adjustments
  if (bmi < 18.5) {
    baseDensity += 15; // Underweight: higher density
  } else if (bmi > 25 && bmi <= 30) {
    baseDensity -= 20; // Overweight: lower density
  } else if (bmi > 30) {
    baseDensity -= 35; // Obese: much lower density
  }

  // Gender adjustments
  if (gender === 'female') {
    baseDensity -= 10; // Females typically have lower density
  }

  return Math.max(950, Math.min(1080, baseDensity)); // Constrain to realistic range
}

// ENHANCED: Wetsuit buoyancy calculation considering body type and BMI
function calculateWetsuitBuoyancy(wetsuitThickness, bmi, bodyType) {
  let baseWetsuitBuoyancy = wetsuitThickness * 1.0; // 1kg per 1mm baseline

  // BMI adjustments (larger bodies need more wetsuit coverage)
  if (bmi > 25) {
    baseWetsuitBuoyancy *= 1.1; // 10% more buoyancy for larger bodies
  } else if (bmi < 20) {
    baseWetsuitBuoyancy *= 0.9; // 10% less buoyancy for smaller bodies
  }

  // Body type adjustments
  switch (bodyType) {
    case 'broad':
      baseWetsuitBuoyancy *= 1.05; // Broader frame needs more coverage
      break;
    case 'lean':
      baseWetsuitBuoyancy *= 0.95; // Leaner frame needs less coverage
      break;
    default:
      break;
  }

  return baseWetsuitBuoyancy;
}

// ENHANCED: Wetsuit compression calculation
function calculateWetsuitCompression(depth, wetsuitThickness) {
  // Base compression: ~10% per 10m depth
  let baseCompression = Math.min(0.1 * (depth / 10), 0.7); // Max 70% compression

  // Thicker wetsuits compress less efficiently
  if (wetsuitThickness >= 5) {
    baseCompression *= 0.9; // 10% less compression for thick suits
  } else if (wetsuitThickness <= 1) {
    baseCompression *= 1.1; // 10% more compression for thin suits
  }

  return baseCompression;
}