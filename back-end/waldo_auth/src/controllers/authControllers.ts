import { Request, Response } from "express";
import bcrypt from 'bcrypt'
import { prisma } from "../lib/prisma.js";
import { generateToken, verifyToken } from "../utils/jwt.js";
import { Prisma } from "../../generated/prisma/client.js";

export const signUp = async (req: Request, res: Response) => {

    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({
                error: "Bad Request",
                message: "You must pass all the fields!"
            })
        }

        if (username.trim() === "" || email.trim() === "" || password.trim() === "") {
            return res.status(400).json({
                error: "Bad Request",
                message: "The fields can't be an empty string!"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                username, email, password: hashedPassword
            }
        })

        const token = generateToken(user.user_id)

        res.status(201).json({
            user: {
                username: user.username,
                id: user.user_id,
                email: user.email
            },
            token: token
        })


    } catch (error) {

        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
            return res.status(409).json({
                error: "Conflict",
                message: "Username or Email already used!"
            })
        }

        return res.status(500).json({
            error: "Internal Server Error",
            message: "Something went wrong with the server, try again!"
        })
    }
}

export const login = async (req: Request, res: Response) => {
    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                error: "Bad Request",
                message: "You must to pass all the fields"
            })
        }

        if (email.trim() === "" || password.trim() === "") {
            return res.status(400).json({
                error: "Bad Request",
                message: "The fields can't be an empty string!"
            })
        }

        const user = await prisma.user.findUnique({
            where: {
                email: email
            }
        })

        if (!user) {
            return res.status(400).json({
                error: "Invalid Value",
                message: "Fields not valid! try again!"
            })
        }

        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            return res.status(404).json({
                error: "Invalid Value",
                message: "Fields not valid! Try again!"
            })
        }

        const token = generateToken(user.user_id);

        return res.status(200).json({
            token: token
        })



    } catch (error) {
        return res.status(500).json({
            error: "Internal Server Error",
            message: "Something went wrong with the server, try again!"
        })
    }
}

export const verify = (req: Request, res: Response) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                error: "Unauthorized",
                message: "No token provided"
            })
        }

        const payload = verifyToken(token);

        return res.status(200).json({
            userId: payload.userId
        })
    } catch (error) {
        return res.status(401).json({
            error: "Unauthorized",
            message: "Invalid or expired token"
        })
    }
}