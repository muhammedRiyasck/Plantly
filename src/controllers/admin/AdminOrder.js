
//  Impoert Order Modal :-
const Order = require('../../model/order_model');



const loadOrders = async (req, res , next) => {
    
    try {
        
       

        const totaluserCount = await Order.countDocuments()
        

        const orderData = await Order.find().populate('products.product_id')
        
        res.render('Orderslist', {  orderData });
        
    } catch (error) {

        console.log(error.message)

    }

};

//  ordersDetails (Post Method) :-

const loadOrdersDetails = async (req, res , next) => {
    
    try {

        const orderId = req.query.id

        const orderDetails = await Order.findOne({ _id: orderId }).populate('products.product_id user_id');

        res.render("OrderDetails", { orderDetails, orderId });
        
    } catch (error) {

        next(error,req,res);
        
    }

};



// const updateOrderStatus = async (orderId) => {

//     try {
      
//         const order = await Order.findById(orderId);
        
//         const orderProStatusValues = order.products.map(
    
//             (item) => item.orderProStatus
            
//         );
        
//         let newOrderStatus;
        
//         if (orderProStatusValues.every((status) => status === "delivered")) {
        
//             newOrderStatus = "delivered";
            
//         } else if (orderProStatusValues.every((status) => status === "shipped")) {
            
//             newOrderStatus = "shipped";
            
//         } else if (orderProStatusValues.every((status) => status === "canceled")) {
            
//             newOrderStatus = "canceled";
            
//         } else {
            
//             newOrderStatus = "pending";
            
//         }

//         order.orderStatus = newOrderStatus;
        
//         await order.save();
        
//     } catch (err) {
        
//         console.log(err.message + " updateOrderStatus");
        
//     }
    
// };

//  orderDetails Handling (Put Method) :-

const orderProductStatus = async (req, res , next) => { 

    try {
            
        const orderId = req.body.orderId
        const productId = req.body.productId
        const bodyValue = req.body.val
      
        await Order.findOneAndUpdate(
    
            { _id: orderId, "products.product_id" : productId },

            { $set: { "products.$.orderStatus": bodyValue } }
      
        );
        
        // updateOrderStatus(orderId);
        
        res.json({ success: true });
        
    } catch (error) {
        
        next(error, req, res);
    }
    
};

//  Return Managing Admin :-



module.exports = {

    loadOrders,
    loadOrdersDetails,
    orderProductStatus,

    
};
