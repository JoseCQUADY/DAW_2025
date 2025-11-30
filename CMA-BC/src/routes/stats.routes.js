import express from 'express';
import { getStats, getEquiposSummary, getMantenimientosDetalle, getEquiposPendientes } from '../controllers/stats.controller.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/', getStats);

router.get('/equipos-summary', getEquiposSummary);

router.get('/mantenimientos-detalle', getMantenimientosDetalle);

router.get('/equipos-pendientes', getEquiposPendientes);

export default router;
