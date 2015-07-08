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

  transactions.computeAccountsCumulativeTotal(currencies, accounts);
  var accountsTreeTable = accounts.tabulate(currencies);

  var transactionsGrandTotal = transactions.accumulate(currencies);
  var transactionsTreeTable = transactions.tabulate(currencies);

  assert.equal(transactionsGrandTotal.cumulativeTotalInUSD, "$1112.00");
});
