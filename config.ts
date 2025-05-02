export const tierLimits: Record<string, any> = {
  free: {
    dailyRequests: 60,
    dailyEmails: 20,
    dailySlackNotifications: 50,
    dailyDataVolumeMB: 10,
    webhookLimit: 5,
    notificationLimit: 100,
  },
  pro: {
    dailyRequests: 100,
    dailyEmails: 500,
    dailySlackNotifications: 2000,
    dailyDataVolumeMB: 100,
    webhookLimit: 20,
    notificationLimit: 4000,
  },
  enterprise: {
    dailyRequests: 1000,
    dailyEmails: 1000,
    dailySlackNotifications: 4000,
    dailyDataVolumeMB: 1000,
    webhookLimit: 100,
    notificationLimit: 5000,
  },
};