export enum TemplateType {
  EMAIL = 'email',
  SLACK = 'slack',
}

type Template = {
  id: string;
  name: string;
  type: TemplateType;
  content?: any;
  render: (data: any) => any;
};

export const slackTemplates: Template[] = [
  {
    id: 'basic',
    name: 'Basic Notification',
    type: TemplateType.SLACK,
    render: data => ({
      username: 'Notification Bot',
      icon_emoji: ':bell:',
      text: 'You have a new notification!',
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: '*New Notification*\nYou have received a new notification from the system.',
          },
        },
        {
          type: 'actions',
          elements: [
            {
              type: 'button',
              text: {
                type: 'plain_text',
                text: 'View Details',
              },
              style: 'primary',
              value: 'view_details',
            },
          ],
        },
      ],
    }),
  },
  {
    id: 'welcome',
    name: 'Welcome Message',
    type: TemplateType.SLACK,
    render: data => ({
      username: 'Welcome Bot',
      icon_emoji: ':wave:',
      text: 'Welcome to the team!',
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: "*Welcome to the team!* :tada:\nWe're excited to have you join us. Here are some resources to help you get started:",
          },
        },
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: '*Onboarding Guide:*\n<https://example.com/onboarding|View Guide>',
            },
            {
              type: 'mrkdwn',
              text: '*Team Calendar:*\n<https://example.com/calendar|View Calendar>',
            },
          ],
        },
        {
          type: 'divider',
        },
        {
          type: 'context',
          elements: [
            {
              type: 'image',
              image_url:
                'https://api.slack.com/img/blocks/bkb_template_images/placeholder.png',
              alt_text: 'placeholder',
            },
            {
              type: 'mrkdwn',
              text: 'Your onboarding buddy is @sarah. Feel free to reach out with any questions!',
            },
          ],
        },
      ],
    }),
  },
  {
    id: 'weekly-summary',
    name: 'Weekly Summary',
    type: TemplateType.SLACK,
    render: data => ({
      username: 'Analytics Bot',
      icon_emoji: ':chart_with_upwards_trend:',
      text: 'Your weekly summary is ready',
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: '*Weekly Summary: March 22-28, 2023*',
          },
        },
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: '*New Users:*\n+125 (↑15%)',
            },
            {
              type: 'mrkdwn',
              text: '*Active Users:*\n1,204 (↑8%)',
            },
            {
              type: 'mrkdwn',
              text: '*Revenue:*\n$12,540 (↑23%)',
            },
            {
              type: 'mrkdwn',
              text: '*Churn Rate:*\n2.4% (↓0.5%)',
            },
          ],
        },
        {
          type: 'actions',
          elements: [
            {
              type: 'button',
              text: {
                type: 'plain_text',
                text: 'View Full Report',
              },
              style: 'primary',
              value: 'view_report',
            },
            {
              type: 'button',
              text: {
                type: 'plain_text',
                text: 'Download CSV',
              },
              value: 'download_csv',
            },
          ],
        },
      ],
    }),
  },
  {
    id: 'subscription-renewal',
    name: 'Subscription Renewal',
    type: TemplateType.SLACK,
    render: data => ({
      username: 'Subscription Bot',
      icon_emoji: ':calendar:',
      text: 'Subscription renewal notice',
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: '*Subscription Renewal Notice*',
          },
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: 'Your subscription for *Premium Plan* will renew automatically on *April 15, 2023*. The renewal amount is *$29.99*.',
          },
        },
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: '*Current Plan:*\nPremium ($29.99/month)',
            },
            {
              type: 'mrkdwn',
              text: '*Renewal Date:*\nApril 15, 2023',
            },
            {
              type: 'mrkdwn',
              text: '*Payment Method:*\nVisa ending in 4242',
            },
            {
              type: 'mrkdwn',
              text: '*Billing Cycle:*\nMonthly',
            },
          ],
        },
        {
          type: 'divider',
        },
        {
          type: 'actions',
          elements: [
            {
              type: 'button',
              text: {
                type: 'plain_text',
                text: 'Manage Subscription',
              },
              style: 'primary',
              value: 'manage_subscription',
            },
            {
              type: 'button',
              text: {
                type: 'plain_text',
                text: 'Update Payment Method',
              },
              value: 'update_payment',
            },
          ],
        },
        {
          type: 'context',
          elements: [
            {
              type: 'mrkdwn',
              text: 'If you have any questions, please contact support@example.com',
            },
          ],
        },
      ],
    }),
  },
  {
    id: 'custom',
    name: 'Custom Template',
    type: TemplateType.SLACK,
    render: data => ({
      username: 'Custom Bot',
      icon_emoji: ':robot_face:',
      text: 'This is a custom template',
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: 'This is a custom template. Edit it to create your own notification format.',
          },
        },
        {
          type: 'divider',
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: 'You can add sections, buttons, images, and more to customize this template.',
          },
        },
        {
          type: 'actions',
          elements: [
            {
              type: 'button',
              text: {
                type: 'plain_text',
                text: 'Primary Button',
              },
              style: 'primary',
              value: 'primary_action',
            },
            {
              type: 'button',
              text: {
                type: 'plain_text',
                text: 'Secondary Button',
              },
              value: 'secondary_action',
            },
          ],
        },
      ],
    }),
  },
];
