import bcrypt from 'bcryptjs';
import type { User } from "../../Domain/Data/user.js";
import { UserRepository } from "../../Domain/Repository/userRepository.js";

interface InMemoryUser extends Partial<User> {
    id?: number;
}

export class InMemoryUserRepository extends UserRepository {
    private users: InMemoryUser[];
    private nextId: number;

    constructor() {
        super();
        this.users = [];
        this.nextId = 1;
    }

    async getUsers(): Promise<User[]> {
        return this.users.slice() as User[];
    }

    async getUsersById(id: number): Promise<User | null> {
        return (this.users.find(user => user.id === id) as User) || null;
    }

    async getUserByEmail(email: string): Promise<User | null> {
        return (this.users.find(user => user.email === email) as User) || null;
    }

    async deleteUsers(id: number): Promise<boolean> {
        const index = this.users.findIndex(user => user.id === id);
        if (index !== -1) {
            this.users.splice(index, 1);
            return true;
        }
        return false;
    }

    async putUsers(id: number, updatedUser: Partial<User>): Promise<User | null> {
        const index = this.users.findIndex(user => user.id === id);
        if (index !== -1) {
            this.users[index] = { ...this.users[index], ...updatedUser };
            return this.users[index] as User;
        }
        return null;
    }

    async loginUser(email: string, password: string): Promise<User | null> {
        const user = this.users.find(user => user.email === email);
        if (!user || !user.password) return null;
        
        const match = await bcrypt.compare(password, user.password);
        return match ? (user as User) : null;
    }

    async registerUser(user: User): Promise<any> {
        const hashed = await bcrypt.hash(user.password, 10);
        const newUser: InMemoryUser = {
            id: this.nextId++,
            username: user.username,
            email: user.email,
            password: hashed,
            personaID: user.personaID,
            hotelID: user.hotelID,
            rol: user.rol,
            activo: user.activo,
            fechaRegistro: user.fechaRegistro || new Date()
        };
        this.users.push(newUser);
        return newUser;
    }
}
