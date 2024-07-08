const category_model = require('../../model/category_model')
const Product = require('../../model/products_model')
const Category = require('../../model/category_model')


const loadShop = async (req, res) => {

    try {
        const query = { status: true };

        const [productData, count] = await Promise.all([
          Product.find(query).populate('category_id').exec(),
          Product.countDocuments(query).exec()
        ]);        
        const category = await Category.find({ Listed: true })

        const categoryCounts = await Product.aggregate([
            { $match: query },
            { $group: { _id: '$category_id', count: { $sum: 1 } } },
            { $lookup: {
                from: 'categories', // The name of the categories collection
                localField: '_id',
                foreignField: '_id',
                as: 'category'
            }},
            { $unwind: '$category' },
            { $project: { _id: 0, categoryId: '$_id', categoryName: '$category.name', count: 1 } }
        ]).exec();

        // Map category counts for easier access in the front end
        const categoryCountMap = categoryCounts.reduce((map, obj) => {
            map[obj.categoryId] = obj.count;
            return map;
        }, {});
             
            
         

        if (req.session.user) {
            res.render('Shop', { userlogdata: req.session.user, productData, category, count,categoryCountMap })
        } else {
            res.render('Shop', { productData, category,count,categoryCountMap })
        }
    } catch (error) {
        console.log(error.message)
    }
}

const sortAndFilter = async (req, res) => {

    try {
        const { sortby, Price, } = req.body;

        if (sortby && Price) {
            const sortedByPrice = await Product.find({ status: true }).sort({ price: sortby })
            res.send(sortedByPrice)
        }
        else if (sortby) {
            const sortedByName = await Product.find({ status: true }).sort({ name: sortby })
            console.log(sortby, sortedByName, 'kittin')
            res.send(sortedByName);
        } else {
            const products = await Product.find()
            res.send(products)

        }
    } catch (error) {
        // next(error,req,res);
        console.log(error.meassage);


    }

};

const search = async (req, res) => {
    try {
        const { categoryVal, searchQuery, max, min, selectedSort } = req.body
        let sortCriteria = {};
        let aAzZ = null
        let zZaA = null
        let LowToHigh = null
        let HighToLow = null
        if (selectedSort === 'AtoZ') {
            sortCriteria = { name: 1 };
            aAzZ = await Product.find().sort(sortCriteria)
        } else if (selectedSort === 'ZtoA') {
            sortCriteria = { name: -1 };
            zZaA = await Product.find().sort(sortCriteria)
        } else if (selectedSort === 'LowToHigh') {
            sortCriteria = { price: 1 };
            LowToHigh = await Product.find().sort(sortCriteria)
        } else if (selectedSort === 'HighToLow') {
            sortCriteria = { price: -1 };
            HighToLow = await Product.find().sort(sortCriteria)
        }
        if (!categoryVal.length == 0 && searchQuery) {
            const search = new RegExp(`.*${searchQuery}.*`, 'i');

            const productData = await Product.find({
                'category_id': { $in: categoryVal },
                status: true,
                $or: [
                    { name: search },
                    { price: Number(searchQuery) || undefined },
                ],
            }).sort(sortCriteria)

            return res.send(productData)
        }
        else if (!categoryVal.length == 0) {
            if (max) {
                const productData = await Product.find({ 'category_id': { $in: categoryVal }, status: true, price: { $gte: min, $lte: max } }).sort(sortCriteria)
                res.send(productData)
            }
            const productData = await Product.find({ 'category_id': { $in: categoryVal }, status: true }).sort(sortCriteria)
            return res.send(productData)
        } else if (max) {
            const sortbyrange = await Product.find({ price: { $gte: min, $lte: max } }).sort(sortCriteria)
            res.send(sortbyrange)
        }
        else {
            const search = new RegExp(`.*${searchQuery}.*`, 'i');
            const searchProduct = await Product.find({ $and: [{ $or: [{ name: { $regex: search } },] }, { status: true }] }).sort(sortCriteria)
            if (searchProduct.length > 0) {
                res.send(searchProduct)
            } else if (aAzZ) {
                return res.send(aAzZ)
            } else if (zZaA) {
                return res.send(zZaA)
            } else if (LowToHigh) {
                return res.send(LowToHigh)
            } else if (HighToLow) {
                return res.send(HighToLow)
            } else if (typeof Number(searchQuery) === 'number' && !isNaN(searchQuery)) {
                const price = await Product.find({ price: Number(searchQuery) })
                res.send(price)
            } else {
                res.status(400).json([]); // Respond with an empty array if no products found
            }
        }
    } catch (error) {
        console.log(error.message)
    }
}

module.exports = {
    loadShop,
    sortAndFilter,
    search
}
