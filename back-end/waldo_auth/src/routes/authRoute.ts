import { Router } from "express";
import { login, signUp, verify } from "../controllers/authControllers.js";
import { isGuest } from "../middleware/check.js";


const authRouter = Router();


authRouter.post('/sign-up', isGuest,signUp)
authRouter.post('/sign-in', isGuest,login)
authRouter.get('/verify', verify)


export default authRouter;