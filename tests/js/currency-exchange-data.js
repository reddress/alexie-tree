"use strict";

// in-memory data
var transactionListCAD = [
  "1/1/15; Open; 200; cadcash; open",
  "1/2/15; pay forex USDCAD = 1.2; 120; forex; cadcash",
  "1/3/15; receive forex USDCAD = 1.3 to buy food; 52; food; forex",
  "1/5/15; receive forex USDCAD = 1.25; 75; cadcash; forex",
  "1/7/15; buy food; 20; food; cadcash",
];

var transactionListUSD = [
  "1/2/15; receive forex USDCAD = 1.2; 100 ; usdcash; forex",
  "1/3/15; pay forex USDCAD = 1.3 to buy food; 40; forex;usdcash",
  "1/5/15; pay forex USDCAD = 1.25; 60; forex; usdcash",
];

function makeCurrencyTreeNodeList() {
  var currencies = new CurrencyTreeNodeList();
  
  currencies.add(new Currency("CAD", "Canadian Dollar", "C$ ", true, true));
  currencies.add(new Currency("USD", "U.S. Dollar", "$", true, true));

  return currencies;
}

function makeAccountTreeNodeList() {
  var accounts = new AccountTreeNodeList();

  accounts.add(new Account("assets", "Assets", 1, null));

  accounts.add(new Account("cadcash", "Canadian Cash", 1, "assets"));
  accounts.add(new Account("usdcash", "U.S. Cash", 1, "assets"));
  accounts.add(new Account("expenses", "Expenses", 1, null));

  accounts.add(new Account("food", "Food", 1, "expenses"));
  
  accounts.add(new Account("income", "Income", -1, null));
  accounts.add(new Account("salary", "Salary", -1, "income"));

  accounts.add(new Account("equity", "Equity", -1, null));
  accounts.add(new Account("open", "Capital", -1, null));

  accounts.add(new Account("forex", "Foreign Exchange", -1, "equity"));
  return accounts;
}

function now() {
  return new Date().getTime();
}

var now = now();

function makeTransactionTreeNodeList(currencies, accounts) {
  var transactions = new TransactionTreeNodeList();

  function parseAndRecordTransaction(s, currencyCode) {
    // format: "15/6/15; description; amount (whole.cents); debit; credit"
    //            0        1            2                     3      4
    var parts = s.split(";");

    for (var i = 0, len = parts.length; i < len; i++) {
      parts[i] = parts[i].trim();
    }

    function getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    // add a random time from 7 AM to 11:59 PM
    function addRandomTime() {
      return parts[0] + " " + getRandomInt(7, 23) + ":" + getRandomInt(0, 59);
    }
    
    var timestamp = moment(addRandomTime(), "DD/M/YY H:m").format("x");
    
    var transaction = new Transaction("transaction" + transactions.nodes.length,
                                      parts[3], parts[4], timestamp,
                                      currencyCode, parseAmount(parts[2]), parts[1]);                                      
    
    transactions.recordTransaction(currencies, accounts, transaction);
  }

 
  function addExpense(amount, description) {
    // shortcut for adding a transactions with multiple defaults
    transactions.recordTransaction(currencies, accounts, new Transaction("shortcut" + transactions.nodes.length, "expenses", "assets", now, "USD", amount, description));
  }

  function parseTransactionList(lst, currencyCode) {
    _.forEach(lst, function(line) {
      parseAndRecordTransaction(line, currencyCode);
    });
  }
  
  parseTransactionList(transactionListCAD, "CAD");
  parseTransactionList(transactionListUSD, "USD");
  
  return transactions;
}

var currencies = makeCurrencyTreeNodeList();
var currenciesList = currencies.list();

var accounts = makeAccountTreeNodeList();

var transactions = makeTransactionTreeNodeList(currencies, accounts);
var transactionsGrandTotal = transactions.accumulate(currencies);
transactions.computeTotalForAccounts(currencies, accounts);

var accountsTreeTable = accounts.tabulate(currencies, accounts);
var transactionsTreeTable = transactions.tabulate(currencies, accounts);
