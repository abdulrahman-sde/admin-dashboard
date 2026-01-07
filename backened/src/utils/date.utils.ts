export const getYesterdayRange = () => {
  const now = new Date(); // Current moment (internally stored in UTC)

  const todayStartUtc = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  );

  const yesterdayStartUtc = new Date(todayStartUtc);

  yesterdayStartUtc.setUTCDate(todayStartUtc.getUTCDate() - 1);

  return {
    startOfDay: yesterdayStartUtc,
    endOfDay: todayStartUtc,
  };
};

export const getTodayRange = () => {
  const now = new Date();

  const todayStartUtc = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  );

  return {
    startOfDay: todayStartUtc,
    endOfDay: now,
  };
};

export const getTwoWeekRollingRange = () => {
  const now = new Date();

  const thisWeekStart = new Date(now);
  thisWeekStart.setUTCDate(now.getUTCDate() - 6); // Include today
  thisWeekStart.setUTCHours(0, 0, 0, 0);

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
