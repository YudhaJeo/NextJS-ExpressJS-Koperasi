import express from 'express';
import { getAllPerusahaan, createPerusahaan, updatePerusahaan, deletePerusahaan } from '../controllers/perusahaanController.js';

const router = express.Router();

router.get('/', getAllPerusahaan);
router.post('/', createPerusahaan);
router.put('/:id', updatePerusahaan);
router.delete('/:id', deletePerusahaan);

export default router;
