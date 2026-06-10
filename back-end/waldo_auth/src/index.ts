import express from 'express';
import authRouter from './routes/authRoute.js';

const app = express();

app.use(express.json());


app.use('/api/auth', authRouter)


app.listen(3001, (err) => {
    if(err) throw err;

    console.log("Server Auth on!")
})