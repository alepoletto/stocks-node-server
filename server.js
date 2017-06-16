const express = require('express');
const path = require('path');
const http = require('http');
const _ = require('lodash');
const requestify = require('requestify');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get('/api/stocks', (req,res) => {
  http.get('http://finance.google.com/finance/info?client=ig&q=CYRE3', (resp) => {
    let body = '';
    resp.on('data', function (chunk) {
      body += chunk;
    });
    resp.on('end', function () {
      body = _.replace(body,'//', '');
      console.log(body);
      res.write(body);
      res.end();
    });
  })
});


app.get('/api/stocks2', (req,res) => {
  let stocks = [];
  requestify.get('http://finance.yahoo.com/d/quotes.csv?s=CYRE3.sa,PETR4.sa,GOLL4.sa&f=l1',{redirect: true}).then((resp) => {
    let body = resp.body;
    let prices = _.split(body, "\n");
    stocks.push({
      id: 1,
      name: 'CYRE3',
      price: prices[0]
    });
    stocks.push({
      id: 2,
      name: 'PETR4',
      price: prices[1]
    });
    stocks.push({
      id: 2,
      name: 'GOLL4',
      price: prices[2]
    });

    res.write(JSON.stringify(stocks));
    res.end();
    });
  });

app.listen(process.env.PORT || 3050, () => console.log('Listening'))
