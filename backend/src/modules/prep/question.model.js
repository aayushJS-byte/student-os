import mongoose from "mongoose";

const exampleSchema = new mongoose.Schema(
  {
    input: { type: String, required: true },
    output: { type: String, required: true },
    explanation: { type: String },
  },
  { _id: false }
);

const questionSchema = new mongoose.Schema(
  {
    company: { type: String, required: true, trim: true },
    section: {
      type: String,
      required: true,
      enum: ["OA", "CS Fundamentals", "HR", "System Design"],
    },
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    question: { type: String, required: true },
    functionSignature: { type: String },
    constraints: [{ type: String }],
    examples: [exampleSchema],
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Medium",
    },
    tags: [{ type: String }],
    year: { type: Number },
    platform: { type: String },
  },
  { timestamps: true }
);

questionSchema.index({ company: 1, section: 1 });
questionSchema.index({ company: 1 });

const Question = mongoose.model("Question", questionSchema);
export default Question;
