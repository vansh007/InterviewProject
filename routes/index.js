var express = require('express');
var router = express.Router();
/* GET home page. */
router.get('/', function(req, res, next) {
    console.log("index js: ", req.session.userId);

    if (req.session.userId) {
        res.render('user-account-info');
    } else {

        res.render('index-register1');
    }

});

module.exports = router;