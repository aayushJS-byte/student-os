import { motion } from "framer-motion";
import { ExternalLink, ArrowRight, Trophy, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { useOffers } from "@/hooks/applications/useOffers";
import { formatDate } from "@/utils/date";
import Spinner from "@/components/ui/Spinner";
import type { OfferRecord } from "@/types/application";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const CURRENCY_SYMBOL: Record<string, string> = {
  INR: "₹",
  USD: "$",
  EUR: "€",
  GBP: "£",
  SGD: "S$",
  AED: "د.إ",
};

function formatAmount(offer: OfferRecord["offer"], jobType: string) {
  const isInternship = jobType === "internship" || jobType === "part-time";
  const sym = CURRENCY_SYMBOL[offer.currency] ?? offer.currency;

  if (isInternship && offer.stipend) {
    return { value: `${sym}${offer.stipend.toLocaleString("en-IN")}`, unit: "/mo" };
  }
  if (!isInternship && offer.ctc) {
    if (offer.currency === "INR") {
      return { value: `${sym}${(offer.ctc / 100000).toFixed(1)} L`, unit: "/yr" };
    }
    return { value: `${sym}${offer.ctc.toLocaleString()}`, unit: "/yr" };
  }
  return null;
}

function deadlineUrgency(deadline: string | null) {
  if (!deadline) return null;
  const days = Math.ceil((new Date(deadline).getTime() - Date.now()) / 86400000);
  if (days < 0) return { label: "Expired", className: "text-zinc-500" };
  if (days <= 3) return { label: `${days}d left`, className: "text-red-400" };
  if (days <= 7) return { label: `${days}d left`, className: "text-amber-400" };
  return { label: `${days}d left`, className: "text-zinc-400" };
}

// ─── Offer card ──────────────────────────────────────────────────────────────

function OfferCard({ offer }: { offer: OfferRecord }) {
  const amount = formatAmount(offer.offer, offer.jobType);
  const deadline = deadlineUrgency(offer.offer.deadline);
  const isPending = offer.status === "offer";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 gap-4"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-800 text-sm font-bold text-zinc-200">
            {offer.company[0].toUpperCase()}
          </div>
          <div>
            <p className="font-medium text-white">{offer.company}</p>
            <p className="text-xs text-zinc-500">{offer.role}</p>
          </div>
        </div>
        <span
          className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${
            isPending
              ? "border border-amber-500/30 bg-amber-500/10 text-amber-400"
              : "border border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
          }`}
        >
          {isPending ? "Pending Decision" : "Accepted"}
        </span>
      </div>

      {/* Amount */}
      {amount ? (
        <div>
          <p className="text-2xl font-bold text-white">
            {amount.value}
            <span className="ml-1 text-sm font-normal text-zinc-500">{amount.unit}</span>
          </p>
          <p className="mt-0.5 text-xs text-zinc-600 uppercase tracking-wide">
            {offer.jobType === "internship" || offer.jobType === "part-time" ? "Stipend" : "CTC"} · {offer.offer.currency}
          </p>
        </div>
      ) : (
        <p className="text-sm text-zinc-600">Compensation not logged</p>
      )}

      {/* Meta */}
      <div className="space-y-1.5 text-xs text-zinc-500">
        {offer.offer.joiningDate && (
          <div className="flex items-center gap-1.5">
            <ArrowRight size={11} className="shrink-0" />
            <span>Joining {formatDate(offer.offer.joiningDate, "medium")}</span>
          </div>
        )}
        {offer.offer.deadline && deadline && (
          <div className="flex items-center gap-1.5">
            <Clock size={11} className="shrink-0" />
            <span>Decision deadline: {formatDate(offer.offer.deadline, "medium")}</span>
            <span className={`font-medium ${deadline.className}`}>· {deadline.label}</span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-1 border-t border-zinc-800">
        {offer.offer.documentLink && (
          <a
            href={offer.offer.documentLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-lg border border-zinc-700 px-3 py-1.5 text-xs text-zinc-400 transition-colors hover:border-zinc-500 hover:text-zinc-200"
          >
            <ExternalLink size={11} />
            Offer Letter
          </a>
        )}
        <Link
          to={`/applications/${offer._id}`}
          className="ml-auto flex items-center gap-1 text-xs text-zinc-600 transition-colors hover:text-zinc-300"
        >
          View application <ArrowRight size={11} />
        </Link>
      </div>
    </motion.div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function OffersPage() {
  const { data: offers, isLoading, isError } = useOffers();

  const pending = offers?.filter((o) => o.status === "offer").length ?? 0;
  const accepted = offers?.filter((o) => o.status === "accepted").length ?? 0;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/20">
            <Trophy size={18} className="text-amber-400" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-white">My Offers</h1>
            {offers && offers.length > 0 && (
              <p className="mt-0.5 text-xs text-zinc-500">
                {offers.length} total · {pending} pending decision · {accepted} accepted
              </p>
            )}
          </div>
        </div>

        {/* States */}
        {isLoading && (
          <div className="flex justify-center py-20">
            <Spinner size="md" />
          </div>
        )}

        {isError && (
          <div className="rounded-xl border border-zinc-800 py-20 text-center">
            <p className="text-sm text-zinc-400">Failed to load offers.</p>
          </div>
        )}

        {!isLoading && !isError && offers?.length === 0 && (
          <div className="rounded-xl border border-zinc-800 border-dashed py-20 text-center">
            <Trophy size={32} className="mx-auto mb-3 text-zinc-700" />
            <p className="text-sm font-medium text-zinc-400">No offers yet</p>
            <p className="mt-1 text-xs text-zinc-600">
              When companies extend offers, they'll appear here for comparison.
            </p>
          </div>
        )}

        {/* Offers grid */}
        {offers && offers.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {offers.map((offer) => (
              <OfferCard key={offer._id} offer={offer} />
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
