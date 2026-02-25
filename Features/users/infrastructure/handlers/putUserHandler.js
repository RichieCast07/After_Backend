class PutUserHandler {
    constructor(putUserUseCase) {
        this.putUserUseCase = putUserUseCase;
    }

    async handle(request, response) {
        try {
            const userId = request.params.id;
            const userData = request.body;
            const updatedUser = await this.putUserUseCase.execute(userId, userData);
            response.status(200).json(updatedUser);
        } catch (error) {
            response.status(error.statusCode || 500).json({ message: error.message });
        }
    }
}

module.exports = PutUserHandler;