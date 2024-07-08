
//  Impoert Order Modal :-
const Order = require('../../model/order_model');



const loadOrders = async (req, res , next) => {
    
    try {
        
       

        const totaluserCount = await Order.countDocuments()
        

        const orderData = await Order.find({  $and: [
            { orderStatus: { $ne: 'pending' } },
            { orderAmount: { $gt: 0 } }
        ]}).populate('products.product_id')
        
        res.render('Orderslist', {  orderData });
        
    } catch (error) {

        console.log(error.message)

    }

};

//  ordersDetails (Post Method) :-

const loadOrdersDetails = async (req, res , next) => {
    
    try {

        const orderId = req.query.id

        const orderDetails = await Order.findOne({ _id: orderId}).populate('products.product_id user_id');

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
    
            { order_Id: orderId, "products.product_id" : productId },

            { $set: { "products.$.productStatus": bodyValue } }
      
        );
        
        // updateOrderStatus(orderId);
        
        res.json({ success: true });
        
    } catch (error) {
        
        next(error, req, res);
    }
    
};

//  Return Managing Admin :-

const returnManage = async (req, res , next) => {

    try {

        const ordId = req.query.id      // Order Id
        const proIdd = req.query.proId  // Order Pro Main Id
        console.log('haiaiaiaiaiiaiaiaiaiaiaiaiaiaiiaiiaiaiaiaiaiiaaiaiaaia')
        await Order.findOneAndUpdate(
            
            { _id: ordId, "products._id": proIdd },
            
            { $set: { "products.$.productStatus": "returned" } },
            
            { new: true }
        );
        console.log('haiaiaiaiaiiaiaiaiaiaiaiaiaiaiiaiiaiaiaiaiaiiaaiaiaaia')

        //  Find Single Product And Other Things :-
        
    //     const findOrder = await Order.findOne(
        
    //         {
    //             _id: ordId,
    //             "products._id": proIdd,
    //             "products.retruned": true,
    //         },

    //         { "products.$": 1, user_id: 1, orderAmount: 1 }
          
    //     );

    //     if (findOrder) {
            
    //         //  There is Stock Menaging :-

    //         const ProIdd = findOrder.products[0].product_id; //  Find ProId

    //         const findStock = findOrder.products[0].quantity;   //  Find Quantity

    //         await Product.findOneAndUpdate(
            
                        
    //             { _id: ProIdd },

    //             { $inc: { stock: findStock } },

    //             { new: true }

    //         );

    //         //  Money Managing :-
      
    //         let moneyDecreses = findOrder.products[0].price;
      
    //         //  There Is If Coupen Used Product Came (Menaging) :-
            
    //         if (findOrder.percentage >= 1) {

    //             let newVal = Math.floor((findOrder.orderAmount) - (moneyDecreses - (moneyDecreses * findOrder.percentage / 100)));
                
    //             await Order.findOneAndUpdate({ _id: ordId, 'products._id': proIdd }, { $set: { orderAmount: newVal } });

    //         } else {

    //             await Order.findOneAndUpdate({ _id: ordId, "products._id": proIdd }, { $inc: { orderAmount: -moneyDecreses } });
    //         }

    //         if (findOrder.products[0].retruned && ordId.peyment !== 'Cash on Delivery') {

    //             if (findOrder.percentage >= 1) {
                    
    //                 let newVall = Math.floor((moneyDecreses - (moneyDecreses * findOrder.percentage / 100)));
                     
    //                 await Wallet.findOneAndUpdate({ userId: findOrder.userId }, { $inc: { balance: newVall }, $push: { transaction: { amount: newVall, creditOrDebit: 'credit' } } }, { new: true, upsert: true });

    //             } else {

    //                 await Wallet.findOneAndUpdate({ userId: findOrder.userId }, { $inc: { balance: moneyDecreses }, $push: { transaction: { amount: moneyDecreses, creditOrDebit: 'credit' } } }, { new: true, upsert: true });

    //             }
                
    //         }
                        
    //     };
 
    // } catch (error) {

    //     next(error,req,res);
    } catch(error){
        
    }

};



module.exports = {

    loadOrders,
    loadOrdersDetails,
    orderProductStatus,
    returnManage
    
};
