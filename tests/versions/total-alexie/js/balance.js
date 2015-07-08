"use strict";

// DO NOT USE. Keep balances in account

// without persistence, balances must be recomputed each time the page is
// loaded.

// with Firebase, we store balances in order to avoid downloading the whole
// transaction dataset every time

// balances stored do not accumulate children values, because there is a
// setting that controls this behavior

function calculateBalances(accounts, transactions, balances) {

}

function updateBalances(transaction, accounts, balances) {
  var debitAccount = accounts[transaction.debit];

  // a transaction with null debit should also have null credit
  if (debitAccount) {
    var creditAccount = accounts[transaction.credit];

    // initialize values if they are undefined
    var currencyCode = transaction.currency.code;

    if (!balances[debitAccount.id]) {
      balances[debitAccount.id] = {};
    }

    if (!balances[creditAccount.id]) {
      balances[creditAccount.id] = {};
    }

    if (!balances[debitAccount.id][currencyCode]) {
      balances[debitAccount.id][currencyCode] = 0;
    }

    if (!balances[creditAccount.id][currencyCode]) {
      balances[creditAccount.id][currencyCode] = 0;
    }

    balances[debitAccount.id][currencyCode] += debitAccount.sign * transaction.amount;
    balances[creditAccount.id][currencyCode] -= creditAccount.sign * transaction.amount;
  }      
}
