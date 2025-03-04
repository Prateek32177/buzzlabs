export interface Webhook {
  id: string;
  name: string;
  url: string;
  secretKey: string;
  isActive: boolean;
  notificationServices: {
    email: boolean;
    slack: boolean;
  };
}
