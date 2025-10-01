import express from 'express';
import { getAllAktivasiBank, deleteAktivasiBank } from '../controllers/aktivasiMbankingController.js';

const router = express.Router();

router.get('/', getAllAktivasiBank);
router.delete('/:id', deleteAktivasiBank);

export default router;
