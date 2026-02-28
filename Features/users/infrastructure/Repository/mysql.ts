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
        const query = 'UPDATE `user` SET password = ?, username = ? WHERE userID = ?';
        try {
            let passwordToSave = userData.password;
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

    async getUserByEmail(email: string): Promise<User | null> {
        const query = 'SELECT * FROM `user` WHERE email = ?';
        try {
            const rows = await db.executePreparedQuery(query, [email]) as RowDataPacket[];
            return (rows[0] as User) || null;
        } catch (err) {
            if (err instanceof Error) {
                throw new Error('Error fetching user by email: ' + err.message);
            }
            throw new Error('Error fetching user by email: ' + String(err));
        }
    }

    async loginUser(email: string, password: string): Promise<User | null> {
        const query = 'SELECT * FROM `user` WHERE email = ?';
        try {
            const rows = await db.executePreparedQuery(query, [email]) as RowDataPacket[];
            const user = rows[0] as User | undefined;
            if (!user) return null;
            
            const hashed = user.password;
            const match = await bcrypt.compare(password, hashed);
            return match ? user : null;
        } catch (err) {
            if (err instanceof Error) {
                throw new Error('Error during login: ' + err.message);
            }
            throw new Error('Error during login: ' + String(err));
        }
    }

    async registerUser(user: User): Promise<any> {
        const query = 'INSERT INTO `user` (personaID, hotelID, email, password, username, rol, activo) VALUES (?, ?, ?, ?, ?, ?, ?)';
        try {
            const saltRounds = 10;
            const hashed = await bcrypt.hash(user.password, saltRounds);
            const result = await db.executePreparedQuery(query, [
                user.personaID,
                user.hotelID,
                user.email,
                hashed,
                user.username,
                user.rol,
                user.activo
            ]) as ResultSetHeader;
            
            const insertId = result.insertId;
            if (insertId) {
                return { 
                    id: insertId, 
                    name: user.username, 
                    email: user.email 
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
