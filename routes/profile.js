var express = require('express');
var router = express.Router();
var ejs = require('ejs');
var bcrypt = require('bcrypt');
var validator = require('validator');

const db = require('../models/db');

exports.getAboutPage = function(req, res) {

    if (req.session.userId) {
        ejs.renderFile('./views/user-account-info.ejs', function(err, result) {

            if (err) {
                console.log(err);
                res.send("An error occurred to get newsfeed page");
            } else
                console.log('getting newsfeed page');
            res.end(result);

        });
    } else {
        res.redirect('/');
    }

};

exports.getUserInfo = function(req, res) {
    var user_id = req.session.userId;
    console.log("User if in server is: ", user_id);

    db.Users.findOne({
        where: {
            id: user_id
        },
        raw: true
    }).then(function(user) {
        console.log(user);
        res.send({
            success: true,
            user: user
        });
    }).catch(function(err) {
        console.log(err);
        res.send({
            success: false,
            message: err.toString()
        });
    });
};

exports.updateUserPassword = function(req, res, next) {

    // router.post('/updatePassword', function(req, res, next){

    console.log("Here");

    var user_id = req.session.userId;
    var old_password = req.body.old_password;
    var new_password_1 = req.body.new_password_1;
    var new_password_2 = req.body.new_password_2;
    if (new_password_1 !== new_password_2) {
        return res.send({
            statusCode: 201
        });
    }
    if (old_password == new_password_1) {
        return res.send({
            success: false,
            message: "New Password can not be same as Old Password "
        });
    }
    db.Users.findOne({
        where: {
            id: user_id
        },
        attributes: ['id', 'Password', 'LastName', 'FirstName']
    }).then(function(gethash) {
        if (gethash) {
            var username = gethash.dataValues.FirstName + ' ' + gethash.dataValues.LastName;
            bcrypt.compare(old_password, gethash.dataValues.Password, function(err, response) {

                console.log(response);
                if (response) {
                    db.Users.count({
                        where: {
                            id: user_id
                        }
                    }).then(function(count) {
                        if (count == 1) {
                            bcrypt.hash(new_password_1, 10, function(err, hash) {
                                db.Users.update({
                                    Password: hash
                                }, {
                                    where: {
                                        id: user_id
                                    }
                                }).then(function(updated) {
                                    res.send({
                                        statusCode: 200,
                                        userName: username
                                    });
                                }).catch(function(err) {
                                    console.log(err);
                                    res.send({
                                        statusCode: 400,
                                        message: "Error while updating user password",
                                        userName: username
                                    });
                                });
                            });
                        } else {
                            res.send({
                                statusCode: 400,
                                userName: username
                            });
                        }
                    })
                } else {
                    res.json({
                        statusCode: 202,
                        userName: username
                    });
                }
            })
        } else {
            res.json({
                statusCode: 400
            });
        }
    });

};


exports.verifyCode = function(req, res) {
    var url = req.url;
    var unique_code = req.query.verifyCode;
    console.log("url is: ", url);
    console.log("code is: ", unique_code);
    db.Users.findOne({
        where: {
            VerifyCode: unique_code
        },
        raw: true
    }).then(function(user) {
        console.log("user here is: ", user);
        if (user) {
            db.Users.update({
                verified: 1
            }, {
                where: {
                    id: user.id
                }
            }).then(function(updated) {
                console.log("updated");
                req.session.userId = user.id;
                req.session.email = user.Emai;
                req.session.name = user.FirstName + ' ' + user.LastName;
                res.redirect('/userAboutPage');
            }).catch(function(err) {
                console.log(err);
                res.send({
                    statusCode: 400,
                    message: "Error while Verifying",
                    userName: username
                });
            });

        } else {
            res.redirect('/')
        }
    }).catch(function(err) {
        console.log("err is: ", err);
        res.send({
            success: false
        });
    })

    // res.send({success:true});
};


function logout(req, res) {
    req.session.destroy();
    res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0,post-check=0,pre-check=0');
    res.redirect('/');

}

exports.logout = logout;