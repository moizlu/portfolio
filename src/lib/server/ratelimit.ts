import { Redis } from '@upstash/redis/cloudflare';
import { Ratelimit } from '@upstash/ratelimit';
// import { env } from '$env/dynamic/private';

const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export const emailLimit = new Ratelimit({
    redis: redis,
    limiter: Ratelimit.slidingWindow(3, '1 h'),
    analytics: true
});

export const ipLimit = new Ratelimit({
    redis: redis,
    limiter: Ratelimit.slidingWindow(10, '20 m'),
    analytics: true
});

export const globalLimit = new Ratelimit({
    redis: redis,
    limiter: Ratelimit.slidingWindow(30, '1 d'),
    analytics: true
});
