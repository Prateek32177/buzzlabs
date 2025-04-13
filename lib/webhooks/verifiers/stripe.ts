import { WebhookVerifier } from './base';
import { WebhookVerificationResult } from '../types';
import { timingSafeEqual, createHmac } from 'crypto';

export class StripeWebhookVerifier extends WebhookVerifier {
  async verify(request: Request): Promise<WebhookVerificationResult> {
    try {
      const signature =
        request.headers.get('Stripe-Signature') ||
        request.headers.get('stripe-signature') ||
        request.headers.get('x-stripe-signature');

      if (!signature) {
        return {
          isValid: false,
          error: 'Missing Stripe signature header',
          platform: 'stripe',
        };
      }

      const rawBody = await request.text();

      const sigParts = signature.split(',');
      const sigMap: Record<string, string> = {};

      for (const part of sigParts) {
        const [key, value] = part.split('=');
        if (key && value) {
          sigMap[key] = value;
        }
      }

      const timestamp = sigMap['t'];
      const sig = sigMap['v1'];

      if (!timestamp || !sig) {
        return {
          isValid: false,
          error: 'Invalid Stripe signature format',
          platform: 'stripe',
        };
      }

      const timestampNum = parseInt(timestamp, 10);
      if (!this.isTimestampValid(timestampNum)) {
        return {
          isValid: false,
          error: 'Stripe webhook timestamp expired',
          platform: 'stripe',
        };
      }

      const signedPayload = `${timestamp}.${rawBody}`;

      const hmac = createHmac('sha256', this.secret);
      hmac.update(signedPayload);
      const expectedSignature = hmac.digest('hex');

      const isValid = this.safeCompare(sig, expectedSignature);

      if (!isValid) {
        console.error('Stripe signature verification failed:', {
          received: sig,
          expected: expectedSignature,
          timestamp,
          bodyLength: rawBody.length,
          signedPayload: signedPayload.substring(0, 50) + '...',
        });
        return {
          isValid: false,
          error: 'Invalid Stripe signature',
          platform: 'stripe',
        };
      }

      let payload;
      try {
        payload = JSON.parse(rawBody);
      } catch (e) {
        return {
          isValid: true,
          platform: 'stripe',
          metadata: {
            timestamp,
            id: sigMap['id'],
          },
        };
      }

      return {
        isValid: true,
        platform: 'stripe',
        payload,
        metadata: {
          timestamp,
          id: sigMap['id'],
        },
      };
    } catch (error) {
      console.error('Stripe verification error:', error);
      return {
        isValid: false,
        error: `Stripe verification error: ${(error as Error).message}`,
        platform: 'stripe',
      };
    }
  }
}
