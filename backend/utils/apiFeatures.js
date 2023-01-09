class ApiFeatures {
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr
    }
    search() {
        const keyword = this.queryStr.keyword ? { // ternary operator
            name: {
                $regex: this.queryStr.keyword,
                $options: 'i' // case insensitive
            }
        } :{}
        console.log("Keyword:",keyword) //output Keyword: { name: { '$regex': 'SanDisk', '$options': 'i' } }

        this.query = this.query.find({ ...keyword })
        console.log("this.query: ",this.query);
        console.log("this.queryStr:",this.queryStr); //  queryStr: { keyword: 'SanDisk' }
        return this;
       
    }

 // filtering   
    filter() {
        const queryCopy = { ...this.queryStr }

        // removing fileds from query
        const removeFileld = ['keyword', 'limit', 'page']
        removeFileld.forEach(el => delete queryCopy[el])
        
        console.log(queryCopy)
        // advance filter for price, rating etc
        let queryStr = JSON.stringify(queryCopy)
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, match => `$${match}`)

        console.log(queryStr)
        this.query = this.query.find(JSON.parse(queryStr))
        return this
    }
// Pagination
    pagination(resPerPage) {
        const currentPage = Number(this.queryStr.page) || 1;
        const skip = resPerPage * (currentPage - 1)
        this.query = this.query.limit(resPerPage).skip(skip)

        return this;
    }
}
module.exports = ApiFeatures;