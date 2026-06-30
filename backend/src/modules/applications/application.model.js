import mongoose from "mongoose";
import {
  APPLICATION_STATUS,
  JOB_TYPE,
  INTERVIEW_TYPE,
  INTERVIEW_RESULT,
  CURRENCIES,
  APPLICATION_TAGS,
} from "./application.constants.js";

const activityLogSchema = new mongoose.Schema(
  {
    action: { type: String, required: true },
    details: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const interviewSchema = new mongoose.Schema(
  {
    round: { type: Number, required: true },
    type: {
      type: String,
      enum: Object.values(INTERVIEW_TYPE),
      required: true,
    },
    scheduledAt: { type: Date, default: null },
    duration: { type: Number, default: null }, // minutes
    notes: { type: String, default: "" },
    result: {
      type: String,
      enum: Object.values(INTERVIEW_RESULT),
      default: INTERVIEW_RESULT.PENDING,
    },
  },
  { _id: true }
);

const applicationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // Core
    company: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    location: { type: String, trim: true, default: "" },
    jobType: {
      type: String,
      enum: Object.values(JOB_TYPE),
      required: true,
      default: JOB_TYPE.INTERNSHIP,
    },
    jobLink: { type: String, trim: true, default: "" },

    // Status
    status: {
      type: String,
      enum: Object.values(APPLICATION_STATUS),
      required: true,
      default: APPLICATION_STATUS.WISHLIST,
    },

    // Dates
    appliedDate: { type: Date, default: null },
    deadline: { type: Date, default: null },

    // Online Assessment
    oa: {
      scheduledAt: { type: Date, default: null },
      platform: { type: String, trim: true, default: "" },
      duration: { type: Number, default: null }, // minutes
      notes: { type: String, default: "" },
      completed: { type: Boolean, default: false },
    },

    // Interview rounds (embedded)
    interviews: { type: [interviewSchema], default: [] },

    // Offer details
    offer: {
      ctc: { type: Number, default: null },       // annual, for full-time
      stipend: { type: Number, default: null },    // per month, for internship
      currency: { type: String, enum: CURRENCIES, default: "INR" },
      joiningDate: { type: Date, default: null },
      deadline: { type: Date, default: null },
      accepted: { type: Boolean, default: false },
    },

    // Metadata
    resumeVersion: { type: String, trim: true, default: "" },
    referral: { type: Boolean, default: false },
    referralName: { type: String, trim: true, default: "" },
    notes: { type: String, default: "" },
    tags: [{ type: String, enum: APPLICATION_TAGS }],

    // Auto-generated activity log (never user-edited)
    activityLog: { type: [activityLogSchema], default: [] },

    // Soft delete
    deletedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

applicationSchema.index({ user: 1, status: 1 });
applicationSchema.index({ user: 1, createdAt: -1 });
applicationSchema.index({ user: 1, deadline: 1 });
applicationSchema.index({ user: 1, deletedAt: 1 });

const Application = mongoose.model("Application", applicationSchema);

export default Application;
