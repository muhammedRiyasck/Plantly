const {cart}= require('../../model/CartAndWishlist_model')
const User = require('../../model/user_model')
const Product = require('../../model/products_model')
const Category = require('../../model/category_model')




const loadCart= async(req,res)=>{

    try {
     
        if(req.session.user){

            
            const userId = req.session.user._id
            
            let cartData = await cart.findOne({user_id:userId}).populate('products.product_id')
            let querymessage = req.query.message
            if(cartData){
                    
                const unlistProduct = cartData.products.filter(val => val.product_id.status === false)

                if(unlistProduct){
                 
                    for (const product of unlistProduct){
                        
                      var  UpdatedCartData = await cart.findOneAndUpdate({user_id:userId},{$pull:{products:{product_id:product.product_id._id}}},{new:true})
                   
                    }

                }
                
                 cartData = UpdatedCartData ? UpdatedCartData : cartData

                 let productPrice  = cartData.products.reduce((acc,curr)=>acc + curr.price,0)

                //  if(cartData.coupenDiscount>=0){
                //     price -= cartData.coupenDiscount
                //  }

                await cart.findOneAndUpdate({user_id:userId},{$set:{totalCartPrice:productPrice}},{new:true,upsert:true}).exec();

                const updatedCartData = await cart.findOne({user_id:userId}).populate('products.product_id')

               
                let amount = await cart.findOne({user_id:userId},{totalCartPrice:true})
                
                let taxAmount = Math.round(amount.totalCartPrice*(9/100))

                console.log(taxAmount)

                const message = req.flash('message')
                // console.log(message,'message from controller')

                // console.log(querymessage,'querry ')
                res.render('Cart',{userlogdata : req.session.user,message,cartData:updatedCartData,productPrice,totalAmount:Math.round(productPrice+taxAmount),querymessage})
     

            }else{
                const message = req.flash('message')
                
                return res.render('Cart',{userlogdata : req.session.user,message,querymessage})
            }

        }else{
            console.log("a");
            res.redirect('/login')
            req.flash('message','Please Login. To See Your Cart')
        }

    } catch (error) {
        console.log(error.message)
    }
}

const addToCart = async(req,res)=>{

    try {

        if(req.session.user){

                const productId = req.body.id 
                const quantiyy = req.body.qtyValue || 1
            
                const userId = req.session.user._id

               const cartProduct = await Product.findOne({_id : productId})

               const exist = await cart.findOne({user_id:userId,products:{$elemMatch:{product_id:productId}}})

               if(!exist){

                const total = cartProduct.discount > 0 ? cartProduct.discount_price * quantiyy : cartProduct.price * quantiyy
                
                const addedd = await cart.findOneAndUpdate({ user_id:userId},{$addToSet:{products:{

                    product_id:productId,
                    price:total,
                    quantity:quantiyy

                }}},{new:true,upsert:true});

                if(addedd){

                    res.send({success:true})

                }

                } else {

                    res.send({exist : true})

                }
       
        }else{

            res.send({login:false})
            // req.flash('message','please login first')
            // res.redirect('/login')
           

        }

    } catch (error) {
        console.log(error.message)
    }
}

const removeItem =async(req,res)=>{

    try {  

        const userId = req.session.user._id
        const itemId = req.body.id

        console.log(itemId);
        
        const removeCart = await cart.updateOne({ user_id: userId }, { $pull: { products: { 'product_id': itemId } } });


        const removeItem = await cart.deleteOne({ 'products.product_id._id': itemId })

        console.log(removeCart)

        if(removeItem){

            res.send(true)

        }else{

            console.log('false in cart')
        }

    } catch (error) {
        console.log(error.message)
    }
}

const cartUpdate = async(req,res)=>{

    try {
        
      const productId = req.body.productId;
      const cartId = req.body.cartId
      const quantiy = req.body.quantity
      const Tprice = req.body.price

      const product = await Product.findOne({_id:productId})
     
    //   const updatedPrice= product.price*quantiy
      const updatedPrice = product.discount > 0 ? product.discount_price * quantiy : product.price * quantiy

   
       
      const updatedCart = await cart.findOneAndUpdate({_id:cartId,'products.product_id':productId},
        {
            $set:{
                'products.$.price':updatedPrice,
                'products.$.quantity':quantiy        
            },
        },
        {new:true}
      )

      const totalCartPrice = updatedCart.products.reduce(
        (acc,curr)=>acc+curr.price,0)

        await cart.findOneAndUpdate({_id:cartId},{$set:{totalCartPrice:totalCartPrice}})

        let taxAmount = totalCartPrice*9/100

        res.send({success:totalCartPrice,productPrice:updatedPrice,taxAmount})
      

    } catch (error) {
        
    }

}

const loadWishList = async (req,res)=>{

    try {
        
        if(req.session.user){

            res.render('WishList',{userlogdata:req.session.user})

        }else{
            console.log('plese loggedin')
            res.redirect('/login')

        }

    } catch (error) {
        console.log(error.message)
    }

}

module.exports= {
    loadCart,
    addToCart,
    loadWishList,
    removeItem,
    cartUpdate
}
