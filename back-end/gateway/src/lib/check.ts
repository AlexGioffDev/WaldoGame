import { NextFunction, Request, Response } from "express";

export const isAuthenticate = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: "Unauthorized", message: "No token provide!" });
    }

    const authRes = await fetch("http://auth-service:3001/api/auth/verify", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    if (!authRes.ok) {
        return res.status(401).json({
            error: "Unauthorized",
            message: "Invalid token"
        })
    }

    const { userId } = await authRes.json();
    req.headers['x-user-id'] = String(userId);
    req.headers["x-internal-secret"] = process.env.INTERNAL_SECRET!;
    next();
}
