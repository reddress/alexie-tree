"use strict";

function Account(id, name, sign, parentId, previousSiblingId) {
  this.type = "account";
  
  this.id = id || null;
  this.name = name || "";
  this.sign = sign || 1;
  this.parentId = parentId || null;
  this.previousSiblingId = previousSiblingId || null;

  // save balance in order to avoid having to download the entire transaction
  // history to re-compute balance
  this.balance = {};
}

Account.prototype.clearBalance = function() {
  this.balance = {};
};
