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
    id: 'github-general',
    name: 'GitHub - Repository Activity',
    type: TemplateType.SLACK,
    render: data => ({
      username: 'GitHub Alerts',
      icon_emoji: ':octocat:',
      text: `🔔 New GitHub Event: ${data?.event_type || 'push'}`,
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*${data?.repository?.full_name || 'example/repo'}*\nEvent: *${data?.event_type || 'push'}*`,
          },
        },
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: `*By:*\n${data?.sender?.login || 'octocat'}`,
            },
            {
              type: 'mrkdwn',
              text: `*Branch:*\n${data?.ref?.split('/')?.pop() || 'main'}`,
            },
          ],
        },
        {
          type: 'actions',
          elements: [
            {
              type: 'button',
              text: { type: 'plain_text', text: 'View Repo' },
              url:
                data?.repository?.html_url || 'https://github.com/example/repo',
              style: 'primary',
              value: 'view_repo',
            },
          ],
        },
      ],
    }),
  },
  {
    id: 'github-pr',
    name: 'GitHub - Pull Request',
    type: TemplateType.SLACK,
    render: data => ({
      username: 'GitHub PR Bot',
      icon_emoji: ':twisted_rightwards_arrows:',
      text: `🛠 Pull Request ${data?.action || 'opened'}: ${data?.pull_request?.title || 'Fix login issue'}`,
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*${data?.pull_request?.title || 'Fix login issue'}*\nStatus: *${data?.action || 'opened'}*`,
          },
        },
        {
          type: 'context',
          elements: [
            {
              type: 'mrkdwn',
              text: `By *${data?.sender?.login || 'octocat'}* on ${data?.repository?.full_name || 'example/repo'}`,
            },
          ],
        },
        {
          type: 'actions',
          elements: [
            {
              type: 'button',
              text: { type: 'plain_text', text: 'View PR' },
              url:
                data?.pull_request?.html_url ||
                'https://github.com/example/repo/pull/1',
              style: 'primary',
              value: 'view_pr',
            },
          ],
        },
      ],
    }),
  },

  // Supabase Templates
  {
    id: 'supabase-user-signup',
    name: 'Supabase - New User Signup',
    type: TemplateType.SLACK,
    render: data => ({
      username: 'Supabase Auth',
      icon_emoji: ':busts_in_silhouette:',
      text: `🎉 New user signup detected`,
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*New Signup:*\nEmail: ${data?.record?.email || 'user@example.com'}\nProvider: ${data?.record?.auth_provider || 'email'}`,
          },
        },
        {
          type: 'context',
          elements: [
            {
              type: 'mrkdwn',
              text: `User ID: ${data?.record?.id || 'user_abc123'}`,
            },
          ],
        },
      ],
    }),
  },
  {
    id: 'supabase-user-update',
    name: 'Supabase - User Updated or Deleted',
    type: TemplateType.SLACK,
    render: data => ({
      username: 'Supabase Alerts',
      icon_emoji: ':warning:',
      text: `⚠️ User record ${data?.type || 'updated'}`,
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*User Email:* ${data?.old_record?.email || 'user@example.com'}\n*Action:* ${data?.type || 'UPDATE'}`,
          },
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Old Data:*\n\`\`\`${JSON.stringify(data?.old_record || {}, null, 2)}\`\`\``,
          },
        },
      ],
    }),
  },

  {
    id: 'clerk-user-created',
    name: 'Clerk - New User Created',
    type: TemplateType.SLACK,
    render: data => ({
      username: 'Clerk Alerts',
      icon_emoji: ':new:',
      text: `🧑‍💼 New Clerk user created`,
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*User:* ${data?.data?.email_addresses?.[0]?.email_address || 'jane.doe@example.com'}\n*ID:* ${data?.data?.id || 'user_abc123'}`,
          },
        },
        {
          type: 'actions',
          elements: [
            {
              type: 'button',
              text: { type: 'plain_text', text: 'View in Clerk' },
              url: `https://dashboard.clerk.com/users/${data?.data?.id || 'user_abc123'}`,
              style: 'primary',
              value: 'view_user',
            },
          ],
        },
      ],
    }),
  },
  {
    id: 'clerk-user-deleted',
    name: 'Clerk - User Deleted',
    type: TemplateType.SLACK,
    render: data => ({
      username: 'Clerk Alerts',
      icon_emoji: ':x:',
      text: `🚫 Clerk user deleted`,
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Email:* ${data?.data?.email_addresses?.[0]?.email_address || 'john@example.com'}\n*Deleted At:* ${new Date(data?.timestamp || Date.now()).toLocaleString()}`,
          },
        },
      ],
    }),
  },

  {
    id: 'stripe-payment-succeeded',
    name: 'Stripe - Payment Succeeded',
    type: TemplateType.SLACK,
    render: data => ({
      username: 'Stripe Payments',
      icon_emoji: ':money_with_wings:',
      text: `✅ Payment successful`,
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Amount:* $${(data?.data?.object?.amount_total || 2999) / 100}\n*Customer:* ${data?.data?.object?.customer_email || 'customer@example.com'}`,
          },
        },
        {
          type: 'actions',
          elements: [
            {
              type: 'button',
              text: { type: 'plain_text', text: 'View Payment' },
              url: `https://dashboard.stripe.com/payments/${data?.data?.object?.id || 'pi_12345'}`,
              style: 'primary',
              value: 'view_payment',
            },
          ],
        },
      ],
    }),
  },
  {
    id: 'stripe-subscription-renewal',
    name: 'Stripe - Subscription Renewal',
    type: TemplateType.SLACK,
    render: data => ({
      username: 'Stripe Subscriptions',
      icon_emoji: ':calendar:',
      text: `🔁 Subscription renewed`,
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Plan:* ${data?.data?.object?.plan?.nickname || 'Pro Monthly'}\n*Amount:* $${(data?.data?.object?.amount || 2999) / 100}`,
          },
        },
        {
          type: 'context',
          elements: [
            {
              type: 'mrkdwn',
              text: `Customer: ${data?.data?.object?.customer_email || 'subscriber@example.com'}`,
            },
          ],
        },
      ],
    }),
  },

  {
    id: 'custom-general-alert',
    name: 'Custom - General Alert',
    type: TemplateType.SLACK,
    render: data => ({
      username: 'AlertBot',
      icon_emoji: ':rotating_light:',
      text: data?.summary || '⚠️ A custom alert was triggered',
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Summary:* ${data?.summary || 'Alert triggered due to high CPU usage'}`,
          },
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Details:*\n\`\`\`${JSON.stringify(data?.details || { cpu: '95%' }, null, 2)}\`\`\``,
          },
        },
      ],
    }),
  },
];
