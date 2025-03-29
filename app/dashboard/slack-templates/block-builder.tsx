'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Plus,
  Trash2,
  MoveVertical,
  ArrowDownUp,
  Type,
  ImageIcon,
  Rows,
  Heading,
  ListOrdered,
  MessageSquare,
  Code,
} from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Editor } from '@monaco-editor/react';

interface BlockBuilderProps {
  template: any;
  onUpdate: (template: any) => void;
}

export function BlockBuilder({ template, onUpdate }: BlockBuilderProps) {
  const [currentTemplate, setCurrentTemplate] = useState<any>(
    template || {
      username: 'Custom Bot',
      icon_emoji: ':robot_face:',
      text: 'This is a custom template',
      blocks: [],
    },
  );
  const [jsonValue, setJsonValue] = useState<string>('');
  const [jsonError, setJsonError] = useState<string | null>(null);

  useEffect(() => {
    if (template) {
      setCurrentTemplate(template);
      setJsonValue(JSON.stringify(template, null, 2));
    }
  }, [template]);

  const updateTemplate = (updatedTemplate: any) => {
    setCurrentTemplate(updatedTemplate);
    setJsonValue(JSON.stringify(updatedTemplate, null, 2));
    onUpdate(updatedTemplate);
  };

  const handleJsonChange = (value: string | undefined) => {
    setJsonValue(value || '');
    setJsonError(null);

    try {
      if (value) {
        const parsed = JSON.parse(value);
        setCurrentTemplate(parsed);
        onUpdate(parsed);
      }
    } catch (error) {
      setJsonError('Invalid JSON format');
    }
  };

  const addBlock = (blockType: string) => {
    const newBlock = createEmptyBlock(blockType);
    const updatedTemplate = {
      ...currentTemplate,
      blocks: [...(currentTemplate.blocks || []), newBlock],
    };
    updateTemplate(updatedTemplate);
  };

  const removeBlock = (index: number) => {
    const updatedBlocks = [...(currentTemplate.blocks || [])];
    updatedBlocks.splice(index, 1);
    updateTemplate({
      ...currentTemplate,
      blocks: updatedBlocks,
    });
  };

  const updateBlock = (index: number, updatedBlock: any) => {
    const updatedBlocks = [...(currentTemplate.blocks || [])];
    updatedBlocks[index] = updatedBlock;
    updateTemplate({
      ...currentTemplate,
      blocks: updatedBlocks,
    });
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const blocks = [...(currentTemplate.blocks || [])];
    const [reorderedItem] = blocks.splice(result.source.index, 1);
    blocks.splice(result.destination.index, 0, reorderedItem);

    updateTemplate({
      ...currentTemplate,
      blocks: blocks,
    });
  };

  const updateHeader = (field: string, value: string) => {
    const updatedTemplate = {
      ...currentTemplate,
      [field]: value,
    };
    updateTemplate(updatedTemplate);
  };

  return (
    <div className='h-full w-full'>
      <Tabs defaultValue='blocks' className='h-full flex flex-col'>
        <TabsList className='mb-4'>
          <TabsTrigger value='blocks'>Blocks</TabsTrigger>
          <TabsTrigger value='header'>Header</TabsTrigger>
          <TabsTrigger value='json'>
            <Code className='h-4 w-4 mr-2' />
            JSON
          </TabsTrigger>
        </TabsList>

        <div className='flex-1 overflow-hidden'>
          <TabsContent
            value='json'
            className='h-full mt-0 data-[state=active]:flex data-[state=active]:flex-col'
          >
            <div className='mb-2'>
              <p className='text-sm text-muted-foreground'>
                Edit the JSON directly. Changes will be reflected in the visual
                builder.
              </p>
              {jsonError && (
                <p className='text-sm text-destructive mt-1'>{jsonError}</p>
              )}
            </div>
            <div className='flex-1 min-h-0'>
              <Editor
                height='100%'
                defaultLanguage='json'
                value={jsonValue}
                onChange={handleJsonChange}
                options={{
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  fontSize: 14,
                  theme: 'vs-dark',
                }}
              />
            </div>
          </TabsContent>

          <TabsContent
            value='blocks'
            className='h-full mt-0 data-[state=active]:flex data-[state=active]:flex-col'
          >
            <div className='flex gap-2 mb-4 flex-wrap'>
              <Button
                size='sm'
                variant='outline'
                onClick={() => addBlock('section')}
              >
                <Type className='h-4 w-4 mr-2' />
                Section
              </Button>
              <Button
                size='sm'
                variant='outline'
                onClick={() => addBlock('divider')}
              >
                <Rows className='h-4 w-4 mr-2' />
                Divider
              </Button>
              <Button
                size='sm'
                variant='outline'
                onClick={() => addBlock('image')}
              >
                <ImageIcon className='h-4 w-4 mr-2' />
                Image
              </Button>
              <Button
                size='sm'
                variant='outline'
                onClick={() => addBlock('actions')}
              >
                <ListOrdered className='h-4 w-4 mr-2' />
                Actions
              </Button>
              <Button
                size='sm'
                variant='outline'
                onClick={() => addBlock('context')}
              >
                <MessageSquare className='h-4 w-4 mr-2' />
                Context
              </Button>
              <Button
                size='sm'
                variant='outline'
                onClick={() => addBlock('header')}
              >
                <Heading className='h-4 w-4 mr-2' />
                Header
              </Button>
            </div>

            <div className='flex-1 min-h-0'>
              <ScrollArea className='h-full width-full'>
                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId='blocks'>
                    {provided => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className='space-y-3 pb-4'
                      >
                        {currentTemplate.blocks &&
                        currentTemplate.blocks.length > 0 ? (
                          currentTemplate.blocks.map(
                            (block: any, index: number) => (
                              <Draggable
                                key={index}
                                draggableId={`block-${index}`}
                                index={index}
                              >
                                {provided => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    className='border rounded-md p-3 bg-card'
                                  >
                                    <div className='flex justify-between items-center mb-2'>
                                      <div className='flex items-center'>
                                        <div
                                          {...provided.dragHandleProps}
                                          className='mr-2 cursor-move border rounded-md p-1 hover:bg-muted'
                                        >
                                          <ArrowDownUp className='h-4 w-4 text-muted-foreground' />
                                        </div>
                                        <span className='font-medium capitalize'>
                                          {block.type}
                                        </span>
                                      </div>
                                      <Button
                                        variant='ghost'
                                        size='icon'
                                        onClick={() => removeBlock(index)}
                                        className='h-6 w-6'
                                      >
                                        <Trash2 className='h-4 w-4' />
                                      </Button>
                                    </div>

                                    <BlockEditor
                                      block={block}
                                      onChange={updatedBlock =>
                                        updateBlock(index, updatedBlock)
                                      }
                                    />
                                  </div>
                                )}
                              </Draggable>
                            ),
                          )
                        ) : (
                          <div className='text-center py-8 text-muted-foreground'>
                            <p>
                              No blocks added yet. Use the buttons above to add
                              blocks.
                            </p>
                          </div>
                        )}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              </ScrollArea>
            </div>
          </TabsContent>

          <TabsContent
            value='header'
            className='h-full mt-0 data-[state=active]:flex data-[state=active]:flex-col'
          >
            <ScrollArea className='h-full pr-4'>
              <Card className='border-0 shadow-none'>
                <CardContent className='space-y-4 pt-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='username'>Bot Username</Label>
                    <Input
                      id='username'
                      value={currentTemplate.username || ''}
                      onChange={e => updateHeader('username', e.target.value)}
                      placeholder='e.g., Notification Bot'
                    />
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='icon_emoji'>Icon Emoji</Label>
                    <Input
                      id='icon_emoji'
                      value={currentTemplate.icon_emoji || ''}
                      onChange={e => updateHeader('icon_emoji', e.target.value)}
                      placeholder='e.g., :robot_face:'
                    />
                    <p className='text-xs text-muted-foreground'>
                      Use Slack emoji format like :smile: or :warning:
                    </p>
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='text'>Text (Fallback)</Label>
                    <Textarea
                      id='text'
                      value={currentTemplate.text || ''}
                      onChange={e => updateHeader('text', e.target.value)}
                      placeholder='This text will be shown in notifications and as fallback'
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            </ScrollArea>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

// Component to edit different block types
function BlockEditor({
  block,
  onChange,
}: {
  block: any;
  onChange: (block: any) => void;
}) {
  switch (block.type) {
    case 'section':
      return <SectionBlockEditor block={block} onChange={onChange} />;
    case 'divider':
      return (
        <p className='text-sm text-muted-foreground'>
          Divider blocks have no additional properties.
        </p>
      );
    case 'image':
      return <ImageBlockEditor block={block} onChange={onChange} />;
    case 'actions':
      return <ActionsBlockEditor block={block} onChange={onChange} />;
    case 'context':
      return <ContextBlockEditor block={block} onChange={onChange} />;
    case 'header':
      return <HeaderBlockEditor block={block} onChange={onChange} />;
    default:
      return (
        <p className='text-sm text-muted-foreground'>
          This block type is not supported in the visual editor.
        </p>
      );
  }
}

// Section block editor
function SectionBlockEditor({
  block,
  onChange,
}: {
  block: any;
  onChange: (block: any) => void;
}) {
  const updateText = (text: string) => {
    onChange({
      ...block,
      text: {
        type: 'mrkdwn',
        text,
      },
    });
  };

  return (
    <div className='space-y-3'>
      <div className='space-y-2'>
        <Label htmlFor='section-text'>Text</Label>
        <Textarea
          id='section-text'
          value={block.text?.text || ''}
          onChange={e => updateText(e.target.value)}
          placeholder='Enter text with Slack markdown'
          rows={3}
        />
        <p className='text-xs text-muted-foreground'>
          You can use Slack markdown: *bold*, _italic_, ~strikethrough~, `code`,
          and links like &lt;https://example.com|Example&gt;
        </p>
      </div>
    </div>
  );
}

// Image block editor
function ImageBlockEditor({
  block,
  onChange,
}: {
  block: any;
  onChange: (block: any) => void;
}) {
  const updateField = (field: string, value: string | object) => {
    onChange({
      ...block,
      [field]: value,
    });
  };

  return (
    <div className='space-y-3'>
      <div className='space-y-2'>
        <Label htmlFor='image-url'>Image URL</Label>
        <Input
          id='image-url'
          value={block.image_url || ''}
          onChange={e => updateField('image_url', e.target.value)}
          placeholder='https://example.com/image.png'
        />
      </div>

      <div className='space-y-2'>
        <Label htmlFor='alt-text'>Alt Text</Label>
        <Input
          id='alt-text'
          value={block.alt_text || ''}
          onChange={e => updateField('alt_text', e.target.value)}
          placeholder='Description of the image'
        />
      </div>

      <div className='space-y-2'>
        <Label htmlFor='title-text'>Title (Optional)</Label>
        <Input
          id='title-text'
          value={block.title?.text || ''}
          onChange={e =>
            updateField('title', { type: 'plain_text', text: e.target.value })
          }
          placeholder='Image title'
        />
      </div>
    </div>
  );
}

// Actions block editor
function ActionsBlockEditor({
  block,
  onChange,
}: {
  block: any;
  onChange: (block: any) => void;
}) {
  const addButton = () => {
    const elements = [...(block.elements || [])];
    elements.push({
      type: 'button',
      text: {
        type: 'plain_text',
        text: 'Button',
      },
      value: `button_${elements.length}`,
    });

    onChange({
      ...block,
      elements,
    });
  };

  const removeButton = (index: number) => {
    const elements = [...(block.elements || [])];
    elements.splice(index, 1);

    onChange({
      ...block,
      elements,
    });
  };

  const updateButton = (index: number, field: string, value: any) => {
    const elements = [...(block.elements || [])];

    if (field === 'text') {
      elements[index].text.text = value;
    } else if (field === 'style') {
      if (value === 'default') {
        delete elements[index].style;
      } else {
        elements[index].style = value;
      }
    } else {
      elements[index][field] = value;
    }

    onChange({
      ...block,
      elements,
    });
  };

  return (
    <div className='space-y-3'>
      <Accordion type='multiple' className='w-full'>
        {(block.elements || []).map((button: any, index: number) => (
          <AccordionItem key={index} value={`button-${index}`}>
            <AccordionTrigger className='text-sm'>
              Button: {button.text.text}
            </AccordionTrigger>
            <AccordionContent>
              <div className='space-y-3 pt-2'>
                <div className='space-y-2'>
                  <Label htmlFor={`button-text-${index}`}>Button Text</Label>
                  <Input
                    id={`button-text-${index}`}
                    value={button.text.text}
                    onChange={e => updateButton(index, 'text', e.target.value)}
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor={`button-value-${index}`}>Button Value</Label>
                  <Input
                    id={`button-value-${index}`}
                    value={button.value || ''}
                    onChange={e => updateButton(index, 'value', e.target.value)}
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor={`button-style-${index}`}>Button Style</Label>
                  <Select
                    value={button.style || 'default'}
                    onValueChange={value => updateButton(index, 'style', value)}
                  >
                    <SelectTrigger id={`button-style-${index}`}>
                      <SelectValue placeholder='Select style' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='default'>Default</SelectItem>
                      <SelectItem value='primary'>Primary</SelectItem>
                      <SelectItem value='danger'>Danger</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  variant='destructive'
                  size='sm'
                  onClick={() => removeButton(index)}
                  className='mt-2'
                >
                  <Trash2 className='h-4 w-4 mr-2' />
                  Remove Button
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <Button
        variant='outline'
        size='sm'
        onClick={addButton}
        className='w-full'
      >
        <Plus className='h-4 w-4 mr-2' />
        Add Button
      </Button>
    </div>
  );
}

// Context block editor
function ContextBlockEditor({
  block,
  onChange,
}: {
  block: any;
  onChange: (block: any) => void;
}) {
  const addElement = (type: string) => {
    const elements = [...(block.elements || [])];

    if (type === 'text') {
      elements.push({
        type: 'mrkdwn',
        text: 'Context text',
      });
    } else if (type === 'image') {
      elements.push({
        type: 'image',
        image_url: '',
        alt_text: 'Context image',
      });
    }

    onChange({
      ...block,
      elements,
    });
  };

  const removeElement = (index: number) => {
    const elements = [...(block.elements || [])];
    elements.splice(index, 1);

    onChange({
      ...block,
      elements,
    });
  };

  const updateElement = (index: number, field: string, value: string) => {
    const elements = [...(block.elements || [])];

    if (elements[index].type === 'mrkdwn' && field === 'text') {
      elements[index].text = value;
    } else if (elements[index].type === 'image') {
      elements[index][field] = value;
    }

    onChange({
      ...block,
      elements,
    });
  };

  return (
    <div className='space-y-3'>
      <div className='space-y-2'>
        {(block.elements || []).map((element: any, index: number) => (
          <div key={index} className='border rounded-md p-2 space-y-2'>
            <div className='flex justify-between items-center'>
              <span className='text-sm font-medium capitalize'>
                {element.type}
              </span>
              <Button
                variant='ghost'
                size='icon'
                onClick={() => removeElement(index)}
                className='h-6 w-6'
              >
                <Trash2 className='h-4 w-4' />
              </Button>
            </div>

            {element.type === 'mrkdwn' ? (
              <Textarea
                value={element.text || ''}
                onChange={e => updateElement(index, 'text', e.target.value)}
                placeholder='Context text with Slack markdown'
                rows={2}
              />
            ) : (
              <div className='space-y-2'>
                <Input
                  value={element.image_url || ''}
                  onChange={e =>
                    updateElement(index, 'image_url', e.target.value)
                  }
                  placeholder='Image URL'
                />
                <Input
                  value={element.alt_text || ''}
                  onChange={e =>
                    updateElement(index, 'alt_text', e.target.value)
                  }
                  placeholder='Alt text'
                />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className='flex gap-2'>
        <Button
          variant='outline'
          size='sm'
          onClick={() => addElement('text')}
          className='flex-1'
        >
          <Plus className='h-4 w-4 mr-2' />
          Add Text
        </Button>
        <Button
          variant='outline'
          size='sm'
          onClick={() => addElement('image')}
          className='flex-1'
        >
          <Plus className='h-4 w-4 mr-2' />
          Add Image
        </Button>
      </div>
    </div>
  );
}

// Header block editor
function HeaderBlockEditor({
  block,
  onChange,
}: {
  block: any;
  onChange: (block: any) => void;
}) {
  const updateText = (text: string) => {
    onChange({
      ...block,
      text: {
        type: 'plain_text',
        text,
      },
    });
  };

  return (
    <div className='space-y-2'>
      <Label htmlFor='header-text'>Header Text</Label>
      <Input
        id='header-text'
        value={block.text?.text || ''}
        onChange={e => updateText(e.target.value)}
        placeholder='Enter header text'
      />
      <p className='text-xs text-muted-foreground'>
        Headers can only contain plain text (no markdown).
      </p>
    </div>
  );
}

// Helper function to create empty blocks
function createEmptyBlock(type: string) {
  switch (type) {
    case 'section':
      return {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: 'Add your text here',
        },
      };
    case 'divider':
      return {
        type: 'divider',
      };
    case 'image':
      return {
        type: 'image',
        image_url: '',
        alt_text: 'Image description',
      };
    case 'actions':
      return {
        type: 'actions',
        elements: [
          {
            type: 'button',
            text: {
              type: 'plain_text',
              text: 'Click Me',
            },
            value: 'button_1',
          },
        ],
      };
    case 'context':
      return {
        type: 'context',
        elements: [
          {
            type: 'mrkdwn',
            text: 'Context text here',
          },
        ],
      };
    case 'header':
      return {
        type: 'header',
        text: {
          type: 'plain_text',
          text: 'Header text',
        },
      };
    default:
      return {
        type,
      };
  }
}
