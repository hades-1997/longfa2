import express from 'express';
import homeControllers from '../app/controllers/HomeController.js';
import upload from '../util/multer.js';

const router = express.Router();

router.get('/create', homeControllers.create);
router.post('/store', homeControllers.store);
router.get('/search', homeControllers.search);
router.get('/import', homeControllers.importForm);
router.post('/handle-form-actions', homeControllers.handleFormActions);
router.post('/import', upload.single('excelFile'), homeControllers.importExcel);
router.get('/:id/edit', homeControllers.edit);
router.put('/:id', homeControllers.update);
router.delete('/:id', homeControllers.destroy);
router.use('/home', homeControllers.index);
router.use('/', homeControllers.index);


// router.get('/create', homeControllers.form);
// router.get('/:id/edit', homeControllers.form);
// router.post('/save', homeControllers.save);
// router.post('/:id/save', homeControllers.save);
// router.use('/', homeControllers.index);

export default router;