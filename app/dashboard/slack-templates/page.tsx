// const SlackTemplate = () => {
//   return (
//     <div>
//       <h1>Slack Template</h1>
//     </div>
//   );
// };

// export default SlackTemplate;


// 'use client';

// import { useState, useEffect } from 'react';
// import { Button } from '@/components/ui/button';
// import { Card } from '@/components/ui/card';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Textarea } from '@/components/ui/textarea';
// import { toast } from 'sonner';
// import { Loader2, RotateCcw } from 'lucide-react';
// import { slackTemplates } from '@/lib/slack-templates';
// import type { SlackTemplate } from '@/lib/types/slack';

// const userId = '95a6137a-c8e3-4ca5-8270-db5c77a6fd1b';

// function formatSlackMessage(text: string): string {
//   // Convert Slack markdown to HTML
//   return text
//     .replace(/\*([^*]+)\*/g, '<strong>$1</strong>') // Bold
//     .replace(/_([^_]+)_/g, '<em>$1</em>') // Italic
//     .replace(/~([^~]+)~/g, '<del>$1</del>') // Strikethrough
//     .replace(/`([^`]+)`/g, '<code>$1</code>') // Code
//     .replace(/\n/g, '<br />') // New lines
//     .replace(/•/g, '•') // Preserve bullets
//     .replace(/<!here>/g, '<span class="text-cyan-400">@here</span>') // @here mention
//     .replace(/<!channel>/g, '<span class="text-cyan-400">@channel</span>') // @channel mention
//     .replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" class="text-blue-400 hover:underline">$1</a>'); // URLs
// }

// export default function SlackTemplateEditor() {
//   const [selectedTemplate, setSelectedTemplate] = useState<SlackTemplate | null>(null);
//   const [editedContent, setEditedContent] = useState('');
//   const [variables, setVariables] = useState<Record<string, string>>({});
//   const [templateId, setTemplateId] = useState(slackTemplates[0].id);
//   const [isSaving, setIsSaving] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);

//   useEffect(() => {
//     const template = slackTemplates.find(t => t.id === templateId);
//     if (template) {
//       setSelectedTemplate(template);
//       setEditedContent(template.content);
//       setVariables(template.defaultValues);
//     }
//   }, [templateId]);

//   const handleSave = async () => {
//     try {
//       setIsSaving(true);
//       // Simulate API call
//       await new Promise(resolve => setTimeout(resolve, 1000));
//       toast.success('Template saved successfully');
//     } catch (error) {
//       toast.error('Failed to save template');
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   const handleResetToDefault = () => {
//     if (selectedTemplate) {
//       setEditedContent(selectedTemplate.content);
//       setVariables(selectedTemplate.defaultValues);
//       toast.success('Reset to default template');
//     }
//   };

//   const getPreviewContent = () => {
//     let preview = editedContent;
//     Object.entries(variables).forEach(([key, value]) => {
//       preview = preview.replace(
//         new RegExp(`{{${key}}}`, 'g'),
//         value || `{{${key}}}`
//       );
//     });
//     return formatSlackMessage(preview);
//   };

//   return (
//     <div className="container mx-auto p-6 space-y-6">
//       <div className="flex flex-col gap-6">
//         <h1 className="text-3xl font-bold">Slack Template Editor</h1>
        
//         <div className="flex items-center justify-between flex-wrap gap-4">
//           <Select value={templateId} onValueChange={setTemplateId}>
//             <SelectTrigger className="w-[280px]">
//               <SelectValue placeholder="Select a template" />
//             </SelectTrigger>
//             <SelectContent>
//               {slackTemplates.map(template => (
//                 <SelectItem key={template.id} value={template.id}>
//                   {template.name}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>

//           <div className="flex gap-2">
//             <Button
//               variant="outline"
//               onClick={handleResetToDefault}
//               disabled={isSaving}
//             >
//               <RotateCcw className="w-4 h-4 mr-2" />
//               Reset to Default
//             </Button>
//             <Button onClick={handleSave} disabled={isSaving}>
//               {isSaving ? (
//                 <>
//                   <Loader2 className="w-4 h-4 mr-2 animate-spin" />
//                   Saving...
//                 </>
//               ) : (
//                 'Save Template'
//               )}
//             </Button>
//           </div>
//         </div>

//         {selectedTemplate && !isLoading ? (
//           <>
//             {/* Mobile View */}
//             <div className="md:hidden">
//               <Tabs defaultValue="editor" className="w-full">
//                 <TabsList className="grid w-full grid-cols-2">
//                   <TabsTrigger value="editor">Editor</TabsTrigger>
//                   <TabsTrigger value="preview">Preview</TabsTrigger>
//                 </TabsList>
//                 <TabsContent value="editor">
//                   <EditorPanel
//                     editedContent={editedContent}
//                     setEditedContent={setEditedContent}
//                     variables={variables}
//                     setVariables={setVariables}
//                     selectedTemplate={selectedTemplate}
//                   />
//                 </TabsContent>
//                 <TabsContent value="preview">
//                   <PreviewPanel previewContent={getPreviewContent()} />
//                 </TabsContent>
//               </Tabs>
//             </div>

//             {/* Desktop View */}
//             <div className="hidden md:grid grid-cols-2 gap-6">
//               <EditorPanel
//                 editedContent={editedContent}
//                 setEditedContent={setEditedContent}
//                 variables={variables}
//                 setVariables={setVariables}
//                 selectedTemplate={selectedTemplate}
//               />
//               <PreviewPanel previewContent={getPreviewContent()} />
//             </div>
//           </>
//         ) : (
//           <div className="flex justify-center items-center min-h-[400px]">
//             <Loader2 className="w-10 h-10 animate-spin text-primary" />
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// interface EditorPanelProps {
//   editedContent: string;
//   setEditedContent: (value: string) => void;
//   variables: Record<string, string>;
//   setVariables: (value: Record<string, string>) => void;
//   selectedTemplate: SlackTemplate;
// }

// function EditorPanel({
//   editedContent,
//   setEditedContent,
//   variables,
//   setVariables,
//   selectedTemplate,
// }: EditorPanelProps) {
//   return (
//     <Card className="p-4 space-y-4">
//       <div className="space-y-2">
//         <Label>Template Content</Label>
//         <Textarea
//           value={editedContent}
//           onChange={e => setEditedContent(e.target.value)}
//           className="min-h-[200px] font-mono"
//           placeholder="Enter your Slack message template"
//         />
//       </div>

//       <div className="space-y-4">
//         <Label>Variables</Label>
//         <div className="grid gap-3">
//           {selectedTemplate.variables.map(variable => (
//             <div key={variable} className="space-y-1">
//               <Label htmlFor={variable} className="text-sm text-muted-foreground">
//                 {variable}
//               </Label>
//               <Input
//                 id={variable}
//                 placeholder={`Enter ${variable}`}
//                 value={variables[variable]}
//                 onChange={e =>
//                   setVariables({
//                     ...variables,
//                     [variable]: e.target.value,
//                   })
//                 }
//               />
//             </div>
//           ))}
//         </div>
//       </div>
//     </Card>
//   );
// }

// interface PreviewPanelProps {
//   previewContent: string;
// }

// function PreviewPanel({ previewContent }: PreviewPanelProps) {
//   return (
//     <Card className="p-4 space-y-4">
//       <div className="space-y-2">
//         <Label>Message Preview</Label>
//         <div 
//           className="border rounded-md p-4 min-h-[200px] bg-[#1a1d21] text-[#e8e8e8] font-sans whitespace-pre-wrap"
//           dangerouslySetInnerHTML={{ __html: previewContent }}
//         />
//       </div>
//     </Card>
//   );
// }

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
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Loader2, RotateCcw } from 'lucide-react';
import { slackTemplates } from '@/lib/slack-templates';
import type { SlackTemplate } from '@/lib/types/slack';

const userId = '95a6137a-c8e3-4ca5-8270-db5c77a6fd1b';

function formatSlackMessage(text: string): string {
  // Convert Slack markdown to HTML
  return text
    .replace(/\*([^*]+)\*/g, '<strong>$1</strong>') // Bold
    .replace(/_([^_]+)_/g, '<em>$1</em>') // Italic
    .replace(/~([^~]+)~/g, '<del>$1</del>') // Strikethrough
    .replace(/`([^`]+)`/g, '<code>$1</code>') // Code
    .replace(/\n/g, '<br />') // New lines
    .replace(/•/g, '•') // Preserve bullets
    .replace(/<!here>/g, '<span class="text-cyan-400">@here</span>') // @here mention
    .replace(/<!channel>/g, '<span class="text-cyan-400">@channel</span>') // @channel mention
    .replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" class="text-blue-400 hover:underline">$1</a>'); // URLs
}

const getStorageKey = (userId: string, templateId: string) => {
  return `slack-template-${userId}-${templateId}`;
};

const loadCustomization = (userId: string, templateId: string) => {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(getStorageKey(userId, templateId));
  return stored ? JSON.parse(stored) : null;
};

const saveCustomization = (userId: string, templateId: string, data: { content: string; variables: Record<string, string> }) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(getStorageKey(userId, templateId), JSON.stringify(data));
};

export default function SlackTemplateEditor() {
  const [selectedTemplate, setSelectedTemplate] = useState<SlackTemplate | null>(null);
  const [editedContent, setEditedContent] = useState('');
  const [variables, setVariables] = useState<Record<string, string>>({});
  const [templateId, setTemplateId] = useState(slackTemplates[0].id);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const template = slackTemplates.find(t => t.id === templateId);
    if (template) {
      setSelectedTemplate(template);
      
      // Load customization or use default
      const customization = loadCustomization(userId, templateId);
      if (customization) {
        setEditedContent(customization.content);
        setVariables(customization.variables);
      } else {
        setEditedContent(template.content);
        setVariables(template.defaultValues);
      }
    }
  }, [templateId]);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      saveCustomization(userId, templateId, {
        content: editedContent,
        variables: variables,
      });
      toast.success('Template saved successfully');
    } catch (error) {
      toast.error('Failed to save template');
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetToDefault = () => {
    if (selectedTemplate) {
      setEditedContent(selectedTemplate.content);
      setVariables(selectedTemplate.defaultValues);
      // Remove customization from storage
      localStorage.removeItem(getStorageKey(userId, templateId));
      toast.success('Reset to default template');
    }
  };

  const getPreviewContent = () => {
    let preview = editedContent;
    Object.entries(variables).forEach(([key, value]) => {
      preview = preview.replace(
        new RegExp(`{{${key}}}`, 'g'),
        value || `{{${key}}}`
      );
    });
    return formatSlackMessage(preview);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col gap-6">
        <h1 className="text-3xl font-bold">Slack Template Editor</h1>
        
        <div className="flex items-center justify-between flex-wrap gap-4">
          <Select value={templateId} onValueChange={setTemplateId}>
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="Select a template" />
            </SelectTrigger>
            <SelectContent>
              {slackTemplates.map(template => (
                <SelectItem key={template.id} value={template.id}>
                  {template.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleResetToDefault}
              disabled={isSaving}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset to Default
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Template'
              )}
            </Button>
          </div>
        </div>

        {selectedTemplate && !isLoading ? (
          <>
            {/* Mobile View */}
            <div className="md:hidden">
              <Tabs defaultValue="editor" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="editor">Editor</TabsTrigger>
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                </TabsList>
                <TabsContent value="editor">
                  <EditorPanel
                    editedContent={editedContent}
                    setEditedContent={setEditedContent}
                    variables={variables}
                    setVariables={setVariables}
                    selectedTemplate={selectedTemplate}
                  />
                </TabsContent>
                <TabsContent value="preview">
                  <PreviewPanel previewContent={getPreviewContent()} />
                </TabsContent>
              </Tabs>
            </div>

            {/* Desktop View */}
            <div className="hidden md:grid grid-cols-2 gap-6">
              <EditorPanel
                editedContent={editedContent}
                setEditedContent={setEditedContent}
                variables={variables}
                setVariables={setVariables}
                selectedTemplate={selectedTemplate}
              />
              <PreviewPanel previewContent={getPreviewContent()} />
            </div>
          </>
        ) : (
          <div className="flex justify-center items-center min-h-[400px]">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        )}
      </div>
    </div>
  );
}

interface EditorPanelProps {
  editedContent: string;
  setEditedContent: (value: string) => void;
  variables: Record<string, string>;
  setVariables: (value: Record<string, string>) => void;
  selectedTemplate: SlackTemplate;
}

function EditorPanel({
  editedContent,
  setEditedContent,
  variables,
  setVariables,
  selectedTemplate,
}: EditorPanelProps) {
  return (
    <Card className="p-4 space-y-4">
      <div className="space-y-2">
        <Label>Template Content</Label>
        <Textarea
          value={editedContent}
          onChange={e => setEditedContent(e.target.value)}
          className="min-h-[200px] font-mono"
          placeholder="Enter your Slack message template"
        />
      </div>

      <div className="space-y-4">
        <Label>Variables</Label>
        <div className="grid gap-3">
          {selectedTemplate.variables.map(variable => (
            <div key={variable} className="space-y-1">
              <Label htmlFor={variable} className="text-sm text-muted-foreground">
                {variable}
              </Label>
              <Input
                id={variable}
                placeholder={`Enter ${variable}`}
                value={variables[variable]}
                onChange={e =>
                  setVariables({
                    ...variables,
                    [variable]: e.target.value,
                  })
                }
              />
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

interface PreviewPanelProps {
  previewContent: string;
}

function PreviewPanel({ previewContent }: PreviewPanelProps) {
  return (
    <Card className="p-4 space-y-4">
      <div className="space-y-2">
        <Label>Message Preview</Label>
        <div 
          className="border rounded-md p-4 min-h-[200px] bg-[#1a1d21] text-[#e8e8e8] font-sans whitespace-pre-wrap"
          dangerouslySetInnerHTML={{ __html: previewContent }}
        />
      </div>
    </Card>
  );
}