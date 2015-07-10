"use strict";

function AccountTreeNodeList(id) {
  TreeNodeList.call(this, "account", id);
}

AccountTreeNodeList.prototype = Object.create(TreeNodeList.prototype);

AccountTreeNodeList.prototype.accountSign = function(id) {
  return this.node(id).sign;
}

AccountTreeNodeList.prototype.renderTable = function(currencies, accounts, domId) {
  var accountsTreeTable = this.tabulate(currencies, this);

  var currencyFields = ["cumulativeBalance", "totalForSelectedTransactions", "balance"];
  TreeNodeList.prototype.renderTable.call(this, domId, [], currencyFields, accountsTreeTable);
};
