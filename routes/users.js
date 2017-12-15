var express = require('express');
var router = express.Router();
var ejs = require('ejs');
var bcrypt = require('bcrypt');
var validator = require('validator');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey('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');
const db = require('../models/db');
var passwordValidator = require('password-validator');
var schema = new passwordValidator();
schema.is().min(8)
    .has().digits()
    .has().lowercase()
    .has().not().spaces();

//Register a new user
router.post('/register', function(req, res, next) {
    var Email = req.body.Email;
    var Password = req.body.Password;
    var FirstName = req.body.FirstName;
    var LastName = req.body.LastName;

    console.log("body: ", req.body);




    //  ENCRYPT PASSWORD USING BCRYPT
    bcrypt.hash(Password, 10, function(err, hash) {
        var validate = 1;
        //Validation
        if (!FirstName) {
            res.send({
                success: false,
                message: 'First Name is not available'
            });
            validate = 0;
        } else if (!LastName) {
            res.send({
                success: false,
                message: 'Last Name is not available'
            });
            validate = 0;
        } else if (!Email || !validator.isEmail(Email)) {
            res.send({
                success: false,
                message: 'email is not available'
            });
            validate = 0;
        } else if (!schema.validate(Password)) {
            res.send({
                success: false,
                message: 'Password must have 8 characters and digits combination'
            });
            validate = 0;
        }

        if (validate) {

            db.Users.findOne({
                where: {
                    Email: Email
                },
                raw: true
            }).then(function(user) {
                if (user) {
                    res.send({
                        success: false,
                        message: 'User already found'
                    });
                } else {
                    var code = Math.random();
                    console.log("code is: ", code);
                    var user = db.Users.build({
                        FirstName: FirstName,
                        LastName: LastName,
                        Email: Email,
                        Password: hash,
                        VerifyCode: code
                    });

                    console.log("user is: ", user);
                    // var final = "<a href = "+URL+code+">Click here</a>";
                    user.save().then(function(data) {

                        const msg = {
                            to: user.dataValues.Email,
                            from: 'app83217054@heroku.com',
                            subject: 'Verify your Digilock Account',
                            html: '<strong>Thank you for signing up.... :)</strong>'+
                            '<p>Now Click <a href="https://safe-tor-46764.herokuapp.com/verify?verifyCode='+ code + '">here</a> to Verify your account</p>',
                            // html: '<p>Click <a href="http://localhost:3000/">here</a> to Verify your account</p>',

                        };

                        //send email
                        sgMail.send(msg);
                        res.send({success: true});
                    }).catch(function(err) {
                        console.log(err);
                        res.send({
                            sucess: false,
                            message: "Error while saving user"
                        });
                    })

                }
            }).catch(function(err) {
                res.send({
                    success: false,
                    message: 'Error While finding user'
                });
            })
        }
    });
});

router.post('/login', function(req, res, next) {
    var Email = req.body.Email;
    var Password = req.body.Password;

    var validate = 1;
    if (!Email || !validator.isEmail(Email)) {
        res.send({
            success: false,
            message: 'Email is not Valid'
        });
        validate = 0;
    } else if (!Password) {
        res.send({
            success: false,
            message: 'Password is Empty'
        });
        validate = 0;
    }

    if (validate) {
        db.Users.findOne({
            where: {
                Email: Email
                
            }
        }).then(function(gethash) {
            if (gethash) {
                console.log("Password is: ", Password);
                console.log("ENCRYPT is: ", gethash.dataValues.Password);
                var user_id = gethash.dataValues.id;
                bcrypt.compare(Password, gethash.dataValues.Password, function(err, response) {
                    console.log(response);

                    if (response) {
                        db.Users.find({
                            where: {
                                'Email': Email
                                
                            },
                            raw: true
                        }).then(function(user) {
                            if (user) {
                                console.log("login found: ", user);
                                req.session.userId = user.id;
                                req.session.email = user.Email;
                                req.session.name = user.FirstName + ' ' + user.LastName;
                                res.send({
                                    success: true
                                });
                            } else {
                                res.send({
                                    success: false,
                                    message: 'User not found'
                                });
                            }
                        })
                    } else {
                        res.send({
                            success: false,
                            message: 'Password invalid'
                        });
                    }
                })
            } else {
                res.send({
                    success: false,
                    message: 'User not available'
                });
            }
        });
    }
});



module.exports = router;