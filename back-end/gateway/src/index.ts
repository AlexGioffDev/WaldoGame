import express, { NextFunction, Request, Response } from 'express'
import { createProxyMiddleware } from 'http-proxy-middleware'

const app = express()

const isAuthenticate = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];

    if(!token) 
    {
        return res.status(401).json({error: "Unauthorized", message: "No token provide!"});
    }

    const authRes = await fetch("http://auth-service:3001/api/auth/verify", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    if(!authRes.ok)
    {
        return res.status(401).json({
            error: "Unauthorized",
            message: "Invalid token"
        })
    }

    const {userId} = await authRes.json();
    req.headers['x-user-id'] = String(userId);
    next();
} 




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

app.use('/auth', createProxyMiddleware({
    target: "http://auth-service:3001",
    changeOrigin: true,
    pathRewrite: { '^/auth': "" }
}))



app.listen(3000, () => console.log('Gateway ON :3000'))