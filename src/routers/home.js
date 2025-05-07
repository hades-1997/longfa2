import express from 'express';
import homeControllers from '../app/controllers/HomeController.js';

const router = express.Router();

router.get('/create', homeControllers.create);
router.post('/store', homeControllers.store);
router.get('/:slug', homeControllers.show);
router.use('/', homeControllers.index);

export default router;