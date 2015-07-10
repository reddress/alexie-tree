"use strict";

$(document).ready(function() {
  $(".no-fouc").removeClass('no-fouc');

  var tabIds = { "transactions": 0, 
                 "accounts": 1 };
  
  transactions.renderTable(currencies, accounts, "transactionsTreeGrid");
  accounts.renderTable(currencies, this, "accountsTreeGrid");

  $("#chartTabs").jqxTabs({
    width: "100%",
    height: "100%",
    position: "top",
    animationType: "none",
  });

  $(".jqxPanelClass").jqxPanel({
    height: "100%",
    width: "100%",
  });
});
