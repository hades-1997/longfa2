import express from 'express';
const router = express.Router();

const homeControllers =  require ('../app/controllers/HomeController');

router.use('/', homeControllers.index)

module.exports = new router;