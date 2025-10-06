import express from 'express';
import { getUser, updateUser } from '../controllers/profileController.js';

const router = express.Router();

router.get('/', getUser);
router.put('/', updateUser);

export default router;
