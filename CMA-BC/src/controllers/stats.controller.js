import * as statsService from '../services/stats.service.js';

export async function getStats(req, res, next) {
    try {
        const stats = await statsService.getSystemStats();
        res.json({
            success: true,
            data: stats,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        next(error);
    }
}


export async function getEquiposSummary(req, res, next) {
    try {
        const summary = await statsService.getEquiposSummary();
        res.json({
            success: true,
            data: summary,
            count: summary.length,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        next(error);
    }
}

export async function getMantenimientosDetalle(req, res, next) {
    try {
        const { equipoId } = req.query;
        const detalle = await statsService.getMantenimientosDetalle(equipoId);
        res.json({
            success: true,
            data: detalle,
            count: detalle.length,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        next(error);
    }
}


export async function getEquiposPendientes(req, res, next) {
    try {
        const pendientes = await statsService.getEquiposPendientes();
        res.json({
            success: true,
            data: pendientes,
            count: pendientes.length,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        next(error);
    }
}
