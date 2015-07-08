"use strict";

var transactions = makeTransactionTreeNodeList(currencies, accounts);

var transactionsGrandTotal = transactions.accumulate(currencies);
var transactionsTreeTable = transactions.tabulate(currencies);
