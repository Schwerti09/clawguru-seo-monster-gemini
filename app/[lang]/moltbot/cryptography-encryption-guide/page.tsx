import { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface PageProps { params: { lang: string }; }
const LANGS = ['de','en','es','fr','pt','it','ru','zh','ja','ko','ar','hi','tr','pl','nl'];

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = params;
  return {
    title: 'Moltbot Cryptography & Encryption Guide: AES, RSA, Hashing 2024',
    description: 'Kryptografie für Moltbot. AES-256 Verschlüsselung, RSA Schlüsselmanagement, Hashing-Algorithmen, Key Rotation und sichere Implementierung.',
    keywords: ['moltbot cryptography','aes encryption','rsa key management','hashing algorithms','key rotation','secure crypto implementation'],
    authors: [{ name: 'ClawGuru Security Team' }],
    openGraph: { title: 'Moltbot Cryptography & Encryption Guide 2024', description: 'Kryptografie für Moltbot.', type: 'article', url: `https://clawguru.org/${lang}/moltbot/cryptography-encryption-guide` },
    alternates: { canonical: `https://clawguru.org/${lang}/moltbot/cryptography-encryption-guide`, languages: Object.fromEntries(LANGS.map(l => [l, `https://clawguru.org/${l}/moltbot/cryptography-encryption-guide`])) },
    robots: 'index, follow',
  };
}

export default function MoltbotCryptoPage({ params }: PageProps) {
  const { lang } = params;
  if (!LANGS.includes(lang)) notFound();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Trust-Anker</strong>: Kryptografie schützt eigene Daten. Keine Angriffswerkzeuge.
        </div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">Moltbot Cryptography &amp; Encryption Guide</h1>
        <p className="text-lg text-gray-300 mb-8">Schwache Verschlüsselung ist kein Schutz. AES-256, RSA-4096, PBKDF2 und Key Rotation sind heute Minimum-Standards.</p>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Verschlüsselungs-Algorithmen</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead><tr className="bg-gray-800 text-white"><th className="p-3 text-left">Algorithmus</th><th className="p-3 text-left">Use Case</th><th className="p-3 text-left">Schlüsselgröße</th><th className="p-3 text-left">Status</th></tr></thead>
              <tbody>
                {[
                  ['AES-256-GCM', 'Datenverschlüsselung', '256-bit', 'Empfohlen'],
                  ['ChaCha20-Poly1305', 'Mobile/Streaming', '256-bit', 'Empfohlen'],
                  ['RSA-OAEP', 'Key Exchange', '4096-bit', 'Empfohlen'],
                  ['ECDSA', 'Digitale Signature', 'P-256/P-384', 'Empfohlen'],
                  ['SHA-256', 'Hashing', '256-bit', 'Empfohlen'],
                  ['SHA-3', 'Hashing (Future)', '256/512-bit', 'Optional'],
                ].map(([algo, use, key, status]) => (
                  <tr key={algo} className="border-b hover:bg-gray-800">
                    <td className="p-3 font-medium">{algo}</td>
                    <td className="p-3 text-sm">{use}</td>
                    <td className="p-3 text-sm">{key}</td>
                    <td className="p-3 text-sm">{status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">AES-256 Implementation</h2>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
            <pre>{`// AES-256-GCM Verschlüsselung für Moltbot
const crypto = require('crypto');

class AESEncryption {
  constructor(key) {
    this.key = Buffer.from(key, 'hex');
    this.algorithm = 'aes-256-gcm';
    this.ivLength = 16;
    this.tagLength = 16;
  }
  
  encrypt(plaintext) {
    const iv = crypto.randomBytes(this.ivLength);
    const cipher = crypto.createCipher(this.algorithm, this.key, iv);
    
    let encrypted = cipher.update(plaintext, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const tag = cipher.getAuthTag();
    
    return {
      iv: iv.toString('hex'),
      encrypted,
      tag: tag.toString('hex')
    };
  }
  
  decrypt(encryptedData) {
    const iv = Buffer.from(encryptedData.iv, 'hex');
    const tag = Buffer.from(encryptedData.tag, 'hex');
    
    const decipher = crypto.createDecipher(this.algorithm, this.key, iv);
    decipher.setAuthTag(tag);
    
    let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }
}

// Key Management
const masterKey = process.env.MASTER_KEY; // 64-hex chars
const encryption = new AESEncryption(masterKey);

// Beispiel: API-Keys verschlüsseln
const apiKey = 'sk_test_4242424242424242';
const encrypted = encryption.encrypt(apiKey);
console.log('Encrypted:', encrypted);`}</pre>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">RSA Key Management</h2>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
            <pre>{`// RSA-4096 Key Generation und Management
const { generateKeyPair, publicEncrypt, privateDecrypt } = require('crypto');

class RSAKeyManager {
  constructor() {
    this.keyPair = null;
  }
  
  generateKeyPair() {
    this.keyPair = crypto.generateKeyPairSync('rsa', {
      modulusLength: 4096,
      publicKeyEncoding: { type: 'spki', format: 'pem' },
      privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
    });
    return this.keyPair;
  }
  
  encryptWithPublicKey(data, publicKey) {
    return crypto.publicEncrypt(
      { key: publicKey, padding: crypto.constants.RSA_PKCS1_OAEP_PADDING, oaepHash: 'sha256' },
      Buffer.from(data)
    ).toString('base64');
  }
  
  decryptWithPrivateKey(encryptedData, privateKey) {
    return crypto.privateDecrypt(
      { key: privateKey, padding: crypto.constants.RSA_PKCS1_OAEP_PADDING, oaepHash: 'sha256' },
      Buffer.from(encryptedData, 'base64')
    ).toString();
  }
}

// Key Rotation Schedule
class KeyRotationManager {
  constructor(keyManager) {
    this.keyManager = keyManager;
    this.currentKeyId = 'key-2024-01';
    this.keys = new Map();
  }
  
  async rotateKeys() {
    const newKeyPair = this.keyManager.generateKeyPair();
    const newKeyId = 'key-' + new Date().toISOString().slice(0, 7);
    
    // Store new key
    this.keys.set(newKeyId, {
      publicKey: newKeyPair.publicKey,
      privateKey: newKeyPair.privateKey,
      createdAt: new Date(),
      status: 'active'
    });
    
    // Mark old key as deprecated
    const oldKey = this.keys.get(this.currentKeyId);
    if (oldKey) {
      oldKey.status = 'deprecated';
      oldKey.deprecatedAt = new Date();
    }
    
    this.currentKeyId = newKeyId;
    
    return newKeyId;
  }
}`}</pre>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Secure Hashing</h2>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
            <pre>{`// Sicheres Hashing mit Salt und Pepper
const crypto = require('crypto');

class SecureHashing {
  constructor(pepper) {
    this.pepper = Buffer.from(pepper, 'hex');
    this.iterations = 100000;
  }
  
  hash(password, salt) {
    const saltedPassword = Buffer.concat([
      Buffer.from(password, 'utf8'),
      salt,
      this.pepper
    ]);
    
    return crypto.pbkdf2Sync(
      saltedPassword,
      salt,
      this.iterations,
      64,
      'sha512'
    ).toString('hex');
  }
  
  verify(password, salt, hash) {
    const computedHash = this.hash(password, salt);
    return crypto.timingSafeEqual(
      Buffer.from(hash, 'hex'),
      Buffer.from(computedHash, 'hex')
    );
  }
  
  generateSalt() {
    return crypto.randomBytes(32);
  }
}

// Beispiel: User Password Hashing
const pepper = process.env.PEPPER; // 64-hex chars
const hashing = new SecureHashing(pepper);

const password = 'user_password_123';
const salt = hashing.generateSalt();
const hash = hashing.hash(password, salt);

console.log('Hash:', hash);
console.log('Verified:', hashing.verify(password, salt, hash));`}</pre>
  </div>
</section>

<section className="mb-10">
  <h2 className="text-2xl font-semibold mb-4 text-gray-100">Resources</h2>
  <ul className="list-disc pl-4 space-y-2">
    <li><a href="https://clawguru.org/de/security/aes-256-encryption" target="_blank" rel="noopener noreferrer">AES-256 Encryption Guide</a></li>
    <li><a href="https://clawguru.org/de/security/rsa-key-management" target="_blank" rel="noopener noreferrer">RSA Key Management</a></li>
    <li><a href="https://clawguru.org/de/security/secure-hashing" target="_blank" rel="noopener noreferrer">Secure Hashing Guide</a></li>
    <li><a href="https://clawguru.org/de/security/key-rotation" target="_blank" rel="noopener noreferrer">Key Rotation Best Practices</a></li>
  </ul>
</section>
</div>
</div>
);
}