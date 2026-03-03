import { HttpErrors } from "../../../../Core/dberrors.js";
import type { User } from "../../Domain/Data/user.js";
import type { UserRepository } from "../../Domain/Repository/userRepository.js";

interface GetUserByIdUseCaseDeps {
    userRepository: UserRepository;
}

export class GetUsersByIdUseCase {
    private readonly userRepository: UserRepository;

    constructor({ userRepository }: GetUserByIdUseCaseDeps) {
        this.userRepository = userRepository;
    }

    async execute(id: number): Promise<User> {
        const user = await this.userRepository.getUsersById(id);
        
        if (!user) {
            throw HttpErrors.notFound(`User with ID ${id} not found`);
        }
        
        return user;
    }
}
