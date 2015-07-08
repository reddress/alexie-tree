"use strict";

function Transaction(id, debit, credit, timestamp, currency, amount, description, parentId, previousSiblingId) {
  this.type = "transaction";

  this.id = id || null;
  this.debit = debit || null;  // "-JtPJqVjjkY2WyJKXeyO"   null if it is split
  this.credit = credit || null;  // "-JtPJqV_zwVl2E_2CZvg" null if it is split
  this.timestamp = timestamp || new Date().getTime();  // 1436037004534
  this.currency = currency || null;  // "BRL"  null if split
  this.amount = amount || 0;  // 1250
  this.description = description || "";  // "Opening balance"
  this.parentId = parentId || null;
  this.previousSiblingId = previousSiblingId || null;

  // make transaction compatible with account
  this.name = description;
}

Transaction.prototype.record = function(accounts) {
  if (this.debit !== null && this.credit !== null) {
    var debitAccount = accounts[this.debit];
    var creditAccount = accounts[this.credit];

    if (!debitAccount) {
      throw new Error("Transaction.record() did not find debit account " + JSON.stringify(this));
    }

    if (!creditAccount) {
      throw new Error("Transaction.record() did not find credit account " + JSON.stringify(this));
    }
    
    // initialize values if they are undefined
    var currencyCode = this.currency.code;

    if (!debitAccount.balance[currencyCode]) {
      debitAccount.balance[currencyCode] = 0;
    }

    if (!creditAccount.balance[currencyCode]) {
      creditAccount.balance[currencyCode] = 0;
    }

    debitAccount.balance[currencyCode] += debitAccount.sign * this.amount;
    creditAccount.balance[currencyCode] -= creditAccount.sign * this.amount;
  }
};
