import db from "../../../Core/db.js";
import type { EventMetrics, EventRpMetrics, OverallMetrics, PhaseMetrics, RpMetrics } from "../Domain/Data/metrics.js";

export class MetricsService {
    async getOverallMetrics(): Promise<OverallMetrics> {
        const connection = await db.pool.getConnection();
        try {
            const [rows] = await connection.query(
                `SELECT 
                    COUNT(*) as total_boletos_vendidos,
                    SUM(precio) as total_ingresos,
                    SUM(comision_rp) as total_comisiones_rp,
                    SUM(CASE WHEN estado = 'ACTIVO' THEN 1 ELSE 0 END) as boletos_activos,
                    SUM(CASE WHEN estado = 'USADO' THEN 1 ELSE 0 END) as boletos_usados
                 FROM boletos`
            );
            const result = rows as any[];
            return {
                total_boletos_vendidos: result[0]?.total_boletos_vendidos || 0,
                total_ingresos: result[0]?.total_ingresos || 0,
                total_comisiones_rp: result[0]?.total_comisiones_rp || 0,
                boletos_activos: result[0]?.boletos_activos || 0,
                boletos_usados: result[0]?.boletos_usados || 0
            };
        } finally {
            connection.release();
        }
    }

    async getRpMetrics(): Promise<RpMetrics[]> {
        const connection = await db.pool.getConnection();
        try {
            const [rows] = await connection.query(
                `SELECT 
                    u.id as rp_id,
                    u.username,
                    COUNT(b.id) as boletos_vendidos,
                    SUM(b.precio) as ingresos_totales,
                    SUM(b.comision_rp) as comisiones_totales
                 FROM usuarios u
                 LEFT JOIN boletos b ON u.id = b.rp_id
                 WHERE u.rol_id = 2
                 GROUP BY u.id, u.username
                 ORDER BY boletos_vendidos DESC
                 LIMIT 10`
            );
            return rows as RpMetrics[];
        } finally {
            connection.release();
        }
    }

    async getEventMetrics(eventId: number): Promise<EventMetrics> {
        const connection = await db.pool.getConnection();
        try {
            const [rows] = await connection.query(
                `SELECT 
                    e.id as evento_id,
                    e.nombre,
                    COUNT(b.id) as boletos_vendidos,
                    COALESCE(SUM(b.precio), 0) as ingresos_totales,
                    COALESCE(SUM(b.comision_rp), 0) as comisiones_rp,
                    COALESCE(SUM(CASE WHEN b.estado = 'ACTIVO' THEN 1 ELSE 0 END), 0) as boletos_activos,
                    COALESCE(SUM(CASE WHEN b.estado = 'USADO' THEN 1 ELSE 0 END), 0) as boletos_usados
                 FROM eventos e
                 LEFT JOIN boletos b ON e.id = b.evento_id
                 WHERE e.id = ?
                 GROUP BY e.id, e.nombre`,
                [eventId]
            );
            const result = rows as any[];
            if (result.length === 0) throw new Error("Event not found");
            return result[0] as EventMetrics;
        } finally {
            connection.release();
        }
    }

    async getEventPhaseMetrics(eventId: number): Promise<PhaseMetrics[]> {
        const connection = await db.pool.getConnection();
        try {
            const [rows] = await connection.query(
                `SELECT 
                    f.id as fase_id,
                    f.nombre,
                    f.precio,
                    COUNT(b.id) as boletos_vendidos,
                    SUM(b.precio) as ingresos_totales
                 FROM fases f
                 LEFT JOIN boletos b ON f.id = b.fase_id
                 WHERE f.evento_id = ?
                 GROUP BY f.id, f.nombre, f.precio
                 ORDER BY f.fecha_inicio ASC`,
                [eventId]
            );
            return rows as PhaseMetrics[];
        } finally {
            connection.release();
        }
    }

    async getEventRpMetrics(eventId: number): Promise<EventRpMetrics[]> {
        const connection = await db.pool.getConnection();
        try {
            const [rows] = await connection.query(
                `SELECT 
                    u.id as rp_id,
                    u.username,
                    COUNT(b.id) as boletos_vendidos,
                    COALESCE(SUM(b.precio), 0) as ingresos_totales,
                    COALESCE(SUM(b.comision_rp), 0) as comisiones_totales
                 FROM usuarios u
                 LEFT JOIN boletos b ON u.id = b.rp_id AND b.evento_id = ?
                 WHERE u.rol_id = 2
                 GROUP BY u.id, u.username
                 ORDER BY boletos_vendidos DESC, ingresos_totales DESC`,
                [eventId]
            );
            return rows as EventRpMetrics[];
        } finally {
            connection.release();
        }
    }
}
