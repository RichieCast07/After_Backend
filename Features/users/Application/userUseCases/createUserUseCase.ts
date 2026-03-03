import { HttpErrors } from "../../../../Core/dberrors.js";
import type { User } from "../../Domain/Data/user.js";
import type { UserRepository } from "../../Domain/Repository/userRepository.js";

interface CreateUserData {
    username: string;
    password: string;
}

export class CreateUserUseCase {
    private readonly userRepository: UserRepository;

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
    }

    async execute(userData: CreateUserData): Promise<any> {
        if (!userData || typeof userData.username !== 'string' || userData.username.trim() === '') {
            throw HttpErrors.badRequest('`username` is required and must be a non-empty string');
        }

        const userToCreate = {
            username: userData.username.trim(),
            password: userData.password
        } as Partial<User>;

        // Check if repository has postUsers method
        if (typeof (this.userRepository as any).postUsers === 'function') {
            return (this.userRepository as any).postUsers(userToCreate);
        }

        // Check if repository has save method
        if (typeof (this.userRepository as any).save === 'function') {
            return (this.userRepository as any).save(userToCreate.username, userData.password);
        }

        throw new Error('Repository does not implement a known save/post method');
    }
}
