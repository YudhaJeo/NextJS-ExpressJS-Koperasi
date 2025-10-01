import express from 'express';
import { getAllAktivasiMpay, updateAktivasiMpay, deleteAktivasiMpay} from '../controllers/aktivasiMpayController.js';

const router = express.Router();

router.get('/', getAllAktivasiMpay);
router.put('/:id', updateAktivasiMpay);
router.delete('/:id', deleteAktivasiMpay);

export default router;
