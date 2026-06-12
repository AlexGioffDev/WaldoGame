import { Router } from "express";
import {  checkPosition, getAllImages, saveScore, topBoard } from "../controller/gameController.js";

const gameRouter = Router();

gameRouter.get('/all', getAllImages);
gameRouter.post('/verify', checkPosition);
gameRouter.post('/save', saveScore)
gameRouter.get('/top', topBoard);


export default gameRouter;