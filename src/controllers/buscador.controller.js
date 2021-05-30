'use strict';
const axios = require('axios');

const getResults = async(req, res) => {
    var term = req.params['term'];
    let url = `https://api.mercadolibre.com/sites/MLA/search?q=${term}&limit=4`;
    try {
        let results = await axios.get(url, { params: req.query });
        let arrayCategories = []

        //return all categories in array
        if(results.data.results.length) {
            results.data.results.forEach(cat => {
                arrayCategories.push(cat.category_id)
            })

            let mostRepeted = mostFrequent(arrayCategories, arrayCategories.length);
            let urlCategories = `https://api.mercadolibre.com/categories/${mostRepeted}`;
            let categories = await axios.get(urlCategories, { params: req.query });

            res.send(transformProducts(results.data.results, categories.data));
        } else {
            res.send(transformProducts(results.data.results));
        }

    } catch (e) {
        res.status(e.response ? e.response.status : 500);
        res.send(e.response ? e.response.data : e.message);
    }
};

const getDetails = async(req, res) => {
    var id = req.params['id'];
    let url = `https://api.mercadolibre.com/items/${id}`;
    let urlDescription = `https://api.mercadolibre.com/items/${id}/description`;
    try {
        let results = await axios.get(url, { params: req.query });
        let description = await axios.get(urlDescription, { params: req.query });
        let urlCategories = `https://api.mercadolibre.com/categories/${results.data.category_id}`;
        let categories = await axios.get(urlCategories, { params: req.query });
        res.send(transformDetails(results.data, description.data, categories.data));
    } catch (e) {
        res.status(e.response ? e.response.status : 500);
        res.send(e.response ? e.response.data : e.message);
    }
};

function transformDetails(dataItem, dataDescription, dataCategories) {
    let transform = {}
    let categoriesArray = []

    transform.author = {
        name: 'Joel',
        lastname: 'Acef'
    },
    transform.item = {
        id: dataItem.id,
        title: dataItem.title,
        price: {
            currency: dataItem.currency_id,
            amount: dataItem.price,
        }
    } 
    transform.picture = dataItem.pictures ? dataItem.pictures[0].url : dataItem.thumbnail,
    transform.condition =  dataItem.condition,
    transform.free_shipping = dataItem.shipping.free_shipping,
    transform.sold_quantity =  dataItem.sold_quantity,
    transform.address =  dataItem.seller_address.state.name,
    transform.description = dataDescription.plain_text;
    
    dataCategories.path_from_root.forEach(category => {
        categoriesArray.push(category.name)
    })

    transform.categories = categoriesArray;

    return transform
  }

  function transformProducts(dataItems, dataCategories) {
    let transform = {}
    let items = [];

    transform.author = {
        name: 'Joel',
        lastname: 'Acef',
    },

    dataItems.forEach(dataItem => {
        let item = {}
        
        item.id = dataItem.id,
        item.title = dataItem.title,
        item.price = {
            currency: dataItem.currency_id,
            amount: dataItem.price,
        },
        item.picture= dataItem.thumbnail,
        item.condition= dataItem.condition,
        item.free_shipping= dataItem.shipping.free_shipping,
        item.sold_quantity= dataItem.sold_quantity
        item.address =  dataItem.seller_address.state.name,

        items.push(item)
    })

    if(dataCategories){
        let arrayCategories = [];

        dataCategories.path_from_root.forEach(category => {
            arrayCategories.push(category.name)
        })
    
        transform.categories = arrayCategories;
    }

    transform.items = items;

    return transform;
  }

function mostFrequent(arr, length) {
    var hash = new Map();
    for (var i = 0; i < length; i++) {
        if(hash.has(arr[i]))
            hash.set(arr[i], hash.get(arr[i])+1)
        else
            hash.set(arr[i], 1)
    }

    var max_count = 0, res = -1;
    hash.forEach((value,key) => {
        if (max_count < value) {
            res = key;
            max_count = value;
        }
 
    });
 
    return res;
}


module.exports = {
    getResults,
    getDetails
};
