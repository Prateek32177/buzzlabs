// import { SlackTemplate } from '../lib/types/slack';

// export const slackTemplates: SlackTemplate[] = [
//   {
//     id: 'welcome-message',
//     name: 'Welcome Message',
//     content: 'Hey {{userName}}! 👋 Welcome to the team! We\'re excited to have you join us at {{companyName}}. Here are a few channels you might want to check out:\n\n• #general - Company-wide announcements\n• #random - Water cooler chat\n• #help - Get support when you need it\n\nFeel free to introduce yourself! 😊',
//     variables: ['userName', 'companyName'],
//     defaultValues: {
//       userName: 'John',
//       companyName: 'Acme Inc'
//     }
//   },
//   {
//     id: 'meeting-reminder',
//     name: 'Meeting Reminder',
//     content: '<!here> Reminder: {{meetingName}} starts in {{timeUntil}}!\n\n📅 *Time*: {{meetingTime}}\n🎯 *Agenda*: {{agenda}}\n🔗 *Zoom Link*: {{zoomLink}}',
//     variables: ['meetingName', 'timeUntil', 'meetingTime', 'agenda', 'zoomLink'],
//     defaultValues: {
//       meetingName: 'Weekly Standup',
//       timeUntil: '15 minutes',
//       meetingTime: '10:00 AM PST',
//       agenda: 'Weekly updates and planning',
//       zoomLink: 'https://zoom.us/j/123456789'
//     }
//   },
//   {
//     id: 'deployment-notification',
//     name: 'Deployment Notification',
//     content: '🚀 *New Deployment*\n\n*Project*: {{projectName}}\n*Environment*: {{environment}}\n*Version*: {{version}}\n*Deployed by*: {{deployedBy}}\n\n*Changes*:\n{{changeLog}}\n\n*Status*: {{status}}',
//     variables: ['projectName', 'environment', 'version', 'deployedBy', 'changeLog', 'status'],
//     defaultValues: {
//       projectName: 'Frontend App',
//       environment: 'Production',
//       version: 'v1.0.0',
//       deployedBy: 'Sarah',
//       changeLog: '• Added new features\n• Fixed bugs\n• Improved performance',
//       status: '✅ Successful'
//     }
//   },
//   {
//     id: 'incident-alert',
//     name: 'Incident Alert',
//     content: '🚨 *INCIDENT ALERT*\n\n*Status*: {{status}}\n*Service*: {{service}}\n*Impact*: {{impact}}\n\n*Description*:\n{{description}}\n\n*Action Items*:\n{{actionItems}}\n\n*Updates will be posted in*: {{updateChannel}}',
//     variables: ['status', 'service', 'impact', 'description', 'actionItems', 'updateChannel'],
//     defaultValues: {
//       status: 'Investigating',
//       service: 'API Gateway',
//       impact: 'High - Customer facing services affected',
//       description: 'Increased error rates observed in the payment processing system',
//       actionItems: '1. Engineering team investigating\n2. Customer support notified\n3. Status page updated',
//       updateChannel: '#incidents'
//     }
//   }
// ];

export type TemplateType =
  | "basic"
  | "welcome"
  | "weeklySummary"
  | "paymentConfirmation"
  | "subscriptionRenewal"
  | "custom"

export const defaultTemplates = {
  basic: {
    username: "Notification Bot",
    icon_emoji: ":bell:",
    text: "You have a new notification!",
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "*New Notification*\nYou have received a new notification from the system.",
        },
      },
      {
        type: "actions",
        elements: [
          {
            type: "button",
            text: {
              type: "plain_text",
              text: "View Details",
            },
            style: "primary",
            value: "view_details",
          },
        ],
      },
    ],
  },

  welcome: {
    username: "Welcome Bot",
    icon_emoji: ":wave:",
    text: "Welcome to the team!",
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "*Welcome to the team!* :tada:\nWe're excited to have you join us. Here are some resources to help you get started:",
        },
      },
      {
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text: "*Onboarding Guide:*\n<https://example.com/onboarding|View Guide>",
          },
          {
            type: "mrkdwn",
            text: "*Team Calendar:*\n<https://example.com/calendar|View Calendar>",
          },
        ],
      },
      {
        type: "divider",
      },
      {
        type: "context",
        elements: [
          {
            type: "image",
            image_url: "https://api.slack.com/img/blocks/bkb_template_images/placeholder.png",
            alt_text: "placeholder",
          },
          {
            type: "mrkdwn",
            text: "Your onboarding buddy is @sarah. Feel free to reach out with any questions!",
          },
        ],
      },
    ],
  },

  weeklySummary: {
    username: "Analytics Bot",
    icon_emoji: ":chart_with_upwards_trend:",
    text: "Your weekly summary is ready",
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "*Weekly Summary: March 22-28, 2023*",
        },
      },
      {
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text: "*New Users:*\n+125 (↑15%)",
          },
          {
            type: "mrkdwn",
            text: "*Active Users:*\n1,204 (↑8%)",
          },
          {
            type: "mrkdwn",
            text: "*Revenue:*\n$12,540 (↑23%)",
          },
          {
            type: "mrkdwn",
            text: "*Churn Rate:*\n2.4% (↓0.5%)",
          },
        ],
      },
      {
        type: "image",
        image_url: "https://api.slack.com/img/blocks/bkb_template_images/beagle.png",
        alt_text: "Weekly performance chart",
        title: {
          type: "plain_text",
          text: "Weekly Performance",
        },
      },
      {
        type: "actions",
        elements: [
          {
            type: "button",
            text: {
              type: "plain_text",
              text: "View Full Report",
            },
            style: "primary",
            value: "view_report",
          },
          {
            type: "button",
            text: {
              type: "plain_text",
              text: "Download CSV",
            },
            value: "download_csv",
          },
        ],
      },
    ],
  },

  paymentConfirmation: {
    username: "Payments Bot",
    icon_emoji: ":credit_card:",
    text: "Payment confirmation",
    attachments: [
      {
        color: "#36a64f",
        pretext: "Your payment has been processed successfully.",
        title: "Payment Confirmation",
        title_link: "https://example.com/payment/123456",
        text: "Thank you for your payment. Here's a summary of your transaction:",
        fields: [
          {
            title: "Amount",
            value: "$49.99",
            short: true,
          },
          {
            title: "Date",
            value: "March 28, 2023",
            short: true,
          },
          {
            title: "Payment Method",
            value: "Visa ending in 4242",
            short: true,
          },
          {
            title: "Transaction ID",
            value: "txn_1234567890",
            short: true,
          },
        ],
        footer: "Example Company",
        footer_icon: "https://api.slack.com/img/blocks/bkb_template_images/placeholder.png",
        ts: 1677628800,
      },
    ],
  },

  subscriptionRenewal: {
    username: "Subscription Bot",
    icon_emoji: ":calendar:",
    text: "Subscription renewal notice",
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "*Subscription Renewal Notice*",
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "Your subscription for *Premium Plan* will renew automatically on *April 15, 2023*. The renewal amount is *$29.99*.",
        },
      },
      {
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text: "*Current Plan:*\nPremium ($29.99/month)",
          },
          {
            type: "mrkdwn",
            text: "*Renewal Date:*\nApril 15, 2023",
          },
          {
            type: "mrkdwn",
            text: "*Payment Method:*\nVisa ending in 4242",
          },
          {
            type: "mrkdwn",
            text: "*Billing Cycle:*\nMonthly",
          },
        ],
      },
      {
        type: "divider",
      },
      {
        type: "actions",
        elements: [
          {
            type: "button",
            text: {
              type: "plain_text",
              text: "Manage Subscription",
            },
            style: "primary",
            value: "manage_subscription",
          },
          {
            type: "button",
            text: {
              type: "plain_text",
              text: "Update Payment Method",
            },
            value: "update_payment",
          },
        ],
      },
      {
        type: "context",
        elements: [
          {
            type: "mrkdwn",
            text: "If you have any questions, please contact support@example.com",
          },
        ],
      },
    ],
  },

  custom: {
    username: "Custom Bot",
    icon_emoji: ":robot_face:",
    text: "This is a custom template",
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "This is a custom template. Edit it to create your own notification format.",
        },
      },
      {
        type: "divider",
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "You can add sections, buttons, images, and more to customize this template.",
        },
      },
      {
        type: "actions",
        elements: [
          {
            type: "button",
            text: {
              type: "plain_text",
              text: "Primary Button",
            },
            style: "primary",
            value: "primary_action",
          },
          {
            type: "button",
            text: {
              type: "plain_text",
              text: "Secondary Button",
            },
            value: "secondary_action",
          },
        ],
      },
    ],
  },
}

