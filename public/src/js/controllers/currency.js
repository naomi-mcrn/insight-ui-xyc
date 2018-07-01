'use strict';

angular.module('insight.currency').controller('CurrencyController',
  function($scope, $rootScope, Currency) {
    $rootScope.currency.symbol = defaultCurrency;

    var _roundFloat = function(x, n) {
      if(!parseInt(n, 10) || !parseFloat(x)) n = 0;

      return Math.round(x * Math.pow(10, n)) / Math.pow(10, n);
    };

    var _commaDelimit = function(str) {
        var delimiter = '.';
        var splitedNum = String(str).toString().split(delimiter); 
        if(splitedNum[1] !== undefined){
          return splitedNum[0].replace(/(\d)(?=(\d{3})+$)/g , '$1,') + delimiter + splitedNum[1];
        }else{
          return splitedNum[0].replace(/(\d)(?=(\d{3})+$)/g , '$1,');
        }
    };

    $rootScope.currency.getConvertion = function(value) {
      value = value * 1; // Convert to number
      isminus = false;
      if(value < 0){
        isminus = true;
        value = Math.abs(value);
      }

      if (!isNaN(value) && typeof value !== 'undefined' && value !== null) {
        if (value === 0.00000000) return '0 ' + this.symbol; // fix value to show

        var response;

        if (this.symbol === 'USD') {
          response = _roundFloat((value * this.factor), 2);
        } else if (this.symbol === 'mXYC') {
          this.factor = 1000000000;
          response = _roundFloat((value * this.factor), 5);
        } else if (this.symbol === 'bits') {
          this.factor = 1000000;
          response = _roundFloat((value * this.factor), 2);
        } else { // assumes symbol is XYC
          this.factor = 1000000;
          response = _roundFloat((value * this.factor), 8);
        }
        // prevent sci notation
        if (response < 1e-7) response=response.toFixed(8);

        if(isminus){
          return _commaDelimit(response) + ' ' + this.symbol;
        }else{
          return '- ' + _commaDelimit(response) + ' ' + this.symbol;
        }
      }

      return 'value error';
    };

    $rootScope.currency.getSignConvertion = function(value) {
      value = value * 1; // Convert to number
      isminus = false;
      if(value < 0){
        isminus = true;
        value = Math.abs(value);
      }

      if (!isNaN(value) && typeof value !== 'undefined' && value !== null) {
        if (value === 0.00000000) return '0 ' + this.symbol; // fix value to show

        var response;

        if (this.symbol === 'USD') {
          response = _roundFloat((value * this.factor), 2);
        } else if (this.symbol === 'mXYC') {
          this.factor = 1000000000;
          response = _roundFloat((value * this.factor), 5);
        } else if (this.symbol === 'bits') {
          this.factor = 1000000;
          response = _roundFloat((value * this.factor), 2);
        } else { // assumes symbol is XYC
          this.factor = 1000000;
          response = _roundFloat((value * this.factor), 8);
        }
        // prevent sci notation
        if (response < 1e-7) response=response.toFixed(8);

        if(!isminus){
          return '+ ' + _commaDelimit(response) + ' ' + this.symbol;
        }else{
          return '- ' + _commaDelimit(response) + ' ' + this.symbol;
        }
      }

      return 'value error';
    };

    $scope.setCurrency = function(currency) {
      $rootScope.currency.symbol = currency;
      localStorage.setItem('insight-currency', currency);

      if (currency === 'USD') {
        Currency.get({}, function(res) {
          $rootScope.currency.factor = $rootScope.currency.bitstamp = res.data.bitstamp;
        });
      } else if (currency === 'mXYC') {
        $rootScope.currency.factor = 1000000000;
      } else if (currency === 'bits') {
        $rootScope.currency.factor = 1000000;
      } else {
        $rootScope.currency.factor = 1000000;
      }
    };

    // Get initial value
    Currency.get({}, function(res) {
      $rootScope.currency.factor = $rootScope.currency.bitstamp = res.data.bitstamp;
    });

  });
