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
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TemplateService, TemplateType } from '@/utils/template-manager';
import { Save, RefreshCw, Loader, ArrowUpRight } from 'lucide-react';
import { getUser } from '@/hooks/user-auth';
import { useSearchParams } from 'next/navigation';

type TemplateId = { templateId: string };

export default function SlackTemplateEditor() {
  const [selectedTemplate, setSelectedTemplate] = useState<any | null>(null);
  const [templateCode, setTemplateCode] = useState<string>('');
  const [templateId, setTemplateId] = useState<string>('basic');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<
    'idle' | 'saving' | 'saved' | 'error'
  >('idle');
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [webhooksList, setWebhooksList] = useState<any[]>([]);
  const [webhookId, setSelectedWebhookId] = useState<string>();
  const [isWebhooksLoading, setIsWebhooksLoading] = useState(true);

  const templateService = new TemplateService();
  const [userid, setUserId] = useState('');

  const searchParams = useSearchParams();
  const template_id =
    (searchParams.get('templateId') as TemplateId['templateId']) || null;
  const webhook_id = searchParams.get('webhookId') || null;

  useEffect(() => {
    const fetchUser = async () => {
      setIsPageLoading(true);
      const { userId } = await getUser();
      setUserId(userId || '');
      setIsPageLoading(false);
    };
    fetchUser();
    fetchWebhooksList();
  }, []);

  const userId = userid;

  const fetchWebhooksList = async () => {
    try {
      setIsWebhooksLoading(true);
      const response = await fetch('/api/webhooks?fields=templates');
      if (!response.ok) throw new Error(`Failed to fetch webhooks`);
      const data = await response.json();
      setWebhooksList(data);

      // Set default webhook ID to the first webhook if available and no webhook_id from search params
      if (data.length > 0 && !webhook_id) {
        setSelectedWebhookId(data[0].id);
      } else if (webhook_id) {
        // If webhook_id is in search params, set it as selected
        setSelectedWebhookId(webhook_id);
      }
    } catch (error) {
      toast.error('Error', {
        description: 'Failed to fetch webhooks',
        id: 'fetch-webhooks-error',
      });
    } finally {
      setIsWebhooksLoading(false);
    }
  };
  // Load template from service on initial render
  useEffect(() => {
    async function loadTemplate() {
      if (!userId) return;

      try {
        setIsLoading(true);
        const customTemplate = await templateService.getUserTemplate(
          userId,

          templateId,
          TemplateType.SLACK,
          webhookId || '',
        );

        const defaultTemplate = slackTemplates.find(t => t.id === templateId);

        if (!defaultTemplate) {
          toast.error('Default template not found', {
            id: 'default-template-error',
            description: 'Failed to load default template',
          });
          setIsLoading(false);
          return;
        }

        if (customTemplate) {
          // This is a customized template
          try {
            // First, ensure the custom template has a render function
            if (!customTemplate.render) {
              customTemplate.render = defaultTemplate.render;
            }

            // Here's the key change:
            // Use the content directly from the customized template if it exists
            // This ensures we're displaying the patched version
            let renderedContent;

            if (customTemplate.content) {
              // Use the customized content directly
              renderedContent = customTemplate.content;
            } else {
              // If no content exists, use the render function
              renderedContent = customTemplate.render({});
            }

            setSelectedTemplate(customTemplate);
            setTemplateCode(JSON.stringify(renderedContent, null, 2));
          } catch (renderError) {
            console.error('Error rendering custom template:', renderError);

            // Fallback to default
            const defaultRendered = defaultTemplate.render({});
            setSelectedTemplate(defaultTemplate);
            setTemplateCode(JSON.stringify(defaultRendered, null, 2));
          }
        } else {
          // Use default template
          const rendered = defaultTemplate.render({});
          setSelectedTemplate(defaultTemplate);
          setTemplateCode(JSON.stringify(rendered, null, 2));
        }
      } catch (error) {
        console.error('Failed to load template:', error);
        toast.error('Failed to load template', {
          id: 'load-template-error',
          description: 'Failed to load template',
        });

        // Fallback to default template
        const defaultTemplate = slackTemplates.find(t => t.id === templateId);
        if (defaultTemplate) {
          const rendered = defaultTemplate.render({});
          setSelectedTemplate(defaultTemplate);
          setTemplateCode(JSON.stringify(rendered, null, 2));
        }
      } finally {
        setIsLoading(false);
      }
    }
    if (template_id) {
      setTemplateId(template_id);
    }

    // Set webhookId from search params if available
    if (webhook_id) {
      setSelectedWebhookId(webhook_id);
    }

    loadTemplate();
  }, [templateId, userId, webhookId]);

  // Save template function
  const saveTemplate = async () => {
    if (!selectedTemplate?.id || !userId) {
      toast.error('No template selected', {
        id: 'no-template-error',
        description: 'Please select a template to save',
      });
      return;
    }

    try {
      setIsSaving(true);
      setSaveStatus('saving');

      const parsedTemplate = JSON.parse(templateCode);

      // Find the original template to get the render function
      const originalTemplate = slackTemplates.find(
        t => t.id === selectedTemplate.id,
      );

      if (!originalTemplate) {
        throw new Error('Original template not found');
      }

      // The key change: store the parsed template as content directly
      const updatedTemplate = {
        ...selectedTemplate,
        id: selectedTemplate.id,
        name: selectedTemplate.name,
        type: TemplateType.SLACK,
        content: parsedTemplate,
        render: originalTemplate.render, // Always keep original render function
      };

      if (!userId) {
        throw new Error('User ID is required');
      }
      await templateService.saveUserCustomization(
        userId,

        selectedTemplate.id,
        TemplateType.SLACK,
        updatedTemplate,
        webhookId || '',
      );

      // Update the selected template with the new content
      setSelectedTemplate(updatedTemplate);

      setSaveStatus('saved');
      toast.success('Saved successfully!', { id: 'save-template' });
    } catch (error) {
      console.error('Failed to save template:', error);
      setSaveStatus('error');
      toast.error('Failed to save', { id: 'save-template-error' });
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveStatus('idle'), 2000);
    }
  };

  const handleTemplateChange = async (newTemplateId: string) => {
    setTemplateId(newTemplateId);
    const defaultTemplate = slackTemplates.find(t => t.id === newTemplateId);
    if (!defaultTemplate) {
      toast.error('Template not found', { id: 'template-error' });
      return;
    }

    try {
      const customTemplate = await templateService.getUserTemplate(
        userId?.toString() || '',

        newTemplateId,
        TemplateType.SLACK,
        webhookId || '',
      );

      if (customTemplate) {
        // Ensure render function exists
        if (!customTemplate.render && defaultTemplate) {
          customTemplate.render = defaultTemplate.render;
        }

        try {
          // Use customized content directly if it exists
          let renderedContent;

          if (customTemplate.content) {
            renderedContent = customTemplate.content;
          } else {
            renderedContent = customTemplate.render({});
          }

          setSelectedTemplate(customTemplate);
          setTemplateCode(JSON.stringify(renderedContent, null, 2));
        } catch (renderError) {
          console.error('Error rendering custom template:', renderError);

          // Fallback to default
          const defaultRendered = defaultTemplate.render({});
          setSelectedTemplate(defaultTemplate);
          setTemplateCode(JSON.stringify(defaultRendered, null, 2));
          toast.warning('Using default template due to render error');
        }
      } else {
        // Use default template
        const rendered = defaultTemplate.render({});
        setSelectedTemplate(defaultTemplate);
        setTemplateCode(JSON.stringify(rendered, null, 2));
      }
    } catch (error) {
      console.error('Failed to load template:', error);
      toast.error('Failed to load template', {
        id: 'load-template-error',
      });

      // Fallback to default template
      if (defaultTemplate) {
        const rendered = defaultTemplate.render({});
        setSelectedTemplate(defaultTemplate);
        setTemplateCode(JSON.stringify(rendered, null, 2));
      }
    }
  };

  const resetTemplate = async () => {
    if (!selectedTemplate || !userId) return;

    if (!userId) return;

    try {
      // Reset to default template
      const defaultTemplate = slackTemplates.find(
        t => t.id === selectedTemplate.id,
      );

      if (defaultTemplate) {
        const rendered = defaultTemplate.render({});
        setSelectedTemplate(defaultTemplate);
        setTemplateCode(JSON.stringify(rendered, null, 2));
        setJsonError(null); // Reset JSON error state
        toast.success('Template reset', {
          description: `The ${selectedTemplate.name} template has been reset to default.`,
          id: 'reset-template',
        });
      } else {
        toast.error('Default template not found', {
          id: 'reset-template-error',
          description: 'Failed to reset template',
        });
      }
    } catch (error) {
      console.error('Failed to reset template:', error);
      toast.error('Failed to reset template', {
        id: 'reset-template-error',
        description: 'Failed to reset template',
      });
    }
  };

  // Update template code from block builder
  const updateTemplateFromBlockBuilder = (
    updatedTemplate: Record<string, any>,
  ) => {
    setTemplateCode(JSON.stringify(updatedTemplate, null, 2));
  };

  const handleWebhookChange = (selectedWebhookId: string) => {
    setSelectedWebhookId(selectedWebhookId || '');
  };

  // Parse the template for preview
  const getParsedTemplate = (): Record<string, any> | null => {
    try {
      return JSON.parse(templateCode);
    } catch (error) {
      return null;
    }
  };

  if (isPageLoading) {
    return (
      <div className='h-[50vh] flex items-center justify-center'>
        <Loader className='h-8 w-8 animate-spin text-white' />
      </div>
    );
  }

  return (
    <div className='container mx-auto p-6 space-y-6'>
      <div className='flex flex-col gap-6'>
        <h1 className='text-3xl text-white font-bold mb-6'>
          Slack Template Editor
        </h1>

        <div className='flex items-center justify-between flex-wrap gap-4'>
          <div
            className='
         flex items-center gap-2 justify-start'
          >
            {webhooksList.length !== 0 ? (
              <Select
                value={webhookId}
                onValueChange={handleWebhookChange}
                disabled={isWebhooksLoading}
              >
                <SelectTrigger className='w-[200px]'>
                  {isWebhooksLoading ? (
                    <div className='flex items-center gap-2'>
                      <Loader className='h-4 w-4 animate-spin' />
                      <span>Loading...</span>
                    </div>
                  ) : (
                    <SelectValue placeholder='Select Webhook' />
                  )}
                </SelectTrigger>
                <SelectContent>
                  {webhooksList.map(webhook => (
                    <SelectItem key={webhook.id} value={webhook.id}>
                      {webhook.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <span className='text-sm text-gray-400'>
                No webhook found{' '}
                <a
                  href='/dashboard/webhooks'
                  className='underline whitespace-nowrap flex gap-1 text-white'
                >
                  Create Webhook <ArrowUpRight className='w-4 h-4' />
                </a>
              </span>
            )}
            <Select
              value={templateId}
              onValueChange={handleTemplateChange}
              disabled={isLoading}
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
          </div>
          <div className='flex gap-2'>
            <Button
              size={'sm'}
              onClick={saveTemplate}
              className='flex items-center gap-2'
              disabled={
                isSaving ||
                isLoading ||
                !templateCode ||
                jsonError !== null ||
                webhooksList.length === 0
              }
            >
              <Save className='h-4 w-4' />
              {isSaving ? 'Saving...' : 'Save Template'}
            </Button>
            <Button
              size={'sm'}
              variant='secondary'
              onClick={resetTemplate}
              className='flex items-center gap-2'
              disabled={isSaving || isLoading}
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
                    jsonError={jsonError}
                    setJsonError={setJsonError}
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
                  {jsonError ? (
                    <div className='flex items-center justify-center h-full text-red-500 text-sm'>
                      <p>`Failed to load preview due to {jsonError}`</p>
                    </div>
                  ) : (
                    <SlackPreview
                      jsonError={jsonError}
                      template={getParsedTemplate()}
                    />
                  )}
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
                jsonError={jsonError}
                setJsonError={setJsonError}
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
              {jsonError ? (
                <div className='flex items-center justify-center h-full text-red-500 text-sm'>
                  <p>Failed to load preview due to {jsonError}</p>
                </div>
              ) : (
                <SlackPreview
                  jsonError={jsonError}
                  template={getParsedTemplate()}
                />
              )}
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
