import { Resend } from 'resend';
import { TemplateService, TemplateType } from '@/utils/template-manager';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({
  userId,
  from,
  to,
  templateId = 'template1',
  data = {},
}: {
  userId: string;
  from: string;
  to: string;
  templateId?: string;
  data: any;
}) {
  try {
    // Get the template using TemplateService
    const templateService = new TemplateService();
    const template = await templateService.getUserTemplate(
      userId,
      templateId,
      TemplateType.EMAIL,
    );

    if (!template) {
      throw new Error(`Template not found: ${templateId}`);
    }

    // If we have customized content, use it directly
    let subject, html;
    if (template.content && template.subject) {
      // Replace variables in the customized content
      html = replaceVariables(template.content, data);
      subject = replaceVariables(template.subject, data);
    } else {
      // Fall back to render function if no customized content
      const rendered = template.render(data);
      html = rendered.html;
      subject = rendered.subject;
    }

    // Send the email using Resend
    const { data: result, error } = await resend.emails.send({
      from,
      to,
      subject,
      html,
    });

    if (error) throw error;
    return result;
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
}

// Helper function to replace variables in template strings
function replaceVariables(template: string, data: Record<string, any>): string {
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
