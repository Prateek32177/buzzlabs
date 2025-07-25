import {
  WebhookConfig,
  WebhookVerificationResult,
  WebhookPlatform,
} from './types';
import { ClerkWebhookVerifier } from './verifiers/clerk';
import { GithubWebhookVerifier } from './verifiers/github';
import { StripeWebhookVerifier } from './verifiers/stripe';
import { DodoPaymentsWebhookVerifier } from './verifiers/dodo';

export class WebhookVerificationService {
  static async verify(
    request: Request,
    config: WebhookConfig,
  ): Promise<WebhookVerificationResult> {
    const verifier = this.getVerifier(config);
    return await verifier.verify(request);
  }

  private static getVerifier(config: WebhookConfig) {
    const platform = config.platform.toLowerCase() as WebhookPlatform;

    switch (platform) {
      case 'clerk':
        return new ClerkWebhookVerifier(
          config.secret,
          config.toleranceInSeconds,
        );
      case 'github':
        return new GithubWebhookVerifier(
          config.secret,
          config.toleranceInSeconds,
        );
      case 'stripe':
        return new StripeWebhookVerifier(
          config.secret,
          config.toleranceInSeconds,
        );
      case 'dodopayments':
        return new DodoPaymentsWebhookVerifier(
          config.secret,
          config.toleranceInSeconds,
        );

      default:
        return {
          verify: async () => ({
            isValid: true,
            platform: 'custom' as WebhookPlatform,
          }),
        };
    }
  }
}
