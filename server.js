import express from "express";
import cors from "cors";
import { ConnectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoutes.js";
import userRouter from "./routes/userRoutes.js";
import dotenv from 'dotenv';
import cartRouter from "./routes/cartRoutes.js";
import orderRouter from "./routes/orderRoutes.js";
dotenv.config();



//app config
const app = express();
const port = 3000;


//middleware
app.use(express.json());
app.use(cors());

//DB Connection
ConnectDB();

//api endpoints
app.use("/api/food",foodRouter);
app.use("/images",express.static('uploads'));
app.use("/api/user",userRouter);
app.use("/api/cart",cartRouter);
app.use("/api/order",orderRouter);


app.get('/',(req,res)=>{
    res.send("<h2>Food App APIs</h2>")
})


app.listen(port,()=>{
    console.log(`Server is running on http://localhost:${port}`)
})


//