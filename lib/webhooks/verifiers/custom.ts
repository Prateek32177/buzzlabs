import { WebhookVerifier } from './base';
import { WebhookVerificationResult } from '../types';
import { SecureWebhookService } from '@/utils/encryption';

export class CustomWebhookVerifier extends WebhookVerifier {
  async verify(request: Request): Promise<WebhookVerificationResult> {
    try {
      const webhookId = request.headers.get('x-webhook-id');
      const authToken = request.headers.get('x-webhook-token');

      if (!webhookId || !authToken) {
        return {
          isValid: false,
          error: 'Missing required webhook headers',
          platform: 'custom',
        };
      }

      const decryptedToken =
        await SecureWebhookService.getWebhookSecret(webhookId);

      if (!this.safeCompare(authToken, decryptedToken)) {
        return {
          isValid: false,
          error: 'Invalid token',
          platform: 'custom',
        };
      }

      const body = await request.json();

      return {
        isValid: true,
        platform: 'custom',
        payload: body,
        metadata: {
          id: webhookId,
        },
      };
    } catch (error) {
      return {
        isValid: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        platform: 'custom',
      };
    }
  }
}
