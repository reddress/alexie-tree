"use strict";

var accounts = [];

var authData = firebaseRef.getAuth();

if (authData) { 
  sandboxLoad();
} else {
  console.log("not logged in");
}

function sandboxLoad() {
  loadFromFirebase("accounts", accountsLoaded);
}

function accountsLoaded(firebaseAccounts) {
  accounts = firebaseAccounts;
}

function sandboxSave() {
  // firebaseRef.set({ title: 'hello ' + email + " " + new Date() });
  // console.log(email);
  // console.log("saved at " + new Date());

  // saveToFirebase(firebaseRef, "sandbox/main", "main email: " + email);
  // saveAccount(firebaseRef, { id: 1, name: "Assets", parent: 0 });
  // saveCurrency(firebaseRef, { id: 1, name: "Brazilian Real", symbol: "BRL", display: "R$" });

  var acctAssets = new Account(null, "Assets");
  acctAssets.save();
  accounts.push(acctAssets);

  var acctExpenses = new Account(null, "Expenses");
  acctExpenses.save();
  accounts.push(acctExpenses);

  var acctWallet = new Account(acctAssets.key, "Wallet");
  acctWallet.save();
  accounts.push(acctWallet);
  
  // var currencyUSD = new Currency();
}

function saveSampleTransaction() {
  var trOpen = new Transaction(accounts[0].key, accounts[1].key, 0, 0, 0, 0);
  trOpen.save();
}
