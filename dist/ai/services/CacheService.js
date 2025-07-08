import { Redis } from "@upstash/redis";
export class CacheService {
    constructor(config) {
        this.client = new Redis({
            url: config.url,
            token: config.token,
        });
        this.defaultTTL = config.ttl || 86400; // Default 24 hour TTL
    }
    async get(key) {
        return this.client.get(key);
    }
    async set(key, value, expirationInSeconds) {
        if (expirationInSeconds) {
            await this.client.setex(key, expirationInSeconds, value);
        }
        else {
            await this.client.set(key, value);
        }
    }
    async delete(key) {
        await this.client.del(key);
    }
    async exists(key) {
        try {
            return (await this.client.exists(key)) === 1;
        }
        catch (error) {
            console.error("Cache exists error:", error);
            return false;
        }
    }
    async clear() {
        try {
            await this.client.flushall();
        }
        catch (error) {
            console.error("Cache clear error:", error);
        }
    }
    async getMultiple(keys) {
        try {
            const values = await this.client.mget(...keys);
            return values.map((value) => value ? JSON.parse(value) : null);
        }
        catch (error) {
            console.error("Cache getMultiple error:", error);
            return keys.map(() => null);
        }
    }
    async setMultiple(entries) {
        try {
            const pipeline = this.client.pipeline();
            entries.forEach(({ key, value, ttl }) => {
                const serialized = JSON.stringify(value);
                pipeline.set(key, serialized, {
                    ex: ttl || this.defaultTTL,
                });
            });
            await pipeline.exec();
        }
        catch (error) {
            console.error("Cache setMultiple error:", error);
        }
    }
    async deleteMultiple(keys) {
        try {
            if (keys.length > 0) {
                await this.client.del(...keys);
            }
        }
        catch (error) {
            console.error("Cache deleteMultiple error:", error);
        }
    }
    // Memory Profile Caching
    async getCachedMemoryProfile(userId) {
        try {
            const key = this.getMemoryProfileKey(userId);
            const cached = await this.client.get(key);
            return cached;
        }
        catch (error) {
            console.error("Cache get error:", error);
            return null;
        }
    }
    async cacheMemoryProfile(userId, profile) {
        try {
            const key = this.getMemoryProfileKey(userId);
            await this.client.set(key, profile, { ex: this.defaultTTL });
        }
        catch (error) {
            console.error("Cache set error:", error);
        }
    }
    async invalidateMemoryProfile(userId) {
        try {
            const key = this.getMemoryProfileKey(userId);
            await this.client.del(key);
        }
        catch (error) {
            console.error("Cache invalidation error:", error);
        }
    }
    // Reinforcement Learning Profile Caching
    async getCachedReinforcementProfile(userId) {
        try {
            const key = this.getReinforcementProfileKey(userId);
            const cached = await this.client.get(key);
            return cached;
        }
        catch (error) {
            console.error("Cache get error:", error);
            return null;
        }
    }
    async cacheReinforcementProfile(userId, profile) {
        try {
            const key = this.getReinforcementProfileKey(userId);
            await this.client.set(key, profile, { ex: this.defaultTTL });
        }
        catch (error) {
            console.error("Cache set error:", error);
        }
    }
    async invalidateReinforcementProfile(userId) {
        try {
            const key = this.getReinforcementProfileKey(userId);
            await this.client.del(key);
        }
        catch (error) {
            console.error("Cache invalidation error:", error);
        }
    }
    // Privacy Settings Caching
    async getCachedPrivacySettings(userId) {
        try {
            const key = this.getPrivacySettingsKey(userId);
            const cached = await this.client.get(key);
            return cached;
        }
        catch (error) {
            console.error("Cache get error:", error);
            return null;
        }
    }
    async cachePrivacySettings(userId, settings) {
        try {
            const key = this.getPrivacySettingsKey(userId);
            await this.client.set(key, settings, { ex: this.defaultTTL });
        }
        catch (error) {
            console.error("Cache set error:", error);
        }
    }
    async invalidatePrivacySettings(userId) {
        try {
            const key = this.getPrivacySettingsKey(userId);
            await this.client.del(key);
        }
        catch (error) {
            console.error("Cache invalidation error:", error);
        }
    }
    // Composite Score Caching
    async getCachedCompositeScores(userId) {
        try {
            const key = this.getCompositeScoresKey(userId);
            const cached = await this.client.get(key);
            return cached;
        }
        catch (error) {
            console.error("Cache get error:", error);
            return null;
        }
    }
    async cacheCompositeScores(userId, scores) {
        try {
            const key = this.getCompositeScoresKey(userId);
            await this.client.set(key, scores, { ex: this.defaultTTL });
        }
        catch (error) {
            console.error("Cache set error:", error);
        }
    }
    async invalidateCompositeScores(userId) {
        try {
            const key = this.getCompositeScoresKey(userId);
            await this.client.del(key);
        }
        catch (error) {
            console.error("Cache invalidation error:", error);
        }
    }
    // Bulk Operations
    async invalidateAllUserData(userId) {
        try {
            const keys = [
                this.getMemoryProfileKey(userId),
                this.getReinforcementProfileKey(userId),
                this.getPrivacySettingsKey(userId),
                this.getCompositeScoresKey(userId),
            ];
            await Promise.all(keys.map((key) => this.client.del(key)));
        }
        catch (error) {
            console.error("Bulk cache invalidation error:", error);
        }
    }
    // Key Generation
    getMemoryProfileKey(userId) {
        return `memory:profile:${userId}`;
    }
    getReinforcementProfileKey(userId) {
        return `memory:reinforcement:${userId}`;
    }
    getPrivacySettingsKey(userId) {
        return `memory:privacy:${userId}`;
    }
    getCompositeScoresKey(userId) {
        return `memory:scores:${userId}`;
    }
}
