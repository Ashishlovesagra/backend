import foodModel from "../models/foodModel.js";
import fs from 'fs';
import path from "path";
import { fileURLToPath } from 'url';


//add food item
const addFood = async (req,res) =>{

    let image_filename = `${req.file.filename}`;
    
    const food = new foodModel({
        name:req.body.name,
        description:req.body.description,
        price:req.body.price,
        category:req.body.category,
        image:image_filename
    })
    try {
        food.save();
        res.json({success:true,message:"Food Added Successfully"});
    } catch (error) {
        console.log(error);
        res.json({success:false,message:error});
    }

};

// All food list
const listFood = async (req,res) =>{
    try {
        const foods = await foodModel.find({});
        res.json({success:true,data:foods})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:error});
    }
};

// Determine __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//remove food item 
const removeFood = async (req, res) => {
  try {
    // Find the food item by its ID
    const food = await foodModel.findById(req.body.id);
    if (!food) {
      return res.status(404).json({ success: false, message: "Food item not found" });
    }

    // Define the path to the image file
    const imagePath = path.join(__dirname, '../uploads', food.image);

    // Check if the file exists before attempting to delete
    fs.access(imagePath, fs.constants.F_OK, (err) => {
      if (err) {
        console.error('File does not exist:', imagePath);
        return res.status(404).json({ success: false, message: 'File not found' });
      }

      // Remove the image file
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error('Error deleting file:', err);
          return res.status(500).json({ success: false, message: 'Failed to delete file' });
        }

        // If file deletion is successful, delete the food item from the database
        foodModel.findByIdAndDelete(req.body.id)
          .then(() => {
            res.json({ success: true, message: "Food Deleted Successfully" });
          })
          .catch(deleteError => {
            console.error('Error deleting food item:', deleteError);
            res.status(500).json({ success: false, message: 'Failed to delete food item' });
          });
      });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'An error occurred' });
  }
};

export {addFood,listFood,removeFood};