import express from "express";
import { addFood, listFood, removeFood } from "../controllers/foodController.js";
import multer from "multer";
import path from "path";
import { fileURLToPath } from 'url';

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const foodRouter = express.Router();

// Image Storage Engine
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../uploads')); // Correct path
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
    }
});

const upload = multer({ storage: storage });

foodRouter.post("/add", upload.single("image"), addFood);
foodRouter.get("/list",listFood)
foodRouter.post("/remove",removeFood)

export default foodRouter;
