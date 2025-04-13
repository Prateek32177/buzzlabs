import {
  WebhookConfig,
  WebhookVerificationResult,
  WebhookPlatform,
} from './types';
import { ClerkWebhookVerifier } from './verifiers/clerk';
import { CustomWebhookVerifier } from './verifiers/custom';
import { GithubWebhookVerifier } from './verifiers/github';
import { StripeWebhookVerifier } from './verifiers/stripe';
// import { ShopifyWebhookVerifier } from './verifiers/shopify';
// import { VercelWebhookVerifier } from './verifiers/vercel';
// import { PolarWebhookVerifier } from './verifiers/polar';
// import { SupabaseWebhookVerifier } from './verifiers/supabase';

export class WebhookVerificationService {
  static async verify(
    request: Request,
    config: WebhookConfig,
  ): Promise<WebhookVerificationResult> {
    const verifier = this.getVerifier(config);
    return await verifier.verify(request);
  }

  private static getVerifier(config: WebhookConfig) {
    // Normalize platform name to lowercase for case-insensitive matching
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
      // case 'shopify':
      //   return new ShopifyWebhookVerifier(
      //     config.secret,
      //     config.toleranceInSeconds,
      //   );
      // case 'vercel':
      //   return new VercelWebhookVerifier(
      //     config.secret,
      //     config.toleranceInSeconds,
      //   );
      // case 'polar':
      //   return new PolarWebhookVerifier(
      //     config.secret,
      //     config.toleranceInSeconds,
      //   );
      // case 'supabase':
      //   return new SupabaseWebhookVerifier(
      //     config.secret,
      //     config.toleranceInSeconds,
      //   );
      case 'custom':
        return new CustomWebhookVerifier(
          config.secret,
          config.toleranceInSeconds,
        );
      default:
        // For unknown platforms, use a generic verifier that accepts all requests
        // This can be replaced with a more secure default in production
        return {
          verify: async () => ({
            isValid: true,
            platform: 'custom' as WebhookPlatform,
          }),
        };
    }
  }
}
