export class PlanGenerators {
    /**
     * Generate a basic workout plan
     */
    static generateWorkoutPlan(preferences) {
        const exercises = this.getExercisesForType(preferences.type, preferences.equipment, preferences.difficulty);
        return {
            id: this.generateId(),
            title: this.generateWorkoutTitle(preferences.type, preferences.difficulty),
            type: preferences.type,
            difficulty: preferences.difficulty,
            duration: preferences.duration,
            equipment: preferences.equipment,
            exercises,
            estimatedCalories: this.estimateCalories(preferences.type, preferences.difficulty, preferences.duration),
        };
    }
    /**
     * Generate a basic meal plan
     */
    static generateMealPlan(requirements) {
        const recipes = this.getRecipesForMealType(requirements.mealType, requirements.dietaryRestrictions);
        const selectedRecipe = this.selectRecipe(recipes, requirements.calories, requirements.protein);
        return selectedRecipe;
    }
    /**
     * Generate weekly workout schedule
     */
    static generateWeeklySchedule(preferences) {
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
            }
            else {
                const workoutType = preferences.workoutTypes[workoutCount % preferences.workoutTypes.length];
                const workout = this.generateWorkoutPlan({
                    type: workoutType,
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
    static generateMealPrepPlan(userMetrics, macroTargets, preferences) {
        const meals = [];
        const mealTypes = [
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
        const prepInstructions = this.generatePrepInstructions(meals, preferences.prepDays);
        return {
            meals,
            shoppingList,
            prepInstructions,
        };
    }
    // Helper methods
    static getExercisesForType(type, equipment, difficulty) {
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
        return (exerciseDatabase[type] ||
            exerciseDatabase.strength);
    }
    static getRecipesForMealType(mealType, restrictions) {
        const recipeDatabase = [
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
    static selectRecipe(recipes, targetCalories, targetProtein) {
        if (recipes.length === 0) {
            throw new Error("No suitable recipes found");
        }
        // Simple selection - pick first recipe that roughly matches calories
        const suitable = recipes.find((recipe) => Math.abs(recipe.nutrition.calories - targetCalories) <
            targetCalories * 0.2);
        return suitable || recipes[0];
    }
    static generateWorkoutTitle(type, difficulty) {
        const titles = {
            strength: `${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Strength Training`,
            cardio: `${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Cardio Workout`,
            hiit: `${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} HIIT Session`,
            flexibility: `${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Flexibility Flow`,
        };
        return titles[type] || "Custom Workout";
    }
    static estimateCalories(type, difficulty, duration) {
        const metValues = {
            strength: { easy: 3, moderate: 5, hard: 6 },
            cardio: { easy: 5, moderate: 7, hard: 9 },
            hiit: { easy: 7, moderate: 8, hard: 10 },
            flexibility: { easy: 2, moderate: 3, hard: 4 },
        };
        const met = metValues[type]?.[difficulty] || 5;
        const avgWeight = 70; // kg - average weight for estimation
        return Math.round(met * avgWeight * (duration / 60));
    }
    static generateShoppingList(meals) {
        const ingredients = new Map();
        meals.forEach((meal) => {
            meal.ingredients.forEach((ingredient) => {
                const key = ingredient.item.toLowerCase();
                const amount = parseFloat(ingredient.amount) || 0;
                if (ingredients.has(key)) {
                    const existing = ingredients.get(key);
                    existing.amount += amount;
                }
                else {
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
    static categorizeIngredient(ingredient) {
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
    static generatePrepInstructions(meals, prepDays) {
        return [
            "Complete shopping 1 day before prep day",
            "Wash and chop all vegetables",
            "Cook grains and proteins in batches",
            "Store meals in portion-controlled containers",
            "Label containers with contents and date",
        ];
    }
    static generateId() {
        return Math.random().toString(36).substr(2, 9);
    }
}
//# sourceMappingURL=generators.js.map