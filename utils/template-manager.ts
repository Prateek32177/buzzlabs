import { applyPatch, createPatch } from 'rfc6902'; // JSON Patch library
import { emailTemplates } from '@/lib/templates'; // Import your existing templates
import { createClient } from './supabase/client';
// Create combined templates array from all template types
const allTemplates = [...emailTemplates];

export interface TemplateCustomization {
  templateId: string;
  userId: string;
  customizations: any;
}

export class TemplateService {
  /**
   * Get a template for a user, combining base template with user customizations
   */
  async getUserTemplate(userId: string, templateId: string): Promise<any> {
    // 1. Get base template
    const baseTemplate = this.getBaseTemplate(templateId);
    if (!baseTemplate) throw new Error(`Template not found: ${templateId}`);
    const supabase = await createClient();
    // 2. Get user customizations if any
    const { data: customization, error: customizationError } = await supabase
      .from('user_template_customizations')
      .select('*')
      .eq('user_id', userId)
      .eq('template_id', templateId)
      .eq('is_active', true)
      .single();

    // If no customization or error, return base template
    if (customizationError || !customization) return baseTemplate;

    // 3. Apply user customizations to base template
    const customizedTemplate = JSON.parse(JSON.stringify(baseTemplate)); // Clone
    applyPatch(customizedTemplate, customization.customizations);

    return customizedTemplate;
  }

  /**
   * Save user customizations of a template
   */
  async saveUserCustomization(
    userId: string,
    templateId: string,
    customizedTemplate: any,
  ): Promise<void> {
    // 1. Get base template
    const baseTemplate = this.getBaseTemplate(templateId);
    if (!baseTemplate) throw new Error(`Template not found: ${templateId}`);

    // 2. Calculate differences (patch) between base and customized template
    const patch = createPatch(baseTemplate, customizedTemplate);
    const supabase = await createClient();
    // 3. Check if this user already has a customization for this template
    const { data: existingCustomization } = await supabase
      .from('user_template_customizations')
      .select('*')
      .eq('user_id', userId)
      .eq('template_id', templateId)
      .single();

    if (existingCustomization) {
      // Update existing customization
      await supabase
        .from('user_template_customizations')
        .update({
          customizations: patch,
          updated_at: new Date(),
        })
        .eq('id', existingCustomization.id);
    } else {
      // Create new customization
      await supabase.from('user_template_customizations').insert({
        user_id: userId,
        template_id: templateId,
        customizations: patch,
      });
    }
  }

  /**
   * Render a template with provided data
   */
  async renderTemplate(
    userId: string,
    templateId: string,
    data: any,
  ): Promise<any> {
    const template = await this.getUserTemplate(userId, templateId);
    return template;
  }

  /**
   * Get all available templates
   */
  async getAllTemplates(): Promise<any[]> {
    return allTemplates.map(template => ({
      id: template.id,
      name: template.name,
      type: template.type,
    }));
  }

  /**
   * Get base template from the templates array
   */
  private getBaseTemplate(templateId: string): any {
    return allTemplates.find(template => template.id === templateId);
  }

  /**
   * Handle large template storage if needed
   */
  async storeCustomHtmlTemplate(
    templateId: string,
    html: string,
  ): Promise<void> {
    // Only store if template HTML is very large
    if (html.length > 100000) {
      // In real implementation, you'd compress the HTML
      const compressedContent = Buffer.from(html);
      const supabase = await createClient();
      await supabase.from('large_template_contents').upsert(
        {
          template_id: templateId,
          content_compressed: compressedContent,
          original_size: html.length,
        },
        { onConflict: 'template_id' },
      );
    }
  }
}
