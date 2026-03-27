import db from "../../../../Core/db.js";
import type { CreateTicketDTO } from "../../Domain/Data/createTicketDTO.js";
import type { Ticket } from "../../Domain/Data/ticket.js";
import { TicketRepository } from "../../Domain/Repository/ticketRepository.js";

export class MySQLTicketRepository extends TicketRepository {
    async createTicket(ticket: CreateTicketDTO): Promise<Ticket> {
        const connection = await db.pool.getConnection();
        try {
            const [result] = await connection.query(
                `INSERT INTO boletos 
                (codigo, cliente_id, rp_id, evento_id, fase_id, tipo_boleto, precio, comision_rp, qr_payload) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    ticket.codigo,
                    ticket.cliente_id,
                    ticket.rp_id,
                    ticket.evento_id,
                    ticket.fase_id,
                    ticket.tipo_boleto ?? "GENERAL",
                    ticket.precio,
                    ticket.comision_rp,
                    ticket.qr_payload ?? null
                ]
            );
            const insertId = (result as any).insertId;
            const created = await this.getTicketById(insertId);
            if (!created) throw new Error("Failed to retrieve created ticket");
            return created;
        } finally {
            connection.release();
        }
    }

    async existsByClientAndEvent(clientId: number, eventId: number): Promise<boolean> {
        const connection = await db.pool.getConnection();
        try {
            const [rows] = await connection.query(
                "SELECT COUNT(*) as total FROM boletos WHERE cliente_id = ? AND evento_id = ?",
                [clientId, eventId]
            );
            const count = Number((rows as any[])[0]?.total ?? 0);
            return count > 0;
        } finally {
            connection.release();
        }
    }

    async getTicketByCode(code: string): Promise<Ticket | null> {
        const connection = await db.pool.getConnection();
        try {
            const [rows] = await connection.query(
                `SELECT b.id, b.codigo, b.cliente_id, c.nombre_completo as cliente_nombre, c.telefono as cliente_telefono,
                       b.rp_id, u.nombre_completo as rp_nombre, b.evento_id, e.nombre as evento_nombre, e.codigo_evento,
                       b.fase_id, f.nombre as fase_nombre, b.tipo_boleto, b.precio, b.comision_rp, b.estado,
                        b.qr_payload, b.fecha_venta, b.fecha_uso
                 FROM boletos b
                 INNER JOIN clientes c ON c.id = b.cliente_id
                   INNER JOIN usuarios u ON u.id = b.rp_id
                 INNER JOIN eventos e ON e.id = b.evento_id
                   INNER JOIN fases f ON f.id = b.fase_id
                 WHERE b.codigo = ?`,
                [code]
            );
            const tickets = rows as Ticket[];
            return tickets.length > 0 ? (tickets[0] as Ticket) : null;
        } finally {
            connection.release();
        }
    }

    async markAsUsed(ticketCode: string): Promise<Ticket> {
        const connection = await db.pool.getConnection();
        try {
            const existing = await this.getTicketByCode(ticketCode);
            if (!existing) throw new Error("Ticket not found");
            if (existing.estado === "USADO") {
                const error = new Error("Ticket already used");
                (error as any).statusCode = 409;
                throw error;
            }

            await connection.query(
                "UPDATE boletos SET estado = 'USADO', fecha_uso = NOW() WHERE codigo = ?",
                [ticketCode]
            );

            const updated = await this.getTicketByCode(ticketCode);
            if (!updated) throw new Error("Failed to retrieve updated ticket");
            return updated;
        } finally {
            connection.release();
        }
    }

    async getTicketsByEventId(eventId: number): Promise<Ticket[]> {
        const connection = await db.pool.getConnection();
        try {
            const [rows] = await connection.query(
                `SELECT b.id, b.codigo, b.cliente_id, c.nombre_completo as cliente_nombre, c.telefono as cliente_telefono,
                       b.rp_id, u.nombre_completo as rp_nombre, b.evento_id, e.nombre as evento_nombre, e.codigo_evento,
                       b.fase_id, f.nombre as fase_nombre, b.tipo_boleto, b.precio, b.comision_rp, b.estado,
                        b.qr_payload, b.fecha_venta, b.fecha_uso
                 FROM boletos b
                 INNER JOIN clientes c ON c.id = b.cliente_id
                   INNER JOIN usuarios u ON u.id = b.rp_id
                 INNER JOIN eventos e ON e.id = b.evento_id
                   INNER JOIN fases f ON f.id = b.fase_id
                 WHERE b.evento_id = ?
                 ORDER BY b.fecha_venta DESC`,
                [eventId]
            );
            return rows as Ticket[];
        } finally {
            connection.release();
        }
    }

    async getTicketsByRpId(rpId: number): Promise<Ticket[]> {
        const connection = await db.pool.getConnection();
        try {
            const [rows] = await connection.query(
                `SELECT b.id, b.codigo, b.cliente_id, c.nombre_completo as cliente_nombre, c.telefono as cliente_telefono,
                       b.rp_id, u.nombre_completo as rp_nombre, b.evento_id, e.nombre as evento_nombre, e.codigo_evento,
                       b.fase_id, f.nombre as fase_nombre, b.tipo_boleto, b.precio, b.comision_rp, b.estado,
                        b.qr_payload, b.fecha_venta, b.fecha_uso
                 FROM boletos b
                 INNER JOIN clientes c ON c.id = b.cliente_id
                   INNER JOIN usuarios u ON u.id = b.rp_id
                 INNER JOIN eventos e ON e.id = b.evento_id
                   INNER JOIN fases f ON f.id = b.fase_id
                 WHERE b.rp_id = ?
                 ORDER BY b.fecha_venta DESC`,
                [rpId]
            );
            return rows as Ticket[];
        } finally {
            connection.release();
        }
    }

    async getExpiredActiveTickets(): Promise<Ticket[]> {
        const connection = await db.pool.getConnection();
        try {
            const [rows] = await connection.query(
                `SELECT b.id, b.codigo, b.cliente_id, c.nombre_completo as cliente_nombre, c.telefono as cliente_telefono,
                                                b.rp_id, u.nombre_completo as rp_nombre, b.evento_id, e.nombre as evento_nombre, e.codigo_evento,
                                                b.fase_id, f.nombre as fase_nombre, b.tipo_boleto, b.precio, b.comision_rp, b.estado,
                        b.qr_payload, b.fecha_venta, b.fecha_uso
                 FROM boletos b
                 INNER JOIN clientes c ON c.id = b.cliente_id
                                 INNER JOIN usuarios u ON u.id = b.rp_id
                 INNER JOIN eventos e ON e.id = b.evento_id
                                 INNER JOIN fases f ON f.id = b.fase_id
                 WHERE b.estado = 'ACTIVO'
                   AND e.fecha_evento < NOW()
                 ORDER BY e.fecha_evento DESC, b.fecha_venta DESC`
            );
            return rows as Ticket[];
        } finally {
            connection.release();
        }
    }

    async deleteByCode(code: string): Promise<boolean> {
        const connection = await db.pool.getConnection();
        try {
            const [result] = await connection.query(
                "DELETE FROM boletos WHERE codigo = ?",
                [code]
            );

            return ((result as any).affectedRows ?? 0) > 0;
        } finally {
            connection.release();
        }
    }

    private async getTicketById(ticketId: number): Promise<Ticket | null> {
        const connection = await db.pool.getConnection();
        try {
            const [rows] = await connection.query(
                `SELECT b.id, b.codigo, b.cliente_id, c.nombre_completo as cliente_nombre, c.telefono as cliente_telefono,
                       b.rp_id, u.nombre_completo as rp_nombre, b.evento_id, e.nombre as evento_nombre, e.codigo_evento,
                       b.fase_id, f.nombre as fase_nombre, b.tipo_boleto, b.precio, b.comision_rp, b.estado,
                        b.qr_payload, b.fecha_venta, b.fecha_uso
                 FROM boletos b
                 INNER JOIN clientes c ON c.id = b.cliente_id
                   INNER JOIN usuarios u ON u.id = b.rp_id
                 INNER JOIN eventos e ON e.id = b.evento_id
                   INNER JOIN fases f ON f.id = b.fase_id
                 WHERE b.id = ?`,
                [ticketId]
            );
            const tickets = rows as Ticket[];
            return tickets.length > 0 ? (tickets[0] as Ticket) : null;
        } finally {
            connection.release();
        }
    }
}
