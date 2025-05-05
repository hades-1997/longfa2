import express from 'express';
import homeControllers from '../app/controllers/HomeController.js';

const router = express.Router();

router.use('/:slug', homeControllers.show);
router.use('/', homeControllers.index);

export default router;