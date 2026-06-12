import express from 'express'
import { prisma } from './lib/prisma.js'
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import gameRouter from './routes/gameRoute.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



const app = express();

app.use('/images', express.static(path.join(__dirname, "../public/images")))
app.use(express.json())

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'up' })
})

app.use('/api/game', gameRouter)


app.listen(3002, (err) => {
    if (err) throw err;

    console.log("Server Game ON");
})