"use strict";

// TreeNodeList for Transactions
function TransactionTreeNodeList(id) {
  TreeNodeList.call(this, "transaction", id);
}

TransactionTreeNodeList.prototype = Object.create(TreeNodeList.prototype);
