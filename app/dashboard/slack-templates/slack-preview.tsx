"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

interface SlackPreviewProps {
  template: any
}

export function SlackPreview({ template }: SlackPreviewProps) {
  const [expandedImages, setExpandedImages] = useState<Record<string, boolean>>({})

  if (!template) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Invalid template format</p>
      </div>
    )
  }

  const toggleImageExpand = (index: string) => {
    setExpandedImages((prev) => ({
      ...prev,
      [index]: !prev[index],
    }))
  }

  // Render different block types
  const renderBlock = (block: any, index: number) => {
    switch (block.type) {
      case "section":
        return (
          <div key={index} className="mb-3">
            {block.text?.text && (
              <div className="text-sm" dangerouslySetInnerHTML={{ __html: formatSlackText(block.text.text) }} />
            )}
            {block.fields && (
              <div className="grid grid-cols-2 gap-2 mt-2">
                {block.fields.map((field: any, fieldIndex: number) => (
                  <div
                    key={fieldIndex}
                    className="text-sm"
                    dangerouslySetInnerHTML={{ __html: formatSlackText(field.text) }}
                  />
                ))}
              </div>
            )}
            {block.accessory && renderAccessory(block.accessory, `${index}-accessory`)}
          </div>
        )

      case "divider":
        return <Separator key={index} className="my-3" />

      case "image":
        const imageKey = `image-${index}`
        const isExpanded = expandedImages[imageKey] || false
        return (
          <div key={index} className="mb-3">
            {block.title && <p className="font-medium text-sm mb-1">{block.title.text}</p>}
            <div
              className={cn(
                "overflow-hidden rounded-md cursor-pointer transition-all",
                isExpanded ? "max-h-none" : "max-h-[200px]",
              )}
              onClick={() => toggleImageExpand(imageKey)}
            >
              <img
                src={block.image_url || "/placeholder.svg?height=200&width=400"}
                alt={block.alt_text || "Image"}
                className="w-full object-cover"
              />
            </div>
            {block.title && <p className="text-xs text-muted-foreground mt-1">{block.alt_text}</p>}
          </div>
        )

      case "context":
        return (
          <div key={index} className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
            {block.elements.map((element: any, elemIndex: number) => {
              if (element.type === "image") {
                return (
                  <img
                    key={elemIndex}
                    src={element.image_url || "/placeholder.svg?height=20&width=20"}
                    alt={element.alt_text || "Context image"}
                    className="h-5 w-5 rounded"
                  />
                )
              } else {
                return <span key={elemIndex} dangerouslySetInnerHTML={{ __html: formatSlackText(element.text) }} />
              }
            })}
          </div>
        )

      case "actions":
        return (
          <div key={index} className="flex flex-wrap gap-2 mb-3">
            {block.elements.map((element: any, elemIndex: number) => {
              if (element.type === "button") {
                return (
                  <Button key={elemIndex} variant={element.style === "primary" ? "default" : "outline"} size="sm">
                    {element.text.text}
                  </Button>
                )
              }
              return null
            })}
          </div>
        )

      case "header":
        return (
          <div key={index} className="mb-3">
            <h4 className="text-base font-bold">{block.text?.text}</h4>
          </div>
        )

      default:
        return null
    }
  }

  const renderAccessory = (accessory: any, key: string) => {
    if (accessory.type === "image") {
      return (
        <div className="mt-2">
          <img
            src={accessory.image_url || "/placeholder.svg?height=100&width=100"}
            alt={accessory.alt_text || "Accessory image"}
            className="max-h-[100px] rounded-md"
          />
        </div>
      )
    }
    if (accessory.type === "button") {
      return (
        <div className="mt-2">
          <Button variant={accessory.style === "primary" ? "default" : "outline"} size="sm">
            {accessory.text.text}
          </Button>
        </div>
      )
    }
    return null
  }

  // Format Slack text with basic markdown-like syntax
  const formatSlackText = (text: string) => {
    if (!text) return ""

    // Bold
    let formattedText = text.replace(/\*([^*]+)\*/g, "<strong>$1</strong>")

    // Italic
    formattedText = formattedText.replace(/_([^_]+)_/g, "<em>$1</em>")

    // Strike
    formattedText = formattedText.replace(/~([^~]+)~/g, "<del>$1</del>")

    // Code
    formattedText = formattedText.replace(/`([^`]+)`/g, '<code class="bg-muted px-1 py-0.5 rounded text-xs">$1</code>')

    // Links
    formattedText = formattedText.replace(
      /<(https?:\/\/[^|>]+)\|([^>]+)>/g,
      '<a href="$1" class="text-blue-600 hover:underline">$2</a>',
    )
    formattedText = formattedText.replace(
      /<(https?:\/\/[^>]+)>/g,
      '<a href="$1" class="text-blue-600 hover:underline">$1</a>',
    )

    // Mentions
    formattedText = formattedText.replace(/@([a-zA-Z0-9_]+)/g, '<span class="text-blue-600">@$1</span>')

    // Line breaks
    formattedText = formattedText.replace(/\n/g, "<br />")

    return formattedText
  }

  return (
    <div className="slack-preview font-sans text-foreground ">
      {/* Message header with app info */}
      <div className="flex items-start mb-2 border-b border-muted-foreground pb-2">
        <Avatar className="h-9 w-9 mr-2">
          <AvatarImage src="https://ui-avatars.com/api/?name=App&size=36" alt="App" />
          <AvatarFallback>APP</AvatarFallback>
        </Avatar>
        <div>
          <div className="flex items-center">
            <span className="font-bold text-sm">{template.username || "Webhook App"}</span>
            {/* <span className="text-xs text-muted-foreground ml-2">APP</span> */}
            <span className="text-xs text-muted-foreground ml-2">
              Today at {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>
          {template.text && (
            <p className="text-sm mt-1" dangerouslySetInnerHTML={{ __html: formatSlackText(template.text) }} />
          )}
        </div>
      </div>

      {/* Attachments */}
      {template.attachments &&
        template.attachments.map((attachment: any, index: number) => (
          <div
            key={index}
            className="border-l-4 pl-3 py-1 mb-3 mt-1"
            style={{ borderLeftColor: attachment.color || "#1D9BD1" }}
          >
            {attachment.pretext && (
              <p className="text-sm mb-2" dangerouslySetInnerHTML={{ __html: formatSlackText(attachment.pretext) }} />
            )}

            {attachment.author_name && (
              <div className="flex items-center mb-2">
                {attachment.author_icon && (
                  <img src={attachment.author_icon || "/placeholder.svg"} alt="" className="h-4 w-4 mr-1 rounded" />
                )}
                <span className="text-sm font-medium">{attachment.author_name}</span>
              </div>
            )}

            {attachment.title && (
              <div className="mb-2">
                {attachment.title_link ? (
                  <a href={attachment.title_link} className="text-blue-600 font-medium text-sm hover:underline">
                    {attachment.title}
                  </a>
                ) : (
                  <p className="font-medium text-sm">{attachment.title}</p>
                )}
              </div>
            )}

            {attachment.text && (
              <p className="text-sm mb-2" dangerouslySetInnerHTML={{ __html: formatSlackText(attachment.text) }} />
            )}

            {attachment.fields && attachment.fields.length > 0 && (
              <div className={`grid ${attachment.fields.length > 1 ? "grid-cols-2" : "grid-cols-1"} gap-3 mb-2`}>
                {attachment.fields.map((field: any, fieldIndex: number) => (
                  <div key={fieldIndex}>
                    {field.title && <p className="text-xs font-medium">{field.title}</p>}
                    <p className="text-sm" dangerouslySetInnerHTML={{ __html: formatSlackText(field.value) }} />
                  </div>
                ))}
              </div>
            )}

            {attachment.image_url && (
              <div className="mt-2 mb-2">
                <img
                  src={attachment.image_url || "/placeholder.svg"}
                  alt="Attachment"
                  className="max-w-full rounded-md max-h-[200px]"
                />
              </div>
            )}

            {attachment.thumb_url && !attachment.image_url && (
              <div className="mt-2 mb-2">
                <img
                  src={attachment.thumb_url || "/placeholder.svg"}
                  alt="Thumbnail"
                  className="max-h-[80px] rounded-md"
                />
              </div>
            )}

            {attachment.footer && (
              <div className="flex items-center text-xs text-muted-foreground mt-2">
                {attachment.footer_icon && (
                  <img src={attachment.footer_icon || "/placeholder.svg"} alt="" className="h-3 w-3 mr-1 rounded" />
                )}
                <span>{attachment.footer}</span>
                {attachment.ts && <span className="ml-1">| {new Date(attachment.ts * 1000).toLocaleDateString()}</span>}
              </div>
            )}
          </div>
        ))}

      {/* Blocks */}
      {template.blocks && template.blocks.map(renderBlock)}
    </div>
  )
}

