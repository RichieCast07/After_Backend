import type { Ticket } from "../../Domain/Data/ticket.js";
import type { CreateTicketDTO } from "../../Domain/Data/createTicketDTO.js";
import { TicketRepository } from "../../Domain/Repository/ticketRepository.js";
import db from "../../../../Core/db.js";

export class MySQLTicketRepository extends TicketRepository {
    async createTicket(ticket: CreateTicketDTO): Promise<Ticket> {
        const connection = await db.pool.getConnection();
        try {
            const [result] = await connection.query(
                `INSERT INTO boletos 
                (codigo, cliente_id, rp_id, evento_id, fase_id, precio, comision_rp) 
                VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [
                    ticket.codigo,
                    ticket.cliente_id,
                    ticket.rp_id,
                    ticket.evento_id,
                    ticket.fase_id,
                    ticket.precio,
                    ticket.comision_rp
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

    async getTicketByCode(code: string): Promise<Ticket | null> {
        const connection = await db.pool.getConnection();
        try {
            const [rows] = await connection.query(
                `SELECT id, codigo, cliente_id, rp_id, evento_id, fase_id, 
                        precio, comision_rp, estado, fecha_venta, fecha_uso 
                 FROM boletos WHERE codigo = ?`,
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
                `SELECT id, codigo, cliente_id, rp_id, evento_id, fase_id, 
                        precio, comision_rp, estado, fecha_venta, fecha_uso 
                 FROM boletos WHERE evento_id = ?`,
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
                `SELECT id, codigo, cliente_id, rp_id, evento_id, fase_id, 
                        precio, comision_rp, estado, fecha_venta, fecha_uso 
                 FROM boletos WHERE rp_id = ?`,
                [rpId]
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
                `SELECT id, codigo, cliente_id, rp_id, evento_id, fase_id, 
                        precio, comision_rp, estado, fecha_venta, fecha_uso 
                 FROM boletos WHERE id = ?`,
                [ticketId]
            );
            const tickets = rows as Ticket[];
            return tickets.length > 0 ? (tickets[0] as Ticket) : null;
        } finally {
            connection.release();
        }
    }
}
