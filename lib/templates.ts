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
    name: 'Basic Notification',
    type: TemplateType.EMAIL,
    render: data => ({
      subject: 'New Notification',
      html: `
     <div style="max-width: 600px; margin: 0 auto; font-family: system-ui, -apple-system, sans-serif;">
          <div style="background: #1E293B; padding: 24px; border-radius: 12px 12px 0 0;">
            <h1 style="color: #F8FAFC; margin: 0; font-size: 22px; font-weight: 500;">
              ${data.platform || 'Platform'} Event
              ${
                data.platform === 'Stripe'
                  ? '💳'
                  : data.platform === 'Supabase'
                    ? '⚡'
                    : data.platform === 'GitHub'
                      ? '🔧'
                      : data.platform === 'Clerk'
                        ? '🔐'
                        : '📡'
              }
            </h1>
          </div>
          <div style="background: #FFFFFF; padding: 24px; border: 1px solid #E2E8F0; border-radius: 0 0 12px 12px;">
            <div style="margin-bottom: 20px;">
              <p style="color: #64748B; font-size: 14px; margin: 0 0 4px;">Event Type</p>
              <p style="color: #0F172A; font-size: 16px; margin: 0; font-weight: 500;">${data.type}</p>
            </div>
            <div style="background: #F1F5F9; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
              <pre style="margin: 0; white-space: pre-wrap; font-family: monospace; font-size: 13px; color: #334155;">${JSON.stringify(data.payload || data, null, 2)}</pre>
            </div>
            <hr style="border: none; border-top: 1px solid #E2E8F0; margin: 20px 0;">
            <p style="color: #94A3B8; font-size: 12px; text-align: center; margin: 0;">
              Monitored by <a href="https://hookflo.com" style="color: #3B82F6; text-decoration: none; font-weight: 500;">hookflo</a>
            </p>
          </div>
        </div>
      `,
    }),
  },
  {
    id: 'template2',
    name: 'Welcome Email',
    type: TemplateType.EMAIL,
    render: data => ({
      subject: 'Welcome to Our Service',
      html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: 'Arial', sans-serif; color: #333;">
          <div style="background: linear-gradient(135deg, #6366F1, #4F46E5); padding: 20px; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Welcome, ${data.name}! 👋</h1>
          </div>
          <div style="padding: 20px; border: 1px solid #e5e7eb; border-radius: 0 0 8px 8px;">
            <p style="font-size: 16px; line-height: 1.5;">We're excited to have you on board.</p>
            <p style="font-size: 16px; line-height: 1.5;">Feel free to explore our services!</p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
            <p style="color: #6B7280; font-size: 12px; text-align: center;">Delivered by <a href="https://hookflo.com" style="color: #4F46E5; text-decoration: none;">hookflo</a></p>
          </div>
        </div>
      `,
    }),
  },
  {
    id: 'template3',
    name: 'Weekly Summary',
    type: TemplateType.EMAIL,
    render: data => ({
      subject: 'Your Weekly Summary',
      html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: 'Arial', sans-serif; color: #333;">
          <div style="background: linear-gradient(135deg, #6366F1, #4F46E5); padding: 20px; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Weekly Summary 📊</h1>
          </div>
          <div style="padding: 20px; border: 1px solid #e5e7eb; border-radius: 0 0 8px 8px;">
            <p style="font-size: 16px; line-height: 1.5;">Here's what happened this week:</p>
            <ul style="padding-left: 20px;">
             ${JSON.stringify(data, null, 2)}
            </ul>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
            <p style="color: #6B7280; font-size: 12px; text-align: center;">Delivered by <a href="https://hookflo.com" style="color: #4F46E5; text-decoration: none;">hookflo</a></p>
          </div>
        </div>
      `,
    }),
  },
  {
    id: 'template4',
    name: 'Payment Confirmation',
    type: TemplateType.EMAIL,
    render: data => ({
      subject: 'Payment Confirmation',
      html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: 'Arial', sans-serif; color: #333;">
          <div style="background: linear-gradient(135deg, #6366F1, #4F46E5); padding: 20px; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Payment Received ✅</h1>
          </div>
          <div style="padding: 20px; border: 1px solid #e5e7eb; border-radius: 0 0 8px 8px;">
            <p style="font-size: 16px; line-height: 1.5;">Thank you for your payment of <strong>${data.amount}</strong></p>
            <p style="font-size: 14px; color: #6B7280;">Transaction ID: ${data.transactionId}</p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
            <p style="color: #6B7280; font-size: 12px; text-align: center;">Delivered by <a href="https://hookflo.com" style="color: #4F46E5; text-decoration: none;">hookflo</a></p>
          </div>
        </div>
      `,
    }),
  },
  {
    id: 'template5',
    name: 'Subscription Renewal',
    type: TemplateType.EMAIL,
    render: data => ({
      subject: 'Subscription Renewal',
      html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: 'Arial', sans-serif; color: #333;">
          <div style="background: linear-gradient(135deg, #6366F1, #4F46E5); padding: 20px; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Subscription Renewed 🎉</h1>
          </div>
          <div style="padding: 20px; border: 1px solid #e5e7eb; border-radius: 0 0 8px 8px;">
            <p style="font-size: 16px; line-height: 1.5;">Your subscription has been successfully renewed.</p>
            <p style="font-size: 14px; color: #6B7280;">Next billing date: ${data.nextBillingDate}</p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
            <p style="color: #6B7280; font-size: 12px; text-align: center;">Delivered by <a href="https://hookflo.com" style="color: #4F46E5; text-decoration: none;">hookflo</a></p>
          </div>
        </div>
      `,
    }),
  },
  {
    id: 'template6',
    name: 'Dodo Payments',
    type: TemplateType.EMAIL,
    render: data => ({
      subject: 'Dodo Payments Event',
      html: `
<div style="background:#000;color:#fff;font-family:Arial,sans-serif;padding:24px;border-radius:8px;max-width:600px;margin:auto;">
  <h2 style="color:#C6FE1E;margin:0 0 12px;">Dodo Payments Alert</h2>
  <p style="color:#aaa;margin:0 0 16px;font-size:14px;">You've received a new webhook event via HookFlo.</p>
  <div style="background:#111;padding:16px;border-radius:6px;margin-bottom:16px;font-size:14px;">
    <p style="margin:4px 0;"><strong style="color:#C6FE1E;">Event:</strong> {{event_type}}</p>
    <p style="margin:4px 0;"><strong style="color:#C6FE1E;">Txn ID:</strong> {{transaction_id}}</p>
    <p style="margin:4px 0;"><strong style="color:#C6FE1E;">Customer:</strong> {{customer_email}}</p>
    <p style="margin:4px 0;"><strong style="color:#C6FE1E;">Amount:</strong> {{amount}} {{currency}}</p>
  </div>
  <p style="color:#777;font-size:12px;margin:0 0 16px;">Received at {{timestamp}} · Powered by <a href="https://hookflo.com" style="text-decoration:underline">Hookflo</a></p>
  <div style="text-align:center;">
    <a href="{{log_url}}" style="background:#C6FE1E;color:#000;text-decoration:none;padding:10px 16px;border-radius:4px;font-weight:bold;font-size:14px;">View Log</a>
  </div>
</div>
`,
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
