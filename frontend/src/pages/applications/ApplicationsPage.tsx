import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { useApplications } from "@/hooks/applications/useApplications";
import { useCreateApplication } from "@/hooks/applications/useCreateApplication";
import { useUpdateApplication } from "@/hooks/applications/useUpdateApplication";
import { useDeleteApplication } from "@/hooks/applications/useDeleteApplication";
import { useApplicationFilters } from "@/hooks/applications/useApplicationFilters";
import ApplicationTable from "@/components/applications/ApplicationTable";
import ApplicationFilters from "@/components/applications/ApplicationFilters";
import ApplicationForm from "@/components/applications/ApplicationForm";
import CreateApplicationFlow from "@/components/applications/CreateApplicationFlow";
import Drawer from "@/components/ui/Drawer";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import Spinner from "@/components/ui/Spinner";
import type { ApplicationListItem } from "@/types/application";
import type { ApplicationFormData } from "@/schemas/application.schemas";

export default function ApplicationsPage() {
  const { filters, setFilter, setPage, clearFilters, hasActiveFilters } =
    useApplicationFilters();

  const { data, isLoading, isError } = useApplications(filters);

  // Drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<ApplicationListItem | null>(null);

  // Delete confirm state
  const [deleteTarget, setDeleteTarget] = useState<ApplicationListItem | null>(null);

  const createMutation = useCreateApplication();
  const updateMutation = useUpdateApplication(editTarget?._id ?? "");
  const deleteMutation = useDeleteApplication();

  const openCreate = () => {
    setEditTarget(null);
    setDrawerOpen(true);
  };

  const openEdit = (app: ApplicationListItem) => {
    setEditTarget(app);
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setEditTarget(null);
    createMutation.reset();
    updateMutation.reset();
  };

  const handleFormSubmit = async (data: ApplicationFormData) => {
    if (editTarget) {
      await updateMutation.mutateAsync(data);
    } else {
      await createMutation.mutateAsync(data);
    }
    closeDrawer();
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    await deleteMutation.mutateAsync(deleteTarget._id);
    setDeleteTarget(null);
  };

  const applications = data?.applications ?? [];
  const pagination = data?.pagination;

  return (
    <>
    <div className="mx-auto max-w-6xl px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="space-y-6"
        >
          {/* Header */}
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-white">Applications</h1>
              <p className="mt-0.5 text-xs text-zinc-500">
                {pagination ? `${pagination.total} total` : "Track every role"}
              </p>
            </div>
            <button
              onClick={openCreate}
              className="flex shrink-0 items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-500 shadow-lg shadow-indigo-500/20"
            >
              <Plus size={14} />
              New
            </button>
          </div>

          {/* Filters */}
          <ApplicationFilters
            search={filters.search ?? ""}
            status={filters.status ?? ""}
            jobType={filters.jobType ?? ""}
            hasActiveFilters={hasActiveFilters}
            onSearch={(v) => setFilter("search", v)}
            onStatus={(v) => setFilter("status", v)}
            onJobType={(v) => setFilter("jobType", v)}
            onClear={clearFilters}
          />

          {/* Table */}
          {isLoading ? (
            <div className="flex justify-center py-20">
              <Spinner size="md" />
            </div>
          ) : isError ? (
            <div className="rounded-xl border border-zinc-800 py-20 text-center">
              <p className="text-sm text-zinc-400">Failed to load applications.</p>
            </div>
          ) : (
            <ApplicationTable
              applications={applications}
              onEdit={openEdit}
              onDelete={(app) => setDeleteTarget(app)}
            />
          )}

          {/* Pagination */}
          {pagination && pagination.pages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-xs text-zinc-500">
                Page {pagination.page} of {pagination.pages}
              </p>
              <div className="flex gap-2">
                <button
                  disabled={pagination.page <= 1}
                  onClick={() => setPage(pagination.page - 1)}
                  className="flex items-center gap-1 rounded-lg border border-zinc-700 px-3 py-1.5 text-xs text-zinc-400 transition-colors hover:border-zinc-600 hover:text-zinc-300 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft size={13} />
                  Prev
                </button>
                <button
                  disabled={pagination.page >= pagination.pages}
                  onClick={() => setPage(pagination.page + 1)}
                  className="flex items-center gap-1 rounded-lg border border-zinc-700 px-3 py-1.5 text-xs text-zinc-400 transition-colors hover:border-zinc-600 hover:text-zinc-300 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                  <ChevronRight size={13} />
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Create Drawer */}
      <Drawer
        isOpen={drawerOpen && !editTarget}
        onClose={closeDrawer}
        title="New Application"
        width="md"
      >
        <CreateApplicationFlow
          onSubmit={handleFormSubmit}
          isLoading={createMutation.isPending}
          error={createMutation.error}
        />
      </Drawer>

      {/* Edit Drawer */}
      <Drawer
        isOpen={drawerOpen && !!editTarget}
        onClose={closeDrawer}
        title="Edit Application"
        width="md"
      >
        {editTarget && (
          <ApplicationForm
            defaultValues={editTarget}
            onSubmit={handleFormSubmit}
            isLoading={updateMutation.isPending}
            error={updateMutation.error}
            submitLabel="Save Changes"
          />
        )}
      </Drawer>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Application"
        message={`Delete your application to ${deleteTarget?.company} for ${deleteTarget?.role}? This cannot be undone.`}
        confirmLabel="Delete"
        isLoading={deleteMutation.isPending}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
}
