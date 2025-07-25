import { Resend } from 'resend';
import { TemplateService, TemplateType } from '@/utils/template-manager';
import { checkActionAllowed } from './analytics/usage';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({
  userId,
  from,
  to,
  templateId = 'template1',
  data = {},
  emailCount,
  webhookId,
}: {
  userId: string;
  from: string;
  to: string;
  templateId?: string;
  data: any;
  emailCount?: number;
  webhookId?: string;
}) {
  let actionCount = emailCount || 1;
  const checkResult = await checkActionAllowed(userId, 'email', 0, actionCount);
  if (!checkResult.allowed) {
    return {
      success: false,
      message:
        checkResult.reason ||
        'Email Rate limit exceeded. Please upgrade your plan or try again tomorrow.',
    };
  }

  try {
    const templateService = new TemplateService();
    const template = await templateService.getUserTemplate(
      userId,
      templateId,
      TemplateType.EMAIL,
      webhookId,
    );

    if (!template) {
      return { success: false, message: `Template not found: ${templateId}` };
    }

    let subject, html;
    if (template.content && template.subject) {
      html = replaceVariables(template.content, data);
      subject = replaceVariables(template.subject, data);
    } else {
      const rendered = template.render(data);
      html = rendered.html;
      subject = rendered.subject;
    }

    const { error } = await resend.emails.send({
      from,
      to: to
        .split(',')
        .map(e => e.trim())
        .filter(e => e.length > 0),
      subject,
      html,
    });

    if (error) {
      return {
        success: false,
        message: 'Failed to send email. System is under heavy traffic!',
      };
    }
    return { success: true, message: 'Email notification sent successfully.' };
  } catch (error) {
    console.error('Failed to send email:', error);
    return {
      success: false,
      message: 'Failed to send email. System is under heavy traffic!',
    };
  }
}

function replaceVariables(template: string, data: Record<string, any>): string {
  return template.replace(/{{([\w.]+)}}/g, (match, key) => {
    const keys = key.split('.');
    let value = data;

    for (const k of keys) {
      if (value === undefined || value === null) {
        return match;
      }

      if (Array.isArray(value)) {
        if (k === keys[keys.length - 1]) {
          value = value[0];
        } else {
          const nextKey = keys[keys.indexOf(k) + 1];
          value = value.find(item => item[nextKey] !== undefined);
        }
      } else {
        value = value[k];
      }
    }

    if (value === undefined || value === null) {
      return match;
    }

    if (typeof value === 'object') {
      return JSON.stringify(value);
    }

    return String(value);
  });
}
