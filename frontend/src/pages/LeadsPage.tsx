import { useState } from 'react';
import { Plus, Download, RefreshCw } from 'lucide-react';
import { Lead } from '../types';
import { useLeads } from '../hooks/useLeads';
import { useAuthStore } from '../store/authStore';
import LeadsTable from '../components/leads/LeadsTable';
import LeadFiltersBar from '../components/leads/LeadFiltersBar';
import LeadForm from '../components/leads/LeadForm';
import LeadDetail from '../components/leads/LeadDetail';
import Pagination from '../components/leads/Pagination';
import Modal from '../components/ui/Modal';
import { ErrorState } from '../components/ui/States';

type ModalState =
  | { type: 'none' }
  | { type: 'create' }
  | { type: 'edit'; lead: Lead }
  | { type: 'view'; lead: Lead };

export default function LeadsPage() {
  const { user } = useAuthStore();
  const { leads, meta, filters, isLoading, error, updateFilter, resetFilters, refetch, deleteLead, exportCSV } = useLeads();
  const [modal, setModal] = useState<ModalState>({ type: 'none' });
  const [isExporting, setIsExporting] = useState(false);

  // suppress unused variable warning – user is used for type context
  void user;

  const closeModal = () => setModal({ type: 'none' });
  const handleSuccess = () => { closeModal(); void refetch(); };

  const handleExport = async () => {
    setIsExporting(true);
    await exportCSV();
    setIsExporting(false);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      await deleteLead(id);
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto animate-fade-in">
      {/* Page header */}
      <div className="flex items-start justify-between mb-7">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
            <span className="text-blue-500 text-xs font-semibold uppercase tracking-widest">Pipeline</span>
          </div>
          <h1 className="font-display font-bold text-dynamic text-3xl">Leads</h1>
          <p className="text-dynamic-muted text-sm mt-1">
            {meta ? `${meta.total.toLocaleString()} total leads in your pipeline` : 'Manage your sales pipeline'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => void refetch()} className="btn-secondary py-2 px-3" title="Refresh">
            <RefreshCw size={14} />
          </button>
          <button onClick={() => void handleExport()} disabled={isExporting} className="btn-secondary">
            <Download size={14} />
            {isExporting ? 'Exporting...' : 'CSV'}
          </button>
          <button onClick={() => setModal({ type: 'create' })} className="btn-primary">
            <Plus size={14} />
            Add Lead
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-4">
        <LeadFiltersBar filters={filters} onUpdate={updateFilter} onReset={resetFilters} />
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden bg-dynamic-card border-dynamic border">
        {error ? (
          <ErrorState message={error} onRetry={() => void refetch()} />
        ) : (
          <>
            <LeadsTable
              leads={leads}
              isLoading={isLoading}
              onEdit={(lead) => setModal({ type: 'edit', lead })}
              onView={(lead) => setModal({ type: 'view', lead })}
              onDelete={(id) => void handleDelete(id)}
            />
            {meta && meta.totalPages > 1 && (
              <Pagination meta={meta} onPageChange={(page) => updateFilter('page', page)} />
            )}
          </>
        )}
      </div>

      {/* Modals */}
      <Modal isOpen={modal.type === 'create'} onClose={closeModal} title="Add New Lead">
        <LeadForm onSuccess={handleSuccess} onCancel={closeModal} />
      </Modal>

      <Modal isOpen={modal.type === 'edit'} onClose={closeModal} title="Edit Lead">
        {modal.type === 'edit' && (
          <LeadForm lead={modal.lead} onSuccess={handleSuccess} onCancel={closeModal} />
        )}
      </Modal>

      <Modal isOpen={modal.type === 'view'} onClose={closeModal} title="Lead Details" size="sm">
        {modal.type === 'view' && (
          <LeadDetail lead={modal.lead} onEdit={() => setModal({ type: 'edit', lead: modal.lead })} />
        )}
      </Modal>
    </div>
  );
}
