const functions = require('firebase-functions');
const cors = require("cors")({ origin: true });
var admin = require("firebase-admin");
var serviceAccount = require("./serviceAccountKey.json");
var firebaseClient = require('firebase');

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

  console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@' + req.body.email);

  admin.auth().getUserByEmail(req.body.email)
  .then(function(userRecord) {
    var uid = userRecord.uid;
    console.log('####################################' + theToken(uid));
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