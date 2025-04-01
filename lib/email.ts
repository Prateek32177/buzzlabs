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
  return template.replace(/{{([\w.-]+)}}/g, (match, key) => {
    return data[key] || match; // Keep original placeholder if variable not found
  });
}
