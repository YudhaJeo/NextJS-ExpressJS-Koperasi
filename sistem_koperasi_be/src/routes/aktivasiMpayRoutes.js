import express from 'express';
import { getAllAktivasiMpay, updateAktivasiMpay, deleteAktivasiMpay, createAktivasiMpay} from '../controllers/aktivasiMpayController.js';

const router = express.Router();

router.get('/', getAllAktivasiMpay);
router.post('/', createAktivasiMpay);
router.put('/:id', updateAktivasiMpay);
router.delete('/:id', deleteAktivasiMpay);

export default router;
