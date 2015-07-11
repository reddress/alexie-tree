"use strict";

// in-memory data
var transactionListBRL = [
  "1/5/15; Opening balance; 129.35; wal; open",
  "2/5/15; Opening balance; 160; stor; open",
  "2/5/15; Opening balance; 73.84; itcor; open",
  "2/5/15; Opening balance; 218.20; itpou; open",
  "2/5/15; Opening balance; 01.92; brcor; open",
  "2/5/15; Opening balance; 52.78; brpou; open",
  "4/5/15; April 2015 Salary; 1200; itcor; salary",
  "6/5/15; Plasma TV; 1599; home; curr",
  "8/5/15; receive from exchange; 312; wal; curr",
  "9/5/15; Chocolate and cookies; 39.40; merc; wal",
  "11/5/15; Pastel; 5.5; rest; wal",
  "11/5/15; Water; 52.40; merc; itcor",
  "11/5/15; Delivery fee; 2; delivery; wal",
  "13/5/15; Cell phone recharge; 30; comm; wal",
  "14/5/15; Relief fund; 60; doac; itcor",
  "17/5/15; Comic book; 5.9; livr; wal",
  "19/5/15; Italia bank fee; 15.9; tar; itcor",
  "22/5/15; Subway; 3; tr; wal",
  "9/6/15; Rent; 600; home; itcor",
  "10/6/15; Electricity bill; 42.19; util; itcor",
];

var transactionListUSD = [
  "1/5/15; Opening balance; 920; stor; open",
  "2/5/15; Opening balance; 2652.17; amer; open",
  "2/5/15; Payment for plasma TV; 626; curr; credit",
  "8/5/15; pay for exchange; 100; stor; curr",
  "12/5/15; Charity; 30; doac; amer",
  "23/5/15; Airfare; 920.32; tr; amer",
];

var transactionListTWD = [
  "1/5/15; Opening balance; 18.50; unity; open",
  "2/5/15; Opening balance; 2.00; stor; open",
  "12/5/15; Egg rolls; 1.20; goody; unity",
  "14/5/15; Beef noodles; 1.60; rest; unity",
];

function makeCurrencyTreeNodeList() {
  var currencies = new CurrencyTreeNodeList();
  
  currencies.add(new Currency("BRL", "Brazilian Real", "R$ ", true, true));
  currencies.add(new Currency("USD", "U.S. Dollar", "$", true, true));
  currencies.add(new Currency("TWD", "New Taiwan Dollar", "NT", false, false));

  return currencies;
}

function makeAccountTreeNodeList() {
  var accounts = new AccountTreeNodeList();

  accounts.add(new Account("assets", "Assets", 1, null));

  accounts.add(new Account("cash", "Cash", 1, "assets"));
  accounts.add(new Account("wal", "Wallet", 1, "cash"));
  accounts.add(new Account("stor", "Storage", 1, "cash"));

  accounts.add(new Account("bank", "Banks", 1, "assets"));
  accounts.add(new Account("it", "Italia", 1, "bank"));
  accounts.add(new Account("itcor", "It. Checking", 1, "it"));
  accounts.add(new Account("itpou", "It. Savings", 1, "it"));
  accounts.add(new Account("br", "Brasília", 1, "bank"));
  accounts.add(new Account("brcor", "Br. Checking", 1, "br"));
  accounts.add(new Account("brpou", "Br. Savings", 1, "br"));

  accounts.add(new Account("amer", "America Checking", 1, "bank"));
  accounts.add(new Account("unity", "Unity Savings", 1, "bank"));

  accounts.add(new Account("liabilities", "Liabilities", -1, null));
  accounts.add(new Account("credit", "Credit Card", -1, "liabilities"));

  accounts.add(new Account("expenses", "Expenses", 1, null));
  accounts.add(new Account("groc", "Groceries", 1, "expenses"));
  accounts.add(new Account("merc", "Mini Market", 1, "groc"));
  accounts.add(new Account("goody", "Goody", 1, "groc"));

  accounts.add(new Account("rest", "Restaurants", 1, "expenses"));

  accounts.add(new Account("home", "Home", 1, "expenses"));
  accounts.add(new Account("delivery", "Delivery", 1, "home"));
  accounts.add(new Account("util", "Utilities", 1, "home"));

  accounts.add(new Account("comm", "Communications", 1, "expenses"));
  accounts.add(new Account("doac", "Donations", 1, "expenses"));
  accounts.add(new Account("livr", "Books and magazines", 1, "expenses"));
  accounts.add(new Account("tar", "Bank fees", 1, "expenses"));
  accounts.add(new Account("tr", "Transportation", 1, "expenses"));
  accounts.add(new Account("self", "Self-care", 1, "expenses"));
  accounts.add(new Account("hair", "Haircuts", 1, "self"));
  
  accounts.add(new Account("income", "Income", -1, null));
  accounts.add(new Account("salary", "Salary", -1, "income"));

  accounts.add(new Account("equity", "Equity", -1, null));
  accounts.add(new Account("open", "Opening Balance", -1, "equity"));

  accounts.add(new Account("curr", "Currency Trading", -1, "equity"));

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
  
  parseTransactionList(transactionListBRL, "BRL");
  parseTransactionList(transactionListUSD, "USD");
  parseTransactionList(transactionListTWD, "TWD");
  
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
