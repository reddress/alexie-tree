"use strict";

function formatMoney(currency, amount) {
  // save sign
  var sign = amount < 0 ? "-" : "";

  var number = amount.toString();
  
  if (sign === "-") {
    number = number.slice(1);
  }

  if (currency.showCents) {
    if (number.length < 2) {
      number = "0" + number;
    }
  
    if (number.length < 3) {
      number = "0" + number;
    }  

    var digits = number.length;

    var whole = number.slice(0, digits-2);
    var fraction = number.slice(digits-2);
    
    whole = whole.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
    
    number = whole + "." + fraction;
  } else {
    number = number.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
  }
  
  var result = "";

  if (currency.showSymbolOnLeft) {
    result = currency.symbol + number;
  } else {
    result = number + " " + currency.symbol;
  }

  if (sign === "-") {
    result = "(" + result + ")";
  }
  return result;
}

function firstOfMonth() {
  var now = new Date();
  var day = "1";
  var month = (now.getMonth() + 1).toString();
  var year = (now.getYear() - 100).toString();
  
  return [day, month, year].join("/");
}

function camelCaseToRegular(camel) {
  // http://stackoverflow.com/questions/4149276/javascript-camelcase-to-regular-form
  return camel.replace(/([A-Z])/g, ' $1').replace(/^./, function(str){ return str.toUpperCase(); })
}

