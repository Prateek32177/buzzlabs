export type Webhook = {
  id: string;
  name: string;
  url: string;
  secret: string;
  isActive: boolean;
  notifyEmail: boolean;
  notifySlack: boolean;
  emailConfig: {
    recipientEmail: string;
    templateId: string;
  } | null;
  slackConfig: {
    webhookUrl: string;
    channelName: string;
    templateId: string;
  } | null;
};
