import bcrypt from 'bcryptjs';
import type { ResultSetHeader, RowDataPacket } from 'mysql2';
import db from '../../../../Core/db.js';
import type { User } from "../../Domain/Data/user.js";
import { UserRepository } from "../../Domain/Repository/userRepository.js";

export class MySQL extends UserRepository {
    private readonly pool: any;

    constructor() {
        super();
        this.pool = db.pool;
    }

    async getUsers(): Promise<User[]> {
        const query = 'SELECT * FROM `user`';
        try {
            const rows = await db.fetchRows(query);
            return rows as User[];
        } catch (err) {
            if (err instanceof Error) {
                throw new Error('Error fetching rows: ' + err.message);
            }
            throw new Error('Error fetching rows: ' + String(err));
        }
    }

    async putUsers(id: number, userData: User): Promise<any> {
        const query = 'UPDATE `user` SET password_hash = ?, username = ? WHERE userID = ?';
        try {
            let passwordToSave = userData.password_hash;
            if (passwordToSave !== undefined && passwordToSave !== null) {
                passwordToSave = await bcrypt.hash(passwordToSave, 10);
            }
            const rows = await db.fetchRows(query, [passwordToSave, userData.username, id]);
            return rows;
        } catch (err) {
            if (err instanceof Error) {
                throw new Error('Error updating user: ' + err.message);
            }
            throw new Error('Error updating user: ' + String(err));
        }
    }

    async deleteUsers(id: number): Promise<any> {
        const query = 'DELETE FROM `user` WHERE userID = ?';
        try {
            const rows = await db.fetchRows(query, [id]);
            return rows;
        } catch (err) {
            if (err instanceof Error) {
                throw new Error('Error deleting user: ' + err.message);
            }
            throw new Error('Error deleting user: ' + String(err));
        }
    }

    async getUsersById(id: number): Promise<User | null> {
        const query = 'SELECT * FROM `user` WHERE userID = ?';
        try {
            const rows = await db.executePreparedQuery(query, [id]) as RowDataPacket[];
            return (rows[0] as User) || null;
        } catch (err) {
            if (err instanceof Error) {
                throw new Error('Error fetching user by ID: ' + err.message);
            }
            throw new Error('Error fetching user by ID: ' + String(err));
        }
    }

    async getUserByEmail(username: string): Promise<User | null> {
        const query = 'SELECT * FROM `usuarios` WHERE username = ?';
        try {
            const rows = await db.executePreparedQuery(query, [username]) as RowDataPacket[];
            return (rows[0] as User) || null;
        } catch (err) {
            if (err instanceof Error) {
                throw new Error('Error fetching user by username: ' + err.message);
            }
            throw new Error('Error fetching user by username: ' + String(err));
        }
    }

    async loginUser(username: string, password: string): Promise<User | null> {
        const query = 'SELECT * FROM `usuarios` WHERE username = ?';
        try {
            const rows = await db.executePreparedQuery(query, [username]) as RowDataPacket[];
            const user = rows[0] as User | undefined;
            if (!user) return null;
            
            const hashed = user.password_hash;
            const match = await bcrypt.compare(password, hashed);
            return match ? user : null;
        } catch (err) {
            if (err instanceof Error) {
                throw new Error('Error during login: ' + err.message);
            }
            throw new Error('Error during login: ' + String(err));
        }
    }

    async getUserByUsername(username: string): Promise<User | null> {
        const query = 'SELECT * FROM `usuarios` WHERE username = ?';
        try {
            const rows = await db.executePreparedQuery(query, [username]) as RowDataPacket[];
            return (rows[0] as User) || null;
        } catch (err) {
            if (err instanceof Error) {
                throw new Error('Error fetching user by username: ' + err.message);
            }
            throw new Error('Error fetching user by username: ' + String(err));
        }
    }

    async registerUser(user: User): Promise<any> {
        const query = 'INSERT INTO `usuarios` (nombre_completo, telefono, username, password_hash, rol_id, activo) VALUES (?, ?, ?, ?, ?, ?)';
        try {
            const saltRounds = 10;
            const hashed = await bcrypt.hash(user.password_hash, saltRounds);
            const result = await db.executePreparedQuery(query, [
                user.nombre_completo,
                user.telefono,
                user.username,
                hashed,
                user.rol_id,
                user.activo
            ]) as ResultSetHeader;
            
            const insertId = result.insertId;
            if (insertId) {
                return { 
                    id: insertId, 
                    nombre_completo: user.nombre_completo, 
                    telefono: user.telefono,
                    username: user.username,
                    rol_id: user.rol_id
                };
            }
            return result;
        } catch (err) {
            if (err instanceof Error) {
                throw new Error('Error registering user: ' + err.message);
            }
            throw new Error('Error registering user: ' + String(err));
        }
    }
}
