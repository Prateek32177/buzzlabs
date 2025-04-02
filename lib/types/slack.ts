export interface SlackTemplate {
  id: string;
  name: string;
  content: string;
  variables: string[];
  defaultValues: Record<string, string>;
}

export interface SlackTemplateCustomization {
  userId: string;
  templateId: string;
  content: string;
  variables: Record<string, string>;
}
