"use strict";

$(document).ready(function() {
  // add Grand Total
  transactionsTreeTable.children.splice(0, 0, transactionsGrandTotal);
  
  var cellsRenderer = function (row, columnfield, value, defaulthtml, columnproperties) {
    if (value.indexOf("(") !== -1) {
      return '<span style="color: #ff0000;">' + value + '</span>';
    }
  }

  var jqxDataFields = [
    { name: "name", type: "string" },
    { name: "children", type: "array" },
  ];

  // define balance and cumulativeTotal fields
  _.forEach(["cumulativeTotalIn", "balanceIn"], function(fieldName) {
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
    localData: transactionsTreeTable,
    // id: "id",
  };

  var dataAdapter = new $.jqx.dataAdapter(source, {
    loadComplete: function() {
    }
  });

  jqxColumns = [
    { text: "Name", columnGroup: "infoGroup", dataField: "name", minWidth: 200 },
  ],

  // define balance and cumulativeTotal columns

  _.forEach(currenciesList, function(currency) {    jqxColumns.push({
    text: currency,
    columnGroup: "cumulativeTotalGroup",
    dataField: "cumulativeTotalIn" + currency,
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
  
  $("#treeGrid").jqxTreeGrid({
    source: dataAdapter,
    columns: jqxColumns,
    columnGroups: [
      { text: "Information", name: "infoGroup", align: "center" },
      { text: "Balance", name: "balanceGroup", align: "center" },
      { text: "Cumulative Total", name: "cumulativeTotalGroup", align: "center" },
    ],
  });

  // hide currencies with display: false
  _.forEach(currencies.nodes, function(currency) {
    if (!currency.display) {
      $("#treeGrid").jqxTreeGrid('hideColumn', 'cumulativeTotalIn' + currency.code)
      $("#treeGrid").jqxTreeGrid('hideColumn', 'balanceIn' + currency.code)
    }
  });
});
