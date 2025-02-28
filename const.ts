import { emailTemplates, slackTemplates } from './lib/templates';

const EmailTemplateOptions = emailTemplates.map(data => {
  return { id: data.id, name: data.name };
});

const SlackTemplateOptions = slackTemplates.map(data => {
  return { id: data.id, name: data.name };
});

export { EmailTemplateOptions, SlackTemplateOptions };
