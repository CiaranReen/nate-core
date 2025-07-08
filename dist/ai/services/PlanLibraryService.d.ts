import { BasePlan, TrainingMetrics } from "../interfaces/PlanLibrary";
import { UserMemoryProfile } from "../smart-memory";
import { UserPlanContext } from "../interfaces/PlanTemplates";
export declare class PlanLibraryService {
    private library;
    constructor();
    private initializeLibrary;
    private createBasePlans;
    private createBeginnerFullBodyPlan;
    private createBeginnerPhases;
    private createBeginnerAdaptationTriggers;
    private createIntermediatePPLPlan;
    private createAdvancedSplitPlan;
    findBestMatchingPlan(profile: UserMemoryProfile, context: UserPlanContext, metrics: TrainingMetrics): Promise<BasePlan>;
    private isPlanSuitable;
    private calculatePlanScore;
    private calculateGoalAlignment;
    private calculateTimeCompatibility;
    private calculateRecoveryCompatibility;
    private calculateTechnicalSuitability;
    private calculateEquipmentOptimization;
}
