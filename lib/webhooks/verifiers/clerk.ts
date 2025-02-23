import { WebhookVerifier } from './base';
import { WebhookVerificationResult } from '../types';
import { createHmac } from 'crypto';

export class ClerkWebhookVerifier extends WebhookVerifier {
  async verify(request: Request): Promise<WebhookVerificationResult> {
    try {
      const body = await request.text();
      const svixId = request.headers.get('svix-id');
      const svixTimestamp = request.headers.get('svix-timestamp');
      const svixSignature = request.headers.get('svix-signature');

      if (!svixId || !svixTimestamp || !svixSignature) {
        return {
          isValid: false,
          error: 'Missing required Clerk webhook headers',
          platform: 'clerk',
        };
      }

      // Verify timestamp
      const timestamp = parseInt(svixTimestamp, 10);
      if (!this.isTimestampValid(timestamp)) {
        return {
          isValid: false,
          error: 'Webhook timestamp is too old',
          platform: 'clerk',
        };
      }

      // Construct signed content
      const signedContent = `${svixId}.${svixTimestamp}.${body}`;

      // Get secret bytes (remove whsec_ prefix and decode)
      const secretBytes = Buffer.from(this.secret.split('_')[1], 'base64');

      // Calculate expected signature
      const expectedSignature = createHmac('sha256', secretBytes)
        .update(signedContent)
        .digest('base64');

      // Verify against all provided signatures
      const signatures = svixSignature.split(' ');
      let isValid = false;

      for (const sig of signatures) {
        const [version, signature] = sig.split(',');
        if (
          version === 'v1' &&
          this.safeCompare(signature, expectedSignature)
        ) {
          isValid = true;
          break;
        }
      }

      if (!isValid) {
        return {
          isValid: false,
          error: 'Invalid signature',
          platform: 'clerk',
        };
      }

      return {
        isValid: true,
        platform: 'clerk',
        payload: JSON.parse(body),
        metadata: {
          id: svixId,
          timestamp: svixTimestamp,
        },
      };
    } catch (error) {
      return {
        isValid: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        platform: 'clerk',
      };
    }
  }
}
