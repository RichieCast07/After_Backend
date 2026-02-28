import { HttpErrors } from "../../Domain/Data/errors.js";
import type { User } from "../../Domain/Data/user.js";
import type { UserRepository } from "../../Domain/Repository/userRepository.js";

export class RegisterUserUseCase {
    private readonly userRepository: UserRepository;

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
    }

    async execute(userData: User): Promise<any> {
        const existingUser = await this.userRepository.getUserByEmail(userData.email);
        
        if (existingUser) {
            throw HttpErrors.conflict('Email already in use');
        }
        
        return this.userRepository.registerUser(userData);
    }
}
