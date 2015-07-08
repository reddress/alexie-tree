"use strict";

var c = makeCurrencyTreeNodeList();
var a = makeAccountTreeNodeList();
var t = makeTransactionTreeNodeList(c, a);

QUnit.test("Generate transaction TreeNodeList", function(assert) {
  var c = makeCurrencyTreeNodeList();
  var a = makeAccountTreeNodeList();
  var t = makeTransactionTreeNodeList(c, a);
  assert.equal(true, true);
});
