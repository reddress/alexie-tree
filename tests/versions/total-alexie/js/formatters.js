function formatMoney(currency, amount) {

  // save sign
  var sign = amount < 0 ? "-" : "";

  var number = amount.toString();
  
  if (sign === "-") {
    number = number.slice(1);
  }

  if (currency.showCents) {
    if (number.length < 2) {
      number = "0" + output;
    }
  
    if (number.length < 3) {
      number = "0" + number;
    }  

    var digits = number.length;

    number = number.slice(0, digits-2) + "." + number.slice(digits-2);
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
