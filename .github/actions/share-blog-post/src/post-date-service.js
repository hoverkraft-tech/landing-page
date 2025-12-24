class PostDateService {
  constructor({ timeZone, now, random } = {}) {
    this.timeZone = timeZone ?? "Europe/Paris";
    this.now = now ?? (() => new Date());
    this.random = random ?? Math.random;
  }

  static getDatePartsInTimeZone(date, timeZone) {
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).formatToParts(date);

    const year = Number(parts.find((p) => p.type === "year")?.value);
    const month = Number(parts.find((p) => p.type === "month")?.value);
    const day = Number(parts.find((p) => p.type === "day")?.value);

    return { year, month, day };
  }

  static getTimePartsInTimeZone(date, timeZone) {
    const parts = new Intl.DateTimeFormat("en-GB", {
      timeZone,
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).formatToParts(date);

    const hour = Number(parts.find((p) => p.type === "hour")?.value);
    const minute = Number(parts.find((p) => p.type === "minute")?.value);
    const second = Number(parts.find((p) => p.type === "second")?.value);

    return { hour, minute, second };
  }

  static areSameYmd(a, b) {
    return a.year === b.year && a.month === b.month && a.day === b.day;
  }

  static compareYmd(a, b) {
    if (a.year !== b.year) {
      return a.year < b.year ? -1 : 1;
    }
    if (a.month !== b.month) {
      return a.month < b.month ? -1 : 1;
    }
    if (a.day !== b.day) {
      return a.day < b.day ? -1 : 1;
    }
    return 0;
  }

  static getTimeZoneOffsetMinutes(timeZone, date) {
    // Uses shortOffset output like "GMT+1" / "GMT+02:00".
    const parts = new Intl.DateTimeFormat("en", {
      timeZone,
      timeZoneName: "shortOffset",
      hour: "2-digit",
    }).formatToParts(date);

    const tzName = parts.find((p) => p.type === "timeZoneName")?.value;
    if (!tzName) {
      throw new Error(`Unable to resolve timezone offset for ${timeZone}`);
    }

    if (tzName === "GMT" || tzName === "UTC") {
      return 0;
    }

    const match = tzName.match(/GMT([+-])(\d{1,2})(?::?(\d{2}))?/);
    if (!match) {
      throw new Error(`Unexpected timezone offset format: ${tzName}`);
    }

    const sign = match[1] === "-" ? -1 : 1;
    const hours = Number(match[2]);
    const minutes = match[3] ? Number(match[3]) : 0;
    return sign * (hours * 60 + minutes);
  }

  static localWallTimeToUtcDate({
    timeZone,
    year,
    month,
    day,
    hour,
    minute,
    second,
  }) {
    // Convert local wall time (in `timeZone`) to a UTC Date using timezone offset.
    // We do a second pass to handle DST transitions.
    const utcGuess = new Date(
      Date.UTC(year, month - 1, day, hour, minute, second),
    );
    let offsetMinutes = PostDateService.getTimeZoneOffsetMinutes(
      timeZone,
      utcGuess,
    );
    let utcDate = new Date(
      Date.UTC(year, month - 1, day, hour, minute, second) -
        offsetMinutes * 60 * 1000,
    );

    const offsetMinutes2 = PostDateService.getTimeZoneOffsetMinutes(
      timeZone,
      utcDate,
    );
    if (offsetMinutes2 !== offsetMinutes) {
      offsetMinutes = offsetMinutes2;
      utcDate = new Date(
        Date.UTC(year, month - 1, day, hour, minute, second) -
          offsetMinutes * 60 * 1000,
      );
    }

    return utcDate;
  }

  buildRandomAtLeast24HoursAwayInBusinessHoursIso({
    timeZone,
    startHourInclusive,
    endHourExclusive,
  }) {
    const normalizedTimeZone = String(timeZone ?? this.timeZone).trim();
    if (!normalizedTimeZone) {
      throw new Error("timeZone is required");
    }

    const startHour = Number(startHourInclusive);
    const endHour = Number(endHourExclusive);
    if (!Number.isFinite(startHour) || !Number.isFinite(endHour)) {
      throw new Error("Invalid business hours");
    }

    if (startHour < 0 || startHour > 23 || endHour < 0 || endHour > 24) {
      throw new Error("Invalid business hours");
    }

    if (endHour <= startHour) {
      throw new Error("Invalid business hours");
    }

    const now = this.now();

    const minUtc = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const minLocalYmd = PostDateService.getDatePartsInTimeZone(
      minUtc,
      normalizedTimeZone,
    );
    const minLocalHms = PostDateService.getTimePartsInTimeZone(
      minUtc,
      normalizedTimeZone,
    );

    // Anchor to local "today" via noon UTC to make day increments stable across DST.
    const todayInTz = PostDateService.getDatePartsInTimeZone(
      now,
      normalizedTimeZone,
    );
    const todayNoonUtc = new Date(
      Date.UTC(todayInTz.year, todayInTz.month - 1, todayInTz.day, 12, 0, 0),
    );

    const startSeconds = startHour * 60 * 60;
    const endSeconds = endHour * 60 * 60;

    // Find the earliest day where the time window intersects with "now + 24h".
    // Cap search to avoid infinite loops in unexpected runtime environments.
    for (let dayOffset = 1; dayOffset <= 14; dayOffset += 1) {
      const dayNoonUtc = new Date(
        todayNoonUtc.getTime() + dayOffset * 24 * 60 * 60 * 1000,
      );
      const dayInTz = PostDateService.getDatePartsInTimeZone(
        dayNoonUtc,
        normalizedTimeZone,
      );

      if (PostDateService.compareYmd(dayInTz, minLocalYmd) < 0) {
        continue;
      }

      let earliestAllowedSeconds = startSeconds;
      if (PostDateService.areSameYmd(dayInTz, minLocalYmd)) {
        earliestAllowedSeconds = Math.max(
          earliestAllowedSeconds,
          minLocalHms.hour * 3600 +
            minLocalHms.minute * 60 +
            minLocalHms.second,
        );
      }

      if (earliestAllowedSeconds >= endSeconds) {
        continue;
      }

      const availableSeconds = endSeconds - earliestAllowedSeconds;
      const randomSecondOffset = Math.floor(this.random() * availableSeconds);
      const localSeconds = earliestAllowedSeconds + randomSecondOffset;

      const hour = Math.floor(localSeconds / 3600);
      const minute = Math.floor((localSeconds % 3600) / 60);
      const second = localSeconds % 60;

      const utcDate = PostDateService.localWallTimeToUtcDate({
        timeZone: normalizedTimeZone,
        year: dayInTz.year,
        month: dayInTz.month,
        day: dayInTz.day,
        hour,
        minute,
        second,
      });

      if (utcDate.getTime() < minUtc.getTime()) {
        // In rare cases around DST transitions the conversion may still land before minUtc.
        // Try the next day.
        continue;
      }

      return utcDate.toISOString();
    }

    throw new Error(
      `Unable to find an eligible date at least 24h away in ${normalizedTimeZone} business hours`,
    );
  }
}

module.exports = { PostDateService };
