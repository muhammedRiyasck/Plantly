const mongoose = require('mongoose')
const Address = require('../../model/address_model')
const User = require('../../model/user_model')
const Product = require('../../model/products_model')
const Order = require('../../model/order_model')
const { cart } = require('../../model/CartAndWishlist_model')
const flash = require('express-flash')

const loadOrders = async (req, res) => {
    try {
        if (req.session.user) {
            const addressData = await Address.findOne({ user_id: req.session.user._id })
            const orderedData = await Order.find({ user_id: req.session.user._id }).populate('products.product_id')
            res.render('Orderslist', { userlogdata: req.session.user, addressData, orderedData })
        } else {
            req.flash('message', 'please login to see your orders')
            res.redirect('/login')
        }
    } catch (error) {
        console.log(error.message)
    }
}

const loadOrderDetail = async (req, res) => {
    try {
        const order = await Order.findOne({ _id: req.query.id }).populate('products.product_id')
        res.render('OrderDetails', { userlogdata: req.session.user, order })
    } catch (error) {
        console.log(error.message)
    }
}

const setOrders = async (req, res) => {
    try {
        const userId = req.session.user._id;
        const addressId = req.body.selectedAddressId

        if (!userId) {
            return res.redirect('/login');
        }

        const cartData = await cart.findOne({ user_id: userId });
        const totalAmount = Number(req.body.amount);
        const result = await Address.aggregate([
            { $unwind: "$addressData" },
            { $match: { "addressData._id": new mongoose.Types.ObjectId(addressId) } },
            { $replaceRoot: { newRoot: "$addressData" } }
        ]);
       
        //backend address checking
        if (!result) {
            return res.send(false)
        }


        const { name, phone, address, pincode, locality, state, city } = result[0];

        const orderedData = await Order.create({
            user_id: userId,
            products: cartData.products,
            deliveryAddress: {
                name, phone, address, locality, city, state, pincode
            },
            orderDate: Date.now(),
            orderAmount: totalAmount,
            payment: 'COD'
        });

        req.session.order = orderedData;

        if (orderedData) {
            for (const elem of orderedData.products) {
                const product = await Product.findOne({ _id: elem.product_id });
                const newStock = product.stock - elem.quantity;

                await Product.findOneAndUpdate({ _id: elem.product_id }, { $set: { stock: newStock } });
            }

            await cart.updateOne({ user_id: userId }, { $unset: { products: 1 }, $set: { totalCartPrice: 0 } });

            return res.status(200).json({ message: 'Order placed successfully' });
        } else {
            console.log('Order creation failed');
            return res.redirect('/checkout');
        }
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

const loadThanks = async (req, res, next) => {

    try {

        if (req.session.user && req.session.order) {


            res.render("Success", { login: req.session.user, categoryData });

        } else {

            res.redirect('/')

        }

    } catch (error) {

        next(error, req, res);


    }

};

module.exports = {
    loadOrders,
    loadOrderDetail,
    setOrders,
    loadThanks
}
