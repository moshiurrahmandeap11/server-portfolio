import { Redis } from "ioredis";
import dotenv from "dotenv";
dotenv.config();

const redisUrl = process.env.REDIS_URL;

/** @type {Redis | null} */
let redis = null;

export function getRedisClient() {
  if (redis) return redis;
  if (!redisUrl) {
    console.warn("REDIS_URL not set. Redis caching is disabled.");
    return null;
  }
  try {
    redis = new Redis(redisUrl, {
      maxRetriesPerRequest: 3,
      enableReadyCheck: true,
      lazyConnect: true,
    });
    redis.on("error", (err) => {
      console.error("Redis error:", err.message);
    });
    redis.on("connect", () => {
      console.log("Redis connected successfully");
    });
    return redis;
  } catch (error) {
    console.error("Failed to connect to Redis:", error.message);
    return null;
  }
}

/**
 * @template T
 * @param {string} key
 * @returns {Promise<T | null>}
 */
export async function getCache(key) {
  const client = getRedisClient();
  if (!client) return null;
  try {
    const data = await client.get(key);
    if (!data) return null;
    return JSON.parse(data);
  } catch {
    return null;
  }
}

/**
 * @template T
 * @param {string} key
 * @param {T} value
 * @param {number} [ttlSeconds=300]
 * @returns {Promise<void>}
 */
export async function setCache(key, value, ttlSeconds = 300) {
  const client = getRedisClient();
  if (!client) return;
  try {
    await client.setex(key, ttlSeconds, JSON.stringify(value));
  } catch (error) {
    console.error("Redis setCache error:", error.message);
  }
}

/**
 * @param {string} key
 * @returns {Promise<void>}
 */
export async function deleteCache(key) {
  const client = getRedisClient();
  if (!client) return;
  try {
    await client.del(key);
  } catch (error) {
    console.error("Redis deleteCache error:", error.message);
  }
}

/**
 * @param {string} pattern
 * @returns {Promise<void>}
 */
export async function deleteCachePattern(pattern) {
  const client = getRedisClient();
  if (!client) return;
  try {
    const keys = await client.keys(pattern);
    if (keys.length > 0) {
      await client.del(...keys);
    }
  } catch (error) {
    console.error("Redis deleteCachePattern error:", error.message);
  }
}
