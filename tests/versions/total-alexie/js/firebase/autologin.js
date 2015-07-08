"use strict";

function login() {
  firebaseRef.authWithPassword({
    email: "tina@tinacg.com",
    password: "tina"
  }, function(err, authData) {
    if (err) {
      throw new Error("Could not login as tina", error);
    } else {
      console.log("Logged in as tina", authData);
    }
  });
}

function logout() {
  firebaseRef.unauth();
}
