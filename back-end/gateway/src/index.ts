import express, { Request, Response } from 'express'
import { createProxyMiddleware } from 'http-proxy-middleware'
import cors from 'cors';
import { isAuthenticate } from './lib/check.js';
import { authLimiter, globalLimit } from './lib/limit.js';



const app = express()

app.use(cors({
    origin: "http://localhost:5173",
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))


app.use(globalLimit)
app.use('/auth/sign-up', authLimiter)
app.use('/auth/sign-in', authLimiter)


app.get('/health', async (req, res) => {
    try {
        const [authRes, gameRes] = await Promise.all([
            fetch('http://auth-service:3001/health'),
            fetch('http://game-service:3002/health')
        ])

        return res.status(200).json({
            gateway: 'up',
            auth: authRes.ok ? 'up' : 'down',
            game: gameRes.ok ? 'up' : 'down',
        })

    } catch (error) {
        return res.status(500).json({
            gateway: 'up',
            auth: 'down',
            game: 'down',
        })
    }
})

app.get('/leaderboard', async (req: Request, res: Response) => {
    try {
        const gameRes = await fetch("http://game-service:3002/api/game/top");


        const { tops } = await gameRes.json();

        const leaderboard = await Promise.all(tops.map(async (entry: { userId: number, score: number }) => {
            const authRes = await fetch(`http://auth-service:3001/api/auth/profile/${entry.userId}`);
            const { username } = await authRes.json();
            return { username, score: entry.score }
        }))

        return res.status(200).json({ leaderboard })

    } catch (err) {
        console.log(err)
        return res.status(500).json({
            error: "Internal Server Error",
            message: "Something went wrong! Try again later!"
        })
    }
})

app.use('/auth', createProxyMiddleware({
    target: "http://auth-service:3001",
    changeOrigin: true,
    pathRewrite: (path) => `/api/auth${path}`
}))




app.use('/game/save', isAuthenticate, createProxyMiddleware({
    target: "http://game-service:3002",
    changeOrigin: true,
    pathRewrite: { '^/': '/api/game/save' }
}));

app.use('/game',
    createProxyMiddleware({
        target: "http://game-service:3002",
        changeOrigin: true,
        pathRewrite: { '^/': '/api/game/' }
    })
);

app.use('/images',
    createProxyMiddleware({
        target: "http://game-service:3002",
        changeOrigin: true,
        pathRewrite: { '^/': '/images/' }
    })
);


app.listen(3000, () => console.log('Gateway ON :3000'))