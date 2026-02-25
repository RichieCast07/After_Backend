const db = require('../../../../core/db');
const bcrypt = require('bcryptjs');

class MySQL {
    constructor() {
        this.pool = db.pool;
    }

    // Save a product (name, price)
    // Save a user (user object with name, email)

    /*
    async postUsers(user) {
        const query = 'INSERT INTO usuario (username, password, id_persona) VALUES (?, ?, 1)';
        try {
            // Hash password if provided
            let passwordToSave = user.password;
            if (passwordToSave !== undefined && passwordToSave !== null) {
                passwordToSave = await bcrypt.hash(passwordToSave, 10);
            }
            const result = await db.executePreparedQuery(query, [user.username, passwordToSave]);
            // mysql2 returns insertId on result
            const insertId = result && (result.insertId || result.insert_id || result.affectedRows ? result.insertId : null);
            if (insertId) {
                return { id: insertId, username: user.username, password: user.password };
            }
            // fallback: return raw result
            return result;
        } catch (err) {
            // rethrow or handle as needed
            throw new Error('Error executing insert: ' + err.message);
        }
    }


    */
    // Get all products
    async getUsers() {
        const query = 'SELECT * FROM `user`';
        try {
            const rows = await db.fetchRows(query);
            return rows;
        } catch (err) {
            throw new Error('Error fetching rows: ' + err.message);
        }
    }
    async putUsers(id, userData) {
        const query = 'UPDATE `user` SET password = ?, username = ? WHERE userID = ?';
        try {
            // Hash password if provided
            let passwordToSave = userData.password;
            if (passwordToSave !== undefined && passwordToSave !== null) {
                passwordToSave = await bcrypt.hash(passwordToSave, 10);
            }
            const rows = await db.fetchRows(query, [passwordToSave, userData.username, id]);
            return rows;
        } catch (err) {
            throw new Error('Error fetching rows: ' + err.message);
        }
    }
    async deleteUsers(id) {
        const query = 'DELETE FROM `user` WHERE userID = ?';
        try {
            const rows = await db.fetchRows(query, [id]);
            return rows;
        } catch (err) {
            throw new Error('Error fetching rows: ' + err.message);
        }
    }
    async getUsersById(id) {
        const query = 'SELECT * FROM `user` WHERE userID = ?';
        try {
            const rows = await db.executePreparedQuery(query, [id]);
            return rows[0]; // Assuming id is unique, return the first match
        } catch (err) {
            throw new Error('Error fetching user by ID: ' + err.message);
        }
    }
    async getUserByEmail(email) {
        const query = 'SELECT * FROM `user` WHERE email = ?';
        try {
            const rows = await db.executePreparedQuery(query, [email]);
            return rows[0]; // Assuming email is unique, return the first match
        } catch (err) {
            throw new Error('Error fetching user by email: ' + err.message);
        }
    }
    async loginUser(email, password) {
        const query = 'SELECT * FROM `user` WHERE email = ?';
        try {
            const rows = await db.executePreparedQuery(query, [email]);
            const user = rows && rows[0];
            if (!user) return null;
            const hashed = user.password;
            const match = await bcrypt.compare(password, hashed);
            return match ? user : null ;
        } catch (err) {
            throw new Error('Error logging in user: ' + err.message);
        }
    }
    async registerUser(user) {
        const query = 'INSERT INTO `user` (personaID, hotelID, email, password, username, rol, activo) VALUES (?, ?, ?, ?, ?, ?, ?)';
        try {
            // Hash password before saving
            const saltRounds = 10;
            const hashed = await bcrypt.hash(user.password, saltRounds);
            const result = await db.executePreparedQuery(query, [user.personaID, user.hotelID, user.email, hashed, user.username, user.rol, user.activo]);
            const insertId = result && (result.insertId || result.insert_id || result.affectedRows ? result.insertId : null);
            if (insertId) {
                return { id: insertId, name: user.name, email: user.email };
            }
            return result;
        } catch (err) {
            throw new Error('Error registering user: ' + err.message);
        }
    }
}

module.exports = MySQL;