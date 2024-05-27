
const Product = require('../../model/products_model.js')

const Category = require('../../model/category_model.js')

const fs = require("fs");

const path = require("path");

const loadProducts=async(req,res)=>{

    try {

        let products = await Product.find({}).populate('category_id')
        const messages = req.flash('swal')
       
        res.render('Products',{products, messages })

    } catch (error) {

        console.log(error.message)
    }
}

const loadAddProducts = async(req,res)=>{
    try {

        const category = await Category.find({ Listed: true })

       

        res.render('Add_Products',{category})

    } catch (error) {
        console.log(error.message)
    }
}

const addProducts = async(req , res)=>{

    try {

        const {name,price,category_name,stock,radio,discription} = req.body;
       

        
        let img = [];
        const images = req.files;

        // console.log(images);

        images.forEach((file) => {
            
            img.push(file.filename);

        });

       const categoryName = await Category.findOne({name:category_name})
        
        const productData =await Product.create({
            
            name : name,
            category_id : categoryName._id,
            price : price,
            stock:stock,
            images : img,
            status : radio,
            description:discription

        })

        

        if(productData){
           
            req.flash('swal','product added')
            res.redirect('/admin/products')
 
            
        }

        
        
    } catch (error) {

        console.log(error.message);
        
    }

}

const productAction = async(req,res)=>{
    try {
        const productId = req.query.id
        const productData = await Product.findOne({ _id: productId });

        productData.status = !productData.status;

        productData.save();
        
        req.flash('message','succu')
        res.send({set : true});
        

    } catch (error) {
        console.log(error.message)
    }
}

const loadEditProduct = async(req,res)=>{
    try {

        const productId = req.query.id

        const productData = await Product.findOne({_id:productId})

        const currentCategory = await Category.findOne({_id:productData.category_id})

        const category = await Category.find({ Listed: true,_id: { $ne: productData.category} })

        res.render('Edit_product',{productData,category,currentCategory})

    } catch (error) {
        console.log(error.message)
    }
}

const editProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const editProductt = await Product.findOne({ _id: productId });

        const { name, price, stock, discription,category_name } = req.body;

        let category_id
        if(category_name){
            category_id = await Category.findOne({name:category_name},{_id:1})
        }
      

        let imag = [];

        for (let i = 0; i < 3; i++) {
            const key = `k${i}`;

            if (req.body[key]) {
                imag.push(editProductt.images[i]);
            } else {
                imag.push(req.files[`image${i}`][0].filename);
                const imagePath = path.join(__dirname, '../../assets/productImages', editProductt.images[i]);
                
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                } else {
                    console.warn(`File not found: ${imagePath}`);
                }
            }
        }

        editProductt.images = imag;

        await Product.findOneAndUpdate({ _id: productId }, {
            $set: {
                name: name,
                price: price,
                stock: stock,
                category: category_id,
                description: discription
            }
        });

        req.flash('swal', "product eddited");
        await editProductt.save();
        res.redirect("/admin/products");
        console.log('product eddited');
    } catch (error) {
        console.log(error.message);
    }
};

module.exports={
    loadProducts,
    loadAddProducts,
    addProducts,
    productAction,
    loadEditProduct,
    editProduct
}
