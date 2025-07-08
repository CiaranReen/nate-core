import { Redis } from "@upstash/redis";
import {
  UserMemoryProfile,
  ReinforcementLearningProfile,
  PrivacySettings,
} from "../smart-memory";

export interface CacheConfig {
  url: string;
  token: string;
  ttl?: number; // Time to live in seconds
}

export class CacheService {
  private client: Redis;
  private defaultTTL: number;

  constructor(config: CacheConfig) {
    this.client = new Redis({
      url: config.url,
      token: config.token,
    });
    this.defaultTTL = config.ttl || 86400; // Default 24 hour TTL
  }

  async get<T>(key: string): Promise<T | null> {
    return this.client.get(key);
  }

  async set<T>(
    key: string,
    value: T,
    expirationInSeconds?: number
  ): Promise<void> {
    if (expirationInSeconds) {
      await this.client.setex(key, expirationInSeconds, value);
    } else {
      await this.client.set(key, value);
    }
  }

  async delete(key: string): Promise<void> {
    await this.client.del(key);
  }

  async exists(key: string): Promise<boolean> {
    try {
      return (await this.client.exists(key)) === 1;
    } catch (error) {
      console.error("Cache exists error:", error);
      return false;
    }
  }

  async clear(): Promise<void> {
    try {
      await this.client.flushall();
    } catch (error) {
      console.error("Cache clear error:", error);
    }
  }

  async getMultiple<T>(keys: string[]): Promise<(T | null)[]> {
    try {
      const values = await this.client.mget(...keys);
      return values.map((value) =>
        value ? (JSON.parse(value as string) as T) : null
      );
    } catch (error) {
      console.error("Cache getMultiple error:", error);
      return keys.map(() => null);
    }
  }

  async setMultiple(
    entries: { key: string; value: any; ttl?: number }[]
  ): Promise<void> {
    try {
      const pipeline = this.client.pipeline();
      entries.forEach(({ key, value, ttl }) => {
        const serialized = JSON.stringify(value);
        pipeline.set(key, serialized, {
          ex: ttl || this.defaultTTL,
        });
      });
      await pipeline.exec();
    } catch (error) {
      console.error("Cache setMultiple error:", error);
    }
  }

  async deleteMultiple(keys: string[]): Promise<void> {
    try {
      if (keys.length > 0) {
        await this.client.del(...keys);
      }
    } catch (error) {
      console.error("Cache deleteMultiple error:", error);
    }
  }

  // Memory Profile Caching
  async getCachedMemoryProfile(
    userId: string
  ): Promise<UserMemoryProfile | null> {
    try {
      const key = this.getMemoryProfileKey(userId);
      const cached = await this.client.get<UserMemoryProfile>(key);
      return cached;
    } catch (error) {
      console.error("Cache get error:", error);
      return null;
    }
  }

  async cacheMemoryProfile(
    userId: string,
    profile: UserMemoryProfile
  ): Promise<void> {
    try {
      const key = this.getMemoryProfileKey(userId);
      await this.client.set(key, profile, { ex: this.defaultTTL });
    } catch (error) {
      console.error("Cache set error:", error);
    }
  }

  async invalidateMemoryProfile(userId: string): Promise<void> {
    try {
      const key = this.getMemoryProfileKey(userId);
      await this.client.del(key);
    } catch (error) {
      console.error("Cache invalidation error:", error);
    }
  }

  // Reinforcement Learning Profile Caching
  async getCachedReinforcementProfile(
    userId: string
  ): Promise<ReinforcementLearningProfile | null> {
    try {
      const key = this.getReinforcementProfileKey(userId);
      const cached = await this.client.get<ReinforcementLearningProfile>(key);
      return cached;
    } catch (error) {
      console.error("Cache get error:", error);
      return null;
    }
  }

  async cacheReinforcementProfile(
    userId: string,
    profile: ReinforcementLearningProfile
  ): Promise<void> {
    try {
      const key = this.getReinforcementProfileKey(userId);
      await this.client.set(key, profile, { ex: this.defaultTTL });
    } catch (error) {
      console.error("Cache set error:", error);
    }
  }

  async invalidateReinforcementProfile(userId: string): Promise<void> {
    try {
      const key = this.getReinforcementProfileKey(userId);
      await this.client.del(key);
    } catch (error) {
      console.error("Cache invalidation error:", error);
    }
  }

  // Privacy Settings Caching
  async getCachedPrivacySettings(
    userId: string
  ): Promise<PrivacySettings | null> {
    try {
      const key = this.getPrivacySettingsKey(userId);
      const cached = await this.client.get<PrivacySettings>(key);
      return cached;
    } catch (error) {
      console.error("Cache get error:", error);
      return null;
    }
  }

  async cachePrivacySettings(
    userId: string,
    settings: PrivacySettings
  ): Promise<void> {
    try {
      const key = this.getPrivacySettingsKey(userId);
      await this.client.set(key, settings, { ex: this.defaultTTL });
    } catch (error) {
      console.error("Cache set error:", error);
    }
  }

  async invalidatePrivacySettings(userId: string): Promise<void> {
    try {
      const key = this.getPrivacySettingsKey(userId);
      await this.client.del(key);
    } catch (error) {
      console.error("Cache invalidation error:", error);
    }
  }

  // Composite Score Caching
  async getCachedCompositeScores(userId: string): Promise<any | null> {
    try {
      const key = this.getCompositeScoresKey(userId);
      const cached = await this.client.get(key);
      return cached;
    } catch (error) {
      console.error("Cache get error:", error);
      return null;
    }
  }

  async cacheCompositeScores(userId: string, scores: any): Promise<void> {
    try {
      const key = this.getCompositeScoresKey(userId);
      await this.client.set(key, scores, { ex: this.defaultTTL });
    } catch (error) {
      console.error("Cache set error:", error);
    }
  }

  async invalidateCompositeScores(userId: string): Promise<void> {
    try {
      const key = this.getCompositeScoresKey(userId);
      await this.client.del(key);
    } catch (error) {
      console.error("Cache invalidation error:", error);
    }
  }

  // Bulk Operations
  async invalidateAllUserData(userId: string): Promise<void> {
    try {
      const keys = [
        this.getMemoryProfileKey(userId),
        this.getReinforcementProfileKey(userId),
        this.getPrivacySettingsKey(userId),
        this.getCompositeScoresKey(userId),
      ];
      await Promise.all(keys.map((key) => this.client.del(key)));
    } catch (error) {
      console.error("Bulk cache invalidation error:", error);
    }
  }

  // Key Generation
  private getMemoryProfileKey(userId: string): string {
    return `memory:profile:${userId}`;
  }

  private getReinforcementProfileKey(userId: string): string {
    return `memory:reinforcement:${userId}`;
  }

  private getPrivacySettingsKey(userId: string): string {
    return `memory:privacy:${userId}`;
  }

  private getCompositeScoresKey(userId: string): string {
    return `memory:scores:${userId}`;
  }
}
