/**
 * Nate's Proprietary UX & Automation Engine
 *
 * This system provides:
 * - Wearables integration (Apple Health, Fitbit, etc.)
 * - Smart automation triggers
 * - Proactive interventions
 * - Seamless user experience
 *
 * This creates a level of automation and data integration
 * that competitors using GPT alone cannot match.
 */
import { z } from "zod";
export interface WearableDevice {
    id: string;
    userId: string;
    deviceType: DeviceType;
    brand: string;
    model: string;
    connectionStatus: "connected" | "disconnected" | "syncing" | "error";
    lastSyncTime: Date;
    dataTypes: WearableDataType[];
    permissions: DevicePermission[];
    settings: DeviceSettings;
}
export type DeviceType = "smartwatch" | "fitness_tracker" | "heart_rate_monitor" | "smart_scale" | "sleep_tracker" | "blood_pressure_monitor" | "continuous_glucose_monitor";
export type WearableDataType = "heart_rate" | "steps" | "calories_burned" | "distance" | "sleep_data" | "workout_sessions" | "stress_levels" | "hrv" | "spo2" | "body_temperature" | "weight" | "body_fat" | "blood_pressure" | "glucose_levels" | "recovery_metrics";
export interface DevicePermission {
    dataType: WearableDataType;
    granted: boolean;
    grantedDate: Date;
    scope: "read" | "write" | "read_write";
}
export interface DeviceSettings {
    syncFrequency: "real_time" | "hourly" | "daily";
    dataRetention: number;
    autoAnalysis: boolean;
    triggerNotifications: boolean;
    privacyLevel: "minimal" | "standard" | "comprehensive";
}
export interface WearableDataPoint {
    id: string;
    deviceId: string;
    userId: string;
    dataType: WearableDataType;
    timestamp: Date;
    value: number | string | object;
    unit: string;
    quality: DataQuality;
    context: DataContext;
}
export interface DataQuality {
    accuracy: number;
    reliability: number;
    completeness: number;
    timeliness: number;
}
export interface DataContext {
    activity: string;
    location: string;
    weather?: WeatherData;
    userReportedState?: UserState;
}
export interface WeatherData {
    temperature: number;
    humidity: number;
    pressure: number;
    conditions: string;
}
export interface UserState {
    mood: number;
    energy: number;
    stress: number;
    motivation: number;
}
export interface AutomationRule {
    id: string;
    name: string;
    userId: string;
    isActive: boolean;
    priority: "low" | "medium" | "high" | "critical";
    triggers: AutomationTrigger[];
    conditions: AutomationCondition[];
    actions: AutomationAction[];
    cooldownPeriod: number;
    lastTriggered?: Date;
    successRate: number;
    userSatisfaction: number;
}
export interface AutomationTrigger {
    type: TriggerType;
    source: DataSource;
    threshold: ThresholdRule;
    timeConstraints?: TimeConstraint[];
}
export type TriggerType = "value_threshold" | "trend_change" | "pattern_break" | "time_based" | "event_based" | "combination";
export type DataSource = "wearable_data" | "user_input" | "app_behavior" | "external_api" | "calendar" | "weather" | "location";
export interface ThresholdRule {
    metric: string;
    operator: "gt" | "lt" | "eq" | "gte" | "lte" | "between" | "outside";
    value: number | [number, number];
    duration?: number;
}
export interface TimeConstraint {
    dayOfWeek?: number[];
    timeRange?: {
        start: string;
        end: string;
    };
    timezone?: string;
    excludeHolidays?: boolean;
}
export interface AutomationCondition {
    type: "and" | "or" | "not";
    rules: ConditionRule[];
}
export interface ConditionRule {
    metric: string;
    operator: "gt" | "lt" | "eq" | "gte" | "lte" | "contains" | "exists";
    value: any;
    timeWindow?: number;
}
export interface AutomationAction {
    type: ActionType;
    parameters: ActionParameters;
    delay?: number;
    retryPolicy?: RetryPolicy;
}
export type ActionType = "send_notification" | "adjust_plan" | "schedule_workout" | "recommend_nutrition" | "suggest_recovery" | "update_goals" | "log_data" | "trigger_assessment" | "escalate_to_human";
export interface ActionParameters {
    [key: string]: any;
}
export interface RetryPolicy {
    maxRetries: number;
    backoffStrategy: "linear" | "exponential" | "fixed";
    retryDelay: number;
}
export interface SmartIntervention {
    id: string;
    type: InterventionType;
    priority: "low" | "medium" | "high" | "urgent";
    trigger: InterventionTrigger;
    content: InterventionContent;
    timing: InterventionTiming;
    personalization: InterventionPersonalization;
    effectiveness: InterventionEffectiveness;
}
export type InterventionType = "motivational_message" | "workout_adjustment" | "nutrition_reminder" | "recovery_suggestion" | "goal_check_in" | "habit_reinforcement" | "plateau_breakthrough" | "stress_management" | "injury_prevention";
export interface InterventionTrigger {
    conditions: string[];
    confidence: number;
    urgency: number;
    context: string;
}
export interface InterventionContent {
    title: string;
    message: string;
    actionable: boolean;
    actions?: InterventionAction[];
    media?: MediaContent[];
    duration?: number;
}
export interface InterventionAction {
    label: string;
    action: string;
    parameters: any;
    category: "primary" | "secondary" | "dismissal";
}
export interface MediaContent {
    type: "image" | "video" | "audio" | "animation";
    url: string;
    alt?: string;
    duration?: number;
}
export interface InterventionTiming {
    deliveryTime: Date;
    timezone: string;
    preferredMethods: DeliveryMethod[];
    avoidancePeriods: AvoidancePeriod[];
}
export interface DeliveryMethod {
    method: "push_notification" | "in_app" | "email" | "sms" | "voice";
    priority: number;
    enabled: boolean;
}
export interface AvoidancePeriod {
    start: string;
    end: string;
    reason: string;
    days?: number[];
}
export interface InterventionPersonalization {
    userProfile: string;
    communicationStyle: string;
    motivationalTriggers: string[];
    avoidanceTriggers: string[];
    contextualFactors: string[];
}
export interface InterventionEffectiveness {
    deliveryRate: number;
    engagementRate: number;
    actionRate: number;
    satisfactionScore: number;
    behaviorChange: number;
    longTermImpact: number;
}
export interface ProactiveCoaching {
    predictions: PerformancePrediction[];
    recommendations: ProactiveRecommendation[];
    interventions: SmartIntervention[];
    optimizations: PlanOptimization[];
}
export interface PerformancePrediction {
    metric: string;
    predictedValue: number;
    confidence: number;
    timeHorizon: number;
    factors: PredictiveFactor[];
    riskLevel: "low" | "medium" | "high";
}
export interface PredictiveFactor {
    factor: string;
    influence: number;
    confidence: number;
    trend: "improving" | "stable" | "declining";
}
export interface ProactiveRecommendation {
    id: string;
    type: RecommendationType;
    title: string;
    description: string;
    rationale: string;
    urgency: number;
    impact: number;
    effort: number;
    timeline: string;
    dependencies: string[];
}
export type RecommendationType = "workout_modification" | "nutrition_adjustment" | "recovery_enhancement" | "goal_refinement" | "habit_formation" | "equipment_upgrade" | "education_content" | "social_engagement";
export interface PlanOptimization {
    category: string;
    currentValue: number;
    optimizedValue: number;
    improvement: number;
    confidence: number;
    implementation: OptimizationStep[];
}
export interface OptimizationStep {
    step: string;
    order: number;
    duration: number;
    effort: number;
    impact: number;
}
export declare class AutomationEngine {
    private wearableManager;
    private ruleEngine;
    private interventionEngine;
    private predictionEngine;
    private notificationManager;
    constructor();
    /**
     * Initialize wearable device integration
     */
    connectWearableDevice(userId: string, deviceType: DeviceType, authToken: string): Promise<WearableDevice>;
    /**
     * Sync data from all connected wearables
     */
    syncWearableData(userId: string): Promise<WearableDataPoint[]>;
    /**
     * Process incoming wearable data and trigger automations
     */
    processWearableData(dataPoint: WearableDataPoint): Promise<void>;
    /**
     * Create custom automation rule
     */
    createAutomationRule(userId: string, rule: Omit<AutomationRule, "id" | "successRate" | "userSatisfaction">): Promise<AutomationRule>;
    /**
     * Generate proactive coaching insights
     */
    generateProactiveCoaching(userId: string): Promise<ProactiveCoaching>;
    /**
     * Handle missed workout automatically
     */
    handleMissedWorkout(userId: string, workoutId: string): Promise<void>;
    /**
     * Smart notification delivery based on user context
     */
    deliverSmartNotification(userId: string, content: InterventionContent, priority: "low" | "medium" | "high" | "urgent"): Promise<void>;
    private generateRuleId;
    private storeWearableData;
    private executeAutomation;
    private getUserContext;
    private getWorkoutData;
    private rescheduleWorkout;
    private adjustWeeklyPlan;
    private triggerMotivationalIntervention;
    private scheduleWellnessCheckIn;
}
export declare const WearableDeviceSchema: z.ZodObject<{
    id: z.ZodString;
    userId: z.ZodString;
    deviceType: z.ZodEnum<["smartwatch", "fitness_tracker", "heart_rate_monitor", "smart_scale", "sleep_tracker", "blood_pressure_monitor", "continuous_glucose_monitor"]>;
    brand: z.ZodString;
    model: z.ZodString;
    connectionStatus: z.ZodEnum<["connected", "disconnected", "syncing", "error"]>;
    lastSyncTime: z.ZodDate;
    dataTypes: z.ZodArray<z.ZodEnum<["heart_rate", "steps", "calories_burned", "distance", "sleep_data", "workout_sessions", "stress_levels", "hrv", "spo2", "body_temperature", "weight", "body_fat", "blood_pressure", "glucose_levels", "recovery_metrics"]>, "many">;
    permissions: z.ZodArray<z.ZodObject<{
        dataType: z.ZodString;
        granted: z.ZodBoolean;
        grantedDate: z.ZodDate;
        scope: z.ZodEnum<["read", "write", "read_write"]>;
    }, "strip", z.ZodTypeAny, {
        dataType: string;
        granted: boolean;
        grantedDate: Date;
        scope: "read" | "write" | "read_write";
    }, {
        dataType: string;
        granted: boolean;
        grantedDate: Date;
        scope: "read" | "write" | "read_write";
    }>, "many">;
    settings: z.ZodObject<{
        syncFrequency: z.ZodEnum<["real_time", "hourly", "daily"]>;
        dataRetention: z.ZodNumber;
        autoAnalysis: z.ZodBoolean;
        triggerNotifications: z.ZodBoolean;
        privacyLevel: z.ZodEnum<["minimal", "standard", "comprehensive"]>;
    }, "strip", z.ZodTypeAny, {
        syncFrequency: "daily" | "real_time" | "hourly";
        dataRetention: number;
        autoAnalysis: boolean;
        triggerNotifications: boolean;
        privacyLevel: "standard" | "minimal" | "comprehensive";
    }, {
        syncFrequency: "daily" | "real_time" | "hourly";
        dataRetention: number;
        autoAnalysis: boolean;
        triggerNotifications: boolean;
        privacyLevel: "standard" | "minimal" | "comprehensive";
    }>;
}, "strip", z.ZodTypeAny, {
    id: string;
    userId: string;
    model: string;
    dataTypes: ("weight" | "distance" | "heart_rate" | "steps" | "calories_burned" | "sleep_data" | "workout_sessions" | "stress_levels" | "hrv" | "spo2" | "body_temperature" | "body_fat" | "blood_pressure" | "glucose_levels" | "recovery_metrics")[];
    deviceType: "smartwatch" | "fitness_tracker" | "heart_rate_monitor" | "smart_scale" | "sleep_tracker" | "blood_pressure_monitor" | "continuous_glucose_monitor";
    brand: string;
    connectionStatus: "connected" | "disconnected" | "syncing" | "error";
    lastSyncTime: Date;
    permissions: {
        dataType: string;
        granted: boolean;
        grantedDate: Date;
        scope: "read" | "write" | "read_write";
    }[];
    settings: {
        syncFrequency: "daily" | "real_time" | "hourly";
        dataRetention: number;
        autoAnalysis: boolean;
        triggerNotifications: boolean;
        privacyLevel: "standard" | "minimal" | "comprehensive";
    };
}, {
    id: string;
    userId: string;
    model: string;
    dataTypes: ("weight" | "distance" | "heart_rate" | "steps" | "calories_burned" | "sleep_data" | "workout_sessions" | "stress_levels" | "hrv" | "spo2" | "body_temperature" | "body_fat" | "blood_pressure" | "glucose_levels" | "recovery_metrics")[];
    deviceType: "smartwatch" | "fitness_tracker" | "heart_rate_monitor" | "smart_scale" | "sleep_tracker" | "blood_pressure_monitor" | "continuous_glucose_monitor";
    brand: string;
    connectionStatus: "connected" | "disconnected" | "syncing" | "error";
    lastSyncTime: Date;
    permissions: {
        dataType: string;
        granted: boolean;
        grantedDate: Date;
        scope: "read" | "write" | "read_write";
    }[];
    settings: {
        syncFrequency: "daily" | "real_time" | "hourly";
        dataRetention: number;
        autoAnalysis: boolean;
        triggerNotifications: boolean;
        privacyLevel: "standard" | "minimal" | "comprehensive";
    };
}>;
export declare const AutomationRuleSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    userId: z.ZodString;
    isActive: z.ZodBoolean;
    priority: z.ZodEnum<["low", "medium", "high", "critical"]>;
    triggers: z.ZodArray<z.ZodObject<{
        type: z.ZodEnum<["value_threshold", "trend_change", "pattern_break", "time_based", "event_based", "combination"]>;
        source: z.ZodEnum<["wearable_data", "user_input", "app_behavior", "external_api", "calendar", "weather", "location"]>;
        threshold: z.ZodObject<{
            metric: z.ZodString;
            operator: z.ZodEnum<["gt", "lt", "eq", "gte", "lte", "between", "outside"]>;
            value: z.ZodUnion<[z.ZodNumber, z.ZodArray<z.ZodNumber, "many">]>;
            duration: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            value: number | number[];
            metric: string;
            operator: "lt" | "gt" | "eq" | "lte" | "gte" | "between" | "outside";
            duration?: number | undefined;
        }, {
            value: number | number[];
            metric: string;
            operator: "lt" | "gt" | "eq" | "lte" | "gte" | "between" | "outside";
            duration?: number | undefined;
        }>;
        timeConstraints: z.ZodOptional<z.ZodArray<z.ZodObject<{
            dayOfWeek: z.ZodOptional<z.ZodArray<z.ZodNumber, "many">>;
            timeRange: z.ZodOptional<z.ZodObject<{
                start: z.ZodString;
                end: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                start: string;
                end: string;
            }, {
                start: string;
                end: string;
            }>>;
            timezone: z.ZodOptional<z.ZodString>;
            excludeHolidays: z.ZodOptional<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            dayOfWeek?: number[] | undefined;
            timeRange?: {
                start: string;
                end: string;
            } | undefined;
            timezone?: string | undefined;
            excludeHolidays?: boolean | undefined;
        }, {
            dayOfWeek?: number[] | undefined;
            timeRange?: {
                start: string;
                end: string;
            } | undefined;
            timezone?: string | undefined;
            excludeHolidays?: boolean | undefined;
        }>, "many">>;
    }, "strip", z.ZodTypeAny, {
        type: "value_threshold" | "trend_change" | "pattern_break" | "time_based" | "event_based" | "combination";
        source: "user_input" | "wearable_data" | "app_behavior" | "external_api" | "calendar" | "weather" | "location";
        threshold: {
            value: number | number[];
            metric: string;
            operator: "lt" | "gt" | "eq" | "lte" | "gte" | "between" | "outside";
            duration?: number | undefined;
        };
        timeConstraints?: {
            dayOfWeek?: number[] | undefined;
            timeRange?: {
                start: string;
                end: string;
            } | undefined;
            timezone?: string | undefined;
            excludeHolidays?: boolean | undefined;
        }[] | undefined;
    }, {
        type: "value_threshold" | "trend_change" | "pattern_break" | "time_based" | "event_based" | "combination";
        source: "user_input" | "wearable_data" | "app_behavior" | "external_api" | "calendar" | "weather" | "location";
        threshold: {
            value: number | number[];
            metric: string;
            operator: "lt" | "gt" | "eq" | "lte" | "gte" | "between" | "outside";
            duration?: number | undefined;
        };
        timeConstraints?: {
            dayOfWeek?: number[] | undefined;
            timeRange?: {
                start: string;
                end: string;
            } | undefined;
            timezone?: string | undefined;
            excludeHolidays?: boolean | undefined;
        }[] | undefined;
    }>, "many">;
    conditions: z.ZodArray<z.ZodObject<{
        type: z.ZodEnum<["and", "or", "not"]>;
        rules: z.ZodArray<z.ZodObject<{
            metric: z.ZodString;
            operator: z.ZodEnum<["gt", "lt", "eq", "gte", "lte", "contains", "exists"]>;
            value: z.ZodAny;
            timeWindow: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            metric: string;
            operator: "lt" | "gt" | "eq" | "lte" | "gte" | "contains" | "exists";
            value?: any;
            timeWindow?: number | undefined;
        }, {
            metric: string;
            operator: "lt" | "gt" | "eq" | "lte" | "gte" | "contains" | "exists";
            value?: any;
            timeWindow?: number | undefined;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        type: "and" | "or" | "not";
        rules: {
            metric: string;
            operator: "lt" | "gt" | "eq" | "lte" | "gte" | "contains" | "exists";
            value?: any;
            timeWindow?: number | undefined;
        }[];
    }, {
        type: "and" | "or" | "not";
        rules: {
            metric: string;
            operator: "lt" | "gt" | "eq" | "lte" | "gte" | "contains" | "exists";
            value?: any;
            timeWindow?: number | undefined;
        }[];
    }>, "many">;
    actions: z.ZodArray<z.ZodObject<{
        type: z.ZodEnum<["send_notification", "adjust_plan", "schedule_workout", "recommend_nutrition", "suggest_recovery", "update_goals", "log_data", "trigger_assessment", "escalate_to_human"]>;
        parameters: z.ZodRecord<z.ZodString, z.ZodAny>;
        delay: z.ZodOptional<z.ZodNumber>;
        retryPolicy: z.ZodOptional<z.ZodObject<{
            maxRetries: z.ZodNumber;
            backoffStrategy: z.ZodEnum<["linear", "exponential", "fixed"]>;
            retryDelay: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            maxRetries: number;
            backoffStrategy: "linear" | "exponential" | "fixed";
            retryDelay: number;
        }, {
            maxRetries: number;
            backoffStrategy: "linear" | "exponential" | "fixed";
            retryDelay: number;
        }>>;
    }, "strip", z.ZodTypeAny, {
        type: "send_notification" | "adjust_plan" | "schedule_workout" | "recommend_nutrition" | "suggest_recovery" | "update_goals" | "log_data" | "trigger_assessment" | "escalate_to_human";
        parameters: Record<string, any>;
        delay?: number | undefined;
        retryPolicy?: {
            maxRetries: number;
            backoffStrategy: "linear" | "exponential" | "fixed";
            retryDelay: number;
        } | undefined;
    }, {
        type: "send_notification" | "adjust_plan" | "schedule_workout" | "recommend_nutrition" | "suggest_recovery" | "update_goals" | "log_data" | "trigger_assessment" | "escalate_to_human";
        parameters: Record<string, any>;
        delay?: number | undefined;
        retryPolicy?: {
            maxRetries: number;
            backoffStrategy: "linear" | "exponential" | "fixed";
            retryDelay: number;
        } | undefined;
    }>, "many">;
    cooldownPeriod: z.ZodNumber;
    lastTriggered: z.ZodOptional<z.ZodDate>;
    successRate: z.ZodNumber;
    userSatisfaction: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    id: string;
    name: string;
    userId: string;
    priority: "critical" | "high" | "medium" | "low";
    successRate: number;
    userSatisfaction: number;
    isActive: boolean;
    triggers: {
        type: "value_threshold" | "trend_change" | "pattern_break" | "time_based" | "event_based" | "combination";
        source: "user_input" | "wearable_data" | "app_behavior" | "external_api" | "calendar" | "weather" | "location";
        threshold: {
            value: number | number[];
            metric: string;
            operator: "lt" | "gt" | "eq" | "lte" | "gte" | "between" | "outside";
            duration?: number | undefined;
        };
        timeConstraints?: {
            dayOfWeek?: number[] | undefined;
            timeRange?: {
                start: string;
                end: string;
            } | undefined;
            timezone?: string | undefined;
            excludeHolidays?: boolean | undefined;
        }[] | undefined;
    }[];
    conditions: {
        type: "and" | "or" | "not";
        rules: {
            metric: string;
            operator: "lt" | "gt" | "eq" | "lte" | "gte" | "contains" | "exists";
            value?: any;
            timeWindow?: number | undefined;
        }[];
    }[];
    actions: {
        type: "send_notification" | "adjust_plan" | "schedule_workout" | "recommend_nutrition" | "suggest_recovery" | "update_goals" | "log_data" | "trigger_assessment" | "escalate_to_human";
        parameters: Record<string, any>;
        delay?: number | undefined;
        retryPolicy?: {
            maxRetries: number;
            backoffStrategy: "linear" | "exponential" | "fixed";
            retryDelay: number;
        } | undefined;
    }[];
    cooldownPeriod: number;
    lastTriggered?: Date | undefined;
}, {
    id: string;
    name: string;
    userId: string;
    priority: "critical" | "high" | "medium" | "low";
    successRate: number;
    userSatisfaction: number;
    isActive: boolean;
    triggers: {
        type: "value_threshold" | "trend_change" | "pattern_break" | "time_based" | "event_based" | "combination";
        source: "user_input" | "wearable_data" | "app_behavior" | "external_api" | "calendar" | "weather" | "location";
        threshold: {
            value: number | number[];
            metric: string;
            operator: "lt" | "gt" | "eq" | "lte" | "gte" | "between" | "outside";
            duration?: number | undefined;
        };
        timeConstraints?: {
            dayOfWeek?: number[] | undefined;
            timeRange?: {
                start: string;
                end: string;
            } | undefined;
            timezone?: string | undefined;
            excludeHolidays?: boolean | undefined;
        }[] | undefined;
    }[];
    conditions: {
        type: "and" | "or" | "not";
        rules: {
            metric: string;
            operator: "lt" | "gt" | "eq" | "lte" | "gte" | "contains" | "exists";
            value?: any;
            timeWindow?: number | undefined;
        }[];
    }[];
    actions: {
        type: "send_notification" | "adjust_plan" | "schedule_workout" | "recommend_nutrition" | "suggest_recovery" | "update_goals" | "log_data" | "trigger_assessment" | "escalate_to_human";
        parameters: Record<string, any>;
        delay?: number | undefined;
        retryPolicy?: {
            maxRetries: number;
            backoffStrategy: "linear" | "exponential" | "fixed";
            retryDelay: number;
        } | undefined;
    }[];
    cooldownPeriod: number;
    lastTriggered?: Date | undefined;
}>;
