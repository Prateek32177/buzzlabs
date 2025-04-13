import { WebhookVerifier } from './base';
import { WebhookVerificationResult } from '../types';
import { timingSafeEqual, createHmac } from 'crypto';

export class GithubWebhookVerifier extends WebhookVerifier {
  async verify(request: Request): Promise<WebhookVerificationResult> {
    try {
      const signature = request.headers.get('x-hub-signature-256');
      if (!signature) {
        return {
          isValid: false,
          error: 'Missing GitHub signature header',
          platform: 'github',
        };
      }

      // Get the raw body for verification
      const rawBody = await request.text();

      // Create HMAC with SHA-256
      const hmac = createHmac('sha256', this.secret);
      hmac.update(rawBody);
      const expectedSignature = `sha256=${hmac.digest('hex')}`;

      // Compare signatures using timing-safe comparison
      const isValid = this.safeCompare(signature, expectedSignature);

      if (!isValid) {
        return {
          isValid: false,
          error: 'Invalid GitHub signature',
          platform: 'github',
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
          platform: 'github',
          metadata: {
            event: request.headers.get('x-github-event'),
            delivery: request.headers.get('x-github-delivery'),
          },
        };
      }

      return {
        isValid: true,
        platform: 'github',
        payload,
        metadata: {
          event: request.headers.get('x-github-event'),
          delivery: request.headers.get('x-github-delivery'),
          timestamp: new Date().toISOString(),
        },
      };
    } catch (error) {
      return {
        isValid: false,
        error: `GitHub verification error: ${(error as Error).message}`,
        platform: 'github',
      };
    }
  }
}
