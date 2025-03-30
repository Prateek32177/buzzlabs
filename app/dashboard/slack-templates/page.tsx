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
import { defaultTemplates } from '@/lib/slack-templates';
// import { useToast } from '@/hooks/use-toast';
import { Save, RefreshCw } from 'lucide-react';
// const { toast } = useToast();
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function SlackTemplateEditor() {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('basic');
  const [templateCode, setTemplateCode] = useState<string>('');
  const [savedTemplates, setSavedTemplates] = useState<Record<string, any>>({});
  const [isSaving, setIsSaving] = useState(false);

  // Load saved templates from localStorage on initial render
  useEffect(() => {
    const savedData = localStorage.getItem('slackTemplates');
    if (savedData) {
      setSavedTemplates(JSON.parse(savedData));
    }

    // Initialize with the first template
    handleTemplateChange('basic');

    // Set dark mode
    document.documentElement.classList.add('dark');
  }, []);

  // Handle template selection change
  const handleTemplateChange = (value: string) => {
    setSelectedTemplate(value);

    // Check if we have a saved version of this template
    if (savedTemplates[value]) {
      setTemplateCode(JSON.stringify(savedTemplates[value], null, 2));
      toast('Template loaded', {
        description: `Loaded your saved version of the ${value} template.`,
      });
    } else {
      // Use the default template
      setTemplateCode(
        JSON.stringify(
          defaultTemplates[value as keyof typeof defaultTemplates],
          null,
          2,
        ),
      );
      toast('Default template loaded', {
        description: `Loaded the default ${value} template.`,
      });
    }
  };

  // Save the current template
  const saveTemplate = () => {
    try {
      setIsSaving(true);
      const parsedTemplate = JSON.parse(templateCode);
      const updatedTemplates = {
        ...savedTemplates,
        [selectedTemplate]: parsedTemplate,
      };

      // Save to localStorage
      localStorage.setItem('slackTemplates', JSON.stringify(updatedTemplates));
      setSavedTemplates(updatedTemplates);

      toast.success('✓ Saved successfully');
    } catch (error) {
      toast.error('Failed to save');
    } finally {
      setIsSaving(false);
    }
  };

  // Reset the current template to default
  const resetTemplate = () => {
    const defaultTemplate =
      defaultTemplates[selectedTemplate as keyof typeof defaultTemplates];
    setTemplateCode(JSON.stringify(defaultTemplate, null, 2));

    // Remove from saved templates
    const updatedTemplates = { ...savedTemplates };
    delete updatedTemplates[selectedTemplate];

    localStorage.setItem('slackTemplates', JSON.stringify(updatedTemplates));
    setSavedTemplates(updatedTemplates);

    toast.success('Template reset', {
      description: `The ${selectedTemplate} template has been reset to default.`,
    });
  };

  // Update template code from block builder
  const updateTemplateFromBlockBuilder = (updatedTemplate: any) => {
    setTemplateCode(JSON.stringify(updatedTemplate, null, 2));
  };

  // Parse the template for preview
  const getParsedTemplate = () => {
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
          <Select value={selectedTemplate} onValueChange={handleTemplateChange}>
            <SelectTrigger className='w-full md:w-[300px] text-foreground'>
              <SelectValue placeholder='Select a template' />
            </SelectTrigger>
            <SelectContent className='text-foreground'>
              <SelectItem value='basic'>Basic Notification</SelectItem>
              <SelectItem value='welcome'>Welcome Notification</SelectItem>
              <SelectItem value='weeklySummary'>Weekly Summary</SelectItem>
              <SelectItem value='paymentConfirmation'>
                Payment Confirmation
              </SelectItem>
              <SelectItem value='subscriptionRenewal'>
                Subscription Renewal
              </SelectItem>
              <SelectItem value='custom'>Custom Template</SelectItem>
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
