import { Request, Response } from 'express';
import { Lead } from '../models/Lead';
import { LeadStatus, LeadSource } from '../types';
import { AuthenticatedRequest } from '../middleware/auth';

interface LeadQuery {
  status?: LeadStatus;
  source?: LeadSource;
  $or?: Array<{ name?: RegExp; email?: RegExp }>;
}

export const getLeads = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const {
      page = '1',
      limit = '10',
      status,
      source,
      search,
      sort = 'latest',
    } = req.query as Record<string, string>;

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    // Build filter query
    const query: LeadQuery = {};

    if (status && ['New', 'Contacted', 'Qualified', 'Lost'].includes(status)) {
      query.status = status as LeadStatus;
    }

    if (source && ['Website', 'Instagram', 'Referral'].includes(source)) {
      query.source = source as LeadSource;
    }

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [{ name: searchRegex }, { email: searchRegex }];
    }

    const sortOrder = sort === 'oldest' ? 1 : -1;

    const [leads, total] = await Promise.all([
      Lead.find(query)
        .populate('createdBy', 'name email')
        .populate('assignedTo', 'name email')
        .sort({ createdAt: sortOrder })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Lead.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / limitNum);

    res.status(200).json({
      success: true,
      data: leads,
      meta: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages,
        hasNext: pageNum < totalPages,
        hasPrev: pageNum > 1,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch leads.' });
  }
};

export const getLead = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const lead = await Lead.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email');

    if (!lead) {
      res.status(404).json({ success: false, message: 'Lead not found.' });
      return;
    }

    res.status(200).json({ success: true, data: lead });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch lead.' });
  }
};

export const createLead = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { name, email, status, source, notes, assignedTo } = req.body;

    const lead = await Lead.create({
      name,
      email,
      status: status || 'New',
      source,
      notes,
      assignedTo: assignedTo || undefined,
      createdBy: req.user!.id,
    });

    await lead.populate('createdBy', 'name email');

    res.status(201).json({
      success: true,
      message: 'Lead created successfully.',
      data: lead,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create lead.' });
  }
};

export const updateLead = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { name, email, status, source, notes, assignedTo } = req.body;

    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      res.status(404).json({ success: false, message: 'Lead not found.' });
      return;
    }

    // Sales users can only update their own leads
    if (
      req.user!.role === 'sales' &&
      lead.createdBy.toString() !== req.user!.id
    ) {
      res.status(403).json({
        success: false,
        message: 'Not authorized to update this lead.',
      });
      return;
    }

    const updatedLead = await Lead.findByIdAndUpdate(
      req.params.id,
      { name, email, status, source, notes, assignedTo },
      { new: true, runValidators: true }
    )
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email');

    res.status(200).json({
      success: true,
      message: 'Lead updated successfully.',
      data: updatedLead,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update lead.' });
  }
};

export const deleteLead = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      res.status(404).json({ success: false, message: 'Lead not found.' });
      return;
    }

    // Only admin can delete leads
    if (req.user!.role !== 'admin') {
      res.status(403).json({
        success: false,
        message: 'Only administrators can delete leads.',
      });
      return;
    }

    await Lead.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Lead deleted successfully.',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete lead.' });
  }
};

export const exportLeadsCSV = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { status, source, search } = req.query as Record<string, string>;

    const query: LeadQuery = {};
    if (status && ['New', 'Contacted', 'Qualified', 'Lost'].includes(status)) {
      query.status = status as LeadStatus;
    }
    if (source && ['Website', 'Instagram', 'Referral'].includes(source)) {
      query.source = source as LeadSource;
    }
    if (search?.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [{ name: searchRegex }, { email: searchRegex }];
    }

    const leads = await Lead.find(query)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .lean();

    const csvRows = [
      ['Name', 'Email', 'Status', 'Source', 'Notes', 'Created At'],
      ...leads.map((lead) => [
        lead.name,
        lead.email,
        lead.status,
        lead.source,
        lead.notes || '',
        new Date(lead.createdAt).toISOString().split('T')[0],
      ]),
    ];

    const csvContent = csvRows
      .map((row) =>
        row
          .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
          .join(',')
      )
      .join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="gigflow-leads-${Date.now()}.csv"`
    );
    res.status(200).send(csvContent);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to export leads.' });
  }
};

export const getLeadStats = async (
  _req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const [statusStats, sourceStats, total] = await Promise.all([
      Lead.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      Lead.aggregate([
        { $group: { _id: '$source', count: { $sum: 1 } } },
      ]),
      Lead.countDocuments(),
    ]);

    res.status(200).json({
      success: true,
      data: {
        total,
        byStatus: statusStats.reduce(
          (acc, { _id, count }) => ({ ...acc, [_id]: count }),
          {}
        ),
        bySource: sourceStats.reduce(
          (acc, { _id, count }) => ({ ...acc, [_id]: count }),
          {}
        ),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch stats.' });
  }
};
