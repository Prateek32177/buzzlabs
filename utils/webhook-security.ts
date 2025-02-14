import { createHmac, timingSafeEqual, randomBytes } from 'crypto';

export class WebhookSecurity {
  // Generate a secure webhook secret for the user
  static generateSecret(): string {
    return randomBytes(32).toString('hex');
  }

  // Generate HMAC signature for outgoing payload
  static generateSignature(payload: string, secret: string): string {
    const hmac = createHmac('sha256', secret);
    return hmac.update(payload).digest('hex');
  }

  // Verify incoming webhook signature
  static verifySignature(
    payload: string,
    signature: string,
    secret: string,
  ): boolean {
    if (!payload || !signature || !secret) {
      return false;
    }

    const expectedSignature = this.generateSignature(payload, secret);
    const providedSignature = Buffer.from(signature);
    const expectedSignatureBuffer = Buffer.from(expectedSignature);

    return timingSafeEqual(providedSignature, expectedSignatureBuffer);
  }

  // Generate timestamp for additional security
  static generateTimestamp(): number {
    return Math.floor(Date.now() / 1000);
  }

  // Create a signed payload with timestamp
  static createSignedPayload(payload: any, secret: string) {
    const timestamp = this.generateTimestamp();
    const stringifiedPayload = JSON.stringify(payload);
    const payloadWithTimestamp = `${timestamp}.${stringifiedPayload}`;
    const signature = this.generateSignature(payloadWithTimestamp, secret);

    return {
      timestamp,
      signature,
      payload: stringifiedPayload,
    };
  }
}
