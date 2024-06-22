const category_model = require('../../model/category_model')
const Product = require('../../model/products_model')
const Category = require('../../model/category_model')


const loadShop=async(req,res)=>{

    try{

        const productData = await Product.find({status:true}).populate('category_id')
        const category = await Category.find({Listed:true})
        console.log(category)
        if(req.session.user){

            res.render('Shop' , {userlogdata : req.session.user,productData,category})


        } else {

            res.render('Shop',{productData,category})

        }


    }catch(error){

        console.log(error.message)

    }
}

const sortAndFilter = async (req, res ) => {
    
    try {
        


        const { sortby,Price,min,max,categoryVal } = req.body;
        
        console.log(categoryVal,'kittn')
        if(categoryVal){
            const productData = await Product.find({'category_id':{$in:categoryVal}})
            console.log(productData,'nott')
            res.send(productData)
        }
        if (sortby && Price){
            const sortedByPrice = await Product.find({ status: true }).sort({ price : sortby })
            res.send(sortedByPrice)
        }
        
        if (sortby) {   
            const sortedByName = await Product.find({ status: true }).sort({ name: sortby })
            res.send(sortedByName);
        }
              
        if(max){

            const sortbyrange = await Product.find({ price: { $gte: min, $lte: max } }).sort({price:1})
            res.send(sortbyrange)
         }else{
             const products = await Product.find()
             res.send(products)
            }
        
        
     
        
    } catch (error) {

        // next(error,req,res);

        console.log(error.meassage);

        
    }

};

const search = async(req,res)=>{
    try {
        const searchQuery = req.body.searchQuery
        const search = new RegExp(`.*${searchQuery}.*`, 'i');
           
            const searchProduct = await Product.find({ $and: [{ $or: [{ name: { $regex: search } }, { description: { $regex: search } }] }, { status: true }] })
            if(searchProduct.length>0){
                res.send(searchProduct)
           }
           else if(typeof Number(searchQuery) === 'number' && !isNaN(searchQuery)){
                const price = await Product.find({price:Number(searchQuery)})
                res.send(price)
           }
           else {
            res.status(400).json([]); // Respond with an empty array if no products found
          }
         
        
    } catch (error) {
        console.log(error.message)
    }
}

module.exports={
    loadShop,
    sortAndFilter,
    search
}
