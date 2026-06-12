import rateLimit from "express-rate-limit"

export const globalLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    message: {
        error: "Too Many Request",
        message: "Too many request, try later"
    }
})

export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    message: { error: "Too Many Requests", message: "Too many attempts, try again later!" }
})
