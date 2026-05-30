import { Redis } from '@upstash/redis/cloudflare';
import { Ratelimit } from '@upstash/ratelimit';
import { env } from '$env/dynamic/private';

const getRedis = () => {
    return new Redis({
        url: env.UPSTASH_REDIS_REST_URL,
        token: env.UPSTASH_REDIS_REST_TOKEN,
    });
}

export const checkLimits = async (identifiers: {
    email: string,
    ip: string,
}) => {
    const redis = getRedis();

    const email = new Ratelimit({
        redis: redis,
        limiter: Ratelimit.slidingWindow(3, '1 h'),
        analytics: true
    });
    const ip = new Ratelimit({
        redis: redis,
        limiter: Ratelimit.slidingWindow(10, '20 m'),
        analytics: true
    });
    const global = new Ratelimit({
        redis: redis,
        limiter: Ratelimit.slidingWindow(30, '1 d'),
        analytics: true
    });

    const [emailResult, ipResult, globalResult] = await Promise.all([
        email.limit(identifiers.email),
        ip.limit(identifiers.ip),
        global.limit("ratelimit:portfolio_form_global")
    ]);

    return {
        email: emailResult,
        ip: ipResult,
        global: globalResult
    }
}

export const checkLimit = async (type: 'email' | 'ip' | 'global', identifier: string) => {
    const redis = getRedis();

    const limiters = {
        email: new Ratelimit({
            redis: redis,
            limiter: Ratelimit.slidingWindow(3, '1 h'),
            analytics: true
        }),
        ip: new Ratelimit({
            redis: redis,
            limiter: Ratelimit.slidingWindow(10, '20 m'),
            analytics: true
        }),
        global: new Ratelimit({
            redis: redis,
            limiter: Ratelimit.slidingWindow(30, '1 d'),
            analytics: true
        })
    }

    return await limiters[type].limit(identifier);
};
