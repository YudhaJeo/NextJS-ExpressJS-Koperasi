import express from 'express';
import * as UsersController from '../controllers/usersController.js';

const router = express.Router();

router.get('/', UsersController.index);
router.get('/:id', UsersController.show);
router.post('/', UsersController.store);
router.put('/:id', UsersController.update);
router.delete('/:id', UsersController.destroy);

export default router;