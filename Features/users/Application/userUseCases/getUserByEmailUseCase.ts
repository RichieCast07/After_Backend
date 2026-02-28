import { HttpErrors } from "../../Domain/Data/errors.js";
import type { User } from "../../Domain/Data/user.js";
import type { UserRepository } from "../../Domain/Repository/userRepository.js";

export class GetUserByEmailUseCase {
    private readonly userRepository: UserRepository;

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
    }

    async execute(email: string): Promise<User> {
        const user = await this.userRepository.getUserByEmail(email);
        
        if (!user) {
            throw HttpErrors.notFound(`User with email ${email} not found`);
        }
        
        return user;
    }
}
