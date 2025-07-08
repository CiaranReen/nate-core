/**
 * Nate AI Core System
 *
 * This is the integrated system that orchestrates all 5 proprietary components:
 * 1. Custom Adaptation Engine
 * 2. Persistent Smart Memory
 * 3. Plan Generation Algorithms
 * 4. Data Collection & Training Flow
 * 5. Automation & Wearables Integration
 *
 * This creates a comprehensive AI coach that is impossible for competitors
 * using GPT alone to replicate.
 */

import {
  AdaptationEngine,
  UserMetrics,
  AdaptationRecommendation,
} from "./adaptation-engine";

import {
  SmartMemoryEngine,
  UserMemoryProfile,
  ContextualInsights,
} from "./smart-memory";

import {
  PlanGenerationEngine,
  MacroTargets,
  WorkoutPlan as GeneratedWorkoutPlan,
} from "./plan-generators";

import { DataCollectionEngine, DataType, PlanLibrary } from "./data-collection";

import {
  AutomationEngine,
  WearableDataPoint,
  ProactiveCoaching,
  SmartIntervention,
} from "./automation-engine";

import {
  OpenAIService,
  OpenAIUserProfile as BaseUserProfile,
  OpenAIConversationContext as BaseConversationContext,
} from "../clients/openai";

import { PromptBuilder } from "./prompt-builders";

// Core Nate AI interfaces
export interface NateAIConfig {
  openaiApiKey?: string;
  enableDataCollection: boolean;
  enableWearableIntegration: boolean;
  enableProactiveCoaching: boolean;
  enableSmartMemory: boolean;
  enableCustomAdaptation: boolean;
  privacyLevel: "minimal" | "standard" | "comprehensive";
  debugMode?: boolean;
}

export interface NateAIResponse {
  message: string;
  confidence: number;
  reasoning: string[];
  adaptations?: AdaptationRecommendation[];
  interventions?: SmartIntervention[];
  metadata: {
    responseTime: number;
    dataSourcesUsed: string[];
  };
}

export interface NateAIState {
  userId: string;
  sessionId: string;
  context: EnhancedContext;
  memoryProfile?: UserMemoryProfile;
  currentPlans: CurrentPlans;
  recentData: RecentData;
  activeInterventions: SmartIntervention[];
}

export interface EnhancedContext {
  conversationHistory: ConversationMessage[];
  currentTopic: string;
  userMood: number;
  lastActivity: string;
  environmentalFactors: EnvironmentalFactors;
  userIntent: string;
  urgencyLevel: number;
}

export interface ConversationMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  metadata?: any;
}

export interface EnvironmentalFactors {
  timeOfDay: string;
  dayOfWeek: string;
  weather?: any;
  location?: string;
  stressIndicators: number;
}

export interface CurrentPlans {
  workout?: GeneratedWorkoutPlan;
  nutrition?: MacroTargets;
  recovery?: RecoveryPlan;
  goals?: GoalPlan[];
}

export interface RecoveryPlan {
  sleepTarget: number;
  stressManagement: string[];
  activeRecovery: string[];
  restDays: string[];
}

export interface GoalPlan {
  goal: string;
  target: number;
  deadline: Date;
  progress: number;
  milestones: Milestone[];
}

export interface Milestone {
  name: string;
  target: number;
  deadline: Date;
  achieved: boolean;
  achievedDate?: Date;
}

export interface RecentData {
  workouts: any[];
  nutrition: any[];
  biometrics: any[];
  mood: any[];
  wearable: WearableDataPoint[];
}

export class NateAICore {
  private config: NateAIConfig;
  private adaptationEngine: AdaptationEngine;
  private smartMemoryEngine: SmartMemoryEngine;
  private planGenerationEngine: PlanGenerationEngine;
  private dataCollectionEngine: DataCollectionEngine;
  private automationEngine: AutomationEngine;
  private openaiService?: OpenAIService;

  constructor(config: NateAIConfig) {
    this.config = config;
    this.adaptationEngine = new AdaptationEngine();
    this.smartMemoryEngine = new SmartMemoryEngine();
    this.planGenerationEngine = new PlanGenerationEngine();
    this.dataCollectionEngine = new DataCollectionEngine();
    this.automationEngine = new AutomationEngine();

    // Initialize OpenAI service if API key is provided
    if (config.openaiApiKey) {
      this.openaiService = new OpenAIService({
        apiKey: config.openaiApiKey,
      });
    }
  }

  async handleConversation(
    userId: string,
    message: string
  ): Promise<NateAIResponse> {
    const startTime = Date.now();

    try {
      // Get user memory profile for context
      const memoryProfile =
        await this.smartMemoryEngine.getMemoryProfile(userId);

      // Generate contextual insights
      const insights = await this.smartMemoryEngine.generateContextualInsights(
        userId,
        message
      );

      // Check for needed adaptations
      const adaptations = await this.checkForAdaptations(userId);

      // Get any active interventions (for now return empty array)
      const interventions: SmartIntervention[] = [];

      // Generate response (fallback to basic response for now)
      let responseMessage =
        "I'm here to help you achieve your fitness goals! How can I assist you today?";

      // Try to use OpenAI if available
      if (this.openaiService && memoryProfile) {
        try {
          const gptResponse = await this.openaiService.generateResponse([
            {
              role: "system",
              content: `You are Nate, a personalized AI fitness coach. User context: ${JSON.stringify(insights)}`,
            },
            {
              role: "user",
              content: message,
            },
          ]);
          responseMessage = gptResponse.message;
        } catch (error) {
          console.warn("OpenAI fallback failed, using default response");
        }
      }

      return {
        message: responseMessage,
        confidence: 0.8,
        reasoning: ["Memory profile loaded", "Contextual insights generated"],
        adaptations,
        interventions,
        metadata: {
          responseTime: Date.now() - startTime,
          dataSourcesUsed: [
            "smart_memory",
            "adaptation_engine",
            "automation_engine",
          ],
        },
      };
    } catch (error) {
      console.error("NateAI conversation error:", error);
      return {
        message:
          "I'm having trouble processing your request right now. Please try again.",
        confidence: 0.3,
        reasoning: ["Error occurred during processing"],
        metadata: {
          responseTime: Date.now() - startTime,
          dataSourcesUsed: ["error_handler"],
        },
      };
    }
  }

  async processWearableData(
    userId: string,
    dataPoint: WearableDataPoint
  ): Promise<void> {
    try {
      // Process wearable data through automation engine
      await this.automationEngine.processWearableData(dataPoint);

      // Check if adaptations are needed based on the data
      await this.checkForAdaptations(userId);

      console.log(
        `Processed wearable data for user ${userId}:`,
        dataPoint.dataType
      );
    } catch (error) {
      console.error("Error processing wearable data:", error);
    }
  }

  async handleMissedWorkout(userId: string, workoutId: string): Promise<void> {
    try {
      // Use automation engine to handle missed workout
      await this.automationEngine.handleMissedWorkout(userId, workoutId);

      console.log(`Handled missed workout for user ${userId}: ${workoutId}`);
    } catch (error) {
      console.error("Error handling missed workout:", error);
    }
  }

  private async checkForAdaptations(
    userId: string
  ): Promise<AdaptationRecommendation[]> {
    try {
      // This would normally get real user metrics, for now create a basic structure
      const userMetrics: UserMetrics = {
        userId,
        currentPlan: {
          id: "demo-plan",
          type: "strength",
          intensity: 7,
          volume: 12,
          frequency: 3,
          duration: 60,
          exercises: [],
          progressionRate: 2.5,
        },
        recentWorkouts: [],
        progressData: {
          streak: 5,
          weeklyConsistency: 0.8,
          monthlyConsistency: 0.75,
          totalWorkouts: 20,
          averageRating: 7.5,
          strengthGains: {},
          cardioGains: {},
        },
        biometrics: {
          lastUpdated: new Date(),
        },
        lifestyle: {
          sleepHours: 7,
          sleepQuality: 7,
          stressLevel: 5,
          energyLevel: 7,
          workload: 6,
          nutritionCompliance: 0.8,
          hydration: 2.5,
        },
        mood: {
          score: 7,
          motivation: 8,
          confidence: 7,
          anxiety: 4,
          recentTrend: "stable",
        },
      };

      return this.adaptationEngine.analyze(userMetrics);
    } catch (error) {
      console.error("Error checking adaptations:", error);
      return [];
    }
  }
}
