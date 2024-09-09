import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from 'stripe';

const stripe = new Stripe("sk_test_51PwtRm07r92ePZkzfuKCJ2RgfRIR8ZKtER6sMMtm2UCqaEprLw30wPXD5SkZY6tiHP8kx2N4wmezPRKiQA83vgyk00WOVbklEg");


//placing user order from froentend
const placeOrder = async (req, res) => {
    const frontend_url = "https://66df46c9d3bab569631601d2--serene-sprinkles-4958a7.netlify.app/";
    try {
        // Save new order
        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address
        });
        await newOrder.save();

        // Clear user's cart
        await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

        // Prepare line items for Stripe checkout
        const lineItems = req.body.items.map((item) => ({
            price_data: {
                currency: "INR",
                product_data: {
                    name: item.name
                },
                unit_amount: item.price * 100 * 84 
            },
            quantity: item.quantity
        }));

        // Add delivery charge
        lineItems.push({
            price_data: {
                currency: "INR",
                product_data: {
                    name: "Delivery Charges"
                },
                unit_amount: 2 * 100 * 84
            },
            quantity: 1
        });

        // Create Stripe Checkout session
        const session = await stripe.checkout.sessions.create({
            line_items: lineItems,
            mode: "payment",
            success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`
        });

        // Send response with session URL
        res.json({ success: true, session_url: session.url });
    } catch (error) {
        console.error("Error placing order:", error);
        res.json({ success: false, message: error.message || "An error occurred while processing the order." });
    }
};

const verifyOrder = async (req,res) =>{
    const {orderId,success} = req.body;
    try {
        if(success=="true"){
            await orderModel.findByIdAndUpdate(orderId,{payment:true});
            res.json({success:true,message:"Paid Successfully"})
        }
        else{
            await orderModel.findByIdAndDelete(orderId);
            res.json({success:false,messgae:"Payment Failed"})
        }
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}

//user Order frro frontend
const userOrders = async (req,res)=>{
    try {
        const orders = await orderModel.find({userId:req.body.userId});
        res.json({success:true,data:orders});
    } catch (error) {
        console.log(error)
        res.json({success:false,message:"Error"})
    }
}
//listing order for admin 
const listOrders = async (req,res) =>{
    try {
        const orders = await orderModel.find({});
        res.json({success:true,data:orders})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}

//api for updating order status
const updateStatus = async (req,res)=>{
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId,{status:req.body.status});
        res.json({success:true,message:"Status Updated"});
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"});
    }
}

export {placeOrder,verifyOrder,userOrders,listOrders,updateStatus};