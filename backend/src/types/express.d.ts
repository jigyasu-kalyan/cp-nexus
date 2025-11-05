import 'express-serve-static-core';

interface JwtPayload {
    userId: string;
}

declare module 'express-serve-static-core' {
    interface Request {
        user?: JwtPayload;
    }
}