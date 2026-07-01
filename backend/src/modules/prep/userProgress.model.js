import mongoose from "mongoose";

const userProgressSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    questionSlug: { type: String, required: true },
    status: {
      type: String,
      enum: ["todo", "attempted", "solved"],
      default: "todo",
    },
    notes: { type: String, maxlength: 500 },
    solvedAt: { type: Date },
  },
  { timestamps: true }
);

// One status record per user per question
userProgressSchema.index({ user: 1, questionSlug: 1 }, { unique: true });
// Fast lookup of all progress for a user
userProgressSchema.index({ user: 1, status: 1 });

const UserProgress = mongoose.model("UserProgress", userProgressSchema);
export default UserProgress;
