import { useState, useEffect, useRef } from 'react';
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
      setCharCount(jsonValue.length);
    }
  }, [template]);

  useEffect(() => {
    // Combine blocks and attachments into a single array for the visual editor
    // Each element has a type property indicating if it's a block or attachment
    const blocks = (currentTemplate.blocks || []).map((block: any) => ({
      ...block,
      elementType: 'block',
    }));

    // If attachments exist, convert them to a format that can be displayed alongside blocks
    const attachments = (currentTemplate.attachments || []).map(
      (attachment: any) => ({
        type: 'attachment',
        elementType: 'attachment',
        attachment: attachment,
      }),
    );
    setCharCount(jsonValue.length);
    if (charCount > 1700) {
      setJsonError(`Character limit exceeded: Max 1700 characters allowed.`);
      handleJsonChange(jsonValue);
      return;
    }
    setCombinedElements([...blocks, ...attachments]);
  }, [currentTemplate.blocks]);

  const updateTemplate = (updatedTemplate: any) => {
    const updatedJson = JSON.stringify(updatedTemplate, null, 2);
    const newCharCount = updatedJson.length;

    if (newCharCount > 1700) {
      setJsonError('Character limit exceeded: Max 1700 characters allowed.');
      setCharCount(newCharCount);
      return;
    }

    setCurrentTemplate(updatedTemplate);
    setJsonValue(updatedJson);
    setCharCount(newCharCount);
    setJsonError(null);
    onUpdate(updatedTemplate);
  };

  // edit jsonValue state when the template changes
  const handleJsonChange = (value: string | undefined) => {
    const safeValue = value || '';
    const newCount = safeValue.length;
    setCharCount(newCount);

    if (charCount > 1700) {
      setJsonError(`Character limit exceeded: Max 1700 characters allowed.`);
      setCharCount(newCount);
      return;
    }

    try {
      const parsed = JSON.parse(safeValue);
      setCurrentTemplate(parsed);
      onUpdate(parsed);
      updateTemplate(parsed);
      setJsonValue(safeValue);
      setCharCount(newCount);
      setJsonError(null);
    } catch (error) {
      setCharCount(newCount);
      setJsonError('Invalid JSON format.');
    }
  };

  // Handle adding a block to the combined list
  const addBlock = (blockType: string) => {
    const newBlock = createEmptyBlock(blockType);

    // Add the elementType property to identify it as a block
    const blockWithType = {
      ...newBlock,
      elementType: 'block',
    };

    // Update the blocks array in the template
    const updatedTemplate = {
      ...currentTemplate,
      blocks: [...(currentTemplate.blocks || []), newBlock],
    };

    updateTemplate(updatedTemplate);
  };

  // Handle removing an element (block or attachment)
  const removeElement = (index: number) => {
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
        updatedBlocks.splice(blockIndex, 1);

        updateTemplate({
          ...currentTemplate,
          blocks: updatedBlocks,
        });
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

    // Separate the reordered elements back into blocks and attachments
    const blocks = reorderedElements
      .filter(element => element.elementType === 'block')
      .map(element => ({ ...element, elementType: undefined }));

    const attachments = reorderedElements
      .filter(element => element.elementType === 'attachment')
      .map(element => element.attachment);

    // Update the template with the reordered blocks and attachments
    updateTemplate({
      ...currentTemplate,
      blocks,
      attachments,
    });
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
                        {combinedElements.length > 0 ? (
                          combinedElements
                            .filter(element => element.elementType === 'block')
                            .map((element: any, index: number) => (
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
                                          {element.type === 'section'
                                            ? 'Markdown'
                                            : element.type}
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
                                      block={element}
                                      onChange={updatedBlock =>
                                        updateBlock(index, updatedBlock)
                                      }
                                    />
                                  </div>
                                )}
                              </Draggable>
                            ))
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

// Generic text input hook for cursor position management
function useTextInputWithCursor(initialText: string) {
  const [text, setText] = useState(initialText);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  const [cursorPosition, setCursorPosition] = useState<number | null>(null);

  // Restore cursor position after render
  useEffect(() => {
    if (cursorPosition !== null && inputRef.current) {
      inputRef.current.setSelectionRange(cursorPosition, cursorPosition);
      setCursorPosition(null);
    }
  }, [cursorPosition, text]);

  const handleTextChange = (newText: string) => {
    // Save cursor position before update
    if (inputRef.current) {
      setCursorPosition(inputRef.current.selectionStart);
    }
    setText(newText);
  };

  return { text, setText, inputRef, handleTextChange };
}

// Section block editor
function SectionBlockEditor({
  block,
  onChange,
}: {
  block: any;
  onChange: (block: any) => void;
}) {
  const { text, setText, inputRef, handleTextChange } = useTextInputWithCursor(
    block.text?.text || '',
  );

  // Update local state when block changes
  useEffect(() => {
    setText(block.text?.text || '');
  }, [block.text?.text]);

  const updateText = (newText: string) => {
    handleTextChange(newText);
    onChange({
      ...block,
      text: {
        type: 'mrkdwn',
        text: newText,
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
          ref={inputRef as React.RefObject<HTMLTextAreaElement>}
          value={text}
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
      url: '',
      action_id: `action_${Date.now()}_${elements.length}`,
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
                  <p className='text-xs text-muted-foreground'>
                    A value sent to your app when the button is clicked
                  </p>
                </div>

                <div className='space-y-2'>
                  <Label htmlFor={`button-url-${index}`}>URL (Optional)</Label>
                  <Input
                    id={`button-url-${index}`}
                    value={button.url || ''}
                    onChange={e => updateButton(index, 'url', e.target.value)}
                    placeholder='https://example.com'
                  />
                  <p className='text-xs text-muted-foreground'>
                    If provided, the button will act as a link to this URL
                  </p>
                </div>

                <div className='space-y-2'>
                  <Label htmlFor={`button-action-id-${index}`}>Action ID</Label>
                  <Input
                    id={`button-action-id-${index}`}
                    value={button.action_id || `action_${Date.now()}_${index}`}
                    onChange={e =>
                      updateButton(index, 'action_id', e.target.value)
                    }
                  />
                  <p className='text-xs text-muted-foreground'>
                    Unique identifier for this button in your app
                  </p>
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
        {(block.elements || []).map((element: any, index: number) => {
          // Create refs for each text element
          const textRef = useRef<HTMLTextAreaElement>(null);
          const [cursorPosition, setCursorPosition] = useState<number | null>(
            null,
          );

          // Effect to restore cursor position for this specific element
          useEffect(() => {
            if (
              cursorPosition !== null &&
              textRef.current &&
              element.type === 'mrkdwn'
            ) {
              textRef.current.setSelectionRange(cursorPosition, cursorPosition);
              setCursorPosition(null);
            }
          }, [cursorPosition, element.text]);

          return (
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
                  ref={textRef}
                  value={element.text || ''}
                  onChange={e => {
                    // Save cursor position before update
                    if (textRef.current) {
                      setCursorPosition(textRef.current.selectionStart);
                    }
                    updateElement(index, 'text', e.target.value);
                  }}
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
          );
        })}
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
  const { text, setText, inputRef, handleTextChange } = useTextInputWithCursor(
    block.text?.text || '',
  );

  // Update local state when block changes
  useEffect(() => {
    setText(block.text?.text || '');
  }, [block.text?.text]);

  const updateText = (newText: string) => {
    handleTextChange(newText);
    onChange({
      ...block,
      text: {
        type: 'plain_text',
        text: newText,
      },
    });
  };

  return (
    <div className='space-y-2'>
      <Label htmlFor='header-text'>Header Text</Label>
      <Input
        id='header-text'
        ref={inputRef as React.RefObject<HTMLInputElement>}
        value={text}
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
              emoji: true,
            },
            value: 'button_1',
            action_id: `action_${Date.now()}_1`,
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
          emoji: true,
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

function FieldItemEditor({
  index,
  text,
  onChange,
  onRemove,
}: {
  index: number;
  text: string;
  onChange: (index: number, value: string) => void;
  onRemove: (index: number) => void;
}) {
  const {
    text: inputText,
    inputRef,
    handleTextChange,
  } = useTextInputWithCursor(text);

  useEffect(() => {
    handleTextChange(text); // sync external updates
  }, [text]);

  return (
    <div className='flex gap-2'>
      <Input
        ref={inputRef as React.Ref<HTMLInputElement>}
        value={inputText}
        onChange={e => {
          handleTextChange(e.target.value);
          onChange(index, e.target.value);
        }}
        placeholder='*Label:* Value'
      />
      <Button variant='ghost' size='icon' onClick={() => onRemove(index)}>
        <Trash2 className='h-4 w-4' />
      </Button>
    </div>
  );
}

function FieldsBlockEditor({
  block,
  onChange,
}: {
  block: any;
  onChange: (block: any) => void;
}) {
  const updateField = (index: number, value: string) => {
    const updatedFields = [...(block.fields || [])];
    updatedFields[index] = { type: 'mrkdwn', text: value };
    onChange({ ...block, fields: updatedFields });
  };

  const addField = () => {
    const fields = [
      ...(block.fields || []),
      { type: 'mrkdwn', text: '*Label:* Value' },
    ];
    onChange({ ...block, fields });
  };

  const removeField = (index: number) => {
    const fields = [...(block.fields || [])];
    fields.splice(index, 1);
    onChange({ ...block, fields });
  };

  return (
    <div className='space-y-3'>
      {(block.fields || []).map((field: any, index: number) => (
        <FieldItemEditor
          key={index}
          index={index}
          text={field.text}
          onChange={updateField}
          onRemove={removeField}
        />
      ))}
      <Button variant='outline' size='sm' onClick={addField} className='w-full'>
        <Plus className='h-4 w-4 mr-2' />
        Add Field
      </Button>
      <p className='text-xs text-muted-foreground'>
        Use Slack markdown: *bold* for labels, and separate labels and values
        with a colon.
      </p>
    </div>
  );
}

function parseLinkText(mrkdwn: string) {
  const match = mrkdwn.match(/<([^|]+)\|(.+)>/);
  return match ? { url: match[1], text: match[2] } : { url: '', text: '' };
}

function LinkItemEditor({
  index,
  value,
  onChange,
  onRemove,
}: {
  index: number;
  value: string;
  onChange: (index: number, newText: string, newUrl: string) => void;
  onRemove: (index: number) => void;
}) {
  const parsed = parseLinkText(value);
  const textState = useTextInputWithCursor(parsed.text);
  const urlState = useTextInputWithCursor(parsed.url);

  useEffect(() => {
    textState.handleTextChange(parsed.text);
    urlState.handleTextChange(parsed.url);
  }, [value]);

  return (
    <div className='flex gap-2'>
      <Input
        ref={textState.inputRef as React.Ref<HTMLInputElement>}
        value={textState.text}
        onChange={e => {
          textState.handleTextChange(e.target.value);
          onChange(index, e.target.value, urlState.text);
        }}
        placeholder='Link Text'
        className='flex-1'
      />
      <Input
        ref={urlState.inputRef as React.Ref<HTMLInputElement>}
        value={urlState.text}
        onChange={e => {
          urlState.handleTextChange(e.target.value);
          onChange(index, textState.text, e.target.value);
        }}
        placeholder='https://example.com'
        className='flex-1'
      />
      <Button variant='ghost' size='icon' onClick={() => onRemove(index)}>
        <Trash2 className='h-4 w-4' />
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
  const updateLink = (index: number, newText: string, newUrl: string) => {
    const links = [...(block.elements || [])];
    const formatted = newText && newUrl ? `<${newUrl}|${newText}>` : '';
    links[index] = { type: 'mrkdwn', text: formatted };
    onChange({ ...block, elements: links });
  };

  const addLink = () => {
    const links = [
      ...(block.elements || []),
      { type: 'mrkdwn', text: '<https://example.com|Link Text>' },
    ];
    onChange({ ...block, elements: links });
  };

  const removeLink = (index: number) => {
    const links = [...(block.elements || [])];
    links.splice(index, 1);
    onChange({ ...block, elements: links });
  };

  return (
    <div className='space-y-3'>
      {(block.elements || []).map((element: any, index: number) => (
        <LinkItemEditor
          key={index}
          index={index}
          value={element.text}
          onChange={updateLink}
          onRemove={removeLink}
        />
      ))}
      <Button variant='outline' size='sm' onClick={addLink} className='w-full'>
        <Plus className='h-4 w-4 mr-2' />
        Add Link
      </Button>
      <p className='text-xs text-muted-foreground'>
        Links will be formatted as &lt;URL|Text&gt; in Slack's markdown format.
      </p>
    </div>
  );
}
