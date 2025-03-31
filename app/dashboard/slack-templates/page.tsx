'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { SlackPreview } from './slack-preview';
import { BlockBuilder } from './block-builder';
import { slackTemplates } from '@/lib/slack-templates';
// import { useToast } from '@/hooks/use-toast';
import { Save, RefreshCw } from 'lucide-react';
// const { toast } = useToast();
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TemplateService, TemplateType } from '@/utils/template-manager';

type Template = {
  id: string;
  name: string;
  type: TemplateType;
  render: (data: any) => any;
};

export default function SlackTemplateEditor() {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    null,
  );
  const [templateCode, setTemplateCode] = useState<string>('');
  const [templateId, setTemplateId] = useState<string>('basic');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<
    'idle' | 'saving' | 'saved' | 'error'
  >('idle');

  const templateService = new TemplateService();
  const userId = 'e14b5e09-6f04-43b5-8328-69548b172a07'; // You might want to get this from your auth context

  // Load template from service on initial render
  useEffect(() => {
    async function loadTemplate() {
      if (!userId) return;

      try {
        setIsLoading(true);
        const templateData = await templateService.getUserTemplate(
          userId,
          templateId,
          TemplateType.SLACK,
        );

        if (templateData) {
          setSelectedTemplate(templateData);
          setTemplateCode(JSON.stringify(templateData.render({}), null, 2));
          toast('Template loaded', {
            description: `Loaded your customized version of the ${templateData.name} template.`,
          });
        } else {
          // Load default template if no customization exists
          const defaultTemplate = slackTemplates.find(t => t.id === templateId);
          if (defaultTemplate) {
            setSelectedTemplate(defaultTemplate);
            setTemplateCode(
              JSON.stringify(defaultTemplate.render({}), null, 2),
            );
          }
        }
      } catch (error) {
        console.error('Failed to load template:', error);
        toast.error('Failed to load template');
      } finally {
        setIsLoading(false);
      }
    }

    loadTemplate();
  }, [templateId]);

  const handleTemplateChange = async (newTemplateId: string) => {
    setTemplateId(newTemplateId);
    const template = slackTemplates.find(t => t.id === newTemplateId);
    if (!template) return;

    try {
      const customTemplate = await templateService.getUserTemplate(
        userId,
        newTemplateId,
        TemplateType.SLACK,
      );

      if (customTemplate) {
        setSelectedTemplate(customTemplate);
        setTemplateCode(JSON.stringify(customTemplate.render({}), null, 2));
        toast('Template loaded', {
          description: `Loaded your customized version of the ${template.name} template.`,
        });
      } else {
        setSelectedTemplate(template);
        setTemplateCode(JSON.stringify(template.render({}), null, 2));
        toast('Default template loaded', {
          description: `Loaded the default ${template.name} template.`,
        });
      }
    } catch (error) {
      console.error('Failed to load template:', error);
      toast.error('Failed to load template');
    }
  };

  const resetTemplate = async () => {
    if (!selectedTemplate || !userId) return;

    try {
      // Delete the custom template
      await selectedTemplate.render({});

      // Reset to default template
      const defaultTemplate = slackTemplates.find(
        t => t.id === selectedTemplate.id,
      );
      if (defaultTemplate) {
        setSelectedTemplate(defaultTemplate);
        setTemplateCode(JSON.stringify(defaultTemplate.render({}), null, 2));
      }

      toast.success('Template reset', {
        description: `The ${selectedTemplate.name} template has been reset to default.`,
      });
    } catch (error) {
      console.error('Failed to reset template:', error);
      toast.error('Failed to reset template');
    }
  };

  const saveTemplate = async () => {
    if (!selectedTemplate?.id || !userId) {
      toast.error('No template selected');
      return;
    }

    try {
      setIsSaving(true);
      setSaveStatus('saving');

      const parsedTemplate = JSON.parse(templateCode);
      const updatedTemplate = {
        ...selectedTemplate,
        render: () => parsedTemplate,
      };

      await templateService.saveUserCustomization(
        userId,
        selectedTemplate.id,
        TemplateType.SLACK,
        updatedTemplate,
      );

      setSaveStatus('saved');
      toast.success('Saved successfully!');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      console.error('Failed to save template:', error);
      setSaveStatus('error');
      toast.error('Failed to save');
    } finally {
      setIsSaving(false);
    }
  };

  // Update template code from block builder
  const updateTemplateFromBlockBuilder = (
    updatedTemplate: Record<string, any>,
  ) => {
    setTemplateCode(JSON.stringify(updatedTemplate, null, 2));
  };

  // Parse the template for preview
  const getParsedTemplate = (): Record<string, any> | null => {
    try {
      return JSON.parse(templateCode);
    } catch (error) {
      return null;
    }
  };
  return (
    <div className='container mx-auto p-6 space-y-6'>
      <div className='flex flex-col'>
        <h1 className='text-3xl text-white font-bold mb-6'>
          Slack Template Editor
        </h1>

        <div className='mb-6 flex flex-col md:flex-row items-center justify-between gap-4 w-full'>
          <Select
            value={selectedTemplate?.id}
            onValueChange={handleTemplateChange}
          >
            <SelectTrigger className='w-full md:w-[300px] text-foreground'>
              <SelectValue placeholder='Select a template' />
            </SelectTrigger>
            <SelectContent className='text-foreground'>
              {slackTemplates.map(template => (
                <SelectItem key={template.id} value={template.id}>
                  {template.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className='flex w-full justify-between md:justify-end gap-2'>
            <Button onClick={saveTemplate} className='flex items-center gap-2'>
              <Save className='h-4 w-4' />
              {isSaving ? 'Saving...' : 'Save Template'}
            </Button>
            <Button
              variant='secondary'
              onClick={resetTemplate}
              className='flex items-center gap-2'
            >
              <RefreshCw className='h-4 w-4' />
              Reset
            </Button>
          </div>
        </div>

        {/* Mobile View */}
        <div className='md:hidden'>
          <Tabs defaultValue='editor' className='w-full'>
            <TabsList className='grid w-full grid-cols-2'>
              <TabsTrigger value='editor'>Editor</TabsTrigger>
              <TabsTrigger value='preview'>Preview</TabsTrigger>
            </TabsList>
            <TabsContent value='editor'>
              <Card className='h-[600px] flex flex-col'>
                <CardHeader className='pb-2'>
                  <CardTitle className='text-foreground'>
                    Template Editor
                  </CardTitle>
                  <CardDescription className='text-muted-foreground'>
                    Edit the JSON directly or use the visual block builder
                  </CardDescription>
                </CardHeader>
                <CardContent className='flex-1 overflow-hidden p-0 px-6'>
                  <BlockBuilder
                    template={getParsedTemplate()}
                    onUpdate={updateTemplateFromBlockBuilder}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value='preview'>
              {/* Preview */}
              <Card className='h-[600px] flex flex-col'>
                <CardHeader className='pb-2'>
                  <CardTitle className='text-foreground'>Preview</CardTitle>
                  <CardDescription className='text-muted-foreground'>
                    See how your message will appear in Slack
                  </CardDescription>
                </CardHeader>
                <CardContent className='flex-1 overflow-auto bg-[#222529] rounded-md p-4'>
                  <SlackPreview template={getParsedTemplate()} />
                </CardContent>
                <CardFooter className='border-t p-4'>
                  <p className='text-sm text-muted-foreground'>
                    This preview shows how your message will appear in Slack.
                    Some interactive elements may behave differently in the
                    actual Slack app.
                  </p>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Desktop View */}
        <div className='hidden md:grid grid-cols-2 gap-6'>
          {/* Template Editor */}
          <Card className='h-[600px] flex flex-col'>
            <CardHeader className='pb-2'>
              <CardTitle className='text-foreground'>Template Editor</CardTitle>
              <CardDescription className='text-muted-foreground'>
                Edit the JSON directly or use the visual block builder
              </CardDescription>
            </CardHeader>
            <CardContent className='flex-1 overflow-hidden p-0 px-6'>
              <BlockBuilder
                template={getParsedTemplate()}
                onUpdate={updateTemplateFromBlockBuilder}
              />
            </CardContent>
          </Card>

          {/* Preview */}
          <Card className='h-[600px] flex flex-col'>
            <CardHeader className='pb-2'>
              <CardTitle className='text-foreground'>Preview</CardTitle>
              <CardDescription className='text-muted-foreground'>
                See how your message will appear in Slack
              </CardDescription>
            </CardHeader>
            <CardContent className='flex-1 overflow-auto bg-[#222529] rounded-md p-4'>
              <SlackPreview template={getParsedTemplate()} />
            </CardContent>
            <CardFooter className='border-t p-4'>
              <p className='text-sm text-muted-foreground'>
                This preview shows how your message will appear in Slack. Some
                interactive elements may behave differently in the actual Slack
                app.
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
