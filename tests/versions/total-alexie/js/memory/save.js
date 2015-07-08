"use strict";

// include after data definitions (Account, Currency, Transaction, etc.)
var accounts = {};
var currencies = {};
var transactions = {};

Account.prototype.save = function() {
  // var id = "account" + _.size(accounts);
  var id = this.name;
  accounts[id] = this;
  return id;
};

Currency.prototype.save = function() {
  currencies[this.code] = this;
};

Transaction.prototype.save = function() {
  // var id = "transaction" + _.size(transactions);
  var id = this.description;
  transactions[id] = this;
  return id;
};

