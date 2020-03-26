//TODO:Log Vendor
//TODO:Input Vendor Information
//TODO:Input Signatory Information
//TODO:Input Store Information

const {
    admin,
    db
} = require('../util/admin')
const config = require('../util/config')
const firebase = require('firebase')

//! firebase.initializeApp(config);

const {
    validateSignupData,
    validateLoginData,
    reduceUserDetails
} = require('../util/validators')

//?Sign Up Vendor
exports.vsignup = (req, res) => {
    const newVendor = {
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        vendorName: req.body.vendorName
    };

    const {
        valid,
        errors
    } = validateSignupData(newVendor);

    if (!valid) {
        return res.status(400).json(errors);
    }

    let token, vendorId;

    db.doc(`/vendors/${newVendor.vendorName}`).get()
        .then(doc => {
            return firebase.auth()
                .createUserWithEmailAndPassword(newVendor.email, newVendor.password)
        })
        .then((data) => {
            vendorId = data.user.uid;
            return data.user.getIdToken();
        })
        .then((idToken) => {
            token = idToken;
            const vendorCredentials = {
                vendorName: newVendor.vendorName,
                email: newVendor.email,
                createdAt: new Date().toISOString(),
                vendorId
            };
            return db.doc(`/vendors/${newVendor.vendorName}`).set(vendorCredentials);
        })
        .then(() => {
            return res.status(201).json({
                token
            });
        })
        .catch((err) => {
            console.error(err);
            if (err.code === 'auth/email-already-in-use') {
                return res.status(400).json({
                    email: 'Email is already registered'
                });
            } else {
                return res.status(500).json({
                    error: err.code
                });
            }
        })
}

//?Log vendor in
exports.vlogin = (req, res) => {
    const vendor = {
        email: req.body.email,
        password: req.body.password
    };

    const {
        valid,
        errors
    } = validateLoginData(vendor);

    if (!valid) {
        return res.status(400).json(errors);
    }

    firebase.auth().signInWithEmailAndPassword(vendor.email, vendor.password)
        .then(data => {
            return data.user.getIdToken();
        })
        .then(token => {
            return res.json({
                token
            })
        })
        .catch(err => {
            console.error(err);
            if (err.code === 'auth/wrong-password') {
                return res.status(403).json({
                    general: 'Wrong credentials, please try again'
                })
            } else {
                return res.status(500).json({
                    error: err.code
                });
            }
        })
}