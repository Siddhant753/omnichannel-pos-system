// import { redis } from "../config/redisConfig.js";

// export const setCache = async (key: string, value: any, ttlSeconds?: number) => {
//     const data = JSON.stringify(value);

//     if (ttlSeconds) {
//         await redis.set(key, data, "EX", ttlSeconds);
//     } else {
//         await redis.set(key, data);
//     }
//     console.log(`Set ${key} in redis`);
// }

// export const getCache = async <T>(key: string): Promise<T | null> => {
//     const data = await redis.get(key);
//     if (!data) return null;

//     return JSON.parse(data) as T;
// };

// export const deleteCache = async (key: string) => {
//     await redis.del(key);
// }

// export const deleteCacheByPattern = async (pattern: string) => {
//     const keys = await redis.keys(pattern);
//     if (keys.length > 0) {
//         await redis.del(...keys);
//     }
// }