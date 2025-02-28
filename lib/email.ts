import { Resend } from 'resend';
import { getTemplate } from './templates';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({
  from,
  to,
  templateId = 'template1',
  data,
}: {
  from: string;
  to: string;
  templateId?: string;
  data: any;
}) {
  const template = getTemplate(templateId, 'email');
  const { subject, html } = template.render(data);

  const { data: result, error } = await resend.emails.send({
    from,
    to,
    subject,
    html,
  });

  if (error) throw error;
  return result;
}
