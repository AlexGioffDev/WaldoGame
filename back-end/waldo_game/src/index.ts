import express from 'express'
import { prisma } from './lib/prisma.js'


const app = express();

app.use(express.json())

app.get('/verify', async (req, res) => {
    try {
        const { imageId, x, y } = req.body;

        const characters = await prisma.character.findMany({
            where: { imageId: imageId }
        });

        const found = characters.find(char => {
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

    } catch (error) {
        return res.status(500).json({
            error: "Internal Server Error",
            message: "Something went wrong with the server, try again later!"
        })
    }
})

app.listen(3002, (err) => {
    if (err) throw err;

    console.log("Server Game ON");
})