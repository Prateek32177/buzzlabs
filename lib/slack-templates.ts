import { SlackTemplate } from '../lib/types/slack';

export const slackTemplates: SlackTemplate[] = [
  {
    id: 'welcome-message',
    name: 'Welcome Message',
    content: 'Hey {{userName}}! 👋 Welcome to the team! We\'re excited to have you join us at {{companyName}}. Here are a few channels you might want to check out:\n\n• #general - Company-wide announcements\n• #random - Water cooler chat\n• #help - Get support when you need it\n\nFeel free to introduce yourself! 😊',
    variables: ['userName', 'companyName'],
    defaultValues: {
      userName: 'John',
      companyName: 'Acme Inc'
    }
  },
  {
    id: 'meeting-reminder',
    name: 'Meeting Reminder',
    content: '<!here> Reminder: {{meetingName}} starts in {{timeUntil}}!\n\n📅 *Time*: {{meetingTime}}\n🎯 *Agenda*: {{agenda}}\n🔗 *Zoom Link*: {{zoomLink}}',
    variables: ['meetingName', 'timeUntil', 'meetingTime', 'agenda', 'zoomLink'],
    defaultValues: {
      meetingName: 'Weekly Standup',
      timeUntil: '15 minutes',
      meetingTime: '10:00 AM PST',
      agenda: 'Weekly updates and planning',
      zoomLink: 'https://zoom.us/j/123456789'
    }
  },
  {
    id: 'deployment-notification',
    name: 'Deployment Notification',
    content: '🚀 *New Deployment*\n\n*Project*: {{projectName}}\n*Environment*: {{environment}}\n*Version*: {{version}}\n*Deployed by*: {{deployedBy}}\n\n*Changes*:\n{{changeLog}}\n\n*Status*: {{status}}',
    variables: ['projectName', 'environment', 'version', 'deployedBy', 'changeLog', 'status'],
    defaultValues: {
      projectName: 'Frontend App',
      environment: 'Production',
      version: 'v1.0.0',
      deployedBy: 'Sarah',
      changeLog: '• Added new features\n• Fixed bugs\n• Improved performance',
      status: '✅ Successful'
    }
  },
  {
    id: 'incident-alert',
    name: 'Incident Alert',
    content: '🚨 *INCIDENT ALERT*\n\n*Status*: {{status}}\n*Service*: {{service}}\n*Impact*: {{impact}}\n\n*Description*:\n{{description}}\n\n*Action Items*:\n{{actionItems}}\n\n*Updates will be posted in*: {{updateChannel}}',
    variables: ['status', 'service', 'impact', 'description', 'actionItems', 'updateChannel'],
    defaultValues: {
      status: 'Investigating',
      service: 'API Gateway',
      impact: 'High - Customer facing services affected',
      description: 'Increased error rates observed in the payment processing system',
      actionItems: '1. Engineering team investigating\n2. Customer support notified\n3. Status page updated',
      updateChannel: '#incidents'
    }
  }
];