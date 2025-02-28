type Template = {
  id: string;
  name: string;
  type: 'email' | 'slack';
  render: (data: any) => any;
};

export const emailTemplates: Template[] = [
  {
    id: 'template1',
    name: 'Basic Notification',
    type: 'email',
    render: data => ({
      subject: 'New Notification',
      html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: 'Arial', sans-serif; color: #333;">
          <div style="background: linear-gradient(135deg, #6366F1, #4F46E5); padding: 20px; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">New Event</h1>
          </div>
          <div style="padding: 20px; border: 1px solid #e5e7eb; border-radius: 0 0 8px 8px;">
            <p style="font-size: 16px; line-height: 1.5;">Event Type: <strong>${data.type}</strong></p>
            <pre style="background: #f3f4f6; padding: 15px; border-radius: 4px; overflow-x: auto;">${JSON.stringify(data, null, 2)}</pre>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
            <p style="color: #6B7280; font-size: 12px; text-align: center;">Delivered by <a href="https://superhook.com" style="color: #4F46E5; text-decoration: none;">Superhook</a></p>
          </div>
        </div>
      `,
    }),
  },
  {
    id: 'template2',
    name: 'Welcome Email',
    type: 'email',
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
            <p style="color: #6B7280; font-size: 12px; text-align: center;">Delivered by <a href="https://superhook.com" style="color: #4F46E5; text-decoration: none;">Superhook</a></p>
          </div>
        </div>
      `,
    }),
  },
  {
    id: 'template3',
    name: 'Weekly Summary',
    type: 'email',
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
            <p style="color: #6B7280; font-size: 12px; text-align: center;">Delivered by <a href="https://superhook.com" style="color: #4F46E5; text-decoration: none;">Superhook</a></p>
          </div>
        </div>
      `,
    }),
  },
  {
    id: 'template4',
    name: 'Payment Confirmation',
    type: 'email',
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
            <p style="color: #6B7280; font-size: 12px; text-align: center;">Delivered by <a href="https://superhook.com" style="color: #4F46E5; text-decoration: none;">Superhook</a></p>
          </div>
        </div>
      `,
    }),
  },
  {
    id: 'template5',
    name: 'Subscription Renewal',
    type: 'email',
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
            <p style="color: #6B7280; font-size: 12px; text-align: center;">Delivered by <a href="https://superhook.com" style="color: #4F46E5; text-decoration: none;">Superhook</a></p>
          </div>
        </div>
      `,
    }),
  },
];

export const slackTemplates: Template[] = [
  {
    id: 'template1',
    name: 'Basic Slack Message',
    type: 'slack',
    render: data => ({
      text: 'New Notification',
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*New Event*\nType: ${data.type}`,
          },
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: '```' + JSON.stringify(data, null, 2) + '```',
          },
        },
      ],
    }),
  },
  {
    id: 'template2',
    name: 'Alert Notification',
    type: 'slack',
    render: data => ({
      text: 'Alert Notification',
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Alert!*\nSeverity: ${data.severity}\nMessage: ${data.message}`,
          },
        },
      ],
    }),
  },
  {
    id: 'template3',
    name: 'Daily Report',
    type: 'slack',
    render: data => ({
      text: 'Daily Report',
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Daily Report*\nDate: ${data.date}\nSummary: ${data.summary}`,
          },
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: '```' + JSON.stringify(data.details, null, 2) + '```',
          },
        },
      ],
    }),
  },
  {
    id: 'template4',
    name: 'Incident Report',
    type: 'slack',
    render: data => ({
      text: 'Incident Report',
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Incident Report*\nIncident ID: ${data.incidentId}\nStatus: ${data.status}`,
          },
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: '```' + JSON.stringify(data.details, null, 2) + '```',
          },
        },
      ],
    }),
  },
  {
    id: 'template5',
    name: 'System Update',
    type: 'slack',
    render: data => ({
      text: 'System Update',
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*System Update*\nVersion: ${data.version}\nDetails: ${data.details}`,
          },
        },
      ],
    }),
  },
];

export function getTemplate(id: string, type: 'email' | 'slack'): Template {
  const templates = type === 'email' ? emailTemplates : slackTemplates;
  const template = templates.find(t => t.id === id);
  if (!template) throw new Error(`Template ${id} not found`);
  return template;
}
