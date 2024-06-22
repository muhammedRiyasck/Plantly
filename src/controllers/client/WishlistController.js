const {wishlist}= require('../../model/CartAndWishlist_model')
const Product = require('../../model/products_model')
const Category = require('../../model/category_model')

const loadWishList = async(req,res)=>{
    try {
        if(req.session.user){

            res.render('WishList')

        }else{
            res.redirect('/login')
        }
    } catch (error) {
        console.log(error.message)
    }
}


module.exports={
    loadWishList
}
