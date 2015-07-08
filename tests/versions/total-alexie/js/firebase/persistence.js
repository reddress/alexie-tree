"use strict";

// include after data definitions (Account, Currency, Transaction, etc.)

function getUserRef() {
  return firebaseRef.child(authData.auth.uid);
}

// Generic function to choose a path and save to Firebase
// assumes firebaseRef and authData are loaded already
function saveToFirebase(path, data, callback) {
  callback = callback || function() { };  // do nothing if there is no callback
  try {
    $.blockUI({ message: "Saving to Firebase..." });
    getUserRef().child(path).set(data, function(err) {
      $.unblockUI();
      if (err) {
        throw new Error("Error: saveToFirebase() " + err);
      } else {
        callback();
      }
    });
  } catch (e) {
    throw new Error("Error: saveToFirebase() " + e);
    $.unblockUI();
  }
}

function pushToFirebase(path, data, callback) {
  callback = callback || function() { };  // do nothing if there is no callback
  try {
    $.blockUI({ message: "Saving to Firebase..." });
    var newDataRef = getUserRef().child(path).push(data, function(err) {
      $.unblockUI();
      if (err) {
        throw new Error("Error: pushToFirebase() " + err);
      } else {
        data.key = newDataRef.key();
        callback();
      }
    });
  } catch (e) {
    throw new Error("Error: pushToFirebase() " + e);
    $.unblockUI();
  }
}

// https://www.firebase.com/docs/web/guide/retrieving-data.html
function loadFromFirebase(path, callback) {
  callback = callback || function() { };  // do nothing if there is no callback
  try {
    $.blockUI({ message: "Loading from Firebase..." });
    getUserRef().child(path).on("value", function(snapshot) {
      callback(snapshot.val());
      $.unblockUI();
    }, function(err) {
      throw new Error("Error: loadFromFirebase() " + e);
    });
  } catch (e) {
    throw new Error("Error: loadFromFirebase() " + e);
  }
}

Account.prototype.save = function(callback) {
  // saveToFirebase("accounts/" + this.id, this);
  pushToFirebase("accounts", this, callback);
};

Currency.prototype.save = function(callback) {
  saveToFirebase("currencies/" + this.symbol, this, callback);
};

Transaction.prototype.save = function(callback) {
  pushToFirebase("transactions", this, callback);
};

