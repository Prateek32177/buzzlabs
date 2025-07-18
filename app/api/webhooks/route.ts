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
    const { name, platform = ['supabase', 'custom'] } = await req.json();
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { allowed, reason } = await checkActionAllowed(user.id, 'webhook');
    if (!allowed) {
      return NextResponse.json(
        {
          error: 'Rate limit exceeded',
          details: reason,
        },
        { status: 429 },
      );
    }

    const webhookId = crypto.randomUUID();

    const getPlatformConfig = (platform: string) => {
      const platformSecret = WebhookSecurity.generateSecret();

      const configs: Record<string, any> = {
        custom: {
          webhook_id: webhookId,
          webhook_token: platformSecret,
        },
        supabase: {
          webhook_id: webhookId,
          webhook_token: platformSecret,
        },
        clerk: {
          webhook_id: webhookId,
          signing_secret: platformSecret,
        },
        stripe: {
          webhook_id: webhookId,
          signing_secret: platformSecret,
        },
        github: {
          webhook_id: webhookId,
          signing_secret: platformSecret,
        },
        shopify: {
          webhook_id: webhookId,
          signing_secret: platformSecret,
        },
        vercel: {
          webhook_id: webhookId,
          signing_secret: platformSecret,
        },
        polar: {
          webhook_id: webhookId,
          signing_secret: platformSecret,
        },
        dodopayments: {
          webhook_id: webhookId,
          signing_secret: platformSecret,
        },
      };

      return configs[platform as keyof typeof configs] || {};
    };

    const platforms: string[] = Array.isArray(platform) ? platform : [platform];

    const platformConfig = platforms.reduce(
      (configs: Record<string, any>, p: string) => {
        configs[p] = getPlatformConfig(p);
        return configs;
      },
      {},
    );

    const { data: webhook, error } = await supabase
      .from('webhooks')
      .insert({
        id: webhookId,
        user_id: user.id,
        name,
        platformConfig,
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
    return NextResponse.json(
      { error: 'Failed to create webhook' },
      { status: 500 },
    );
  }
}
