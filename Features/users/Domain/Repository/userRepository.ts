import type { User } from "../Data/user.js";

/**
 * Domain port / interface for a UserRepository (Hexagonal Architecture port)
 * Implementations (adapters) should implement these methods.
 */
export abstract class UserRepository {
    abstract getUsersByRole(rolId: number): Promise<User[]>;

    abstract getUsers(): Promise<User[]>;

    abstract putUsers(id: number, user: User): Promise<any>;

    abstract getUsersById(userId: number): Promise<User | null>;

    abstract getUserByUsername(username: string): Promise<User | null>;

    abstract deleteUsers(userId: number): Promise<any>;

    abstract loginUser(email: string, password: string): Promise<User | null>;

    abstract registerUser(user: User): Promise<any>;
}