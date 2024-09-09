import userModel from '../models/userModel.js';

// Add items to user cart
const addToCart = async (req, res) => {
    try {
        let userData = await userModel.findOne({ _id: req.body.userId });
        let cartData = userData.cartData; // cartData should be directly accessed

        if (!cartData[req.body.itemId]) {
            cartData[req.body.itemId] = 1;
        } else {
            cartData[req.body.itemId] += 1;
        }

        // Update user document with new cart data
        await userModel.findByIdAndUpdate(req.body.userId, { cartData });

        res.json({ success: true, message: "Added to Cart" });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: 'Error adding to cart' });
    }
};

// Remove items from user cart
const removeFromCart = async (req, res) => {
    try {
        let userData = await userModel.findOne({ _id: req.body.userId });
        let cartData = userData.cartData;

        if (cartData[req.body.itemId]) {
            if (cartData[req.body.itemId] > 1) {
                cartData[req.body.itemId] -= 1;
            } else {
                delete cartData[req.body.itemId];
            }
        }

        // Update user document with new cart data
        await userModel.findByIdAndUpdate(req.body.userId, { cartData });

        res.json({ success: true, message: "Removed from Cart" });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: 'Error removing from cart' });
    }
};

// Fetch user cart data
const getCart = async (req, res) => {
    try {
        let userData = await userModel.findOne({ _id: req.body.userId });
        res.json({ success: true, cartData: userData.cartData });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: 'Error fetching cart data' });
    }
};

export { addToCart, removeFromCart, getCart };
