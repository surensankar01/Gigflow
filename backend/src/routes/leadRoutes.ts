import { Router } from 'express';
import { body } from 'express-validator';
import {
  getLeads,
  getLead,
  createLead,
  updateLead,
  deleteLead,
  exportLeadsCSV,
  getLeadStats,
} from '../controllers/leadController';
import { protect, authorize } from '../middleware/auth';
import { validateRequest } from '../middleware/errorHandler';

const router = Router();

// All routes require authentication
router.use(protect);

const leadValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('source')
    .isIn(['Website', 'Instagram', 'Referral'])
    .withMessage('Source must be Website, Instagram, or Referral'),
  body('status')
    .optional()
    .isIn(['New', 'Contacted', 'Qualified', 'Lost'])
    .withMessage('Status must be New, Contacted, Qualified, or Lost'),
  body('notes')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Notes cannot exceed 500 characters'),
];

router.get('/stats', getLeadStats);
router.get('/export', exportLeadsCSV);
router.get('/', getLeads);
router.get('/:id', getLead);
router.post('/', leadValidation, validateRequest, createLead);
router.put(
  '/:id',
  [
    body('name').optional().trim().isLength({ min: 2, max: 100 }),
    body('email').optional().isEmail().normalizeEmail(),
    body('source').optional().isIn(['Website', 'Instagram', 'Referral']),
    body('status').optional().isIn(['New', 'Contacted', 'Qualified', 'Lost']),
    body('notes').optional().isLength({ max: 500 }),
  ],
  validateRequest,
  updateLead
);
router.delete('/:id', authorize('admin'), deleteLead);

export default router;
