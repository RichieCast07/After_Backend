import type { Phase } from "../../Domain/Data/phase.js";
import type { CreatePhaseDTO } from "../../Domain/Data/createPhaseDTO.js";
import type { UpdatePhaseDTO } from "../../Domain/Data/updatePhaseDTO.js";
import { PhaseRepository } from "../../Domain/Repository/phaseRepository.js";
import db from "../../../../Core/db.js";

export class MySQLPhaseRepository extends PhaseRepository {
    async getPhasesByEventId(eventId: number): Promise<Phase[]> {
        const connection = await db.pool.getConnection();
        try {
            const [rows] = await connection.query(
                "SELECT id, evento_id, nombre, precio, fecha_inicio, fecha_fin, activa FROM fases WHERE evento_id = ?",
                [eventId]
            );
            return rows as Phase[];
        } finally {
            connection.release();
        }
    }

    async getPhaseById(phaseId: number): Promise<Phase | null> {
        const connection = await db.pool.getConnection();
        try {
            const [rows] = await connection.query(
                "SELECT id, evento_id, nombre, precio, fecha_inicio, fecha_fin, activa FROM fases WHERE id = ?",
                [phaseId]
            );
            const phases = rows as Phase[];
            return phases.length > 0 ? (phases[0] as Phase) : null;
        } finally {
            connection.release();
        }
    }

    async createPhase(eventId: number, phase: CreatePhaseDTO): Promise<Phase> {
        const connection = await db.pool.getConnection();
        try {
            const [result] = await connection.query(
                "INSERT INTO fases (evento_id, nombre, precio, fecha_inicio, fecha_fin) VALUES (?, ?, ?, ?, ?)",
                [eventId, phase.nombre, phase.precio, phase.fecha_inicio, phase.fecha_fin]
            );
            const insertId = (result as any).insertId;
            const created = await this.getPhaseById(insertId);
            if (!created) throw new Error("Failed to retrieve created phase");
            return created;
        } finally {
            connection.release();
        }
    }

    async updatePhase(phaseId: number, phase: UpdatePhaseDTO): Promise<Phase> {
        const connection = await db.pool.getConnection();
        try {
            const updates: string[] = [];
            const values: any[] = [];

            if (phase.nombre !== undefined) {
                updates.push("nombre = ?");
                values.push(phase.nombre);
            }
            if (phase.precio !== undefined) {
                updates.push("precio = ?");
                values.push(phase.precio);
            }
            if (phase.fecha_inicio !== undefined) {
                updates.push("fecha_inicio = ?");
                values.push(phase.fecha_inicio);
            }
            if (phase.fecha_fin !== undefined) {
                updates.push("fecha_fin = ?");
                values.push(phase.fecha_fin);
            }

            if (updates.length === 0) {
                const existing = await this.getPhaseById(phaseId);
                if (!existing) throw new Error("Phase not found");
                return existing;
            }

            values.push(phaseId);
            await connection.query(
                `UPDATE fases SET ${updates.join(", ")} WHERE id = ?`,
                values
            );

            const updated = await this.getPhaseById(phaseId);
            if (!updated) throw new Error("Failed to retrieve updated phase");
            return updated;
        } finally {
            connection.release();
        }
    }

    async togglePhaseStatus(phaseId: number): Promise<Phase> {
        const connection = await db.pool.getConnection();
        try {
            const existing = await this.getPhaseById(phaseId);
            if (!existing) throw new Error("Phase not found");

            await connection.query(
                "UPDATE fases SET activa = NOT activa WHERE id = ?",
                [phaseId]
            );

            const updated = await this.getPhaseById(phaseId);
            if (!updated) throw new Error("Failed to retrieve updated phase");
            return updated;
        } finally {
            connection.release();
        }
    }

    async deletePhase(phaseId: number): Promise<void> {
        const connection = await db.pool.getConnection();
        try {
            const existing = await this.getPhaseById(phaseId);
            if (!existing) throw new Error("Phase not found");

            await connection.query("DELETE FROM fases WHERE id = ?", [phaseId]);
        } finally {
            connection.release();
        }
    }
}
