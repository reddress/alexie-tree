"use strict";

function Currency(code, name, symbol, showCents, showSymbolOnLeft) {
  this.code = code || "";  // USD, BRL
  this.name = name || "";  // "U.S. Dollar"
  this.symbol = symbol || "";  // $, NT$
  this.showCents = showCents;
  this.showSymbolOnLeft = showSymbolOnLeft;
}
