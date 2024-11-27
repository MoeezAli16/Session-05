import dotenv from 'dotenv';
import express, { request }  from "express";
import connectdb from "./db/database.js";
import cors from "cors";
import authRoutes from './routes/auth.js';

dotenv.config();
connectdb();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/',(req,res)=>{

    res.send("hello")
});

app.use('/api/auth', authRoutes)
const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>{

    console.log(`server running on ${PORT}`)
})

