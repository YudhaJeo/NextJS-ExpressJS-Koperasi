import express from 'express';
import {
  getAllLaporanMbanking,
} from '../controllers/laporanMbankingController.js';

const router = express.Router();

router.get('/', getAllLaporanMbanking);

export default router;