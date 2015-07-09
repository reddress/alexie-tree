"use strict";

// given a list or dictionary of elements, build a tree by reading parent value
// in each element
function buildTree(lst) {
  var result = { id: null, children: [] };

  // elements are likely not to be in correct order
  var seen = [null];
  var ids = [null];
  var queue = [];

  function bubble_amount(source, money) {
    if (!totals[source.id][money.currency.code]) {
      totals[source.id][money.currency.code] = 0;
    }
    totals[source.id][money.currency.code] += money.amount;
    _.forEach(queue, function(queueElement) {
      if (queueElement.id === source.parent) {
        bubble_amount(queueElement, money);
      }
    });
  }
  
  // fill queue
  _.forEach(lst, function(element) {
    queue.push(element);
    if (!_.contains(ids, element.id)) {
      ids.push(element.id);
    }
  });

  // if an element references a non-existent parent or sibling, remove it
  _.forEach(queue, function(element) {
    if (!_.contains(ids, element.parent)) {
      throw new Error("buildTree(): Element has no matching parent. Removing: " + element.id);
      _.remove(queue, { id: element.id });
    }

    // check that previousSibling exists
    if (!_.contains(ids, element.previousSibling)) {
      console.log("buildTree(): Element has no matching previous sibling. Removing: " + element.id);
      _.remove(queue, { id: element.id });
    }
  });

  // accumulate totals for split transactions, check existence only
  // for the first item. If not, assume we were given accounts
  if (queue[0].type === "transaction") { 
    var totals = {};

    // initialize totals
    _.forEach(queue, function(transaction) {
      totals[transaction.id] = {};
    });

    // sum amounts
    _.forEach(queue, function(transaction) {
      if (transaction.amount !== 0) {
        if (!totals[transaction.id][transaction.currency.code]) {
          totals[transaction.id][transaction.currency.code] = 0;
        }
        bubble_amount(transaction, { currency: transaction.currency, amount: transaction.amount });
      } 
    });
  }
  
  // traverse tree, looking for match between child's parent id and branch id
  function addToChildren(node, child) {
    // both the parent and previousSibling must have been seen, return to end
    // of queue otherwise
    if (!_.contains(seen, child.parent) || !_.contains(seen, child.previousSibling)) {
      queue.push(child);
    } else {
      if (child.parent === node.id) {
        
        // copy totals
        if (child.type === 'transaction') {
          if (totals[child.id]) {
            child.totals = totals[child.id];
          }
        }

        if (!child.children) {
          child.children = [];
        }

        // insert in proper place based on previousSibling
        var insertAtIndex = 0;  // if previousSibling is null
        
        node.children.splice(insertAtIndex, 0, child);

        // set the previousSibling for the next element
        node.children[insertAtIndex + 1].previousSibling = child.id;
        
        seen.push(child.id);
      } else {
        _.forEach(node.children, function(branch) {
          addToChildren(branch, child);
        });
      }
    }
  }

  while (_.size(queue) > 0) {
    addToChildren(result, queue.shift());
  }
  
  return result;
}

// display tree as text
function printTree(tree) {
  var indent = "----";
  var result = "";

  function traverse(branch, depth) {
    for (var i = 0; i < depth; i++) {
      result += indent;
    }
    // skip the parent with null id
    if (branch.id) {
      result += branch.id;

      if (branch.amount) {
        result += " " + branch.amount;
      }

      if (branch.totals) {
        result += " " + JSON.stringify(branch.totals);
      }


      if (branch.balance) {
        result += " " + JSON.stringify(branch.balance);
      }
      
      result += "\n";
    }
    
    _.forEach(branch.children, function(child) {
      traverse(child, depth + 1);
    });
  }

  traverse(tree, -1);

  return result;
}

