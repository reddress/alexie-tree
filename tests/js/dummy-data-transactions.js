"use strict";

function makeCurrencyTreeNodeList() {
  var currencies = new CurrencyTreeNodeList();

  currencies.add(new Currency("USD", "U.S. Dollar", "$", true, true));
  currencies.add(new Currency("TWD", "New Taiwan Dollar", "NT", false, false));
  currencies.add(new Currency("BRL", "Brazilian Real", "R$", true, true, false));
  currencies.add(new Currency("EUR", "Euro", "€", true, true));

  return currencies;
}
var currencies = makeCurrencyTreeNodeList();
var currenciesList = currencies.list();

function makeAccountTreeNodeList() {
  var accounts = new AccountTreeNodeList();

  accounts.add(new Account("assets", "Assets", 1, null));
  accounts.add(new Account("bank", "Banks", 1, "assets"));
  accounts.add(new Account("bradesco", "Bradesco", 1, "bank"));
  accounts.add(new Account("itau", "Itaú", 1, "bank"));
  accounts.add(new Account("caixa", "Caixa Economica Federal", 1, "bank"));
  accounts.add(new Account("santander", "Santander", 1, "bank"));
  accounts.add(new Account("wal", "Wallets", 1, "assets"));
  accounts.add(new Account("front", "Front", 1, "wal"));
  accounts.add(new Account("back", "Back", 1, "wal"));

  accounts.add(new Account("itcor", "Conta Corrente", 1, "itau"));
  accounts.add(new Account("brcor", "Conta Corrente", 1, "bradesco"));

  accounts.add(new Account("expenses", "Expenses", 1, null));
  accounts.add(new Account("groc", "Groceries", 1, "expenses"));
  accounts.add(new Account("pao", "Pao de Acucar", 1, "groc"));
  accounts.add(new Account("merc", "Mercadinho", 1, "groc"));
  accounts.add(new Account("stm", "St. Marche", 1, "groc"));
  accounts.add(new Account("extra", "Extra", 1, "groc"));
  accounts.add(new Account("dia", "Dia", 1, "groc"));
  accounts.add(new Account("self", "Self-care", 1, "expenses"));
  accounts.add(new Account("health", "Health", 1, "self"));
  accounts.add(new Account("body", "Body", 1, "health"));
  accounts.add(new Account("hair", "Hair", 1, "body"));

  accounts.add(new Account("hsbc", "HSBC", 1, "bank"));

  accounts.add(new Account("income", "Income", -1, null));
  accounts.add(new Account("salary", "Salary", -1, "income"));

  accounts.add(new Account("equity", "Equity", -1, null));
  accounts.add(new Account("open", "Opening Balance", -1, "equity"));
  accounts.add(new Account("saved", "Saved", -1, "open"));

  accounts.add(new Account("liabilities", "Liabilities", -1, null));
  accounts.add(new Account("credit", "Credit Card", -1, "liabilities"));

  accounts.add(new Account("taxes", "Taxes", 1, "expenses"));
  accounts.add(new Account("stateTaxes", "State Taxes", 1, "taxes"));
  accounts.add(new Account("federalTaxes", "Federal Taxes", 1, "taxes"));

  accounts.add(new Account("home", "Home", 1, "expenses"));
  accounts.add(new Account("delivery", "Delivery", 1, "home"));

  return accounts;
}
var accounts = makeAccountTreeNodeList();

function now() {
  return new Date().getTime();
}

var now = now();

function makeTransactionTreeNodeList(currencies, accounts) {
  var transactions = new TransactionTreeNodeList();

  transactions.recordTransaction(currencies, accounts, new Transaction("openAssets", "assets", "open", now, "USD", 100000, "Opening balance"));
  transactions.recordTransaction(currencies, accounts, new Transaction("ikeaBed", null, null, now, null, null, "Ikea Bed"));

  transactions.recordTransaction(currencies, accounts, new Transaction("theBed", "home", "assets", now, "TWD", 600, "The bed", "ikeaBed"));
  transactions.recordTransaction(currencies, accounts, new Transaction("bedFees", null, null, now, null, null, "Bed fees", "ikeaBed"));
  transactions.recordTransaction(currencies, accounts, new Transaction("bedDeliveryJoe", "delivery", "assets", now, "USD", 2500, "Delivery fee Joe", "bedFees"));
  transactions.recordTransaction(currencies, accounts, new Transaction("bedDeliveryMing", "delivery", "assets", now, "TWD", 100, "Delivery fee Ming", "bedFees"));
  transactions.recordTransaction(currencies, accounts, new Transaction("bedTaxes", null, null, now, null, null, "Bed Taxes", "bedFees"));
  transactions.recordTransaction(currencies, accounts, new Transaction("bedImportTaxes", "federalTaxes", "assets", now, "USD", 7500, "bed federal taxes", "bedTaxes"));
  transactions.recordTransaction(currencies, accounts, new Transaction("bedScrews", "home", "assets", now, "TWD", 20, "Bed screws", "ikeaBed"));
  transactions.recordTransaction(currencies, accounts, new Transaction("chocolate", "groc", "assets", now, "TWD", 150, "Chocolate"));
  transactions.recordTransaction(currencies, accounts, new Transaction("beef", "groc", "assets", now, "TWD", 450, "Beef"));
  transactions.recordTransaction(currencies, accounts, new Transaction("eggs", "stm", "assets", now, "TWD", 170, "Eggs"));

  transactions.recordTransaction(currencies, accounts, new Transaction("cheese", "merc", "assets", now, "EUR", 2000, "Cheese"));

  transactions.recordTransaction(currencies, accounts, new Transaction("haircut", "hair", "assets", now, "USD", 1200, "Haircut"));
  
  return transactions;
}

var transactions = makeTransactionTreeNodeList(currencies, accounts);

var transactionsGrandTotal = transactions.accumulate(currencies);
var transactionsTreeTable = transactions.tabulate(currencies);
