const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const { send } = require('process');
const db = require('./db');

const PORT = 8092;

const app = express();

module.exports = app;

app.use(require('body-parser').json());
app.use(cors());
app.use(helmet());

app.options('*', cors());

app.get('/', (request, response) => {
  response.send({'ack': true});
});


// Product search, Search for specific product 
// limit - number of products to return (default: 12)
// brand - filter by brand (default: All brands)
// price - filter by price (default: All price)

// http://localhost:8092/products/search?limit=5&brand=loom&price=25

app.get('/products/search',async(request,response)=>{

  try{
    const query_filter=request.query;
    let brand = '';
    let price = '';
    let limit  = 12;
  
    // get the elements from the url and stack default value if undefined
    if (query_filter.brand !== undefined) { brand = query_filter.brand }
    //string to int
    if (parseInt(query_filter.price) > 0) { price = parseInt(query_filter.price) }
    if (parseInt(query_filter.limit) > 0) { limit = parseInt(query_filter.limit) }
    
    
    //if assigned values, write the respectives match requests
    let match_query = {}
    if( brand === '' &&  price !== '') match_query = {price:{'$lte':price}}
    else if(brand !== '' && price === '') match_query = {brand: brand}
    else if(brand !== '' && price !== '') match_query = {brand: brand, price:{'$lte':price}}
  
    query = [
      {'$match' : match_query},
      {'$sort' : {price:1}}, //by default sort by price
      {'$limit' : limit} //limit number of products 
    ]

    //console.log('Query : ', query);
    
    let new_list_products = await db.aggregate(query)
  
    var data = JSON.stringify({ 
          "limit": limit, 
          "total": new_list_products.length,
          "results": new_list_products},
          null, 2
    );
    
    //response.send({'results': new_list_products});
    response.send(data);
    //response.send(new_list_products);
    

  }
  catch(error)
  {
    response.status(500).send(error);
  }

});



// Products by id
app.get('/products/:id', async (request, response) => {
  //console.log(request.params.id)
  try{
    let product = await db.find_by_id(request.params.id)
    response.send({ "product": product})

  }
  catch(error)
  {
    response.status(500).send(error);
  }
})



// Fetch all products 
app.get('/products', async (request, response) => {
  //console.log(request.params.id)
  try{
    let products= await db.find({});
    response.send(products);

  }
  catch(error)
  {
    response.status(500).send(error);
  }  

});



app.listen(PORT);

console.log(`📡 Running on port ${PORT}`);