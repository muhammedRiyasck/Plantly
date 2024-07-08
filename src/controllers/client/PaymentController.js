const crypto = require("crypto");
const User = require('../../model/user_model') 
const {cart} = require('../../model/CartAndWishlist_model')
const Order = require('../../model/order_model')
const Razorpay = require("razorpay");

require("dotenv").config();

const Instance = new Razorpay({

  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET_KEY,
  
});

const verifyPayment = async (req,res)=>{
    try {
        console.log('verify payment route reacheddd!!'); 
        const {response,order}=req.body;
        console.log('rbody',req.body);
        const userId = req.session.user._id
        const cartData = await cart.find({user_id:userId})
  
        let hmac=crypto.createHmac('sha256',process.env.RAZORPAY_SECRET_KEY);
        hmac.update(response.razorpay_order_id + '|' + response.razorpay_payment_id);
        hmac=hmac.digest('hex'); 
  
        if(hmac == response.razorpay_signature){
            
            const orderData=await Order.findOne({_id:order.receipt},{products:1});
            console.log('pppp',orderData);
            
            for(const item of orderData.products){
              await Order.findOneAndUpdate(
                { _id: order.receipt, 'products.product_id': item.product_id },
                {
                    $set: {
                        'products.$.productStatus': 'placed',
                        orderStatus: 'placed'
                    }
                }
            );
               
            }
            if(cartData){
            // await decreaseProductQuantity(cartData.products);
            await cart.deleteOne({ user: userId });
            }
            console.log('haiii');
            res.json({statusChanged:true});
        
        }
  
    } catch (error) {
        console.log(error.message);
        res.status(500).render('500');
    }
  }
  

module.exports={
  verifyPayment
}
