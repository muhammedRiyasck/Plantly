
//  Impoert Order Modal :-
const Order = require('../../model/order_model');
const products_model = require('../../model/products_model');
const wallet_model = require('../../model/wallet_model');



const loadOrders = async (req, res , next) => {
    
    try {
        
        let page = parseInt(req.query.page)||1
        let limit = 5
        let skip = (page-1)*limit
        const [orderData,orderCount]= await Promise.all([
            Order.find({  $and: [
                { orderStatus: { $ne: 'pending' } },
                { orderAmount: { $gt: 0 } }
            ]}).populate('products.product_id').skip(skip).limit(limit),
            Order.countDocuments()
        ])
        let totalPages = orderCount/limit
        res.render('Orderslist', { 
            orderData,
            totalPages,
            currentPage:page,
            skip
         });
        
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
        const proIdd = req.query.proId 
        const userId=req.query.userId // Order Pro Main Id
       
        const order=await Order.findOneAndUpdate(
            
            { _id: ordId, "products.product_id": proIdd },
            
            { $set: { "products.$.productStatus": "returned" ,"products.$.retruned":true} },
            
            { new: true }
        );
        let cancelOrder = order
        let totalOrder = order
        let Price // Product Price
        let updatePrice
        let updateTax

        if (cancelOrder) {
  
            var Quantity = cancelOrder.products[0].quantity;     //  Find Pro Quantity
    
            await products_model.findOneAndUpdate({_id: proIdd }, { $inc: { stock: Quantity } });

            //  Manage The Money :-

            Price = Number(cancelOrder.products[0].price-((cancelOrder.products[0].price*cancelOrder.percentage)/100))

           updateTax=0
           console.log(updateTax,Price)

           updatePrice=Price+updateTax;
           updatePrice=totalOrder.orderAmount-updatePrice<0?0:totalOrder.orderAmount-updatePrice

            console.log(updatePrice,'enthaaaaa avasthaa')

            // if(totalOrder.products.length>1){  

                await Order.findOneAndUpdate({ order_Id: ordId, 'products.product_id': proIdd }, { $set: { orderAmount:updatePrice } });
                
            // }else{
                
            //     await Order.findOneAndUpdate({ order_Id: ordId, 'products.product_id': proId }, { $set: { orderAmount:0 } });

            //  }

        }
      

              const wal=  await wallet_model.findOneAndUpdate({ user_id: userId },
                
                    {
                        $inc: { balance: Price },
                        $push: { transaction: { amount: Price, creditOrDebit: 'credit' } }
                    },
                    
                    { new: true, upsert: true }
                
                );
                console.log(wal);


            res.send({ succ: true });

     
        console.log('returned ')

     
    } catch(error){
        next(error)
    }

};



module.exports = {

    loadOrders,
    loadOrdersDetails,
    orderProductStatus,
    returnManage
    
};
