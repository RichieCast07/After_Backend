class GetUserByIDHandler {
    constructor(getUsersByIdUseCase) {
        this.getUsersByIdUseCase = getUsersByIdUseCase;
    }

    async handle(req, res, next) {
        const { id } = req.params;
        try {
            const user = await this.getUsersByIdUseCase.execute(id);
            res.status(200).json(user);
        } catch (error) {
            res.status(error.statusCode || 500).json({ message: error.message });
        }
    }
}   

module.exports = GetUserByIDHandler;