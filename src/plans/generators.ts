import {
  UserMetrics,
  MacroTargets,
  FitnessCalculations,
} from "../fitness/calculations";

export interface Exercise {
  name: string;
  category: "strength" | "cardio" | "flexibility" | "core";
  equipment: string[];
  primaryMuscles: string[];
  secondaryMuscles: string[];
  difficulty: "beginner" | "intermediate" | "advanced";
  instructions: string[];
  modifications: {
    easier: string;
    harder: string;
  };
}

export interface WorkoutPlan {
  id: string;
  title: string;
  type: "strength" | "cardio" | "hiit" | "flexibility" | "full_body";
  difficulty: "easy" | "moderate" | "hard";
  duration: number;
  equipment: string[];
  exercises: Array<{
    name: string;
    sets?: number;
    reps?: string;
    duration?: string;
    instructions: string;
  }>;
  estimatedCalories: number;
}

export interface MealPlan {
  id: string;
  title: string;
  mealType: "breakfast" | "lunch" | "dinner" | "snack";
  prepTime: number;
  cookTime: number;
  servings: number;
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
  ingredients: Array<{
    item: string;
    amount: string;
    unit: string;
  }>;
  instructions: string[];
  tags: string[];
}

export class PlanGenerators {
  /**
   * Generate a basic workout plan
   */
  static generateWorkoutPlan(preferences: {
    type: "strength" | "cardio" | "hiit" | "flexibility" | "full_body";
    duration: number;
    equipment: string[];
    difficulty: "easy" | "moderate" | "hard";
  }): WorkoutPlan {
    const exercises = this.getExercisesForType(
      preferences.type,
      preferences.equipment,
      preferences.difficulty
    );

    return {
      id: this.generateId(),
      title: this.generateWorkoutTitle(
        preferences.type,
        preferences.difficulty
      ),
      type: preferences.type,
      difficulty: preferences.difficulty,
      duration: preferences.duration,
      equipment: preferences.equipment,
      exercises,
      estimatedCalories: this.estimateCalories(
        preferences.type,
        preferences.difficulty,
        preferences.duration
      ),
    };
  }

  /**
   * Generate a basic meal plan
   */
  static generateMealPlan(requirements: {
    mealType: "breakfast" | "lunch" | "dinner" | "snack";
    calories: number;
    protein: number;
    dietaryRestrictions: string[];
  }): MealPlan {
    const recipes = this.getRecipesForMealType(
      requirements.mealType,
      requirements.dietaryRestrictions
    );
    const selectedRecipe = this.selectRecipe(
      recipes,
      requirements.calories,
      requirements.protein
    );

    return selectedRecipe;
  }

  /**
   * Generate weekly workout schedule
   */
  static generateWeeklySchedule(preferences: {
    workoutsPerWeek: number;
    workoutTypes: string[];
    duration: number;
    equipment: string[];
  }): Array<{ day: string; workout?: WorkoutPlan; isRestDay: boolean }> {
    const days = [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ];
    const schedule = [];

    let workoutCount = 0;
    for (const day of days) {
      if (workoutCount >= preferences.workoutsPerWeek) {
        schedule.push({ day, isRestDay: true });
      } else {
        const workoutType =
          preferences.workoutTypes[
            workoutCount % preferences.workoutTypes.length
          ];
        const workout = this.generateWorkoutPlan({
          type: workoutType as any,
          duration: preferences.duration,
          equipment: preferences.equipment,
          difficulty: "moderate",
        });

        schedule.push({ day, workout, isRestDay: false });
        workoutCount++;
      }
    }

    return schedule;
  }

  /**
   * Generate meal prep plan for the week
   */
  static generateMealPrepPlan(
    userMetrics: UserMetrics,
    macroTargets: MacroTargets,
    preferences: {
      mealsPerDay: number;
      prepDays: string[]; // ['sunday', 'wednesday']
      dietaryRestrictions: string[];
      allergies: string[];
      budget?: "low" | "medium" | "high";
    }
  ): {
    meals: MealPlan[];
    shoppingList: Array<{
      item: string;
      amount: string;
      unit: string;
      category: string;
    }>;
    prepInstructions: string[];
  } {
    const meals: MealPlan[] = [];
    const mealTypes: Array<"breakfast" | "lunch" | "dinner" | "snack"> = [
      "breakfast",
      "lunch",
      "dinner",
    ];

    if (preferences.mealsPerDay > 3) {
      mealTypes.push("snack");
    }

    // Generate meals for 7 days
    for (let day = 0; day < 7; day++) {
      for (const mealType of mealTypes) {
        const meal = this.generateMealPlan({
          mealType,
          calories: macroTargets.calories,
          protein: macroTargets.protein,
          dietaryRestrictions: preferences.dietaryRestrictions,
        });
        meals.push(meal);
      }
    }

    const shoppingList = this.generateShoppingList(meals);
    const prepInstructions = this.generatePrepInstructions(
      meals,
      preferences.prepDays
    );

    return {
      meals,
      shoppingList,
      prepInstructions,
    };
  }

  // Helper methods
  private static getExercisesForType(
    type: string,
    equipment: string[],
    difficulty: string
  ): WorkoutPlan["exercises"] {
    const exerciseDatabase = {
      strength: [
        {
          name: "Push-ups",
          sets: 3,
          reps: "8-12",
          instructions: "Keep body straight, lower chest to floor",
        },
        {
          name: "Squats",
          sets: 3,
          reps: "12-15",
          instructions: "Lower as if sitting back into chair",
        },
        {
          name: "Plank",
          duration: "30-60s",
          instructions: "Hold straight line from head to heels",
        },
      ],
      cardio: [
        {
          name: "Jumping Jacks",
          duration: "30s",
          instructions: "Jump feet apart while raising arms",
        },
        {
          name: "High Knees",
          duration: "30s",
          instructions: "Run in place bringing knees to chest",
        },
        {
          name: "Burpees",
          sets: 3,
          reps: "5-10",
          instructions: "Squat, jump back, push-up, jump forward, jump up",
        },
      ],
      hiit: [
        {
          name: "Mountain Climbers",
          duration: "20s",
          instructions: "Alternate bringing knees to chest in plank",
        },
        {
          name: "Jump Squats",
          sets: 4,
          reps: "10",
          instructions: "Squat down then jump up explosively",
        },
        {
          name: "Push-up Burpees",
          sets: 4,
          reps: "8",
          instructions: "Burpee with push-up at bottom",
        },
      ],
      flexibility: [
        {
          name: "Forward Fold",
          duration: "30s",
          instructions: "Bend forward from hips, let arms hang",
        },
        {
          name: "Cat-Cow Stretch",
          duration: "1min",
          instructions: "Alternate arching and rounding spine",
        },
        {
          name: "Child's Pose",
          duration: "1min",
          instructions: "Sit back on heels, arms extended forward",
        },
      ],
    };

    return (
      exerciseDatabase[type as keyof typeof exerciseDatabase] ||
      exerciseDatabase.strength
    );
  }

  private static getRecipesForMealType(
    mealType: string,
    restrictions: string[]
  ): MealPlan[] {
    const recipeDatabase: MealPlan[] = [
      {
        id: "breakfast-1",
        title: "Protein Scrambled Eggs",
        mealType: "breakfast",
        prepTime: 5,
        cookTime: 10,
        servings: 1,
        nutrition: { calories: 350, protein: 28, carbs: 8, fat: 22, fiber: 2 },
        ingredients: [
          { item: "Eggs", amount: "3", unit: "large" },
          { item: "Spinach", amount: "1", unit: "cup" },
          { item: "Cheese", amount: "30", unit: "g" },
        ],
        instructions: [
          "Heat pan over medium heat",
          "Scramble eggs with spinach",
          "Add cheese and serve",
        ],
        tags: ["high-protein", "quick", "vegetarian"],
      },
      {
        id: "lunch-1",
        title: "Chicken and Rice Bowl",
        mealType: "lunch",
        prepTime: 10,
        cookTime: 20,
        servings: 1,
        nutrition: { calories: 450, protein: 35, carbs: 45, fat: 12, fiber: 4 },
        ingredients: [
          { item: "Chicken breast", amount: "150", unit: "g" },
          { item: "Brown rice", amount: "80", unit: "g" },
          { item: "Vegetables", amount: "200", unit: "g" },
        ],
        instructions: [
          "Cook rice according to package instructions",
          "Grill chicken breast until cooked through",
          "Steam vegetables and combine in bowl",
        ],
        tags: ["balanced", "meal-prep", "gluten-free"],
      },
    ];

    return recipeDatabase.filter((recipe) => recipe.mealType === mealType);
  }

  private static selectRecipe(
    recipes: MealPlan[],
    targetCalories: number,
    targetProtein: number
  ): MealPlan {
    if (recipes.length === 0) {
      throw new Error("No suitable recipes found");
    }

    // Simple selection - pick first recipe that roughly matches calories
    const suitable = recipes.find(
      (recipe) =>
        Math.abs(recipe.nutrition.calories - targetCalories) <
        targetCalories * 0.2
    );

    return suitable || recipes[0];
  }

  private static generateWorkoutTitle(
    type: string,
    difficulty: string
  ): string {
    const titles = {
      strength: `${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Strength Training`,
      cardio: `${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Cardio Workout`,
      hiit: `${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} HIIT Session`,
      flexibility: `${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Flexibility Flow`,
    };
    return titles[type as keyof typeof titles] || "Custom Workout";
  }

  private static estimateCalories(
    type: string,
    difficulty: string,
    duration: number
  ): number {
    const metValues = {
      strength: { easy: 3, moderate: 5, hard: 6 },
      cardio: { easy: 5, moderate: 7, hard: 9 },
      hiit: { easy: 7, moderate: 8, hard: 10 },
      flexibility: { easy: 2, moderate: 3, hard: 4 },
    };

    const met =
      metValues[type as keyof typeof metValues]?.[
        difficulty as keyof typeof metValues.strength
      ] || 5;
    const avgWeight = 70; // kg - average weight for estimation

    return Math.round(met * avgWeight * (duration / 60));
  }

  private static generateShoppingList(meals: MealPlan[]): Array<{
    item: string;
    amount: string;
    unit: string;
    category: string;
  }> {
    const ingredients = new Map<
      string,
      { amount: number; unit: string; category: string }
    >();

    meals.forEach((meal) => {
      meal.ingredients.forEach((ingredient) => {
        const key = ingredient.item.toLowerCase();
        const amount = parseFloat(ingredient.amount) || 0;

        if (ingredients.has(key)) {
          const existing = ingredients.get(key)!;
          existing.amount += amount;
        } else {
          ingredients.set(key, {
            amount,
            unit: ingredient.unit,
            category: this.categorizeIngredient(ingredient.item),
          });
        }
      });
    });

    return Array.from(ingredients.entries()).map(([item, data]) => ({
      item: item.charAt(0).toUpperCase() + item.slice(1),
      amount: data.amount.toString(),
      unit: data.unit,
      category: data.category,
    }));
  }

  private static categorizeIngredient(ingredient: string): string {
    const categories = {
      Produce: [
        "spinach",
        "kale",
        "tomato",
        "onion",
        "garlic",
        "apple",
        "banana",
      ],
      Protein: ["chicken", "beef", "fish", "eggs", "tofu"],
      Dairy: ["milk", "cheese", "yogurt", "butter"],
      Grains: ["rice", "bread", "pasta", "oats"],
      Pantry: ["oil", "salt", "pepper", "spices"],
    };

    const lowerIngredient = ingredient.toLowerCase();
    for (const [category, items] of Object.entries(categories)) {
      if (items.some((item) => lowerIngredient.includes(item))) {
        return category;
      }
    }
    return "Other";
  }

  private static generatePrepInstructions(
    meals: MealPlan[],
    prepDays: string[]
  ): string[] {
    return [
      "Complete shopping 1 day before prep day",
      "Wash and chop all vegetables",
      "Cook grains and proteins in batches",
      "Store meals in portion-controlled containers",
      "Label containers with contents and date",
    ];
  }

  private static generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}
