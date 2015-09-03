'use strict';

angular.module('stockDogApp')
  .service('QuoteService', function ($http, $interval) {
    var stocks = [];
    var BASE = 'https://query.yahooapis.com/v1/public/yq1';

    // [1] Handles updating stock model with appropriate data from quote
    var update = function(quotes) {
        console.log(quotes);
        if (quotes.length === stocks.length) {
            _.each(quotes, function(quote,idx) {
                var stock = stocks[idx];
                stock.lastPrice = parseFloat(quote.LastTradePriceOnly);
                stock.change = quote.Change;
                stock.percentChange = quote.ChangeinPercent;
                stock.marketValue = stock.shares * stock.lastPrice;
                stock.dayChange = stock.shares * parseFloat(stock.change);
                stock.save();
            });
        }
    };

    // [2] Helper functions for managing which stocks to pull quotes for
    this.register = function(stock){
        stocks.push(stock);
    };
    this.deregister = function(stock){
        _.remove(stocks, stock);
    };
    this.clear = function() {
        stocks = [];
    };

    // [3] Main processing function for communicating with Yahoo Finance API
    this.fetch = function() {
        var symbols = _.reduce(stocks, function(symbols, stock) {
            symbols.push(stock.company.symbol);
            return symbols;
        }, []);
        var symbolString = "('"+ symbols.join(',') + "')";
        var url = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20in%20"+symbolString+"&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys";
        $http.jsonp(url + '&callback=JSON_CALLBACK').success(function(data) {
            if (data.query.count) {
                var quotes = data.query.count > 1 ? data.query.results.quote : [data.query.results.quote];
                update(quotes);
            }
        });
        // .error(function(data) {
            // console.log(data);
        // });
    };

    //[4] Used to fecth new quote data every 5 seconds
    $interval(this.fetch,5000);
  });
