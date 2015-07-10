"use strict";

$(document).ready(function() {
  $(".no-fouc").removeClass('no-fouc');

  $("#chartRibbon").jqxRibbon({
    height: "100%",
    width: "100%",
    position: "top",
    selectionMode: "click",
    animationType: "fade",
  });

  transactions.renderTable(currencies, accounts, "transactionsTreeGrid");

  accounts.renderTable(currencies, this, "accountsTreeGrid");
});
