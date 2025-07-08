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
import { AdaptationRecommendation } from "./adaptation-engine";
import { UserMemoryProfile } from "./smart-memory";
import { MacroTargets, WorkoutPlan as GeneratedWorkoutPlan } from "./plan-generators";
import { WearableDataPoint, SmartIntervention } from "./automation-engine";
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
export declare class NateAICore {
    private config;
    private adaptationEngine;
    private smartMemoryEngine;
    private planGenerationEngine;
    private dataCollectionEngine;
    private automationEngine;
    private openaiService?;
    constructor(config: NateAIConfig);
    handleConversation(userId: string, message: string): Promise<NateAIResponse>;
    processWearableData(userId: string, dataPoint: WearableDataPoint): Promise<void>;
    handleMissedWorkout(userId: string, workoutId: string): Promise<void>;
    private checkForAdaptations;
}
//# sourceMappingURL=nate-ai-core.d.ts.map