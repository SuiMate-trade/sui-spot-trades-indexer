export class NotFoundError extends Error {
}
export class BadRequestError extends Error {
}
export class ConfigurationError extends Error {
}
export class UnauthorizedError extends Error {
}
export class ForbiddenError extends Error {
}
export class BadRequestErrorWithBody extends Error {
    message;
    code;
    constructor(serviceErrorProps) {
        super();
        this.message = serviceErrorProps.message;
        this.code = serviceErrorProps.code;
    }
}
export class RuntimeError extends Error {
}
//# sourceMappingURL=errors.js.map