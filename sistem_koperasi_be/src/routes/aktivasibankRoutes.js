import express from 'express';
import { getAllAktivasiBank, createAktivasiBank, updateAktivasiBank, deleteAktivasiBank } from '../controllers/aktivasibankController.js';

const router = express.Router();

router.get('/', getAllAktivasiBank);
router.post('/', createAktivasiBank);
router.put('/:id', updateAktivasiBank);
router.delete('/:id', deleteAktivasiBank);

export default router;
