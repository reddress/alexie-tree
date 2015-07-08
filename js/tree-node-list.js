"use strict";

// name found at http://programmers.stackexchange.com/questions/185001/name-for-a-tree-where-nodes-hold-a-reference-to-their-parent-as-well-as-their-ch

// store a tree structure in a flat list, instead of nesting nodes
function TreeNodeList(type, id) {
  this.type = type || null;
  this.id = id || null;
  this.nodes = [];
}

// TODO Add in batches,
// accumulate all node ids, then
// use queue and move to back if parent or
// previous sibling not found.
TreeNodeList.prototype.addNodes = function(nodes) {
  var seen = [null];
  var ids = [null];
  var queue = [];
  
  // fill queue of ids
  _.forEach(nodes, function(node) {
    queue.push(node);
    if (!_.contains(ids, node.id)) {
      ids.push(node.id);
    }
  });

  // if a node references a non-existent parent or sibling, remove it
  _.forEach(queue, function(node) {
    if (!_.contains(ids, node.parentId)) {
      throw new Error("addNodes(): Node has no matching parent. Removing: " + node.id);
      _.remove(queue, { id: node.id });
    }

    // check that previousSibling exists
    if (!_.contains(ids, node.previousSiblingId)) {
      throw new Error("addNodes(): Node has no matching previous sibling. Removing: " + node.id);
      _.remove(queue, { id: node.id });
    }
  });

  while (_.size(queue) > 0) {
    var node = queue.shift();
    
    if (!_.contains(seen, node.parentId) || !_.contains(seen, node.previousSiblingId)) {
      queue.push(node);
    } else {
      this.add(node);
      seen.push(node.id);
    }
  } 
}

/* MOVED TO ACCOUNT-TREE-NODE-LIST
   TreeNodeList.prototype.accountSign = function(id) {
   var type = this.node(id).type;
   if (type !== "account") {
   throw new Error("accountSign() expects account, but " + type + " passed.");
   }
   return this.node(id).sign;
   }
*/


TreeNodeList.prototype.contains = function(id) {
  return _.filter(this.nodes, { 'id': id })[0];
};

// synonym, both result in the matched node
TreeNodeList.prototype.node = TreeNodeList.prototype.contains;

TreeNodeList.prototype.immediateChildrenIds = function(id) {
  if (id === undefined) {
    id = null;
  }
  var children = _.filter(this.nodes, { 'parentId': id });
  return _.pluck(children, "id");
};

TreeNodeList.prototype.childrenIds = function(id) {
  var childrenIdsList = [];
  var treeNodeList = this;
  function traverse(currentNodeId) {
    var immediateChildrenIds = treeNodeList.immediateChildrenIds(currentNodeId);
    childrenIdsList = _(childrenIdsList).concat(immediateChildrenIds);
    _.forEach(immediateChildrenIds, function(child) {
      traverse(child);
    });
  }
  traverse(id);
  return childrenIdsList.value();
};

TreeNodeList.prototype.firstChildId = function(parentId) {
  if (parentId === undefined) {
    parentId = null;
  }
  
  var childrenIds = this.immediateChildrenIds(parentId);
  var treeNodeList = this;
  
  for (var i = 0, len = childrenIds.length; i < len; i++) {
    // node without a previousSiblingId is first
    var previousSiblingId = this.node(childrenIds[i]).previousSiblingId;
    if (previousSiblingId === null) {
      return childrenIds[i];
    }
  }
  return null;
}

TreeNodeList.prototype.lastChildId = function(parentId) {
  if (parentId === undefined) {
    parentId = null;
  }
  
  var childrenIds = this.immediateChildrenIds(parentId);
  
  // an only child is also the last child
  if (childrenIds.length === 1) {
    return childrenIds[0];
  }

  // collect list of previousSiblingsIds
  var previousSiblingsIds = [];
  var treeNodeList = this
  _.forEach(childrenIds, function(childId) {
    var previousSiblingId = treeNodeList.node(childId).previousSiblingId;
    if (previousSiblingId !== null) {
      previousSiblingsIds.push(previousSiblingId);
    }
  });

  // id that does not appear in list of previousSiblingsIds is last
  for (var i = 0, len = childrenIds.length; i < len; i++) {
    if (previousSiblingsIds.indexOf(childrenIds[i]) === -1) {
      return childrenIds[i];
    }
  }
  return null;
}

TreeNodeList.prototype.nextSiblingId = function(nodeId) {
  // find the node whose previousSiblingId is the given nodeId
  var node = this.node(nodeId);
  
  if (!node) {
    return null;
  }
  
  var siblingsIds = this.immediateChildrenIds(this.node(nodeId).parentId);

  for (var i = 0, len = siblingsIds.length; i < len; i++) {
    if (this.node(siblingsIds[i]).previousSiblingId === nodeId) {
      return siblingsIds[i];
    }
  }
  return null;
}

TreeNodeList.prototype.add = function(newNode) {
  // check that newNode type matches TreeNodeList type
  if (newNode.type !== this.type) {
    throw new Error("Type mismatch, cannot add " + newNode.type + " to this TreeNodeList");
  }
  
  // check that new node references valid parent and previousSibling.
  // if parent is null, node is at the top-level
  // if previousSibling is null, node is first of current branch

  var id = newNode.id;
  var name = newNode.name;
  
  var parentId = newNode.parentId;
  var previousSiblingId = newNode.previousSiblingId;

  if (parentId !== null) {
    if (!this.contains(parentId)) {
      throw new Error("TreeNodeList.add() did not find parent id " + parentId + " for new node " + name);
    }
  }

  if (previousSiblingId !== null) {
    if (!this.contains(previousSiblingId)) {
      throw new Error("TreeNodeList.add() did not find previousSibling id " + previousSiblingId + " for new node " + name);
    }
  }

  // cannot repeat existing id
  if (this.contains(id)) {
    throw new Error("TreeNodeList.add() cannot add existing id: " + id + " for new node " + name);
  }

  // if previousSiblingId === null and childrenIds.length > 0
  // make previousSiblingId the last item
  if (previousSiblingId === null && this.immediateChildrenIds(parentId).length > 0) {
    newNode.previousSiblingId = this.lastChildId(parentId);
  }

  this.nodes.push(newNode);

  // update existing nodes
  // 
};

/* MOVED TO TRANSACTION-TREE-NODE-LIST
   TreeNodeList.prototype.recordTransaction = function(accounts, transaction) {
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
   var currency = transaction.currency;
   var amount = transaction.amount;

   var debitAccount = accounts.node(debit);
   var creditAccount = accounts.node(credit);

   var debitSign = accounts.accountSign(debit);
   var creditSign = accounts.accountSign(credit);

   if (!debitAccount.balance[currency.code]) {
   debitAccount.balance[currency.code] = 0;
   }
   
   if (!creditAccount.balance[currency.code]) {
   creditAccount.balance[currency.code] = 0;
   }
   
   debitAccount.balance[currency.code] += amount * debitSign;
   creditAccount.balance[currency.code] -= amount * creditSign;
   }
   
   this.add(transaction);
   };
*/

// build trees on demand
TreeNodeList.prototype.buildTreeHierarchy = function(rootId) {
  if (rootId === undefined) {
    rootId = null;
  }
  
  var result = { id: rootId, children: [] };
  var treeNodeList = this;

  function traverse(currentNode) {
    // use order given by previousSiblingsIds
    var lastChildId = treeNodeList.lastChildId(currentNode.id);

    if (lastChildId) {
      // initialize with lastChildId
      var orderedImmediateChildrenIds = [lastChildId];

      // keep looking back until null is found
      while(treeNodeList.node(lastChildId).previousSiblingId !== null) {
        lastChildId = treeNodeList.node(lastChildId).previousSiblingId;
        orderedImmediateChildrenIds.push(lastChildId);
      } 

      // get immediate children, add to own children and recurse
      for (var i = orderedImmediateChildrenIds.length - 1; i >= 0; i--) {
        var newNode = { id: orderedImmediateChildrenIds[i], children: [] };
        currentNode.children.push(newNode);
        traverse(newNode);
      }
    }
  }
  traverse(result);
  
  return result;
};

TreeNodeList.prototype.printTree = function(rootId) {
  var indent = "----";
  var result = "\n";
  var treeNodeList = this;
  
  function traverse(treeHierarchyNode, depth) {
    for (var i = 0; i < depth; i++) {
      result += indent;
    }
    // skip the parent with null id
    if (treeHierarchyNode.id) {
      result += treeHierarchyNode.id;

      var fullNode = treeNodeList.node(treeHierarchyNode.id);
      
      if (fullNode.amount) {
        result += " amt: " + fullNode.currency.code + " " + fullNode.amount;
      }

      if (fullNode.balance) {
        result += " bal: " + JSON.stringify(fullNode.balance);
      }
      
      if (fullNode.cumulativeTotal) {
        result += " cumul: " + JSON.stringify(fullNode.cumulativeTotal);
      }

      result += "\n";
    }
    
    _.forEach(treeHierarchyNode.children, function(child) {
      traverse(child, depth + 1);
    });
  }

  traverse(this.buildTreeHierarchy(rootId), 0);

  return result;
}

/* MOVED TO TRANSACTION-TREE-NODE-LIST
   TreeNodeList.prototype.currencies = function() {
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

   currencyTable.list = currenciesList.value();
   return currencyTable;;
   }
*/

TreeNodeList.prototype.tabulate = function(currencies) {
  var result = { id: null, children: [] };
  var treeNodeList = this;

  function separateToCurrencyColumn(fullNode, newNode, field) {
    if (fullNode[field]) {
      newNode[field] = JSON.stringify(fullNode[field]);
      _.forEach(currencies.list(), function(currencyCode) {
        if (fullNode[field][currencyCode]) {
          newNode[field + "In" + currencyCode] = formatMoney(currencies.node(currencyCode), fullNode[field][currencyCode]);
        }
      });
    }
  }
                
  function traverse(currentNode) {
    // use order given by previousSiblingsIds
    var lastChildId = treeNodeList.lastChildId(currentNode.id);

    if (lastChildId) {
      // initialize with lastChildId
      var orderedImmediateChildrenIds = [lastChildId];

      // keep looking back until null is found
      while(treeNodeList.node(lastChildId).previousSiblingId !== null) {
        lastChildId = treeNodeList.node(lastChildId).previousSiblingId;
        orderedImmediateChildrenIds.push(lastChildId);
      } 

      // get immediate children, add to own children and recurse
      for (var i = orderedImmediateChildrenIds.length - 1; i >= 0; i--) {
        var newNodeId = orderedImmediateChildrenIds[i];
        var fullNode = treeNodeList.node(newNodeId);
        var newNode = {
          id: newNodeId,
          name: fullNode.name,
          children: []
        };

        separateToCurrencyColumn(fullNode, newNode, "balance");
        separateToCurrencyColumn(fullNode, newNode, "cumulativeTotal");
        separateToCurrencyColumn(fullNode, newNode, "cumulativeBalance");
        separateToCurrencyColumn(fullNode, newNode, "totalForSelectedTransactions");
        
        /*
        if (fullNode.balance) {
          newNode.balance = JSON.stringify(fullNode.balance);
          _.forEach(currencies.list(), function(currencyCode) {            
            if (fullNode.balance[currencyCode]) {
              newNode["balanceIn" + currencyCode] = formatMoney(currencies.node(currencyCode), fullNode.balance[currencyCode]);
            }
          });
        }

        if (fullNode.cumulativeTotal) {
          newNode.cumulativeTotal = JSON.stringify(fullNode.cumulativeTotal);
          _.forEach(currencies.list(), function(currencyCode) {
            if (fullNode.cumulativeTotal[currencyCode]) {
              newNode["cumulativeTotalIn" + currencyCode] = formatMoney(currencies.node(currencyCode), fullNode.cumulativeTotal[currencyCode]);
            }
          });
        }

        if (fullNode.cumulativeBalance) {
          newNode.cumulativeTotal = JSON.stringify(fullNode.cumulativeBalance);
          _.forEach(currencies.list(), function(currencyCode) {
            if (fullNode.cumulativeBalance[currencyCode]) {
              newNode["cumulativeBalanceIn" + currencyCode] = formatMoney(currencies.node(currencyCode), fullNode.cumulativeBalance[currencyCode]);
            }
          });
        }

        if (fullNode.totalForSelectedTransactions) {
          newNode.cumulativeTotal = JSON.stringify(fullNode.totalForSelectedTransactions);
          _.forEach(currencies.list(), function(currencyCode) {
            if (fullNode.totalForSelectedTransactions[currencyCode]) {
              newNode["totalForSelectedTransactionsIn" + currencyCode] = formatMoney(currencies.node(currencyCode), fullNode.totalForSelectedTransactions[currencyCode]);
            }
          });
        }
        */

        // node is a transaction
        if (fullNode.amount) {
          if (fullNode.amount) {
            newNode["balanceIn" + fullNode.currency] = formatMoney(currencies.node(fullNode.currency), fullNode.amount);
          }
        }
        
        currentNode.children.push(newNode);
        traverse(newNode);
      }
    }
  }
  traverse(result);

  return result;
};

TreeNodeList.prototype.flatten = function(tree, depthDisplay) {
  tree = tree || this.buildTreeHierarchy();
  // prefixed value used in display
  depthDisplay = depthDisplay || function(depth) { return depth; };
  
  var nodeList = [];
  
  function traverse(node, depth) {
    nodeList.push((depthDisplay(depth) + " " + node.id).trim());
    for (var i = 0, len = node.children.length; i < len; i++) {
      traverse(node.children[i], depth + 1);
    }
  }
  traverse(tree, 0);
  return nodeList;
}

TreeNodeList.prototype.moveTo = function(nodeId, newParentId, newPreviousSiblingId) {
  var node = this.node(nodeId);
  
  // do nothing if request is to move to the same place 
  if (newParentId === node.parentId && newPreviousSiblingId === node.previousSiblingId) {
    return;
  }
  
  var newParent = this.node(newParentId);
  var newPreviousSibling = null;

  if (newPreviousSiblingId !== null) {
    newPreviousSibling = this.node(newPreviousSiblingId);
  }

  // stop if nodeId is invalid
  if (node === undefined) {
    throw new Error("moveTo() cannot find node " + nodeId);
  }
  
  // stop if newParentId or newPreviousSiblingId not found
  if (newParentId !== null) {
    if (this.node(newParentId) === undefined) {
      throw new Error("moveTo() cannot move " + nodeId + ", did not find newParentId " + newParentId)
    }
  }

  if (newPreviousSiblingId !== null) {
    if (this.node(newPreviousSiblingId) === undefined) {
      throw new Error("moveTo() cannot move " + nodeId + ", did not find newPreviousSiblingId " + newPreviousSiblingId);
    }
  }

  // stop if newPreviousSiblingId is not part of children of parentId
  var newSiblingIds = this.immediateChildrenIds(newParentId);
  if (newPreviousSiblingId !== null) {
    if (newSiblingIds.indexOf(newPreviousSiblingId) === -1) {
      throw new Error("moveTo() cannot move " + nodeId + ", newPreviousSiblingId " + newPreviousSiblingId + " does not belong to " + newParentId );
    }
  }

  // disallow move to own child
  var nodeChildren = this.immediateChildrenIds(nodeId);
  if (nodeChildren.indexOf(newParentId) !== -1) {
    throw new Error("Cannot move " + node.name + " to its own child, " + this.node(newParentId).name);
  }

  var nextSibling = this.firstChildId(node.parentId);
  
  var nextSiblingId = this.nextSiblingId(nodeId);
  
  if (nextSiblingId !== null) {
    nextSibling = this.node(nextSiblingId);
    // moving account will leave a gap, alter the previousSiblingId of
    // the next account
    nextSibling.previousSiblingId = node.previousSiblingId;
  }

  // if there is an account that will follow the moved account in the
  // destination, alter its previousSiblingId
  var newNextSibling = this.node(this.firstChildId(newParentId));

  if (newPreviousSiblingId !== null) {
    newNextSibling = this.node(this.nextSiblingId(newPreviousSiblingId));
  }

  if (newNextSibling !== undefined) {
    newNextSibling.previousSiblingId = nodeId;
  }

  // finally, alter moved account
  node.parentId = newParentId;
  node.previousSiblingId = newPreviousSiblingId;
};

TreeNodeList.prototype.isChildOf = function(nodeId, parentId) {
  var childrenIds = this.childrenIds(parentId);
  return childrenIds.indexOf(nodeId) > -1;
};

TreeNodeList.prototype.belongsTo = function(nodeId, parentId) {
  // node isChildOf parent or equals itself
  return nodeId === parentId || this.isChildOf(nodeId, parentId);
}

// TODO delete node
// Balances of ancestors must change
// Safer to allow deletion only when balance is zero
// Force transfer of balance to new node
TreeNodeList.prototype.deleteNode = function(nodeId) {
  return;
}

TreeNodeList.prototype.isAncestorOf = function(parentId, nodeId) {
  if (parentId === null) {
    return true;
  }
  
  var node = this.node(nodeId);
  var parentNode = this.node(nodeId);

  // ignore nonexistent nodes
  if (!node || !parentNode) {
    return false;
  }
  
  while (node.parentId) {
    if (parentId === node.parentId) {
      return true;
    }
    node = this.node(node.parentId);
  }
  return false;
}

TreeNodeList.prototype.rootId = function(id) {
  var treeNodeList = this;
  
  function traverse(currentNode) {
    if (currentNode.parentId === null) {
      return null;
    }
    
    var parentNode = treeNodeList.node(currentNode.parentId);

    if (parentNode.parentId === null) {
      // parent's parent is null, the chain ends
      return parentNode.id;
    } else {
      traverse(parentNode);
    }
  }

  return traverse(this.node(id));
}


/* MOVED TO TRANSACTION-TREE-NODE-LIST
// to be called with transactions only
TreeNodeList.prototype.computeCumulativeTotal = function(accounts, transactions) {
transactions = transactions || this.nodes;

if (transactions.length === 0) {
console.warn("Compute cumulativeTotal called with no transactions");
return;
}

if (transactions[0].type !== "transaction") {
throw new Error("computeCumulativeTotal() must be called as transactions.computeCumulativeTotal(accounts)");
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
var currency = transaction.currency;
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
*/


/* MOVED TO TRANSACTION-TREE-NODE-LIST
   TreeNodeList.prototype.accumulate = function() {
   var treeNodeList = this;

   function bubble_amount(source, money) {
   if (!source.cumulativeTotal[money.currency.code]) {
   source.cumulativeTotal[money.currency.code] = 0;
   }
   source.cumulativeTotal[money.currency.code] += money.amount;
   if (source.parentId) {
   bubble_amount(treeNodeList.node(source.parentId), money);
   }
   }

   if (this.nodes.length === 0) {
   // do nothing
   console.warn("accumulate() called with no nodes.");
   return;  
   }
   
   if (this.nodes[0].type !== "transaction") {
   console.warn("accumulate() is meant to be used for transactions.");
   return;
   }

   _.forEach(this.nodes, function(node) {
   node.cumulativeTotal = {};
   });

   var grandTotal = { cumulativeTotal: {} };

   _.forEach(this.nodes, function(node) {
   var currency = node.currency;
   var amount = node.amount;
   if (currency !== null && amount !== null) {
   bubble_amount(node, { currency: currency, amount: amount });

   // add to grandTotal
   if (!grandTotal.cumulativeTotal[currency.code]) {
   grandTotal.cumulativeTotal[currency.code] = 0;
   }
   
   grandTotal.cumulativeTotal[currency.code] += amount;
   }
   });

   var currencies = this.currencies();

   _.forEach(currencies.list(), function(currencyCode) {
   grandTotal["cumulativeTotalIn" + currencyCode] = formatMoney(currencies[currencyCode], grandTotal.cumulativeTotal[currencyCode]);
   });

   grandTotal.name = "Grand Total";
   
   return grandTotal;
   };
*/
