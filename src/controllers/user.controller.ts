import { Request, Response } from "express";
import { getProfile } from "../services/user.service";

export async function getMe(req: Request, res: Response): Promise<Response> {
    
    const profile = await getProfile(res.locals.user.userId);

    if (!profile) {
        return res.status(404).json({ "error": "User not found" });
    }

    return res.status(200).json(profile);
}