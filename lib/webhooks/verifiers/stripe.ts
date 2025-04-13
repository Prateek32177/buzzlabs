import { WebhookVerifier } from './base';
import { WebhookVerificationResult } from '../types';
import { timingSafeEqual, createHmac } from 'crypto';

export class StripeWebhookVerifier extends WebhookVerifier {
  async verify(request: Request): Promise<WebhookVerificationResult> {
    try {
      const signature = request.headers.get('stripe-signature');
      if (!signature) {
        return {
          isValid: false,
          error: 'Missing Stripe signature header',
          platform: 'stripe',
        };
      }

      // Get the raw body for verification
      const rawBody = await request.text();

      // Parse the signature header
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

      // Verify timestamp is within tolerance
      const timestampNum = parseInt(timestamp, 10);
      if (!this.isTimestampValid(timestampNum)) {
        return {
          isValid: false,
          error: 'Stripe webhook timestamp expired',
          platform: 'stripe',
        };
      }

      // Create the signed payload
      const signedPayload = `${timestamp}.${rawBody}`;

      // Create HMAC with SHA-256
      const hmac = createHmac('sha256', this.secret);
      hmac.update(signedPayload);
      const expectedSignature = hmac.digest('hex');

      // Compare signatures using timing-safe comparison
      const isValid = this.safeCompare(sig, expectedSignature);

      if (!isValid) {
        return {
          isValid: false,
          error: 'Invalid Stripe signature',
          platform: 'stripe',
        };
      }

      // Parse the body as JSON for metadata extraction
      let payload;
      try {
        payload = JSON.parse(rawBody);
      } catch (e) {
        // If we can't parse the body, still return valid but with empty payload
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
      return {
        isValid: false,
        error: `Stripe verification error: ${(error as Error).message}`,
        platform: 'stripe',
      };
    }
  }
}
