import { Resend } from 'resend';
import { TemplateService, TemplateType } from '@/utils/template-manager';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({
  userId,
  from,
  to,
  templateId = 'template1',
  data,
}: {
  userId: string;
  from: string;
  to: string;
  templateId?: string;
  data: any;
}) {
  const templateService = new TemplateService();
  const { subject, content } = await templateService.renderTemplate(
    userId,
    templateId,
    TemplateType.EMAIL,
  );

  const { data: result, error } = await resend.emails.send({
    from,
    to,
    subject,
    html: content,
  });

  if (error) throw error;
  return result;
}
