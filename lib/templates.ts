type Template = {
  id: string;
  name: string;
  type: 'email' | 'slack';
  render: (data: any) => any;
};

const templates: Template[] = [
  {
    id: 'template1',
    name: 'Basic Notification',
    type: 'email',
    render: data => ({
      subject: 'New Notification',
      html: `
        <h1>New Event</h1>
        <p>Event Type: ${data.type}</p>
        <pre>${JSON.stringify(data, null, 2)}</pre>
      `,
    }),
  },
  {
    id: 'template2',
    name: 'Basic Slack Message',
    type: 'slack',
    render: data => ({
      text: 'New Notification',
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*New Event*\nType: ${data.type}`,
          },
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: '```' + JSON.stringify(data, null, 2) + '```',
          },
        },
      ],
    }),
  },
];

export function getTemplate(id: string): Template {
  const template = templates.find(t => t.id === id);
  if (!template) throw new Error(`Template ${id} not found`);
  return template;
}

export function getTemplatesByType(type: 'email' | 'slack'): Template[] {
  return templates.filter(t => t.type === type);
}
