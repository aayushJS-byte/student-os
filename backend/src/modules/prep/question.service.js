import Question from "./question.model.js";
import UserProgress from "./userProgress.model.js";

// ─── Questions ────────────────────────────────────────────────────────────────

/** Companies with question counts, sorted A-Z */
export const getCompanies = async () => {
  const result = await Question.aggregate([
    { $group: { _id: "$company", count: { $sum: 1 } } },
    { $sort: { _id: 1 } },
  ]);
  return result.map((r) => ({ name: r._id, count: r.count }));
};

/** Sections that have questions for a company, ordered canonically */
export const getSectionsForCompany = async (company) => {
  const sections = await Question.distinct("section", { company });
  const ORDER = ["OA", "CS Fundamentals", "System Design", "HR"];
  return ORDER.filter((s) => sections.includes(s));
};

/** Questions for a company, optionally filtered by section */
export const getQuestions = async ({ company, section }) => {
  const filter = { company };
  if (section) filter.section = section;
  return Question.find(filter).select("-__v -createdAt -updatedAt").lean();
};

/** Single question by slug */
export const getQuestionBySlug = async (slug) => {
  return Question.findOne({ slug }).select("-__v").lean();
};

// ─── User Progress ────────────────────────────────────────────────────────────

/** All progress records for a user, as a map: slug → { status, solvedAt, notes } */
export const getUserProgress = async (userId) => {
  const records = await UserProgress.find({ user: userId })
    .select("questionSlug status solvedAt notes -_id")
    .lean();
  return Object.fromEntries(records.map((r) => [r.questionSlug, r]));
};

/** Summary stats for a user's prep progress */
export const getProgressStats = async (userId) => {
  const [totalQuestions, progress] = await Promise.all([
    Question.countDocuments(),
    UserProgress.aggregate([
      { $match: { user: userId } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]),
  ]);

  const stats = { solved: 0, attempted: 0, total: totalQuestions };
  for (const p of progress) stats[p._id] = p.count;
  // todo = questions with no progress record (default state, never stored)
  stats.todo = totalQuestions - stats.solved - stats.attempted;

  return stats;
};

/** Upsert a user's status for one question.
 *  "todo" is the default state — no record needed — so we delete on reset.
 */
export const upsertProgress = async (userId, slug, { status, notes }) => {
  if (status === "todo") {
    await UserProgress.deleteOne({ user: userId, questionSlug: slug });
    return null;
  }

  const update = {
    status,
    solvedAt: status === "solved" ? new Date() : null,
  };
  if (notes !== undefined) update.notes = notes;

  return UserProgress.findOneAndUpdate(
    { user: userId, questionSlug: slug },
    { $set: update },
    { upsert: true, returnDocument: "after", runValidators: true }
  );
};
