import { UserMemoryProfile, ReinforcementLearningProfile, PrivacySettings } from "../smart-memory";
export interface CacheConfig {
    url: string;
    token: string;
    ttl?: number;
}
export declare class CacheService {
    private client;
    private defaultTTL;
    constructor(config: CacheConfig);
    get<T>(key: string): Promise<T | null>;
    set<T>(key: string, value: T, expirationInSeconds?: number): Promise<void>;
    delete(key: string): Promise<void>;
    exists(key: string): Promise<boolean>;
    clear(): Promise<void>;
    getMultiple<T>(keys: string[]): Promise<(T | null)[]>;
    setMultiple(entries: {
        key: string;
        value: any;
        ttl?: number;
    }[]): Promise<void>;
    deleteMultiple(keys: string[]): Promise<void>;
    getCachedMemoryProfile(userId: string): Promise<UserMemoryProfile | null>;
    cacheMemoryProfile(userId: string, profile: UserMemoryProfile): Promise<void>;
    invalidateMemoryProfile(userId: string): Promise<void>;
    getCachedReinforcementProfile(userId: string): Promise<ReinforcementLearningProfile | null>;
    cacheReinforcementProfile(userId: string, profile: ReinforcementLearningProfile): Promise<void>;
    invalidateReinforcementProfile(userId: string): Promise<void>;
    getCachedPrivacySettings(userId: string): Promise<PrivacySettings | null>;
    cachePrivacySettings(userId: string, settings: PrivacySettings): Promise<void>;
    invalidatePrivacySettings(userId: string): Promise<void>;
    getCachedCompositeScores(userId: string): Promise<any | null>;
    cacheCompositeScores(userId: string, scores: any): Promise<void>;
    invalidateCompositeScores(userId: string): Promise<void>;
    invalidateAllUserData(userId: string): Promise<void>;
    private getMemoryProfileKey;
    private getReinforcementProfileKey;
    private getPrivacySettingsKey;
    private getCompositeScoresKey;
}
