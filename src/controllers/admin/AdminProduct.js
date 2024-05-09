

const loadProducts=async(req,res)=>{
    try {
        res.render('Add_Products')
    } catch (error) {
        console.log(error.message)
    }
}

module.exports={
    loadProducts
}
