import { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";

export const getAllImages = async (req: Request, res: Response) => {

    try {
        const images = await prisma.image.findMany({
            include: {
                characters: {
                    select: {
                        character_id: true,
                        name: true
                    }
                }
            }
        })

        return res.status(200).json({ images })
    } catch (error) {
        return res.status(500).json({
            error: "Internal Server Error",
            message: "Something went wrong! please try again later"
        })
    }

}

export const checkPosition = async (req: Request, res: Response) => {
    try {
        const { imageId, x, y } = req.body;

        if (!imageId || !x || !y) {
            return res.status(400).json({
                error: "Bad Request",
                message: "Pass all fields!"
            })
        }

        const characters = await prisma.character.findMany({
            where: {
                imageId: imageId
            }
        })

        const found = characters.find((char) => {
            return Math.abs(x - char.posX) < char.tolerance_x && Math.abs(y - char.posY) < char.tolerance_y
        })

        if (!found) {
            return res.status(200).json({
                found: false,
            })
        }

        return res.status(200).json({
            found: true,
            character: found.name
        })

    } catch {
        return res.status(500).json({
            error: "Internal Server Error",
            message: "Something went wrong! Please try again later"
        })
    }
}

export const saveScore = async (req: Request, res: Response) => {
    const userId = req.headers['x-user-id']!;

    try {
        const {score} = req.body;

        if(!score){
            return res.status(400).json({
                error: "Bad Request",
                message: "You need to pass a score!"
            })
        }

        const scoreNumber = Number(score);
        if(isNaN(scoreNumber)){
            return res.status(400).json({
                error: "Bad Request",
                message: "You need to pass a valid number"
            })
        }

        await prisma.game.create({
            data: {
                userId: Number(userId),
                score: scoreNumber
            }
        })

        return res.status(201).json({
            message: "Game Saved!"
        })


    } catch  {
        return res.status(500).json({
            error: "Internal Server Error",
            message: "Something went wrong! Please try again later"
        })
    }

}

export const topBoard = async (req: Request, res: Response) => {
    try {  
        const tops = await prisma.game.findMany({
            take: 5
        })

        return res.status(200).json({tops})
    } catch {
        return res.status(500).json({
            error: "Internal Server Error",
            message: "Something went wrong! Please try again later"
        })
    }
}