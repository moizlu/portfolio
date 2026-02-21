import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';
import { UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN } from '$env/static/private';

const redis = new Redis({
    url: UPSTASH_REDIS_REST_URL,
    token: UPSTASH_REDIS_REST_TOKEN,
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
