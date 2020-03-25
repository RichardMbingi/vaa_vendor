const functions = require('firebase-functions');

const app = require('express')();

const FBAuth = require('./util/fbAuth');

const { getAllItems, postOneItem } = require('./handlers/items');
const { signup, login, uploadImage, addUserDetails} = require('./handlers/users');

//?Item routes
app.get('/items', getAllItems);
app.post('/item', FBAuth, postOneItem);

//?Users routes
app.post('/signup', signup);
app.post('/login', login)
app.post('/user/image', FBAuth, uploadImage);
app.post('/user', FBAuth, addUserDetails);

exports.api = functions.region('europe-west1').https.onRequest(app);

