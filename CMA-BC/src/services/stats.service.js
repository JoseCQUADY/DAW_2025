import { prisma } from '../config/prisma.js';


export async function getSystemStats() {
    try {
        const result = await prisma.$queryRaw`SELECT * FROM sp_obtener_estadisticas()`;
        return result[0] || await getFallbackStats();
    } catch {
        return await getFallbackStats();
    }
}


async function getFallbackStats() {
    const [
        totalEquipos,
        equiposActivos,
        totalMantenimientos,
        mantenimientosMes,
        totalUsuarios,
        usuariosActivos
    ] = await prisma.$transaction([
        prisma.equipo.count(),
        prisma.equipo.count({ where: { estado: 'ACTIVO' } }),
        prisma.mantenimiento.count(),
        prisma.mantenimiento.count({
            where: {
                fecha: {
                    gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
                }
            }
        }),
        prisma.usuario.count(),
        prisma.usuario.count({ where: { estado: 'ACTIVO' } })
    ]);

    return {
        total_equipos: totalEquipos,
        equipos_activos: equiposActivos,
        total_mantenimientos: totalMantenimientos,
        mantenimientos_mes: mantenimientosMes,
        total_usuarios: totalUsuarios,
        usuarios_activos: usuariosActivos,
        mantenimientos_pendientes: 0
    };
}


export async function getEquiposSummary() {
    try {
        const result = await prisma.$queryRaw`SELECT * FROM v_equipos_resumen LIMIT 10`;
        return result;
    } catch {
        const equipos = await prisma.equipo.findMany({
            where: { estado: 'ACTIVO' },
            take: 10,
            include: {
                mantenimientos: {
                    where: { estado: 'ACTIVO' },
                    orderBy: { fecha: 'desc' },
                    take: 1
                }
            }
        });
        
        return equipos.map(e => ({
            id: e.id,
            nombre: e.nombre,
            marca: e.marca,
            modelo: e.modelo,
            ubicacion: e.ubicacion,
            total_mantenimientos: e.mantenimientos.length,
            ultimo_mantenimiento: e.mantenimientos[0]?.fecha || null
        }));
    }
}


export async function getMantenimientosDetalle(equipoId) {
    try {
        if (equipoId) {
            const result = await prisma.$queryRaw`
                SELECT * FROM v_mantenimientos_detalle 
                WHERE equipo_id = ${equipoId}::UUID 
                ORDER BY fecha DESC 
                LIMIT 20
            `;
            return result;
        }
        const result = await prisma.$queryRaw`
            SELECT * FROM v_mantenimientos_detalle 
            ORDER BY fecha DESC 
            LIMIT 20
        `;
        return result;
    } catch {
        return prisma.mantenimiento.findMany({
            where: equipoId ? { equipoId, estado: 'ACTIVO' } : { estado: 'ACTIVO' },
            include: {
                equipo: { select: { nombre: true, marca: true, modelo: true, ubicacion: true } },
                tecnico: { select: { nombre: true, email: true } }
            },
            orderBy: { fecha: 'desc' },
            take: 20
        });
    }
}


export async function getEquiposPendientes() {
    try {
        const result = await prisma.$queryRaw`SELECT * FROM v_equipos_mantenimiento_pendiente`;
        return result;
    } catch {
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

        return prisma.mantenimiento.findMany({
            where: {
                estado: 'ACTIVO',
                fechaProximoManto: {
                    gte: new Date(),
                    lte: thirtyDaysFromNow
                }
            },
            include: {
                equipo: { select: { id: true, nombre: true, marca: true, modelo: true, ubicacion: true } },
                tecnico: { select: { nombre: true } }
            },
            orderBy: { fechaProximoManto: 'asc' }
        });
    }
}
