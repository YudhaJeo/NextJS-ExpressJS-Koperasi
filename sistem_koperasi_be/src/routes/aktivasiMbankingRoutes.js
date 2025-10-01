import express from 'express';
import {
  getAllAktivasiBank,
  updateAktivasiBank,
  deleteAktivasiBank,
} from '../controllers/aktivasiMbankingController.js';

const router = express.Router();

router.get('/', getAllAktivasiBank);
router.put('/:id', updateAktivasiBank);
router.delete('/:id', deleteAktivasiBank);

export default router;