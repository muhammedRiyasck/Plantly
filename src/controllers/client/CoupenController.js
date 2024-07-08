const Address = require("../../model/address_model");

//  Import User Modal :-
const User = require("../../model/user_model");

//  Import Product Modal :-
const Product = require("../../model/products_model");

//  Import Category Modal :-
const Category = require("../../model/category_model");

//  Import Order Modal :-
const Order = require("../../model/order_model");

//  Import Cart Modal :-
const Cart = require("../../model/CartAndWishlist_model");

//  Import Wallet Model :-
const Wallet = require("../../model/wallet_model");

//  Coupen Modal :-
const Coupen = require('../../model/coupen_model');

const loadCoupen = async (req, res , next) => {
    
    try {
        
        const categoryData = await Category.find({ is_Listed: true });

        if (req.session.user) {

            const msg = req.flash('flash')

            const coupenData = await Coupen.find({ status: true });
            
            res.render("Coupen", { userlogdata: req.session.user, categoryData, coupenData, msgg: msg });

        } else {

            res.redirect('/login');

        }
        
    } catch (error) {

        next(error,req,res);

        
    }

};

const coupenCheck = async (req, res , next) => {
    
    try {

        const inpValue = req.body.inpVal

        const checkCoupen = await Coupen.findOne({ coupen_id: inpValue });

        if (checkCoupen) {
            
            res.send({ succ: true })

        } else {

            res.send({ fail: true })

        }

    } catch (error) {

        next(error,req,res);

        
    }

};

module.exports={
    loadCoupen,
    coupenCheck
}
