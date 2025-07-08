/**
 * Nate's Persistent Smart Memory System
 *
 * This system creates a comprehensive memory layer that tracks user patterns,
 * preferences, and contextual information to enable deep personalization
 * that competitors using GPT alone cannot replicate.
 */
import { z } from "zod";
export interface UserMemoryProfile {
    userId: string;
    personalityProfile: PersonalityProfile;
    behaviorPatterns: BehaviorPatterns;
    preferences: UserPreferences;
    contextualMemory: ContextualMemory;
    adaptationHistory: AdaptationHistory;
    achievementHistory: AchievementHistory;
    failurePatterns: FailurePatterns;
    motivationalTriggers: MotivationalTriggers;
    communicationStyle: CommunicationStyle;
    lastUpdated: Date;
}
export interface PersonalityProfile {
    motivationType: "intrinsic" | "extrinsic" | "mixed";
    goalOrientation: "process" | "outcome" | "balanced";
    communicationPreference: "direct" | "supportive" | "analytical" | "encouraging";
    challengeLevel: "conservative" | "moderate" | "aggressive";
    feedbackStyle: "detailed" | "brief" | "visual" | "comparative";
    timeHorizon: "short_term" | "medium_term" | "long_term";
    riskTolerance: number;
    persistenceLevel: number;
    openToChange: number;
}
export interface BehaviorPatterns {
    workoutTiming: {
        preferredDays: string[];
        preferredTimes: string[];
        consistencyScore: number;
        seasonalPatterns: Record<string, number>;
    };
    motivationCycles: {
        highMotivationTriggers: string[];
        lowMotivationTriggers: string[];
        averageCycleDuration: number;
        recoveryStrategies: string[];
    };
    plateauHistory: {
        previousPlateaus: PlateauEvent[];
        successfulBreakthroughs: BreakthroughStrategy[];
        averagePlateauDuration: number;
    };
    injuryPatterns: {
        commonInjuries: string[];
        triggers: string[];
        recoveryTime: Record<string, number>;
        preventiveStrategies: string[];
    };
    nutritionPatterns: {
        mealTimingPreferences: string[];
        successfulStrategies: string[];
        challengingAreas: string[];
        complianceByMealType: Record<string, number>;
    };
}
export interface UserPreferences {
    exercisePreferences: {
        loved: string[];
        disliked: string[];
        neutral: string[];
        modifications: Record<string, string>;
    };
    environmentalPreferences: {
        location: "home" | "gym" | "outdoor" | "mixed";
        equipment: string[];
        ambiance: "quiet" | "music" | "social" | "competitive";
        groupSize: "solo" | "small_group" | "large_group" | "mixed";
    };
    progressTracking: {
        preferredMetrics: string[];
        updateFrequency: "daily" | "weekly" | "monthly";
        visualizationStyle: "charts" | "numbers" | "progress_photos" | "mixed";
    };
    communicationPreferences: {
        reminderFrequency: "high" | "medium" | "low" | "none";
        encouragementStyle: "cheerleader" | "coach" | "mentor" | "friend";
        feedbackTiming: "immediate" | "daily" | "weekly";
        contentType: "text" | "voice" | "video" | "mixed";
    };
}
export interface ContextualMemory {
    recentContexts: ConversationContext[];
    topicExpertise: Record<string, ExpertiseLevel>;
    frequentConcerns: string[];
    goalEvolution: GoalEvolutionTrack[];
    lifeEventImpacts: LifeEventImpact[];
    seasonalBehaviors: Record<string, SeasonalBehavior>;
}
export interface ConversationContext {
    timestamp: Date;
    topic: string;
    userMood: number;
    concerns: string[];
    decisions: string[];
    outcomes: string[];
    satisfaction: number;
}
export interface ExpertiseLevel {
    level: "novice" | "beginner" | "intermediate" | "advanced" | "expert";
    confidence: number;
    lastAssessed: Date;
    knowledgeGaps: string[];
}
export interface GoalEvolutionTrack {
    timestamp: Date;
    previousGoal: string;
    newGoal: string;
    reason: string;
    confidence: number;
}
export interface LifeEventImpact {
    event: string;
    startDate: Date;
    endDate?: Date;
    impact: "positive" | "negative" | "neutral";
    adaptationsUsed: string[];
    effectOnAdherence: number;
}
export interface SeasonalBehavior {
    season: string;
    adherenceRate: number;
    preferredActivities: string[];
    challenges: string[];
    strategies: string[];
}
export interface AdaptationHistory {
    adaptationsApplied: AppliedAdaptation[];
    successRates: Record<string, number>;
    userResponses: Record<string, UserResponse[]>;
    optimalTimings: Record<string, string[]>;
}
export interface AppliedAdaptation {
    id: string;
    type: string;
    timestamp: Date;
    reasoning: string;
    changes: any;
    userReaction: "positive" | "neutral" | "negative";
    adherenceChange: number;
    durationEffective: number;
    followUpNeeded: boolean;
}
export interface UserResponse {
    timestamp: Date;
    sentiment: "positive" | "neutral" | "negative";
    adherence: number;
    feedback: string;
    suggestedImprovements: string[];
}
export interface AchievementHistory {
    milestones: Milestone[];
    personalRecords: PersonalRecord[];
    streaks: StreakRecord[];
    skillsAcquired: SkillAcquisition[];
    transformationStory: TransformationPoint[];
}
export interface Milestone {
    id: string;
    name: string;
    achievedDate: Date;
    category: "strength" | "endurance" | "body_composition" | "habit" | "knowledge";
    significance: "minor" | "major" | "life_changing";
    userReaction: string;
    shareableFormat: string;
}
export interface PersonalRecord {
    exercise: string;
    metric: "weight" | "reps" | "time" | "distance";
    previousRecord: number;
    newRecord: number;
    improvementPercentage: number;
    achievedDate: Date;
    celebrationUsed: string;
}
export interface StreakRecord {
    type: "workout" | "nutrition" | "sleep" | "overall";
    currentStreak: number;
    longestStreak: number;
    streakStartDate: Date;
    streakEndDate?: Date;
    motivationLevel: number;
}
export interface SkillAcquisition {
    skill: string;
    startDate: Date;
    masteryDate?: Date;
    progressStages: string[];
    teachingMoments: string[];
    applicationSuccesses: string[];
}
export interface TransformationPoint {
    timestamp: Date;
    description: string;
    beforeMetrics: Record<string, number>;
    afterMetrics: Record<string, number>;
    durationDays: number;
    keyFactors: string[];
    emotionalImpact: string;
}
export interface FailurePatterns {
    commonFailurePoints: FailurePoint[];
    dropOffTriggers: string[];
    recoveryStrategies: RecoveryStrategy[];
    preventiveInterventions: PreventiveIntervention[];
    relapseCycles: RelapsePattern[];
}
export interface FailurePoint {
    trigger: string;
    frequency: number;
    averageRecoveryTime: number;
    successfulInterventions: string[];
    warningSignsDetected: string[];
    impactSeverity: "low" | "medium" | "high";
}
export interface RecoveryStrategy {
    strategy: string;
    successRate: number;
    timesToRecovery: number;
    userSatisfaction: number;
    applicableFailures: string[];
}
export interface PreventiveIntervention {
    intervention: string;
    triggersDetected: string[];
    timingOptimal: string;
    successRate: number;
    userAcceptance: number;
}
export interface RelapsePattern {
    pattern: string;
    frequency: number;
    durationDays: number;
    recoveryFactors: string[];
    preventionStrategies: string[];
}
export interface MotivationalTriggers {
    intrinsicMotivators: Motivator[];
    extrinsicMotivators: Motivator[];
    demotivators: Demotivator[];
    optimalTimingStrategies: TimingStrategy[];
    contextualFactors: ContextualFactor[];
}
export interface Motivator {
    trigger: string;
    effectivenessScore: number;
    durationEffective: number;
    frequencyOptimal: string;
    contextRequirements: string[];
}
export interface Demotivator {
    trigger: string;
    impactSeverity: number;
    recoveryTime: number;
    countermeasures: string[];
    avoidanceStrategies: string[];
}
export interface TimingStrategy {
    strategy: string;
    optimalTimes: string[];
    userResponsiveness: number;
    contextualRequirements: string[];
}
export interface ContextualFactor {
    factor: string;
    influence: "positive" | "negative" | "neutral";
    strength: number;
    interactions: string[];
}
export interface CommunicationStyle {
    preferredTone: "formal" | "casual" | "friendly" | "professional";
    responseLength: "brief" | "moderate" | "detailed";
    humorAppreciation: number;
    directness: number;
    encouragementStyle: "subtle" | "obvious" | "celebration";
    technicalDetail: "minimal" | "some" | "comprehensive";
    personalSharing: "minimal" | "moderate" | "open";
}
export interface PlateauEvent {
    startDate: Date;
    endDate?: Date;
    metric: string;
    duration: number;
    breakthroughStrategy?: string;
    userFrustration: number;
}
export interface BreakthroughStrategy {
    strategy: string;
    successRate: number;
    userSatisfaction: number;
    timeToBreakthrough: number;
    applicablePlateaus: string[];
}
export declare class SmartMemoryEngine {
    private memoryProfiles;
    constructor();
    /**
     * Create or update a user's memory profile
     */
    updateMemoryProfile(userId: string, updates: Partial<UserMemoryProfile>): Promise<void>;
    /**
     * Get user's complete memory profile
     */
    getMemoryProfile(userId: string): Promise<UserMemoryProfile | null>;
    /**
     * Learn from user interaction and update memory
     */
    learnFromInteraction(userId: string, interaction: {
        type: "workout_completed" | "workout_skipped" | "goal_changed" | "feedback_given" | "adaptation_applied";
        data: any;
        userResponse: any;
        context: any;
    }): Promise<void>;
    /**
     * Generate contextual insights for AI responses
     */
    generateContextualInsights(userId: string, currentContext: string): Promise<ContextualInsights>;
    /**
     * Predict user needs based on patterns
     */
    predictUserNeeds(userId: string, timeHorizon: "immediate" | "short_term" | "medium_term"): Promise<PredictedNeeds>;
    private createDefaultProfile;
    private persistMemoryProfile;
    private loadMemoryProfile;
    private updateWorkoutPatterns;
    private updateFailurePatterns;
    private updateGoalEvolution;
    private updatePreferences;
    private updateAdaptationHistory;
    private calculatePersonalityMatch;
    private predictBehavior;
    private selectOptimalMotivationalStrategy;
    private adjustCommunicationStyle;
    private identifyRiskFactors;
    private identifyOpportunities;
    private getRelevantHistory;
    private getDefaultInsights;
    private explainPredictions;
    /**
     * 1️⃣ Calculate Nate Signature Composite Scores
     */
    calculateNateSignatureScores(userId: string): Promise<NateSignatureScores>;
    /**
     * 2️⃣ Generate Memory-Driven Plan Template
     */
    generateMemoryDrivenPlanTemplate(userId: string, goal: string, timeframe: string): Promise<MemoryDrivenPlanTemplate>;
    /**
     * 3️⃣ Update Reinforcement Learning Profile
     */
    updateReinforcementLearningProfile(userId: string, ruleName: string, outcome: "success" | "failure", context: string, userSatisfaction?: number): Promise<void>;
    /**
     * 4️⃣ Manage Privacy Settings
     */
    updatePrivacySettings(userId: string, settings: Partial<PrivacySettings>): Promise<void>;
    /**
     * 5️⃣ Generate User Visualization Data
     */
    generateUserVisualizationData(userId: string): Promise<UserVisualizationData>;
    private calculateNateRecoveryQuotient;
    private calculateNateAdherenceIndex;
    private calculateNateMotivationStability;
    private calculateNateLearningQuotient;
    private calculateNateResilienceScore;
    private analyzeWorkoutTypePreferences;
    private determineOptimalRotation;
    private determineProgressionStyle;
    private determineRecoveryApproach;
    private determineMotivationIntegration;
    private generateCustomizations;
    private calculateSuccessMetrics;
    private generateMemoryReasoning;
    private getReinforcementLearningProfile;
    private persistReinforcementLearningProfile;
    private getPrivacySettings;
    private persistPrivacySettings;
    private generateProfileOverview;
    private analyzeUserCycles;
    private generateAIInsights;
    private generateProgressVisualization;
    private generateImprovementRecommendations;
    private generateRecoveryRecommendations;
    private identifyAdherenceRiskFactors;
    private determineMotivationPhase;
    private predictNextMotivationPhase;
    private determineLearningStyle;
    private determineOptimalTeachingMethods;
    private determineResilienceType;
    private identifySupportNeeds;
    private findExerciseAlternatives;
    private determinePersonalityType;
    private identifyUniqueTraits;
    private identifySignatureCharacteristics;
    private identifyUserStrengths;
    private identifyUserChallenges;
    private identifyGrowthAreas;
    private extractMotivationCycles;
    private extractAdherenceCycles;
    private extractSeasonalPatterns;
    private extractWeeklyPatterns;
    private detectStrengths;
    private detectChallenges;
    private detectBehavioralPatterns;
    private generatePredictiveInsights;
    private generateProgressTimeline;
    private extractMilestoneAchievements;
    private extractSkillDevelopment;
    private calculateTransformationMetrics;
    private generateImmediateActions;
    private generateShortTermGoals;
    private generateLongTermStrategies;
    private generateHabitFormation;
}
export interface ContextualInsights {
    personalityMatch: number;
    behaviorPredictions: BehaviorPrediction[];
    motivationalStrategy: MotivationalStrategy;
    communicationAdjustments: CommunicationAdjustments;
    riskFactors: RiskFactor[];
    opportunities: Opportunity[];
    historicalContext: RelevantHistory;
}
export interface BehaviorPrediction {
    behavior: string;
    probability: number;
    timeframe: string;
    factors: string[];
}
export interface MotivationalStrategy {
    strategy: string;
    confidence: number;
    triggers?: string[];
    timing?: string;
}
export interface CommunicationAdjustments {
    tone: string;
    length: string;
    emphasis?: string[];
    avoid?: string[];
}
export interface RiskFactor {
    risk: string;
    probability: number;
    severity: string;
    preventionStrategies: string[];
}
export interface Opportunity {
    opportunity: string;
    potential: number;
    requirements: string[];
    timing: string;
}
export interface RelevantHistory {
    events: string[];
    patterns: string[];
    successes: string[];
}
export interface PredictedNeeds {
    needs: string[];
    confidence: number;
    reasoning: string[];
}
/**
 * 1️⃣ Nate Signature Composite Scores - Proprietary metrics unique to our platform
 */
export interface NateSignatureScores {
    userId: string;
    lastCalculated: Date;
    nateRecoveryQuotient: {
        score: number;
        components: {
            sleepQuality: number;
            fatigueResilience: number;
            injuryRisk: number;
            stressManagement: number;
        };
        trend: "improving" | "stable" | "declining";
        recommendations: string[];
        confidence: number;
    };
    nateAdherenceIndex: {
        score: number;
        components: {
            consistencyScore: number;
            stressResilience: number;
            lifeEventStability: number;
            motivationStability: number;
        };
        trend: "improving" | "stable" | "declining";
        riskFactors: string[];
        confidence: number;
    };
    nateMotivationStability: {
        score: number;
        components: {
            cycleConsistency: number;
            triggerReliability: number;
            recoverySpeed: number;
            longTermTrend: number;
        };
        currentPhase: "peak" | "stable" | "decline" | "recovery";
        nextPhasePrediction: {
            phase: "peak" | "stable" | "decline" | "recovery";
            estimatedDate: Date;
            confidence: number;
        };
        confidence: number;
    };
    nateLearningQuotient: {
        score: number;
        components: {
            adaptationSpeed: number;
            skillAcquisition: number;
            feedbackIntegration: number;
            knowledgeRetention: number;
        };
        learningStyle: "visual" | "kinesthetic" | "analytical" | "experiential";
        optimalTeachingMethods: string[];
        confidence: number;
    };
    nateResilienceScore: {
        score: number;
        components: {
            setbackRecovery: number;
            stressAdaptation: number;
            goalPersistence: number;
            emotionalRegulation: number;
        };
        resilienceType: "bounce_back" | "steady_grind" | "adaptive" | "protective";
        supportNeeds: string[];
        confidence: number;
    };
}
/**
 * 2️⃣ Memory-Driven Plan Templating - Generate plans aligned with user memory
 */
export interface MemoryDrivenPlanTemplate {
    userId: string;
    templateId: string;
    generatedAt: Date;
    structure: {
        workoutTypes: WorkoutTypePreference[];
        rotationPattern: RotationStrategy;
        progressionStyle: ProgressionPreference;
        recoveryApproach: RecoveryPreference;
        motivationIntegration: MotivationIntegration;
    };
    customizations: {
        exerciseSubstitutions: Record<string, string>;
        intensityAdjustments: Record<string, number>;
        timingPreferences: Record<string, string>;
        motivationalElements: string[];
    };
    successMetrics: {
        predictedAdherence: number;
        predictedSatisfaction: number;
        predictedEffectiveness: number;
        confidence: number;
    };
    memoryReasoning: {
        exerciseChoices: string[];
        structureDecisions: string[];
        customizationLogic: string[];
        riskMitigation: string[];
    };
}
export interface WorkoutTypePreference {
    type: "strength" | "cardio" | "hiit" | "flexibility" | "sports";
    frequency: number;
    duration: number;
    intensity: number;
    reasoning: string;
    successRate: number;
}
export interface RotationStrategy {
    strategy: "weekly_rotation" | "biweekly_rotation" | "monthly_rotation" | "adaptive";
    rotationPattern: string[];
    reasoning: string;
    userResponse: "loves_variety" | "prefers_consistency" | "mixed";
}
export interface ProgressionPreference {
    style: "linear" | "wave" | "step" | "adaptive";
    speed: "conservative" | "moderate" | "aggressive";
    deloadFrequency: number;
    reasoning: string;
}
export interface RecoveryPreference {
    approach: "active" | "passive" | "mixed";
    frequency: number;
    methods: string[];
    reasoning: string;
}
export interface MotivationIntegration {
    triggers: string[];
    frequency: "every_session" | "weekly" | "milestone_based";
    type: "achievement" | "variety" | "competition" | "social" | "progress";
    reasoning: string;
}
/**
 * 3️⃣ Reinforcement Learning - Weight adaptation rules by past success
 */
export interface ReinforcementLearningProfile {
    userId: string;
    lastUpdated: Date;
    ruleWeights: Record<string, RuleEffectiveness>;
    userBiases: {
        adaptationSpeed: number;
        changeTolerance: number;
        feedbackResponsiveness: number;
        riskPreference: number;
    };
    learningPatterns: {
        successfulStrategies: SuccessfulStrategy[];
        failedStrategies: FailedStrategy[];
        optimalTimings: Record<string, OptimalTiming>;
        contextualFactors: ContextualFactor[];
    };
    predictionAccuracy: {
        overallAccuracy: number;
        accuracyByCategory: Record<string, number>;
        improvementTrend: "improving" | "stable" | "declining";
        confidenceIntervals: Record<string, [number, number]>;
    };
}
export interface RuleEffectiveness {
    ruleName: string;
    baseWeight: number;
    userSpecificWeight: number;
    successRate: number;
    usageCount: number;
    lastSuccess: Date;
    contextualModifiers: Record<string, number>;
    confidence: number;
}
export interface SuccessfulStrategy {
    strategy: string;
    successRate: number;
    usageCount: number;
    contexts: string[];
    userSatisfaction: number;
    lastUsed: Date;
}
export interface FailedStrategy {
    strategy: string;
    failureRate: number;
    usageCount: number;
    contexts: string[];
    userDissatisfaction: number;
    lastUsed: Date;
    alternativeStrategies: string[];
}
export interface OptimalTiming {
    strategy: string;
    optimalTimes: string[];
    avoidTimes: string[];
    successRate: number;
    reasoning: string;
}
export interface ContextualFactor {
    factor: string;
    influence: "positive" | "negative" | "neutral";
    strength: number;
    interactions: string[];
    confidence: number;
}
/**
 * 4️⃣ Privacy-Respecting Data Lock-in - Clear consent and data portability
 */
export interface PrivacySettings {
    userId: string;
    lastUpdated: Date;
    consent: {
        dataCollection: boolean;
        dataAnalysis: boolean;
        dataSharing: boolean;
        aiLearning: boolean;
        personalizedRecommendations: boolean;
        lastConsentUpdate: Date;
        consentVersion: string;
    };
    retention: {
        profileData: "indefinite" | "1_year" | "6_months" | "3_months";
        interactionHistory: "indefinite" | "1_year" | "6_months" | "3_months";
        analyticsData: "indefinite" | "1_year" | "6_months" | "3_months";
        autoDeleteEnabled: boolean;
        lastDataReview: Date;
    };
    portability: {
        exportFormat: "nate_readable" | "json" | "csv" | "pdf";
        exportFrequency: "on_demand" | "monthly" | "quarterly";
        lastExport: Date;
        exportHistory: ExportRecord[];
    };
    security: {
        encryptionLevel: "standard" | "enhanced" | "enterprise";
        dataAnonymization: boolean;
        pseudonymization: boolean;
        accessLogging: boolean;
        lastSecurityAudit: Date;
    };
}
export interface ExportRecord {
    exportId: string;
    timestamp: Date;
    format: string;
    size: number;
    contents: string[];
    purpose: string;
}
/**
 * 5️⃣ Visualization Layer - Dashboard data for user transparency
 */
export interface UserVisualizationData {
    userId: string;
    lastGenerated: Date;
    profileOverview: {
        uniqueProfile: UserProfileSummary;
        compositeScores: NateSignatureScores;
        strengths: UserStrength[];
        challenges: UserChallenge[];
        growthAreas: GrowthArea[];
    };
    cycles: {
        motivationCycles: MotivationCycle[];
        adherenceCycles: AdherenceCycle[];
        seasonalPatterns: SeasonalPattern[];
        weeklyPatterns: WeeklyPattern[];
    };
    aiInsights: {
        detectedStrengths: DetectedStrength[];
        detectedChallenges: DetectedChallenge[];
        behavioralPatterns: BehavioralPattern[];
        predictiveInsights: PredictiveInsight[];
    };
    progressVisualization: {
        progressTimeline: ProgressTimelinePoint[];
        milestoneAchievements: MilestoneAchievement[];
        skillDevelopment: SkillDevelopment[];
        transformationMetrics: TransformationMetric[];
    };
    improvementRecommendations: {
        immediateActions: ImmediateAction[];
        shortTermGoals: ShortTermGoal[];
        longTermStrategies: LongTermStrategy[];
        habitFormation: HabitFormation[];
    };
}
export interface UserProfileSummary {
    personalityType: string;
    motivationStyle: string;
    learningStyle: string;
    communicationPreference: string;
    uniqueTraits: string[];
    signatureCharacteristics: string[];
}
export interface UserStrength {
    strength: string;
    description: string;
    evidence: string[];
    impact: "high" | "medium" | "low";
    utilization: number;
}
export interface UserChallenge {
    challenge: string;
    description: string;
    frequency: number;
    impact: "high" | "medium" | "low";
    strategies: string[];
    progress: number;
}
export interface GrowthArea {
    area: string;
    currentLevel: number;
    targetLevel: number;
    potential: number;
    strategies: string[];
    timeline: string;
}
export interface MotivationCycle {
    cycleId: string;
    startDate: Date;
    endDate?: Date;
    duration: number;
    peakMotivation: number;
    lowMotivation: number;
    triggers: string[];
    strategies: string[];
    effectiveness: number;
}
export interface AdherenceCycle {
    cycleId: string;
    startDate: Date;
    endDate?: Date;
    duration: number;
    adherenceRate: number;
    factors: string[];
    interventions: string[];
    outcome: "improved" | "maintained" | "declined";
}
export interface SeasonalPattern {
    season: string;
    adherenceRate: number;
    preferredActivities: string[];
    challenges: string[];
    strategies: string[];
    year: number;
}
export interface WeeklyPattern {
    dayOfWeek: string;
    adherenceRate: number;
    preferredWorkoutTypes: string[];
    commonChallenges: string[];
    optimalTiming: string;
}
export interface DetectedStrength {
    strength: string;
    confidence: number;
    evidence: string[];
    firstDetected: Date;
    consistency: number;
}
export interface DetectedChallenge {
    challenge: string;
    confidence: number;
    evidence: string[];
    firstDetected: Date;
    frequency: number;
}
export interface BehavioralPattern {
    pattern: string;
    description: string;
    frequency: number;
    triggers: string[];
    outcomes: string[];
    recommendations: string[];
}
export interface PredictiveInsight {
    insight: string;
    probability: number;
    timeframe: string;
    factors: string[];
    recommendations: string[];
}
export interface ProgressTimelinePoint {
    date: Date;
    metrics: Record<string, number>;
    events: string[];
    achievements: string[];
    challenges: string[];
}
export interface MilestoneAchievement {
    milestone: string;
    achievedDate: Date;
    significance: "minor" | "major" | "life_changing";
    userReaction: string;
    impact: Record<string, number>;
}
export interface SkillDevelopment {
    skill: string;
    startDate: Date;
    currentLevel: number;
    progressStages: string[];
    nextMilestone: string;
    estimatedCompletion: Date;
}
export interface TransformationMetric {
    metric: string;
    startValue: number;
    currentValue: number;
    targetValue: number;
    improvement: number;
    trend: "improving" | "stable" | "declining";
}
export interface ImmediateAction {
    action: string;
    priority: "high" | "medium" | "low";
    impact: string;
    effort: "low" | "medium" | "high";
    timeline: string;
}
export interface ShortTermGoal {
    goal: string;
    timeframe: string;
    metrics: string[];
    strategies: string[];
    successCriteria: string[];
}
export interface LongTermStrategy {
    strategy: string;
    description: string;
    timeframe: string;
    milestones: string[];
    resources: string[];
}
export interface HabitFormation {
    habit: string;
    currentStatus: "not_started" | "forming" | "established" | "automatic";
    progress: number;
    strategies: string[];
    nextStep: string;
}
export declare const UserMemoryProfileSchema: z.ZodObject<{
    userId: z.ZodString;
    personalityProfile: z.ZodObject<{
        motivationType: z.ZodEnum<["intrinsic", "extrinsic", "mixed"]>;
        goalOrientation: z.ZodEnum<["process", "outcome", "balanced"]>;
        communicationPreference: z.ZodEnum<["direct", "supportive", "analytical", "encouraging"]>;
        challengeLevel: z.ZodEnum<["conservative", "moderate", "aggressive"]>;
        feedbackStyle: z.ZodEnum<["detailed", "brief", "visual", "comparative"]>;
        timeHorizon: z.ZodEnum<["short_term", "medium_term", "long_term"]>;
        riskTolerance: z.ZodNumber;
        persistenceLevel: z.ZodNumber;
        openToChange: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        motivationType: "intrinsic" | "extrinsic" | "mixed";
        goalOrientation: "process" | "outcome" | "balanced";
        communicationPreference: "direct" | "supportive" | "analytical" | "encouraging";
        challengeLevel: "conservative" | "moderate" | "aggressive";
        feedbackStyle: "detailed" | "brief" | "visual" | "comparative";
        timeHorizon: "short_term" | "medium_term" | "long_term";
        riskTolerance: number;
        persistenceLevel: number;
        openToChange: number;
    }, {
        motivationType: "intrinsic" | "extrinsic" | "mixed";
        goalOrientation: "process" | "outcome" | "balanced";
        communicationPreference: "direct" | "supportive" | "analytical" | "encouraging";
        challengeLevel: "conservative" | "moderate" | "aggressive";
        feedbackStyle: "detailed" | "brief" | "visual" | "comparative";
        timeHorizon: "short_term" | "medium_term" | "long_term";
        riskTolerance: number;
        persistenceLevel: number;
        openToChange: number;
    }>;
    lastUpdated: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    userId: string;
    personalityProfile: {
        motivationType: "intrinsic" | "extrinsic" | "mixed";
        goalOrientation: "process" | "outcome" | "balanced";
        communicationPreference: "direct" | "supportive" | "analytical" | "encouraging";
        challengeLevel: "conservative" | "moderate" | "aggressive";
        feedbackStyle: "detailed" | "brief" | "visual" | "comparative";
        timeHorizon: "short_term" | "medium_term" | "long_term";
        riskTolerance: number;
        persistenceLevel: number;
        openToChange: number;
    };
    lastUpdated: Date;
}, {
    userId: string;
    personalityProfile: {
        motivationType: "intrinsic" | "extrinsic" | "mixed";
        goalOrientation: "process" | "outcome" | "balanced";
        communicationPreference: "direct" | "supportive" | "analytical" | "encouraging";
        challengeLevel: "conservative" | "moderate" | "aggressive";
        feedbackStyle: "detailed" | "brief" | "visual" | "comparative";
        timeHorizon: "short_term" | "medium_term" | "long_term";
        riskTolerance: number;
        persistenceLevel: number;
        openToChange: number;
    };
    lastUpdated: Date;
}>;
//# sourceMappingURL=smart-memory.d.ts.map