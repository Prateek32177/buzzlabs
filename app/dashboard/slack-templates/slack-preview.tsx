'use client';

import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface SlackPreviewProps {
  template: any;
  jsonError?: string | null;
}

export function SlackPreview({ template, jsonError }: SlackPreviewProps) {
  const [expandedImages, setExpandedImages] = useState<Record<string, boolean>>(
    {},
  );

  if (!template) {
    return (
      <div className='flex items-center justify-center h-full'>
        <p className='text-muted-foreground'>Invalid template format</p>
      </div>
    );
  }

  const toggleImageExpand = (index: string) => {
    setExpandedImages(prev => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  // Render different block types
  const renderBlock = (block: any, index: number) => {
    switch (block.type) {
      case 'section':
        return (
          <div key={index} className='mb-3'>
            {block.text?.text && (
              <div
                className='text-sm'
                dangerouslySetInnerHTML={{
                  __html: formatSlackText(block.text.text),
                }}
              />
            )}
            {block.fields && (
              <div className='grid grid-cols-2 gap-2 mt-2'>
                {block.fields.map((field: any, fieldIndex: number) => (
                  <div
                    key={fieldIndex}
                    className='text-sm'
                    dangerouslySetInnerHTML={{
                      __html: formatSlackText(field.text),
                    }}
                  />
                ))}
              </div>
            )}
            {block.accessory &&
              renderAccessory(block.accessory, `${index}-accessory`)}
          </div>
        );

      case 'divider':
        return <Separator key={index} className='my-3' />;

      case 'image':
        const imageKey = `image-${index}`;
        const isExpanded = expandedImages[imageKey] || false;
        return (
          <div key={index} className='mb-3'>
            {block.title && (
              <p className='font-medium text-sm mb-1'>{block.title.text}</p>
            )}
            <div
              className={cn(
                'overflow-hidden rounded-md cursor-pointer transition-all',
                isExpanded ? 'max-h-none' : 'max-h-[200px]',
              )}
              onClick={() => toggleImageExpand(imageKey)}
            >
              <img
                src={block.image_url || '/placeholder.svg?height=200&width=400'}
                alt={block.alt_text || 'Image'}
                className='w-full object-cover'
              />
            </div>
            {block.title && (
              <p className='text-xs text-muted-foreground mt-1'>
                {block.alt_text}
              </p>
            )}
          </div>
        );

      case 'context':
        return (
          <div
            key={index}
            className='flex items-center gap-2 text-xs text-muted-foreground mb-3'
          >
            {block.elements.map((element: any, elemIndex: number) => {
              if (element.type === 'image') {
                return (
                  <img
                    key={elemIndex}
                    src={
                      element.image_url || '/placeholder.svg?height=20&width=20'
                    }
                    alt={element.alt_text || 'Context image'}
                    className='h-5 w-5 rounded'
                  />
                );
              } else {
                return (
                  <span
                    key={elemIndex}
                    dangerouslySetInnerHTML={{
                      __html: formatSlackText(element.text),
                    }}
                  />
                );
              }
            })}
          </div>
        );

      case 'actions':
        return (
          <div key={index} className='flex flex-wrap gap-2 mb-3'>
            {block.elements.map((element: any, elemIndex: number) => {
              if (element.type === 'button') {
                return (
                  <Button
                    key={elemIndex}
                    variant={
                      element.style === 'primary' ? 'default' : 'outline'
                    }
                    size='sm'
                    className={cn(
                      'h-8 px-3 text-sm rounded-md',
                      element.style === 'primary'
                        ? 'bg-[#007a5a] hover:bg-[#148567] text-white'
                        : 'border-[#1d1c1d] text-white hover:bg-[#f8f8f8]',
                    )}
                  >
                    {element.text.text}
                  </Button>
                );
              }
              return null;
            })}
          </div>
        );

      case 'header':
        return (
          <div key={index} className='mb-3'>
            <h4 className='text-base font-bold'>{block.text?.text}</h4>
          </div>
        );

      case 'fields':
        return (
          <div key={index} className='grid grid-cols-2 gap-3 mb-3'>
            {block.fields.map((field: any, fieldIndex: number) => (
              <div key={fieldIndex} className='text-sm'>
                <div
                  dangerouslySetInnerHTML={{
                    __html: formatSlackText(field.text),
                  }}
                />
              </div>
            ))}
          </div>
        );
      case 'links':
        return (
          <div key={index} className='mb-3'>
            {block?.elements?.map((element: any, elementIndex: number) => (
              <div key={elementIndex}>
                <span
                  className='text-sm'
                  dangerouslySetInnerHTML={{
                    __html: formatSlackText(element.text),
                  }}
                />
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  const renderAccessory = (accessory: any, key: string) => {
    if (accessory.type === 'image') {
      return (
        <div className='mt-2'>
          <img
            src={accessory.image_url || '/placeholder.svg?height=100&width=100'}
            alt={accessory.alt_text || 'Accessory image'}
            className='max-h-[100px] rounded-md'
          />
        </div>
      );
    }
    if (accessory.type === 'button') {
      return (
        <div className='mt-2'>
          <Button
            variant={accessory.style === 'primary' ? 'default' : 'outline'}
            size='sm'
          >
            {accessory.text.text}
          </Button>
        </div>
      );
    }
    return null;
  };

  // Format Slack text with basic markdown-like syntax
  const formatSlackText = (text: string) => {
    if (!text) return '';

    // Bold
    let formattedText = text.replace(/\*([^*]+)\*/g, '<strong>$1</strong>');

    // Italic
    formattedText = formattedText.replace(/_([^_]+)_/g, '<em>$1</em>');

    // Strike
    formattedText = formattedText.replace(/~([^~]+)~/g, '<del>$1</del>');

    // Code
    formattedText = formattedText.replace(
      /`([^`]+)`/g,
      '<code class="bg-[#f8f8f8] px-1 py-0.5 rounded text-[13px] font-mono text-[#e01e5a]">$1</code>',
    );

    formattedText = formattedText.replace(
      /<(https?:\/\/[^|>]+)\|([^>]+)>/g,
      '<a href="$1" class="text-[#1264a3] hover:underline">$2</a>',
    );

    // 7. Update mention styling
    formattedText = formattedText.replace(
      /@([a-zA-Z0-9_]+)/g,
      '<span class="text-[#1264a3] hover:underline">@$1</span>',
    );

    // Line breaks
    formattedText = formattedText.replace(/\n/g, '<br />');

    return formattedText;
  };

  return (
    <div className='slack-preview font-sans text-primary-foreground bg-white rounded-lg p-4 shadow-xl'>
      {/* Message header with app info */}
      <div className='flex items-start mb-2 pb-2'>
        <Avatar className='h-12 w-12 mr-2 rounded-sm'>
          <AvatarImage
            src='https://api.dicebear.com/9.x/icons/svg?seed=Jack&backgroundColor=81d4fa,90caf9,9fa8da,a5d6a7,b39ddb,c5e1a5,ce93d8,e6ee9c,ef9a9a,f48fb1,ffab91,ffcc80,ffe082,80cbc4,80deea&backgroundType=gradientLinear,solid'
            alt='avatar'
            className='rounded-none'
          ></AvatarImage>
          <AvatarFallback className='rounded-sm'>APP</AvatarFallback>
        </Avatar>
        <div>
          <div className='flex items-center'>
            <span className='font-bold text-[15px] text-[#1d1c1d]'>
              {' '}
              {/* Slack-specific text size */}
              {template.username || 'Webhook App'}
            </span>
            <span className='text-[13px] text-[#616061] ml-2'>
              {' '}
              {/* Slack's muted color */}
              Today at{' '}
              {new Date().toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
          {template.text && (
            <p
              className='text-[15px] mt-1 text-[#1d1c1d] leading-[1.46668]' // Slack's text styling
              dangerouslySetInnerHTML={{
                __html: formatSlackText(template.text),
              }}
            />
          )}
        </div>
      </div>

      {/* Attachments */}
      <div className='ml-14'>
        {template.attachments &&
          template.attachments.map((attachment: any, index: number) => (
            <div
              key={index}
              className='border-l-4 pl-3 py-1 mb-3 mt-1 bg-[#f8f8f8] rounded-sm' // Slack's attachment background
              style={{ borderLeftColor: attachment.color || '#1D9BD1' }}
            >
              {attachment.pretext && (
                <p
                  className='text-sm mb-2'
                  dangerouslySetInnerHTML={{
                    __html: formatSlackText(attachment.pretext),
                  }}
                />
              )}

              {attachment.author_name && (
                <div className='flex items-center mb-2'>
                  {attachment.author_icon && (
                    <img
                      src={attachment.author_icon || '/placeholder.svg'}
                      alt=''
                      className='h-4 w-4 mr-1 rounded'
                    />
                  )}
                  <span className='text-sm font-medium'>
                    {attachment.author_name}
                  </span>
                </div>
              )}

              {attachment.title && (
                <div className='mb-2'>
                  {attachment.title_link ? (
                    <a
                      href={attachment.title_link}
                      className='text-blue-600 font-medium text-sm hover:underline'
                    >
                      {attachment.title}
                    </a>
                  ) : (
                    <p className='font-medium text-sm'>{attachment.title}</p>
                  )}
                </div>
              )}

              {attachment.text && (
                <p
                  className='text-sm mb-2'
                  dangerouslySetInnerHTML={{
                    __html: formatSlackText(attachment.text),
                  }}
                />
              )}

              {attachment.fields && attachment.fields.length > 0 && (
                <div
                  className={`grid ${attachment.fields.length > 1 ? 'grid-cols-2' : 'grid-cols-1'} gap-3 mb-2`}
                >
                  {attachment.fields.map((field: any, fieldIndex: number) => (
                    <div key={fieldIndex}>
                      {field.title && (
                        <p className='text-xs font-medium'>{field.title}</p>
                      )}
                      <p
                        className='text-sm'
                        dangerouslySetInnerHTML={{
                          __html: formatSlackText(field.value),
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}

              {attachment.image_url && (
                <div className='mt-2 mb-2'>
                  <img
                    src={attachment.image_url || '/placeholder.svg'}
                    alt='Attachment'
                    className='max-w-full rounded-md max-h-[200px]'
                  />
                </div>
              )}

              {attachment.thumb_url && !attachment.image_url && (
                <div className='mt-2 mb-2'>
                  <img
                    src={attachment.thumb_url || '/placeholder.svg'}
                    alt='Thumbnail'
                    className='max-h-[80px] rounded-md'
                  />
                </div>
              )}

              {attachment.footer && (
                <div className='flex items-center text-xs text-muted-foreground mt-2'>
                  {attachment.footer_icon && (
                    <img
                      src={attachment.footer_icon || '/placeholder.svg'}
                      alt=''
                      className='h-3 w-3 mr-1 rounded'
                    />
                  )}
                  <span>{attachment.footer}</span>
                  {attachment.ts && (
                    <span className='ml-1'>
                      | {new Date(attachment.ts * 1000).toLocaleDateString()}
                    </span>
                  )}
                </div>
              )}
            </div>
          ))}

        {/* Blocks */}
        {template.blocks && template.blocks.map(renderBlock)}
      </div>
    </div>
  );
}
