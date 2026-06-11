import express from 'express'
import { prisma } from './lib/prisma.js'
import path from 'node:path';
import { fileURLToPath } from 'node:url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



const app = express();

app.use('/images', express.static(path.join(__dirname, "../public/images")))
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

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'up' })
})

app.listen(3002, (err) => {
    if (err) throw err;

    console.log("Server Game ON");
})