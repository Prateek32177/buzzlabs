import { WebhookVerifier } from './base';
import { WebhookVerificationResult } from '../types';
import { timingSafeEqual, createHmac } from 'crypto';

export class StripeWebhookVerifier extends WebhookVerifier {
  async verify(request: Request): Promise<WebhookVerificationResult> {
    try {
      // Check for both possible header names
      const signature = request.headers.get('stripe-signature') || request.headers.get('x-stripe-signature');
      
      if (!signature) {
        return {
          isValid: false,
          error: 'Missing Stripe signature header',
          platform: 'stripe',
        };
      }

      // Get the raw body for verification
      const rawBody = await request.text();

      // Step 1: Extract the timestamp and signatures from the header
      const sigParts = signature.split(',');
      const sigMap: Record<string, string> = {};

      for (const part of sigParts) {
        const [key, value] = part.split('=');
        if (key && value) {
          sigMap[key] = value;
        }
      }

      const timestamp = sigMap['t'];
      const sig = sigMap['v1']; // Only use v1 signatures as per Stripe docs

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

      // Step 2: Prepare the signed_payload string
      const signedPayload = `${timestamp}.${rawBody}`;

      // Step 3: Determine the expected signature
      const hmac = createHmac('sha256', this.secret);
      hmac.update(signedPayload);
      const expectedSignature = hmac.digest('hex');

      // Step 4: Compare the signatures using constant-time comparison
      const isValid = this.safeCompare(sig, expectedSignature);

      if (!isValid) {
        console.error('Stripe signature verification failed:', {
          received: sig,
          expected: expectedSignature,
          timestamp,
          bodyLength: rawBody.length,
          signedPayload: signedPayload.substring(0, 50) + '...', // Log first 50 chars for debugging
        });
        
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
      console.error('Stripe verification error:', error);
      return {
        isValid: false,
        error: `Stripe verification error: ${(error as Error).message}`,
        platform: 'stripe',
      };
    }
  }
}
