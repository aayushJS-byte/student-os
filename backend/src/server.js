import app from "./app.js";
import env from "./config/env.js";
import connectDB from "./database/mongodb.js";
import { startReminderScheduler } from "./modules/reminders/reminder.scheduler.js";

const startServer = async () => {
    try {
        await connectDB();

        startReminderScheduler();

        app.listen(env.PORT, () => {
            console.log(
                `🚀 Server running on http://localhost:${env.PORT}`
            );
        });
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
};

startServer();