import express from 'express';
import {
  getAllConfigBiayaAdmin,
  updateConfigBiayaAdmin,
} from '../controllers/configBiayaAdminController.js';

const router = express.Router();

router.get('/', getAllConfigBiayaAdmin);
router.put('/:id', updateConfigBiayaAdmin);

export default router;