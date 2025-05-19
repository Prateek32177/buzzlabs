import { WebhookVerifier } from './base';
import { WebhookVerificationResult } from '../types';
import { Webhook, WebhookUnbrandedRequiredHeaders } from 'standardwebhooks';

export class DodoPaymentsWebhookVerifier extends WebhookVerifier {
  async verify(request: Request): Promise<WebhookVerificationResult> {
    try {
      const rawBody = await request.text();

      const webhookId = request.headers.get('webhook-id');
      const webhookTimestamp = request.headers.get('webhook-timestamp');
      const webhookSignature = request.headers.get('webhook-signature');

      if (!webhookId || !webhookTimestamp || !webhookSignature) {
        return {
          isValid: false,
          error: 'Missing required Dodo Payments webhook headers',
          platform: 'dodoPayments',
        };
      }

      const timestamp = parseInt(webhookTimestamp, 10);
      if (!this.isTimestampValid(timestamp)) {
        return {
          isValid: false,
          error: 'Webhook timestamp is too old',
          platform: 'dodoPayments',
        };
      }

      const webhook = new Webhook(this.secret);

      const headers: WebhookUnbrandedRequiredHeaders = {
        'webhook-id': webhookId,
        'webhook-signature': webhookSignature,
        'webhook-timestamp': webhookTimestamp,
      };

      const verifiedPayload = await webhook.verify(rawBody, headers);

      return {
        isValid: true,
        platform: 'dodoPayments',
        payload: verifiedPayload,
        metadata: {
          id: webhookId,
          timestamp: webhookTimestamp,
        },
      };
    } catch (error) {
      return {
        isValid: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        platform: 'dodoPayments',
      };
    }
  }
}
