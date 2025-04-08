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
  ArrowDownUp,
  Rows,
  Heading,
  ListOrdered,
  MessageSquare,
  Code,
  RectangleEllipsis,
  CodeXml,
  Link,
  Paperclip,
  Palette,
} from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Editor } from '@monaco-editor/react';

interface BlockBuilderProps {
  template: any;
  onUpdate: (template: any) => void;
  jsonError: string | null;
  setJsonError: (error: string | null) => void;
}

export function BlockBuilder({
  template,
  onUpdate,
  jsonError,
  setJsonError,
}: BlockBuilderProps) {
  const [currentTemplate, setCurrentTemplate] = useState<any>(
    template || {
      username: 'Custom Bot',
      icon_emoji: ':robot_face:',
      text: 'This is a custom template',
      blocks: [],
    },
  );
  const [jsonValue, setJsonValue] = useState<string>('');
  const [charCount, setCharCount] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<string>('blocks');
  const [combinedElements, setCombinedElements] = useState<any[]>([]);

  useEffect(() => {
    if (template) {
      setCurrentTemplate(template);
      setJsonValue(JSON.stringify(template, null, 2));
      setCharCount(JSON.stringify(template, null, 2).length);
    }
  }, [template]);

  useEffect(() => {
    // Only deal with blocks, no attachments
    const blocks = (currentTemplate.blocks || []).map((block: any) => ({
      ...block,
      elementType: 'block',
    }));

    // Always calculate character count from jsonValue
    setCharCount(jsonValue.length);

    // Always update combinedElements
    setCombinedElements(blocks);
  }, [currentTemplate, jsonValue]); // Include both dependencies

  // The key issue is in the updateTemplate function
  const updateTemplate = (updatedTemplate: any) => {
    // Calculate the new JSON value and character count
    const newJsonValue = JSON.stringify(updatedTemplate, null, 2);

    // Always update these state values in a consistent order
    setJsonValue(newJsonValue);
    setCharCount(newJsonValue.length);
    setCurrentTemplate(updatedTemplate);

    // Only call onUpdate if within character limit
    if (newJsonValue.length <= 1700) {
      setJsonError(null);
      onUpdate(updatedTemplate);
    } else {
      setJsonError('Character limit exceeded: Max 1700 characters allowed.');
    }
  };

  // edit jsonValue state when the template changes
  const handleJsonChange = (value: string | undefined) => {
    const safeValue = value || '';

    // Always update character count and JSON value
    setCharCount(safeValue.length);
    setJsonValue(safeValue);

    try {
      // Try to parse JSON
      const parsed = JSON.parse(safeValue);

      // Always update current template if JSON is valid
      setCurrentTemplate(parsed);

      // Only call onUpdate if within character limit
      if (safeValue.length <= 1700) {
        setJsonError(null);
        onUpdate(parsed);
      } else {
        setJsonError('Character limit exceeded: Max 1700 characters allowed.');
      }
    } catch (error) {
      // JSON is invalid
      setJsonError('Invalid JSON format.');
    }
  };

  // Handle adding a block to the combined list
  const addBlock = (blockType: string) => {
    const newBlock = createEmptyBlock(blockType);

    // First check if adding this block would exceed limit
    const updatedTemplate = {
      ...currentTemplate,
      blocks: [...(currentTemplate.blocks || []), newBlock],
    };
    const newJsonValue = JSON.stringify(updatedTemplate, null, 2);

    // Update character count regardless
    setCharCount(newJsonValue.length);

    if (newJsonValue.length > 1700) {
      // Don't add the block if it would exceed limit
      setJsonError('Character limit exceeded: Max 1700 characters allowed.');
      return;
    }

    // Otherwise proceed with the update
    setCurrentTemplate(updatedTemplate);
    setJsonValue(newJsonValue);
    setJsonError(null);
    onUpdate(updatedTemplate);
  };
  // Handle removing an element (block or attachment)
  const removeElement = (index: number) => {
    const element = combinedElements[index];

    // Find the corresponding index in the blocks array
    const blockIndex = currentTemplate.blocks.findIndex(
      (block: any) =>
        JSON.stringify(block) ===
        JSON.stringify({ ...element, elementType: undefined }),
    );

    if (blockIndex !== -1) {
      // Create a new blocks array with the element removed
      const updatedBlocks = [...currentTemplate.blocks];
      updatedBlocks.splice(blockIndex, 1);

      // Create new template with updated blocks
      const updatedTemplate = {
        ...currentTemplate,
        blocks: updatedBlocks,
      };

      // Calculate the new JSON and character count
      const newJsonValue = JSON.stringify(updatedTemplate, null, 2);

      // Update all state in a consistent order
      setJsonValue(newJsonValue);
      setCharCount(newJsonValue.length);
      setCurrentTemplate(updatedTemplate);

      // Only call onUpdate if within character limit
      if (newJsonValue.length <= 1700) {
        setJsonError(null);
        onUpdate(updatedTemplate);
      } else {
        setJsonError('Character limit exceeded: Max 1700 characters allowed.');
      }
    }
  };

  // Handle updating a block
  const updateBlock = (index: number, updatedBlock: any) => {
    const element = combinedElements[index];

    if (element.elementType === 'block') {
      // Find the corresponding index in the blocks array
      const blockIndex = currentTemplate.blocks.findIndex(
        (block: any) =>
          JSON.stringify(block) ===
          JSON.stringify({ ...element, elementType: undefined }),
      );

      if (blockIndex !== -1) {
        const updatedBlocks = [...currentTemplate.blocks];
        updatedBlocks[blockIndex] = updatedBlock;

        updateTemplate({
          ...currentTemplate,
          blocks: updatedBlocks,
        });
      }
    }
  };

  // Handle drag and drop reordering of elements
  const handleElementDragEnd = (result: any) => {
    if (!result.destination) return;

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    // Create a copy of the combined elements array
    const reorderedElements = [...combinedElements];
    const [movedElement] = reorderedElements.splice(sourceIndex, 1);
    reorderedElements.splice(destinationIndex, 0, movedElement);

    // Convert elements back to blocks (no attachments)
    const blocks = reorderedElements.map(element => ({
      ...element,
      elementType: undefined,
    }));

    // Update the template with the reordered blocks
    const updatedTemplate = {
      ...currentTemplate,
      blocks,
    };

    // Calculate the new JSON and update state
    const newJsonValue = JSON.stringify(updatedTemplate, null, 2);
    setJsonValue(newJsonValue);
    setCharCount(newJsonValue.length);
    setCurrentTemplate(updatedTemplate);

    // Only call onUpdate if within character limit
    if (newJsonValue.length <= 1700) {
      setJsonError(null);
      onUpdate(updatedTemplate);
    } else {
      setJsonError('Character limit exceeded: Max 1700 characters allowed.');
    }
  };

  return (
    <div className='h-full w-full'>
      <Tabs defaultValue='blocks' className='h-full flex flex-col gap-4'>
        <TabsList className='grid w-full grid-cols-2'>
          <TabsTrigger value='blocks'>Visual Builder</TabsTrigger>
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
            <div
              className={`flex-1 min-h-0 flex flex-col ${
                jsonError ? 'border-red-500 border-2' : ''
              }`}
            >
              <Editor
                defaultLanguage='json'
                value={jsonValue}
                onChange={handleJsonChange}
                options={{
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  fontSize: 14,
                }}
                className='flex-1'
              />
            </div>
          </TabsContent>

          <TabsContent
            value='blocks'
            className={`h-full ${jsonError ? 'border-2 border-red-500 rounded-md p-2' : ''} mt-0 data-[state=active]:flex data-[state=active]:flex-col`}
          >
            <p className='text-sm text-muted-foreground my-2'>
              Changes will be reflected in the JSON as Well.
            </p>
            {jsonError && (
              <p className='text-sm text-destructive mb-2'>{jsonError}</p>
            )}
            <div className='flex gap-2 mb-4 flex-wrap'>
              <Button
                size='sm'
                variant='outline'
                onClick={() => addBlock('header')}
              >
                <Heading className='h-4 w-4 mr-2' />
                Header
              </Button>
              <Button
                size='sm'
                variant='outline'
                onClick={() => addBlock('links')}
              >
                <Link className='h-4 w-4 mr-2' />
                Links
              </Button>
              <Button
                size='sm'
                variant='outline'
                onClick={() => addBlock('fields')}
              >
                <ListOrdered className='h-4 w-4 mr-2' />
                Field List
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
                onClick={() => addBlock('actions')}
              >
                <RectangleEllipsis className='h-4 w-4 mr-2' />
                Buttons
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
                onClick={() => addBlock('section')}
              >
                <CodeXml className='h-4 w-4 mr-2' />
                Markdown
              </Button>
            </div>
            <div className='flex-1 min-h-0'>
              <ScrollArea className='h-full width-full'>
                <DragDropContext onDragEnd={handleElementDragEnd}>
                  <Droppable droppableId='elements'>
                    {provided => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className='space-y-3 pb-4'
                      >
                        {currentTemplate.blocks.length > 0 ? (
                          currentTemplate.blocks.map(
                            (block: any, index: number) => (
                              <Draggable
                                key={`element-${index}`}
                                draggableId={`element-${index}`}
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
                                          {block.type === 'section'
                                            ? 'Markdown'
                                            : block.type}
                                        </span>
                                      </div>
                                      <Button
                                        variant='ghost'
                                        size='icon'
                                        onClick={() => removeElement(index)}
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
        </div>
        <div
          className={`my-2 text-sm ${
            charCount > 1700 ? 'text-red-500' : 'text-gray-400'
          } flex w-full justify-end`}
        >
          {charCount} / 1700
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
  // Remove elementType before passing to child components
  const cleanBlock = { ...block };
  delete cleanBlock.elementType;

  switch (cleanBlock.type) {
    case 'section':
      return <SectionBlockEditor block={cleanBlock} onChange={onChange} />;
    case 'links':
      return <LinksBlockEditor block={cleanBlock} onChange={onChange} />;
    case 'divider':
      return (
        <p className='text-sm text-muted-foreground'>
          Divider blocks have no additional properties.
        </p>
      );
    case 'actions':
      return <ActionsBlockEditor block={cleanBlock} onChange={onChange} />;
    case 'context':
      return <ContextBlockEditor block={cleanBlock} onChange={onChange} />;
    case 'header':
      return <HeaderBlockEditor block={cleanBlock} onChange={onChange} />;
    case 'fields':
      return <FieldsBlockEditor block={cleanBlock} onChange={onChange} />;
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

  // If block has fields, render FieldsBlockEditor
  if (block.fields) {
    return <FieldsBlockEditor block={block} onChange={onChange} />;
  }

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
    <div className='space-y-3 '>
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
    case 'fields':
      return {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: '*Label 1:* Value 1',
          },
          {
            type: 'mrkdwn',
            text: '*Label 2:* Value 2',
          },
        ],
      };
    default:
      return {
        type,
      };
  }
}

// Add this new block editor for fields
function FieldsBlockEditor({
  block,
  onChange,
}: {
  block: any;
  onChange: (block: any) => void;
}) {
  const addField = () => {
    const fields = [...(block.fields || [])];
    fields.push({
      type: 'mrkdwn',
      text: '*Label:* Value',
    });
    onChange({
      ...block,
      fields,
    });
  };

  const removeField = (index: number) => {
    const fields = [...(block.fields || [])];
    fields.splice(index, 1);
    onChange({
      ...block,
      fields,
    });
  };

  const updateField = (index: number, value: string) => {
    const fields = [...(block.fields || [])];
    fields[index] = {
      type: 'mrkdwn',
      text: value,
    };
    onChange({
      ...block,
      fields,
    });
  };

  return (
    <div className='space-y-3'>
      {(block.fields || []).map((field: any, index: number) => (
        <div key={index} className='flex gap-2'>
          <Input
            value={field.text}
            onChange={e => updateField(index, e.target.value)}
            placeholder='*Label:* Value'
          />
          <Button
            variant='ghost'
            size='icon'
            onClick={() => removeField(index)}
          >
            <Trash2 className='h-4 w-4' />
          </Button>
        </div>
      ))}
      <Button variant='outline' size='sm' onClick={addField} className='w-full'>
        <Plus className='h-4 w-4 mr-2' />
        Add Field
      </Button>
    </div>
  );
}

function LinksBlockEditor({
  block,
  onChange,
}: {
  block: any;
  onChange: (block: any) => void;
}) {
  const addLink = () => {
    const links = [...(block.elements || [])];
    links.push({
      type: 'mrkdwn',
      text: '<https://example.com|Link Text>',
    });
    onChange({
      ...block,
      elements: links,
    });
  };

  const removeLink = (index: number) => {
    const links = [...(block.elements || [])];
    links.splice(index, 1);
    onChange({
      ...block,
      elements: links,
    });
  };

  const updateLink = (index: number, text: string, url: string) => {
    const links = [...(block.elements || [])];
    links[index] = {
      type: 'mrkdwn',
      text: `<${url}|${text}>`,
    };
    onChange({
      ...block,
      elements: links,
    });
  };

  // Helper function to parse link format
  const parseLinkText = (mrkdwn: string) => {
    const match = mrkdwn.match(/<([^|]+)\|(.+)>/);
    return match
      ? { url: match[1], text: match[2] }
      : { url: '', text: mrkdwn };
  };

  return (
    <div className='space-y-3'>
      {(block.elements || []).map((link: any, index: number) => {
        const { url, text } = parseLinkText(link.text);
        return (
          <div key={index} className='flex gap-2'>
            <Input
              value={text}
              onChange={e => updateLink(index, e.target.value, url)}
              placeholder='Link Text'
              className='flex-1'
            />
            <Input
              value={url}
              onChange={e => updateLink(index, text, e.target.value)}
              placeholder='https://example.com'
              className='flex-1'
            />
            <Button
              variant='ghost'
              size='icon'
              onClick={() => removeLink(index)}
            >
              <Trash2 className='h-4 w-4' />
            </Button>
          </div>
        );
      })}
      <Button variant='outline' size='sm' onClick={addLink} className='w-full'>
        <Plus className='h-4 w-4 mr-2' />
        Add Link
      </Button>
    </div>
  );
}

function setJsonError(arg0: string | null) {
  throw new Error('Function not implemented.');
}
