import { applyPatch, createPatch } from 'rfc6902';
import { emailTemplates } from '@/lib/templates';
import { createClient } from './supabase/client';
import { slackTemplates } from '@/lib/slack-templates';

// Define template types
export enum TemplateType {
  EMAIL = 'email',
  SLACK = 'slack',
}

// Template interface
export interface Template {
  id: string;
  name: string;
  type: TemplateType;
}

// Store templates by type
const templateRegistry: Record<TemplateType, Template[]> = {
  [TemplateType.EMAIL]: emailTemplates,
  [TemplateType.SLACK]: slackTemplates,
};

export class TemplateService {
  async getUserTemplate(
    userId: string,
    templateId: string,
    type: TemplateType,
  ): Promise<any> {
    const baseTemplate = this.getBaseTemplate(templateId, type);
    if (!baseTemplate) throw new Error(`Template not found: ${templateId}`);

    const supabase = await createClient();
    const { data: customization, error: customizationError } = await supabase
      .from('user_template_customizations')
      .select('*')
      .eq('user_id', userId)
      .eq('template_id', templateId)
      .eq('template_type', type)
      .eq('is_active', true)
      .single();

    if (customizationError || !customization) return baseTemplate;

    const customizedTemplate = JSON.parse(JSON.stringify(baseTemplate));
    applyPatch(customizedTemplate, customization.customizations);

    return customizedTemplate;
  }

  async saveUserCustomization(
    userId: string,
    templateId: string,
    type: TemplateType,
    customizedTemplate: any,
  ): Promise<void> {
    const baseTemplate = this.getBaseTemplate(templateId, type);
    if (!baseTemplate) throw new Error(`Template not found: ${templateId}`);

    const patch = createPatch(baseTemplate, customizedTemplate);
    const supabase = await createClient();

    const { data: existingCustomization } = await supabase
      .from('user_template_customizations')
      .select('*')
      .eq('user_id', userId)
      .eq('template_id', templateId)
      .eq('template_type', type)
      .single();

    if (existingCustomization) {
      await supabase
        .from('user_template_customizations')
        .update({
          customizations: patch,
          updated_at: new Date(),
        })
        .eq('id', existingCustomization.id);
    } else {
      await supabase.from('user_template_customizations').insert({
        user_id: userId,
        template_id: templateId,
        template_type: type,
        customizations: patch,
      });
    }
  }

  async renderTemplate(
    userId: string,
    templateId: string,
    type: TemplateType,
  ): Promise<any> {
    const template = await this.getUserTemplate(userId, templateId, type);
    return template;
  }

  async getAllTemplates(type?: TemplateType): Promise<Template[]> {
    if (type) {
      return templateRegistry[type] || [];
    }
    return Object.values(templateRegistry).flat();
  }

  private getBaseTemplate(
    templateId: string,
    type: TemplateType,
  ): Template | undefined {
    return templateRegistry[type]?.find(template => template.id === templateId);
  }

  async storeCustomTemplate(
    templateId: string,
    type: TemplateType,
    content: any,
  ): Promise<void> {
    const supabase = await createClient();
    await supabase.from('template_contents').upsert(
      {
        template_id: templateId,
        template_type: type,
        content,
        updated_at: new Date(),
      },
      { onConflict: 'template_id,template_type' },
    );
  }
}
