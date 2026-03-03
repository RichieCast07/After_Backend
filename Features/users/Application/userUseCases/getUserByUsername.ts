
import { HttpErrors } from "../../../../Core/dberrors.js";
import type { User } from "../../Domain/Data/user.js";
import type { UserRepository } from "../../Domain/Repository/userRepository.js";

interface GetUserByUsernameUseCaseDeps {
    userRepository: UserRepository;
}

export class GetUserByUsernameUseCase {
    private readonly userRepository: UserRepository;

    constructor({ userRepository }: GetUserByUsernameUseCaseDeps) {
        this.userRepository = userRepository;
    }

    async execute(username: string): Promise<User> {
        const user = await this.userRepository.getUserByUsername(username);
        
        if (!user) {
            throw HttpErrors.notFound(`User with username ${username} not found`);
        }
        
        return user;
    }
}
