"use strict";

$(document).ready(function() {
  var cellsRenderer = function (row, columnfield, value, defaulthtml, columnproperties) {
    if (value.indexOf("(") !== -1) {
      return '<span style="color: #ff0000;">' + value + '</span>';
    }
  }

  var jqxDataFields = [
    { name: "name", type: "string" },
    { name: "children", type: "array" },
  ];

  // define balance, cumulativeBalance, totalForSelectedTransactions fields
  _.forEach(["cumulativeBalanceIn", "balanceIn", "totalForSelectedTransactionsIn"], function(fieldName) {
    _.forEach(currenciesList, function(currency) {
      jqxDataFields.push({
      name: fieldName + currency,
        type: "string",
      });
    });
  });
  
  var source = {
    dataType: "json",
    dataFields: jqxDataFields,
    hierarchy: {
      root: "children",
    },
    localData: accountsTreeTable,
    // id: "id",
  };

  var dataAdapter = new $.jqx.dataAdapter(source, {
    loadComplete: function() {
    }
  });

  var jqxColumns = [
    { text: "Name", columnGroup: "infoGroup", dataField: "name", },
  ];

  // define balance, cumulativeBalance, totalForSelectedTransactions columns

  _.forEach(currenciesList, function(currency) {
    jqxColumns.push({
      text: currency,
      columnGroup: "cumulativeBalanceGroup",
      dataField: "cumulativeBalanceIn" + currency,
      align: "right",
      cellsAlign: "right",
      cellsRenderer: cellsRenderer,
      width: 80,
    });
  });
  
  _.forEach(currenciesList, function(currency) {
    jqxColumns.push({
      text: currency,
      columnGroup: "balanceGroup",
      dataField: "balanceIn" + currency,
      align: "right",
      cellsAlign: "right",
      cellsRenderer: cellsRenderer,
      width: 80,
    });
  });
  
  _.forEach(currenciesList, function(currency) {
    jqxColumns.push({
      text: currency,
      columnGroup: "totalForSelectedTransactionsGroup",
      dataField: "totalForSelectedTransactionsIn" + currency,
      align: "right",
      cellsAlign: "right",
      cellsRenderer: cellsRenderer,
      width: 80,
    });
  });
  
  $("#treeGrid").jqxTreeGrid({
    source: dataAdapter,
    columns: jqxColumns,
    columnGroups: [
      { text: "Information", name: "infoGroup", align: "center" },
      { text: "Balance", name: "balanceGroup", align: "center" },
      { text: "Cumulative Balance", name: "cumulativeBalanceGroup", align: "center" },
      { text: "Total for selected transactions", name: "totalForSelectedTransactionsGroup", align: "center" },
    ],
  });

  // hide currencies with display: false
  _.forEach(currencies.nodes, function(currency) {
    if (!currency.display) {
      $("#treeGrid").jqxTreeGrid('hideColumn', 'totalForSelectedTransactionsIn' + currency.code)
      $("#treeGrid").jqxTreeGrid('hideColumn', 'cumulativeBalanceIn' + currency.code)
      $("#treeGrid").jqxTreeGrid('hideColumn', 'balanceIn' + currency.code)
    }
  });
});
