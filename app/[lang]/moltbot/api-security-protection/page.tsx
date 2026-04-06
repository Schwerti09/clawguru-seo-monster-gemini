---
title: "Moltbot API Security: REST Endpoints Protection"
description: "API Security Best Practices und Endpoint Hardening für Moltbot REST APIs. Complete API Protection mit Authentication, Rate Limiting und Input Validation."
keywords: ["moltbot api security", "rest endpoint protection", "api hardening", "rate limiting", "input validation", "api authentication"]
author: "ClawGuru Security Team"
published: "2024-04-06"
modified: "2024-04-06"
category: "Security"
subcategory: "Moltbot"
language: "de"
locale: "de_DE"
canonical: "https://clawguru.org/de/moltbot/api-security-protection"
alternates:
  de: "https://clawguru.org/de/moltbot/api-security-protection"
  en: "https://clawguru.org/en/moltbot/api-security-protection"
  es: "https://clawguru.org/es/moltbot/api-security-protection"
  fr: "https://clawguru.org/fr/moltbot/api-security-protection"
  pt: "https://clawguru.org/pt/moltbot/api-security-protection"
  it: "https://clawguru.org/it/moltbot/api-security-protection"
  ru: "https://clawguru.org/ru/moltbot/api-security-protection"
  zh: "https://clawguru.org/zh/moltbot/api-security-protection"
  ja: "https://clawguru.org/ja/moltbot/api-security-protection"
  ko: "https://clawguru.org/ko/moltbot/api-security-protection"
  ar: "https://clawguru.org/ar/moltbot/api-security-protection"
  hi: "https://clawguru.org/hi/moltbot/api-security-protection"
  tr: "https://clawguru.org/tr/moltbot/api-security-protection"
  pl: "https://clawguru.org/pl/moltbot/api-security-protection"
  nl: "https://clawguru.org/nl/moltbot/api-security-protection"
robots: "index, follow"
image: "/og-moltbot-api-security.jpg"
type: "article"
readingTime: 16
difficulty: "Advanced"
prerequisites: ["Moltbot Security Framework", "REST API Design", "Authentication Systems"]
tags: ["moltbot", "api security", "rest", "endpoint protection", "authentication", "2024"]
---

# Moltbot API Security: REST Endpoints Protection

> **"Not a Pentest" Trust-Anker**: Dieser Guide dient ausschließlich zur Absicherung von REST APIs. Keine Angriffswerkzeuge, keine illegalen Aktivitäten.

## 🎯 Executive Summary

Die **Moltbot API Security** stellt einen umfassenden Ansatz für die Absicherung von REST Endpoints dar. In einer Zeit, in der APIs die primäre Angriffsfläche für moderne Anwendungen sind, ist robuste API Security überlebenswichtig.

**Kernprinzipien:**
- **Defense in Depth** - Mehrschichtige Sicherheitskontrollen
- **Zero Trust** - Jede Anfrage muss verifiziert werden
- **Principle of Least Privilege** - Minimale Rechte vergeben
- **Secure by Default** - Security als Standardkonfiguration

---

## 🏗️ API Security Architecture

### **Security Layer Overview**
```mermaid
graph TB
    A[Client Request] --> B[API Gateway]
    B --> C[Authentication Layer]
    C --> D[Authorization Layer]
    D --> E[Rate Limiting Layer]
    E --> F[Input Validation Layer]
    F --> G[Business Logic]
    G --> H[Response Security]
    H --> I[Client Response]
    
    C --> J[JWT Validation]
    C --> K[OAuth2 Verification]
    C --> L[API Key Check]
    
    D --> M[RBAC Check]
    D --> N[Permission Validation]
    D --> O[Resource Access Control]
    
    E --> P[Rate Limiting]
    E --> Q[DDoS Protection]
    E --> R[Burst Control]
    
    F --> S[Schema Validation]
    F --> T[Input Sanitization]
    F --> U[XSS Protection]
```

---

## 🔐 Authentication & Authorization

### **Multi-Factor Authentication Implementation**
```typescript
// API Authentication Middleware
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import { body, validationResult } from 'express-validator';

interface APIAuthConfig {
  jwt: {
    secret: string;
    algorithm: string;
    expiresIn: string;
    issuer: string;
    audience: string;
  };
  oauth2: {
    enabled: boolean;
    provider: string;
    clientId: string;
    clientSecret: string;
  };
  apiKey: {
    enabled: boolean;
    headerName: string;
    queryParam: string;
  };
}

class APIAuthentication {
  private config: APIAuthConfig;
  
  constructor(config: APIAuthConfig) {
    this.config = config;
  }
  
  // JWT Authentication
  authenticateJWT = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = this.extractToken(req);
      
      if (!token) {
        return res.status(401).json({
          error: 'Authentication required',
          message: 'No token provided'
        });
      }
      
      const decoded = jwt.verify(token, this.config.jwt.secret, {
        algorithms: [this.config.jwt.algorithm],
        issuer: this.config.jwt.issuer,
        audience: this.config.jwt.audience
      });
      
      req.user = decoded;
      req.token = token;
      
      // Check token blacklist
      const isBlacklisted = await this.isTokenBlacklisted(token);
      if (isBlacklisted) {
        return res.status(401).json({
          error: 'Token revoked',
          message: 'Authentication token has been revoked'
        });
      }
      
      next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          error: 'Token expired',
          message: 'Authentication token has expired'
        });
      }
      
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({
          error: 'Invalid token',
          message: 'Authentication token is invalid'
        });
      }
      
      return res.status(500).json({
        error: 'Authentication error',
        message: 'Internal server error during authentication'
      });
    }
  };
  
  // API Key Authentication
  authenticateAPIKey = async (req: Request, res: Response, next: NextFunction) => {
    if (!this.config.apiKey.enabled) {
      return next();
    }
    
    const apiKey = this.extractAPIKey(req);
    
    if (!apiKey) {
      return res.status(401).json({
        error: 'API key required',
        message: 'No API key provided'
      });
    }
    
    try {
      const keyInfo = await this.validateAPIKey(apiKey);
      
      if (!keyInfo) {
        return res.status(401).json({
          error: 'Invalid API key',
          message: 'API key is invalid or expired'
        });
      }
      
      req.apiKey = keyInfo;
      next();
    } catch (error) {
      return res.status(500).json({
        error: 'API key validation error',
        message: 'Internal server error during API key validation'
      });
    }
  };
  
  // OAuth2 Authentication
  authenticateOAuth2 = async (req: Request, res: Response, next: NextFunction) => {
    if (!this.config.oauth2.enabled) {
      return next();
    }
    
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'OAuth2 token required',
        message: 'No OAuth2 token provided'
      });
    }
    
    const token = authHeader.substring(7);
    
    try {
      const userInfo = await this.validateOAuth2Token(token);
      
      if (!userInfo) {
        return res.status(401).json({
          error: 'Invalid OAuth2 token',
          message: 'OAuth2 token is invalid or expired'
        });
      }
      
      req.oauth2User = userInfo;
      next();
    } catch (error) {
      return res.status(500).json({
        error: 'OAuth2 validation error',
        message: 'Internal server error during OAuth2 validation'
      });
    }
  };
  
  private extractToken(req: Request): string | null {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }
    
    return req.cookies?.jwt || null;
  }
  
  private extractAPIKey(req: Request): string | null {
    // Try header first
    const headerKey = req.headers[this.config.apiKey.headerName.toLowerCase()];
    if (headerKey && typeof headerKey === 'string') {
      return headerKey;
    }
    
    // Try query parameter
    const queryKey = req.query[this.config.apiKey.queryParam];
    if (queryKey && typeof queryKey === 'string') {
      return queryKey;
    }
    
    return null;
  }
}
```

### **Role-Based Access Control (RBAC)**
```typescript
// RBAC Implementation
interface Permission {
  resource: string;
  action: string;
  conditions?: Record<string, any>;
}

interface Role {
  name: string;
  permissions: Permission[];
  inherits?: string[];
}

class RBACAuthorization {
  private roles: Map<string, Role> = new Map();
  private userRoles: Map<string, string[]> = new Map();
  
  constructor() {
    this.loadRoles();
    this.loadUserRoles();
  }
  
  // Authorization Middleware
  authorize = (requiredPermissions: Permission[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const user = req.user || req.oauth2User;
        
        if (!user) {
          return res.status(401).json({
            error: 'Authentication required',
            message: 'User not authenticated'
          });
        }
        
        const userPermissions = await this.getUserPermissions(user.id);
        
        const hasPermission = requiredPermissions.every(required => 
          this.checkPermission(userPermissions, required)
        );
        
        if (!hasPermission) {
          return res.status(403).json({
            error: 'Insufficient permissions',
            message: 'User does not have required permissions',
            required: requiredPermissions
          });
        }
        
        req.userPermissions = userPermissions;
        next();
      } catch (error) {
        return res.status(500).json({
          error: 'Authorization error',
          message: 'Internal server error during authorization'
        });
      }
    };
  };
  
  private async getUserPermissions(userId: string): Promise<Permission[]> {
    const userRoleNames = this.userRoles.get(userId) || [];
    const allPermissions: Permission[] = [];
    
    for (const roleName of userRoleNames) {
      const role = this.roles.get(roleName);
      if (role) {
        // Add role permissions
        allPermissions.push(...role.permissions);
        
        // Add inherited permissions
        if (role.inherits) {
          for (const inheritedRoleName of role.inherits) {
            const inheritedRole = this.roles.get(inheritedRoleName);
            if (inheritedRole) {
              allPermissions.push(...inheritedRole.permissions);
            }
          }
        }
      }
    }
    
    return allPermissions;
  }
  
  private checkPermission(userPermissions: Permission[], required: Permission): boolean {
    return userPermissions.some(permission => {
      // Check resource match
      if (permission.resource !== required.resource) {
        return false;
      }
      
      // Check action match
      if (permission.action !== required.action) {
        return false;
      }
      
      // Check conditions if any
      if (required.conditions && permission.conditions) {
        return this.checkConditions(required.conditions, permission.conditions);
      }
      
      return true;
    });
  }
  
  private checkConditions(required: Record<string, any>, user: Record<string, any>): boolean {
    for (const [key, value] of Object.entries(required)) {
      if (user[key] !== value) {
        return false;
      }
    }
    return true;
  }
}

// Usage Example
const rbac = new RBACAuthorization();

// Protect endpoint with specific permissions
app.get('/api/users', 
  authenticateJWT,
  rbac.authorize([
    { resource: 'users', action: 'read' }
  ]),
  getUsersController
);

app.post('/api/users',
  authenticateJWT,
  rbac.authorize([
    { resource: 'users', action: 'create' }
  ]),
  createUserController
);
```

---

## 🚦 Rate Limiting & DDoS Protection

### **Advanced Rate Limiting Implementation**
```typescript
// Advanced Rate Limiting
import Redis from 'ioredis';
import { RateLimiterRedis, RateLimiterMemory } from 'rate-limiter-flexible';

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  keyGenerator?: (req: Request) => string;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
  points?: number;
  duration?: number;
}

class AdvancedRateLimiter {
  private redis: Redis;
  private limiters: Map<string, any> = new Map();
  
  constructor(redisConfig?: any) {
    this.redis = redisConfig ? new Redis(redisConfig) : null;
    this.initializeLimiters();
  }
  
  private initializeLimiters(): void {
    // Global rate limiter
    this.limiters.set('global', new RateLimiterRedis({
      storeClient: this.redis,
      keyPrefix: 'rl_global',
      points: 1000, // Number of requests
      duration: 60, // Per 60 seconds
      blockDuration: 60, // Block for 60 seconds
    }));
    
    // Per-IP rate limiter
    this.limiters.set('ip', new RateLimiterRedis({
      storeClient: this.redis,
      keyPrefix: 'rl_ip',
      points: 100, // 100 requests per IP
      duration: 60, // Per 60 seconds
      blockDuration: 60,
    }));
    
    // Per-User rate limiter
    this.limiters.set('user', new RateLimiterRedis({
      storeClient: this.redis,
      keyPrefix: 'rl_user',
      points: 200, // 200 requests per user
      duration: 60, // Per 60 seconds
      blockDuration: 60,
    }));
    
    // Per-Endpoint rate limiter
    this.limiters.set('endpoint', new RateLimiterRedis({
      storeClient: this.redis,
      keyPrefix: 'rl_endpoint',
      points: 50, // 50 requests per endpoint
      duration: 60, // Per 60 seconds
      blockDuration: 60,
    }));
    
    // Burst protection
    this.limiters.set('burst', new RateLimiterMemory({
      points: 10, // 10 requests in burst
      duration: 1, // Per 1 second
      blockDuration: 1,
    }));
  }
  
  // Rate limiting middleware
  rateLimit = (config: RateLimitConfig) => {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const key = config.keyGenerator ? 
          config.keyGenerator(req) : 
          this.generateKey(req);
        
        // Check multiple limiters
        const limiters = [
          this.limiters.get('global'),
          this.limiters.get('ip'),
          this.limiters.get('user'),
          this.limiters.get('endpoint'),
          this.limiters.get('burst')
        ];
        
        const results = await Promise.allSettled(
          limiters.map(limiter => 
            limiter.consume(key)
          )
        );
        
        // Check if any limiter rejected the request
        const rejected = results.find(result => 
          result.status === 'rejected'
        );
        
        if (rejected) {
          const rejection = rejected.status === 'rejected' ? 
            rejected.reason : null;
          
          // Set rate limit headers
          this.setRateLimitHeaders(res, rejection);
          
          return res.status(429).json({
            error: 'Too many requests',
            message: 'Rate limit exceeded',
            retryAfter: rejection?.msBeforeNext || 60000,
            limit: rejection?.totalHits || 0,
            remaining: rejection?.remainingPoints || 0
          });
        }
        
        // Set rate limit headers for successful requests
        const successful = results.find(result => 
          result.status === 'fulfilled'
        );
        
        if (successful && successful.status === 'fulfilled') {
          this.setRateLimitHeaders(res, successful.value);
        }
        
        next();
      } catch (error) {
        console.error('Rate limiting error:', error);
        next(); // Allow request on error
      }
    };
  };
  
  private generateKey(req: Request): string {
    const ip = req.ip || req.connection.remoteAddress;
    const userId = req.user?.id || req.oauth2User?.id;
    const endpoint = req.path;
    
    return `${ip}:${userId || 'anonymous'}:${endpoint}`;
  }
  
  private setRateLimitHeaders(res: Response, result: any): void {
    if (result) {
      res.set({
        'X-RateLimit-Limit': result.totalHits || 0,
        'X-RateLimit-Remaining': result.remainingPoints || 0,
        'X-RateLimit-Reset': new Date(Date.now() + (result.msBeforeNext || 0)).toISOString()
      });
    }
  }
}

// Usage Examples
const rateLimiter = new AdvancedRateLimiter({
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD
});

// Apply rate limiting to all API endpoints
app.use('/api/', rateLimiter.rateLimit({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 1000,
  keyGenerator: (req) => `${req.ip}:${req.path}`
}));

// Apply stricter rate limiting to authentication endpoints
app.use('/api/auth/', rateLimiter.rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5,
  keyGenerator: (req) => req.ip
}));

// Apply per-user rate limiting to sensitive endpoints
app.use('/api/admin/', rateLimiter.rateLimit({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 50,
  keyGenerator: (req) => req.user?.id || req.ip
}));
```

---

## 🔍 Input Validation & Sanitization

### **Comprehensive Input Validation**
```typescript
// Input Validation Middleware
import { body, param, query, validationResult } from 'express-validator';
import DOMPurify from 'isomorphic-dompurify';
import validator from 'validator';

class InputValidator {
  // Generic validation middleware
  static validate = (validations: any[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
      await Promise.all(validations.map(validation => validation.run(req)));
      
      const errors = validationResult(req);
      
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Validation failed',
          message: 'Input validation failed',
          details: errors.array().map(error => ({
            field: error.param,
            message: error.msg,
            value: error.value,
            location: error.location
          }))
        });
      }
      
      next();
    };
  };
  
  // Sanitize input data
  static sanitize = (req: Request, res: Response, next: NextFunction) => {
    // Sanitize body
    if (req.body) {
      req.body = this.sanitizeObject(req.body);
    }
    
    // Sanitize query parameters
    if (req.query) {
      req.query = this.sanitizeObject(req.query);
    }
    
    // Sanitize URL parameters
    if (req.params) {
      req.params = this.sanitizeObject(req.params);
    }
    
    next();
  };
  
  private static sanitizeObject(obj: any): any {
    if (typeof obj !== 'object' || obj === null) {
      return obj;
    }
    
    if (Array.isArray(obj)) {
      return obj.map(item => this.sanitizeObject(item));
    }
    
    const sanitized: any = {};
    
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'string') {
        // Remove HTML tags and dangerous characters
        sanitized[key] = DOMPurify.sanitize(value, {
          ALLOWED_TAGS: [],
          ALLOWED_ATTR: []
        });
        
        // Additional sanitization
        sanitized[key] = validator.escape(sanitized[key]);
        sanitized[key] = validator.stripLow(sanitized[key]);
      } else if (typeof value === 'object') {
        sanitized[key] = this.sanitizeObject(value);
      } else {
        sanitized[key] = value;
      }
    }
    
    return sanitized;
  }
}

// Validation Rules
const userValidationRules = {
  create: [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Valid email is required'),
    
    body('password')
      .isLength({ min: 8, max: 128 })
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
      .withMessage('Password must be at least 8 characters long and contain uppercase, lowercase, number and special character'),
    
    body('firstName')
      .isLength({ min: 1, max: 50 })
      .matches(/^[a-zA-Z\s'-]+$/)
      .withMessage('First name must be 1-50 characters long and contain only letters, spaces, hyphens and apostrophes'),
    
    body('lastName')
      .isLength({ min: 1, max: 50 })
      .matches(/^[a-zA-Z\s'-]+$/)
      .withMessage('Last name must be 1-50 characters long and contain only letters, spaces, hyphens and apostrophes'),
    
    body('role')
      .isIn(['user', 'admin', 'operator'])
      .withMessage('Role must be one of: user, admin, operator')
  ],
  
  update: [
    body('email')
      .optional()
      .isEmail()
      .normalizeEmail()
      .withMessage('Valid email is required'),
    
    body('firstName')
      .optional()
      .isLength({ min: 1, max: 50 })
      .matches(/^[a-zA-Z\s'-]+$/)
      .withMessage('First name must be 1-50 characters long and contain only letters, spaces, hyphens and apostrophes'),
    
    body('lastName')
      .optional()
      .isLength({ min: 1, max: 50 })
      .matches(/^[a-zA-Z\s'-]+$/)
      .withMessage('Last name must be 1-50 characters long and contain only letters, spaces, hyphens and apostrophes'),
    
    body('role')
      .optional()
      .isIn(['user', 'admin', 'operator'])
      .withMessage('Role must be one of: user, admin, operator')
  ]
};

// Usage Examples
app.post('/api/users',
  authenticateJWT,
  rbac.authorize([{ resource: 'users', action: 'create' }]),
  InputValidator.sanitize,
  InputValidator.validate(userValidationRules.create),
  createUserController
);

app.put('/api/users/:id',
  authenticateJWT,
  rbac.authorize([{ resource: 'users', action: 'update' }]),
  InputValidator.sanitize,
  InputValidator.validate([
    param('id').isUUID().withMessage('Valid user ID is required'),
    ...userValidationRules.update
  ]),
  updateUserController
);
```

---

## 🛡️ API Security Headers

### **Security Headers Implementation**
```typescript
// Security Headers Middleware
import helmet from 'helmet';

class SecurityHeaders {
  // Custom security headers configuration
  static securityHeaders = helmet({
    // Content Security Policy
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'"],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"],
        childSrc: ["'none'"],
        workerSrc: ["'self'"],
        manifestSrc: ["'self'"],
        upgradeInsecureRequests: []
      }
    },
    
    // Cross-Origin Embedder Policy
    crossOriginEmbedderPolicy: true,
    
    // Cross-Origin Opener Policy
    crossOriginOpenerPolicy: true,
    
    // Cross-Origin Resource Policy
    crossOriginResourcePolicy: { policy: "cross-origin" },
    
    // DNS Prefetch Control
    dnsPrefetchControl: true,
    
    // Expect-CT
    expectCt: {
      maxAge: 86400,
      enforce: true
    },
    
    // Feature Policy
    permittedCrossDomainPolicies: false,
    
    // HSTS
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true
    },
    
    // Origin Agent Cluster
    originAgentCluster: true,
    
    // Referrer Policy
    referrerPolicy: { policy: "strict-origin-when-cross-origin" },
    
    // X-Content-Type-Options
    xContentTypeOptions: true,
    
    // X-DNS-Prefetch-Control
    xDnsPrefetchControl: true,
    
    // X-Frame-Options
    xFrameOptions: { action: 'deny' },
    
    // X-Permitted-Cross-Domain-Policies
    xPermittedCrossDomainPolicies: false,
    
    // X-Download-Options
    xDownloadOptions: true,
    
    // X-XSS-Protection
    xXssProtection: true
  });
  
  // API-specific security headers
  static apiSecurityHeaders = (req: Request, res: Response, next: NextFunction) => {
    // API-specific headers
    res.set({
      'X-API-Version': '1.0.0',
      'X-RateLimit-Limit': '1000',
      'X-RateLimit-Remaining': '999',
      'X-RateLimit-Reset': new Date(Date.now() + 60000).toISOString(),
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
      'Content-Security-Policy': "default-src 'self'",
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Resource-Policy': 'same-origin'
    });
    
    // CORS headers for API
    res.set({
      'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGINS || 'http://localhost:3000',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Max-Age': '86400'
    });
    
    // Cache control for API responses
    if (req.method === 'GET') {
      res.set('Cache-Control', 'public, max-age=300'); // 5 minutes
    } else {
      res.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    }
    
    next();
  };
}

// Apply security headers to all API routes
app.use('/api/', SecurityHeaders.securityHeaders);
app.use('/api/', SecurityHeaders.apiSecurityHeaders);
```

---

## 🔍 API Monitoring & Logging

### **API Security Monitoring**
```typescript
// API Security Monitoring
class APISecurityMonitor {
  private securityEvents: SecurityEvent[] = [];
  private alertThresholds: AlertThresholds;
  
  constructor() {
    this.alertThresholds = {
      failedAuth: 10, // 10 failed auth attempts per minute
      suspiciousIP: 20, // 20 requests from same IP per minute
      dataExfiltration: 1000, // 1000 records accessed per minute
      errorRate: 0.05, // 5% error rate
      responseTime: 5000 // 5 seconds response time
    };
  }
  
  // Security monitoring middleware
  monitor = (req: Request, res: Response, next: NextFunction) => {
    const startTime = Date.now();
    const requestId = this.generateRequestId();
    
    // Add request ID to request
    req.requestId = requestId;
    res.set('X-Request-ID', requestId);
    
    // Log request start
    this.logRequest(req, requestId);
    
    // Monitor response
    const originalSend = res.send;
    res.send = function(body) {
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      // Log response
      APISecurityMonitor.prototype.logResponse(req, res, body, responseTime, requestId);
      
      // Check for security events
      APISecurityMonitor.prototype.checkSecurityEvents(req, res, responseTime, requestId);
      
      return originalSend.call(this, body);
    };
    
    next();
  };
  
  private logRequest(req: Request, requestId: string): void {
    const logEntry = {
      requestId,
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.url,
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent'),
      userId: req.user?.id,
      apiKey: req.apiKey?.id,
      headers: this.sanitizeHeaders(req.headers),
      query: req.query,
      params: req.params
    };
    
    console.log('API_REQUEST', JSON.stringify(logEntry));
  }
  
  private logResponse(req: Request, res: Response, body: any, responseTime: number, requestId: string): void {
    const logEntry = {
      requestId,
      timestamp: new Date().toISOString(),
      statusCode: res.statusCode,
      responseTime,
      responseSize: JSON.stringify(body).length,
      headers: this.sanitizeHeaders(res.getHeaders()),
      success: res.statusCode < 400
    };
    
    console.log('API_RESPONSE', JSON.stringify(logEntry));
  }
  
  private checkSecurityEvents(req: Request, res: Response, responseTime: number, requestId: string): void {
    const ip = req.ip || req.connection.remoteAddress;
    const userId = req.user?.id;
    const endpoint = req.path;
    
    // Check for failed authentication
    if (res.statusCode === 401) {
      this.trackFailedAuth(ip, userId, requestId);
    }
    
    // Check for suspicious IP activity
    this.trackSuspiciousIP(ip, endpoint, requestId);
    
    // Check for data exfiltration
    this.trackDataExfiltration(req, res, requestId);
    
    // Check for error rate
    this.trackErrorRate(endpoint, res.statusCode, requestId);
    
    // Check for slow response
    if (responseTime > this.alertThresholds.responseTime) {
      this.alertSlowResponse(req, responseTime, requestId);
    }
  }
  
  private trackFailedAuth(ip: string, userId: string, requestId: string): void {
    const key = `failed_auth:${ip}`;
    const count = this.incrementCounter(key, 60); // 1 minute window
    
    if (count >= this.alertThresholds.failedAuth) {
      this.sendAlert({
        type: 'FAILED_AUTHENTICATION',
        severity: 'HIGH',
        ip,
        userId,
        count,
        requestId,
        timestamp: new Date()
      });
    }
  }
  
  private trackSuspiciousIP(ip: string, endpoint: string, requestId: string): void {
    const key = `suspicious_ip:${ip}`;
    const count = this.incrementCounter(key, 60); // 1 minute window
    
    if (count >= this.alertThresholds.suspiciousIP) {
      this.sendAlert({
        type: 'SUSPICIOUS_IP_ACTIVITY',
        severity: 'MEDIUM',
        ip,
        endpoint,
        count,
        requestId,
        timestamp: new Date()
      });
    }
  }
  
  private trackDataExfiltration(req: Request, res: Response, requestId: string): void {
    if (req.method === 'GET' && res.statusCode === 200) {
      const responseSize = JSON.stringify(res.body).length;
      
      if (responseSize > 1000000) { // 1MB
        const key = `data_exfil:${req.user?.id || 'anonymous'}`;
        const count = this.incrementCounter(key, 60);
        
        if (count >= this.alertThresholds.dataExfiltration) {
          this.sendAlert({
            type: 'POTENTIAL_DATA_EXFILTRATION',
            severity: 'CRITICAL',
            userId: req.user?.id,
            endpoint: req.path,
            responseSize,
            count,
            requestId,
            timestamp: new Date()
          });
        }
      }
    }
  }
  
  private sendAlert(alert: SecurityAlert): void {
    // Send to monitoring system
    console.log('SECURITY_ALERT', JSON.stringify(alert));
    
    // Send to external monitoring (e.g., Sentry, Datadog)
    if (process.env.MONITORING_WEBHOOK) {
      fetch(process.env.MONITORING_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(alert)
      }).catch(error => {
        console.error('Failed to send security alert:', error);
      });
    }
  }
  
  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  private sanitizeHeaders(headers: any): any {
    const sanitized: any = {};
    
    for (const [key, value] of Object.entries(headers)) {
      if (typeof value === 'string' && !key.toLowerCase().includes('authorization')) {
        sanitized[key] = value;
      }
    }
    
    return sanitized;
  }
  
  private incrementCounter(key: string, windowSeconds: number): number {
    // This would typically use Redis or similar
    // For demo purposes, using in-memory counter
    const count = (this.counters?.get(key) || 0) + 1;
    this.counters = this.counters || new Map();
    this.counters.set(key, count);
    
    // Reset counter after window
    setTimeout(() => {
      this.counters.delete(key);
    }, windowSeconds * 1000);
    
    return count;
  }
  
  private counters: Map<string, number> = new Map();
}

// Apply security monitoring
const securityMonitor = new APISecurityMonitor();
app.use('/api/', securityMonitor.monitor);
```

---

## 📋 Implementation Guide

### **Step 1: Basic Setup**
```bash
#!/bin/bash
# API Security Setup

echo "🔧 Setting up Moltbot API Security..."

# 1. Install required packages
npm install express helmet express-rate-limit express-validator
npm install jsonwebtoken bcryptjs ioredis
npm install isomorphic-dompurify validator
npm install @types/express @types/jsonwebtoken @types/bcryptjs

# 2. Create security configuration
mkdir -p config/security
touch config/security/api-security.config.js
touch config/security/rate-limits.config.js
touch config/security/validation-rules.js

# 3. Create middleware directory
mkdir -p middleware/security
touch middleware/security/auth.js
touch middleware/security/authorization.js
touch middleware/security/rate-limiting.js
touch middleware/security/validation.js
touch middleware/security/monitoring.js

echo "✅ API Security setup completed!"
```

### **Step 2: Configuration**
```javascript
// config/security/api-security.config.js
module.exports = {
  jwt: {
    secret: process.env.JWT_SECRET || 'your-super-secret-key',
    algorithm: 'HS256',
    expiresIn: '1h',
    issuer: 'moltbot-api',
    audience: 'moltbot-clients'
  },
  
  oauth2: {
    enabled: process.env.OAUTH2_ENABLED === 'true',
    provider: process.env.OAUTH2_PROVIDER || 'google',
    clientId: process.env.OAUTH2_CLIENT_ID,
    clientSecret: process.env.OAUTH2_CLIENT_SECRET
  },
  
  apiKey: {
    enabled: process.env.API_KEY_ENABLED === 'true',
    headerName: 'X-API-Key',
    queryParam: 'api_key'
  },
  
  rateLimiting: {
    global: {
      windowMs: 60 * 1000, // 1 minute
      maxRequests: 1000
    },
    ip: {
      windowMs: 60 * 1000, // 1 minute
      maxRequests: 100
    },
    user: {
      windowMs: 60 * 1000, // 1 minute
      maxRequests: 200
    },
    endpoint: {
      windowMs: 60 * 1000, // 1 minute
      maxRequests: 50
    }
  },
  
  validation: {
    sanitize: true,
    escape: true,
    stripLow: true,
    whitelist: ['a-z', 'A-Z', '0-9', ' ', '-', '_', '.', '@']
  },
  
  monitoring: {
    enabled: true,
    logRequests: true,
    logResponses: true,
    trackSecurityEvents: true,
    alertWebhook: process.env.SECURITY_ALERT_WEBHOOK
  }
};
```

### **Step 3: Integration**
```typescript
// app.js - Main application setup
import express from 'express';
import { SecurityHeaders } from './middleware/security';
import { APIAuthentication } from './middleware/security/auth';
import { RBACAuthorization } from './middleware/security/authorization';
import { AdvancedRateLimiter } from './middleware/security/rate-limiting';
import { InputValidator } from './middleware/security/validation';
import { APISecurityMonitor } from './middleware/security/monitoring';
import apiSecurityConfig from './config/security/api-security.config';

const app = express();

// Initialize security components
const auth = new APIAuthentication(apiSecurityConfig);
const rbac = new RBACAuthorization();
const rateLimiter = new AdvancedRateLimiter();
const securityMonitor = new APISecurityMonitor();

// Apply global security middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(SecurityHeaders.securityHeaders);
app.use(SecurityHeaders.apiSecurityHeaders);
app.use(securityMonitor.monitor);

// Apply API-specific middleware
app.use('/api/', rateLimiter.rateLimit(apiSecurityConfig.rateLimiting.global));
app.use('/api/', InputValidator.sanitize);

// Authentication endpoints
app.post('/api/auth/login', 
  rateLimiter.rateLimit(apiSecurityConfig.rateLimiting.ip),
  InputValidator.validate([
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 8 })
  ]),
  authController.login
);

// Protected API endpoints
app.use('/api/', auth.authenticateJWT);
app.use('/api/', rbac.authorize([{ resource: 'api', action: 'access' }]));

// API routes
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/data', dataRoutes);

export default app;
```

---

## 🔗 Related Resources

### **Internal Links**
- [Security Check Tool](/securitycheck) - Live Security Validation
- [Moltbot Security Framework](/moltbot/security-framework) - Complete Security Architecture
- [AI Runbooks](/runbooks) - Security Playbooks und Procedures
- [OpenClaw Framework](/openclaw) - Open Source Security Framework
- [Roast My Moltbot](/roast-my-moltbot) - Security Testing Tool
- [Neuro AI Engine](/neuro) - AI-gestützte Threat Detection

### **External Resources**
- [OWASP API Security Top 10](https://owasp.org/www-project-api-security/) - API Security Standards
- [REST Security Best Practices](https://restfulapi.net/security/) - REST API Security Guidelines
- [JWT Handbook](https://jwt.io/) - JSON Web Token Documentation

---

## 🎯 Conclusion

Die **Moltbot API Security** bietet einen umfassenden, mehrschichtigen Ansatz für die Absicherung von REST Endpoints. Durch die Implementierung der beschriebenen Sicherheitskontrollen können Organisationen sicherstellen, dass ihre APIs robust, sicher und compliant sind.

**Key Takeaways:**
1. **Multi-Layer Security** - Verschiedene Sicherheitsebenen implementieren
2. **Zero Trust Principle** - Jede Anfrage verifizieren
3. **Rate Limiting** - DDoS und Abuse Protection
4. **Input Validation** - Injection Attacks verhindern
5. **Comprehensive Monitoring** - Security Events überwachen

---

> **🛡️ Ready to secure your APIs?** Starte mit unserem [Security Check Tool](/securitycheck) für eine umfassende Analyse deiner API-Security.

> **📚 Need more guidance?** Entdecke unsere [AI Runbooks](/runbooks) für detaillierte API-Security-Anleitungen.

> **🤝 Join the community?** Werde Teil der [ClawBot Community](/community) und tausche dich mit anderen Security-Experten aus.

---

*Dieser Guide wird monatlich aktualisiert, um die neuesten API-Security-Best Practices und Threat-Landscape-Veränderungen zu berücksichtigen. Letzte Aktualisierung: April 2024.*
