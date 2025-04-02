import { TemplateService, TemplateType } from '@/utils/template-manager';

export async function sendSlackNotification({
  userId,
  webhookUrl,
  channelName,
  templateId = 'template2',
  data,
}: {
  userId: string;
  webhookUrl: string;
  channelName: string;
  templateId?: string;
  data: any;
}) {
  try {
    // Get the template using TemplateService
    const templateService = new TemplateService();
    const template = await templateService.getUserTemplate(
      userId,
      templateId,
      TemplateType.SLACK,
    );

    if (!template) {
      throw new Error(`Template not found: ${templateId}`);
    }

    // If we have customized content, use it directly
    let message;
    if (template.content) {
      // For Slack, content is the block structure
      message = replaceVariables(template.content, data);
    } else {
      // Fall back to render function if no customized content
      message = template.render(data);
    }

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        channel: channelName,
        ...(typeof message === 'string' ? JSON.parse(message) : message),
      }),
    });

    if (!response.ok) {
      throw new Error(`Slack notification failed: ${await response.text()}`);
    }

    return response.json();
  } catch (error) {
    console.error('Failed to send Slack notification:', error);
    throw error;
  }
}

// Helper function to replace variables in template
function replaceVariables(template: any, data: Record<string, any>): any {
  if (typeof template === 'string') {
    return template.replace(/{{([\w.-]+)}}/g, (match, key) => {
      return data[key] || match;
    });
  }

  if (Array.isArray(template)) {
    return template.map(item => replaceVariables(item, data));
  }

  if (typeof template === 'object' && template !== null) {
    const result: Record<string, any> = {};
    for (const [key, value] of Object.entries(template)) {
      result[key] = replaceVariables(value, data);
    }
    return result;
  }

  return template;
}
