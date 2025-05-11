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
    name: 'Custom Template',
    type: TemplateType.EMAIL,
    render: data => ({
      subject: 'Custom build',
      html: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="x-apple-disable-message-reformatting" />
  </head>
  <body style="background:#fff;font-family:ui-sans-serif,system-ui,sans-serif,'Apple Color Emoji','Segoe UI Emoji'">
    <table align="center" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:auto;padding:0">
      <tr>
        <td style="padding:2rem;text-align:center">
          <p style="font-size:1.5rem;font-weight:700;letter-spacing:-0.05em;margin:1rem 0">Hookflo</p>
          <p style="font-size:0.875rem;text-transform:uppercase;letter-spacing:0.05em;margin:1rem 0">2024 in Review</p>
          <h1 style="font-size:2rem;font-weight:500;margin:1rem 0">Your Year with Hookflo</h1>
          <p style="font-size:1rem;line-height:1.5;margin:1rem 0">
            A big thank you for being with us! Here’s a quick look at how you used Papermark this year.
          </p>
          <a href="https://hookflo.com" style="display:inline-block;margin-top:1.5rem;font-size:0.875rem;font-weight:700;color:#111827;text-decoration:none">
            View your dashboard
          </a>
        </td>
      </tr>
    </table>
    <hr style="border:0;border-top:1px solid #e5e7eb;margin:0 0; padding:8px" />
    <p style="color:#6b7280;font-size:12px;text-align:center">
      Delivered by <a href="https://hookflo.com" style="color:#4f46e5;text-decoration:none">Hookflo</a>
    </p>
  </body>
</html>
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
