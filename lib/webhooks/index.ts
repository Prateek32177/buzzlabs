import { WebhookConfig, WebhookVerificationResult } from './types';
import { ClerkWebhookVerifier } from './verifiers/clerk';
import { CustomWebhookVerifier } from './verifiers/custom';

export class WebhookVerificationService {
  static async verify(
    request: Request,
    config: WebhookConfig,
  ): Promise<WebhookVerificationResult> {
    const verifier = this.getVerifier(config);
    return await verifier.verify(request);
  }

  private static getVerifier(config: WebhookConfig) {
    switch (config.platform) {
      case 'clerk':
        return new ClerkWebhookVerifier(
          config.secret,
          config.toleranceInSeconds,
        );
      case 'custom':
        return new CustomWebhookVerifier(
          config.secret,
          config.toleranceInSeconds,
        );
      default:
        return {
          verify: async () => ({
            isValid: true,
          }),
        };
    }
  }
}
