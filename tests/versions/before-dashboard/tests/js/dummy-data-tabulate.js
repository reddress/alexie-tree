"use strict";

var transactions = makeTransactionTreeNodeList(currencies, accounts);

var transactionsGrandTotal = transactions.accumulate(currencies);
transactions.computeTotalForAccounts(currencies, accounts);

var accountsTreeTable = accounts.tabulate(currencies);
var transactionsTreeTable = transactions.tabulate(currencies);
