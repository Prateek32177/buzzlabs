import { WebhookSecurity } from '@/utils/webhook-security';
import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import { checkActionAllowed } from '@/lib/analytics/usage';

export async function GET(req: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: webhooks, error } = await supabase
      .from('webhooks')
      .select('*')
      .eq('user_id', user.id);

    if (webhooks?.length === 0) {
      return NextResponse.json([]);
    }
    if (error) throw error;

    const url = new URL(req.url);
    const fields = url.searchParams.get('fields');
    // Map database fields to frontend expected format
    const formattedWebhooks = await Promise.all(
      webhooks.map(async webhook => {
        if (fields === 'templates') {
          return {
            id: webhook.id,
            name: webhook.name,
          };
        }

        return {
          id: webhook.id,
          name: webhook.name,
          url: webhook.url,
          is_active: webhook.is_active,
          platformConfig: webhook.platformConfig,
          notify_email: webhook.notify_email,
          notify_slack: webhook.notify_slack,
          email_config: webhook.email_config,
          slack_config: webhook.slack_config,
        };
      }),
    );
    return NextResponse.json(formattedWebhooks);
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch webhooks` },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const { name, platform = 'supabase' } = await req.json();
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { allowed, reason, usageDetails } = await checkActionAllowed(
      user.id,
      'webhook',
    );
    if (!allowed) {
      return NextResponse.json(
        {
          error: 'Rate limit exceeded',
          details: reason,
        },
        { status: 429 },
      );
    }

    const webhookSecret = WebhookSecurity.generateSecret();
    const webhookId = crypto.randomUUID();

    const getPlatformConfig = (platform: string) => {
      const configs: Record<string, any> = {
        custom: {
          webhook_id: webhookId,
          webhook_token: webhookSecret,
        },
        supabase: {
          webhook_id: webhookId,
          webhook_token: webhookSecret,
        },
        clerk: {
          webhook_id: webhookId,
          signing_secret: webhookSecret || '',
        },
        stripe: {
          webhook_id: webhookId,
          signing_secret: webhookSecret || '',
        },
        github: {
          webhook_id: webhookId,
          signing_secret: webhookSecret || '',
        },
        shopify: {
          webhook_id: webhookId,
          signing_secret: webhookSecret || '',
        },
        vercel: {
          webhook_id: webhookId,
          signing_secret: webhookSecret || '',
        },
        polar: {
          webhook_id: webhookId,
          signing_secret: webhookSecret || '',
        },
        dodopayments: {
          webhook_id: webhookId,
          signing_secret: webhookSecret || '',
        },
      };

      return configs[platform as keyof typeof configs] || {};
    };

    const { data: webhook, error } = await supabase
      .from('webhooks')
      .insert({
        id: webhookId,
        user_id: user.id,
        name,
        platformConfig: Array.isArray(platform)
          ? platform.reduce((configs: Record<string, any>, p: string) => {
              configs[p] = getPlatformConfig(p);
              return configs;
            }, {})
          : { [platform]: getPlatformConfig(platform) },
        url: `/api/webhooks/${webhookId}/verify`,
        is_active: true,
        notify_email: false,
        notify_slack: false,
        email_config: {},
        slack_config: {},
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      id: webhook.id,
      name: webhook.name,
      url: webhook.url,
      is_active: webhook.is_active,
      notify_email: webhook.notify_email,
      notify_slack: webhook.notify_slack,
      email_config: webhook.email_config,
      slack_config: webhook.slack_config,
      platformConfig: webhook.platformConfig,
    });
  } catch (error) {
    console.error('Create webhook error:', error);
    return Response.json(
      { error: 'Failed to create webhook' },
      { status: 500 },
    );
  }
}
