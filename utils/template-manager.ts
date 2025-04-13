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
  content?: string;
  subject?: string;
  render: (variables: Record<string, any>) => { html: string; subject: string };
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
    webhookId?: string,
  ): Promise<Template | null> {
    const baseTemplate = this.getBaseTemplate(templateId, type);
    if (!baseTemplate) return null;

    try {
      const supabase = await createClient();

      let query = supabase
        .from('user_template_customizations')
        .select('*')
        .eq('user_id', userId)
        .eq('template_id', templateId)
        .eq('template_type', type)
        .eq('is_active', true);

      if (webhookId) {
        query = query.eq('webhook_id', webhookId);
      }

      const { data: customizations, error: customizationError } = await query;

      if (
        customizationError ||
        !customizations ||
        customizations.length === 0
      ) {
        return baseTemplate;
      }

      // Use the first customization found
      const customization = customizations[0];

      // Create a deep copy of the base template
      const customizedTemplate = {
        ...baseTemplate,
        // Preserve the original render function
        render: baseTemplate.render,
      };

      // Apply customizations if they exist
      if (customization.customizations) {
        // Apply the patch to everything except the render function
        const patchTarget = {
          ...customizedTemplate,
          render: undefined,
        };
        applyPatch(patchTarget, customization.customizations);

        // Merge back with the render function
        return {
          ...patchTarget,
          render: baseTemplate.render,
        };
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
    webhookId?: string,
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

    try {
      // Include webhook_id in the query if it's provided
      let query = supabase
        .from('user_template_customizations')
        .select('*')
        .eq('user_id', userId)
        .eq('template_id', templateId)
        .eq('template_type', type);

      if (webhookId) {
        query = query.eq('webhook_id', webhookId);
      }

      const { data: existingCustomizations, error } = await query;

      if (error) {
        console.error('Error checking for existing customizations:', error);
        throw error;
      }

      if (existingCustomizations && existingCustomizations.length > 0) {
        // Update existing customization
        const { error: updateError } = await supabase
          .from('user_template_customizations')
          .update({
            customizations: patch,
            updated_at: new Date(),
            is_active: true,
          })
          .eq('id', existingCustomizations[0].id);

        if (updateError) {
          console.error('Error updating customization:', updateError);
          throw updateError;
        }
      } else {
        // Insert new customization
        const { error: insertError } = await supabase
          .from('user_template_customizations')
          .insert({
            user_id: userId,
            template_id: templateId,
            template_type: type,
            webhook_id: webhookId || null,
            customizations: patch,
            is_active: true,
          });

        if (insertError) {
          console.error('Error inserting customization:', insertError);
          throw insertError;
        }
      }
    } catch (error) {
      console.error('Error saving customization:', error);
      throw error;
    }
  }

  async deleteUserCustomization(
    userId: string,
    templateId: string,
    type: TemplateType,
    webhookId?: string,
  ): Promise<void> {
    const supabase = await createClient();

    try {
      // Include webhook_id in the query if it's provided
      let query = supabase
        .from('user_template_customizations')
        .update({ is_active: false })
        .eq('user_id', userId)
        .eq('template_id', templateId)
        .eq('template_type', type);

      if (webhookId) {
        query = query.eq('webhook_id', webhookId);
      }

      const { error } = await query;

      if (error) {
        console.error('Error deleting customization:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error in deleteUserCustomization:', error);
      throw error;
    }
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
