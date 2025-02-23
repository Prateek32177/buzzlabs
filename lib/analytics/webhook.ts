import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export interface WebhookAnalytics {
  totalTriggers: number;
  lastTriggered: string;
  events: {
    [key: string]: number;
  };
  responseTime: {
    avg: number;
    count: number;
    total: number;
  };
}

export class WebhookAnalytics {
  static async track(webhookId: string, event: string, responseTime: number) {
    const key = `analytics:demo:${webhookId}`;
    const now = new Date().toISOString();

    try {
      const analytics = (await redis.get<WebhookAnalytics>(key)) || {
        totalTriggers: 0,
        lastTriggered: now,
        events: {},
        responseTime: {
          avg: 0,
          count: 0,
          total: 0,
        },
      };

      // Update analytics
      analytics.totalTriggers += 1;
      analytics.lastTriggered = now;
      analytics.events[event] = (analytics.events[event] || 0) + 1;

      // Update response time metrics
      const rt = analytics.responseTime;
      rt.total += responseTime;
      rt.count += 1;
      rt.avg = rt.total / rt.count;

      // Store updated analytics with 7-day expiry
      await redis.set(key, analytics, { ex: 7 * 24 * 60 * 60 });

      return analytics;
    } catch (error) {
      console.error('Failed to track webhook analytics:', error);
    }
  }

  static async get(webhookId: string): Promise<WebhookAnalytics | null> {
    try {
      return await redis.get(`analytics:demo:${webhookId}`);
    } catch (error) {
      console.error('Failed to get webhook analytics:', error);
      return null;
    }
  }
}
