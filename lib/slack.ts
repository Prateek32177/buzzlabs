import { getTemplate, TemplateType } from './templates';

export async function sendSlackNotification({
  webhookUrl,
  channelName,
  templateId = 'template2',
  data,
}: {
  webhookUrl: string;
  channelName: string;
  templateId?: string;
  data: any;
}) {
  const template = getTemplate(templateId, TemplateType.SLACK);
  const message = template.render(data);

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      channel: channelName,
      ...message,
    }),
  });

  if (!response.ok) {
    throw new Error(`Slack notification failed: ${await response.text()}`);
  }

  return response.json();
}
