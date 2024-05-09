const Category=require('../../model/category_model')

const loadCategory=async(req,res)=>{
    try {

        const cate = await Category.find({})        
        res.render('Category' , {cate})
    } catch (error) {
        
    }
}

const addCategory=async(req,res)=>{

    try {
        
        const cateName = req.body.name
        const radio = req.body.radio
        if(cateName && radio){

            const data = new Category({

                name : cateName,
                is_Listed : radio

            })

            data.save()

            if(data){

                res.redirect('/admin/category')

            }
        }

    } catch (error) {

        
    }
}

const catAction = async(req , res)=>{

    const cateId=req.body.id

    const findCate=await Category.findOne({_id:cateId})

    findCate.is_Listed = !findCate.is_Listed;

    findCate.save()

    res.send({suc : true})

}

const cateDelete = async(req,res)=>{

 const user = req.body.user
 const deleteCate = await Category.deleteOne({_id:user})
    if(true){
        res.redirect('/admin/category')
    }
}

module.exports={
    loadCategory,
    addCategory,
    catAction,
    cateDelete

}
