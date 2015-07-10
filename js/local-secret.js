"use strict";

$(document).ready(function() {
  $(".no-fouc").removeClass('no-fouc');

  var tabIds = { "accounts": 0, 
                 "transactions": 1 };
  
  transactions.renderTable(currencies, accounts, "transactionsTreeGrid");
  accounts.renderTable(currencies, this, "accountsTreeGrid");

  $("#chartTabs").jqxTabs({
    width: "100%",
    height: "100%",
    position: "top",
    animationType: "none",
    scrollable: true,
  });


  $(".jqxPanelClass").jqxPanel({
    autoUpdate: true,
    height: "100%",
    width: "100%",
  });
});
