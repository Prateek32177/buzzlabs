import { TemplateService, TemplateType } from '@/utils/template-manager';
import { checkActionAllowed } from './analytics/usage';

export async function sendSlackNotification({
  userId,
  webhookUrl,
  channelName,
  templateId = 'template2',
  data,
  webhookId,
}: {
  userId: string;
  webhookUrl: string;
  channelName: string;
  templateId?: string;
  data: any;
  webhookId?: string;
}) {
  const checkResult = await checkActionAllowed(userId, 'slack');

  if (!checkResult.allowed) {
    return {
      success: false,
      message:
        checkResult.reason ||
        'Slack Rate limit exceeded. Please upgrade your plan or try again tomorrow.',
    };
  }

  try {
    // Get the template using TemplateService
    const templateService = new TemplateService();
    const template = await templateService.getUserTemplate(
      userId,
      templateId,
      TemplateType.SLACK,
      webhookId,
    );

    if (!template) {
      return {
        success: false,
        message: `Template not found: ${templateId}`,
      };
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

    if (response.status !== 200) {
      return {
        success: false,
        message: `Failed to send Slack notification: ${response.status}`,
      };
    }

    return {
      success: true,
      message: 'Slack notification sent successfully',
    };
  } catch (error) {
    return {
      success: false,
      message: 'Failed to send Slack notification.',
    };
  }
}

function replaceVariables(template: any, data: Record<string, any>): any {
  const resolvePath = (path: string): any => {
    return path.split('.').reduce((obj, key) => {
      if (obj && typeof obj === 'object') {
        return obj[key];
      }
      return undefined;
    }, data);
  };

  const replacer = (value: any): any => {
    if (typeof value === 'string') {
      return value.replace(/{{([\w.]+)}}/g, (_, key) => {
        const resolved = resolvePath(key);
        if (resolved === undefined || resolved === null) return `{{${key}}}`;
        return typeof resolved === 'object'
          ? JSON.stringify(resolved)
          : String(resolved);
      });
    } else if (Array.isArray(value)) {
      return value.map(replacer);
    } else if (typeof value === 'object' && value !== null) {
      const replacedObject: Record<string, any> = {};
      for (const [k, v] of Object.entries(value)) {
        replacedObject[k] = replacer(v);
      }
      return replacedObject;
    } else {
      return value;
    }
  };

  return replacer(template);
}
