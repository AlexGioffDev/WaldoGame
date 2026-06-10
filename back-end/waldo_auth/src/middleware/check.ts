import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/jwt.js";

export const isGuest = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];

    if(!token) {
        return next();
    }

    try {
        verifyToken(token);

        return res.status(403).json({
            error: "Forbidden",
            message: "You are already logged in!"
        })
    } catch {
        next();
    }
}