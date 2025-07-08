export class MemoryPersistenceService {
    constructor(provider, cacheService) {
        this.persistenceProvider = provider;
        this.cacheService = cacheService;
    }
    async saveMemoryProfile(profile) {
        try {
            await this.persistenceProvider.saveMemoryProfile(profile);
            await this.cacheService.cacheMemoryProfile(profile.userId, profile);
        }
        catch (error) {
            console.error("Failed to save memory profile:", error);
            throw new Error("Memory profile persistence failed");
        }
    }
    async loadMemoryProfile(userId) {
        try {
            // Try cache first
            const cached = await this.cacheService.getCachedMemoryProfile(userId);
            if (cached) {
                return cached;
            }
            // If not in cache, load from persistence
            const profile = await this.persistenceProvider.loadMemoryProfile(userId);
            if (profile) {
                // Cache for future use
                await this.cacheService.cacheMemoryProfile(userId, profile);
            }
            return profile;
        }
        catch (error) {
            console.error("Failed to load memory profile:", error);
            throw new Error("Memory profile retrieval failed");
        }
    }
    async saveReinforcementProfile(profile) {
        try {
            await this.persistenceProvider.saveReinforcementProfile(profile);
            await this.cacheService.cacheReinforcementProfile(profile.userId, profile);
        }
        catch (error) {
            console.error("Failed to save reinforcement profile:", error);
            throw new Error("Reinforcement profile persistence failed");
        }
    }
    async loadReinforcementProfile(userId) {
        try {
            // Try cache first
            const cached = await this.cacheService.getCachedReinforcementProfile(userId);
            if (cached) {
                return cached;
            }
            // If not in cache, load from persistence
            const profile = await this.persistenceProvider.loadReinforcementProfile(userId);
            if (profile) {
                // Cache for future use
                await this.cacheService.cacheReinforcementProfile(userId, profile);
            }
            return profile;
        }
        catch (error) {
            console.error("Failed to load reinforcement profile:", error);
            throw new Error("Reinforcement profile retrieval failed");
        }
    }
    async savePrivacySettings(settings) {
        try {
            await this.persistenceProvider.savePrivacySettings(settings);
            await this.cacheService.cachePrivacySettings(settings.userId, settings);
        }
        catch (error) {
            console.error("Failed to save privacy settings:", error);
            throw new Error("Privacy settings persistence failed");
        }
    }
    async loadPrivacySettings(userId) {
        try {
            // Try cache first
            const cached = await this.cacheService.getCachedPrivacySettings(userId);
            if (cached) {
                return cached;
            }
            // If not in cache, load from persistence
            const settings = await this.persistenceProvider.loadPrivacySettings(userId);
            if (settings) {
                // Cache for future use
                await this.cacheService.cachePrivacySettings(userId, settings);
            }
            return settings;
        }
        catch (error) {
            console.error("Failed to load privacy settings:", error);
            throw new Error("Privacy settings retrieval failed");
        }
    }
    async deleteUserData(userId) {
        try {
            await this.persistenceProvider.deleteUserData(userId);
            await this.cacheService.invalidateAllUserData(userId);
        }
        catch (error) {
            console.error("Failed to delete user data:", error);
            throw new Error("User data deletion failed");
        }
    }
}
