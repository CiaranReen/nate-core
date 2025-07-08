/**
 * Nate's Data Collection & Training Flow System
 *
 * This system collects anonymized user data with consent to create:
 * - A library of real-world adjusted plans
 * - Feedback loops that improve Nate's plan generator
 * - Training data for custom models
 *
 * This creates a proprietary dataset that competitors cannot access.
 */
import { z } from "zod";
export interface DataCollectionConsent {
    userId: string;
    consentGiven: boolean;
    consentDate: Date;
    dataTypes: DataType[];
    optOutDate?: Date;
    consentVersion: string;
}
export type DataType = "workout_performance" | "nutrition_adherence" | "biometric_changes" | "mood_wellness" | "adaptation_responses" | "plan_effectiveness" | "user_feedback" | "behavioral_patterns";
export interface AnonymizedDataPoint {
    id: string;
    timestamp: Date;
    dataType: DataType;
    anonymizedUserId: string;
    demographicCluster: DemographicCluster;
    data: any;
    metadata: DataMetadata;
}
export interface DemographicCluster {
    ageRange: string;
    experienceLevel: "beginner" | "intermediate" | "advanced";
    fitnessGoal: string;
    bodyTypeCluster: string;
    activityLevel: string;
    region: string;
}
export interface DataMetadata {
    collectionMethod: "automatic" | "user_input" | "derived";
    confidence: number;
    qualityScore: number;
    validationStatus: "validated" | "pending" | "rejected";
    tags: string[];
}
export interface PlanEffectivenessData {
    planId: string;
    demographicCluster: DemographicCluster;
    initialMetrics: Record<string, number>;
    finalMetrics: Record<string, number>;
    adherenceRate: number;
    userSatisfaction: number;
    adaptationsMade: AdaptationRecord[];
    successFactors: string[];
    failureFactors: string[];
    duration: number;
}
export interface AdaptationRecord {
    timestamp: Date;
    triggerReason: string;
    adaptationType: string;
    changes: any;
    userResponse: UserResponseData;
    effectiveness: number;
}
export interface UserResponseData {
    adherenceChange: number;
    satisfactionChange: number;
    performanceChange: number;
    motivationChange: number;
    feedback: string;
}
export interface TrainingDataset {
    id: string;
    name: string;
    version: string;
    createdDate: Date;
    dataPoints: number;
    demographics: DemographicSummary;
    qualityMetrics: QualityMetrics;
    useCases: string[];
}
export interface DemographicSummary {
    totalUsers: number;
    ageDistribution: Record<string, number>;
    experienceDistribution: Record<string, number>;
    goalDistribution: Record<string, number>;
    regionDistribution: Record<string, number>;
}
export interface QualityMetrics {
    averageConfidence: number;
    averageQuality: number;
    validationRate: number;
    completenessScore: number;
    consistencyScore: number;
}
export interface PlanLibrary {
    successfulPlans: PlanTemplate[];
    adaptationStrategies: AdaptationStrategy[];
    failurePatterns: FailurePattern[];
    bestPractices: BestPractice[];
    innovations: Innovation[];
}
export interface PlanTemplate {
    id: string;
    name: string;
    successRate: number;
    applicableClusters: DemographicCluster[];
    structure: any;
    keyFeatures: string[];
    adaptationHistory: AdaptationSummary[];
    userFeedbackSummary: FeedbackSummary;
    evidenceStrength: number;
}
export interface AdaptationStrategy {
    id: string;
    name: string;
    description: string;
    triggers: string[];
    implementation: any;
    successRate: number;
    applicableClusters: DemographicCluster[];
    timingOptimal: string;
    evidenceBase: EvidenceBase;
}
export interface FailurePattern {
    id: string;
    pattern: string;
    frequency: number;
    affectedClusters: DemographicCluster[];
    commonTriggers: string[];
    preventionStrategies: string[];
    recoveryStrategies: string[];
    impactSeverity: "low" | "medium" | "high";
}
export interface BestPractice {
    id: string;
    practice: string;
    category: string;
    evidenceStrength: number;
    applicableClusters: DemographicCluster[];
    implementation: string;
    measuredBenefit: number;
    confidenceInterval: [number, number];
}
export interface Innovation {
    id: string;
    innovation: string;
    discoveryDate: Date;
    testingResults: TestingResult[];
    readinessLevel: "experimental" | "testing" | "validated" | "production";
    potentialImpact: number;
}
export interface TestingResult {
    testDate: Date;
    sampleSize: number;
    successRate: number;
    userSatisfaction: number;
    statisticalSignificance: number;
    notes: string;
}
export interface AdaptationSummary {
    adaptationType: string;
    frequency: number;
    averageEffectiveness: number;
    userAcceptance: number;
}
export interface FeedbackSummary {
    averageRating: number;
    commonPositives: string[];
    commonNegatives: string[];
    improvementSuggestions: string[];
    recommendationRate: number;
}
export interface EvidenceBase {
    studyCount: number;
    totalParticipants: number;
    averageSuccessRate: number;
    confidenceLevel: number;
    keyStudies: StudyReference[];
}
export interface StudyReference {
    studyId: string;
    duration: number;
    participants: number;
    successRate: number;
    keyFindings: string[];
}
export declare class DataCollectionEngine {
    private consentManager;
    private anonymizer;
    private validator;
    private aggregator;
    private analyzer;
    constructor();
    /**
     * Collect user data with proper consent and anonymization
     */
    collectData(userId: string, dataType: DataType, data: any, metadata?: Partial<DataMetadata>): Promise<void>;
    /**
     * Analyze collected data to extract patterns and insights
     */
    analyzePatterns(timeframe: "week" | "month" | "quarter"): Promise<AnalysisResult>;
    /**
     * Generate plan library from successful adaptations
     */
    generatePlanLibrary(): Promise<PlanLibrary>;
    /**
     * Create training datasets for custom models
     */
    createTrainingDataset(purpose: string, filters: DataFilters, qualityThreshold: number): Promise<TrainingDataset>;
    /**
     * Get insights for improving Nate's algorithms
     */
    getAlgorithmInsights(): Promise<AlgorithmInsights>;
    private generateDataPointId;
    private generateDatasetId;
    private storeDataPoint;
    private checkAnalysisTriggers;
    private extractRecommendedAdaptations;
    private identifyAlgorithmImprovements;
    private discoverNewStrategies;
    private identifyValidationNeeds;
}
interface DataFilters {
    dataTypes?: DataType[];
    demographicClusters?: DemographicCluster[];
    dateRange?: {
        start: Date;
        end: Date;
    };
    qualityThreshold?: number;
}
interface AnalysisResult {
    patterns: Pattern[];
    insights: Insight[];
    recommendations: Recommendation[];
    confidence: number;
}
interface Pattern {
    id: string;
    type: string;
    description: string;
    frequency: number;
    confidence: number;
}
interface Insight {
    id: string;
    insight: string;
    category: string;
    evidence: string[];
    confidence: number;
}
interface Recommendation {
    id: string;
    recommendation: string;
    priority: "low" | "medium" | "high";
    expectedImpact: number;
    implementation: string;
}
interface AlgorithmInsights {
    recommendedAdaptations: RecommendedAdaptation[];
    algorithmImprovements: AlgorithmImprovement[];
    newStrategies: NewStrategy[];
    validationNeeded: ValidationNeed[];
}
interface RecommendedAdaptation {
    adaptation: string;
    evidence: string;
    confidence: number;
    implementation: string;
}
interface AlgorithmImprovement {
    algorithm: string;
    improvement: string;
    expectedBenefit: string;
    implementation: string;
}
interface NewStrategy {
    strategy: string;
    discovery: string;
    testingPlan: string;
    potentialImpact: number;
}
interface ValidationNeed {
    hypothesis: string;
    testingApproach: string;
    requiredSampleSize: number;
    priority: "low" | "medium" | "high";
}
export declare const DataCollectionConsentSchema: z.ZodObject<{
    userId: z.ZodString;
    consentGiven: z.ZodBoolean;
    consentDate: z.ZodDate;
    dataTypes: z.ZodArray<z.ZodEnum<["workout_performance", "nutrition_adherence", "biometric_changes", "mood_wellness", "adaptation_responses", "plan_effectiveness", "user_feedback", "behavioral_patterns"]>, "many">;
    consentVersion: z.ZodString;
}, "strip", z.ZodTypeAny, {
    userId: string;
    consentGiven: boolean;
    consentDate: Date;
    dataTypes: ("workout_performance" | "nutrition_adherence" | "biometric_changes" | "mood_wellness" | "adaptation_responses" | "plan_effectiveness" | "user_feedback" | "behavioral_patterns")[];
    consentVersion: string;
}, {
    userId: string;
    consentGiven: boolean;
    consentDate: Date;
    dataTypes: ("workout_performance" | "nutrition_adherence" | "biometric_changes" | "mood_wellness" | "adaptation_responses" | "plan_effectiveness" | "user_feedback" | "behavioral_patterns")[];
    consentVersion: string;
}>;
export declare const AnonymizedDataPointSchema: z.ZodObject<{
    id: z.ZodString;
    timestamp: z.ZodDate;
    dataType: z.ZodEnum<["workout_performance", "nutrition_adherence", "biometric_changes", "mood_wellness", "adaptation_responses", "plan_effectiveness", "user_feedback", "behavioral_patterns"]>;
    anonymizedUserId: z.ZodString;
    demographicCluster: z.ZodObject<{
        ageRange: z.ZodString;
        experienceLevel: z.ZodEnum<["beginner", "intermediate", "advanced"]>;
        fitnessGoal: z.ZodString;
        bodyTypeCluster: z.ZodString;
        activityLevel: z.ZodString;
        region: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        fitnessGoal: string;
        activityLevel: string;
        ageRange: string;
        experienceLevel: "beginner" | "intermediate" | "advanced";
        bodyTypeCluster: string;
        region: string;
    }, {
        fitnessGoal: string;
        activityLevel: string;
        ageRange: string;
        experienceLevel: "beginner" | "intermediate" | "advanced";
        bodyTypeCluster: string;
        region: string;
    }>;
    data: z.ZodAny;
    metadata: z.ZodObject<{
        collectionMethod: z.ZodEnum<["automatic", "user_input", "derived"]>;
        confidence: z.ZodNumber;
        qualityScore: z.ZodNumber;
        validationStatus: z.ZodEnum<["validated", "pending", "rejected"]>;
        tags: z.ZodArray<z.ZodString, "many">;
    }, "strip", z.ZodTypeAny, {
        confidence: number;
        collectionMethod: "derived" | "automatic" | "user_input";
        qualityScore: number;
        validationStatus: "pending" | "validated" | "rejected";
        tags: string[];
    }, {
        confidence: number;
        collectionMethod: "derived" | "automatic" | "user_input";
        qualityScore: number;
        validationStatus: "pending" | "validated" | "rejected";
        tags: string[];
    }>;
}, "strip", z.ZodTypeAny, {
    id: string;
    timestamp: Date;
    metadata: {
        confidence: number;
        collectionMethod: "derived" | "automatic" | "user_input";
        qualityScore: number;
        validationStatus: "pending" | "validated" | "rejected";
        tags: string[];
    };
    anonymizedUserId: string;
    demographicCluster: {
        fitnessGoal: string;
        activityLevel: string;
        ageRange: string;
        experienceLevel: "beginner" | "intermediate" | "advanced";
        bodyTypeCluster: string;
        region: string;
    };
    dataType: "workout_performance" | "nutrition_adherence" | "biometric_changes" | "mood_wellness" | "adaptation_responses" | "plan_effectiveness" | "user_feedback" | "behavioral_patterns";
    data?: any;
}, {
    id: string;
    timestamp: Date;
    metadata: {
        confidence: number;
        collectionMethod: "derived" | "automatic" | "user_input";
        qualityScore: number;
        validationStatus: "pending" | "validated" | "rejected";
        tags: string[];
    };
    anonymizedUserId: string;
    demographicCluster: {
        fitnessGoal: string;
        activityLevel: string;
        ageRange: string;
        experienceLevel: "beginner" | "intermediate" | "advanced";
        bodyTypeCluster: string;
        region: string;
    };
    dataType: "workout_performance" | "nutrition_adherence" | "biometric_changes" | "mood_wellness" | "adaptation_responses" | "plan_effectiveness" | "user_feedback" | "behavioral_patterns";
    data?: any;
}>;
export {};
