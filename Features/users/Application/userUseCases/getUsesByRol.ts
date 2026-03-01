import type { User } from "../../Domain/Data/user.js";
import type { UserRepository } from "../../Domain/Repository/userRepository.js";

export class GetUsersByRolUseCase {
    private readonly userRepository: UserRepository;

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
    }

    async execute(rolId: number): Promise<User[]> {
        return this.userRepository.getUsersByRole(rolId);
    }
}
