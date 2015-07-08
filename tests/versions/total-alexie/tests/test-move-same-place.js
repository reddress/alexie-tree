"use strict";

// desired tree structure

var desiredTreeNodeList = {
  
};

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

  t.add(new Account("income", "Income", 1, null));
  t.add(new Account("salary", "Salary", 1, "income"));

  t.add(new Account("equity", "Equity", 1, null));
  t.add(new Account("open", "Opening Balance", 1, "equity"));
  t.add(new Account("saved", "Saved", 1, "open"));

  t.add(new Account("liabilities", "Liabilities", 1, null));
  t.add(new Account("credit", "Credit Card", 1, "liabilities"));

  return t;
}

var t = makeTreeNodeList();

console.log(t);

var makeTree = makeTreeNodeList;

QUnit.test("Move to same place", function(assert) {
  var t = makeTree();

  var jsonBefore = JSON.stringify(t.buildTree("groc"));
  t.moveTo("stm", "groc", "merc");
  var jsonAfter = JSON.stringify(t.buildTree("groc"));
  assert.equal(jsonBefore, jsonAfter);
});  

