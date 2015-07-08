"use strict";

var transactions = makeTransactionTreeNodeList(currencies, accounts);
transactions.computeTotalForAccounts(currencies, accounts);

var accountsTreeTable = accounts.tabulate(currencies);

