import express from 'express';
import {
  getAllSimpanan,
} from '../controllers/simpananController.js';

const router = express.Router();

router.get('/', getAllSimpanan);

export default router;