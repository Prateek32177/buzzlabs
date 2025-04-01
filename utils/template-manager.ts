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
  content?: any;
  render: (data: any) => any;
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
  ): Promise<Template | null> {
    const baseTemplate = this.getBaseTemplate(templateId, type);
    if (!baseTemplate) return null;

    try {
      const supabase = await createClient();
      const { data: customization, error: customizationError } = await supabase
        .from('user_template_customizations')
        .select('*')
        .eq('user_id', userId)
        .eq('template_id', templateId)
        .eq('template_type', type)
        .eq('is_active', true);

      if (customizationError || !customization || customization.length === 0) {
        return baseTemplate;
      }

      // Create a deep copy of the base template
      const customizedTemplate = JSON.parse(JSON.stringify(baseTemplate));

      // Apply customizations if they exist
      if (customization[0].customizations) {
        applyPatch(customizedTemplate, customization[0].customizations);

        // Ensure render function is preserved
        if (!customizedTemplate.render) {
          customizedTemplate.render = baseTemplate.render;
        }
      }

      return customizedTemplate;
    } catch (error) {
      console.error('Error getting user template:', error);
      return baseTemplate;
    }
  }

  async saveUserCustomization(
    userId: string,
    templateId: string,
    type: TemplateType,
    customizedTemplate: any,
  ): Promise<void> {
    const baseTemplate = this.getBaseTemplate(templateId, type);
    if (!baseTemplate) throw new Error(`Template not found: ${templateId}`);

    // Create a deep copy of customized template for patching
    const templateForPatch = {
      ...customizedTemplate,
      // Exclude the render function from patching
      render: undefined,
    };

    // Create a base template copy without render function for proper patching
    const baseForPatch = {
      ...JSON.parse(JSON.stringify(baseTemplate)),
      render: undefined,
    };

    const patch = createPatch(baseForPatch, templateForPatch);
    const supabase = await createClient();

    const { data: existingCustomization, error } = await supabase
      .from('user_template_customizations')
      .select('*')
      .eq('user_id', userId)
      .eq('template_id', templateId)
      .eq('template_type', type);

    if (existingCustomization && existingCustomization.length > 0) {
      await supabase
        .from('user_template_customizations')
        .update({
          customizations: patch,
          updated_at: new Date(),
          is_active: true,
        })
        .eq('id', existingCustomization[0].id);
    } else {
      await supabase.from('user_template_customizations').insert({
        user_id: userId,
        template_id: templateId,
        template_type: type,
        customizations: patch,
        is_active: true,
      });
    }
  }

  async deleteUserCustomization(
    userId: string,
    templateId: string,
    type: TemplateType,
  ): Promise<void> {
    const supabase = await createClient();
    await supabase
      .from('user_template_customizations')
      .update({ is_active: false })
      .eq('user_id', userId)
      .eq('template_id', templateId)
      .eq('template_type', type);
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
}
