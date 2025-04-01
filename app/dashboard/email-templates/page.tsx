'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import dynamic from 'next/dynamic';
import { emailTemplates, TemplateType } from '@/lib/templates';
import {
  TemplateService,
  Template as ServiceTemplate,
  Template,
} from '@/utils/template-manager';
import { toast } from 'sonner';
import { Loader, Save, RefreshCw, HelpCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const userId = 'e14b5e09-6f04-43b5-8328-69548b172a07';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
});

// Extended interface for our UI needs
interface EditorTemplate extends ServiceTemplate {
  variables?: string[];
  subject?: string;
  content?: string;
}

export default function EmailTemplateEditor() {
  const [selectedTemplate, setSelectedTemplate] =
    useState<EditorTemplate | null>(null);
  const [editedContent, setEditedContent] = useState<string>('');
  const [editedSubject, setEditedSubject] = useState<string>('');
  const [variables, setVariables] = useState<Record<string, string>>({});

  const [templateId, setTemplateId] = useState<string>('template1');
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<
    'idle' | 'saving' | 'saved' | 'error'
  >('idle');

  const templateService = new TemplateService();
  const [isLoading, setIsLoading] = useState(true);
  const [availableTemplates, setAvailableTemplates] = useState<
    ServiceTemplate[]
  >([]);

  // Load all available templates
  useEffect(() => {
    async function loadAvailableTemplates() {
      try {
        const templates = await templateService.getAllTemplates(
          TemplateType.EMAIL,
        );
        setAvailableTemplates(templates);
      } catch (error) {
        console.error('Failed to load templates:', error);
      }
    }

    loadAvailableTemplates();
  }, []);

  // Load the selected template
  useEffect(() => {
    loadTemplate();
  }, [templateId]);

  const loadTemplate = async () => {
    if (!userId || !templateId) return;

    try {
      setIsLoading(true);
      const customTemplate = await templateService.getUserTemplate(
        userId,
        templateId,
        TemplateType.EMAIL,
      );

      const defaultTemplate = emailTemplates.find(t => t.id === templateId);

      if (!defaultTemplate) {
        toast.error('Default template not found');
        setIsLoading(false);
        return;
      }

      if (customTemplate) {
        try {
          // Ensure the custom template has a render function
          if (!customTemplate.render) {
            customTemplate.render = defaultTemplate.render;
          }

          // Use the content directly from customized template if it exists
          let renderedContent;
          let renderedSubject;

          if (customTemplate.content) {
            // Use the customized content directly
            renderedContent = customTemplate.content;
            renderedSubject = customTemplate.subject;
          } else {
            // If no content exists, use the render function
            const rendered = customTemplate.render({});
            renderedContent = rendered.html;
            renderedSubject = rendered.subject;
          }

          setSelectedTemplate({
            ...customTemplate,
            content: renderedContent,
            subject: renderedSubject,
            variables: extractVariables(renderedContent),
          });

          setEditedContent(renderedContent);
          setEditedSubject(renderedSubject || '');

          const vars = extractVariables(renderedContent);
          setVariables(
            vars.reduce(
              (acc, curr) => ({
                ...acc,
                [curr]: '',
              }),
              {},
            ),
          );

          toast('Custom template loaded');
        } catch (renderError) {
          console.error('Error rendering custom template:', renderError);

          // Fallback to default
          const defaultRendered = defaultTemplate.render({});
          setSelectedTemplate({
            ...defaultTemplate,
            content: defaultRendered.html,
            subject: defaultRendered.subject,
            variables: extractVariables(defaultRendered.html),
          });
          setEditedContent(defaultRendered.html);
          setEditedSubject(defaultRendered.subject);
          toast.warning('Using default template due to render error');
        }
      } else {
        // Use default template
        const rendered = defaultTemplate.render({});
        setSelectedTemplate({
          ...defaultTemplate,
          content: rendered.html,
          subject: rendered.subject,
          variables: extractVariables(rendered.html),
        });
        setEditedContent(rendered.html);
        setEditedSubject(rendered.subject);
        toast('Default template loaded', {
          description: `Loaded the default ${defaultTemplate.name} template.`,
        });
      }
    } catch (error) {
      console.error('Failed to load template:', error);
      toast.error('Failed to load template');

      // Fallback to default template
      const defaultTemplate = emailTemplates.find(t => t.id === templateId);
      if (defaultTemplate) {
        const rendered = defaultTemplate.render({});
        setSelectedTemplate({
          ...defaultTemplate,
          content: rendered.html,
          subject: rendered.subject,
          variables: extractVariables(rendered.html),
        });
        setEditedContent(rendered.html);
        setEditedSubject(rendered.subject);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Enhanced variable extraction function
  const extractVariables = (content: string): string[] => {
    const regex = /{{([\w.-]+)}}/g;
    const matches = content.match(regex);
    if (!matches) return [];

    return Array.from(
      new Set(matches.map(match => match.replace(/[{}]/g, '').trim())),
    );
  };

  // Auto-save functionality
  // Remove the useEffect auto-save block completely

  // Modify the saveTemplate function to check for changes
  const saveTemplate = async () => {
    if (!selectedTemplate?.id || !userId) {
      toast.error('No template selected');
      return;
    }

    // Check if content has been modified
    if (
      editedContent === selectedTemplate.content &&
      editedSubject === selectedTemplate.subject
    ) {
      toast.info('No changes to save');
      return;
    }

    try {
      setIsSaving(true);
      setSaveStatus('saving');

      const originalTemplate = emailTemplates.find(
        t => t.id === selectedTemplate.id,
      );

      if (!originalTemplate) {
        throw new Error('Original template not found');
      }

      const updatedTemplate = {
        ...selectedTemplate,
        id: selectedTemplate.id,
        name: selectedTemplate.name,
        type: TemplateType.EMAIL,
        content: editedContent,
        subject: editedSubject,
        render: originalTemplate.render,
      };

      await templateService.saveUserCustomization(
        userId,
        selectedTemplate.id,
        TemplateType.EMAIL,
        updatedTemplate,
      );

      setSaveStatus('saved');
      toast.success('Template saved successfully');

      await loadTemplate();
    } catch (error) {
      console.error('Save error:', error);
      setSaveStatus('error');
      toast.error('Failed to save template');
    } finally {
      setIsSaving(false);
    }
  };

  const handleTemplateChange = (selectedId: string) => {
    setTemplateId(selectedId);
  };

  const resetTemplate = async () => {
    if (!selectedTemplate || !userId) return;

    try {
      // Delete user customization
      await templateService.deleteUserCustomization(
        userId,
        selectedTemplate.id,
        TemplateType.EMAIL,
      );

      // Reset to default template
      const defaultTemplate = emailTemplates.find(
        t => t.id === selectedTemplate.id,
      );

      if (defaultTemplate) {
        const rendered = defaultTemplate.render({});
        const html = rendered.html || '';
        const subject = rendered.subject || '';

        const resetTemplate: EditorTemplate = {
          ...defaultTemplate,
          content: html,
          subject: subject,
          variables: extractVariables(html),
        };

        setSelectedTemplate(resetTemplate);
        setEditedContent(html);
        setEditedSubject(subject);

        // Initialize variables
        const extractedVars = extractVariables(html);
        const initialVars = extractedVars.reduce(
          (acc, curr) => ({
            ...acc,
            [curr]: '',
          }),
          {},
        );
        setVariables(initialVars);

        toast.success('Template reset', {
          description: `The ${selectedTemplate.name} template has been reset to default.`,
        });
      } else {
        toast.error('Default template not found');
      }
    } catch (error) {
      console.error('Failed to reset template:', error);
      toast.error('Failed to reset template');
    }
  };

  const getPreviewContent = () => {
    let preview = editedContent;

    // Apply variable values to preview
    Object.entries(variables).forEach(([key, value]) => {
      if (value) {
        preview = preview.replace(new RegExp(`{{${key}}}`, 'g'), value);
      }
    });

    return preview;
  };

  return (
    <div className='container mx-auto p-6 space-y-6'>
      <div className='flex flex-col gap-6'>
        <h1 className='text-3xl font-bold'>Email Template Editor</h1>
        <div className='flex items-center justify-between flex-wrap gap-4'>
          <Select value={templateId} onValueChange={handleTemplateChange}>
            <SelectTrigger className='w-[280px]'>
              <SelectValue placeholder='Select a template' />
            </SelectTrigger>
            <SelectContent>
              {availableTemplates.map(template => (
                <SelectItem key={template.id} value={template.id}>
                  {template.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className='flex gap-2'>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant='outline' className='flex items-center gap-2'>
                  <HelpCircle className='h-4 w-4' />
                  Variables Guide
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>How to Use Dynamic Variables</DialogTitle>
                  <DialogDescription>
                    Use variables to personalize your email templates
                  </DialogDescription>
                </DialogHeader>
                <div className='py-4'>
                  <h3 className='font-medium mb-2'>Variable Format</h3>
                  <p className='mb-4'>
                    Insert variables using double curly braces:{' '}
                    <code>{'{{variableName}}'}</code>
                  </p>

                  <h3 className='font-medium mb-2'>Common Variables</h3>
                  <ul className='space-y-2 list-disc pl-5'>
                    <li>
                      <code>{'{{firstName}}'}</code> - Recipient's first name
                    </li>
                    <li>
                      <code>{'{{lastName}}'}</code> - Recipient's last name
                    </li>
                    <li>
                      <code>{'{{company}}'}</code> - Company name
                    </li>
                    <li>
                      <code>{'{{date}}'}</code> - Current date
                    </li>
                    <li>
                      <code>{'{{productName}}'}</code> - Product name
                    </li>
                    <li>
                      <code>{'{{orderNumber}}'}</code> - Order reference
                    </li>
                  </ul>

                  <h3 className='font-medium mt-4 mb-2'>Example</h3>
                  <pre className='bg-muted p-2 rounded text-xs'>
                    {`<p>Hello {{firstName}},</p>
<p>Thank you for your order #{{orderNumber}} from {{company}}.</p>`}
                  </pre>
                </div>
              </DialogContent>
            </Dialog>

            

            <Button
              onClick={saveTemplate}
              disabled={isSaving}
              className='flex items-center gap-2'
            >
              <Save className='h-4 w-4' />
              {isSaving ? 'Saving...' : 'Save Template'}
            </Button>

            <Button
              variant='secondary'
              onClick={resetTemplate}
              className='flex items-center gap-2'
              disabled={isSaving}
            >
              <RefreshCw className='h-4 w-4' />
              Reset
            </Button>
          </div>
        </div>

        {selectedTemplate && !isLoading ? (
          <>
            {/* Mobile View */}
            <div className='md:hidden'>
              <Tabs defaultValue='editor' className='w-full'>
                <TabsList className='grid w-full grid-cols-2'>
                  <TabsTrigger value='editor'>Editor</TabsTrigger>
                  <TabsTrigger value='preview'>Preview</TabsTrigger>
                </TabsList>
                <TabsContent value='editor'>
                  <EditorPanel
                    editedSubject={editedSubject}
                    setEditedSubject={setEditedSubject}
                    editedContent={editedContent}
                    setEditedContent={setEditedContent}
                    variables={variables}
                    setVariables={setVariables}
                    selectedTemplate={selectedTemplate}
                  />
                </TabsContent>
                <TabsContent value='preview'>
                  <PreviewPanel
                    editedSubject={editedSubject}
                    previewContent={getPreviewContent()}
                  />
                </TabsContent>
              </Tabs>
            </div>

            {/* Desktop View */}
            <div className='hidden md:grid grid-cols-2 gap-6'>
              <EditorPanel
                editedSubject={editedSubject}
                setEditedSubject={setEditedSubject}
                editedContent={editedContent}
                setEditedContent={setEditedContent}
                variables={variables}
                setVariables={setVariables}
                selectedTemplate={selectedTemplate}
              />
              <PreviewPanel
                editedSubject={editedSubject}
                previewContent={getPreviewContent()}
              />
            </div>
          </>
        ) : (
          <div className='flex justify-center items-center h-64'>
            <Loader className='w-10 h-10 text-center animate-spin' />
          </div>
        )}
      </div>
    </div>
  );
}

interface EditorPanelProps {
  editedSubject: string;
  setEditedSubject: (value: string) => void;
  editedContent: string;
  setEditedContent: (value: string) => void;
  variables: Record<string, string>;
  setVariables: (value: Record<string, string>) => void;
  selectedTemplate: EditorTemplate;
}

function EditorPanel({
  editedSubject,
  setEditedSubject,
  editedContent,
  setEditedContent,
  variables,
  setVariables,
  selectedTemplate,
}: EditorPanelProps) {
  return (
    <Card className='p-4 space-y-4'>
      <div className='space-y-2'>
        <Label htmlFor='subject'>Email Subject</Label>
        <Input
          id='subject'
          value={editedSubject}
          onChange={e => setEditedSubject(e.target.value)}
          placeholder='Enter email subject'
        />
      </div>

      <div className='space-y-2'>
        <Label>Template Content</Label>
        <MonacoEditor
          height='400px'
          language='html'
          theme='vs-dark'
          value={editedContent}
          onChange={value => setEditedContent(value || '')}
          options={{
            minimap: { enabled: false },
            lineNumbers: 'off',
            wordWrap: 'on',
            autoIndent: 'advanced',
          }}
        />
      </div>

      <div className='space-y-2'>
        <div className='flex items-center justify-between'>
          <Label>Variables</Label>
          <span className='text-xs text-muted-foreground'>
            Populate with test values to preview
          </span>
        </div>
        <div className='grid gap-2'>
          {selectedTemplate.variables &&
          selectedTemplate.variables.length > 0 ? (
            selectedTemplate.variables.map(variable => (
              <Input
                key={variable}
                placeholder={variable}
                value={variables[variable] || ''}
                onChange={e =>
                  setVariables({
                    ...variables,
                    [variable]: e.target.value,
                  })
                }
              />
            ))
          ) : (
            <p className='text-sm text-muted-foreground'>
              No variables detected in this template. Add variables using the
              format variableName.
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}

interface PreviewPanelProps {
  editedSubject: string;
  previewContent: string;
}

function PreviewPanel({ editedSubject, previewContent }: PreviewPanelProps) {
  return (
    <Card className='p-4 space-y-4'>
      <div className='space-y-2'>
        <Label>Subject Preview</Label>
        <div className='p-2 border rounded-md bg-muted'>{editedSubject}</div>
      </div>
      <div className='space-y-2'>
        <Label>Email Preview</Label>
        <div
          className='border rounded-md p-4 min-h-[400px] bg-white overflow-auto text-black'
          dangerouslySetInnerHTML={{ __html: previewContent }}
        />
      </div>
    </Card>
  );
}
