'use strict';
const axios = require('axios');

const getResults = async(req, res) => {
    var term = req.params['term'];
    let url = `https://api.mercadolibre.com/sites/MLA/search?q=${term}&limit=4`;
    try {
        let results = await axios.get(url, { params: req.query });
        res.send(transformProducts(results.data.results));
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
        res.send(transformDetails(results.data, description.data));
    } catch (e) {
        res.status(e.response ? e.response.status : 500);
        res.send(e.response ? e.response.data : e.message);
    }
};

function transformDetails(dataItem, dataDescription) {
    let transform = {}

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
    transform.picture = dataItem.picures ? dataItem.picures[0].url : dataItem.thumbnail,
    transform.condition =  dataItem.condition,
    transform.free_shipping = dataItem.shipping.free_shipping,
    transform.sold_quantity =  dataItem.sold_quantity,
    transform.address =  dataItem.seller_address.state.name,
    transform.description = dataDescription.plain_text;

    return transform
  }

  function transformProducts(dataItems) {
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

    transform.items = items;

    return transform;
  }


module.exports = {
    getResults,
    getDetails
};
