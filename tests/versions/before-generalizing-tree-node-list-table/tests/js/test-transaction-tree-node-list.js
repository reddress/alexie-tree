"use strict";

QUnit.test("Generate TransactionTreeNodeList", function(assert) {
  var c = makeCurrencyTreeNodeList();
  var a = makeAccountTreeNodeList();
  var t = makeTransactionTreeNodeList(c, a);
  assert.equal(true, true);
});

QUnit.test("Accumulate amounts", function(assert) {
  var currencies = makeCurrencyTreeNodeList();
  var accounts = makeAccountTreeNodeList();
  var transactions = makeTransactionTreeNodeList(currencies, accounts);

  var accountsTreeTable = accounts.tabulate(currencies);

  transactions.computeTotalForAccounts(currencies, accounts);
  
  var transactionsGrandTotal = transactions.accumulate(currencies);
  var transactionsTreeTable = transactions.tabulate(currencies);

  assert.equal(transactionsGrandTotal.cumulativeTotalInUSD, "$1112.00", "$1112.80 grand total for transations");
  assert.equal(accounts.node("expenses").totalForSelectedTransactions["TWD"], 1490, "1490 NT in expenses");
});
