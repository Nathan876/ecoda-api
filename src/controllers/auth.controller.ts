import { Request, Response } from "express";
import { verifyCredentials, signToken } from "../services/auth.service";
import { loginRequestSchema } from "../schemas/auth.schemas";

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
