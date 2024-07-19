const Product = require('../../model/products_model')
const Order = require('../../model/order_model')

const loadDashboard = async(req,res,next)=>{
    try {
        
        const orderData = await Order.find({  $and: [
            { orderStatus: { $ne: 'pending' } },
            { orderAmount: { $gt: 0 } }
        ]}).populate('products.product_id')

        const totalOrderAmount = orderData.reduce((acc,val)=>acc + val.orderAmount,0)
        // const overallDiscount = orderData.reduce((acc,val)=>acc+val.)
        res.render('Dashboard',{totalOrderAmount,orderData})
    } catch (error) {
        next(error)
    }
}

module.exports={
    loadDashboard
}
