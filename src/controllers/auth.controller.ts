import {NextFunction, Request, Response} from "express";
import { verifyCredentials, signToken } from "../services/auth.service";
import { loginRequestSchema } from "../schemas/auth.schemas";
import {revoke} from "../services/token-blacklist.service";

export async function login(req: Request, res: Response): Promise<Response> {
    const parseResult = loginRequestSchema.safeParse(req.body);
    if (!parseResult.success) {
        return res.status(400).json({ error: "email and password are required" });
    }
    const { email, password } = parseResult.data;

    const user = await verifyCredentials(email, password);
    if (!user) {
        return res.status(401).json({ error: "Invalid email or password" });
    }

    return res.status(200)
        .json({ token: signToken(user) });
}

export async function logout(req: Request, res: Response): Promise<Response> {

    const token = res.locals.token;
    const exp = res.locals.user.exp;

    await revoke(token, exp);

    return res.status(200).json({ message: "Logged out successfully" });

}