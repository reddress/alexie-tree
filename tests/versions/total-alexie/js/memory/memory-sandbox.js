"use strict";

var accountIds = [];
var transactionIds = [];

var accounts = {};
var transactions = {};
var balances = {};

var now = new Date().getTime();

function addAccount(name, sign, parent) {
  var account = new Account(name, sign, parent);
  var id = account.save();
  account.id = id;
  accountIds.push(id);
  accounts[id] = account;
  return id;
}

function addTransaction(debit, credit, timestamp, currency, amount, description, parent) {
  var transaction = new Transaction(debit, credit, timestamp, currency, amount, description, parent);
  var id = transaction.save();
  transaction.id = id;
  transactionIds.push(id);
  transactions[id] = transaction;

  // updateBalances(transaction, accounts, balances);
  transaction.record(accounts);

  transaction.setRootTransaction(transactions);
  return id;
}


var twd = new Currency("TWD", "New Taiwan Dollar", "NT$", false, false);
var usd = new Currency("USD", "U.S. Dollar", "$", false, false);

var assets = addAccount("Assets", 1);
var expenses = addAccount("Expenses", 1);
var income = addAccount("Income", -1);

var bank = addAccount("Bank", 1, expenses);
var itau = addAccount("Itau", 1, bank);
var bradesco = addAccount("Bradesco", 1, bank);

var groceries = addAccount("Groceries", 1, expenses);

var salary = addAccount("Salary", -1, income);

var taxes = addAccount("Taxes", 1, expenses);
var stateTaxes = addAccount("State taxes", 1, taxes);
var federalTaxes = addAccount("Federal taxes", 1, taxes);

var home = addAccount("Home", 1, expenses);

var delivery = addAccount("Delivery fees", 1, home);

// Transactions
var ikeaBed = addTransaction(null, null, now, null, null, "Ikea bed");
var bed = addTransaction(home, assets, now, twd, 600, "The bed", ikeaBed);
var bedFees = addTransaction(null, null, now, null, null, "Bed fees", ikeaBed);

var bedDeliveryJoe = addTransaction(delivery, assets, now, usd, 25, "Delivery fee Joe", bedFees);
var bedDeliveryMing = addTransaction(delivery, assets, now, twd, 100, "Delivery fee Ming", bedFees);

var bedTaxes = addTransaction(null, null, now, null, null, "Bed taxes", bedFees);
var bedStateTaxes = addTransaction(stateTaxes, assets, now, twd, 100, "Bed state taxes", bedTaxes);

var bedFederalTaxes = addTransaction(federalTaxes, assets, now, twd, 180, "Bed federal taxes", bedTaxes);

var bedImportTaxes = addTransaction(federalTaxes, assets, now, usd, 75, "Bed import taxes", bedTaxes);
var bedScrews = addTransaction(home, assets, now, twd, 20, "Bed screws", ikeaBed);

var chocolate = addTransaction(groceries, assets, now, twd, 150, "Chocolate");

var ikeaTransactions = _.filter(transactions, { rootTransaction: "Ikea bed" });
ikeaTransactions.push(transactions["Ikea bed"]);

// var rogueTransaction = addTransaction(delivery, assets, now, twd, 10000, "Hijacked delivery", chocolate);

var ikeaTree = buildTree(ikeaTransactions);
var ikeaTreeString = printTree(ikeaTree);

var accountTree = buildTree(accounts);
var accountTreeString = printTree(accountTree);
