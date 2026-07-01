import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown, ChevronUp, Tag, Calendar, BookOpen,
  Code2, Search, ChevronRight, Filter, CheckCircle2, AlertCircle, Circle, Info,
} from "lucide-react";
import { useCompanies, useSections, useQuestions, useProgress, useUpdateProgress } from "@/hooks/prep/usePrep";
import type { Question, Difficulty, ProgressStatus } from "@/types/prep";

// ─── Difficulty badge ──────────────────────────────────────────────────────────

const DIFFICULTY_STYLES: Record<Difficulty, string> = {
  Easy: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
  Medium: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
  Hard: "bg-red-500/10 text-red-400 border border-red-500/20",
};

function DifficultyBadge({ level }: { level: Difficulty }) {
  return (
    <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${DIFFICULTY_STYLES[level]}`}>
      {level}
    </span>
  );
}

// ─── Progress status pill ──────────────────────────────────────────────────────

const STATUS_CONFIG: Record<ProgressStatus, { label: string; icon: typeof CheckCircle2; classes: string }> = {
  todo:      { label: "Mark Solved", icon: Circle,       classes: "text-zinc-600 hover:text-zinc-400" },
  attempted: { label: "Attempted",   icon: AlertCircle,  classes: "text-amber-500 hover:text-amber-400" },
  solved:    { label: "Solved",      icon: CheckCircle2, classes: "text-emerald-500 hover:text-emerald-400" },
};

const STATUS_CYCLE: Record<ProgressStatus, ProgressStatus> = {
  todo: "attempted",
  attempted: "solved",
  solved: "todo",
};

function ProgressButton({
  slug,
  currentStatus,
}: {
  slug: string;
  currentStatus: ProgressStatus;
}) {
  const update = useUpdateProgress();
  const cfg = STATUS_CONFIG[currentStatus];
  const Icon = cfg.icon;

  function handleClick(e: React.MouseEvent) {
    e.stopPropagation();
    update.mutate({ slug, status: STATUS_CYCLE[currentStatus] });
  }

  return (
    <button
      onClick={handleClick}
      disabled={update.isPending}
      title={cfg.label}
      className={`flex items-center gap-1 text-xs font-medium transition-colors disabled:opacity-50 ${cfg.classes}`}
    >
      <Icon size={15} />
      <span className="hidden sm:inline">{cfg.label}</span>
    </button>
  );
}

// ─── Company accent colors ─────────────────────────────────────────────────────

const COMPANY_ACCENT: Record<string, { dot: string; active: string }> = {
  Amazon:          { dot: "bg-orange-400",  active: "border-l-orange-400" },
  Microsoft:       { dot: "bg-sky-400",     active: "border-l-sky-400" },
  Google:          { dot: "bg-blue-400",    active: "border-l-blue-400" },
  Adobe:           { dot: "bg-red-400",     active: "border-l-red-400" },
  "Goldman Sachs": { dot: "bg-blue-600",    active: "border-l-blue-600" },
  "Morgan Stanley":{ dot: "bg-teal-400",    active: "border-l-teal-400" },
  JPMorgan:        { dot: "bg-blue-500",    active: "border-l-blue-500" },
  Flipkart:        { dot: "bg-yellow-400",  active: "border-l-yellow-400" },
  Uber:            { dot: "bg-slate-300",   active: "border-l-slate-300" },
  Walmart:         { dot: "bg-blue-400",    active: "border-l-blue-400" },
  Salesforce:      { dot: "bg-cyan-400",    active: "border-l-cyan-400" },
  Samsung:         { dot: "bg-indigo-400",  active: "border-l-indigo-400" },
  Oracle:          { dot: "bg-rose-500",    active: "border-l-rose-500" },
  Intuit:          { dot: "bg-green-400",   active: "border-l-green-400" },
  Atlassian:       { dot: "bg-blue-500",    active: "border-l-blue-500" },
  Nutanix:         { dot: "bg-violet-400",  active: "border-l-violet-400" },
  Sprinklr:        { dot: "bg-pink-400",    active: "border-l-pink-400" },
  "DE Shaw":       { dot: "bg-amber-400",   active: "border-l-amber-400" },
  "Tower Research":{ dot: "bg-emerald-400", active: "border-l-emerald-400" },
  ShareChat:       { dot: "bg-purple-400",  active: "border-l-purple-400" },
  Meesho:          { dot: "bg-rose-400",    active: "border-l-rose-400" },
  Zomato:          { dot: "bg-red-500",     active: "border-l-red-500" },
  Cisco:           { dot: "bg-teal-500",    active: "border-l-teal-500" },
  Qualcomm:        { dot: "bg-blue-700",    active: "border-l-blue-700" },
  Graviton:        { dot: "bg-slate-400",   active: "border-l-slate-400" },
  PhonePe:         { dot: "bg-violet-500",  active: "border-l-violet-500" },
  Razorpay:        { dot: "bg-blue-500",    active: "border-l-blue-500" },
};
const getAccent = (c: string) => COMPANY_ACCENT[c] ?? { dot: "bg-zinc-400", active: "border-l-zinc-400" };

const SECTION_ORDER = ["All", "OA", "CS Fundamentals", "System Design", "HR"];

// ─── Question card ─────────────────────────────────────────────────────────────

function QuestionCard({
  question,
  index,
  status,
}: {
  question: Question;
  index: number;
  status: ProgressStatus;
}) {
  const [expanded, setExpanded] = useState(false);

  const statusBorderClass =
    status === "solved" ? "border-l-2 border-l-emerald-500/40" :
    status === "attempted" ? "border-l-2 border-l-amber-500/40" :
    "border-l-2 border-l-transparent";

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, duration: 0.18 }}
      className={`rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden ${statusBorderClass}`}
    >
      <button
        onClick={() => setExpanded((p) => !p)}
        className="flex w-full items-start gap-3 px-4 py-3 text-left hover:bg-zinc-800/40 transition-colors"
      >
        {/* Index */}
        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded bg-zinc-800 text-[10px] font-semibold text-zinc-500">
          {index + 1}
        </span>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-sm font-semibold text-white leading-tight">{question.title}</span>
            <DifficultyBadge level={question.difficulty} />
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            {question.year && (
              <span className="flex items-center gap-1 text-[10px] text-zinc-600">
                <Calendar size={9} />{question.year}
              </span>
            )}
            {question.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="flex items-center gap-1 rounded bg-zinc-800 px-1.5 py-0.5 text-[10px] text-zinc-500">
                <Tag size={8} />{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Progress button */}
        <div className="shrink-0 flex items-center gap-2">
          <ProgressButton slug={question.slug} currentStatus={status} />
          <span className="text-zinc-700">
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </span>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="border-t border-zinc-800 px-4 py-4 space-y-4">
              {/* Problem */}
              <div>
                <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-zinc-500">Problem</p>
                <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">{question.question}</p>
              </div>

              {/* Function signature */}
              {question.functionSignature && question.functionSignature !== "// Conceptual — no function signature" && (
                <div>
                  <p className="mb-1.5 flex items-center gap-1 text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
                    <Code2 size={9} />Function
                  </p>
                  <pre className="rounded-lg bg-zinc-950 px-4 py-3 text-xs text-indigo-300 overflow-x-auto border border-zinc-800 whitespace-pre-wrap break-all">
                    {question.functionSignature}
                  </pre>
                </div>
              )}

              {/* Constraints */}
              {question.constraints.length > 0 && (
                <div>
                  <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-zinc-500">Constraints</p>
                  <ul className="space-y-1">
                    {question.constraints.map((c, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-zinc-400">
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-zinc-600" />
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Examples */}
              {question.examples.length > 0 && (
                <div>
                  <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-zinc-500">Examples</p>
                  <div className="space-y-2.5">
                    {question.examples.map((ex, i) => (
                      <div key={i} className="rounded-lg bg-zinc-950 border border-zinc-800 overflow-hidden">
                        <div className="grid grid-cols-2 divide-x divide-zinc-800">
                          <div className="p-3">
                            <p className="mb-1 text-[9px] font-semibold text-zinc-600 uppercase tracking-wider">Input</p>
                            <pre className="text-xs text-zinc-300 whitespace-pre-wrap break-all">{ex.input}</pre>
                          </div>
                          <div className="p-3">
                            <p className="mb-1 text-[9px] font-semibold text-zinc-600 uppercase tracking-wider">Output</p>
                            <pre className="text-xs text-emerald-400 font-semibold break-all whitespace-pre-wrap">{ex.output}</pre>
                          </div>
                        </div>
                        {ex.explanation && (
                          <div className="border-t border-zinc-800 px-3 py-2">
                            <p className="text-[9px] font-semibold text-zinc-600 uppercase tracking-wider mb-0.5">Explanation</p>
                            <p className="text-xs text-zinc-400 leading-relaxed">{ex.explanation}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Company sidebar item ──────────────────────────────────────────────────────

function CompanyItem({
  name, count, active, onClick,
}: { name: string; count: number; active: boolean; onClick: () => void }) {
  const accent = getAccent(name);
  return (
    <button
      onClick={onClick}
      className={`group flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left transition-colors border-l-2 ${
        active ? `bg-zinc-800 ${accent.active}` : "border-l-transparent hover:bg-zinc-800/50"
      }`}
    >
      <span className={`h-2 w-2 shrink-0 rounded-full ${accent.dot} ${active ? "opacity-100" : "opacity-50 group-hover:opacity-80"}`} />
      <span className={`flex-1 truncate text-xs font-medium ${active ? "text-white" : "text-zinc-400 group-hover:text-zinc-200"}`}>
        {name}
      </span>
      <span className={`shrink-0 text-[10px] font-medium tabular-nums ${active ? "text-zinc-400" : "text-zinc-600"}`}>
        {count}
      </span>
    </button>
  );
}

// ─── Section tab bar ───────────────────────────────────────────────────────────

function SectionTabs({
  sections, active, counts, onChange,
}: { sections: string[]; active: string; counts: Record<string, number>; onChange: (s: string) => void }) {
  const available = SECTION_ORDER.filter((s) => s === "All" || sections.includes(s));
  return (
    <div className="flex gap-1.5 flex-wrap">
      {available.map((s) => (
        <button
          key={s}
          onClick={() => onChange(s)}
          className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
            active === s ? "bg-indigo-600 text-white" : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200"
          }`}
        >
          {s}
          {counts[s] != null && (
            <span className={`rounded-full px-1.5 text-[10px] font-semibold ${active === s ? "bg-indigo-500/60 text-white" : "bg-zinc-700 text-zinc-400"}`}>
              {counts[s]}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────────

export default function PrepPage() {
  const [selectedCompany, setSelectedCompany] = useState<string>("");
  const [selectedSection, setSelectedSection] = useState<string>("All");
  const [companySearch, setCompanySearch] = useState<string>("");
  const [questionSearch, setQuestionSearch] = useState<string>("");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const { data: companies = [], isLoading: loadingCompanies } = useCompanies();
  const { data: sections = [] } = useSections(selectedCompany);
  const { data: allQuestions = [], isLoading: loadingQuestions } = useQuestions(selectedCompany);
  const { data: progressMap = {} } = useProgress();

  const sectionCounts = useMemo(() => {
    const counts: Record<string, number> = { All: allQuestions.length };
    for (const q of allQuestions) counts[q.section] = (counts[q.section] ?? 0) + 1;
    return counts;
  }, [allQuestions]);

  const filteredQuestions = useMemo(() => {
    let list = selectedSection === "All" ? allQuestions : allQuestions.filter((q) => q.section === selectedSection);
    if (questionSearch.trim()) {
      const q = questionSearch.toLowerCase();
      list = list.filter(
        (item) => item.title.toLowerCase().includes(q) || item.question.toLowerCase().includes(q) || item.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return list;
  }, [allQuestions, selectedSection, questionSearch]);

  const filteredCompanies = useMemo(
    () => companies.filter((c) => !companySearch.trim() || c.name.toLowerCase().includes(companySearch.toLowerCase())),
    [companies, companySearch]
  );

  function handleCompanySelect(name: string) {
    setSelectedCompany(name);
    setSelectedSection("All");
    setQuestionSearch("");
    setMobileSidebarOpen(false);
  }

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="shrink-0 px-3 pt-4 pb-3 border-b border-zinc-800">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-zinc-500">Companies</p>
        <div className="relative">
          <Search size={11} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-600 pointer-events-none" />
          <input
            type="text"
            placeholder="Filter..."
            value={companySearch}
            onChange={(e) => setCompanySearch(e.target.value)}
            className="w-full rounded-lg bg-zinc-800 pl-7 pr-3 py-1.5 text-xs text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 border border-zinc-700"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-2 px-2 space-y-0.5">
        {loadingCompanies
          ? Array.from({ length: 10 }).map((_, i) => <div key={i} className="h-8 rounded-lg bg-zinc-800 animate-pulse mb-1 mx-1" />)
          : filteredCompanies.map((c) => (
              <CompanyItem key={c.name} name={c.name} count={c.count} active={selectedCompany === c.name} onClick={() => handleCompanySelect(c.name)} />
            ))}
      </div>

      <div className="shrink-0 px-3 py-2.5 border-t border-zinc-800">
        <p className="text-[10px] text-zinc-600">{companies.length} companies · {companies.reduce((s, c) => s + c.count, 0)} questions</p>
      </div>
    </div>
  );

  return (
    <div className="flex h-full overflow-hidden">
      {/* Desktop company sidebar */}
      <aside className="hidden lg:flex w-52 shrink-0 flex-col border-r border-zinc-800 bg-zinc-900/60 overflow-hidden">
        {sidebarContent}
      </aside>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <>
            <motion.div key="bd" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-zinc-950/70 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileSidebarOpen(false)} />
            <motion.aside key="ms" initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-zinc-800 bg-zinc-900 lg:hidden">
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <div className="shrink-0 flex items-center gap-3 px-5 py-3.5 border-b border-zinc-800">
          <button onClick={() => setMobileSidebarOpen(true)}
            className="lg:hidden flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-xs text-zinc-300">
            <Filter size={11} />{selectedCompany || "Companies"}<ChevronRight size={11} className="text-zinc-500" />
          </button>

          <div className="hidden lg:flex items-center gap-1.5 text-sm">
            <BookOpen size={13} className="text-zinc-500" />
            <span className="text-zinc-500">Prep</span>
            {selectedCompany && <><ChevronRight size={11} className="text-zinc-700" /><span className="font-semibold text-white">{selectedCompany}</span></>}
          </div>

          {selectedCompany && (
            <div className="relative ml-auto">
              <Search size={11} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-600 pointer-events-none" />
              <input type="text" placeholder="Search questions..." value={questionSearch}
                onChange={(e) => setQuestionSearch(e.target.value)}
                className="w-44 rounded-lg bg-zinc-800 pl-7 pr-3 py-1.5 text-xs text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 border border-zinc-700" />
            </div>
          )}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-5">
          {!selectedCompany ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-center py-16">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-800/60 border border-zinc-700">
                <BookOpen size={24} className="text-zinc-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-400">Select a company to view questions</p>
                <p className="text-xs text-zinc-600 mt-0.5">{companies.length} companies · {companies.reduce((s, c) => s + c.count, 0)} questions from IIT BHU placement drives</p>
              </div>
              <div className="mt-2 grid grid-cols-3 gap-2 lg:hidden w-full max-w-xs">
                {companies.slice(0, 9).map((c) => {
                  const accent = getAccent(c.name);
                  return (
                    <button key={c.name} onClick={() => handleCompanySelect(c.name)}
                      className="rounded-lg border border-zinc-700 bg-zinc-800 px-2 py-2 text-xs font-medium text-zinc-300 flex items-center gap-1.5">
                      <span className={`h-1.5 w-1.5 rounded-full ${accent.dot}`} />
                      <span className="truncate">{c.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="space-y-4 max-w-3xl">
              <div className="flex items-start gap-2 rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-2.5">
                <Info size={12} className="mt-0.5 shrink-0 text-zinc-500" />
                <p className="text-[11px] text-zinc-500 leading-relaxed">
                  These are <span className="text-zinc-400 font-medium">problem statements</span> from past IIT BHU placement drives — not an interactive code editor. Use them to understand what was asked and practice on your own.
                </p>
              </div>

              {sections.length > 0 && (
                <SectionTabs sections={sections} active={selectedSection} counts={sectionCounts} onChange={setSelectedSection} />
              )}

              {/* Legend */}
              <div className="flex items-center justify-between">
                <p className="text-xs text-zinc-600">
                  {filteredQuestions.length} question{filteredQuestions.length !== 1 ? "s" : ""}
                  {questionSearch && <span className="ml-1">for "{questionSearch}"</span>}
                </p>
                <div className="flex items-center gap-3 text-[10px] text-zinc-600">
                  <span className="flex items-center gap-1"><Circle size={9} className="text-zinc-600" />Todo</span>
                  <span className="flex items-center gap-1"><AlertCircle size={9} className="text-amber-500" />Attempted</span>
                  <span className="flex items-center gap-1"><CheckCircle2 size={9} className="text-emerald-500" />Solved</span>
                </div>
              </div>

              {loadingQuestions ? (
                <div className="space-y-2.5">
                  {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-12 rounded-xl bg-zinc-800 animate-pulse" />)}
                </div>
              ) : filteredQuestions.length === 0 ? (
                <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-zinc-800 py-14 text-center">
                  <BookOpen size={24} className="text-zinc-700" />
                  <p className="text-sm text-zinc-500">{questionSearch ? "No questions match your search" : "No questions yet for this section"}</p>
                  {questionSearch && <button onClick={() => setQuestionSearch("")} className="text-xs text-indigo-400 hover:text-indigo-300">Clear search</button>}
                </div>
              ) : (
                <AnimatePresence mode="wait">
                  <motion.div key={`${selectedCompany}-${selectedSection}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.12 }} className="space-y-2">
                    {filteredQuestions.map((q, i) => (
                      <QuestionCard key={q._id} question={q} index={i} status={(progressMap[q.slug]?.status ?? "todo") as ProgressStatus} />
                    ))}
                  </motion.div>
                </AnimatePresence>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
