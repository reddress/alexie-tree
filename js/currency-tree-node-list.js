"use strict";

// TreeNodeList for Currencies
// use TreeNodeList structure to maintain order
// nesting is not needed
function CurrencyTreeNodeList(id) {
  TreeNodeList.call(this, "currency", id);
}

CurrencyTreeNodeList.prototype = Object.create(TreeNodeList.prototype);

// function to return simple array of currency codes
// ["USD", "BRL", "TWD"]

CurrencyTreeNodeList.prototype.list = function() {
  return this.immediateChildrenIds(null);
}
