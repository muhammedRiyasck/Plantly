const Category=require('../../model/category_model')

const loadCategory=async(req,res)=>{
    try {

        const category = await Category.find({})  
        const msg=req.flash('msg')      
        res.render('Category' , {category,msg})
    } catch (error) {
        
    }
}

const addCategory=async(req,res)=>{

    try {
        
        const categoryName = req.body.name
        const radio = req.body.radio

        const category = await Category.findOne({name : {$regex: new RegExp('^' + categoryName + '$','i')}})

        if(!category){

            const data = new Category({

                name : categoryName,
                is_Listed : radio

            })

            data.save()

            if(data){
                // res.send({succ:true})
                res.redirect('/admin/category')

            }

    }else{
        req.flash('msg','Category is alredy exists')
        res.redirect('/admin/category')
    }
   
 }
catch (error) {

        console.log(error.message)
}
  
}

const catAction = async(req , res)=>{

    const categoryId = req.body.id

    const findCategory = await Category.findOne({_id:categoryId})
    
    findCategory.Listed = !findCategory.Listed;

    findCate.save()

}

const cateDelete = async(req,res)=>{

 const userId = req.query.userId
 console.log(userId)
 const editCate = await Category.deleteOne({_id:userId})
  
    if(editCate){

        res.send({succ:true})
      
    }


}

const categoryEdit = async (req, res , next) => {
    
    try {

        const idd = req.body.CateID

        const namee = req.body.name

        const category = await Category.findOne({name : {$regex: new RegExp('^' + namee+ '$','i')}})
        if(!category){
            const categoryDataa = await Category.findByIdAndUpdate({ _id: idd }, { $set: { name: namee } });

            categoryDataa.save();
            //  res.send({su : true});
            res.redirect('/admin/category')
        }else{
            req.flash('msg','Category is already exists')
            res.redirect('/admin/category')
        }
    } catch (error) {

        next(error,req,res);
        
    }

};

const valSett = async(req , res)=>{

    try {

        const cId = req.query.id

        const cate = await Category.findOne({_id : cId});

        if(cate){

            res.send({succ : cate})

        }
        
    } catch (error) {

        console.log(error.message);
        
    }

}

module.exports={
    loadCategory,
    addCategory,
    catAction,
    cateDelete,
    categoryEdit,
    valSett

}
