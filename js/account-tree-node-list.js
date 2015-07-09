"use strict";

function AccountTreeNodeList(id) {
  TreeNodeList.call(this, "account", id);
}

AccountTreeNodeList.prototype = Object.create(TreeNodeList.prototype);

AccountTreeNodeList.prototype.accountSign = function(id) {
  return this.node(id).sign;
}

AccountTreeNodeList.prototype.renderTable = function(currencies, domId) {
  var accountsTreeTable = this.tabulate(currencies);

  var fields = ["totalForSelectedTransactions", "cumulativeBalance", "balance"];
  TreeNodeList.prototype.renderTable.call(this, domId, fields, accountsTreeTable);
};
