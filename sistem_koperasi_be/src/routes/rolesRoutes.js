import express from 'express';
import { getAllRoles, createRoles, updateRoles, deleteRoles } from '../controllers/rolesController.js';

const router = express.Router();

router.get('/', getAllRoles);
router.post('/', createRoles);
router.put('/:id', updateRoles);
router.delete('/:id', deleteRoles);

export default router;