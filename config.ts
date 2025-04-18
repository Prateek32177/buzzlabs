export const tierLimits: Record<string, any> = {
  free: {
    dailyRequests: 100,
    dailyEmails: 3,
    dailySlackNotifications: 3,
    dailyDataVolumeMB: 10,
  },
  pro: {
    dailyRequests: 1000,
    dailyEmails: 500,
    dailySlackNotifications: 500,
    dailyDataVolumeMB: 100,
  },
  enterprise: {
    dailyRequests: 10000,
    dailyEmails: 5000,
    dailySlackNotifications: 5000,
    dailyDataVolumeMB: 1000,
  },
};
