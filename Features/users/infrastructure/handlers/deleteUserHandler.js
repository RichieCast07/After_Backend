class DeleteUserHandler {
    constructor(deleteUserUseCase) {
        this.deleteUserUseCase = deleteUserUseCase;
    }

    async handle(req, res) {
        const { id } = req.params;
        try {
            await this.deleteUserUseCase.execute(id);
            res.status(200).json({ message: `User with ID ${id} deleted successfully` });
        } catch (error) {
            res.status(error.statusCode || 500).json({ message: error.message });
        }
    }
}

module.exports = DeleteUserHandler;