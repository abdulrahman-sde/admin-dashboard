/**
 * Returns the UTC time range for "yesterday"
 *
 * Range:
 *  - startUtc: Yesterday at 00:00:00.000 UTC (inclusive)
 *  - endUtc:   Today at 00:00:00.000 UTC (exclusive)
 *
 * This is safe for analytics, cron jobs, and multi-timezone systems.
 */
export const getYesterdayRange = () => {
  const now = new Date(); // Current moment (internally stored in UTC)

  // Calculate today's start (00:00:00.000) in UTC
  const todayStartUtc = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  );

  // Clone today's UTC start to avoid mutation
  const yesterdayStartUtc = new Date(todayStartUtc);

  // Move back one day in UTC to get yesterday's start
  yesterdayStartUtc.setUTCDate(todayStartUtc.getUTCDate() - 1);

  return {
    startOfDay: yesterdayStartUtc,
    endOfDay: todayStartUtc,
  };
};

/**
 * Returns the UTC time range for "today"
 *
 * Range:
 *  - startUtc: Today at 00:00:00.000 UTC (inclusive)
 *  - endUtc:   Now / Moment of call (or the theoretical end of the day)
 */
export const getTodayRange = () => {
  const now = new Date();

  // Calculate today's start (00:00:00.000) in UTC
  const todayStartUtc = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  );

  return {
    startOfDay: todayStartUtc,
    endOfDay: now,
  };
};

/**
 * Returns two 7-day windows for comparison:
 * 1. This week: Last 7 days including today.
 * 2. Previous week: The 7-day period before that.
 */
export const getTwoWeekRollingRange = () => {
  const now = new Date();

  // "This week" (Last 7 days)
  const thisWeekStart = new Date(now);
  thisWeekStart.setUTCDate(now.getUTCDate() - 6); // Include today
  thisWeekStart.setUTCHours(0, 0, 0, 0);

  // "Previous week" (7 days before this week start)
  const previousWeekStart = new Date(thisWeekStart);
  previousWeekStart.setUTCDate(thisWeekStart.getUTCDate() - 7);

  const previousWeekEnd = new Date(thisWeekStart);

  return {
    thisWeek: {
      from: thisWeekStart,
      to: now,
    },
    previousWeek: {
      from: previousWeekStart,
      to: previousWeekEnd,
    },
  };
};
