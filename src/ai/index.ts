// Core AI components
export * from "./prompt-builders";
export * from "./context-formatter";

// Proprietary Nate AI Systems - with explicit re-exports for conflicting types
export {
  // Adaptation Engine - Core Components
  AdaptationEngine,
  UserMetrics as AdaptationUserMetrics,
  AdaptationRecommendation,
  WorkoutPlan as AdaptationWorkoutPlan,
  Exercise as AdaptationExercise,
  WorkoutSession as AdaptationWorkoutSession,
  ExerciseResult as AdaptationExerciseResult,
  ProgressData as AdaptationProgressData,
  BiometricData as AdaptationBiometricData,
  LifestyleData as AdaptationLifestyleData,
  MoodData as AdaptationMoodData,
  PlanChange as AdaptationPlanChange,
  UserMetricsSchema,

  // Advanced Adaptation Features
  UserSignature,
  NateProprietaryMetrics,
  AdaptationHistory,
  AdaptationOutcome,
  PlanLineage,
  RuleContext,
  RuleInteraction,
  AdaptationAnalytics,
  RuleWeights,

  // 🚀 Final Advanced Features
  RuleSetVersion,
  AdaptationExplanation,
  ExplanationFactor,
  AlternativeOption,
  PreemptiveAdaptationPlan,
  PredictedAdaptation,
  EarlyWarningSignal,
  ContingencyPlan,
  TrajectoryPoint,
  RiskAssessment,
  SimulationResult,
  SimulationScenario,
  StochasticFactor,
  SimulationConstraint,
  SimulationOutcome,
  MLModelConfig,
  MLFeature,
  MLPrediction,
  MLTrainingData,
} from "./adaptation-engine";

export {
  // Smart Memory
  SmartMemoryEngine,
  UserMemoryProfile,
  PersonalityProfile,
  BehaviorPatterns,
  UserPreferences,
  ContextualMemory,
  AchievementHistory,
  FailurePatterns,
  MotivationalTriggers,
  CommunicationStyle,
  ContextualInsights,
  BehaviorPrediction,
  MotivationalStrategy,
  CommunicationAdjustments,
  RiskFactor,
  Opportunity,
  RelevantHistory,
  PredictedNeeds,
  UserMemoryProfileSchema,

  // 🚀 Advanced Smart Memory Features
  NateSignatureScores,
  MemoryDrivenPlanTemplate,
  WorkoutTypePreference,
  RotationStrategy,
  ProgressionPreference,
  RecoveryPreference,
  MotivationIntegration,
  ReinforcementLearningProfile,
  RuleEffectiveness,
  SuccessfulStrategy,
  FailedStrategy,
  OptimalTiming,
  ContextualFactor,
  PrivacySettings,
  ExportRecord,
  UserVisualizationData,
  UserProfileSummary,
  UserStrength,
  UserChallenge,
  GrowthArea,
  MotivationCycle,
  AdherenceCycle,
  SeasonalPattern,
  WeeklyPattern,
  DetectedStrength,
  DetectedChallenge,
  BehavioralPattern,
  PredictiveInsight,
  ProgressTimelinePoint,
  MilestoneAchievement,
  SkillDevelopment,
  TransformationMetric,
  ImmediateAction,
  ShortTermGoal,
  LongTermStrategy,
  HabitFormation,
} from "./smart-memory";

export {
  // Plan Generators
  PlanGenerationEngine,
  MacroTargets,
  WorkoutPlan as GeneratedWorkoutPlan,
  TrainingPhase,
  IntensityZone,
  VolumeMetrics,
  ExerciseProgression,
  ProgressionStrategy,
  DeloadProtocol,
  AdaptiveElement,
  PlanModification,
  UserProfile as PlanUserProfile,
  UserProfileSchema as PlanUserProfileSchema,
  MacroTargetsSchema,
} from "./plan-generators";

export {
  // Data Collection
  DataCollectionEngine,
  DataCollectionConsent,
  DataType,
  AnonymizedDataPoint,
  DemographicCluster,
  DataMetadata,
  PlanEffectivenessData,
  TrainingDataset,
  PlanLibrary,
  PlanTemplate,
  AdaptationStrategy,
  FailurePattern,
  BestPractice,
  Innovation,
  DataCollectionConsentSchema,
  AnonymizedDataPointSchema,
} from "./data-collection";

export {
  // Automation Engine
  AutomationEngine,
  WearableDevice,
  DeviceType,
  WearableDataType,
  DevicePermission,
  DeviceSettings,
  WearableDataPoint,
  AutomationRule,
  AutomationTrigger,
  AutomationCondition,
  AutomationAction,
  SmartIntervention,
  InterventionType,
  ProactiveCoaching,
  PerformancePrediction,
  ProactiveRecommendation,
  PlanOptimization,
  WearableDeviceSchema,
  AutomationRuleSchema,
} from "./automation-engine";

// Integrated Nate AI System
export {
  NateAICore,
  NateAIConfig,
  NateAIResponse,
  NateAIState,
  EnhancedContext,
  ConversationMessage,
  EnvironmentalFactors,
  CurrentPlans,
  RecoveryPlan,
  GoalPlan,
  Milestone,
  RecentData,
} from "./nate-ai-core";

export * from "./services";

// Services
export { CacheService } from "./services/CacheService";
export { PlanTemplateService } from "./services/PlanTemplateService";
export { PlanTemplateGenerator } from "./services/PlanTemplateGenerator";
export { PlanLibraryService } from "./services/PlanLibraryService";
export { VisualizationService } from "./services/VisualizationService";
export { MemoryPersistenceService } from "./services/MemoryPersistenceService";
export { PrivacyManager } from "./services/PrivacyManager";
export { NateScoringEngine } from "./services/NateScoringEngine";
export * from "./services/OpenAI";

// Interfaces
export * from "./interfaces";
