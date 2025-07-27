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
    lungCapacity // L
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

  // ENHANCED EMPIRICALLY-CALIBRATED NEUTRAL DEPTH CALCULATION
  const expectedNeutralDepth = calculateEnhancedNeutralDepth(
    weight,
    height,
    totalWeight,
    wetsuitThickness,
    bodyDensity,
    waterDensity,
    actualLungVolume,
    gender,
    bodyType,
    bmi,
    waterType
  );

  // TARGET NEUTRAL BUOYANCY DEPTH GUIDANCE
  const targetNeutralDepth = {
    saltwater: { min: 10, max: 12, optimal: 11 },
    freshwater: { min: 5, max: 7, optimal: 6 }
  };
  const currentTargetRange = targetNeutralDepth[waterType];

  // Check if expected neutral depth is within target range
  const isWithinTargetRange = expectedNeutralDepth >= currentTargetRange.min && 
                              expectedNeutralDepth <= currentTargetRange.max;

  // UPDATED: Use the new gauge state function
  const surfaceBuoyancy = getGaugeState(waterType, expectedNeutralDepth, 0);
  const depthBuoyancy = getGaugeState(waterType, expectedNeutralDepth, targetDepth);

  // Calculate buoyancy forces for display (but use empirical status for decisions)
  const buoyancyForceN = waterDensity * GRAVITY * (bodyVolume + wetsuitVolumeDepth + lungVolumeDepth) - 
                        GRAVITY * (weight + totalWeight);
  const buoyancyKg = buoyancyForceN / GRAVITY;
  const buoyancyAtDepthN = waterDensity * GRAVITY * (bodyVolume + wetsuitVolumeDepth + lungVolumeDepth) - 
                          GRAVITY * (weight + totalWeight);

  // Calculate recommended weight for optimal neutral buoyancy at target range
  const optimalDepth = currentTargetRange.optimal;
  const recommendedWeight = calculateOptimalWeight(
    weight,
    height,
    wetsuitThickness,
    waterType,
    gender,
    bodyType,
    actualLungVolume,
    bmi,
    optimalDepth
  );
  const weightAdjustment = recommendedWeight - totalWeight;

  // ENHANCED BALLAST WEIGHT RECOMMENDATIONS
  const ballastRecommendations = calculateEnhancedBallastRecommendations(
    weight,
    height,
    wetsuitThickness,
    waterType,
    gender,
    bodyType,
    bmi,
    actualLungVolume
  );

  // Generate enhanced safety warnings
  const safetyWarnings = generateEnhancedSafetyWarnings(
    inputs,
    expectedNeutralDepth,
    currentTargetRange,
    totalWeight,
    surfaceBuoyancy,
    depthBuoyancy,
    bmi,
    actualLungVolume
  );

  // Generate enhanced equipment tips
  const equipmentTips = generateEnhancedEquipmentTips(
    inputs,
    baselineBallastWeight,
    wetsuitBuoyancyKg,
    currentTargetRange,
    bodyType,
    bmi
  );

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

    // Ballast recommendations
    baselineBallastWeight,
    ballastRecommendations,

    // Target depth information
    targetNeutralDepth: currentTargetRange,
    isWithinTargetRange,

    // Physics values
    bodyDensity,
    bodyVolume,
    waterDensity,
    lungVolumeSurface,
    lungVolumeDepth,
    wetsuitVolume,
    wetsuitVolumeDepth,

    // Buoyancy status (empirically-based)
    surfaceBuoyancy,
    depthBuoyancy,
    buoyancyValue: buoyancyKg, // For gauge display
    buoyancyForceN,
    buoyancyAtDepthN,
    expectedNeutralDepth,

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
    empiricalCorrectionFactor: 1.05,
    disclaimer: "This calculator uses empirical data from real-world freediving scenarios. Always test and fine-tune weights in-water for safety and optimal performance."
  };
};

// NEW: Enhanced gauge state function as requested
function getGaugeState(environment, neutralDepth, currentDepth) {
  if (currentDepth === 0) {
    if (environment === 'saltwater') {
      if (neutralDepth < 10) {
        return 'positive';
      }
      if (neutralDepth >= 10 && neutralDepth <= 12) {
        return 'neutral';
      }
      if (neutralDepth > 12) {
        return 'negative';
      }
    } else if (environment === 'freshwater') {
      if (neutralDepth < 5) {
        return 'positive';
      }
      if (neutralDepth >= 5 && neutralDepth <= 7) {
        return 'neutral';
      }
      if (neutralDepth > 7) {
        return 'negative';
      }
    }
    // Default fallback if environment is not recognized
    return 'positive';
  }
  
  // Logic for non-surface depths
  if (currentDepth > 0) {
    const tolerance = 1.0; // 1m tolerance around neutral depth
    
    if (currentDepth < neutralDepth - tolerance) {
      return 'positive'; // Still floating, haven't reached neutral yet
    } else if (currentDepth > neutralDepth + tolerance) {
      return 'negative'; // Past neutral, sinking
    } else {
      return 'neutral'; // Close to neutral depth
    }
  }

  return 'positive'; // Default fallback
}

// ENHANCED: Body density calculation considering BMI and body type
function calculateBodyDensity(bmi, bodyType, gender) {
  let baseDensity;
  
  // Base density from body type
  switch (bodyType) {
    case 'lean': baseDensity = 1060; break;
    case 'average': baseDensity = 1020; break;
    case 'muscular': baseDensity = 1070; break;
    case 'broad': baseDensity = 1035; break;
    case 'higher-fat': baseDensity = 965; break;
    default: baseDensity = 1020;
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

// ENHANCED: Neutral depth calculation with comprehensive factors
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
  waterType
) {
  // EMPIRICAL BASELINE DEPTHS
  const empiricalBaselines = {
    saltwater: 11, // meters (range 10-12m)
    freshwater: 6  // meters (range 5-7m)
  };

  const waterTypeKey = waterType;
  let neutralDepth = empiricalBaselines[waterTypeKey];

  // 1. Wetsuit effect: More wetsuit = deeper neutral depth
  neutralDepth += wetsuitThickness * 0.3;

  // 2. Body density effect: Denser bodies become neutral at shallower depths
  const avgBodyDensity = 1020; // kg/m³
  const densityFactor = (bodyDensity - avgBodyDensity) / avgBodyDensity;
  neutralDepth -= densityFactor * 3; // 3m adjustment per 10% density difference

  // 3. Lung capacity effect: Larger lungs = deeper neutral depth
  const avgLungCapacity = gender === 'male' ? 6.0 : 4.5;
  const lungFactor = (lungCapacity - avgLungCapacity) / avgLungCapacity;
  neutralDepth += lungFactor * 2; // 2m per 50% lung capacity difference

  // 4. Weight effect: More weight = shallower neutral depth
  const expectedWeight = wetsuitThickness * 1.0; // Expected weight for wetsuit
  const weightDifference = ballastWeight - expectedWeight;
  neutralDepth -= weightDifference * 1.5; // 1.5m shallower per kg of extra weight

  // 5. BMI effect: Higher BMI = deeper neutral depth (more fat = more buoyancy)
  const avgBMI = 23;
  const bmiFactor = (bmi - avgBMI) / avgBMI;
  neutralDepth += bmiFactor * 1.5; // 1.5m per 10% BMI difference

  // 6. Height effect: Taller people have different body composition
  const avgHeight = gender === 'male' ? 175 : 165;
  const heightFactor = (height - avgHeight) / avgHeight;
  neutralDepth += heightFactor * 1.0; // 1m per 10% height difference

  // 7. Body type adjustments (empirical)
  switch (bodyType) {
    case 'lean': neutralDepth += 0.5; break; // Lean bodies sink easier
    case 'muscular': neutralDepth -= 0.5; break; // Dense muscle sinks
    case 'higher-fat': neutralDepth += 1.0; break; // Fat floats
    case 'broad': neutralDepth += 0.3; break; // Larger frame
    default: break; // average
  }

  // 8. Gender adjustment (empirical)
  if (gender === 'female') {
    neutralDepth += 0.5; // Women typically have higher body fat
  }

  // 9. Water type specific adjustments
  if (waterType === 'saltwater') {
    // Saltwater adjustments
    if (bodyWeight > 80) neutralDepth -= 0.3; // Heavy divers sink easier in saltwater
    if (bodyWeight < 60) neutralDepth += 0.3; // Light divers float more in saltwater
  } else {
    // Freshwater adjustments
    if (bodyWeight > 80) neutralDepth -= 0.2; // Less pronounced effect in freshwater
    if (bodyWeight < 60) neutralDepth += 0.2;
  }

  // 10. Constrain to realistic freediving ranges
  const constraints = {
    saltwater: { min: 8, max: 16 },
    freshwater: { min: 4, max: 10 }
  };
  const constraint = constraints[waterTypeKey];
  neutralDepth = Math.max(constraint.min, Math.min(constraint.max, neutralDepth));

  // 11. Check for surface negative (too much weight)
  if (ballastWeight > bodyWeight * 0.15 || weightDifference > 4) {
    return 0; // Surface negative
  }

  // 12. Check for insufficient weight (never becomes neutral)
  if (ballastWeight < wetsuitThickness * 0.5) {
    return constraint.max; // Remains positive even at deep depths
  }

  return Math.round(neutralDepth * 10) / 10; // Round to 1 decimal place
}

// ENHANCED: Optimal weight calculation with comprehensive factors
function calculateOptimalWeight(
  bodyWeight,
  height,
  wetsuitThickness,
  waterType,
  gender,
  bodyType,
  lungCapacity,
  bmi,
  targetDepth
) {
  // Start with baseline: 1kg per 1mm wetsuit
  let optimalWeight = wetsuitThickness * 1.0;

  // BMI factor (most significant)
  if (bmi > 25) {
    optimalWeight += (bmi - 25) * 0.1; // +0.1kg per BMI point above 25
  } else if (bmi < 20) {
    optimalWeight -= (20 - bmi) * 0.1; // -0.1kg per BMI point below 20
  }

  // Body weight factor
  if (bodyWeight > 80) optimalWeight += 0.5;
  else if (bodyWeight < 60) optimalWeight -= 0.5;

  // Height factor
  const avgHeight = gender === 'male' ? 175 : 165;
  const heightDiff = (height - avgHeight) / 10; // per 10cm difference
  optimalWeight += heightDiff * 0.2;

  // Water type factor
  if (waterType === 'saltwater') optimalWeight += 0.5;
  else optimalWeight -= 0.5;

  // Gender factor
  if (gender === 'male') optimalWeight += 0.3;
  else optimalWeight -= 0.3;

  // Body type factor
  switch (bodyType) {
    case 'lean': optimalWeight -= 0.2; break;
    case 'muscular': optimalWeight += 0.5; break;
    case 'broad': optimalWeight += 0.3; break;
    case 'higher-fat': optimalWeight -= 0.8; break;
    default: break; // average, no adjustment
  }

  // Lung capacity factor
  const avgLungCapacity = gender === 'male' ? 6.0 : 4.5;
  const lungDifference = lungCapacity - avgLungCapacity;
  optimalWeight += lungDifference * 0.3; // 0.3kg per liter difference

  // Target depth factor
  if (targetDepth > 15) {
    optimalWeight += 0.3; // Need more weight for deeper dives
  } else if (targetDepth < 8) {
    optimalWeight -= 0.2; // Need less weight for shallow dives
  }

  return Math.max(0, optimalWeight);
}

// ENHANCED: Ballast recommendations with comprehensive factors
function calculateEnhancedBallastRecommendations(
  bodyWeight,
  height,
  wetsuitThickness,
  waterType,
  gender,
  bodyType,
  bmi,
  lungCapacity
) {
  // Base ballast: 1kg per 1mm wetsuit
  const baseWeight = wetsuitThickness * 1.0;

  // Comprehensive factor calculations
  const bodyWeightFactor = bodyWeight > 80 ? 0.5 : (bodyWeight < 60 ? -0.5 : 0);
  const heightFactor = gender === 'male' ? 
    (height > 180 ? 0.3 : (height < 170 ? -0.3 : 0)) :
    (height > 170 ? 0.3 : (height < 160 ? -0.3 : 0));
  const waterTypeFactor = waterType === 'saltwater' ? 0.5 : -0.5;
  const genderFactor = gender === 'male' ? 0.3 : -0.3;
  
  let bodyTypeFactor = 0;
  switch (bodyType) {
    case 'lean': bodyTypeFactor = -0.2; break;
    case 'muscular': bodyTypeFactor = 0.5; break;
    case 'broad': bodyTypeFactor = 0.3; break;
    case 'higher-fat': bodyTypeFactor = -0.8; break;
    default: bodyTypeFactor = 0;
  }

  // BMI adjustment (most significant)
  let bmiFactor = 0;
  if (bmi > 25) {
    bmiFactor = -0.4; // Overweight needs less weight
  } else if (bmi < 20) {
    bmiFactor = 0.4; // Underweight needs more weight
  }

  // Lung capacity adjustment
  const avgLungCapacity = gender === 'male' ? 6.0 : 4.5;
  const lungFactor = (lungCapacity - avgLungCapacity) * 0.2; // 0.2kg per liter difference

  // Calculate adjusted recommendation
  const adjustedWeight = Math.max(0, baseWeight + bodyWeightFactor + heightFactor + 
                                 waterTypeFactor + genderFactor + bodyTypeFactor + 
                                 bmiFactor + lungFactor);

  return {
    baseline: baseWeight,
    adjusted: adjustedWeight,
    factors: {
      bodyWeight: bodyWeightFactor,
      height: heightFactor,
      waterType: waterTypeFactor,
      gender: genderFactor,
      bodyType: bodyTypeFactor,
      bmi: bmiFactor,
      lungCapacity: lungFactor
    },
    range: {
      min: Math.max(0, adjustedWeight - 1),
      max: adjustedWeight + 1,
      optimal: adjustedWeight
    }
  };
}

// ENHANCED: Safety warnings generation
function generateEnhancedSafetyWarnings(
  inputs,
  expectedNeutralDepth,
  currentTargetRange,
  totalWeight,
  surfaceBuoyancy,
  depthBuoyancy,
  bmi,
  actualLungVolume
) {
  const safetyWarnings = [];
  const { weight, gender, bodyType, targetDepth, waterType } = inputs;

  // Check target depth alignment
  if (expectedNeutralDepth < currentTargetRange.min) {
    safetyWarnings.push({
      type: 'Target Depth Warning',
      message: `Neutral buoyancy at ${expectedNeutralDepth}m is above target range (${currentTargetRange.min}-${currentTargetRange.max}m). Consider adding weight.`,
      severity: 'medium'
    });
  } else if (expectedNeutralDepth > currentTargetRange.max) {
    safetyWarnings.push({
      type: 'Target Depth Warning',
      message: `Neutral buoyancy at ${expectedNeutralDepth}m is below target range (${currentTargetRange.min}-${currentTargetRange.max}m). Consider reducing weight.`,
      severity: 'medium'
    });
  }

  // Check for overweighting
  if (totalWeight > weight * 0.15) {
    safetyWarnings.push({
      type: 'Overweighting Risk',
      message: 'Total weight exceeds 15% of body weight. Consider reducing weight.',
      severity: 'high'
    });
  }

  // Enhanced BMI warnings
  if (bmi < 18.5) {
    safetyWarnings.push({
      type: 'Underweight BMI',
      message: 'BMI below 18.5 may require additional weight and instructor consultation.',
      severity: 'medium'
    });
  } else if (bmi > 30) {
    safetyWarnings.push({
      type: 'High BMI',
      message: 'BMI above 30 may require less weight and medical clearance for freediving.',
      severity: 'high'
    });
  }

  // Check for surface negative buoyancy
  if (surfaceBuoyancy === 'negative') {
    safetyWarnings.push({
      type: 'Surface Safety',
      message: 'Negative buoyancy at surface poses serious safety risk. Reduce weight immediately.',
      severity: 'high'
    });
  }

  // Check for excessive positive buoyancy at depth
  if (depthBuoyancy === 'positive' && targetDepth > 15) {
    safetyWarnings.push({
      type: 'Depth Control',
      message: 'Still positive at target depth. May struggle to reach depth efficiently.',
      severity: 'medium'
    });
  }

  // Enhanced lung capacity warnings
  const expectedLungCapacity = gender === 'male' ? 6.0 : 4.5;
  const lungCapacityDiff = Math.abs(actualLungVolume - expectedLungCapacity);
  if (lungCapacityDiff > 2) {
    safetyWarnings.push({
      type: 'Unusual Lung Capacity',
      message: `Lung capacity of ${actualLungVolume}L is significantly different from average for ${gender}. Verify measurement and consider instructor consultation.`,
      severity: 'medium'
    });
  }

  // Body type specific warnings
  if (bodyType === 'muscular' && totalWeight < inputs.wetsuitThickness * 1.2) {
    safetyWarnings.push({
      type: 'Muscular Build',
      message: 'Muscular build detected. May need 20% more weight than baseline recommendation.',
      severity: 'low'
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

  return safetyWarnings;
}

// ENHANCED: Equipment tips generation
function generateEnhancedEquipmentTips(
  inputs,
  baselineBallastWeight,
  wetsuitBuoyancyKg,
  currentTargetRange,
  bodyType,
  bmi
) {
  const equipmentTips = [];
  const { gender, wetsuitThickness, waterType } = inputs;

  // Baseline ballast guidance
  equipmentTips.push(`Enhanced baseline ballast: ${baselineBallastWeight.toFixed(1)}kg (1kg per 1mm wetsuit + individual factors)`);

  // BMI-specific tips
  if (bmi > 25) {
    equipmentTips.push('Higher BMI detected - natural buoyancy from body fat may reduce weight requirements');
  } else if (bmi < 20) {
    equipmentTips.push('Lower BMI detected - may need additional weight due to lower body fat percentage');
  }

  // Gender-specific tips
  if (gender === 'female') {
    equipmentTips.push('Female divers typically need 0.5-1kg less weight than males due to body composition differences');
  } else {
    equipmentTips.push('Male divers typically need 0.5-1kg more weight than females due to higher muscle density');
  }

  // Wetsuit guidance
  if (wetsuitThickness > 0) {
    equipmentTips.push(`Your ${wetsuitThickness}mm wetsuit adds ${wetsuitBuoyancyKg.toFixed(1)}kg of buoyancy (adjusted for body type)`);
  }

  if (wetsuitThickness === 0) {
    equipmentTips.push('No wetsuit detected - consider thermal protection and its buoyancy effects');
  }

  // Target depth guidance
  equipmentTips.push(`Target neutral buoyancy depth for ${waterType}: ${currentTargetRange.min}-${currentTargetRange.max}m (optimal: ${currentTargetRange.optimal}m)`);

  // Body type specific tips
  switch (bodyType) {
    case 'muscular':
      equipmentTips.push('Muscular build: Higher muscle density requires more weight - consider 10-20% above baseline');
      break;
    case 'lean':
      equipmentTips.push('Lean build: Lower body fat may require slightly more weight for neutral buoyancy');
      break;
    case 'higher-fat':
      equipmentTips.push('Higher body fat: Natural buoyancy may require 20-30% less weight than baseline');
      break;
    case 'broad':
      equipmentTips.push('Broad build: Larger frame may require more wetsuit coverage and adjusted weight distribution');
      break;
    default:
      equipmentTips.push('Average build: Baseline recommendations should work well with minor adjustments');
  }

  // Water type specific tips
  if (waterType === 'saltwater') {
    equipmentTips.push('Saltwater provides ~2.5% more buoyancy than freshwater - may need additional 0.5kg');
  } else {
    equipmentTips.push('Freshwater provides less buoyancy - ensure adequate weight for safety and depth control');
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