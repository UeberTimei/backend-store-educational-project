class ApiError extends Error {
    status;
    errors;

    constructor(status, message, errors = []){
        super(message);
        this.status = status
        this.errors = errors
    }

    static badRequest(message, errors = []){
        return new ApiError(400, message, errors)
    }

    static unauthorizedError(){
        return new ApiError(401, 'User not authorized')
    }

    static forbidden(){
        return new ApiError(403, 'No access')
    }
}

module.exports = ApiError