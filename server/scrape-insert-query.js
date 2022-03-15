const dedicatedbrand = require('./sources/dedicatedbrand');
const adresseParis = require('./sources/adresseParisbrand');
const montlimart = require('./sources/montlimartbrand');
const loom = require('./sources/loom');
const db = require('./db');

async function sandbox(){
    try{
        let products = [];
        let pages = [
            'https://www.dedicatedbrand.com/en/men/basics',
            'https://www.dedicatedbrand.com/en/men/sale'
        ];

        console.log(`🕵️‍♀️ Browsing ${pages.length} pages from Dedicated.`);

        for(let page of pages) {
            console.log(`🕵️‍♀️ Scraping ${page}.`);

            let results = await dedicatedbrand.scrape(page);

            console.log(`👕 ${results.length} products found.`);
            
            products.push(results);

            console.log('Number of groups of products: ', products.length);
        }

        pages = [
            'https://adresse.paris/630-toute-la-collection'
        ];

        console.log(`🕵️‍♀️ Browsing ${pages.length} pages from Adresse Paris.`);

        for(let page of pages) {
            console.log(`🕵️‍♀️ Scraping ${page}.`);

            let results = await adresseParis.scrape(page);

            console.log(`👕 ${results.length} products found.`);
            
            products.push(results);

            console.log('Number of group of products: ', products.length);
        }

        pages = [
            'https://www.montlimart.com/toute-la-collection.html'
        ];

        console.log(`🕵️‍♀️ Browsing ${pages.length} pages from Montlimart.`);

        for(let page of pages) {
            console.log(`🕵️‍♀️ Scraping ${page}.`);

            let results = await montlimart.scrape(page);

            console.log(`👕 ${results.length} products found.`);
            
            products.push(results);

            console.log('Number of group of products: ', products.length);
        }

        pages = [
            'https://www.loom.fr/collections/hauts',
            'https://www.loom.fr/collections/bas'
          ];

        console.log(`🕵️‍♀️ Browsing ${pages.length} pages from Montlimart.`);

        for(let page of pages) {
            console.log(`🕵️‍♀️ Scraping ${page}.`);

            let results = await loom.scrape(page);

            console.log(`👕 ${results.length} products found.`);
            
            products.push(results);

            console.log('Number of group of products: ', products.length);
        }

        products = products.flat();
        console.log('Total number of products: ', products.length);

        console.log(products);
        
        // ----- Connection to the database -----
        const resultDb = await db.insert(products);

        console.log(`💽 ${resultDb.insertedCount} inserted products.`);

        // ----- Retrieve products of a certain brand -----

        let brand = 'dedicated';

        console.log(`💽  Find ${brand} products only`);
        
        let brandOnly = await db.find({'brand': brand});
        
        console.log(`👕 ${brandOnly.length} total of products found for ${brand}`);
        
        //console.log(brandOnly);

        brand = 'adresseparis';

        console.log(`💽  Find ${brand} products only`);
        
        brandOnly = await db.find({'brand': brand});
        
        console.log(`👕 ${brandOnly.length} total of products found for ${brand}`);
        
        //console.log(brandOnly);

        brand = 'montlimart';

        console.log(`💽  Find ${brand} products only`);
        
        brandOnly = await db.find({'brand': brand});
        
        console.log(`👕 ${brandOnly.length} total of products found for ${brand}`);
        
        //console.log(brandOnly);

        // ----- Retrieve products under a certain price ------
        let price = 30;

        console.log(`💽 Find products under ${price} only`);

        let underPrice = await db.find({'price' : {'$lte' : price}});
        //let underPrice = await db.find({'price' : 39});

        console.log(`👕 ${underPrice.length} products under ${price} (e).`)

        //console.log(underPrice);

        // ----- Retrieve all products sorted by price -----
        let order = 1;

        console.log(`💽 All products sorted (${order})`);

        let sortByPrice = await db.aggregate([{$sort : {price : order}}]);

        console.log(`👕 ${sortByPrice.length} products sorted.`);

        //console.log(sortByPrice);

        db.close();


    } catch(e){
        //console.log(e);
        console.error(e);
    }
}

sandbox();