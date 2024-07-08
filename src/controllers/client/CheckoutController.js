const {wishlist,cart}= require('../../model/CartAndWishlist_model')
const Product = require('../../model/products_model')
const Category = require('../../model/category_model')
const Address = require('../../model/address_model')
const Wallet = require('../../model/wallet_model')
const User = require('../../model/user_model')


const loadChekout = async(req,res)=>{
    try {
        if(req.session.user){
            const userId = req.session.user._id
            const cartData = await cart.findOne({user_id:userId}).populate('products.product_id')

            const userData = await User.findOne({_id:userId})
   
            if(cartData.products.length>=1){
            
                let amount = await cart.findOne({user_id:userId},{totalCartPrice:true})
                let taxAmount =Math.round(amount.totalCartPrice*(9/100))
                let totalAmount = Math.round(amount.totalCartPrice+taxAmount)
                

            const address = await Address.findOne({user_id:userId})
            // console.log(address,'undo?')
            const message = req.flash('flash')
            // console.log(address.addressData.length,'length from backend')
            res.render('Checkout',{userlogdata:req.session.user,address,userId,message,cartData,taxAmount,totalAmount,userData})

            }else{
                req.flash('message','please add product to cart')
                res.redirect('/cart')
            }
        }else{
            req.flash('message','please login first. to go chekout')
            res.redirect('/login')
        }
    } catch (error) {
        console.log(error.message)
    }
}

const checkWalletAmount=async(req,res)=>{
    try {
        
        if(req.session.user){
        let userWallet= await Wallet.findOne({user_id:req.session.user_id})
            console.log(userWallet.balance)
        }else{
            console.log('please login for check the wallet amount')
        }
    } catch (error) {
        
    }
}

module.exports={
    loadChekout,
    checkWalletAmount
}
