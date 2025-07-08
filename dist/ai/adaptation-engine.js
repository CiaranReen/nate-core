/**
 * Nate's Proprietary Adaptation Engine
 *
 * This is the core intelligence layer that makes Nate unique.
 * It analyzes user data and applies hard-coded rules to automatically
 * adjust plans, macros, and recommendations without relying on GPT.
 */
import { z } from "zod";
export class AdaptationEngine {
    constructor() {
        this.rules = [];
        this.userSignatures = new Map();
        this.adaptationHistory = new Map();
        this.planLineages = new Map();
        this.ruleInteractions = [];
        this.analytics = {
            ruleEffectivenessRates: {},
            combinationOutcomes: {},
            contextualSuccessFactors: {},
            commonFailurePatterns: [],
            optimalParameterRanges: {},
            userSegmentPerformance: {},
            temporalPatterns: {},
            lastUpdated: new Date(),
            dataPoints: 0,
        };
        this.ruleWeights = new Map();
        // 🚀 NEW: Final Advanced Features
        this.ruleSetVersions = new Map();
        this.currentRuleSetVersion = "v1.0.0";
        this.userTestGroups = new Map(); // userId -> testGroup
        this.mlTrainingData = [];
        this.simulationCache = new Map();
        this.initializeRules();
        this.initializeRuleInteractions();
        this.initializeAnalytics();
        this.loadRuleWeights();
        this.initializeRuleSetVersioning();
        this.initializeMLModel();
    }
    /**
     * 🚀 ENHANCED: Main adaptation method with full explainability
     */
    async analyzeWithExplanation(userMetrics) {
        // Get or create user signature
        const userSignature = this.getUserSignature(userMetrics.userId);
        // Calculate Nate's proprietary metrics
        const proprietaryMetrics = this.calculateProprietaryMetrics(userMetrics, userSignature);
        // Get current rule set version for this user
        const ruleSetVersion = this.getRuleSetVersionForUser(userMetrics.userId);
        // Phase 1: Base analysis (existing logic)
        const recommendations = this.analyze(userMetrics);
        // Phase 2: 🚀 Generate detailed explanation
        const explanation = await this.generateExplanation(recommendations, userMetrics, userSignature, proprietaryMetrics);
        // Phase 3: 🚀 Create pre-emptive plan
        const preemptivePlan = await this.generatePreemptivePlan(userMetrics, userSignature, proprietaryMetrics);
        // Phase 4: 🚀 Run simulation if recommendations are significant
        let simulationResults;
        if (recommendations.some((r) => r.priority === "critical" || r.priority === "high")) {
            simulationResults = await this.runSimulation(userMetrics, userSignature, recommendations);
        }
        // Phase 5: 🚀 Apply ML fine-tuning if available
        if (this.mlModel?.deploymentStatus === "production") {
            const mlPredictions = await this.getMlPredictions(userMetrics, proprietaryMetrics);
            if (mlPredictions && mlPredictions.confidence > 0.7) {
                this.applyMlFineTuning(recommendations, mlPredictions);
            }
        }
        // Record this analysis for learning
        await this.recordAnalysisForLearning(userMetrics, recommendations, explanation, ruleSetVersion);
        return {
            recommendations,
            explanation,
            preemptivePlan,
            simulationResults,
        };
    }
    /**
     * 🚀 Explainability Layer - Generate human-friendly explanations
     */
    async generateExplanation(recommendations, userMetrics, userSignature, proprietaryMetrics) {
        if (recommendations.length === 0) {
            return {
                recommendationId: `no-change-${Date.now()}`,
                primaryReason: "Your current plan is working well",
                contributingFactors: [
                    {
                        metric: "Adaptive Recovery Index",
                        value: proprietaryMetrics.adaptiveRecoveryIndex,
                        impact: "low",
                        description: "Your recovery is on track",
                        trend: "stable",
                    },
                ],
                confidence: 0.9,
                riskFactors: [],
                expectedOutcome: "Continue seeing steady progress with current approach",
                alternativesConsidered: [],
                dataPoints: ["No concerning metrics detected"],
                timelineExpectation: "Keep monitoring for next 1-2 weeks",
            };
        }
        const primaryRecommendation = recommendations[0];
        const contributingFactors = [];
        const dataPoints = [];
        const riskFactors = [];
        const alternativesConsidered = [];
        // Analyze primary drivers
        if (proprietaryMetrics.adaptiveRecoveryIndex < 30) {
            contributingFactors.push({
                metric: "Adaptive Recovery Index",
                value: proprietaryMetrics.adaptiveRecoveryIndex,
                impact: "high",
                description: "Your recovery capacity is significantly compromised",
                trend: "declining",
            });
            dataPoints.push(`ARI at ${proprietaryMetrics.adaptiveRecoveryIndex}% (critical threshold: 30%)`);
        }
        if (proprietaryMetrics.engagementScore < 40) {
            contributingFactors.push({
                metric: "Engagement Score",
                value: proprietaryMetrics.engagementScore,
                impact: "high",
                description: "Your motivation and consistency have dropped notably",
                trend: "declining",
            });
            dataPoints.push(`Engagement at ${proprietaryMetrics.engagementScore}% (warning threshold: 40%)`);
        }
        if (proprietaryMetrics.progressVelocity < 20) {
            contributingFactors.push({
                metric: "Progress Velocity",
                value: proprietaryMetrics.progressVelocity,
                impact: "medium",
                description: "Your rate of improvement has slowed",
                trend: "declining",
            });
            dataPoints.push(`Progress velocity at ${proprietaryMetrics.progressVelocity}% (target: >50%)`);
        }
        // Historical context
        const history = this.adaptationHistory.get(userMetrics.userId) || [];
        const recentSuccesses = history
            .filter((h) => h.effectiveness > 0.7)
            .slice(-3);
        let historicalContext = undefined;
        if (recentSuccesses.length > 0) {
            historicalContext = `Based on your history, ${recentSuccesses[0].recommendation.type} adaptations work well for you`;
        }
        // Risk factors
        if (primaryRecommendation.priority === "critical") {
            riskFactors.push("Without intervention, you may experience motivation loss or potential burnout");
        }
        if (primaryRecommendation.type === "intensity" &&
            primaryRecommendation.changes.some((c) => c.adjustment < -20)) {
            riskFactors.push("Significant intensity reduction may temporarily slow visible progress");
        }
        // Alternatives considered
        if (primaryRecommendation.type === "recovery") {
            alternativesConsidered.push({
                strategy: "Continue current intensity with extra rest days",
                whyNotChosen: "Your ARI indicates you need focused recovery time",
                couldBeUsedIf: "Your ARI improves above 40% in the next few days",
            });
        }
        return {
            recommendationId: `explain-${primaryRecommendation.type}-${Date.now()}`,
            primaryReason: this.generatePrimaryReason(primaryRecommendation, proprietaryMetrics),
            contributingFactors,
            confidence: this.calculateExplanationConfidence(contributingFactors, userSignature),
            riskFactors,
            expectedOutcome: this.generateExpectedOutcome(primaryRecommendation, proprietaryMetrics),
            alternativesConsidered,
            dataPoints,
            historicalContext,
            timelineExpectation: this.generateTimelineExpectation(primaryRecommendation),
        };
    }
    /**
     * 🚀 Pre-emptive Adaptation Planning - Predict future needs
     */
    async generatePreemptivePlan(userMetrics, userSignature, proprietaryMetrics) {
        const currentWeek = Math.floor((Date.now() - new Date(userMetrics.currentPlan.id).getTime()) /
            (7 * 24 * 60 * 60 * 1000));
        // Calculate plan confidence
        const planConfidenceScore = this.calculatePlanConfidence(userMetrics, userSignature, proprietaryMetrics);
        // Predict future adaptations
        const predictedAdaptations = this.predictFutureAdaptations(userMetrics, userSignature, proprietaryMetrics);
        // Generate early warning signals
        const earlyWarningSignals = this.generateEarlyWarningSignals(userMetrics, proprietaryMetrics);
        // Create contingency plans
        const contingencyPlans = this.generateContingencyPlans(userMetrics, userSignature);
        // Project optimal trajectory
        const optimalTrajectory = this.projectOptimalTrajectory(userMetrics, userSignature, proprietaryMetrics);
        // Assess risks
        const riskAssessment = this.assessRisks(userMetrics, userSignature, proprietaryMetrics);
        return {
            userId: userMetrics.userId,
            currentWeek,
            planConfidenceScore,
            predictedAdaptations,
            earlyWarningSignals,
            contingencyPlans,
            optimalTrajectory,
            riskAssessment,
            generatedAt: new Date(),
            validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week
        };
    }
    /**
     * 🚀 Simulated Plan Testing - Run virtual scenarios
     */
    async runSimulation(userMetrics, userSignature, proposedRecommendations) {
        const simulationId = `sim-${userMetrics.userId}-${Date.now()}`;
        // Check cache first
        const cacheKey = this.generateSimulationCacheKey(userMetrics, proposedRecommendations);
        if (this.simulationCache.has(cacheKey)) {
            return this.simulationCache.get(cacheKey);
        }
        const scenario = {
            name: "Adaptation Impact Simulation",
            duration: 4, // 4 weeks
            initialState: userMetrics,
            userSignature,
            stochasticFactors: [
                {
                    event: "work_stress_spike",
                    probability: 0.2,
                    impact: { lifestyle: { ...userMetrics.lifestyle, stressLevel: 8 } },
                    duration: 1,
                },
                {
                    event: "motivation_boost",
                    probability: 0.3,
                    impact: { mood: { ...userMetrics.mood, motivation: 8 } },
                    duration: 2,
                },
                {
                    event: "life_disruption",
                    probability: 0.1,
                    impact: { lifestyle: { ...userMetrics.lifestyle, sleepHours: 5 } },
                    duration: 1,
                },
            ],
            constraints: [
                {
                    type: "max_adaptations_per_week",
                    value: 2,
                    reason: "Avoid overwhelming user with changes",
                },
            ],
        };
        const startTime = Date.now();
        const iterations = 100;
        const outcomes = [];
        // Run multiple simulations
        for (let i = 0; i < iterations; i++) {
            const outcome = await this.runSingleSimulation(scenario, proposedRecommendations);
            outcomes.push(outcome);
        }
        // Analyze results
        const bestPath = outcomes.reduce((best, current) => current.progressScore > best.progressScore ? current : best).path;
        const worstPath = outcomes.reduce((worst, current) => current.progressScore < worst.progressScore ? current : worst).path;
        const expectedValue = outcomes.reduce((sum, outcome) => sum +
            (outcome.progressScore * 0.4 +
                outcome.adherenceRate * 0.3 +
                outcome.userSatisfactionScore * 0.3), 0) / outcomes.length;
        const result = {
            simulationId,
            scenario,
            outcomes,
            bestPath,
            worstPath,
            expectedValue,
            confidence: this.calculateSimulationConfidence(outcomes),
            runTime: Date.now() - startTime,
            iterations,
        };
        // Cache result
        this.simulationCache.set(cacheKey, result);
        return result;
    }
    /**
     * 🚀 Versioned Rule Sets - A/B testing support
     */
    initializeRuleSetVersioning() {
        const baseVersion = {
            versionId: "v1.0.0",
            versionName: "baseline_rule_set",
            rules: [
                "FatigueRule",
                "ConsistencyRule",
                "ProgressiveOverloadRule",
                "RecoveryRule",
                "MotivationRule",
                "PlateauRule",
                "StressRule",
                "SleepRule",
            ],
            ruleWeights: {
                FatigueRule: 1.0,
                ConsistencyRule: 0.8,
                ProgressiveOverloadRule: 0.7,
                RecoveryRule: 0.9,
                MotivationRule: 0.6,
                PlateauRule: 0.7,
                StressRule: 0.9,
                SleepRule: 0.8,
            },
            activatedAt: new Date(),
            description: "Initial production rule set with balanced weights",
            changeSummary: ["Initial release"],
            performanceMetrics: {
                avgUserSatisfaction: 0,
                avgEffectiveness: 0,
                avgAdaptationSpeed: 0,
                retentionImpact: 0,
            },
        };
        this.ruleSetVersions.set("v1.0.0", baseVersion);
    }
    /**
     * Deploy a new rule set version for A/B testing
     */
    async deployRuleSetVersion(version, testGroupPercentage = 10) {
        this.ruleSetVersions.set(version.versionId, version);
        // Assign users to test groups (simple implementation)
        // In production, this would be more sophisticated
        const allUserIds = Array.from(this.userSignatures.keys());
        const testGroupSize = Math.floor(allUserIds.length * (testGroupPercentage / 100));
        for (let i = 0; i < testGroupSize; i++) {
            const userId = allUserIds[i];
            this.userTestGroups.set(userId, version.versionId);
        }
    }
    /**
     * 🚀 ML Model Integration
     */
    initializeMLModel() {
        // Initialize with basic config - would be loaded from storage in production
        this.mlModel = {
            modelType: "gradient_boosting",
            version: "1.0.0",
            trainingDataSize: 0,
            lastTrainedAt: new Date(),
            accuracy: 0,
            features: [
                {
                    name: "adaptive_recovery_index",
                    type: "numeric",
                    importance: 0.25,
                    source: "proprietary_metrics",
                    description: "Nate's ARI score",
                },
                {
                    name: "engagement_score",
                    type: "numeric",
                    importance: 0.2,
                    source: "proprietary_metrics",
                    description: "User engagement level",
                },
                {
                    name: "historical_effectiveness",
                    type: "numeric",
                    importance: 0.15,
                    source: "historical_data",
                    description: "Past adaptation success rate for this user",
                },
            ],
            hyperparameters: {
                learning_rate: 0.1,
                n_estimators: 100,
                max_depth: 6,
            },
            deploymentStatus: "training",
        };
    }
    /**
     * Get ML-enhanced predictions
     */
    async getMlPredictions(userMetrics, proprietaryMetrics) {
        if (!this.mlModel || this.mlModel.deploymentStatus !== "production") {
            return null;
        }
        // Extract features
        const features = this.extractFeaturesForML(userMetrics, proprietaryMetrics);
        // Simulate ML prediction (in production, this would call actual ML service)
        const mockPrediction = {
            recommendationType: "intensity",
            parameterAdjustments: {
                intensity_change: -12.5, // ML suggests 12.5% instead of rules-based 15%
                duration: 5.2, // Slightly longer duration
            },
            confidence: 0.78,
            explanation: "ML model suggests slightly gentler intensity reduction based on similar user patterns",
            featureInfluences: {
                adaptive_recovery_index: 0.35,
                engagement_score: 0.25,
                historical_effectiveness: 0.2,
            },
            modelVersion: this.mlModel.version,
            fallbackToRules: false,
        };
        return mockPrediction;
    }
    // Helper methods for the new features...
    getRuleSetVersionForUser(userId) {
        return this.userTestGroups.get(userId) || this.currentRuleSetVersion;
    }
    generatePrimaryReason(recommendation, proprietaryMetrics) {
        switch (recommendation.type) {
            case "recovery":
                return `Your Adaptive Recovery Index (${proprietaryMetrics.adaptiveRecoveryIndex}%) indicates you need focused recovery time`;
            case "intensity":
                return `Based on your fatigue patterns and engagement score (${proprietaryMetrics.engagementScore}%), an intensity adjustment will optimize your progress`;
            case "exercise_swap":
                return `Your motivational momentum (${proprietaryMetrics.motivationalMomentum}%) suggests exercise variety will reignite your enthusiasm`;
            default:
                return recommendation.reason;
        }
    }
    calculateExplanationConfidence(factors, userSignature) {
        const highImpactFactors = factors.filter((f) => f.impact === "high").length;
        const totalFactors = factors.length;
        const userDataConfidence = userSignature.confidenceLevel;
        return Math.min(0.95, (highImpactFactors / Math.max(totalFactors, 1)) * 0.7 +
            userDataConfidence * 0.3);
    }
    generateExpectedOutcome(recommendation, proprietaryMetrics) {
        const timeframe = recommendation.duration <= 3 ? "within a few days" : "over the next week";
        switch (recommendation.type) {
            case "recovery":
                return `Your ARI should improve by 20-30% ${timeframe}, leading to better workout quality and motivation`;
            case "intensity":
                const direction = recommendation.changes.some((c) => c.adjustment < 0)
                    ? "reduction"
                    : "increase";
                return `This ${direction} should improve your adherence quality and engagement score ${timeframe}`;
            default:
                return `You should see improvements in relevant metrics ${timeframe}`;
        }
    }
    generateTimelineExpectation(recommendation) {
        return `Initial improvements expected within ${Math.ceil(recommendation.duration / 2)} days, full effect by day ${recommendation.duration}`;
    }
    calculatePlanConfidence(userMetrics, userSignature, proprietaryMetrics) {
        // High confidence factors
        const factors = [
            proprietaryMetrics.adaptiveRecoveryIndex > 50 ? 0.2 : 0,
            proprietaryMetrics.engagementScore > 60 ? 0.2 : 0,
            proprietaryMetrics.progressVelocity > 40 ? 0.2 : 0,
            userSignature.confidenceLevel * 0.2,
            userMetrics.progressData.weeklyConsistency * 0.2,
        ];
        return Math.min(0.95, factors.reduce((sum, factor) => sum + factor, 0));
    }
    predictFutureAdaptations(userMetrics, userSignature, proprietaryMetrics) {
        const predictions = [];
        // Predict plateau risk
        if (proprietaryMetrics.progressVelocity < 30) {
            predictions.push({
                estimatedTriggerDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
                probability: 0.7,
                triggerConditions: [
                    "Progress velocity remains below 20%",
                    "No strength gains for 2 weeks",
                ],
                recommendationType: "exercise_swap",
                severity: "moderate_adjustment",
                preventionStrategy: "Introduce exercise variation now",
            });
        }
        // Predict motivation drops
        if (proprietaryMetrics.motivationalMomentum < 50) {
            predictions.push({
                estimatedTriggerDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                probability: 0.5,
                triggerConditions: [
                    "Motivation score drops below 4",
                    "Adherence falls below 60%",
                ],
                recommendationType: "exercise_swap",
                severity: "minor_tweak",
                preventionStrategy: "Incorporate variety and achievement opportunities",
            });
        }
        return predictions;
    }
    generateEarlyWarningSignals(userMetrics, proprietaryMetrics) {
        const signals = [];
        // ARI warning
        if (proprietaryMetrics.adaptiveRecoveryIndex < 50) {
            signals.push({
                signal: "Adaptive Recovery Index Decline",
                currentValue: proprietaryMetrics.adaptiveRecoveryIndex,
                warningThreshold: 30,
                criticalThreshold: 15,
                trend: proprietaryMetrics.adaptiveRecoveryIndex < 40
                    ? "approaching"
                    : "stable",
                daysToThreshold: Math.max(1, Math.floor((proprietaryMetrics.adaptiveRecoveryIndex - 30) / 5)),
                suggestedPreventiveAction: "Schedule additional rest days and focus on sleep quality",
            });
        }
        return signals;
    }
    generateContingencyPlans(userMetrics, userSignature) {
        return [
            {
                scenario: "Motivation Crisis (score < 3)",
                triggerConditions: [
                    "Motivation drops below 3",
                    "Missed 3+ workouts in a week",
                ],
                immediateAction: {
                    type: "exercise_swap",
                    priority: "critical",
                    reason: "Emergency motivation intervention",
                    changes: [{ target: "exercise", adjustment: "fun_variety_focus" }],
                    duration: 3,
                    explanation: "Switching to enjoyable exercises to rebuild enthusiasm",
                },
                followUpActions: [],
                successProbability: 0.75,
            },
        ];
    }
    projectOptimalTrajectory(userMetrics, userSignature, proprietaryMetrics) {
        // Project 4 weeks ahead
        const trajectory = [];
        for (let week = 1; week <= 4; week++) {
            trajectory.push({
                week,
                predictedMetrics: {
                    adaptiveRecoveryIndex: Math.min(90, proprietaryMetrics.adaptiveRecoveryIndex + week * 10),
                    engagementScore: Math.min(85, proprietaryMetrics.engagementScore + week * 8),
                    progressVelocity: Math.min(75, proprietaryMetrics.progressVelocity + week * 5),
                },
                confidenceInterval: 0.8 - week * 0.1,
                keyMilestones: week === 2 ? ["Should see improved energy levels"] : [],
            });
        }
        return trajectory;
    }
    assessRisks(userMetrics, userSignature, proprietaryMetrics) {
        return {
            plateauRisk: proprietaryMetrics.progressVelocity < 20 ? 0.6 : 0.2,
            burnoutRisk: proprietaryMetrics.adaptiveRecoveryIndex < 30 ? 0.4 : 0.1,
            injuryRisk: userMetrics.lifestyle.sleepHours < 6 ? 0.3 : 0.1,
            motivationDropRisk: proprietaryMetrics.motivationalMomentum < 30 ? 0.5 : 0.2,
            adherenceRisk: proprietaryMetrics.engagementScore < 40 ? 0.6 : 0.2,
            mitigationStrategies: [
                "Regular check-ins on energy levels",
                "Flexible workout scheduling",
                "Backup exercise options for low-motivation days",
            ],
        };
    }
    async runSingleSimulation(scenario, recommendations) {
        // Simplified simulation logic
        let currentMetrics = { ...scenario.initialState };
        const path = [];
        const eventsOccurred = [];
        // Apply recommendations and simulate effects
        for (const rec of recommendations) {
            path.push(rec);
            // Simulate positive effects of recommendations
            if (rec.type === "recovery") {
                currentMetrics.lifestyle.sleepQuality = Math.min(10, currentMetrics.lifestyle.sleepQuality + 1);
            }
        }
        // Simulate random events
        for (const factor of scenario.stochasticFactors) {
            if (Math.random() < factor.probability) {
                eventsOccurred.push(factor.event);
                // Apply impact (simplified)
                if (factor.impact.lifestyle) {
                    currentMetrics.lifestyle = {
                        ...currentMetrics.lifestyle,
                        ...factor.impact.lifestyle,
                    };
                }
            }
        }
        return {
            path,
            finalMetrics: currentMetrics,
            userSatisfactionScore: 7.5, // Simulated
            adherenceRate: 0.8, // Simulated
            progressScore: 75, // Simulated
            adaptationEfficiency: 0.85, // Simulated
            eventsThatOccurred: eventsOccurred,
            totalCost: recommendations.length * 10, // Complexity score
        };
    }
    calculateSimulationConfidence(outcomes) {
        // Calculate variance in outcomes to determine confidence
        const scores = outcomes.map((o) => o.progressScore);
        const mean = scores.reduce((sum, score) => sum + score, 0) / scores.length;
        const variance = scores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) /
            scores.length;
        // Lower variance = higher confidence
        return Math.max(0.5, Math.min(0.95, 1 - variance / 1000));
    }
    generateSimulationCacheKey(userMetrics, recommendations) {
        const metricsHash = JSON.stringify({
            fatigue: userMetrics.lifestyle.stressLevel,
            engagement: userMetrics.progressData.weeklyConsistency,
        });
        const recHash = recommendations.map((r) => r.type).join("-");
        return `${userMetrics.userId}-${metricsHash}-${recHash}`;
    }
    extractFeaturesForML(userMetrics, proprietaryMetrics) {
        return {
            adaptive_recovery_index: proprietaryMetrics.adaptiveRecoveryIndex,
            engagement_score: proprietaryMetrics.engagementScore,
            progress_velocity: proprietaryMetrics.progressVelocity,
            weekly_consistency: userMetrics.progressData.weeklyConsistency,
            motivation_score: userMetrics.mood.motivation,
            sleep_quality: userMetrics.lifestyle.sleepQuality,
            stress_level: userMetrics.lifestyle.stressLevel,
        };
    }
    applyMlFineTuning(recommendations, mlPrediction) {
        // Apply ML fine-tuning to recommendations
        for (const rec of recommendations) {
            if (rec.type === mlPrediction.recommendationType) {
                for (const [param, adjustment] of Object.entries(mlPrediction.parameterAdjustments)) {
                    if (param === "intensity_change") {
                        const change = rec.changes.find((c) => c.target === "intensity");
                        if (change && typeof change.adjustment === "number") {
                            change.adjustment = adjustment;
                        }
                    }
                    if (param === "duration") {
                        rec.duration = Math.round(adjustment);
                    }
                }
                rec.explanation += ` (ML-optimized: ${mlPrediction.explanation})`;
            }
        }
    }
    async recordAnalysisForLearning(userMetrics, recommendations, explanation, ruleSetVersion) {
        // Record this analysis for future ML training
        if (recommendations.length > 0) {
            const trainingData = {
                userId: userMetrics.userId,
                inputFeatures: this.extractFeaturesForML(userMetrics, this.calculateProprietaryMetrics(userMetrics, this.getUserSignature(userMetrics.userId))),
                targetOutcome: {
                    adherenceChange: 0, // Will be filled when we get actual outcome
                    motivationChange: 0,
                    performanceChange: 0,
                    behaviorChange: "pending",
                    followUpRequired: false,
                    unexpectedEffects: [],
                },
                contextMetadata: {
                    userSegment: "general", // Would be more sophisticated
                    timeOfYear: new Date().toISOString().substring(0, 7),
                    ruleSetVersion,
                },
                validationWeight: explanation.confidence,
            };
            this.mlTrainingData.push(trainingData);
        }
    }
    /**
     * Get comprehensive adaptation insights for a user
     */
    async getComprehensiveInsights(userId) {
        const signature = this.getUserSignature(userId);
        const history = this.adaptationHistory.get(userId) || [];
        const ruleSetVersion = this.getRuleSetVersionForUser(userId);
        const testGroup = this.userTestGroups.get(userId);
        return {
            signature,
            currentMetrics: null, // Would need current UserMetrics to calculate
            adaptationHistory: history.slice(-10),
            preemptivePlan: null, // Would need current UserMetrics to generate
            ruleSetVersion,
            testGroup,
        };
    }
    /**
     * 🚀 ENHANCED: Main adaptation method with rule chaining & contextual layering
     */
    analyze(userMetrics) {
        // Get or create user signature
        const userSignature = this.getUserSignature(userMetrics.userId);
        // Calculate Nate's proprietary metrics
        const proprietaryMetrics = this.calculateProprietaryMetrics(userMetrics, userSignature);
        // Phase 1: Evaluate all rules individually
        const baseRecommendations = [];
        const triggeredRules = [];
        for (const rule of this.rules) {
            const recommendation = rule.evaluate(userMetrics, userSignature, proprietaryMetrics);
            if (recommendation) {
                baseRecommendations.push(recommendation);
                triggeredRules.push(rule);
            }
        }
        // Phase 2: 1️⃣ Rule Chaining & Contextual Layering
        const ruleContext = this.analyzeRuleInteractions(triggeredRules, userMetrics);
        const chainedRecommendations = this.applyRuleChaining(baseRecommendations, ruleContext);
        // Phase 3: Apply user signature learning
        const personalizedRecommendations = this.personalizeWithSignature(chainedRecommendations, userSignature, userMetrics);
        // Phase 4: 3️⃣ Filter based on plan evolution (avoid failed strategies)
        const evolutionFilteredRecommendations = this.filterByPlanEvolution(personalizedRecommendations, userMetrics.userId);
        // Phase 5: 5️⃣ Apply data-driven weights
        const weightedRecommendations = this.applyDataDrivenWeights(evolutionFilteredRecommendations, userMetrics);
        // Update user signature based on current analysis
        this.updateUserSignature(userMetrics.userId, userMetrics, proprietaryMetrics);
        return this.finalizeRecommendations(weightedRecommendations);
    }
    /**
     * 4️⃣ Calculate Nate's Proprietary Metrics
     */
    calculateProprietaryMetrics(userMetrics, userSignature) {
        const { lifestyle, mood, progressData, recentWorkouts } = userMetrics;
        // Adaptive Recovery Index (ARI) - Nate's signature metric
        const ari = this.calculateAdaptiveRecoveryIndex(lifestyle, mood, recentWorkouts);
        // Engagement Score - combines multiple engagement factors
        const engagementScore = this.calculateEngagementScore(progressData, mood, recentWorkouts);
        // Plan Volatility - how much the plan has changed recently
        const planVolatility = this.calculatePlanVolatility(userMetrics.userId);
        // Metabolic Adaptation Score - how well they adapt to changes
        const metabolicAdaptationScore = this.calculateMetabolicAdaptationScore(userMetrics, userSignature);
        // Motivational Momentum - trend in motivation
        const motivationalMomentum = this.calculateMotivationalMomentum(mood, recentWorkouts);
        // Adherence Quality - not just completion, but execution quality
        const adherenceQuality = this.calculateAdherenceQuality(recentWorkouts);
        // Progress Velocity - rate of improvement
        const progressVelocity = this.calculateProgressVelocity(progressData, recentWorkouts);
        // Resilient Index - bounce-back ability
        const resilientIndex = this.calculateResilientIndex(userMetrics, userSignature);
        // Adaptation Efficiency - how well they respond to changes
        const adaptationEfficiency = this.calculateAdaptationEfficiency(userMetrics.userId);
        return {
            adaptiveRecoveryIndex: ari,
            engagementScore,
            planVolatility,
            metabolicAdaptationScore,
            motivationalMomentum,
            adherenceQuality,
            progressVelocity,
            resilientIndex,
            adaptationEfficiency,
        };
    }
    /**
     * 1️⃣ Analyze Rule Interactions for Chaining
     */
    analyzeRuleInteractions(triggeredRules, userMetrics) {
        const ruleNames = triggeredRules.map((rule) => rule.constructor.name);
        const applicableInteractions = this.ruleInteractions.filter((interaction) => interaction.rules.every((ruleName) => ruleNames.includes(ruleName)));
        let compoundPriority = "low";
        const contextualFactors = [];
        let emergentStrategy;
        // Check for critical compound conditions
        if (ruleNames.includes("FatigueRule") && ruleNames.includes("StressRule")) {
            compoundPriority = "critical";
            emergentStrategy = "comprehensive_recovery_protocol";
            contextualFactors.push("high_stress_fatigue_compound");
        }
        if (ruleNames.includes("PlateauRule") &&
            ruleNames.includes("ConsistencyRule")) {
            compoundPriority = "high";
            emergentStrategy = "simplified_progression_plan";
            contextualFactors.push("plateau_consistency_issue");
        }
        if (ruleNames.includes("MotivationRule") &&
            ruleNames.includes("ProgressiveOverloadRule")) {
            emergentStrategy = "gamified_progression_system";
            contextualFactors.push("motivation_progression_synergy");
        }
        return {
            triggeredRules,
            ruleInteractions: applicableInteractions,
            compoundPriority,
            contextualFactors,
            emergentStrategy,
        };
    }
    /**
     * Apply Rule Chaining Logic
     */
    applyRuleChaining(recommendations, context) {
        if (!context.emergentStrategy) {
            return recommendations;
        }
        // Create compound recommendations based on emergent strategies
        switch (context.emergentStrategy) {
            case "comprehensive_recovery_protocol":
                return this.createComprehensiveRecoveryProtocol(recommendations, context);
            case "simplified_progression_plan":
                return this.createSimplifiedProgressionPlan(recommendations, context);
            case "gamified_progression_system":
                return this.createGamifiedProgressionSystem(recommendations, context);
            default:
                return recommendations;
        }
    }
    /**
     * 2️⃣ Get or Create User Signature
     */
    getUserSignature(userId) {
        let signature = this.userSignatures.get(userId);
        if (!signature) {
            signature = this.createDefaultUserSignature(userId);
            this.userSignatures.set(userId, signature);
        }
        return signature;
    }
    /**
     * 3️⃣ Filter Based on Plan Evolution History
     */
    filterByPlanEvolution(recommendations, userId) {
        const history = this.adaptationHistory.get(userId) || [];
        // Get failed strategies from history
        const failedStrategies = history
            .filter((h) => h.effectiveness < 0.3)
            .map((h) => h.recommendation.type);
        // Get recently tried strategies (avoid repeating too soon)
        const recentStrategies = history
            .filter((h) => {
            const daysSince = (Date.now() - h.timestamp.getTime()) / (1000 * 60 * 60 * 24);
            return daysSince < 7;
        })
            .map((h) => h.recommendation.type);
        // Filter out failed and recently tried strategies
        return recommendations.filter((rec) => {
            const isFailed = failedStrategies.includes(rec.type);
            const isRecent = recentStrategies.includes(rec.type);
            // Allow critical recommendations even if recently tried
            if (rec.priority === "critical")
                return !isFailed;
            return !isFailed && !isRecent;
        });
    }
    /**
     * 5️⃣ Apply Data-Driven Weights
     */
    applyDataDrivenWeights(recommendations, userMetrics) {
        return recommendations.map((rec) => {
            const weights = this.ruleWeights.get(rec.type);
            if (!weights)
                return rec;
            // Adjust priority based on historical effectiveness
            const effectivenessRate = this.analytics.ruleEffectivenessRates[rec.type] || 0.5;
            if (effectivenessRate > 0.8 && rec.priority !== "critical") {
                rec.priority = this.upgradePriority(rec.priority);
            }
            else if (effectivenessRate < 0.3 && rec.priority !== "low") {
                rec.priority = this.downgradePriority(rec.priority);
            }
            return rec;
        });
    }
    /**
     * Record Adaptation Outcome for Learning
     */
    async recordAdaptationOutcome(userId, adaptationId, outcome) {
        const history = this.adaptationHistory.get(userId) || [];
        const adaptation = history.find((h) => h.id === adaptationId);
        if (adaptation) {
            adaptation.userResponse = outcome;
            adaptation.effectiveness = this.calculateEffectiveness(outcome);
            // Update analytics
            await this.updateAnalytics(adaptation);
            // Update rule weights based on outcome
            await this.updateRuleWeights(adaptation);
            // Update user signature based on outcome
            await this.updateUserSignatureFromOutcome(userId, adaptation, outcome);
        }
    }
    /**
     * Get User's Adaptation Insights
     */
    getUserAdaptationInsights(userId) {
        const signature = this.getUserSignature(userId);
        const history = this.adaptationHistory.get(userId) || [];
        const recentHistory = history.slice(-10);
        // Predict future needs based on patterns
        const predictedNeeds = this.predictFutureNeeds(signature, history);
        return {
            signature,
            proprietaryMetrics: null, // Would need current user metrics to calculate
            recentHistory,
            predictedNeeds,
        };
    }
    // Private helper methods for calculations...
    calculateAdaptiveRecoveryIndex(lifestyle, mood, recentWorkouts) {
        // Nate's proprietary ARI formula
        const sleepFactor = (lifestyle.sleepHours / 8) * (lifestyle.sleepQuality / 10);
        const stressFactor = (10 - lifestyle.stressLevel) / 10;
        const workloadFactor = (10 - lifestyle.workload) / 10;
        const fatigueResilience = this.calculateFatigueResilience(recentWorkouts);
        return Math.round(((sleepFactor + stressFactor + workloadFactor + fatigueResilience) / 4) *
            100);
    }
    calculateEngagementScore(progressData, mood, recentWorkouts) {
        const consistencyWeight = progressData.weeklyConsistency * 0.4;
        const motivationWeight = (mood.motivation / 10) * 0.3;
        const ratingWeight = (progressData.averageRating / 10) * 0.3;
        return Math.round((consistencyWeight + motivationWeight + ratingWeight) * 100);
    }
    calculatePlanVolatility(userId) {
        const history = this.adaptationHistory.get(userId) || [];
        const last30Days = history.filter((h) => {
            const daysSince = (Date.now() - h.timestamp.getTime()) / (1000 * 60 * 60 * 24);
            return daysSince <= 30;
        });
        return Math.round((last30Days.length / 30) * 100);
    }
    // Additional helper methods would be implemented here...
    calculateMetabolicAdaptationScore(userMetrics, userSignature) {
        // Implementation for metabolic adaptation scoring
        return Math.round(userSignature.adaptationResponsiveness * 100);
    }
    calculateMotivationalMomentum(mood, recentWorkouts) {
        // Implementation for motivational momentum
        const recentRatings = recentWorkouts.slice(-5).map((w) => w.userRating);
        const trend = recentRatings.length > 1
            ? (recentRatings[recentRatings.length - 1] - recentRatings[0]) /
                recentRatings.length
            : 0;
        return Math.round((mood.motivation / 10 + trend / 10) * 50);
    }
    calculateAdherenceQuality(recentWorkouts) {
        if (recentWorkouts.length === 0)
            return 50;
        const qualityFactors = recentWorkouts.map((w) => {
            const completion = w.completionRate;
            const effort = w.reportedFatigue > 0 ? (10 - w.reportedFatigue) / 10 : 0.5;
            const satisfaction = w.userRating / 10;
            return (completion + effort + satisfaction) / 3;
        });
        return Math.round((qualityFactors.reduce((a, b) => a + b, 0) / qualityFactors.length) * 100);
    }
    calculateProgressVelocity(progressData, recentWorkouts) {
        // Implementation for progress velocity
        const strengthProgress = Object.values(progressData.strengthGains).reduce((a, b) => a + b, 0);
        const recentProgress = recentWorkouts.slice(-10).length;
        return Math.round((strengthProgress + recentProgress) * 5);
    }
    calculateResilientIndex(userMetrics, userSignature) {
        // Implementation for resilient index
        const recoveryFactor = userSignature.averageRecoveryTime > 0
            ? 7 / userSignature.averageRecoveryTime
            : 0.5;
        const adaptationFactor = userSignature.adaptationResponsiveness;
        return Math.round((recoveryFactor + adaptationFactor) * 50);
    }
    calculateAdaptationEfficiency(userId) {
        const history = this.adaptationHistory.get(userId) || [];
        if (history.length === 0)
            return 50;
        const effectiveAdaptations = history.filter((h) => h.effectiveness > 0.6).length;
        return Math.round((effectiveAdaptations / history.length) * 100);
    }
    calculateFatigueResilience(recentWorkouts) {
        if (recentWorkouts.length === 0)
            return 0.5;
        const avgFatigue = recentWorkouts.reduce((sum, w) => sum + w.reportedFatigue, 0) /
            recentWorkouts.length;
        const avgCompletion = recentWorkouts.reduce((sum, w) => sum + w.completionRate, 0) /
            recentWorkouts.length;
        // Higher resilience = lower fatigue with high completion
        return avgCompletion * (1 - avgFatigue / 10);
    }
    createDefaultUserSignature(userId) {
        return {
            userId,
            preferredIntensityRange: [5, 8],
            averageRecoveryTime: 2,
            commonFatigueTriggers: [],
            motivationalTriggers: [],
            planCompliancePattern: "unknown",
            adaptationResponsiveness: 0.5,
            preferredWorkoutTypes: [],
            injuryRiskFactors: [],
            plateauBreakers: [],
            lastUpdated: new Date(),
            confidenceLevel: 0.1,
        };
    }
    updateUserSignature(userId, userMetrics, proprietaryMetrics) {
        const signature = this.getUserSignature(userId);
        // Update signature based on current metrics
        signature.lastUpdated = new Date();
        signature.confidenceLevel = Math.min(1.0, signature.confidenceLevel + 0.05);
        // Update adaptation responsiveness based on recent performance
        if (proprietaryMetrics.adaptationEfficiency > 70) {
            signature.adaptationResponsiveness = Math.min(1.0, signature.adaptationResponsiveness + 0.1);
        }
        this.userSignatures.set(userId, signature);
    }
    initializeRuleInteractions() {
        this.ruleInteractions = [
            {
                rules: ["FatigueRule", "StressRule"],
                interactionType: "amplify",
                resultingStrategy: "comprehensive_recovery_protocol",
                priorityModifier: 1.5,
                customLogic: "Both high stress and fatigue require immediate intervention",
            },
            {
                rules: ["PlateauRule", "ConsistencyRule"],
                interactionType: "redirect",
                resultingStrategy: "simplified_progression_plan",
                priorityModifier: 1.2,
                customLogic: "Plateau + low consistency = need simpler approach",
            },
            {
                rules: ["MotivationRule", "ProgressiveOverloadRule"],
                interactionType: "merge",
                resultingStrategy: "gamified_progression_system",
                priorityModifier: 1.1,
                customLogic: "Low motivation + need for progression = gamify",
            },
        ];
    }
    initializeAnalytics() {
        this.analytics = {
            ruleEffectivenessRates: {},
            combinationOutcomes: {},
            contextualSuccessFactors: {},
            commonFailurePatterns: [],
            optimalParameterRanges: {},
            userSegmentPerformance: {},
            temporalPatterns: {},
            lastUpdated: new Date(),
            dataPoints: 0,
        };
    }
    loadRuleWeights() {
        // Initialize with default weights - would be loaded from database in production
        const defaultWeight = {
            ruleName: "",
            baseWeight: 1.0,
            contextualModifiers: {},
            userTypeModifiers: {},
            seasonalModifiers: {},
            learningRate: 0.05,
            lastUpdated: new Date(),
        };
        this.rules.forEach((rule) => {
            this.ruleWeights.set(rule.constructor.name, {
                ...defaultWeight,
                ruleName: rule.constructor.name,
            });
        });
    }
    // Additional helper methods...
    personalizeWithSignature(recommendations, signature, userMetrics) {
        return recommendations; // Implementation would personalize based on signature
    }
    finalizeRecommendations(recommendations) {
        return recommendations.sort((a, b) => {
            const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
            return priorityOrder[b.priority] - priorityOrder[a.priority];
        });
    }
    upgradePriority(priority) {
        const upgrades = {
            low: "medium",
            medium: "high",
            high: "critical",
            critical: "critical",
        };
        return upgrades[priority];
    }
    downgradePriority(priority) {
        const downgrades = {
            critical: "high",
            high: "medium",
            medium: "low",
            low: "low",
        };
        return downgrades[priority];
    }
    createComprehensiveRecoveryProtocol(recommendations, context) {
        // Implementation for comprehensive recovery protocol
        return recommendations;
    }
    createSimplifiedProgressionPlan(recommendations, context) {
        // Implementation for simplified progression plan
        return recommendations;
    }
    createGamifiedProgressionSystem(recommendations, context) {
        // Implementation for gamified progression system
        return recommendations;
    }
    calculateEffectiveness(outcome) {
        // Implementation to calculate effectiveness based on outcome
        return ((outcome.adherenceChange +
            outcome.motivationChange +
            outcome.performanceChange) /
            3);
    }
    async updateAnalytics(adaptation) {
        // Implementation to update analytics based on adaptation outcome
    }
    async updateRuleWeights(adaptation) {
        // Implementation to update rule weights based on outcome
    }
    async updateUserSignatureFromOutcome(userId, adaptation, outcome) {
        // Implementation to update user signature based on outcome
    }
    predictFutureNeeds(signature, history) {
        // Implementation to predict future needs based on patterns
        return [];
    }
    /**
     * Initialize the rule set
     */
    initializeRules() {
        // Fatigue Management Rule
        this.rules.push(new FatigueRule());
        // Consistency Enforcement Rule
        this.rules.push(new ConsistencyRule());
        // Progressive Overload Rule
        this.rules.push(new ProgressiveOverloadRule());
        // Recovery Optimization Rule
        this.rules.push(new RecoveryRule());
        // Motivation Maintenance Rule
        this.rules.push(new MotivationRule());
        // Plateau Breaking Rule
        this.rules.push(new PlateauRule());
        // Stress Adaptation Rule
        this.rules.push(new StressRule());
        // Sleep Quality Rule
        this.rules.push(new SleepRule());
    }
    /**
     * Apply recommendations to update the user's plan (legacy method for compatibility)
     */
    applyRecommendations(currentPlan, recommendations) {
        let updatedPlan = { ...currentPlan };
        for (const rec of recommendations) {
            if (rec.priority === "critical" || rec.priority === "high") {
                updatedPlan = this.applyChanges(updatedPlan, rec.changes);
            }
        }
        return updatedPlan;
    }
    applyChanges(plan, changes) {
        let updatedPlan = { ...plan };
        for (const change of changes) {
            switch (change.target) {
                case "intensity":
                    updatedPlan.intensity = Math.max(1, Math.min(10, updatedPlan.intensity * (1 + change.adjustment / 100)));
                    break;
                case "volume":
                    updatedPlan.volume = Math.max(1, updatedPlan.volume * (1 + change.adjustment / 100));
                    break;
                case "frequency":
                    updatedPlan.frequency = Math.max(1, Math.min(7, updatedPlan.frequency + change.adjustment));
                    break;
                // Add more cases as needed
            }
        }
        return updatedPlan;
    }
}
// Abstract base class for adaptation rules
class AdaptationRule {
}
// Specific rule implementations
class FatigueRule extends AdaptationRule {
    evaluate(userMetrics, userSignature, proprietaryMetrics) {
        const recentFatigue = userMetrics.recentWorkouts
            .slice(-3)
            .reduce((avg, w) => avg + w.reportedFatigue, 0) / 3;
        const averageCompletion = userMetrics.recentWorkouts
            .slice(-5)
            .reduce((avg, w) => avg + w.completionRate, 0) / 5;
        // 🚀 NEW: Use Nate's Adaptive Recovery Index (ARI)
        const lowARI = proprietaryMetrics.adaptiveRecoveryIndex < 30;
        const criticalARI = proprietaryMetrics.adaptiveRecoveryIndex < 15;
        // 🚀 NEW: Use user signature for personalized thresholds
        const fatigueThreshold = userSignature.preferredIntensityRange[1] > 8 ? 9 : 8;
        const userTolerateFatigue = userSignature.commonFatigueTriggers.length < 3;
        if (criticalARI || recentFatigue >= 9 || averageCompletion < 0.5) {
            return {
                type: "recovery",
                priority: "critical",
                reason: `Critical fatigue detected (ARI: ${proprietaryMetrics.adaptiveRecoveryIndex}) - immediate intervention required`,
                changes: [
                    { target: "intensity", adjustment: -40 },
                    { target: "volume", adjustment: -30 },
                    { target: "frequency", adjustment: -1 },
                ],
                duration: userSignature.averageRecoveryTime + 2,
                explanation: `Your Adaptive Recovery Index is critically low at ${proprietaryMetrics.adaptiveRecoveryIndex}%. I'm implementing a comprehensive recovery protocol tailored to your ${userSignature.averageRecoveryTime}-day recovery pattern.`,
            };
        }
        if (lowARI ||
            recentFatigue >= fatigueThreshold ||
            averageCompletion < 0.7) {
            const recoveryAdjustment = userTolerateFatigue ? -15 : -25;
            return {
                type: "intensity",
                priority: "high",
                reason: `Elevated fatigue with ARI at ${proprietaryMetrics.adaptiveRecoveryIndex}% - personalized recovery needed`,
                changes: [
                    { target: "intensity", adjustment: recoveryAdjustment },
                    { target: "volume", adjustment: -15 },
                ],
                duration: userSignature.averageRecoveryTime,
                explanation: `Based on your fatigue tolerance profile, I'm reducing intensity by ${Math.abs(recoveryAdjustment)}% for ${userSignature.averageRecoveryTime} days to restore your recovery capacity.`,
            };
        }
        return null;
    }
}
class ConsistencyRule extends AdaptationRule {
    evaluate(userMetrics, userSignature, proprietaryMetrics) {
        const { weeklyConsistency, streak } = userMetrics.progressData;
        // 🚀 NEW: Use Engagement Score instead of just consistency
        const lowEngagement = proprietaryMetrics.engagementScore < 40;
        const criticalEngagement = proprietaryMetrics.engagementScore < 25;
        // 🚀 NEW: Consider user's compliance pattern
        const hasWeekendDropoff = userSignature.planCompliancePattern.includes("weekends low");
        const preferredWorkouts = userSignature.preferredWorkoutTypes;
        if (criticalEngagement || (weeklyConsistency < 0.3 && streak < 2)) {
            // Use signature to personalize the simplified plan
            const simplifiedType = preferredWorkouts.length > 0 ? preferredWorkouts[0] : "strength";
            return {
                type: "frequency",
                priority: "critical",
                reason: `Critical engagement crisis (Score: ${proprietaryMetrics.engagementScore}) - emergency simplification`,
                changes: [
                    { target: "frequency", adjustment: -2 },
                    { target: "intensity", adjustment: -30 },
                    { target: "exercise", adjustment: `focus_${simplifiedType}` },
                ],
                duration: 14,
                explanation: `Your engagement score has dropped to ${proprietaryMetrics.engagementScore}%. I'm creating an ultra-simple ${simplifiedType}-focused routine to rebuild your momentum over 2 weeks.`,
            };
        }
        if (lowEngagement || (weeklyConsistency < 0.5 && streak < 3)) {
            const adjustments = hasWeekendDropoff
                ? [
                    { target: "frequency", adjustment: -1 },
                    { target: "intensity", adjustment: -20 },
                ]
                : [
                    { target: "frequency", adjustment: -1 },
                    { target: "intensity", adjustment: -10 },
                ];
            return {
                type: "frequency",
                priority: "medium",
                reason: `Low engagement detected (Score: ${proprietaryMetrics.engagementScore}) - rebuilding habits`,
                changes: adjustments,
                duration: hasWeekendDropoff ? 10 : 7,
                explanation: hasWeekendDropoff
                    ? "I've noticed your weekend adherence pattern. Let's focus on weekday consistency first, then gradually add weekend sessions."
                    : `Your engagement score is ${proprietaryMetrics.engagementScore}%. I'm simplifying your routine to rebuild the habit.`,
            };
        }
        return null;
    }
}
class ProgressiveOverloadRule extends AdaptationRule {
    evaluate(userMetrics, userSignature, proprietaryMetrics) {
        const { strengthGains, totalWorkouts } = userMetrics.progressData;
        const hasStagnated = Object.values(strengthGains).every((gain) => gain < 0.02); // Less than 2% gain
        if (totalWorkouts > 12 && hasStagnated) {
            return {
                type: "intensity",
                priority: "medium",
                reason: "Strength plateau detected - need progressive overload",
                changes: [
                    { target: "intensity", adjustment: 10 },
                    { target: "exercise", adjustment: "variation" },
                ],
                duration: 14,
                explanation: "I notice your strength gains have plateaued. I'm increasing intensity and adding exercise variations to stimulate new growth.",
            };
        }
        return null;
    }
}
class RecoveryRule extends AdaptationRule {
    evaluate(userMetrics, userSignature, proprietaryMetrics) {
        const { sleepHours, sleepQuality, stressLevel } = userMetrics.lifestyle;
        if (sleepHours < 6 || sleepQuality < 5 || stressLevel > 7) {
            return {
                type: "recovery",
                priority: "high",
                reason: "Poor recovery indicators detected",
                changes: [
                    { target: "rest", adjustment: "+1 day" },
                    { target: "intensity", adjustment: -15 },
                ],
                duration: 5,
                explanation: "Your sleep and stress levels indicate you need more recovery. I'm adding an extra rest day and reducing intensity.",
            };
        }
        return null;
    }
}
class MotivationRule extends AdaptationRule {
    evaluate(userMetrics, userSignature, proprietaryMetrics) {
        const { motivation, recentTrend } = userMetrics.mood;
        // 🚀 NEW: Use Motivational Momentum proprietary metric
        const lowMomentum = proprietaryMetrics.motivationalMomentum < 30;
        const criticalMomentum = proprietaryMetrics.motivationalMomentum < 15;
        // 🚀 NEW: Leverage user's motivational triggers
        const userTriggers = userSignature.motivationalTriggers;
        const hasVarietyTrigger = userTriggers.includes("variety");
        const hasCompetitionTrigger = userTriggers.includes("competition");
        const hasPBTrigger = userTriggers.includes("PBs");
        if (criticalMomentum || (motivation <= 3 && recentTrend === "declining")) {
            let emergencyStrategy = "basic_motivation_boost";
            let explanation = "Your motivational momentum is critically low. ";
            // Personalize emergency intervention based on user triggers
            if (hasVarietyTrigger) {
                emergencyStrategy = "variety_injection";
                explanation += "I'm adding exercise variety to reignite your interest.";
            }
            else if (hasCompetitionTrigger) {
                emergencyStrategy = "competition_element";
                explanation +=
                    "I'm introducing competitive elements to boost engagement.";
            }
            else if (hasPBTrigger) {
                emergencyStrategy = "personal_record_focus";
                explanation +=
                    "We're going to focus on achieving new personal records.";
            }
            else {
                explanation +=
                    "I'm implementing a comprehensive motivation recovery protocol.";
            }
            return {
                type: "exercise_swap",
                priority: "critical",
                reason: `Critical motivational momentum (${proprietaryMetrics.motivationalMomentum}%) - emergency intervention`,
                changes: [
                    { target: "exercise", adjustment: emergencyStrategy },
                    { target: "intensity", adjustment: -20 },
                ],
                duration: 7,
                explanation: explanation +
                    ` Current momentum: ${proprietaryMetrics.motivationalMomentum}%`,
            };
        }
        if (lowMomentum || motivation <= 5) {
            let strategy = "general_motivation_boost";
            let changes = [
                { target: "exercise", adjustment: "motivation_boost" },
            ];
            // Apply user-specific motivational strategies
            if (hasVarietyTrigger && userSignature.preferredWorkoutTypes.length > 1) {
                strategy = "workout_type_rotation";
                changes = [{ target: "exercise", adjustment: "rotate_workout_types" }];
            }
            else if (hasPBTrigger) {
                strategy = "personal_record_opportunities";
                changes = [
                    { target: "intensity", adjustment: 5 },
                    { target: "exercise", adjustment: "pb_focus" },
                ];
            }
            return {
                type: "exercise_swap",
                priority: "medium",
                reason: `Declining motivational momentum (${proprietaryMetrics.motivationalMomentum}%) - personalized boost needed`,
                changes,
                duration: 5,
                explanation: `Your motivation patterns suggest ${strategy} will help. Current momentum: ${proprietaryMetrics.motivationalMomentum}%`,
            };
        }
        return null;
    }
}
class PlateauRule extends AdaptationRule {
    evaluate(userMetrics, userSignature, proprietaryMetrics) {
        const { strengthGains, averageRating } = userMetrics.progressData;
        // 🚀 NEW: Use Progress Velocity proprietary metric
        const lowProgress = proprietaryMetrics.progressVelocity < 20;
        const stalledProgress = proprietaryMetrics.progressVelocity < 10;
        // 🚀 NEW: Use user's proven plateau breakers
        const plateauBreakers = userSignature.plateauBreakers;
        const hasProvenStrategies = plateauBreakers.length > 0;
        // Check for strength plateau
        const recentGains = Object.values(strengthGains).slice(-4);
        const avgRecentGains = recentGains.length > 0
            ? recentGains.reduce((a, b) => a + b, 0) / recentGains.length
            : 0;
        if (stalledProgress || avgRecentGains < 0.5) {
            let strategy = "intensity_variation";
            let explanation = "I've detected a plateau in your progress velocity. ";
            // Use proven strategies from user's history
            if (hasProvenStrategies) {
                const provenStrategy = plateauBreakers[0]; // Use most successful
                strategy = provenStrategy;
                explanation += `Based on your history, ${provenStrategy} has worked best for breaking your plateaus.`;
            }
            else {
                explanation +=
                    "I'm implementing a multi-faceted plateau breakthrough protocol.";
            }
            return {
                type: "exercise_swap",
                priority: "high",
                reason: `Plateau detected - Progress Velocity at ${proprietaryMetrics.progressVelocity}%`,
                changes: [
                    { target: "exercise", adjustment: strategy },
                    { target: "intensity", adjustment: 15 },
                    { target: "volume", adjustment: 10 },
                ],
                duration: 10,
                explanation: explanation +
                    ` Your progress velocity has dropped to ${proprietaryMetrics.progressVelocity}%.`,
            };
        }
        if (lowProgress || averageRating < 6) {
            const strategy = hasProvenStrategies
                ? plateauBreakers[0]
                : "exercise_variation";
            return {
                type: "exercise_swap",
                priority: "medium",
                reason: `Declining progress velocity (${proprietaryMetrics.progressVelocity}%) - preemptive plateau prevention`,
                changes: [
                    { target: "exercise", adjustment: strategy },
                    { target: "intensity", adjustment: 5 },
                ],
                duration: 7,
                explanation: `Your progress velocity suggests we should proactively prevent a plateau using ${strategy}.`,
            };
        }
        return null;
    }
}
class StressRule extends AdaptationRule {
    evaluate(userMetrics, userSignature, proprietaryMetrics) {
        const { stressLevel, workload } = userMetrics.lifestyle;
        if (stressLevel > 8 || workload > 8) {
            return {
                type: "intensity",
                priority: "critical",
                reason: "High stress levels - prioritizing stress relief",
                changes: [
                    { target: "exercise", adjustment: "stress_relief" },
                    { target: "intensity", adjustment: -25 },
                ],
                duration: 3,
                explanation: "Your stress levels are very high. I'm switching to stress-relieving exercises like yoga and reducing intensity significantly.",
            };
        }
        return null;
    }
}
class SleepRule extends AdaptationRule {
    evaluate(userMetrics, userSignature, proprietaryMetrics) {
        const { sleepHours, sleepQuality } = userMetrics.lifestyle;
        if (sleepHours < 5 || sleepQuality < 3) {
            return {
                type: "rest_day",
                priority: "critical",
                reason: "Severely inadequate sleep - mandatory rest",
                changes: [{ target: "rest", adjustment: "+2 days" }],
                duration: 2,
                explanation: "Your sleep is critically low. I'm prescribing 2 rest days to prioritize recovery. Let's focus on sleep hygiene.",
            };
        }
        return null;
    }
}
// Export validation schemas
export const UserMetricsSchema = z.object({
    userId: z.string(),
    currentPlan: z.object({
        id: z.string(),
        type: z.enum(["strength", "cardio", "hiit", "flexibility", "hybrid"]),
        intensity: z.number().min(1).max(10),
        volume: z.number().min(1),
        frequency: z.number().min(1).max(7),
        duration: z.number().min(15).max(180),
        exercises: z.array(z.any()),
        progressionRate: z.number(),
    }),
    recentWorkouts: z.array(z.any()),
    progressData: z.object({
        streak: z.number(),
        weeklyConsistency: z.number().min(0).max(1),
        monthlyConsistency: z.number().min(0).max(1),
        totalWorkouts: z.number(),
        averageRating: z.number(),
        strengthGains: z.record(z.number()),
        cardioGains: z.record(z.number()),
    }),
    biometrics: z.object({
        weight: z.number().optional(),
        bodyFat: z.number().optional(),
        muscleMass: z.number().optional(),
        restingHeartRate: z.number().optional(),
        bloodPressure: z
            .object({
            systolic: z.number(),
            diastolic: z.number(),
        })
            .optional(),
        measurements: z.record(z.number()).optional(),
        lastUpdated: z.date(),
    }),
    lifestyle: z.object({
        sleepHours: z.number(),
        sleepQuality: z.number().min(1).max(10),
        stressLevel: z.number().min(1).max(10),
        energyLevel: z.number().min(1).max(10),
        workload: z.number().min(1).max(10),
        nutritionCompliance: z.number().min(0).max(1),
        hydration: z.number(),
    }),
    mood: z.object({
        score: z.number().min(1).max(10),
        motivation: z.number().min(1).max(10),
        confidence: z.number().min(1).max(10),
        anxiety: z.number().min(1).max(10),
        recentTrend: z.enum(["improving", "stable", "declining"]),
    }),
});
