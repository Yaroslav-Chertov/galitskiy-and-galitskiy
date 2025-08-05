// ROUTES
// Описание маршрутов и связывание с контроллерами.
import { Router } from 'express';
import { pageController } from '#_/server/controllers/webController.js';

const router = Router();

router.get('/{*page}', pageController);




export default router;