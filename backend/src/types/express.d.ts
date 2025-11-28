import 'express-serve-static-core';

interface JwtPayload {
    id: string;
}

declare module 'express-serve-static-core' {
    interface Request {
        user?: JwtPayload;
    }
}