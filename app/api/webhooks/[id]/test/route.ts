import { createClient } from '@/utils/supabase/server';
import { Encryption } from '@/utils/encryption';

export async function POST(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const supabase = createClient();
    const payload = await req.json();

    // Get webhook config
    const { data: webhook, error } = await (await supabase)
      .from('webhooks')
      .select('*')
      .eq('id', params.id)
      .single();

    if (error || !webhook) {
      return Response.json({ error: 'Webhook not found' }, { status: 404 });
    }

    // Decrypt token
    const token = await Encryption.decrypt(webhook.secret);

    // Forward the request to the actual webhook URL
    const response = await fetch(webhook.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-webhook-token': token,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error('Webhook delivery failed');
    }

    return Response.json({
      success: true,
      message: 'Test webhook sent successfully',
    });
  } catch (error) {
    return Response.json(
      {
        error: 'Failed to send test webhook',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
