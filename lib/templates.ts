export enum TemplateType {
  EMAIL = 'email',
  SLACK = 'slack',
}

type Template = {
  id: string;
  name: string;
  type: TemplateType;
  render: (data: any) => any;
};
import { slackTemplates } from './slack-templates';
export const emailTemplates: Template[] = [
  {
    id: 'template1',
    name: 'GitHub Push Event',
    type: TemplateType.EMAIL,
    render: data => ({
      subject: `🔧 New Push to ${data.repository?.full_name || 'your repository'}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto; border:1px solid #e5e7eb; border-radius:8px; overflow:hidden;">
          <div style="background:#24292f; color:#ffffff; padding:16px;">
            <h2 style="margin:0;">🔧 GitHub Push Event</h2>
          </div>
          <div style="padding:16px;">
            <p><strong>Repository:</strong> ${data.repository?.full_name || 'example/repo'}</p>
            <p><strong>Pusher:</strong> ${data.pusher?.name || 'john_doe'}</p>
            <p><strong>Commits:</strong> ${data.commits?.length || 1}</p>
            <a href="${data.compare || '#'}" style="color:#3b82f6; text-decoration:underline;">View Changes</a>
          </div>
          <div style="text-align:center; font-size:12px; color:#6b7280; padding:16px;">
            Sent by <a href="https://hookflo.com" style="color:#3b82f6; text-decoration:none;">hookflo</a>
          </div>
        </div>`,
    }),
  },
  {
    id: 'template2',
    name: 'GitHub Pull Request',
    type: TemplateType.EMAIL,
    render: data => ({
      subject: `📄 PR ${data.action || 'opened'}: ${data.pull_request?.title || 'Untitled'}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto; border:1px solid #e5e7eb; border-radius:8px; overflow:hidden;">
          <div style="background:#24292f; color:#ffffff; padding:16px;">
            <h2 style="margin:0;">📄 Pull Request ${data.action || 'opened'}</h2>
          </div>
          <div style="padding:16px;">
            <p><strong>Title:</strong> ${data.pull_request?.title || 'Fix login issue'}</p>
            <p><strong>Author:</strong> ${data.pull_request?.user?.login || 'contributor'}</p>
            <a href="${data.pull_request?.html_url || '#'}" style="color:#3b82f6; text-decoration:underline;">View PR</a>
          </div>
          <div style="text-align:center; font-size:12px; color:#6b7280; padding:16px;">
            Sent by <a href="https://hookflo.com" style="color:#3b82f6; text-decoration:none;">hookflo</a>
          </div>
        </div>`,
    }),
  },
  {
    id: 'template3',
    name: 'Supabase Auth Event',
    type: TemplateType.EMAIL,
    render: data => ({
      subject: `⚡ Auth Event: ${data.event_type || 'user_signed_up'}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto; border:1px solid #e5e7eb; border-radius:8px; overflow:hidden;">
          <div style="background:#000000; color:#ffffff; padding:16px;">
            <h2 style="margin:0;">⚡ Supabase Auth Event</h2>
          </div>
          <div style="padding:16px;">
            <p><strong>Event Type:</strong> ${data.event_type || 'INSERT'}</p>
            <p><strong>Email:</strong> ${data.new?.email || 'user@example.com'}</p>
            <p><strong>User ID:</strong> ${data.new?.id || 'abc123'}</p>
          </div>
          <div style="text-align:center; font-size:12px; color:#6b7280; padding:16px;">
            Alert by <a href="https://hookflo.com" style="color:#3b82f6; text-decoration:none;">hookflo</a>
          </div>
        </div>`,
    }),
  },
  {
    id: 'template4',
    name: 'Clerk User Created',
    type: TemplateType.EMAIL,
    render: data => ({
      subject: `🔐 New Clerk User: ${data.email_addresses?.[0]?.email_address || 'user@example.com'}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto; border:1px solid #e5e7eb; border-radius:8px; overflow:hidden;">
          <div style="background:#111827; color:#ffffff; padding:16px;">
            <h2 style="margin:0;">🔐 New Clerk User</h2>
          </div>
          <div style="padding:16px;">
            <p><strong>Email:</strong> ${data.email_addresses?.[0]?.email_address || 'user@example.com'}</p>
            <p><strong>User ID:</strong> ${data.id || 'clerk_user_123'}</p>
          </div>
          <div style="text-align:center; font-size:12px; color:#6b7280; padding:16px;">
            Monitored by <a href="https://hookflo.com" style="color:#3b82f6; text-decoration:none;">hookflo</a>
          </div>
        </div>`,
    }),
  },
  {
    id: 'template5',
    name: 'Stripe Payment Succeeded',
    type: TemplateType.EMAIL,
    render: data => ({
      subject: `💳 Payment Received: $${(data.amount_received / 100)?.toFixed(2) || '0.00'}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto; border:1px solid #e5e7eb; border-radius:8px; overflow:hidden;">
          <div style="background:#0a2540; color:#ffffff; padding:16px;">
            <h2 style="margin:0;">💳 Stripe Payment Received</h2>
          </div>
          <div style="padding:16px;">
            <p><strong>Customer:</strong> ${data.customer_email || 'customer@example.com'}</p>
            <p><strong>Amount:</strong> $${(data.amount_received / 100)?.toFixed(2) || '19.99'}</p>
            <p><strong>Status:</strong> ${data.status || 'succeeded'}</p>
            <a href="https://dashboard.stripe.com" style="color:#3b82f6; text-decoration:underline;">View in Stripe</a>
          </div>
          <div style="text-align:center; font-size:12px; color:#6b7280; padding:16px;">
            Sent by <a href="https://hookflo.com" style="color:#3b82f6; text-decoration:none;">hookflo</a>
          </div>
        </div>`,
    }),
  },
  {
    id: 'template6',
    name: 'General Webhook Alert',
    type: TemplateType.EMAIL,
    render: data => ({
      subject: `📡 Event Triggered: ${data.type || 'event_triggered'}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto; border:1px solid #e5e7eb; border-radius:8px; overflow:hidden;">
          <div style="background:#1e293b; color:#ffffff; padding:16px;">
            <h2 style="margin:0;">📡 Webhook Alert</h2>
          </div>
          <div style="padding:16px;">
            <p><strong>Event Type:</strong> ${data.type || 'event_triggered'}</p>
            <p><strong>ID:</strong> ${data.id || 'event_1234'}</p>
            <p><strong>Source:</strong> ${data.source || 'api'}</p>
          </div>
          <div style="text-align:center; font-size:12px; color:#6b7280; padding:16px;">
            Monitored by <a href="https://hookflo.com" style="color:#3b82f6; text-decoration:none;">hookflo</a>
          </div>
        </div>`,
    }),
  },
];

export function getTemplate(
  id: string,
  type: TemplateType.EMAIL | TemplateType.SLACK,
): Template {
  const templates =
    type === TemplateType.EMAIL ? emailTemplates : slackTemplates;
  const template = templates.find(t => t.id === id);
  if (!template) throw new Error(`Template ${id} not found`);
  return template;
}
