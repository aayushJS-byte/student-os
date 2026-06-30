import cron from "node-cron";
import { processReminders } from "./reminder.service.js";

export const startReminderScheduler = () => {
  // Run every 15 minutes. The short interval ensures we never miss a 2h-window
  // reminder even if the server restarts near the boundary.
  cron.schedule("*/15 * * * *", async () => {
    try {
      await processReminders();
    } catch (err) {
      console.error("[reminders] Scheduler error:", err);
    }
  });

  console.log("[reminders] Scheduler started (every 15 minutes)");
};
