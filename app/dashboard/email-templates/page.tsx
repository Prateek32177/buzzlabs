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
import { emailTemplates } from '@/lib/templates';
import { TemplateService } from '@/utils/template-manager';
import { toast } from 'sonner';
import { Loader } from 'lucide-react';

const userId = '95a6137a-c8e3-4ca5-8270-db5c77a6fd1b';
const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
});

interface Template {
  id: string;
  name: string;
  content: string;
  variables: string[];
  subject: string;
}

const EmailTemplateModeled = emailTemplates.map(template => {
  return {
    id: template.id,
    name: template.name,
    content: template.render({}).html,
    variables: [],
    subject: template.render({}).subject,
  };
});

export default function EmailTemplateEditor() {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    null,
  );
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

  useEffect(() => {
    async function loadTemplate() {
      if (!userId) return;

      try {
        setIsLoading(true);
        const templateData = await templateService.getUserTemplate(
          userId,
          templateId,
        );

        if (templateData) {
          const rendered = templateData.render?.({ type: 'Example' }) || {
            html: templateData.content,
            subject: templateData.subject,
          };

          setSelectedTemplate(templateData);
          setEditedContent(rendered.html);
          setEditedSubject(rendered.subject);

          // Initialize variables if any
          // const initialVars = templateData?.variables?.reduce(
          //   (acc, curr) => ({
          //     ...acc,
          //     [curr]: '',
          //   }),
          //   {},
          // );
          // setVariables(initialVars);
        }
      } catch (error) {
        console.error('Failed to load template:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadTemplate();
  }, [templateId]);

  const handleSave = async () => {
    if (!userId || !selectedTemplate) return;

    try {
      setIsSaving(true);
      setSaveStatus('saving');

      const updatedTemplate = {
        ...selectedTemplate,
        content: editedContent,
        subject: editedSubject,
        render: (data: any) => ({
          subject: editedSubject,
          html: editedContent,
        }),
      };

      await templateService.saveUserCustomization(
        userId,
        templateId,
        updatedTemplate,
      );
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      console.error('Failed to save template:', error);
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleTemplateChange = (templateId: string) => {
    setTemplateId(templateId);
    const template = EmailTemplateModeled.find(t => t.id === templateId);
    if (template) {
      setSelectedTemplate(template);
      setEditedContent(template.content);
      setEditedSubject(template.subject);
      const initialVars = template.variables.reduce(
        (acc, curr) => ({
          ...acc,
          [curr]: '',
        }),
        {},
      );
      setVariables(initialVars);
    }
  };

  const getPreviewContent = () => {
    let preview = editedContent;
    // Object.entries(variables).forEach(([key, value]) => {
    //   preview = preview.replace(
    //     new RegExp(`{{${key}}}`, 'g'),
    //     value || `{{${key}}}`,
    //   );
    // });
    return preview;
  };

  return (
    <div className='container mx-auto p-6 space-y-6'>
      <div className='flex flex-col gap-6'>
        <h1 className='text-3xl font-bold'>Email Template Editor</h1>
        <div className='flex items-center justify-between flex-wrap gap-4'>
          <Select
            onValueChange={val => setTemplateId(val)}
            defaultValue={templateId}
          >
            <SelectTrigger className='w-[280px]'>
              <SelectValue placeholder='Select a template' />
            </SelectTrigger>
            <SelectContent>
              {emailTemplates.map(template => (
                <SelectItem key={template.id} value={template.id}>
                  {template.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className='actions'>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Template'}
            </Button>

            {saveStatus === 'saved' && toast.success('✓ Saved successfully')}
            {saveStatus === 'error' && toast.error('Failed to save')}
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
          <Loader className='w-10 h-10 text-center text-white animate-spin m-auto mt-20' />
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
  selectedTemplate: Template;
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
        <Label>Variables</Label>
        <div className='grid gap-2'>
          {/* {selectedTemplate.variables.map(variable => (
            <Input
              key={variable}
              placeholder={variable}
              value={variables[variable]}
              onChange={e =>
                setVariables({
                  ...variables,
                  [variable]: e.target.value,
                })
              }
            />
          ))} */}
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
