const { describe, it } = require("node:test");
const assert = require("node:assert/strict");

const { PostDateService } = require("../src/post-date-service");

function getParisHour(date) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Paris",
    hour12: false,
    hour: "2-digit",
  }).formatToParts(date);

  return Number(parts.find((p) => p.type === "hour")?.value);
}

function getParisWeekday(date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Paris",
    weekday: "short",
  }).formatToParts(date);

  return parts.find((p) => p.type === "weekday")?.value;
}

describe("PostDateService", () => {
  describe("buildRandomAtLeast24HoursAwayInBusinessHoursIso", () => {
    it("returns a date at least +24h away and within Paris business hours", () => {
      const now = new Date("2025-12-24T06:00:00.000Z");
      const service = new PostDateService({
        now: () => now,
        random: () => 0, // pick the earliest possible instant in window
      });

      const iso = service.buildRandomAtLeast24HoursAwayInBusinessHoursIso({
        timeZone: "Europe/Paris",
        startHourInclusive: 9,
        endHourExclusive: 18,
      });
      const generated = new Date(iso);

      assert.ok(generated.getTime() >= now.getTime() + 24 * 60 * 60 * 1000);

      const parisHour = getParisHour(generated);
      assert.ok(parisHour >= 9 && parisHour < 18);
    });

    it("never schedules on Saturday or Sunday in Paris time", () => {
      // Fri 2025-12-26 06:00Z is 07:00 in Paris; +24h lands on Saturday.
      // Ensure we skip the weekend and schedule on a weekday.
      const now = new Date("2025-12-26T06:00:00.000Z");
      const service = new PostDateService({
        now: () => now,
        random: () => 0,
      });

      const iso = service.buildRandomAtLeast24HoursAwayInBusinessHoursIso({
        timeZone: "Europe/Paris",
        startHourInclusive: 9,
        endHourExclusive: 18,
      });
      const generated = new Date(iso);

      assert.ok(generated.getTime() >= now.getTime() + 24 * 60 * 60 * 1000);

      const weekday = getParisWeekday(generated);
      assert.ok(weekday !== "Sat" && weekday !== "Sun");

      const parisHour = getParisHour(generated);
      assert.ok(parisHour >= 9 && parisHour < 18);
    });

    it("pushes to a later day if needed to keep +24h guarantee", () => {
      // 12:00Z is 13:00 in Paris in winter; "tomorrow 09:00 Paris" would be < 24h away.
      const now = new Date("2025-12-24T12:00:00.000Z");
      const service = new PostDateService({
        now: () => now,
        random: () => 0,
      });

      const iso = service.buildRandomAtLeast24HoursAwayInBusinessHoursIso({
        timeZone: "Europe/Paris",
        startHourInclusive: 9,
        endHourExclusive: 18,
      });
      const generated = new Date(iso);

      assert.ok(generated.getTime() >= now.getTime() + 24 * 60 * 60 * 1000);

      const parisHour = getParisHour(generated);
      assert.ok(parisHour >= 9 && parisHour < 18);
    });
  });
});
