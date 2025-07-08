/**
 * Fitness Calculations and Formulas
 * Core utilities for fitness and nutrition calculations
 */

export interface UserMetrics {
  age: number;
  height: number; // cm
  weight: number; // kg
  gender: "male" | "female";
  activityLevel:
    | "sedentary"
    | "lightly_active"
    | "moderately_active"
    | "very_active"
    | "extremely_active";
  fitnessGoal:
    | "weight_loss"
    | "muscle_gain"
    | "maintenance"
    | "endurance"
    | "strength";
}

export interface MacroTargets {
  calories: number;
  protein: number; // grams
  carbs: number; // grams
  fat: number; // grams
  fiber: number; // grams
}

export interface BodyComposition {
  bmi: number;
  bmr: number; // Basal Metabolic Rate
  tdee: number; // Total Daily Energy Expenditure
  bodyFatPercentage?: number;
  leanBodyMass?: number;
  idealWeight?: { min: number; max: number };
}

export class FitnessCalculations {
  /**
   * Calculate BMI (Body Mass Index)
   */
  static calculateBMI(weight: number, height: number): number {
    const heightInMeters = height / 100;
    return Number((weight / (heightInMeters * heightInMeters)).toFixed(1));
  }

  /**
   * Calculate BMR using Mifflin-St Jeor Equation
   */
  static calculateBMR(
    weight: number,
    height: number,
    age: number,
    gender: "male" | "female"
  ): number {
    const baseBMR = 10 * weight + 6.25 * height - 5 * age;
    return Math.round(gender === "male" ? baseBMR + 5 : baseBMR - 161);
  }

  /**
   * Calculate TDEE (Total Daily Energy Expenditure)
   */
  static calculateTDEE(
    bmr: number,
    activityLevel: UserMetrics["activityLevel"]
  ): number {
    const activityMultipliers = {
      sedentary: 1.2,
      lightly_active: 1.375,
      moderately_active: 1.55,
      very_active: 1.725,
      extremely_active: 1.9,
    };

    return Math.round(bmr * activityMultipliers[activityLevel]);
  }

  /**
   * Calculate ideal weight range using BMI
   */
  static calculateIdealWeight(height: number): { min: number; max: number } {
    const heightInMeters = height / 100;
    const minWeight = 18.5 * heightInMeters * heightInMeters;
    const maxWeight = 24.9 * heightInMeters * heightInMeters;

    return {
      min: Number(minWeight.toFixed(1)),
      max: Number(maxWeight.toFixed(1)),
    };
  }

  /**
   * Calculate body fat percentage using Navy Method
   */
  static calculateBodyFatNavy(
    gender: "male" | "female",
    height: number, // cm
    waist: number, // cm
    neck: number, // cm
    hip?: number // cm (required for females)
  ): number {
    if (gender === "female" && !hip) {
      throw new Error(
        "Hip measurement required for female body fat calculation"
      );
    }

    let bodyFat: number;

    if (gender === "male") {
      bodyFat =
        495 /
          (1.0324 -
            0.19077 * Math.log10(waist - neck) +
            0.15456 * Math.log10(height)) -
        450;
    } else {
      bodyFat =
        495 /
          (1.29579 -
            0.35004 * Math.log10(waist + hip! - neck) +
            0.221 * Math.log10(height)) -
        450;
    }

    return Number(Math.max(0, bodyFat).toFixed(1));
  }

  /**
   * Calculate lean body mass
   */
  static calculateLeanBodyMass(
    weight: number,
    bodyFatPercentage: number
  ): number {
    return Number((weight * (1 - bodyFatPercentage / 100)).toFixed(1));
  }

  /**
   * Get comprehensive body composition analysis
   */
  static getBodyComposition(
    metrics: UserMetrics,
    measurements?: {
      waist?: number;
      neck?: number;
      hip?: number;
    }
  ): BodyComposition {
    const bmi = this.calculateBMI(metrics.weight, metrics.height);
    const bmr = this.calculateBMR(
      metrics.weight,
      metrics.height,
      metrics.age,
      metrics.gender
    );
    const tdee = this.calculateTDEE(bmr, metrics.activityLevel);
    const idealWeight = this.calculateIdealWeight(metrics.height);

    let bodyFatPercentage: number | undefined;
    let leanBodyMass: number | undefined;

    if (measurements?.waist && measurements?.neck) {
      try {
        bodyFatPercentage = this.calculateBodyFatNavy(
          metrics.gender,
          metrics.height,
          measurements.waist,
          measurements.neck,
          measurements.hip
        );
        leanBodyMass = this.calculateLeanBodyMass(
          metrics.weight,
          bodyFatPercentage
        );
      } catch (error) {
        // Measurements not complete, skip body fat calculation
      }
    }

    return {
      bmi,
      bmr,
      tdee,
      bodyFatPercentage,
      leanBodyMass,
      idealWeight,
    };
  }

  /**
   * Calculate calorie target based on goal
   */
  static calculateCalorieTarget(
    tdee: number,
    goal: UserMetrics["fitnessGoal"]
  ): number {
    const adjustments = {
      weight_loss: -500, // 1 lb per week
      muscle_gain: 300,
      maintenance: 0,
      endurance: 200,
      strength: 100,
    };

    return Math.round(tdee + adjustments[goal]);
  }

  /**
   * Calculate macro targets
   */
  static calculateMacroTargets(
    calories: number,
    weight: number,
    goal: UserMetrics["fitnessGoal"],
    activityLevel: UserMetrics["activityLevel"]
  ): MacroTargets {
    // Protein targets based on goal and activity level
    const proteinPerKg = this.getProteinTarget(goal, activityLevel);
    const proteinGrams = Math.round(weight * proteinPerKg);

    // Fat targets (20-30% of calories)
    let fatRatio: number;
    switch (goal) {
      case "weight_loss":
        fatRatio = 0.25;
        break;
      case "muscle_gain":
        fatRatio = 0.25;
        break;
      case "endurance":
        fatRatio = 0.2;
        break;
      default:
        fatRatio = 0.3;
    }

    const fatGrams = Math.round((calories * fatRatio) / 9);

    // Carbs fill the remainder
    const proteinCalories = proteinGrams * 4;
    const fatCalories = fatGrams * 9;
    const carbCalories = calories - proteinCalories - fatCalories;
    const carbGrams = Math.round(Math.max(0, carbCalories) / 4);

    const fiberGrams = Math.round(Math.max(25, (calories / 1000) * 14));

    return {
      calories,
      protein: proteinGrams,
      carbs: carbGrams,
      fat: fatGrams,
      fiber: fiberGrams,
    };
  }

  /**
   * Get protein target based on goal and activity level
   */
  private static getProteinTarget(
    goal: UserMetrics["fitnessGoal"],
    activityLevel: UserMetrics["activityLevel"]
  ): number {
    const baseProtein = {
      weight_loss: 1.6,
      muscle_gain: 2.0,
      maintenance: 1.2,
      endurance: 1.4,
      strength: 1.8,
    };

    const activityMultiplier = {
      sedentary: 0.9,
      lightly_active: 1.0,
      moderately_active: 1.1,
      very_active: 1.2,
      extremely_active: 1.3,
    };

    return baseProtein[goal] * activityMultiplier[activityLevel];
  }

  /**
   * Calculate one-rep max using Epley formula
   */
  static calculateOneRepMax(weight: number, reps: number): number {
    if (reps === 1) return weight;
    return Math.round(weight * (1 + reps / 30));
  }

  /**
   * Calculate training weight for specific rep range
   */
  static calculateTrainingWeight(
    oneRepMax: number,
    targetReps: number
  ): number {
    if (targetReps === 1) return oneRepMax;

    const percentages = {
      1: 1.0,
      2: 0.95,
      3: 0.93,
      4: 0.9,
      5: 0.87,
      6: 0.85,
      7: 0.83,
      8: 0.8,
      9: 0.77,
      10: 0.75,
      12: 0.7,
      15: 0.65,
      20: 0.6,
    };

    const percentage =
      percentages[targetReps as keyof typeof percentages] ||
      (targetReps > 20 ? 0.55 : 0.6);

    return Math.round(oneRepMax * percentage);
  }

  /**
   * Calculate calories burned during exercise
   */
  static calculateCaloriesBurned(
    weight: number,
    duration: number, // minutes
    activityMET: number
  ): number {
    // Calories = METs × weight (kg) × time (hours)
    return Math.round(activityMET * weight * (duration / 60));
  }

  /**
   * Get MET values for common activities
   */
  static getActivityMET(activity: string): number {
    const metValues: Record<string, number> = {
      // Strength Training
      weightlifting_light: 3.0,
      weightlifting_moderate: 5.0,
      weightlifting_heavy: 6.0,

      // Cardio
      walking_slow: 2.5,
      walking_moderate: 3.5,
      walking_fast: 4.5,
      jogging: 7.0,
      running_6mph: 9.8,
      running_8mph: 11.8,
      cycling_moderate: 8.0,

      // HIIT
      hiit: 8.0,
      circuit_training: 7.0,

      // Other
      yoga: 2.5,
      swimming_moderate: 6.0,
      rowing: 7.0,
    };

    return metValues[activity.toLowerCase()] || 5.0;
  }

  /**
   * Calculate workout volume (sets × reps × weight)
   */
  static calculateWorkoutVolume(
    exercises: Array<{
      sets: number;
      reps: number;
      weight: number;
    }>
  ): number {
    return exercises.reduce((total, exercise) => {
      return total + exercise.sets * exercise.reps * exercise.weight;
    }, 0);
  }

  /**
   * Calculate progressive overload recommendations
   */
  static calculateProgressiveOverload(
    currentWeight: number,
    currentReps: number,
    targetReps: number,
    progressionType: "linear" | "double_progression" | "percentage"
  ): {
    newWeight: number;
    newReps: number;
    recommendation: string;
  } {
    switch (progressionType) {
      case "linear":
        return {
          newWeight: currentWeight + 2.5,
          newReps: currentReps,
          recommendation: "Add 2.5kg to the weight",
        };

      case "double_progression":
        if (currentReps < targetReps) {
          return {
            newWeight: currentWeight,
            newReps: currentReps + 1,
            recommendation: "Add 1 rep per set",
          };
        } else {
          return {
            newWeight: currentWeight + 2.5,
            newReps: Math.max(6, targetReps - 2),
            recommendation: "Increase weight by 2.5kg, reduce reps",
          };
        }

      case "percentage":
        const increase = currentWeight * 0.025; // 2.5% increase
        return {
          newWeight: Math.round((currentWeight + increase) * 2) / 2, // Round to nearest 0.5kg
          newReps: currentReps,
          recommendation: "Increase weight by 2.5%",
        };

      default:
        return {
          newWeight: currentWeight,
          newReps: currentReps,
          recommendation: "Maintain current load",
        };
    }
  }

  /**
   * Calculate recovery time based on workout intensity
   */
  static calculateRecoveryTime(
    workoutType: "strength" | "cardio" | "hiit" | "flexibility",
    intensity: "low" | "moderate" | "high",
    duration: number
  ): {
    recommendedRest: number; // hours
    nextWorkoutType: string[];
  } {
    const recoveryMatrix = {
      strength: {
        low: { rest: 24, compatible: ["cardio", "flexibility"] },
        moderate: { rest: 48, compatible: ["cardio", "flexibility"] },
        high: { rest: 72, compatible: ["flexibility", "light cardio"] },
      },
      cardio: {
        low: { rest: 12, compatible: ["strength", "flexibility"] },
        moderate: { rest: 24, compatible: ["strength", "flexibility"] },
        high: { rest: 48, compatible: ["flexibility", "light strength"] },
      },
      hiit: {
        low: { rest: 24, compatible: ["flexibility", "light cardio"] },
        moderate: { rest: 48, compatible: ["flexibility", "strength"] },
        high: { rest: 72, compatible: ["flexibility"] },
      },
      flexibility: {
        low: { rest: 0, compatible: ["strength", "cardio", "hiit"] },
        moderate: { rest: 12, compatible: ["strength", "cardio"] },
        high: { rest: 24, compatible: ["strength", "cardio"] },
      },
    };

    const baseRecovery = recoveryMatrix[workoutType][intensity];

    // Adjust for duration
    const durationMultiplier = duration > 60 ? 1.2 : duration < 30 ? 0.8 : 1.0;

    return {
      recommendedRest: Math.round(baseRecovery.rest * durationMultiplier),
      nextWorkoutType: baseRecovery.compatible,
    };
  }

  /**
   * Calculate hydration needs
   */
  static calculateHydrationNeeds(
    weight: number,
    activityLevel: UserMetrics["activityLevel"],
    climate: "temperate" | "hot" | "cold" = "temperate"
  ): {
    dailyWater: number; // ml
    preWorkout: number; // ml
    duringWorkout: number; // ml per hour
    postWorkout: number; // ml
  } {
    // Base water needs: 35ml per kg body weight
    let baseWater = weight * 35;

    // Activity adjustments
    const activityMultipliers = {
      sedentary: 1.0,
      lightly_active: 1.1,
      moderately_active: 1.2,
      very_active: 1.4,
      extremely_active: 1.6,
    };

    // Climate adjustments
    const climateMultipliers = {
      temperate: 1.0,
      hot: 1.2,
      cold: 0.9,
    };

    baseWater *=
      activityMultipliers[activityLevel] * climateMultipliers[climate];

    return {
      dailyWater: Math.round(baseWater),
      preWorkout: Math.round(weight * 5), // 5ml per kg 2 hours before
      duringWorkout: Math.round(weight * 6), // 6ml per kg per hour
      postWorkout: Math.round(weight * 6), // 6ml per kg after workout
    };
  }
}

/**
 * Nutrition-specific calculations
 */
export class NutritionCalculations {
  /**
   * Calculate meal timing for optimal performance
   */
  static calculateMealTiming(
    workoutTime: string, // HH:MM format
    goal: "performance" | "fat_loss" | "muscle_gain"
  ): {
    preWorkout: { time: string; calories: number; macros: string };
    postWorkout: { time: string; calories: number; macros: string };
    recommendations: string[];
  } {
    const [hours, minutes] = workoutTime.split(":").map(Number);
    const workoutMinutes = hours * 60 + minutes;

    const timings = {
      performance: {
        preWorkout: {
          offset: -90,
          calories: 200,
          macros: "30-40g carbs, 10-15g protein",
        },
        postWorkout: {
          offset: 30,
          calories: 300,
          macros: "30-40g carbs, 20-25g protein",
        },
      },
      fat_loss: {
        preWorkout: {
          offset: -60,
          calories: 100,
          macros: "15-20g carbs, 10g protein",
        },
        postWorkout: {
          offset: 60,
          calories: 200,
          macros: "20-25g carbs, 20-25g protein",
        },
      },
      muscle_gain: {
        preWorkout: {
          offset: -120,
          calories: 300,
          macros: "40-50g carbs, 15-20g protein",
        },
        postWorkout: {
          offset: 30,
          calories: 400,
          macros: "40-50g carbs, 25-30g protein",
        },
      },
    };

    const timing = timings[goal];

    const formatTime = (minutes: number) => {
      const h = Math.floor(minutes / 60) % 24;
      const m = minutes % 60;
      return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
    };

    return {
      preWorkout: {
        time: formatTime(workoutMinutes + timing.preWorkout.offset),
        calories: timing.preWorkout.calories,
        macros: timing.preWorkout.macros,
      },
      postWorkout: {
        time: formatTime(workoutMinutes + timing.postWorkout.offset),
        calories: timing.postWorkout.calories,
        macros: timing.postWorkout.macros,
      },
      recommendations: [
        "Stay hydrated throughout the day",
        "Avoid heavy meals 2-3 hours before workout",
        "Include leucine-rich protein post-workout",
        "Time carbohydrates around training for best results",
      ],
    };
  }

  /**
   * Calculate micronutrient needs
   */
  static calculateMicronutrients(
    calories: number,
    age: number,
    gender: "male" | "female",
    activityLevel: UserMetrics["activityLevel"]
  ): Record<string, { amount: number; unit: string; sources: string[] }> {
    const baseNeeds = {
      vitamin_d: {
        amount: 600,
        unit: "IU",
        sources: ["Fatty fish", "Fortified milk", "Sunlight exposure"],
      },
      vitamin_b12: {
        amount: 2.4,
        unit: "mcg",
        sources: ["Meat", "Fish", "Dairy", "Fortified cereals"],
      },
      iron: {
        amount: gender === "male" ? 8 : 18,
        unit: "mg",
        sources: ["Red meat", "Spinach", "Lentils", "Fortified cereals"],
      },
      calcium: {
        amount: age > 50 ? 1200 : 1000,
        unit: "mg",
        sources: ["Dairy", "Leafy greens", "Sardines", "Fortified foods"],
      },
      magnesium: {
        amount: gender === "male" ? 400 : 310,
        unit: "mg",
        sources: ["Nuts", "Seeds", "Whole grains", "Dark chocolate"],
      },
      zinc: {
        amount: gender === "male" ? 11 : 8,
        unit: "mg",
        sources: ["Meat", "Shellfish", "Seeds", "Nuts"],
      },
      omega3: {
        amount: 1.6,
        unit: "g",
        sources: ["Fatty fish", "Walnuts", "Flax seeds", "Chia seeds"],
      },
    };

    // Adjust for activity level
    const activityMultipliers = {
      sedentary: 1.0,
      lightly_active: 1.1,
      moderately_active: 1.2,
      very_active: 1.3,
      extremely_active: 1.4,
    };

    const multiplier = activityMultipliers[activityLevel];

    // Apply multipliers to nutrients that increase with activity
    const adjustedNeeds = { ...baseNeeds };
    ["iron", "magnesium", "zinc"].forEach((nutrient) => {
      adjustedNeeds[nutrient as keyof typeof adjustedNeeds].amount *=
        multiplier;
    });

    return adjustedNeeds;
  }
}
