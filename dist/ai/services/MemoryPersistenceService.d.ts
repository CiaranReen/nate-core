import { UserMemoryProfile, ReinforcementLearningProfile, PrivacySettings } from "../smart-memory";
import { CacheService } from "./CacheService";
export interface IMemoryPersistenceProvider {
    saveMemoryProfile(profile: UserMemoryProfile): Promise<void>;
    loadMemoryProfile(userId: string): Promise<UserMemoryProfile | null>;
    saveReinforcementProfile(profile: ReinforcementLearningProfile): Promise<void>;
    loadReinforcementProfile(userId: string): Promise<ReinforcementLearningProfile | null>;
    savePrivacySettings(settings: PrivacySettings): Promise<void>;
    loadPrivacySettings(userId: string): Promise<PrivacySettings | null>;
    deleteUserData(userId: string): Promise<void>;
}
export declare class MemoryPersistenceService {
    private persistenceProvider;
    private cacheService;
    constructor(provider: IMemoryPersistenceProvider, cacheService: CacheService);
    saveMemoryProfile(profile: UserMemoryProfile): Promise<void>;
    loadMemoryProfile(userId: string): Promise<UserMemoryProfile | null>;
    saveReinforcementProfile(profile: ReinforcementLearningProfile): Promise<void>;
    loadReinforcementProfile(userId: string): Promise<ReinforcementLearningProfile | null>;
    savePrivacySettings(settings: PrivacySettings): Promise<void>;
    loadPrivacySettings(userId: string): Promise<PrivacySettings | null>;
    deleteUserData(userId: string): Promise<void>;
}
