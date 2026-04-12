import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from '@/lib/i18n'

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {

  const { lang } = params;

  return {

    title: 'Moltbot API Rate Limiting Advanced: Redis, Sliding Window, DDoS Protection 2024',

    description: 'Advanced Rate Limiting für Moltbot. Redis-basiertes Rate Limiting, Sliding Window Algorithmus, DDoS Protection und API Abuse Prevention.',

    keywords: ['moltbot rate limiting','api rate limiting','redis rate limiting','sliding window','ddos protection','api abuse prevention'],

    authors: [{ name: 'ClawGuru Security Team' }],

    openGraph: {
      images: ["/og-image.png"], title: 'Moltbot API Rate Limiting Advanced 2024', description: 'Advanced Rate Limiting für Moltbot.', type: 'article', url: `https://clawguru.org/${lang}/moltbot/api-rate-limiting-advanced` },

    alternates: buildLocalizedAlternates(lang as Locale, '/moltbot/api-rate-limiting-advanced'),

    robots: 'index, follow',

  };

}

export default function MoltbotRateLimitPage({ params }: { params: { lang: string } }) {

  const { lang } = params;

  if (!SUPPORTED_LOCALES.includes(lang as Locale)) notFound();

  return (

    <div className="container mx-auto px-4 py-8">

      <div className="max-w-4xl mx-auto">

        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">

          <strong className="text-amber-100">"Not a Pentest" Trust-Anker</strong>: Rate Limiting schützt eigene APIs vor Überlastung. Keine Angriffswerkzeuge.

        </div>

        <h1 className="text-4xl font-bold mb-4 text-gray-100">Moltbot API Rate Limiting Advanced</h1>

        <p className="text-lg text-gray-300 mb-8">Ohne Rate Limiting sind APIs anfällig für DDoS und Abuse. Redis-basierte Sliding Window Algorithmen sind heute State-of-the-Art.</p>

        <section className="mb-10">

          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Rate Limiting Strategien</h2>

          <div className="overflow-x-auto">

            <table className="w-full border-collapse text-sm">

              <thead><tr className="bg-gray-800 text-white"><th className="p-3 text-left">Strategie</th><th className="p-3 text-left">Use Case</th><th className="p-3 text-left">Speicher</th><th className="p-3 text-left">Genauigkeit</th></tr></thead>

              <tbody>

                {[

                  ['Fixed Window', 'Einfach, schnell', 'Minimal', 'Niedrig'],

                  ['Sliding Window', 'Präzise, fair', 'Mittel', 'Hoch'],

                  ['Token Bucket', 'Burst-fähig', 'Mittel', 'Mittel'],

                  ['Distributed Sliding Window', 'Multi-Server', 'Redis', 'Hoch'],

                ].map(([strategy, use, storage, accuracy]) => (

                  <tr key={strategy} className="border-b hover:bg-gray-800">

                    <td className="p-3 font-medium">{strategy}</td>

                    <td className="p-3 text-sm">{use}</td>

                    <td className="p-3 text-sm">{storage}</td>

                    <td className="p-3 text-sm">{accuracy}</td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </section>

        <section className="mb-10">

          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Redis Sliding Window Implementation</h2>

          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">

            <pre>{`// Redis Sliding Window Rate Limiter für Moltbot

const Redis = require('ioredis');

const redis = new Redis(process.env.REDIS_URL);

class SlidingWindowRateLimiter {

  constructor(options = {}) {

    this.windowSize = options.windowSize || 60000; // 1 minute

    this.maxRequests = options.maxRequests || 100;

    this.keyPrefix = options.keyPrefix || 'rate_limit:';

  }

  

  async isAllowed(key, identifier) {

    const now = Date.now();

    const windowStart = now - this.windowSize;

    const redisKey = this.keyPrefix + key + ':' + identifier;

    

    // Remove old entries outside window

    await redis.zremrangebyscore(redisKey, 0, windowStart);

    

    // Count current requests

    const currentRequests = await redis.zcard(redisKey);

    

    if (currentRequests >= this.maxRequests) {

      return {

        allowed: false,

        remaining: 0,

        resetTime: now + this.windowSize,

        totalRequests: currentRequests

      };

    }

    

    // Add current request

    await redis.zadd(redisKey, now, now);

    await redis.expire(redisKey, Math.ceil(this.windowSize / 1000));

    

    return {

      allowed: true,

      remaining: this.maxRequests - currentRequests - 1,

      resetTime: now + this.windowSize,

      totalRequests: currentRequests + 1

    };

  }

  

  // Middleware für Express/Next.js

  middleware(options = {}) {

    const limiter = new SlidingWindowRateLimiter(options);

    

    return async (req, res, next) => {

      const key = options.key || 'api';

      const identifier = this.getIdentifier(req);

      

      const result = await limiter.isAllowed(key, identifier);

      

      // Rate Limit Headers

      res.set({

        'X-RateLimit-Limit': limiter.maxRequests,

        'X-RateLimit-Remaining': result.remaining,

        'X-RateLimit-Reset': Math.ceil(result.resetTime / 1000)

      });

      

      if (!result.allowed) {

        return res.status(429).json({

          error: 'Too Many Requests',

          retryAfter: Math.ceil((result.resetTime - Date.now()) / 1000)

        });

      }

      

      next();

    };

  }

  

  getIdentifier(req) {

    // IP-based + User-based identification

    const ip = req.ip || req.connection.remoteAddress;

    const userId = req.user?.id;

    

    return userId ? 'user:' + userId : 'ip:' + ip;

  }

}

// Beispiel: API Endpoints

const rateLimiter = new SlidingWindowRateLimiter({

  windowSize: 60000, // 1 minute

  maxRequests: 100,

  keyPrefix: 'moltbot:'

});

// Auth Endpoints - stricter

app.use('/api/auth', rateLimiter.middleware({

  windowSize: 60000,

  maxRequests: 5,

  key: 'auth'

}));

// General API

app.use('/api', rateLimiter.middleware({

  windowSize: 60000,

  maxRequests: 100,

  key: 'general'

}));`}</pre>

          </div>

        </section>

        <section className="mb-10">

          <h2 className="text-2xl font-semibold mb-4 text-gray-100">DDoS Protection Layer</h2>

          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">

            <pre>{`// DDoS Protection für Moltbot

class DDoSProtection {

  constructor(redisClient) {

    this.redis = redisClient;

    this.thresholds = {

      ip: { requests: 1000, window: 60000 }, // 1000 req/min per IP

      global: { requests: 10000, window: 60000 }, // 10k req/min global

      endpoint: { requests: 500, window: 60000 } // 500 req/min per endpoint

    };

  }

  

  async checkRequest(req) {

    const ip = req.ip || req.connection.remoteAddress;

    const endpoint = req.path;

    const now = Date.now();

    

    // Check IP-based rate limit

    const ipKey = 'ddos:ip:' + ip;

    const ipCount = await this.redis.incr(ipKey);

    if (ipCount === 1) await this.redis.expire(ipKey, 60);

    

    if (ipCount > this.thresholds.ip.requests) {

      await this.blockIP(ip, 3600); // Block for 1 hour

      return { blocked: true, reason: 'IP rate limit exceeded' };

    }

    

    // Check global rate limit

    const globalKey = 'ddos:global';

    const globalCount = await this.redis.incr(globalKey);

    if (globalCount === 1) await this.redis.expire(globalKey, 60);

    

    if (globalCount > this.thresholds.global.requests) {

      return { blocked: true, reason: 'Global rate limit exceeded' };

    }

    

    // Check endpoint-specific rate limit

    const endpointKey = 'ddos:endpoint:' + endpoint;

    const endpointCount = await this.redis.incr(endpointKey);

    if (endpointCount === 1) await this.redis.expire(endpointKey, 60);

    

    if (endpointCount > this.thresholds.endpoint.requests) {

      return { blocked: true, reason: 'Endpoint rate limit exceeded' };

    }

    

    return { blocked: false };

  }

  

  async blockIP(ip, duration) {

    const blockKey = 'blocked:ip:' + ip;

    await this.redis.setex(blockKey, duration, '1');

    

    // Log the block

    await this.redis.lpush('ddos:blocks', JSON.stringify({

      ip,

      timestamp: Date.now(),

      duration,

      reason: 'Rate limit exceeded'

    }));

  }

  

  async isIPBlocked(ip) {

    const blockKey = 'blocked:ip:' + ip;

    return await this.redis.exists(blockKey);

  }

}

// Middleware Integration

const ddosProtection = new DDoSProtection(redis);

app.use(async (req, res, next) => {

  // Check if IP is already blocked

  if (await ddosProtection.isIPBlocked(req.ip)) {

    return res.status(403).json({ error: 'IP blocked' });

  }

  

  // Check current request

  const result = await ddosProtection.checkRequest(req);

  if (result.blocked) {

    return res.status(429).json({ 

      error: 'Rate limit exceeded',

      reason: result.reason 

    });

  }

  

  next();

});`}</pre>

          </div>

        </section>

        <section className="mb-10">

          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Resources</h2>

          <ul>

            <li><a href="https://redis.io/docs/manual/redis-py/" target="_blank">Redis Documentation</a></li>

    <li><a href="https://www.npmjs.com/package/ioredis" target="_blank">ioredis npm package</a></li>

    <li><a href="https://expressjs.com/en/guide/routing.html" target="_blank">Express.js Routing Guide</a></li>

    <li><a href="https://nextjs.org/docs/routing/dynamic-routes" target="_blank">Next.js Dynamic Routing</a></li>

  </ul>

</section>

</div>

</div>

);

}