import { useState, useEffect, useCallback } from 'react';
import { Lead, LeadFilters, PaginationMeta } from '../types';
import { leadService } from '../services/leadService';
import { useDebounce } from './useDebounce';
import toast from 'react-hot-toast';

const DEFAULT_FILTERS: LeadFilters = {
  page: 1,
  limit: 10,
  status: '',
  source: '',
  search: '',
  sort: 'latest',
};

export function useLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [filters, setFilters] = useState<LeadFilters>(DEFAULT_FILTERS);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const debouncedSearch = useDebounce(filters.search, 400);

  const fetchLeads = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await leadService.getLeads({
        ...filters,
        search: debouncedSearch,
      });
      if (response.success && response.data) {
        setLeads(response.data);
        setMeta(response.meta || null);
      }
    } catch {
      setError('Failed to load leads. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [filters, debouncedSearch]);

  useEffect(() => {
    void fetchLeads();
  }, [fetchLeads]);

  const updateFilter = useCallback(
    <K extends keyof LeadFilters>(key: K, value: LeadFilters[K]) => {
      setFilters((prev) => ({
        ...prev,
        [key]: value,
        // Reset to page 1 when filter changes (except page itself)
        ...(key !== 'page' ? { page: 1 } : {}),
      }));
    },
    []
  );

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  const deleteLead = useCallback(
    async (id: string) => {
      try {
        await leadService.deleteLead(id);
        toast.success('Lead deleted successfully');
        void fetchLeads();
      } catch {
        toast.error('Failed to delete lead');
      }
    },
    [fetchLeads]
  );

  const exportCSV = useCallback(async () => {
    try {
      const blob = await leadService.exportCSV(filters);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `gigflow-leads-${Date.now()}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('CSV exported successfully');
    } catch {
      toast.error('Failed to export CSV');
    }
  }, [filters]);

  return {
    leads,
    meta,
    filters,
    isLoading,
    error,
    updateFilter,
    resetFilters,
    refetch: fetchLeads,
    deleteLead,
    exportCSV,
  };
}
