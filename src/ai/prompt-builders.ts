import { z } from "zod";

// Base types for prompt building
export interface UserProfile {
  id: string;
  name: string;
  age: number;
  height: number; // cm
  weight: number; // kg
  fitnessGoal:
    | "weight_loss"
    | "muscle_gain"
    | "endurance"
    | "strength"
    | "general_fitness";
  activityLevel:
    | "sedentary"
    | "lightly_active"
    | "moderately_active"
    | "very_active"
    | "extremely_active";
  workoutFrequency: number; // days per week
  workoutDuration: number; // minutes
  dietaryRestrictions: string[];
  allergies: string[];
  equipment: string[];
  experience: "beginner" | "intermediate" | "advanced";
  injuries?: string[];
  preferences?: string[];
}

export interface ConversationContext {
  userId: string;
  conversationId: string;
  messageHistory: Array<{
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
  }>;
  currentTopic?: "fitness" | "nutrition" | "motivation" | "general";
  userMood?: number; // 1-10
  lastWorkout?: {
    date: Date;
    type: string;
    duration: number;
    completed: boolean;
  };
  recentProgress?: {
    weight?: number;
    measurements?: Record<string, number>;
    achievements?: string[];
  };
}

export class PromptBuilder {
  /**
   * Build a personalized fitness coaching prompt
   */
  static buildCoachingPrompt(
    userProfile: UserProfile,
    context: ConversationContext,
    userMessage: string
  ): string {
    const systemPrompt = `You are Nate, an expert AI fitness coach and nutritionist. You provide personalized, encouraging, and scientifically-backed advice.

PERSONALITY:
- Supportive and motivating, never judgmental
- Use the user's name (${userProfile.name}) naturally in conversation
- Adapt your tone based on user's mood and context
- Celebrate small wins and progress
- Provide actionable, specific advice

USER PROFILE:
- Name: ${userProfile.name}
- Age: ${userProfile.age}
- Height: ${userProfile.height}cm, Weight: ${userProfile.weight}kg
- Primary Goal: ${userProfile.fitnessGoal.replace("_", " ")}
- Activity Level: ${userProfile.activityLevel.replace("_", " ")}
- Experience: ${userProfile.experience}
- Workout Frequency: ${userProfile.workoutFrequency} days/week
- Preferred Duration: ${userProfile.workoutDuration} minutes
- Equipment: ${userProfile.equipment.join(", ") || "None specified"}
- Dietary Restrictions: ${userProfile.dietaryRestrictions.join(", ") || "None"}
- Allergies: ${userProfile.allergies.join(", ") || "None"}
${userProfile.injuries ? `- Injuries/Limitations: ${userProfile.injuries.join(", ")}` : ""}

CONTEXT:
${context.currentTopic ? `- Current Topic: ${context.currentTopic}` : ""}
${context.userMood ? `- User Mood: ${context.userMood}/10` : ""}
${context.lastWorkout ? `- Last Workout: ${context.lastWorkout.type} on ${context.lastWorkout.date.toDateString()} (${context.lastWorkout.completed ? "completed" : "incomplete"})` : ""}
${context.recentProgress ? `- Recent Progress: ${JSON.stringify(context.recentProgress)}` : ""}

RECENT CONVERSATION:
${context.messageHistory
  .slice(-5)
  .map((msg) => `${msg.role}: ${msg.content}`)
  .join("\n")}

GUIDELINES:
- Keep responses conversational and under 200 words unless detailed explanation is needed
- Always consider the user's fitness goal and current level
- Suggest modifications for injuries or limitations
- Encourage consistency over perfection
- Ask follow-up questions to better understand their needs
- Provide specific, actionable advice rather than generic tips

User's current message: "${userMessage}"

Respond as Nate:`;

    return systemPrompt;
  }

  /**
   * Build a workout generation prompt
   */
  static buildWorkoutPrompt(
    userProfile: UserProfile,
    workoutType: "strength" | "cardio" | "hiit" | "flexibility" | "full_body",
    duration: number,
    difficulty: "easy" | "moderate" | "hard"
  ): string {
    return `Generate a ${workoutType} workout for ${userProfile.name} with the following specifications:

USER PROFILE:
- Fitness Goal: ${userProfile.fitnessGoal.replace("_", " ")}
- Experience Level: ${userProfile.experience}
- Available Equipment: ${userProfile.equipment.join(", ") || "Bodyweight only"}
- Duration: ${duration} minutes
- Difficulty: ${difficulty}
${userProfile.injuries ? `- Injuries/Limitations: ${userProfile.injuries.join(", ")}` : ""}

WORKOUT REQUIREMENTS:
- ${workoutType.toUpperCase()} focused workout
- Appropriate warm-up (5-10 minutes)
- Main workout section (${duration - 15} minutes)
- Cool-down and stretching (5-10 minutes)
- Exercise modifications for ${userProfile.experience} level
- Clear instructions and form cues
- Rep ranges and rest periods
- Progress tracking suggestions

FORMAT:
Return a structured workout plan in JSON format with:
{
  "title": "Workout name",
  "description": "Brief description",
  "totalDuration": ${duration},
  "difficulty": "${difficulty}",
  "equipment": ["list of equipment needed"],
  "warmup": [
    {
      "exercise": "Exercise name",
      "duration": "time or reps",
      "instructions": "How to perform",
      "modifications": "Easier/harder variations"
    }
  ],
  "mainWorkout": [
    {
      "exercise": "Exercise name",
      "sets": number,
      "reps": "rep range",
      "rest": "rest time",
      "instructions": "Detailed form cues",
      "modifications": "Variations for different levels",
      "targetMuscles": ["muscle groups"]
    }
  ],
  "cooldown": [
    {
      "exercise": "Stretch name",
      "duration": "hold time",
      "instructions": "How to perform"
    }
  ],
  "notes": "Additional tips and progression advice"
}

Generate the workout now:`;
  }

  /**
   * Build a meal planning prompt
   */
  static buildMealPlanPrompt(
    userProfile: UserProfile,
    calories: number,
    macros: { protein: number; carbs: number; fat: number },
    mealType: "breakfast" | "lunch" | "dinner" | "snack",
    preferences?: string[]
  ): string {
    return `Create a ${mealType} meal plan for ${userProfile.name} with these specifications:

USER PROFILE:
- Fitness Goal: ${userProfile.fitnessGoal.replace("_", " ")}
- Dietary Restrictions: ${userProfile.dietaryRestrictions.join(", ") || "None"}
- Allergies: ${userProfile.allergies.join(", ") || "None"}
- Additional Preferences: ${preferences?.join(", ") || "None specified"}

NUTRITIONAL TARGETS:
- Calories: ${calories}
- Protein: ${macros.protein}g
- Carbohydrates: ${macros.carbs}g
- Fat: ${macros.fat}g

MEAL REQUIREMENTS:
- Meal Type: ${mealType.toUpperCase()}
- Nutritionally balanced and aligned with fitness goals
- Consider dietary restrictions and allergies
- Include preparation time and difficulty
- Provide ingredient substitutions where possible
- Include nutritional breakdown per serving

FORMAT:
Return a structured meal plan in JSON format:
{
  "title": "Meal name",
  "mealType": "${mealType}",
  "servings": number,
  "prepTime": "preparation time",
  "cookTime": "cooking time",
  "difficulty": "easy/medium/hard",
  "nutrition": {
    "calories": number,
    "protein": number,
    "carbs": number,
    "fat": number,
    "fiber": number,
    "sugar": number
  },
  "ingredients": [
    {
      "item": "ingredient name",
      "amount": "quantity",
      "unit": "measurement unit",
      "substitutions": ["alternative options"]
    }
  ],
  "instructions": [
    "Step-by-step cooking instructions"
  ],
  "tips": [
    "Cooking tips and meal prep suggestions"
  ],
  "tags": ["meal characteristics like 'high-protein', 'quick', 'vegetarian']
}

Create the meal plan now:`;
  }

  /**
   * Build a progress analysis prompt
   */
  static buildProgressAnalysisPrompt(
    userProfile: UserProfile,
    progressData: {
      workouts: Array<{
        date: Date;
        type: string;
        duration: number;
        completed: boolean;
        rating?: number;
      }>;
      nutrition: Array<{
        date: Date;
        calories: number;
        protein: number;
        adherence: boolean;
      }>;
      measurements?: {
        weight: Array<{ date: Date; value: number }>;
        bodyFat?: Array<{ date: Date; value: number }>;
        measurements?: Record<string, Array<{ date: Date; value: number }>>;
      };
      mood: Array<{ date: Date; score: number; notes?: string }>;
    },
    timeframe: "week" | "month" | "quarter"
  ): string {
    return `Analyze ${userProfile.name}'s fitness progress over the past ${timeframe} and provide insights:

USER PROFILE:
- Primary Goal: ${userProfile.fitnessGoal.replace("_", " ")}
- Experience Level: ${userProfile.experience}
- Target Frequency: ${userProfile.workoutFrequency} workouts/week

PROGRESS DATA:
Workouts (${progressData.workouts.length} sessions):
${progressData.workouts
  .map(
    (w) =>
      `- ${w.date.toDateString()}: ${w.type} (${w.duration}min) - ${w.completed ? "Completed" : "Incomplete"}${w.rating ? ` - Rating: ${w.rating}/10` : ""}`
  )
  .join("\n")}

Nutrition Tracking (${progressData.nutrition.length} days):
${progressData.nutrition
  .map(
    (n) =>
      `- ${n.date.toDateString()}: ${n.calories} cal, ${n.protein}g protein - ${n.adherence ? "On track" : "Off track"}`
  )
  .join("\n")}

${
  progressData.measurements?.weight
    ? `Weight Tracking:
${progressData.measurements.weight.map((w) => `- ${w.date.toDateString()}: ${w.value}kg`).join("\n")}`
    : ""
}

Mood Tracking (${progressData.mood.length} entries):
${progressData.mood
  .map(
    (m) =>
      `- ${m.date.toDateString()}: ${m.score}/10${m.notes ? ` - ${m.notes}` : ""}`
  )
  .join("\n")}

ANALYSIS REQUIREMENTS:
- Identify patterns and trends
- Highlight achievements and improvements
- Note areas needing attention
- Provide specific, actionable recommendations
- Suggest adjustments to workout or nutrition plan
- Motivational insights and encouragement
- Set realistic goals for the next period

FORMAT:
Provide a comprehensive analysis in JSON format:
{
  "summary": "Overall progress summary",
  "achievements": ["List of accomplishments"],
  "patterns": {
    "positive": ["Good habits observed"],
    "concerning": ["Areas needing attention"]
  },
  "metrics": {
    "workoutConsistency": "percentage",
    "nutritionAdherence": "percentage",
    "averageMood": "score",
    "progressTowardsGoal": "assessment"
  },
  "recommendations": [
    {
      "category": "workout/nutrition/lifestyle",
      "suggestion": "Specific recommendation",
      "reasoning": "Why this helps",
      "implementation": "How to do it"
    }
  ],
  "nextGoals": ["Specific goals for next period"],
  "motivation": "Encouraging message"
}

Analyze the progress now:`;
  }

  /**
   * Build a motivational prompt based on user's current state
   */
  static buildMotivationalPrompt(
    userProfile: UserProfile,
    context: {
      recentStruggle?: string;
      missedWorkouts?: number;
      mood?: number;
      lastAchievement?: string;
    }
  ): string {
    return `Create a personalized motivational message for ${userProfile.name} based on their current situation:

USER CONTEXT:
- Fitness Goal: ${userProfile.fitnessGoal.replace("_", " ")}
- Experience Level: ${userProfile.experience}
${context.recentStruggle ? `- Recent Challenge: ${context.recentStruggle}` : ""}
${context.missedWorkouts ? `- Missed Workouts: ${context.missedWorkouts} recently` : ""}
${context.mood ? `- Current Mood: ${context.mood}/10` : ""}
${context.lastAchievement ? `- Recent Achievement: ${context.lastAchievement}` : ""}

MOTIVATIONAL GUIDELINES:
- Be empathetic and understanding
- Focus on progress, not perfection
- Provide specific, actionable encouragement
- Reference their personal goals and achievements
- Keep it genuine and avoid clichés
- Offer practical next steps
- Remind them of their "why"

Create a motivational message that:
1. Acknowledges their current situation
2. Celebrates any recent progress
3. Provides encouragement for moving forward
4. Suggests one small, achievable next step
5. Reinforces their capability to succeed

Keep the message personal, authentic, and under 150 words.`;
  }
}

// Validation schemas for prompt inputs
export const UserProfileSchema = z.object({
  id: z.string(),
  name: z.string(),
  age: z.number().min(13).max(120),
  height: z.number().min(100).max(250),
  weight: z.number().min(30).max(300),
  fitnessGoal: z.enum([
    "weight_loss",
    "muscle_gain",
    "endurance",
    "strength",
    "general_fitness",
  ]),
  activityLevel: z.enum([
    "sedentary",
    "lightly_active",
    "moderately_active",
    "very_active",
    "extremely_active",
  ]),
  workoutFrequency: z.number().min(1).max(7),
  workoutDuration: z.number().min(15).max(180),
  dietaryRestrictions: z.array(z.string()),
  allergies: z.array(z.string()),
  equipment: z.array(z.string()),
  experience: z.enum(["beginner", "intermediate", "advanced"]),
  injuries: z.array(z.string()).optional(),
  preferences: z.array(z.string()).optional(),
});

export const ConversationContextSchema = z.object({
  userId: z.string(),
  conversationId: z.string(),
  messageHistory: z.array(
    z.object({
      role: z.enum(["user", "assistant"]),
      content: z.string(),
      timestamp: z.date(),
    })
  ),
  currentTopic: z
    .enum(["fitness", "nutrition", "motivation", "general"])
    .optional(),
  userMood: z.number().min(1).max(10).optional(),
  lastWorkout: z
    .object({
      date: z.date(),
      type: z.string(),
      duration: z.number(),
      completed: z.boolean(),
    })
    .optional(),
  recentProgress: z
    .object({
      weight: z.number().optional(),
      measurements: z.record(z.number()).optional(),
      achievements: z.array(z.string()).optional(),
    })
    .optional(),
});
