// lib/timeParser.ts
export interface TimeWindow {
  from: string | null;
  to: string | null;
}

export function parseTimeWindow(query: string): TimeWindow {
  const queryLower = query.toLowerCase();
  const now = new Date();

  // Today
  if (queryLower.includes('today')) {
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );
    return {
      from: startOfToday.toISOString(),
      to: now.toISOString(),
    };
  }

  // Yesterday
  if (queryLower.includes('yesterday')) {
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const startOfYesterday = new Date(
      yesterday.getFullYear(),
      yesterday.getMonth(),
      yesterday.getDate(),
    );
    const endOfYesterday = new Date(
      startOfYesterday.getTime() + 24 * 60 * 60 * 1000 - 1,
    );
    return {
      from: startOfYesterday.toISOString(),
      to: endOfYesterday.toISOString(),
    };
  }

  // This week
  if (queryLower.includes('this week') || queryLower.includes('week')) {
    const startOfWeek = new Date(
      now.getTime() - now.getDay() * 24 * 60 * 60 * 1000,
    );
    startOfWeek.setHours(0, 0, 0, 0);
    return {
      from: startOfWeek.toISOString(),
      to: now.toISOString(),
    };
  }

  // Last 24 hours
  if (queryLower.includes('24 hours') || queryLower.includes('last day')) {
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    return {
      from: twentyFourHoursAgo.toISOString(),
      to: now.toISOString(),
    };
  }

  // Last hour
  if (queryLower.includes('last hour') || queryLower.includes('past hour')) {
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    return {
      from: oneHourAgo.toISOString(),
      to: now.toISOString(),
    };
  }

  // Last 7 days
  if (queryLower.includes('7 days') || queryLower.includes('last week')) {
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    return {
      from: sevenDaysAgo.toISOString(),
      to: now.toISOString(),
    };
  }

  // Last 30 days
  if (
    queryLower.includes('30 days') ||
    queryLower.includes('last month') ||
    queryLower.includes('month')
  ) {
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    return {
      from: thirtyDaysAgo.toISOString(),
      to: now.toISOString(),
    };
  }

  // Recent (last 4 hours)
  if (queryLower.includes('recent')) {
    const fourHoursAgo = new Date(now.getTime() - 4 * 60 * 60 * 1000);
    return {
      from: fourHoursAgo.toISOString(),
      to: now.toISOString(),
    };
  }

  // Default to last 24 hours if no specific time mentioned
  const defaultStart = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  return {
    from: defaultStart.toISOString(),
    to: now.toISOString(),
  };
}
