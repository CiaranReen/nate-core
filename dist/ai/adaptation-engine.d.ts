/**
 * Nate's Proprietary Adaptation Engine
 *
 * This is the core intelligence layer that makes Nate unique.
 * It analyzes user data and applies hard-coded rules to automatically
 * adjust plans, macros, and recommendations without relying on GPT.
 */
import { z } from "zod";
export interface UserMetrics {
    userId: string;
    currentPlan: WorkoutPlan;
    recentWorkouts: WorkoutSession[];
    progressData: ProgressData;
    biometrics: BiometricData;
    lifestyle: LifestyleData;
    mood: MoodData;
}
export interface WorkoutPlan {
    id: string;
    type: "strength" | "cardio" | "hiit" | "flexibility" | "hybrid";
    intensity: number;
    volume: number;
    frequency: number;
    duration: number;
    exercises: Exercise[];
    progressionRate: number;
}
export interface Exercise {
    id: string;
    name: string;
    sets: number;
    reps: number | [number, number];
    weight?: number;
    duration?: number;
    intensity: number;
}
export interface WorkoutSession {
    id: string;
    planId: string;
    scheduledDate: Date;
    completedAt?: Date;
    completionRate: number;
    userRating: number;
    reportedFatigue: number;
    exerciseResults: ExerciseResult[];
    notes?: string;
}
export interface ExerciseResult {
    exerciseId: string;
    completedSets: number;
    completedReps: number[];
    completedWeight?: number;
    perceivedExertion: number;
    formRating?: number;
}
export interface ProgressData {
    streak: number;
    weeklyConsistency: number;
    monthlyConsistency: number;
    totalWorkouts: number;
    averageRating: number;
    strengthGains: Record<string, number>;
    cardioGains: Record<string, number>;
}
export interface BiometricData {
    weight?: number;
    bodyFat?: number;
    muscleMass?: number;
    restingHeartRate?: number;
    bloodPressure?: {
        systolic: number;
        diastolic: number;
    };
    measurements?: Record<string, number>;
    lastUpdated: Date;
}
export interface LifestyleData {
    sleepHours: number;
    sleepQuality: number;
    stressLevel: number;
    energyLevel: number;
    workload: number;
    nutritionCompliance: number;
    hydration: number;
}
export interface MoodData {
    score: number;
    motivation: number;
    confidence: number;
    anxiety: number;
    recentTrend: "improving" | "stable" | "declining";
}
export interface AdaptationRecommendation {
    type: "intensity" | "volume" | "frequency" | "exercise_swap" | "rest_day" | "nutrition" | "recovery";
    priority: "critical" | "high" | "medium" | "low";
    reason: string;
    changes: PlanChange[];
    duration: number;
    explanation: string;
}
export interface PlanChange {
    target: "intensity" | "volume" | "frequency" | "exercise" | "rest";
    adjustment: number | string;
    exerciseIds?: string[];
}
/**
 * 2️⃣ User Signature Model - Unique profile that evolves over time
 */
export interface UserSignature {
    userId: string;
    preferredIntensityRange: [number, number];
    averageRecoveryTime: number;
    commonFatigueTriggers: string[];
    motivationalTriggers: string[];
    planCompliancePattern: string;
    adaptationResponsiveness: number;
    preferredWorkoutTypes: string[];
    injuryRiskFactors: string[];
    plateauBreakers: string[];
    lastUpdated: Date;
    confidenceLevel: number;
}
/**
 * 4️⃣ Nate Proprietary Metrics - Unique to our platform
 */
export interface NateProprietaryMetrics {
    adaptiveRecoveryIndex: number;
    engagementScore: number;
    planVolatility: number;
    metabolicAdaptationScore: number;
    motivationalMomentum: number;
    adherenceQuality: number;
    progressVelocity: number;
    resilientIndex: number;
    adaptationEfficiency: number;
}
/**
 * 3️⃣ Plan Evolution & Learning System
 */
export interface AdaptationHistory {
    id: string;
    userId: string;
    timestamp: Date;
    triggeredRules: string[];
    recommendation: AdaptationRecommendation;
    userResponse: AdaptationOutcome;
    contextSnapshot: UserMetrics;
    effectiveness: number;
    durationEffective: number;
    userSatisfaction: number;
    longTermImpact: number;
}
export interface AdaptationOutcome {
    adherenceChange: number;
    motivationChange: number;
    performanceChange: number;
    satisfactionRating?: number;
    behaviorChange: string;
    followUpRequired: boolean;
    unexpectedEffects: string[];
}
export interface PlanLineage {
    planId: string;
    parentPlanId?: string;
    generationNumber: number;
    adaptationReason: string;
    successRate: number;
    dominantStrategies: string[];
    failedStrategies: string[];
    optimalConditions: string[];
    avgLifespan: number;
}
/**
 * 1️⃣ Rule Chaining & Contextual Layering
 */
export interface RuleContext {
    triggeredRules: AdaptationRule[];
    ruleInteractions: RuleInteraction[];
    compoundPriority: "critical" | "high" | "medium" | "low";
    contextualFactors: string[];
    emergentStrategy?: string;
}
export interface RuleInteraction {
    rules: string[];
    interactionType: "amplify" | "suppress" | "redirect" | "merge";
    resultingStrategy: string;
    priorityModifier: number;
    customLogic?: string;
}
/**
 * 5️⃣ Data-Driven Fine-Tuning
 */
export interface AdaptationAnalytics {
    ruleEffectivenessRates: Record<string, number>;
    combinationOutcomes: Record<string, number>;
    contextualSuccessFactors: Record<string, string[]>;
    commonFailurePatterns: string[];
    optimalParameterRanges: Record<string, [number, number]>;
    userSegmentPerformance: Record<string, number>;
    temporalPatterns: Record<string, number>;
    lastUpdated: Date;
    dataPoints: number;
}
export interface RuleWeights {
    ruleName: string;
    baseWeight: number;
    contextualModifiers: Record<string, number>;
    userTypeModifiers: Record<string, number>;
    seasonalModifiers: Record<string, number>;
    learningRate: number;
    lastUpdated: Date;
}
/**
 * 🚀 Versioned Rule Sets - A/B testing and retroactive analysis
 */
export interface RuleSetVersion {
    versionId: string;
    versionName: string;
    rules: string[];
    ruleWeights: Record<string, number>;
    activatedAt: Date;
    retiredAt?: Date;
    successRate?: number;
    testGroup?: string;
    description: string;
    changeSummary: string[];
    userSegmentTargets?: string[];
    performanceMetrics: {
        avgUserSatisfaction: number;
        avgEffectiveness: number;
        avgAdaptationSpeed: number;
        retentionImpact: number;
    };
}
/**
 * 🚀 Explainability Layer - Human-friendly explanations
 */
export interface AdaptationExplanation {
    recommendationId: string;
    primaryReason: string;
    contributingFactors: ExplanationFactor[];
    confidence: number;
    riskFactors: string[];
    expectedOutcome: string;
    alternativesConsidered: AlternativeOption[];
    dataPoints: string[];
    historicalContext?: string;
    timelineExpectation: string;
}
export interface ExplanationFactor {
    metric: string;
    value: number;
    impact: "high" | "medium" | "low";
    description: string;
    trend: "improving" | "stable" | "declining";
}
export interface AlternativeOption {
    strategy: string;
    whyNotChosen: string;
    couldBeUsedIf: string;
}
/**
 * 🚀 Pre-emptive Adaptation Planning - Predict future needs
 */
export interface PreemptiveAdaptationPlan {
    userId: string;
    currentWeek: number;
    planConfidenceScore: number;
    predictedAdaptations: PredictedAdaptation[];
    earlyWarningSignals: EarlyWarningSignal[];
    contingencyPlans: ContingencyPlan[];
    optimalTrajectory: TrajectoryPoint[];
    riskAssessment: RiskAssessment;
    generatedAt: Date;
    validUntil: Date;
}
export interface PredictedAdaptation {
    estimatedTriggerDate: Date;
    probability: number;
    triggerConditions: string[];
    recommendationType: AdaptationRecommendation["type"];
    severity: "minor_tweak" | "moderate_adjustment" | "major_overhaul";
    preventionStrategy?: string;
}
export interface EarlyWarningSignal {
    signal: string;
    currentValue: number;
    warningThreshold: number;
    criticalThreshold: number;
    trend: "approaching" | "stable" | "retreating";
    daysToThreshold: number;
    suggestedPreventiveAction?: string;
}
export interface ContingencyPlan {
    scenario: string;
    triggerConditions: string[];
    immediateAction: AdaptationRecommendation;
    followUpActions: AdaptationRecommendation[];
    successProbability: number;
}
export interface TrajectoryPoint {
    week: number;
    predictedMetrics: Partial<NateProprietaryMetrics>;
    confidenceInterval: number;
    keyMilestones: string[];
}
export interface RiskAssessment {
    plateauRisk: number;
    burnoutRisk: number;
    injuryRisk: number;
    motivationDropRisk: number;
    adherenceRisk: number;
    mitigationStrategies: string[];
}
/**
 * 🚀 Simulated Plan Testing - Virtual scenario analysis
 */
export interface SimulationResult {
    simulationId: string;
    scenario: SimulationScenario;
    outcomes: SimulationOutcome[];
    bestPath: AdaptationRecommendation[];
    worstPath: AdaptationRecommendation[];
    expectedValue: number;
    confidence: number;
    runTime: number;
    iterations: number;
}
export interface SimulationScenario {
    name: string;
    duration: number;
    initialState: UserMetrics;
    userSignature: UserSignature;
    stochasticFactors: StochasticFactor[];
    constraints: SimulationConstraint[];
}
export interface StochasticFactor {
    event: string;
    probability: number;
    impact: Partial<UserMetrics>;
    duration: number;
}
export interface SimulationConstraint {
    type: "max_adaptations_per_week" | "min_intensity" | "max_frequency_change";
    value: number;
    reason: string;
}
export interface SimulationOutcome {
    path: AdaptationRecommendation[];
    finalMetrics: UserMetrics;
    userSatisfactionScore: number;
    adherenceRate: number;
    progressScore: number;
    adaptationEfficiency: number;
    eventsThatOccurred: string[];
    totalCost: number;
}
/**
 * 🚀 Hybrid ML Model - AI-enhanced parameter tuning
 */
export interface MLModelConfig {
    modelType: "gradient_boosting" | "neural_network" | "ensemble";
    version: string;
    trainingDataSize: number;
    lastTrainedAt: Date;
    accuracy: number;
    features: MLFeature[];
    hyperparameters: Record<string, any>;
    deploymentStatus: "training" | "testing" | "production" | "retired";
}
export interface MLFeature {
    name: string;
    type: "numeric" | "categorical" | "derived";
    importance: number;
    source: "user_metrics" | "proprietary_metrics" | "historical_data" | "computed";
    description: string;
}
export interface MLPrediction {
    recommendationType: AdaptationRecommendation["type"];
    parameterAdjustments: Record<string, number>;
    confidence: number;
    explanation: string;
    featureInfluences: Record<string, number>;
    modelVersion: string;
    fallbackToRules: boolean;
}
export interface MLTrainingData {
    userId: string;
    inputFeatures: Record<string, number>;
    targetOutcome: AdaptationOutcome;
    contextMetadata: {
        userSegment: string;
        timeOfYear: string;
        ruleSetVersion: string;
    };
    validationWeight: number;
}
export declare class AdaptationEngine {
    private rules;
    private userSignatures;
    private adaptationHistory;
    private planLineages;
    private ruleInteractions;
    private analytics;
    private ruleWeights;
    private ruleSetVersions;
    private currentRuleSetVersion;
    private userTestGroups;
    private mlModel?;
    private mlTrainingData;
    private simulationCache;
    constructor();
    /**
     * 🚀 ENHANCED: Main adaptation method with full explainability
     */
    analyzeWithExplanation(userMetrics: UserMetrics): Promise<{
        recommendations: AdaptationRecommendation[];
        explanation: AdaptationExplanation;
        preemptivePlan: PreemptiveAdaptationPlan;
        simulationResults?: SimulationResult;
    }>;
    /**
     * 🚀 Explainability Layer - Generate human-friendly explanations
     */
    private generateExplanation;
    /**
     * 🚀 Pre-emptive Adaptation Planning - Predict future needs
     */
    private generatePreemptivePlan;
    /**
     * 🚀 Simulated Plan Testing - Run virtual scenarios
     */
    private runSimulation;
    /**
     * 🚀 Versioned Rule Sets - A/B testing support
     */
    private initializeRuleSetVersioning;
    /**
     * Deploy a new rule set version for A/B testing
     */
    deployRuleSetVersion(version: RuleSetVersion, testGroupPercentage?: number): Promise<void>;
    /**
     * 🚀 ML Model Integration
     */
    private initializeMLModel;
    /**
     * Get ML-enhanced predictions
     */
    private getMlPredictions;
    private getRuleSetVersionForUser;
    private generatePrimaryReason;
    private calculateExplanationConfidence;
    private generateExpectedOutcome;
    private generateTimelineExpectation;
    private calculatePlanConfidence;
    private predictFutureAdaptations;
    private generateEarlyWarningSignals;
    private generateContingencyPlans;
    private projectOptimalTrajectory;
    private assessRisks;
    private runSingleSimulation;
    private calculateSimulationConfidence;
    private generateSimulationCacheKey;
    private extractFeaturesForML;
    private applyMlFineTuning;
    private recordAnalysisForLearning;
    /**
     * Get comprehensive adaptation insights for a user
     */
    getComprehensiveInsights(userId: string): Promise<{
        signature: UserSignature;
        currentMetrics: NateProprietaryMetrics | null;
        adaptationHistory: AdaptationHistory[];
        preemptivePlan: PreemptiveAdaptationPlan | null;
        ruleSetVersion: string;
        testGroup?: string;
    }>;
    /**
     * 🚀 ENHANCED: Main adaptation method with rule chaining & contextual layering
     */
    analyze(userMetrics: UserMetrics): AdaptationRecommendation[];
    /**
     * 4️⃣ Calculate Nate's Proprietary Metrics
     */
    private calculateProprietaryMetrics;
    /**
     * 1️⃣ Analyze Rule Interactions for Chaining
     */
    private analyzeRuleInteractions;
    /**
     * Apply Rule Chaining Logic
     */
    private applyRuleChaining;
    /**
     * 2️⃣ Get or Create User Signature
     */
    private getUserSignature;
    /**
     * 3️⃣ Filter Based on Plan Evolution History
     */
    private filterByPlanEvolution;
    /**
     * 5️⃣ Apply Data-Driven Weights
     */
    private applyDataDrivenWeights;
    /**
     * Record Adaptation Outcome for Learning
     */
    recordAdaptationOutcome(userId: string, adaptationId: string, outcome: AdaptationOutcome): Promise<void>;
    /**
     * Get User's Adaptation Insights
     */
    getUserAdaptationInsights(userId: string): {
        signature: UserSignature;
        proprietaryMetrics: NateProprietaryMetrics | null;
        recentHistory: AdaptationHistory[];
        predictedNeeds: string[];
    };
    private calculateAdaptiveRecoveryIndex;
    private calculateEngagementScore;
    private calculatePlanVolatility;
    private calculateMetabolicAdaptationScore;
    private calculateMotivationalMomentum;
    private calculateAdherenceQuality;
    private calculateProgressVelocity;
    private calculateResilientIndex;
    private calculateAdaptationEfficiency;
    private calculateFatigueResilience;
    private createDefaultUserSignature;
    private updateUserSignature;
    private initializeRuleInteractions;
    private initializeAnalytics;
    private loadRuleWeights;
    private personalizeWithSignature;
    private finalizeRecommendations;
    private upgradePriority;
    private downgradePriority;
    private createComprehensiveRecoveryProtocol;
    private createSimplifiedProgressionPlan;
    private createGamifiedProgressionSystem;
    private calculateEffectiveness;
    private updateAnalytics;
    private updateRuleWeights;
    private updateUserSignatureFromOutcome;
    private predictFutureNeeds;
    /**
     * Initialize the rule set
     */
    private initializeRules;
    /**
     * Apply recommendations to update the user's plan (legacy method for compatibility)
     */
    applyRecommendations(currentPlan: WorkoutPlan, recommendations: AdaptationRecommendation[]): WorkoutPlan;
    private applyChanges;
}
declare abstract class AdaptationRule {
    abstract evaluate(userMetrics: UserMetrics, userSignature: UserSignature, proprietaryMetrics: NateProprietaryMetrics): AdaptationRecommendation | null;
}
export declare const UserMetricsSchema: z.ZodObject<{
    userId: z.ZodString;
    currentPlan: z.ZodObject<{
        id: z.ZodString;
        type: z.ZodEnum<["strength", "cardio", "hiit", "flexibility", "hybrid"]>;
        intensity: z.ZodNumber;
        volume: z.ZodNumber;
        frequency: z.ZodNumber;
        duration: z.ZodNumber;
        exercises: z.ZodArray<z.ZodAny, "many">;
        progressionRate: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        type: "strength" | "cardio" | "hiit" | "flexibility" | "hybrid";
        id: string;
        intensity: number;
        volume: number;
        frequency: number;
        duration: number;
        exercises: any[];
        progressionRate: number;
    }, {
        type: "strength" | "cardio" | "hiit" | "flexibility" | "hybrid";
        id: string;
        intensity: number;
        volume: number;
        frequency: number;
        duration: number;
        exercises: any[];
        progressionRate: number;
    }>;
    recentWorkouts: z.ZodArray<z.ZodAny, "many">;
    progressData: z.ZodObject<{
        streak: z.ZodNumber;
        weeklyConsistency: z.ZodNumber;
        monthlyConsistency: z.ZodNumber;
        totalWorkouts: z.ZodNumber;
        averageRating: z.ZodNumber;
        strengthGains: z.ZodRecord<z.ZodString, z.ZodNumber>;
        cardioGains: z.ZodRecord<z.ZodString, z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        streak: number;
        weeklyConsistency: number;
        monthlyConsistency: number;
        totalWorkouts: number;
        averageRating: number;
        strengthGains: Record<string, number>;
        cardioGains: Record<string, number>;
    }, {
        streak: number;
        weeklyConsistency: number;
        monthlyConsistency: number;
        totalWorkouts: number;
        averageRating: number;
        strengthGains: Record<string, number>;
        cardioGains: Record<string, number>;
    }>;
    biometrics: z.ZodObject<{
        weight: z.ZodOptional<z.ZodNumber>;
        bodyFat: z.ZodOptional<z.ZodNumber>;
        muscleMass: z.ZodOptional<z.ZodNumber>;
        restingHeartRate: z.ZodOptional<z.ZodNumber>;
        bloodPressure: z.ZodOptional<z.ZodObject<{
            systolic: z.ZodNumber;
            diastolic: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            systolic: number;
            diastolic: number;
        }, {
            systolic: number;
            diastolic: number;
        }>>;
        measurements: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodNumber>>;
        lastUpdated: z.ZodDate;
    }, "strip", z.ZodTypeAny, {
        lastUpdated: Date;
        weight?: number | undefined;
        bodyFat?: number | undefined;
        muscleMass?: number | undefined;
        restingHeartRate?: number | undefined;
        bloodPressure?: {
            systolic: number;
            diastolic: number;
        } | undefined;
        measurements?: Record<string, number> | undefined;
    }, {
        lastUpdated: Date;
        weight?: number | undefined;
        bodyFat?: number | undefined;
        muscleMass?: number | undefined;
        restingHeartRate?: number | undefined;
        bloodPressure?: {
            systolic: number;
            diastolic: number;
        } | undefined;
        measurements?: Record<string, number> | undefined;
    }>;
    lifestyle: z.ZodObject<{
        sleepHours: z.ZodNumber;
        sleepQuality: z.ZodNumber;
        stressLevel: z.ZodNumber;
        energyLevel: z.ZodNumber;
        workload: z.ZodNumber;
        nutritionCompliance: z.ZodNumber;
        hydration: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        sleepHours: number;
        sleepQuality: number;
        stressLevel: number;
        energyLevel: number;
        workload: number;
        nutritionCompliance: number;
        hydration: number;
    }, {
        sleepHours: number;
        sleepQuality: number;
        stressLevel: number;
        energyLevel: number;
        workload: number;
        nutritionCompliance: number;
        hydration: number;
    }>;
    mood: z.ZodObject<{
        score: z.ZodNumber;
        motivation: z.ZodNumber;
        confidence: z.ZodNumber;
        anxiety: z.ZodNumber;
        recentTrend: z.ZodEnum<["improving", "stable", "declining"]>;
    }, "strip", z.ZodTypeAny, {
        score: number;
        motivation: number;
        confidence: number;
        anxiety: number;
        recentTrend: "improving" | "stable" | "declining";
    }, {
        score: number;
        motivation: number;
        confidence: number;
        anxiety: number;
        recentTrend: "improving" | "stable" | "declining";
    }>;
}, "strip", z.ZodTypeAny, {
    userId: string;
    currentPlan: {
        type: "strength" | "cardio" | "hiit" | "flexibility" | "hybrid";
        id: string;
        intensity: number;
        volume: number;
        frequency: number;
        duration: number;
        exercises: any[];
        progressionRate: number;
    };
    recentWorkouts: any[];
    progressData: {
        streak: number;
        weeklyConsistency: number;
        monthlyConsistency: number;
        totalWorkouts: number;
        averageRating: number;
        strengthGains: Record<string, number>;
        cardioGains: Record<string, number>;
    };
    biometrics: {
        lastUpdated: Date;
        weight?: number | undefined;
        bodyFat?: number | undefined;
        muscleMass?: number | undefined;
        restingHeartRate?: number | undefined;
        bloodPressure?: {
            systolic: number;
            diastolic: number;
        } | undefined;
        measurements?: Record<string, number> | undefined;
    };
    lifestyle: {
        sleepHours: number;
        sleepQuality: number;
        stressLevel: number;
        energyLevel: number;
        workload: number;
        nutritionCompliance: number;
        hydration: number;
    };
    mood: {
        score: number;
        motivation: number;
        confidence: number;
        anxiety: number;
        recentTrend: "improving" | "stable" | "declining";
    };
}, {
    userId: string;
    currentPlan: {
        type: "strength" | "cardio" | "hiit" | "flexibility" | "hybrid";
        id: string;
        intensity: number;
        volume: number;
        frequency: number;
        duration: number;
        exercises: any[];
        progressionRate: number;
    };
    recentWorkouts: any[];
    progressData: {
        streak: number;
        weeklyConsistency: number;
        monthlyConsistency: number;
        totalWorkouts: number;
        averageRating: number;
        strengthGains: Record<string, number>;
        cardioGains: Record<string, number>;
    };
    biometrics: {
        lastUpdated: Date;
        weight?: number | undefined;
        bodyFat?: number | undefined;
        muscleMass?: number | undefined;
        restingHeartRate?: number | undefined;
        bloodPressure?: {
            systolic: number;
            diastolic: number;
        } | undefined;
        measurements?: Record<string, number> | undefined;
    };
    lifestyle: {
        sleepHours: number;
        sleepQuality: number;
        stressLevel: number;
        energyLevel: number;
        workload: number;
        nutritionCompliance: number;
        hydration: number;
    };
    mood: {
        score: number;
        motivation: number;
        confidence: number;
        anxiety: number;
        recentTrend: "improving" | "stable" | "declining";
    };
}>;
export {};
//# sourceMappingURL=adaptation-engine.d.ts.map