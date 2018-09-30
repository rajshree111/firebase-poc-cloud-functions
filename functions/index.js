const functions = require('firebase-functions');
const cors = require("cors")({ origin: true });
var admin = require("firebase-admin");
var serviceAccount = require("./serviceAccountKey.json");
var firebaseClient = require('firebase');
var passwordHash = require('password-hash');

exports.testFunc = functions.https.onRequest((req, res) => {
  cors(req, res, () => {});
  res.set('Access-Control-Allow-Origin', "*");
  res.set('Access-Control-Allow-Methods', 'GET, POST');


  if(!admin.apps.length){
        admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://test-auth-a.firebaseio.com"
  })
}

if(!firebaseClient.apps.length){
  firebaseClient.initializeApp(config)
}

  console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@' + req.body.email);

  admin.auth().getUserByEmail(req.body.email)
  .then(function(userRecord) {
    var uid = userRecord.uid;
    var pass = userRecord.passwordHash;
    var userPass = req.body.password;
     firebaseClient.auth().signInWithEmailAndPassword(req.body.email,req.body.password).then(value => {  
      return theToken(uid,res);  
          })
          .catch(err => {
            console.log(' .......... '+ err);
            return passwordWrong(uid,res);
          });

          return theToken(uid,res);  
  })
  .catch(function(error) {
    console.log("Error fetching user data:", error);
  });

})

theToken = function(uid,res){
  admin.auth().createCustomToken(uid)
    .then(function(customToken) {
            return res.status(200).json({ 
                  message: customToken.toString()
                });
    })
    .catch(function(error) {
      console.log("Error creating custom token:", error);
    });
    
}

passwordWrong= function(uid,res){
  return res.status(200).json({ 
    message: 'password invalid'
  });
}
const config = {
  apiKey: "AIzaSyBgL-UIryin5me3ZPaCkKgDEcbkUCf3tEM",
  authDomain: "test-auth-a.firebaseapp.com",
  databaseURL: "https://test-auth-a.firebaseio.com",
  projectId: "test-auth-a",
  storageBucket: "",
  messagingSenderId: "764222078854"
};