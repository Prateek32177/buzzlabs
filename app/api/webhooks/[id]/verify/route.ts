import { createClient } from '@/utils/supabase/server';
import { Encryption } from '@/utils/encryption';
import { WebhookSecurity } from '@/utils/webhook-security';
export async function POST(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const body = await req.json();
    const signature = req.headers.get('x-webhook-signature');
    const supabase = createClient();
    // Get webhook config from database
    const { data: webhook, error } = await (await supabase)
      .from('webhooks')
      .select('secret')
      .eq('id', params.id)
      .single();

    if (error || !webhook) {
      return Response.json({ error: 'Webhook not found' }, { status: 404 });
    }

    // Decrypt secret
    const webhookSecret = await Encryption.decrypt(webhook.secret);

    // Verify signature
    const isValid = WebhookSecurity.verifySignature(
      JSON.stringify(body),
      signature!,
      webhookSecret,
    );

    if (!isValid) {
      return Response.json({ error: 'Invalid signature' }, { status: 401 });
    }

    // Process webhook...
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: 'Verification failed' }, { status: 500 });
  }
}
