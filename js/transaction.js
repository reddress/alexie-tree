"use strict";

function Transaction(id, debit, credit, timestamp, currency, amount, description, parentId, previousSiblingId, display) {
  this.type = "transaction";

  this.id = id || null;
  this.debit = debit || null;  // "-JtPJqVjjkY2WyJKXeyO"   null if it is split
  this.credit = credit || null;  // "-JtPJqV_zwVl2E_2CZvg" null if it is split
  this.timestamp = timestamp || new Date().getTime();  // 1436037004534
  this.currency = currency || null;  // "BRL"  null if split
  this.amount = amount || 0;  // 1250
  this.description = description || "";  // "Opening balance"
  this.parentId = parentId || null;
  this.previousSiblingId = previousSiblingId || null;

  // make transaction compatible with account
  this.name = description;

  if (display === undefined) {
    this.display = true;
  } else {
    this.display = display;
  }
}
