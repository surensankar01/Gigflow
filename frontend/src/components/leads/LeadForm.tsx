import { useState } from 'react';
import { Lead, LeadFormData, LeadStatus, LeadSource } from '../../types';
import { leadService } from '../../services/leadService';
import toast from 'react-hot-toast';
import { Spinner } from '../ui/States';

interface LeadFormProps {
  lead?: Lead;
  onSuccess: () => void;
  onCancel: () => void;
}

const STATUS_OPTIONS: LeadStatus[] = ['New', 'Contacted', 'Qualified', 'Lost'];
const SOURCE_OPTIONS: LeadSource[] = ['Website', 'Instagram', 'Referral'];

export default function LeadForm({ lead, onSuccess, onCancel }: LeadFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<LeadFormData>({
    name: lead?.name || '',
    email: lead?.email || '',
    status: lead?.status || 'New',
    source: lead?.source || 'Website',
    notes: lead?.notes || '',
  });

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim() || formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    if (!formData.email.match(/^\S+@\S+\.\S+$/)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.source) {
      newErrors.source = 'Please select a source';
    }
    if (formData.notes && formData.notes.length > 500) {
      newErrors.notes = 'Notes cannot exceed 500 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      if (lead) {
        await leadService.updateLead(lead._id, formData);
        toast.success('Lead updated successfully');
      } else {
        await leadService.createLead(formData);
        toast.success('Lead created successfully');
      }
      onSuccess();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || 'Operation failed';
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={(e) => { void handleSubmit(e); }} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="John Doe"
            className={`input ${errors.name ? 'border-red-500/50 focus:ring-red-500/20' : ''}`}
          />
          {errors.name && (
            <p className="text-red-400 text-xs mt-1">{errors.name}</p>
          )}
        </div>
        <div>
          <label className="label">Email *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="john@example.com"
            className={`input ${errors.email ? 'border-red-500/50 focus:ring-red-500/20' : ''}`}
          />
          {errors.email && (
            <p className="text-red-400 text-xs mt-1">{errors.email}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="select"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Source *</label>
          <select
            name="source"
            value={formData.source}
            onChange={handleChange}
            className={`select ${errors.source ? 'border-red-500/50' : ''}`}
          >
            {SOURCE_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          {errors.source && (
            <p className="text-red-400 text-xs mt-1">{errors.source}</p>
          )}
        </div>
      </div>

      <div>
        <label className="label">
          Notes
          <span className="text-slate-600 font-normal ml-1">
            ({formData.notes?.length || 0}/500)
          </span>
        </label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Add any additional notes..."
          rows={3}
          className={`input resize-none ${errors.notes ? 'border-red-500/50' : ''}`}
        />
        {errors.notes && (
          <p className="text-red-400 text-xs mt-1">{errors.notes}</p>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="btn-secondary">
          Cancel
        </button>
        <button type="submit" disabled={isLoading} className="btn-primary">
          {isLoading && <Spinner size="sm" />}
          {lead ? 'Update Lead' : 'Create Lead'}
        </button>
      </div>
    </form>
  );
}
