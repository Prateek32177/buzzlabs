import { emailTemplates } from './lib/templates';
import { slackTemplates } from './lib/slack-templates';

const EmailTemplateOptions = emailTemplates.map(data => {
  return { id: data.id, name: data.name };
});

const SlackTemplateOptions = slackTemplates.map(data => {
  return { id: data.id, name: data.name };
});

export { EmailTemplateOptions, SlackTemplateOptions };
