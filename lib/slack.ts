import { TemplateService, TemplateType } from '@/utils/template-manager';
import { checkActionAllowed } from './analytics/usage';

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

// Helper function to replace variables in template
function replaceVariables(template: any, data: Record<string, any>): any {
  if (typeof template === 'string') {
    return template.replace(/{{([\w.]+)}}/g, (match, key) => {
      // Split the key by dots to handle nested properties
      const keys = key.split('.');
      let value = data;

      // Traverse the nested structure
      for (const k of keys) {
        if (value === undefined || value === null) {
          return match; // Keep original placeholder if any part of the path is undefined
        }

        // Handle array properties
        if (Array.isArray(value)) {
          // If we're at the last key and it's an array, return the first item
          if (k === keys[keys.length - 1]) {
            value = value[0];
          } else {
            // Otherwise, try to find the item in the array that matches the next key
            const nextKey = keys[keys.indexOf(k) + 1];
            value = value.find(item => item[nextKey] !== undefined);
          }
        } else {
          value = value[k];
        }
      }

      // If we found a value, return it, otherwise keep the original placeholder
      if (value === undefined || value === null) {
        return match;
      }

      // Convert the value to string, handling objects and arrays
      if (typeof value === 'object') {
        return JSON.stringify(value);
      }

      return String(value);
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
