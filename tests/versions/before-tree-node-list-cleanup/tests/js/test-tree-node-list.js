"use strict";

// no longer works because node type must now match the target TreeNodeList

function makeSimpleTreeNodeList() {
  var result = new TreeNodeList();

  result.add(new Account("assets", "Assets", 1));
  result.add(new Account("expenses", "Expenses", 1));
 
  return result;
}

function makeTreeNodeList() {
  var t = new TreeNodeList();
  
  t.add(new Account("assets", "Assets", 1, null));
  t.add(new Account("bank", "Banks", 1, "assets"));
  t.add(new Account("bradesco", "Bradesco", 1, "bank"));
  t.add(new Account("itau", "Itaú", 1, "bank"));
  t.add(new Account("caixa", "Caixa Economica Federal", 1, "bank"));
  t.add(new Account("santander", "Santander", 1, "bank"));
  t.add(new Account("wal", "Wallets", 1, "assets"));
  t.add(new Account("front", "Front", 1, "wal"));
  t.add(new Account("back", "Back", 1, "wal"));

  t.add(new Account("itcor", "Conta Corrente", 1, "itau"));
  t.add(new Account("brcor", "Conta Corrente", 1, "bradesco"));

  t.add(new Account("expenses", "Expenses", 1, null));
  t.add(new Account("groc", "Groceries", 1, "expenses"));
  t.add(new Account("pao", "Pao de Acucar", 1, "groc"));
  t.add(new Account("merc", "Mercadinho", 1, "groc"));
  t.add(new Account("stm", "St. Marche", 1, "groc"));
  t.add(new Account("extra", "Extra", 1, "groc"));
  t.add(new Account("dia", "Dia", 1, "groc"));
  t.add(new Account("self", "Self-care", 1, "expenses"));
  t.add(new Account("health", "Health", 1, "self"));
  t.add(new Account("body", "Body", 1, "health"));
  t.add(new Account("hair", "Hair", 1, "body"));

  t.add(new Account("hsbc", "HSBC", 1, "bank"));

  t.add(new Account("income", "Income", -1, null));
  t.add(new Account("salary", "Salary", -1, "income"));

  t.add(new Account("equity", "Equity", -1, null));
  t.add(new Account("open", "Opening Balance", -1, "equity"));
  t.add(new Account("saved", "Saved", -1, "open"));

  t.add(new Account("liabilities", "Liabilities", -1, null));
  t.add(new Account("credit", "Credit Card", -1, "liabilities"));

  return t;
}

var t = makeTreeNodeList();

var makeTree = makeTreeNodeList;

QUnit.test("Move to same place", function(assert) {
  var t = makeTreeNodeList();

  var jsonBefore = JSON.stringify(t.buildTreeHierarchy("groc"));
  t.moveTo("stm", "groc", "merc");
  var jsonAfter = JSON.stringify(t.buildTreeHierarchy("groc"));
  assert.equal(jsonBefore, jsonAfter);
});  


QUnit.test("Find node", function(assert) {
  var acct = t.contains("assets");
  assert.equal(acct.name, "Assets", "Find Assets");
});

QUnit.test("Adding not allowed by TreeNodeList", function(assert) {
  assert.throws(
    function() {
      t.add(new Account("assets", "more assets", 1));
    },
      /existing id/,
    "Could not add assets again, raised error containing 'existing id'"
  );

  assert.throws(
    function() {
      t.add(new Account("bank", "Bank", 1, "newAssets"));
    },
      /parent id/,
    "Could not add account with non-existent parent"
  );

  assert.throws(
    function() {
      t.add(new Account("equity", "Equity", -1, "assets", "newIncome"));
    },
      /previousSibling id/,
    "Could not add account with non-existent previousSibling"
  );
});

// the following tests are from dazona.github.io/freegil

QUnit.test("Get account and check for nonexistent", function(assert) {
  var t = makeTreeNodeList();
  assert.ok(t.node("bank"), "Bank exists");
  assert.notOk(t.node("nothing"), "id of nothing does not exist");
});

QUnit.test("Get immediate childrenIds of accounts", function(assert) {
  var t = makeTreeNodeList();
  var accountsChildrenIds = t.immediateChildrenIds();
  assert.equal(accountsChildrenIds.length, 5, "There are five immediate (top-level) childrenIds");
  assert.equal(accountsChildrenIds[0], "assets", "First child is assets");
});

QUnit.test("Get all childrenIds of an account", function(assert) {
  var t = makeTreeNodeList();
  var selfChildrenIds = t.childrenIds("self");
  
  // does not contain banks
  assert.ok(selfChildrenIds.indexOf("bradesco") === -1, "Check that bradesco is not in 'self'");

  // immediate child
  assert.ok(selfChildrenIds.indexOf("health") !== -1);
  
  // deeper level
  assert.ok(selfChildrenIds.indexOf("hair") !== -1);
});

QUnit.test("First child of a parent", function(assert) {
  var t = makeTreeNodeList();
  assert.equal(t.firstChildId(), "assets");
  assert.equal(t.firstChildId("bank"), "bradesco");
  assert.equal(t.firstChildId("body"), "hair");
});

QUnit.test("Last child of a parent", function(assert) {
  var t = makeTreeNodeList();
  assert.equal(t.lastChildId("body"), "hair");
  assert.equal(t.lastChildId("bank"), "hsbc");
  assert.equal(t.lastChildId(), "liabilities");
});

QUnit.test("Find next account", function(assert) {
  var t = makeTreeNodeList();
  assert.equal(t.nextSiblingId("bradesco"), "itau");
  assert.equal(t.nextSiblingId("hsbc"), null);
  assert.equal(t.nextSiblingId("assets"), "expenses");
});

QUnit.test("Move account at same level", function(assert) {
  var t = makeTreeNodeList();

  // move to front of level
  t.moveTo("caixa", "bank", null);  
  assert.equal(t.firstChildId("bank"), "caixa");  

  // move pao, merc, stm, extra, dia
  // to   pao, stm, extra, merc, dia
  // move within list
  t.moveTo("merc", "groc", "extra");
  assert.equal(t.node("pao").previousSiblingId, null);
  assert.equal(t.node("stm").previousSiblingId, "pao");
  assert.equal(t.node("extra").previousSiblingId, "stm");
  assert.equal(t.node("merc").previousSiblingId, "extra");
  assert.equal(t.node("dia").previousSiblingId, "merc");
  
  var jsonBefore = JSON.stringify(t.buildTreeHierarchy("groc"));
  t.moveTo("stm", "groc", "pao");
  var jsonAfter = JSON.stringify(t.buildTreeHierarchy("groc"));
  assert.equal(jsonBefore, jsonAfter);

  // move to end of list
  t.moveTo("merc", "groc", "dia");
  assert.equal(t.lastChildId("groc"), "merc");

  // move to same location
  // var flatBefore = t.flatten();
  // t.moveTo("stm", "groc", "merc");
  // var flatAfter = t.flatten();

  
  // assert.equal(JSON.stringify(flatBefore), JSON.stringify(flatAfter));
});

QUnit.test("Move account to topmost level", function(assert) {
  var t = makeTreeNodeList();

  // move to first item at topmost level
  t.moveTo("back", null, null);
  var toplevelAccounts = t.immediateChildrenIds(null);
  assert.ok(toplevelAccounts.indexOf("back") !== -1);
  assert.equal(t.firstChildId(null), "back");
  
  // move to last item at topmost level
  t.moveTo("bradesco", null, t.lastChildId(null));
  assert.equal(t.lastChildId(null), 'bradesco');
  
  // move to middle of topmost level
  t.moveTo("income", null, "assets");
  var f = t.flatten();

  assert.ok(f.indexOf("1 income") > f.indexOf("1 assets"));
});

QUnit.test("Move to different branch", function(assert) {
  var t = makeTreeNodeList();

  // move to first item of different branch
  t.moveTo("merc", "bank", null);
  assert.equal(t.firstChildId("bank"), 'merc');

  // move to last item of different branch
  t.moveTo("dia", "bank", "hsbc");
  assert.equal(t.lastChildId("bank"), "dia");
  
  // move to middle of different branch
  t.moveTo("pao", "bank", "caixa");
  // var f = t.flatten();
  // assert.ok(f.indexOf("3 pao") > f.indexOf("3 caixa"));
  
  // move to new singleton leaf
  t.moveTo("stm", "hair", null);
  assert.equal(t.firstChildId("hair"), "stm");
  assert.equal(t.lastChildId("hair"), "stm");

  // remove leaf and add as new leaf
  t.moveTo("brcor", "stm", null);
  assert.equal(t.firstChildId("stm"), 'brcor', "remove leaf and add as new leaf");

  t.printTree();
  
  // remove leaf and move to middle of new branch
  t.moveTo("itcor", "groc", "extra");
  var c = t.childrenIds("groc");
  assert.ok(c.indexOf("itcor") > -1);
});

QUnit.test("Display flat list", function(assert) {
  var t = makeTreeNodeList();
  var bt = t.buildTreeHierarchy();
  var f = t.flatten();

  assert.equal(f[f.length-1], "2 credit");
  assert.ok(f.indexOf("3 bradesco") < f.indexOf("3 hsbc"));

  // altering structure requires rebuilding
  t.moveTo("bradesco", "bank", "hsbc");
  f = t.flatten();
  assert.ok(f.indexOf("3 bradesco") > f.indexOf("3 hsbc"));
});

QUnit.test("Display as tree", function(assert) {
  var t = makeTreeNodeList();
  t.moveTo("bradesco", "bank", "hsbc");
  var bt = t.buildTreeHierarchy();
  // console.log(JSON.stringify(bt, null, 2));
  assert.equal(bt.children[0].id, "assets");
  var bank = bt.children[0].children[0].children;
  assert.equal(bank[bank.length - 1].id, "bradesco");
  function countNodes(rootNode) {
    var nodes = 0;
    function recurse(node) {
      var children = node.children;
      for (var i = 0, len = children.length; i < len; i++) {
        nodes += 1;
        recurse(children[i]);
      }
    }
    recurse(rootNode);
    return nodes;
  }
  
  assert.equal(countNodes(bt), Object.keys(t.nodes).length);
});

QUnit.test("Account is child of another", function(assert) {
  var t = makeTreeNodeList();
  assert.ok(t.isChildOf("bradesco", "bank"));
  assert.ok(!t.isChildOf("hair", "income"));
  assert.ok(t.isChildOf("hair", null));
  assert.ok(t.isChildOf("assets", null));
  assert.ok(!t.isChildOf("assets", "bank"));
  assert.ok(!t.isChildOf("assets", "assets"));
});

QUnit.test("Account belongs to another", function(assert) {
  var t = makeTreeNodeList();
  assert.ok(t.belongsTo("bradesco", "bank"));
  assert.ok(!t.belongsTo("hair", "income"));
  assert.ok(t.belongsTo("hair", null));
  assert.ok(t.belongsTo("assets", null));
  assert.ok(!t.belongsTo("assets", "bank"));
  assert.ok(t.belongsTo("assets", "assets"));
});

QUnit.test("Account is ancestor of another", function(assert) {
  var t = makeTreeNodeList();
  assert.ok(t.isAncestorOf(null, "income"));  // direct child
  assert.ok(!t.isAncestorOf("groc", "groc"));  // same account is not
  assert.ok(!t.isAncestorOf("hair", "self"));  // backwards
  assert.ok(t.isAncestorOf("assets", "itcor"))  // multiple levels
  assert.ok(!t.isAncestorOf("none", "bank"))  // nonexistent parent
  assert.ok(!t.isAncestorOf("bank", "none"))  // nonexistent child
});

QUnit.test("Account sign", function(assert) {
  var t = makeTreeNodeList();
  assert.equal(t.accountSign("bank"), 1);
  assert.equal(t.accountSign("income"), -1);
  assert.equal(t.accountSign("credit"), -1);
  assert.equal(t.accountSign("liabilities"), -1);
  assert.equal(t.accountSign("saved"), -1);
  assert.equal(t.accountSign("equity"), -1);
  assert.equal(t.accountSign("open"), -1);

  var transactionTree = new TreeNodeList();
  transactionTree.add(new Transaction("open", "bank", "open", new Date().getTime));
  
  assert.throws(function() { transactionTree.accountSign("open"); },
                /expects account/,
                "Cannot get sign of something that is not an account");
});

QUnit.test("Add jumbled", function(assert) {
  var nodes = [
    new Account("itau", "Itaú", 1, "bank"),
    new Account("bank", "Banks", 1, "assets"),
    new Account("groc", "Groceries", 1, "expenses"),
    new Account("assets", "Assets", 1, null),
    new Account("expenses", "Expenses", 1, null),
  ];

  var t = new TreeNodeList();
  t.addNodes(nodes);

  assert.equal(t.node("groc").name, "Groceries");
});

QUnit.test("Get root id", function(assert) {
  var t = makeTreeNodeList();
  assert.equal(t.rootId("bank"), "assets", "bank");
  assert.equal(t.rootId("assets"), null, "top level account");
});
  

/*
QUnit.test("Add transaction", function(assert) {
  var t = makeTreeNodeList();
  t.resetBalances();
  
  var transaction = { debit: "itcor", credit: "salary", amount: 231500 };
  t.recordTransaction(transaction);
  assert.equal(t.getBalance("itcor"), 231500);
  assert.equal(t.getBalance("salary"), 231500);

  // check if amount bubbled up to parent accounts
  assert.equal(t.getBalance("bank"), 231500);
  assert.equal(t.getBalance("income"), 231500);
  assert.equal(t.getBalance("accounts"), 0);
});

QUnit.test("Reverse transaction", function(assert) {
  var tr = { timestamp: 1000, description: "pizza", amount: 3200, debit: "expenses", credit: "itau" };
  var reversedTr = reverseTransaction(tr);
  assert.equal(reversedTr.description, "[Reverse " + tr.description + "]");

  // modifying reversed does not affect original
  reversedTr.credit = "bank";
  assert.equal(tr.credit, "itau");
});
*/


/*
QUnit.test("Create UL tree", function(assert) {
  var t = makeTreeNodeList();
  var bt = t.buildTreeHierarchy();
  var html_tree = t.ulTree(bt);
  console.log(html_tree);
  assert.ok(true);
});
*/

