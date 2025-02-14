// utils/encryption.ts
import { randomBytes, createCipheriv, createDecipheriv, scrypt } from 'crypto';
import { promisify } from 'util';
import { createClient } from './supabase/server';

const algorithm = 'aes-256-gcm';
const scryptAsync = promisify(scrypt);

interface EncryptedData {
  encrypted: string; // Base64 encoded encrypted data
  iv: string; // Base64 encoded initialization vector
  authTag: string; // Base64 encoded authentication tag
  salt: string; // Base64 encoded salt
}

export class Encryption {
  private static async deriveKey(salt: Buffer): Promise<Buffer> {
    const masterKey = process.env.ENCRYPTION_MASTER_KEY;
    if (!masterKey) {
      throw new Error(
        'ENCRYPTION_MASTER_KEY is not set in environment variables',
      );
    }
    return (await scryptAsync(masterKey, salt, 32)) as Buffer;
  }

  static async encrypt(text: string): Promise<string> {
    try {
      const salt = randomBytes(32);
      const iv = randomBytes(16);
      const key = await this.deriveKey(salt);

      const cipher = createCipheriv(algorithm, key, iv);
      let encrypted = cipher.update(text, 'utf8', 'base64');
      encrypted += cipher.final('base64');

      const authTag = cipher.getAuthTag();

      const encryptedData: EncryptedData = {
        encrypted,
        iv: iv.toString('base64'),
        authTag: authTag.toString('base64'),
        salt: salt.toString('base64'),
      };

      // Pack the encrypted data for storage
      return this.packEncryptedData(encryptedData);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Encryption failed: ${error.message}`);
      }
      throw new Error('Encryption failed: Unknown error');
    }
  }

  static async decrypt(packedData: string): Promise<string> {
    try {
      const encryptedData = this.unpackEncryptedData(packedData);

      const iv = Buffer.from(encryptedData.iv, 'base64');
      const authTag = Buffer.from(encryptedData.authTag, 'base64');
      const salt = Buffer.from(encryptedData.salt, 'base64');

      const key = await this.deriveKey(salt);

      const decipher = createDecipheriv(algorithm, key, iv);
      decipher.setAuthTag(authTag);

      let decrypted = decipher.update(
        encryptedData.encrypted,
        'base64',
        'utf8',
      );
      decrypted += decipher.final('utf8');

      return decrypted;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Decryption failed: ${error.message}`);
      }
      throw new Error('Decryption failed: Unknown error');
    }
  }

  private static packEncryptedData(encryptedData: EncryptedData): string {
    return JSON.stringify(encryptedData);
  }

  private static unpackEncryptedData(packedData: string): EncryptedData {
    try {
      return JSON.parse(packedData) as EncryptedData;
    } catch (error) {
      throw new Error('Invalid encrypted data format');
    }
  }
}

// Usage examples with TypeScript types
interface DatabaseRecord {
  id: string;
  encrypted_data: string; // Packed encrypted data
}

// Example service using the encryption utility
export class SecureWebhookService {
  /**
   * Store a webhook secret securely
   */
  static async storeWebhookSecret(webhookId: string, secret: string) {
    try {
      // Encrypt the secret
      const encryptedData = await Encryption.encrypt(secret);
      const supabase = createClient();
      // Pack the encrypted data for storage
      const packedData = encryptedData;

      // Store in database
      const { data, error } = await (await supabase)
        .from('webhooks')
        .update({ encrypted_secret: packedData })
        .eq('id', webhookId);

      if (error) throw error;

      return true;
    } catch (error) {
      console.error('Failed to store webhook secret:', error);
      throw error;
    }
  }

  /**
   * Retrieve and decrypt a webhook secret
   */
  static async getWebhookSecret(webhookId: string): Promise<string> {
    try {
      // Get from database
      const supabase = createClient();
      const { data, error } = await (await supabase)
        .from('webhooks')
        .select('encrypted_secret')
        .eq('id', webhookId)
        .single();

      if (error || !data) throw new Error('Webhook not found');

      // Decrypt the secret
      return await Encryption.decrypt(data.encrypted_secret);
    } catch (error) {
      console.error('Failed to retrieve webhook secret:', error);
      throw error;
    }
  }
}
