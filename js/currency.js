"use strict";

function Currency(code, name, symbol, showCents, showSymbolOnLeft, display) {
  this.type = "currency";

  this.code = code || "";  // USD, BRL
  this.name = name || "";  // "U.S. Dollar"
  this.symbol = symbol || "";  // $, NT$
  this.showCents = showCents;
  this.showSymbolOnLeft = showSymbolOnLeft;

  this.id = code;
  this.parentId = null;
  this.previousSiblingId = null;

  // show currency column in tables?
  if (display === undefined) {
    this.display = true;
  } else {
    this.display = display;
  }
}
