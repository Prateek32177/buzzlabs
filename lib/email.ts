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

    // Render the template with the provided data
    const rendered = template.render(data);

    // Extract subject and html content from the rendered template
    // Based on the editor code, the render function should return { subject, html }
    const { subject, html } = rendered;

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
