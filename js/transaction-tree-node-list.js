"use strict";

// TreeNodeList for Transactions
function TransactionTreeNodeList(id) {
  TreeNodeList.call(this, "transaction", id);
}

TransactionTreeNodeList.prototype = Object.create(TreeNodeList.prototype);

TransactionTreeNodeList.prototype.recordTransaction = function(currencies, accounts, transaction) {
  var debit = transaction.debit;
  var credit = transaction.credit;
  var description = transaction.description;
  var currencyCode = transaction.currency;
  
  // throw error if debit or credit do not exist
  if (debit !== null && accounts.node(debit) === undefined) {
    throw new Error("Cannot add transaction " + description + ", debit " + debit + " not found");
  }

  if (credit !== null && accounts.node(credit) === undefined) {
    throw new Error("Cannot add transaction " + description + ", credit " + credit + " not found");
  }

  if (debit !== null && credit !== null && currencyCode !== null && amount !== null) {
    // var currency = currencies.node(currencyCode);
    var amount = transaction.amount;

    var debitAccount = accounts.node(debit);
    var creditAccount = accounts.node(credit);

    var debitSign = accounts.accountSign(debit);
    var creditSign = accounts.accountSign(credit);

    if (!debitAccount.balance[currencyCode]) {
      debitAccount.balance[currencyCode] = 0;
    }
    
    if (!creditAccount.balance[currencyCode]) {
      creditAccount.balance[currencyCode] = 0;
    }
    
    debitAccount.balance[currencyCode] += amount * debitSign;
    creditAccount.balance[currencyCode] -= amount * creditSign;
  }
  
  this.add(transaction);
};


TransactionTreeNodeList.prototype.currencies = function() {
  var currencyTable = {};

  function addCurrencyToTable(currency) {
    var currencyCode = currency.code;
    
    if (!currencyTable[currencyCode]) {
      currencyTable[currencyCode] = currency;
    }
  }
  // collect currencies
  var currenciesList = [];
  _.forEach(this.nodes, function(node) {

    // node is a transaction
    if (node.currency) {
      currenciesList = _(currenciesList).union(node.currency.code);
      addCurrencyToTable(node.currency);
    }

    // node is an account
    if (node.balance) {
      currenciesList = _(currenciesList).union(_.keysIn(node.balance));
    }

    if (node.cumulativeTotal) {
      currenciesList = _(currenciesList).union(_.keysIn(node.cumulativeTotal));
    }
  });

  currencyTable.list = function() {
    return currenciesList.value();
  };
  
  return currencyTable;;
}

TransactionTreeNodeList.prototype.computeAccountsCumulativeTotal = function(currencies, accounts) {
  var transactions = this.nodes;

  if (transactions.length === 0) {
    console.warn("Compute cumulativeTotal called with no transactions");
    return;
  }
  
  function bubble_amount(source, money) {
    if (!source.cumulativeTotal[money.currency.code]) {
      source.cumulativeTotal[money.currency.code] = 0;
    }
    source.cumulativeTotal[money.currency.code] += money.amount;
    if (source.parentId) {
      bubble_amount(accounts.node(source.parentId), money);
    }
  }

  _.forEach(accounts.nodes, function(account) {
    account.cumulativeTotal = {};
  });

  _.forEach(transactions, function(transaction) {
    var debit = transaction.debit;
    var credit = transaction.credit;
    var description = transaction.description;
    
    // throw error if debit or credit do not exist
    if (debit !== null && accounts.node(debit) === undefined) {
      throw new Error("Cannot add transaction " + description + ", debit " + debit + " not found");
    }

    if (credit !== null && accounts.node(credit) === undefined) {
      throw new Error("Cannot add transaction " + description + ", credit " + credit + " not found");
    }

    if (debit !== null && credit !== null && currency !== null && amount !== null) {
      var currency = currencies.node(transaction.currency);
      var amount = transaction.amount;
      var debitAccount = accounts.node(debit);
      var creditAccount = accounts.node(credit);
      var debitSign = accounts.accountSign(debit);
      var creditSign = accounts.accountSign(credit);
      
      bubble_amount(debitAccount, { currency: currency, amount: amount * debitSign });
      bubble_amount(creditAccount, { currency: currency, amount: -amount * creditSign });
    }
  });
}

TransactionTreeNodeList.prototype.accumulate = function(currencies) {
  var treeNodeList = this;

  function bubble_amount(source, money) {
    if (!source.cumulativeTotal[money.currency]) {
      source.cumulativeTotal[money.currency] = 0;
    }
    source.cumulativeTotal[money.currency] += money.amount;
    if (source.parentId) {
      bubble_amount(treeNodeList.node(source.parentId), money);
    }
  }

  if (this.nodes.length === 0) {
    // do nothing
    console.warn("accumulate() called with no nodes.");
    return;  
  }
  
  _.forEach(this.nodes, function(node) {
    node.cumulativeTotal = {};
  });

  var grandTotal = { cumulativeTotal: {} };

  _.forEach(currencies.list(), function(currencyCode) {
    grandTotal.cumulativeTotal[currencyCode] = 0;
  });

  _.forEach(this.nodes, function(node) {
    var currency = node.currency;
    var amount = node.amount;
    if (currency !== null && amount !== null) {
      bubble_amount(node, { currency: currency, amount: amount });

      grandTotal.cumulativeTotal[currency] += amount;
    }
  });
  
  _.forEach(currencies.list(), function(currencyCode) {
    grandTotal["cumulativeTotalIn" + currencyCode] = formatMoney(currencies.node(currencyCode), grandTotal.cumulativeTotal[currencyCode]);
  });
   
  
  grandTotal.name = "Grand Total";
  
  return grandTotal;
};
