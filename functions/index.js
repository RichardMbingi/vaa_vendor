const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const app = express();

admin.initializeApp();

exports.helloWorld = functions.https.onRequest((request, response) => {
    response.send("Hello world!");
});

app.get('/items', (req, res) => {
    admin.firestore().collection('items')
        .orderBy('createdAt', 'desc')
        .get()
        .then(data => {
            let items = [];
            data.forEach(doc => {
                items.push({
                    itemId: doc.id,
                    body: doc.data().body,
                    userHandle: doc.data().userHandle,
                    createdAt: doc.data().createdAt,
                });
            });
            return res.json(items);
        })
        .catch(err => console.error(err));
})

app.post('/item', (req, res) => {
    const newItem = {
        body: req.body.body,
        userHandle: req.body.userHandle,
        createdAt: new Date().toISOString()
    };

    admin.firestore()
        .collection('items')
        .add(newItem)
        .then(doc => {
            res.json({
                message: `document ${doc.id} created successfully`
            });
        })
        .catch(err => {
            res.status(500).json({
                error: 'Umebunt brathe'
            });
            console.error(err);
        })
});

exports.api = functions.region('europe-west1').https.onRequest(app);