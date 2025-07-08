# @nate/utils

Shared utilities package for the Nate fitness app monorepo. This package provides core functionality for AI interactions, API clients, fitness calculations, and plan generation.

## Installation

```bash
npm install @nate/utils
```

## Modules

### AI Utilities (`@nate/utils/ai`)

#### PromptBuilder

Constructs optimized prompts for OpenAI interactions:

```typescript
import {
  PromptBuilder,
  UserProfile,
  ConversationContext,
} from "@nate/utils/ai";

const userProfile: UserProfile = {
  id: "user-123",
  name: "John",
  age: 30,
  height: 180,
  weight: 75,
  fitnessGoal: "muscle_gain",
  activityLevel: "moderately_active",
  // ... other properties
};

const context: ConversationContext = {
  userId: "user-123",
  conversationId: "conv-456",
  messageHistory: [
    { role: "user", content: "I want to build muscle", timestamp: new Date() },
  ],
};

// Generate coaching prompt
const prompt = PromptBuilder.buildCoachingPrompt(
  userProfile,
  context,
  "What's the best workout for me?"
);

// Generate workout plan prompt
const workoutPrompt = PromptBuilder.buildWorkoutPrompt(
  userProfile,
  "strength",
  45, // duration in minutes
  "moderate"
);
```

#### ContextFormatter

Manages conversation context and token limits:

```typescript
import { ContextFormatter, SessionContext } from "@nate/utils/ai";

const sessionContext: SessionContext = {
  conversationId: "conv-123",
  userId: "user-123",
  userProfile,
  messages: conversationHistory,
  maxTokens: 4000,
  contextWindow: 8000,
  priority: "balanced",
};

// Format for GPT API
const formattedMessages = ContextFormatter.formatForGPT(
  sessionContext,
  systemPrompt,
  userMessage
);

// Summarize conversation
const summary = ContextFormatter.summarizeContext(
  messages,
  userProfile,
  "week"
);
```

### Client Utilities (`@nate/utils/clients`)

#### SupabaseService

Comprehensive Supabase client with typed methods:

```typescript
import { SupabaseService } from "@nate/utils/clients";

const supabase = new SupabaseService(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

// User management
const user = await supabase.signUp("email@example.com", "password");
const profile = await supabase.getUserProfile(userId);

// Workout plans
const workoutPlan = await supabase.createWorkoutPlan({
  user_id: userId,
  title: "Morning Strength",
  type: "strength",
  duration_minutes: 45,
  // ... other properties
});

// Conversations and messages
const conversation = await supabase.createConversation(userId, "Fitness Chat");
const message = await supabase.createMessage({
  conversation_id: conversation.id,
  user_id: userId,
  sender: "user",
  content: "Hello Nate!",
});

// Progress tracking
const progress = await supabase.createProgressEntry({
  user_id: userId,
  date: new Date().toISOString().split("T")[0],
  weight: 75,
  mood_score: 8,
});
```

#### OpenAIService

OpenAI client with fitness-specific methods:

```typescript
import { OpenAIService } from "@nate/utils/clients";

const openai = new OpenAIService({
  apiKey: process.env.OPENAI_API_KEY!,
  defaultModel: "gpt-4-turbo-preview",
  maxTokens: 4000,
  temperature: 0.7,
});

// Generate responses
const response = await openai.generateResponse([
  { role: "system", content: "You are a fitness coach" },
  { role: "user", content: "Help me build muscle" },
]);

// Generate structured content
const workoutPlan = await openai.generateStructuredResponse(
  workoutPrompt,
  "You are an expert fitness trainer."
);

// Stream responses
for await (const chunk of openai.streamResponse(messages)) {
  console.log(chunk);
}
```

### Fitness Calculations (`@nate/utils/fitness`)

#### FitnessCalculations

Core fitness and nutrition calculations:

```typescript
import { FitnessCalculations, UserMetrics } from "@nate/utils/fitness";

const userMetrics: UserMetrics = {
  age: 30,
  height: 180, // cm
  weight: 75, // kg
  gender: "male",
  activityLevel: "moderately_active",
  fitnessGoal: "muscle_gain",
};

// Basic calculations
const bmi = FitnessCalculations.calculateBMI(75, 180); // 23.1
const bmr = FitnessCalculations.calculateBMR(75, 180, 30, "male"); // ~1800
const tdee = FitnessCalculations.calculateTDEE(bmr, "moderately_active"); // ~2800

// Calorie and macro targets
const calorieTarget = FitnessCalculations.calculateCalorieTarget(
  tdee,
  "muscle_gain"
);
const macros = FitnessCalculations.calculateMacroTargets(
  calorieTarget,
  75, // weight
  "muscle_gain",
  "moderately_active"
);

// Exercise calculations
const oneRepMax = FitnessCalculations.calculateOneRepMax(100, 5); // ~117kg
const caloriesBurned = FitnessCalculations.calculateCaloriesBurned(
  75, // weight
  45, // duration in minutes
  5.0 // MET value
);

// Activity MET values
const met = FitnessCalculations.getActivityMET("weightlifting_moderate"); // 5.0
```

### Plan Generation (`@nate/utils/plans`)

#### PlanGenerators

Generate workout and meal plans:

```typescript
import { PlanGenerators } from "@nate/utils/plans";

// Generate workout plan
const workoutPlan = PlanGenerators.generateWorkoutPlan({
  type: "strength",
  duration: 45,
  equipment: ["dumbbells", "bench"],
  difficulty: "moderate",
});

// Generate meal plan
const mealPlan = PlanGenerators.generateMealPlan({
  mealType: "breakfast",
  calories: 400,
  protein: 30,
  dietaryRestrictions: ["vegetarian"],
});

// Generate weekly schedule
const weeklySchedule = PlanGenerators.generateWeeklySchedule({
  workoutsPerWeek: 4,
  workoutTypes: ["strength", "cardio"],
  duration: 45,
  equipment: ["bodyweight", "dumbbells"],
});
```

## Usage in Monorepo

### Backend (Fastify)

```typescript
import {
  SupabaseService,
  OpenAIService,
  FitnessCalculations,
} from "@nate/utils";

// In your route handlers
app.post("/api/chat", async (request, reply) => {
  const { message, userId } = request.body;

  const userProfile = await supabase.getUserProfile(userId);
  const response = await openai.generateCoachingResponse(
    userProfile,
    context,
    message
  );

  return { response: response.message };
});
```

### Mobile App (React Native)

```typescript
import { FitnessCalculations, PlanGenerators } from "@nate/utils";

// In your React Native components
const ProfileScreen = () => {
  const calculateUserMetrics = (userData) => {
    const bmi = FitnessCalculations.calculateBMI(
      userData.weight,
      userData.height
    );
    const macros = FitnessCalculations.calculateMacroTargets(
      userData.calories,
      userData.weight,
      userData.goal,
      userData.activityLevel
    );

    return { bmi, macros };
  };

  // ... component logic
};
```

### DAO (Analytics)

```typescript
import { SupabaseService } from "@nate/utils";

// In your analytics service
const syncUserData = async () => {
  const users = await supabase.getUserStats(userId, 30);
  // Process and sync to BigQuery
};
```

## TypeScript Support

All utilities are fully typed with TypeScript. Import types as needed:

```typescript
import type {
  UserProfile,
  ConversationContext,
  MacroTargets,
  WorkoutPlan,
  MealPlan,
} from "@nate/utils";
```

## Environment Variables

Some utilities require environment variables:

```env
# Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key

# OpenAI
OPENAI_API_KEY=your_openai_api_key
```

## Development

```bash
# Install dependencies
npm install

# Build the package
npm run build

# Run in development mode
npm run dev

# Type checking
npm run type-check

# Linting
npm run lint
npm run lint:fix
```

## Contributing

When adding new utilities:

1. Create the utility in the appropriate module (`ai/`, `clients/`, `fitness/`, `plans/`)
2. Export it from the module's `index.ts`
3. Add comprehensive JSDoc comments
4. Include TypeScript types
5. Update this README with usage examples
6. Add tests if applicable

## Integration Notes

- **Backend**: Use for AI prompts, database operations, and calculations
- **Mobile**: Use for calculations, plan generation, and client-side logic
- **DAO**: Use for data transformations and analytics calculations
- **Shared Types**: Consider moving common types to `@nate/types` package

This package serves as the foundation for business logic across the entire Nate fitness app ecosystem.
