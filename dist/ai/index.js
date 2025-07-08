// Core AI components
export * from "./prompt-builders";
export * from "./context-formatter";
// Proprietary Nate AI Systems - with explicit re-exports for conflicting types
export { 
// Adaptation Engine - Core Components
AdaptationEngine, UserMetricsSchema, } from "./adaptation-engine";
export { 
// Smart Memory
SmartMemoryEngine, UserMemoryProfileSchema, } from "./smart-memory";
export { 
// Plan Generators
PlanGenerationEngine, UserProfileSchema as PlanUserProfileSchema, MacroTargetsSchema, } from "./plan-generators";
export { 
// Data Collection
DataCollectionEngine, DataCollectionConsentSchema, AnonymizedDataPointSchema, } from "./data-collection";
export { 
// Automation Engine
AutomationEngine, WearableDeviceSchema, AutomationRuleSchema, } from "./automation-engine";
// Integrated Nate AI System
export { NateAICore, } from "./nate-ai-core";
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
