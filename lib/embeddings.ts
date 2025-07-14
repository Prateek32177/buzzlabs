import { NotificationLogType } from './types/common';

interface CohereEmbeddingResponse {
  embeddings: number[][];
  texts: string[];
}

export async function generateCohereEmbedding(text: string): Promise<number[]> {
  try {
    const response = await fetch('https://api.cohere.ai/v1/embed', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.COHERE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        texts: [text],
        model: 'embed-english-light-v3.0', // Fast, cost-effective model
        input_type: 'search_document',
      }),
    });

    if (!response.ok) {
      throw new Error(`Cohere API error: ${response.statusText}`);
    }

    const data: CohereEmbeddingResponse = await response.json();
    return data.embeddings[0];
  } catch (error) {
    console.error('Cohere embedding generation failed:', error);
    throw error;
  }
}

export async function generateQueryEmbedding(query: string): Promise<number[]> {
  try {
    const response = await fetch('https://api.cohere.ai/v1/embed', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.COHERE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        texts: [query],
        model: 'embed-english-light-v3.0',
        input_type: 'search_query', // Optimized for search queries
      }),
    });

    if (!response.ok) {
      throw new Error(`Cohere API error: ${response.statusText}`);
    }

    const data: CohereEmbeddingResponse = await response.json();
    return data.embeddings[0];
  } catch (error) {
    console.error('Cohere query embedding generation failed:', error);
    throw error;
  }
}

export function createSearchableText(
  log: Partial<NotificationLogType>,
  webhookName?: string,
): string {
  const parts = [];

  // Platform and webhook info
  parts.push(`Platform: ${log.platform}`);
  if (webhookName || log.webhook_name) {
    parts.push(`Webhook: ${webhookName || log.webhook_name}`);
  }

  // Status and channel
  parts.push(`Status: ${log.status}`);
  if (log.channel) {
    parts.push(`Channel: ${log.channel}`);
  }

  // Notification details
  if (log.email_sent !== null) {
    parts.push(`Email: ${log.email_sent ? 'sent' : 'failed'}`);
    if (log.email_recipient) {
      parts.push(`Recipient: ${log.email_recipient}`);
    }
  }

  if (log.slack_sent !== null) {
    parts.push(`Slack: ${log.slack_sent ? 'sent' : 'failed'}`);
    if (log.slack_channel) {
      parts.push(`Channel: ${log.slack_channel}`);
    }
  }

  // Error information
  if (log.error_message) {
    parts.push(`Error: ${log.error_message}`);
  }

  // Timestamp
  if (log.processed_at) {
    parts.push(`Time: ${new Date(log.processed_at).toLocaleString()}`);
  }

  // Payload summary (extract key information)
  if (log.payload) {
    const payloadKeys = Object.keys(log.payload).slice(0, 8);
    parts.push(`Data: ${payloadKeys.join(', ')}`);

    // Extract specific important fields
    if (log.payload.amount) parts.push(`Amount: ${log.payload.amount}`);
    if (log.payload.customer) parts.push(`Customer: ${log.payload.customer}`);
    if (log.payload.event_type) parts.push(`Event: ${log.payload.event_type}`);
    if (log.payload.message) parts.push(`Message: ${log.payload.message}`);
  }

  return parts.join(' | ');
}
