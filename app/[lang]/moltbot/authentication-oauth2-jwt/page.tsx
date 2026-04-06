---
title: "Moltbot Authentication: OAuth2 & JWT Setup"
description: "Sichere Authentication mit OAuth2 und JWT Integration für Moltbot. Complete Authentication Setup mit Multi-Factor Auth und Session Management."
keywords: ["moltbot authentication", "oauth2 jwt setup", "multi-factor authentication", "session management", "jwt security", "oauth2 integration"]
author: "ClawGuru Security Team"
published: "2024-04-06"
modified: "2024-04-06"
category: "Security"
subcategory: "Moltbot"
language: "de"
locale: "de_DE"
canonical: "https://clawguru.org/de/moltbot/authentication-oauth2-jwt"
alternates:
  de: "https://clawguru.org/de/moltbot/authentication-oauth2-jwt"
  en: "https://clawguru.org/en/moltbot/authentication-oauth2-jwt"
  es: "https://clawguru.org/es/moltbot/authentication-oauth2-jwt"
  fr: "https://clawguru.org/fr/moltbot/authentication-oauth2-jwt"
  pt: "https://clawguru.org/pt/moltbot/authentication-oauth2-jwt"
  it: "https://clawguru.org/it/moltbot/authentication-oauth2-jwt"
  ru: "https://clawguru.org/ru/moltbot/authentication-oauth2-jwt"
  zh: "https://clawguru.org/zh/moltbot/authentication-oauth2-jwt"
  ja: "https://clawguru.org/ja/moltbot/authentication-oauth2-jwt"
  ko: "https://clawguru.org/ko/moltbot/authentication-oauth2-jwt"
  ar: "https://clawguru.org/ar/moltbot/authentication-oauth2-jwt"
  hi: "https://clawguru.org/hi/moltbot/authentication-oauth2-jwt"
  tr: "https://clawguru.org/tr/moltbot/authentication-oauth2-jwt"
  pl: "https://clawguru.org/pl/moltbot/authentication-oauth2-jwt"
  nl: "https://clawguru.org/nl/moltbot/authentication-oauth2-jwt"
robots: "index, follow"
image: "/og-moltbot-authentication.jpg"
type: "article"
readingTime: 20
difficulty: "Advanced"
prerequisites: ["Moltbot Security Framework", "OAuth2 Concepts", "JWT Fundamentals"]
tags: ["moltbot", "authentication", "oauth2", "jwt", "mfa", "2024"]
---

# Moltbot Authentication: OAuth2 & JWT Setup

> **"Not a Pentest" Trust-Anker**: Dieser Guide dient ausschließlich zur Implementierung von Authentication Systemen. Keine Angriffswerkzeuge, keine illegalen Aktivitäten.

## 🎯 Executive Summary

Die **Moltbot Authentication** stellt einen umfassenden, modernen Ansatz für Benutzerauthentifizierung dar. Mit OAuth2 Integration, JWT Token Management und Multi-Factor Authentication bietet sie enterprise-grade Security bei gleichzeitig exzellenter User Experience.

**Kernprinzipien:**
- **Zero Trust Authentication** - Kein implizites Vertrauen
- **Defense in Depth** - Mehrschichtige Authentifizierung
- **Secure by Default** - Security als Standard
- **Privacy by Design** - Datenschutz als Grundprinzip

---

## 🏗️ Authentication Architecture

### **Security Layer Overview**
```mermaid
graph TB
    A[User] --> B[OAuth2 Provider]
    A --> C[Moltbot Auth Service]
    
    B --> D[OAuth2 Tokens]
    D --> C
    
    C --> E[JWT Tokens]
    E --> F[API Gateway]
    
    F --> G[Resource Server]
    G --> H[Authorization Service]
    
    C --> I[MFA Service]
    I --> J[Session Management]
    
    C --> K[Audit Logging]
    K --> L[Security Monitoring]
```

---

## 🔐 OAuth2 Integration

### **OAuth2 Configuration**
```typescript
// OAuth2 Configuration Interface
interface OAuth2Config {
  provider: 'google' | 'github' | 'microsoft' | 'auth0';
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scopes: string[];
  authorizationEndpoint: string;
  tokenEndpoint: string;
  userInfoEndpoint: string;
  revocationEndpoint: string;
}

// OAuth2 Service Implementation
class OAuth2Service {
  private config: OAuth2Config;
  private tokenStore: TokenStore;
  
  constructor(config: OAuth2Config) {
    this.config = config;
    this.tokenStore = new RedisTokenStore();
  }
  
  // Generate OAuth2 authorization URL
  getAuthorizationUrl(state: string, scopes?: string[]): string {
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      scope: scopes?.join(' ') || this.config.scopes.join(' '),
      state: state,
      access_type: 'offline',
      prompt: 'consent'
    });
    
    return `${this.config.authorizationEndpoint}?${params.toString()}`;
  }
  
  // Exchange authorization code for tokens
  async exchangeCodeForTokens(code: string, state: string): Promise<OAuth2Tokens> {
    // Validate state
    const storedState = await this.tokenStore.getState(state);
    if (!storedState) {
      throw new Error('Invalid state parameter');
    }
    
    // Exchange code for tokens
    const tokenResponse = await fetch(this.config.tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${this.config.clientId}:${this.config.clientSecret}`).toString('base64')}`
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: this.config.redirectUri,
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret
      })
    });
    
    if (!tokenResponse.ok) {
      throw new Error('Failed to exchange authorization code');
    }
    
    const tokens = await tokenResponse.json();
    
    // Store tokens securely
    await this.tokenStore.storeTokens(tokens.access_token, {
      refreshToken: tokens.refresh_token,
      expiresAt: new Date(Date.now() + tokens.expires_in * 1000),
      scope: tokens.scope,
      tokenType: tokens.token_type
    });
    
    // Clean up state
    await this.tokenStore.deleteState(state);
    
    return {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiresIn: tokens.expires_in,
      scope: tokens.scope,
      tokenType: tokens.token_type
    };
  }
  
  // Get user information from OAuth2 provider
  async getUserInfo(accessToken: string): Promise<OAuth2UserInfo> {
    const response = await fetch(this.config.userInfoEndpoint, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to get user information');
    }
    
    return await response.json();
  }
  
  // Refresh access token
  async refreshAccessToken(refreshToken: string): Promise<string> {
    const response = await fetch(this.config.tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${this.config.clientId}:${this.config.clientSecret}`).toString('base64')}`
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to refresh access token');
    }
    
    const tokens = await response.json();
    
    // Update stored tokens
    await this.tokenStore.updateTokens(tokens.access_token, {
      expiresAt: new Date(Date.now() + tokens.expires_in * 1000),
      scope: tokens.scope
    });
    
    return tokens.access_token;
  }
  
  // Revoke tokens
  async revokeToken(token: string): Promise<void> {
    await fetch(this.config.revocationEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        token: token,
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret
      })
    });
    
    // Remove from store
    await this.tokenStore.deleteToken(token);
  }
}

// OAuth2 Provider Configurations
const oauth2Configs = {
  google: {
    provider: 'google' as const,
    clientId: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    redirectUri: process.env.GOOGLE_REDIRECT_URI!,
    scopes: ['openid', 'profile', 'email'],
    authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenEndpoint: 'https://oauth2.googleapis.com/token',
    userInfoEndpoint: 'https://www.googleapis.com/oauth2/v2/userinfo',
    revocationEndpoint: 'https://oauth2.googleapis.com/revoke'
  },
  
  github: {
    provider: 'github' as const,
    clientId: process.env.GITHUB_CLIENT_ID!,
    clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    redirectUri: process.env.GITHUB_REDIRECT_URI!,
    scopes: ['user:email', 'read:user'],
    authorizationEndpoint: 'https://github.com/login/oauth/authorize',
    tokenEndpoint: 'https://github.com/login/oauth/access_token',
    userInfoEndpoint: 'https://api.github.com/user',
    revocationEndpoint: 'https://api.github.com/applications/YOUR_CLIENT_ID/tokens/YOUR_TOKEN'
  },
  
  microsoft: {
    provider: 'microsoft' as const,
    clientId: process.env.MICROSOFT_CLIENT_ID!,
    clientSecret: process.env.MICROSOFT_CLIENT_SECRET!,
    redirectUri: process.env.MICROSOFT_REDIRECT_URI!,
    scopes: ['openid', 'profile', 'email'],
    authorizationEndpoint: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
    tokenEndpoint: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
    userInfoEndpoint: 'https://graph.microsoft.com/v1.0/me',
    revocationEndpoint: 'https://login.microsoftonline.com/common/oauth2/v2.0/logout'
  }
};
```

---

## 🎫 JWT Token Management

### **JWT Service Implementation**
```typescript
// JWT Service Configuration
interface JWTConfig {
  secret: string;
  algorithm: string;
  expiresIn: string;
  issuer: string;
  audience: string;
  refreshTokenExpiresIn: string;
}

// JWT Service Implementation
class JWTService {
  private config: JWTConfig;
  private tokenStore: TokenStore;
  private blacklist: TokenBlacklist;
  
  constructor(config: JWTConfig) {
    this.config = config;
    this.tokenStore = new RedisTokenStore();
    this.blacklist = new RedisTokenBlacklist();
  }
  
  // Generate JWT access token
  generateAccessToken(payload: JWTPayload): string {
    const now = Math.floor(Date.now() / 1000);
    
    const tokenPayload = {
      sub: payload.userId,
      email: payload.email,
      name: payload.name,
      roles: payload.roles,
      permissions: payload.permissions,
      iat: now,
      exp: now + this.parseDuration(this.config.expiresIn),
      iss: this.config.issuer,
      aud: this.config.audience,
      jti: this.generateTokenId()
    };
    
    return jwt.sign(tokenPayload, this.config.secret, {
      algorithm: this.config.algorithm as jwt.Algorithm
    });
  }
  
  // Generate refresh token
  generateRefreshToken(userId: string): string {
    const now = Math.floor(Date.now() / 1000);
    
    const tokenPayload = {
      sub: userId,
      type: 'refresh',
      iat: now,
      exp: now + this.parseDuration(this.config.refreshTokenExpiresIn),
      iss: this.config.issuer,
      aud: this.config.audience,
      jti: this.generateTokenId()
    };
    
    return jwt.sign(tokenPayload, this.config.secret, {
      algorithm: this.config.algorithm as jwt.Algorithm
    });
  }
  
  // Verify JWT token
  async verifyToken(token: string): Promise<JWTPayload> {
    // Check if token is blacklisted
    const isBlacklisted = await this.blacklist.isBlacklisted(token);
    if (isBlacklisted) {
      throw new Error('Token is blacklisted');
    }
    
    try {
      const decoded = jwt.verify(token, this.config.secret, {
        algorithms: [this.config.algorithm as jwt.Algorithm],
        issuer: this.config.issuer,
        audience: this.config.audience
      }) as any;
      
      return {
        userId: decoded.sub,
        email: decoded.email,
        name: decoded.name,
        roles: decoded.roles || [],
        permissions: decoded.permissions || [],
        tokenId: decoded.jti,
        issuedAt: decoded.iat,
        expiresAt: decoded.exp
      };
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error('Token expired');
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw new Error('Invalid token');
      }
      throw error;
    }
  }
  
  // Refresh access token
  async refreshAccessToken(refreshToken: string): Promise<string> {
    try {
      const decoded = jwt.verify(refreshToken, this.config.secret, {
        algorithms: [this.config.algorithm as jwt.Algorithm],
        issuer: this.config.issuer,
        audience: this.config.audience
      }) as any;
      
      if (decoded.type !== 'refresh') {
        throw new Error('Invalid refresh token');
      }
      
      // Get user information
      const user = await this.tokenStore.getUser(decoded.sub);
      if (!user) {
        throw new Error('User not found');
      }
      
      // Blacklist old refresh token
      await this.blacklist.blacklistToken(refreshToken);
      
      // Generate new tokens
      const newAccessToken = this.generateAccessToken({
        userId: user.id,
        email: user.email,
        name: user.name,
        roles: user.roles,
        permissions: user.permissions
      });
      
      const newRefreshToken = this.generateRefreshToken(user.id);
      
      // Store new refresh token
      await this.tokenStore.storeRefreshToken(user.id, newRefreshToken);
      
      return newAccessToken;
    } catch (error) {
      throw new Error('Failed to refresh token');
    }
  }
  
  // Revoke token
  async revokeToken(token: string): Promise<void> {
    await this.blacklist.blacklistToken(token);
  }
  
  // Parse duration string to seconds
  private parseDuration(duration: string): number {
    const units: { [key: string]: number } = {
      's': 1,
      'm': 60,
      'h': 3600,
      'd': 86400
    };
    
    const match = duration.match(/^(\d+)([smhd])$/);
    if (!match) {
      throw new Error('Invalid duration format');
    }
    
    const [, value, unit] = match;
    return parseInt(value) * (units[unit] || 1);
  }
  
  // Generate unique token ID
  private generateTokenId(): string {
    return crypto.randomBytes(16).toString('hex');
  }
}

// Token Store Interface
interface TokenStore {
  storeTokens(accessToken: string, tokenData: TokenData): Promise<void>;
  storeRefreshToken(userId: string, refreshToken: string): Promise<void>;
  getUser(userId: string): Promise<User | null>;
  updateTokens(accessToken: string, tokenData: Partial<TokenData>): Promise<void>;
  deleteToken(token: string): Promise<void>;
}

// Redis Token Store Implementation
class RedisTokenStore implements TokenStore {
  private redis: Redis;
  
  constructor(redis: Redis) {
    this.redis = redis;
  }
  
  async storeTokens(accessToken: string, tokenData: TokenData): Promise<void> {
    const key = `token:${accessToken}`;
    await this.redis.setex(key, tokenData.expiresAt.getTime() - Date.now(), JSON.stringify(tokenData));
  }
  
  async storeRefreshToken(userId: string, refreshToken: string): Promise<void> {
    const key = `refresh_token:${userId}`;
    await this.redis.setex(key, 30 * 24 * 60 * 60, refreshToken); // 30 days
  }
  
  async getUser(userId: string): Promise<User | null> {
    const key = `user:${userId}`;
    const userData = await this.redis.get(key);
    return userData ? JSON.parse(userData) : null;
  }
  
  async updateTokens(accessToken: string, tokenData: Partial<TokenData>): Promise<void> {
    const key = `token:${accessToken}`;
    const existing = await this.redis.get(key);
    if (existing) {
      const parsed = JSON.parse(existing);
      const updated = { ...parsed, ...tokenData };
      await this.redis.setex(key, parsed.expiresAt.getTime() - Date.now(), JSON.stringify(updated));
    }
  }
  
  async deleteToken(token: string): Promise<void> {
    const key = `token:${token}`;
    await this.redis.del(key);
  }
}
```

---

## 🛡️ Multi-Factor Authentication

### **MFA Service Implementation**
```typescript
// MFA Configuration
interface MFAConfig {
  enabled: boolean;
  required: boolean;
  methods: ('totp' | 'sms' | 'email' | 'hardware')[];
  issuer: string;
  window: number;
  digits: number;
}

// MFA Service Implementation
class MFAService {
  private config: MFAConfig;
  private totpService: TOTPService;
  private smsService: SMSService;
  private emailService: EmailService;
  
  constructor(config: MFAConfig) {
    this.config = config;
    this.totpService = new TOTPService(config);
    this.smsService = new SMSService();
    this.emailService = new EmailService();
  }
  
  // Generate MFA secret for user
  async generateMFASecret(userId: string): Promise<MFASecret> {
    const secret = speakeasy.generateSecret({
      name: `Moltbot (${userId})`,
      issuer: this.config.issuer,
      length: 32
    });
    
    // Store secret securely
    await this.storeMFASecret(userId, secret.base32);
    
    return {
      secret: secret.base32,
      qrCode: await this.generateQRCode(secret.otpauth_url),
      manualEntryKey: secret.base32
    };
  }
  
  // Verify MFA code
  async verifyMFACode(userId: string, code: string, method: string): Promise<boolean> {
    const secret = await this.getMFASecret(userId);
    if (!secret) {
      throw new Error('MFA not configured for user');
    }
    
    switch (method) {
      case 'totp':
        return this.totpService.verify(secret, code);
      
      case 'sms':
        return this.smsService.verify(userId, code);
      
      case 'email':
        return this.emailService.verify(userId, code);
      
      case 'hardware':
        return this.verifyHardwareToken(userId, code);
      
      default:
        throw new Error('Unsupported MFA method');
    }
  }
  
  // Send MFA code
  async sendMFACode(userId: string, method: string): Promise<void> {
    const user = await this.getUser(userId);
    if (!user) {
      throw new Error('User not found');
    }
    
    const code = this.generateCode();
    
    switch (method) {
      case 'sms':
        await this.smsService.send(user.phone, code);
        break;
      
      case 'email':
        await this.emailService.send(user.email, code);
        break;
      
      default:
        throw new Error('Unsupported MFA method for sending');
    }
    
    // Store code for verification
    await this.storeMFAVerification(userId, method, code);
  }
  
  // Generate QR code for TOTP
  private async generateQRCode(otpauthUrl: string): Promise<string> {
    const qr = require('qrcode');
    return await qr.toDataURL(otpauthUrl);
  }
  
  // Generate verification code
  private generateCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
  
  // Store MFA secret
  private async storeMFASecret(userId: string, secret: string): Promise<void> {
    const encryptedSecret = await this.encrypt(secret);
    await this.redis.setex(`mfa_secret:${userId}`, 365 * 24 * 60 * 60, encryptedSecret);
  }
  
  // Get MFA secret
  private async getMFASecret(userId: string): Promise<string | null> {
    const encryptedSecret = await this.redis.get(`mfa_secret:${userId}`);
    if (!encryptedSecret) {
      return null;
    }
    
    return await this.decrypt(encryptedSecret);
  }
  
  // Store MFA verification
  private async storeMFAVerification(userId: string, method: string, code: string): Promise<void> {
    await this.redis.setex(`mfa_verify:${userId}:${method}`, 5 * 60, code);
  }
  
  // Verify MFA verification
  private async verifyMFAVerification(userId: string, method: string, code: string): Promise<boolean> {
    const storedCode = await this.redis.get(`mfa_verify:${userId}:${method}`);
    if (!storedCode) {
      return false;
    }
    
    const isValid = storedCode === code;
    
    if (isValid) {
      // Clean up verification code
      await this.redis.del(`mfa_verify:${userId}:${method}`);
    }
    
    return isValid;
  }
  
  // Verify hardware token
  private async verifyHardwareToken(userId: string, code: string): Promise<boolean> {
    // Implementation for hardware tokens (YubiKey, etc.)
    // This would integrate with hardware token APIs
    return false; // Placeholder
  }
}

// TOTP Service Implementation
class TOTPService {
  private config: MFAConfig;
  
  constructor(config: MFAConfig) {
    this.config = config;
  }
  
  verify(secret: string, token: string): boolean {
    return speakeasy.totp.verify({
      secret: secret,
      encoding: 'base32',
      token: token,
      window: this.config.window,
      time: Math.floor(Date.now() / 1000)
    });
  }
}
```

---

## 📱 Session Management

### **Session Service Implementation**
```typescript
// Session Configuration
interface SessionConfig {
  secret: string;
  maxAge: number;
  rolling: boolean;
  resave: boolean;
  saveUninitialized: boolean;
  cookie: {
    secure: boolean;
    httpOnly: boolean;
    sameSite: 'strict' | 'lax' | 'none';
    domain?: string;
    path?: string;
  };
}

// Session Service Implementation
class SessionService {
  private config: SessionConfig;
  private sessionStore: SessionStore;
  
  constructor(config: SessionConfig) {
    this.config = config;
    this.sessionStore = new RedisSessionStore();
  }
  
  // Create session
  async createSession(userId: string, sessionData: SessionData): Promise<Session> {
    const sessionId = this.generateSessionId();
    const now = Date.now();
    
    const session: Session = {
      id: sessionId,
      userId,
      data: sessionData,
      createdAt: now,
      lastAccessedAt: now,
      expiresAt: now + this.config.maxAge,
      isActive: true
    };
    
    await this.sessionStore.storeSession(sessionId, session);
    
    return session;
  }
  
  // Get session
  async getSession(sessionId: string): Promise<Session | null> {
    const session = await this.sessionStore.getSession(sessionId);
    
    if (!session || !session.isActive || session.expiresAt < Date.now()) {
      return null;
    }
    
    // Update last accessed time
    if (this.config.rolling) {
      session.lastAccessedAt = Date.now();
      session.expiresAt = Date.now() + this.config.maxAge;
      await this.sessionStore.storeSession(sessionId, session);
    }
    
    return session;
  }
  
  // Update session
  async updateSession(sessionId: string, data: Partial<SessionData>): Promise<void> {
    const session = await this.getSession(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }
    
    session.data = { ...session.data, ...data };
    session.lastAccessedAt = Date.now();
    
    await this.sessionStore.storeSession(sessionId, session);
  }
  
  // Destroy session
  async destroySession(sessionId: string): Promise<void> {
    await this.sessionStore.deleteSession(sessionId);
  }
  
  // Generate session ID
  private generateSessionId(): string {
    return crypto.randomBytes(32).toString('hex');
  }
}

// Session Store Interface
interface SessionStore {
  storeSession(sessionId: string, session: Session): Promise<void>;
  getSession(sessionId: string): Promise<Session | null>;
  deleteSession(sessionId: string): Promise<void>;
  cleanupExpiredSessions(): Promise<void>;
}

// Redis Session Store Implementation
class RedisSessionStore implements SessionStore {
  private redis: Redis;
  
  constructor(redis: Redis) {
    this.redis = redis;
  }
  
  async storeSession(sessionId: string, session: Session): Promise<void> {
    const key = `session:${sessionId}`;
    const ttl = Math.floor((session.expiresAt - Date.now()) / 1000);
    await this.redis.setex(key, ttl, JSON.stringify(session));
  }
  
  async getSession(sessionId: string): Promise<Session | null> {
    const key = `session:${sessionId}`;
    const sessionData = await this.redis.get(key);
    return sessionData ? JSON.parse(sessionData) : null;
  }
  
  async deleteSession(sessionId: string): Promise<void> {
    const key = `session:${sessionId}`;
    await this.redis.del(key);
  }
  
  async cleanupExpiredSessions(): Promise<void> {
    // Redis automatically handles TTL expiration
    // This method can be used for manual cleanup if needed
  }
}
```

---

## 🔍 Authentication Middleware

### **Complete Authentication Middleware**
```typescript
// Authentication Middleware
class AuthenticationMiddleware {
  private jwtService: JWTService;
  private sessionService: SessionService;
  private mfaService: MFAService;
  private oauth2Service: OAuth2Service;
  
  constructor(
    jwtService: JWTService,
    sessionService: SessionService,
    mfaService: MFAService,
    oauth2Service: OAuth2Service
  ) {
    this.jwtService = jwtService;
    this.sessionService = sessionService;
    this.mfaService = mfaService;
    this.oauth2Service = oauth2Service;
  }
  
  // OAuth2 authentication middleware
  oauth2Auth = (provider: string) => {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const oauth2Config = oauth2Configs[provider as keyof typeof oauth2Configs];
        if (!oauth2Config) {
          return res.status(400).json({
            error: 'Invalid OAuth2 provider',
            message: `Provider ${provider} is not supported`
          });
        }
        
        const service = new OAuth2Service(oauth2Config);
        
        if (req.query.code) {
          // Handle OAuth2 callback
          const tokens = await service.exchangeCodeForTokens(
            req.query.code as string,
            req.query.state as string
          );
          
          const userInfo = await service.getUserInfo(tokens.accessToken);
          
          // Create or update user
          const user = await this.createOrUpdateUser(userInfo, provider);
          
          // Generate JWT tokens
          const accessToken = this.jwtService.generateAccessToken({
            userId: user.id,
            email: user.email,
            name: user.name,
            roles: user.roles,
            permissions: user.permissions
          });
          
          const refreshToken = this.jwtService.generateRefreshToken(user.id);
          
          // Create session
          const session = await this.sessionService.createSession(user.id, {
            provider,
            oauth2Tokens: tokens,
            mfaVerified: false
          });
          
          // Set secure cookie
          res.cookie('session_id', session.id, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
          });
          
          // Check if MFA is required
          if (user.mfaEnabled) {
            return res.status(200).json({
              message: 'MFA required',
              mfaRequired: true,
              sessionId: session.id
            });
          }
          
          // Set MFA verified
          await this.sessionService.updateSession(session.id, {
            mfaVerified: true
          });
          
          return res.status(200).json({
            message: 'Authentication successful',
            accessToken,
            refreshToken,
            user: {
              id: user.id,
              email: user.email,
              name: user.name,
              roles: user.roles
            }
          });
        } else {
          // Redirect to OAuth2 provider
          const state = this.generateState();
          const authUrl = service.getAuthorizationUrl(state);
          
          return res.redirect(authUrl);
        }
      } catch (error) {
        console.error('OAuth2 authentication error:', error);
        return res.status(500).json({
          error: 'Authentication failed',
          message: 'Internal server error during OAuth2 authentication'
        });
      }
    };
  };
  
  // JWT authentication middleware
  jwtAuth = (options: { optional?: boolean } = {}) => {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const token = this.extractToken(req);
        
        if (!token) {
          if (options.optional) {
            return next();
          }
          return res.status(401).json({
            error: 'Authentication required',
            message: 'No token provided'
          });
        }
        
        const payload = await this.jwtService.verifyToken(token);
        
        // Check session if exists
        const sessionId = req.cookies?.session_id;
        if (sessionId) {
          const session = await this.sessionService.getSession(sessionId);
          if (!session || !session.isActive) {
            return res.status(401).json({
              error: 'Invalid session',
              message: 'Session is invalid or expired'
            });
          }
          
          // Update session last accessed
          await this.sessionService.updateSession(sessionId, {
            lastAccessedAt: Date.now()
          });
        }
        
        req.user = payload;
        req.token = token;
        req.sessionId = sessionId;
        
        next();
      } catch (error) {
        if (error.message === 'Token expired') {
          return res.status(401).json({
            error: 'Token expired',
            message: 'Authentication token has expired'
          });
        }
        
        if (error.message === 'Invalid token') {
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
  };
  
  // MFA verification middleware
  mfaAuth = () => {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const sessionId = req.cookies?.session_id;
        if (!sessionId) {
          return res.status(401).json({
            error: 'Session required',
            message: 'No session found'
          });
        }
        
        const session = await this.sessionService.getSession(sessionId);
        if (!session || !session.isActive) {
          return res.status(401).json({
            error: 'Invalid session',
            message: 'Session is invalid or expired'
          });
        }
        
        if (session.data.mfaVerified) {
          return next();
        }
        
        const { method, code } = req.body;
        
        if (!method || !code) {
          return res.status(400).json({
            error: 'MFA required',
            message: 'MFA method and code are required'
          });
        }
        
        const user = await this.getUser(session.userId);
        if (!user || !user.mfaEnabled) {
          return res.status(400).json({
            error: 'MFA not enabled',
            message: 'MFA is not enabled for this user'
          });
        }
        
        const isValid = await this.mfaService.verifyMFACode(user.id, code, method);
        
        if (!isValid) {
          return res.status(401).json({
            error: 'Invalid MFA code',
            message: 'The provided MFA code is invalid'
          });
        }
        
        // Update session
        await this.sessionService.updateSession(sessionId, {
          mfaVerified: true
        });
        
        return res.status(200).json({
          message: 'MFA verification successful'
        });
      } catch (error) {
        console.error('MFA verification error:', error);
        return res.status(500).json({
          error: 'MFA verification failed',
          message: 'Internal server error during MFA verification'
        });
      }
    };
  };
  
  // Extract token from request
  private extractToken(req: Request): string | null {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }
    
    return req.cookies?.jwt || null;
  }
  
  // Generate OAuth2 state
  private generateState(): string {
    return crypto.randomBytes(32).toString('hex');
  }
  
  // Create or update user
  private async createOrUpdateUser(userInfo: any, provider: string): Promise<User> {
    // Implementation would depend on your user store
    // This is a placeholder for the actual implementation
    return {
      id: userInfo.id,
      email: userInfo.email,
      name: userInfo.name,
      roles: ['user'],
      permissions: ['read'],
      mfaEnabled: false,
      provider
    };
  }
  
  // Get user
  private async getUser(userId: string): Promise<User | null> {
    // Implementation would depend on your user store
    return null;
  }
}
```

---

## 📋 Implementation Guide

### **Step 1: Environment Setup**
```bash
#!/bin/bash
# Authentication Setup Script

echo "🔧 Setting up Moltbot Authentication..."

# 1. Install required packages
npm install jsonwebtoken speakeasy qrcode
npm install passport passport-google-oauth20 passport-github2
npm install express-session redis ioredis
npm install @types/jsonwebtoken @types/passport

# 2. Create directories
mkdir -p config/auth
mkdir -p middleware/auth
mkdir -p services/auth
mkdir -p utils/auth

# 3. Create configuration files
touch config/auth/jwt.config.js
touch config/auth/oauth2.config.js
touch config/auth/mfa.config.js
touch config/auth/session.config.js

# 4. Generate JWT secret
echo "JWT_SECRET=$(openssl rand -base64 32)" >> .env.local
echo "MFA_SECRET=$(openssl rand -base64 32)" >> .env.local
echo "SESSION_SECRET=$(openssl rand -base64 32)" >> .env.local

echo "✅ Authentication setup completed!"
```

### **Step 2: Configuration**
```javascript
// config/auth/jwt.config.js
module.exports = {
  secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key',
  algorithm: 'HS256',
  expiresIn: '1h',
  refreshTokenExpiresIn: '7d',
  issuer: 'moltbot-auth',
  audience: 'moltbot-api'
};

// config/auth/mfa.config.js
module.exports = {
  enabled: process.env.MFA_ENABLED === 'true',
  required: process.env.MFA_REQUIRED === 'true',
  methods: (process.env.MFA_METHODS || 'totp,sms,email').split(','),
  issuer: 'Moltbot',
  window: 1,
  digits: 6
};

// config/auth/session.config.js
module.exports = {
  secret: process.env.SESSION_SECRET || 'your-session-secret',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  rolling: true,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'strict',
    domain: process.env.COOKIE_DOMAIN,
    path: '/'
  }
};
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
- [OAuth2 Specification](https://tools.ietf.org/html/rfc6749) - OAuth2 RFC
- [JWT Handbook](https://jwt.io/) - JSON Web Token Documentation
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html) - Authentication Best Practices

---

## 🎯 Conclusion

Die **Moltbot Authentication** bietet einen umfassenden, modernen Ansatz für Benutzerauthentifizierung mit OAuth2 Integration, JWT Token Management und Multi-Factor Authentication.

**Key Takeaways:**
1. **OAuth2 Integration** - Standardisierte Authentifizierung
2. **JWT Token Security** - Sichere Token-basierte Authentifizierung
3. **Multi-Factor Authentication** - Zusätzliche Sicherheitsebene
4. **Session Management** - Sichere Sitzungsverwaltung
5. **Privacy by Design** - Datenschutz als Grundprinzip

---

> **🛡️ Ready to implement?** Starte mit unserem [Security Check Tool](/securitycheck) für eine umfassende Analyse deiner Authentication-Systeme.

> **📚 Need more guidance?** Entdecke unsere [AI Runbooks](/runbooks) für detaillierte Authentication-Anleitungen.

> **🤝 Join the community?** Werde Teil der [ClawBot Community](/community) und tausche dich mit anderen Security-Experten aus.

---

*Dieser Guide wird monatlich aktualisiert, um die neuesten Authentication-Best Practices und Threat-Landscape-Veränderungen zu berücksichtigen. Letzte Aktualisierung: April 2024.*
