import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "../config/env";
import {isRevoked} from "../services/token-blacklist.service";

export interface TokenPayload {
    userId: number;
    email: string;
    iat: number;
    exp: number;
}

declare global {
    namespace Express {
        interface Locals {
            user: TokenPayload;
            token: string;
        }
    }
}

export async function authenticate(request: Request, res: Response, next: NextFunction) {

    const header = request.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
        return res.status(401).json({ "error": "Authentication required" })
    }

    const token = header.slice("Bearer ".length).trim();

    if (!token) {
        return res.status(401).json({ error: "Authentication required" });
    }

    let payload: TokenPayload;

    try {
        payload = jwt.verify(token, config.jwt.secret) as TokenPayload;
    } catch (error) {
        return res.status(401).json({ "error": "Invalid or expired token" });
    }

    if (await isRevoked(token)) {
        return res.status(401).json({ "error": "Token has been revoked" })
    }

    res.locals.user = payload;
    res.locals.token = token;
    next();
}