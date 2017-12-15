var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var http = require('http');
var expressSession = require("express-session");
var MySQLStore = require('express-mysql-session')(expressSession);
var index = require('./routes/index');
var users = require('./routes/users');
var profile = require('./routes/profile');
var app = express();

//MySQL connection
var options = {
    host: 'digilock.crlh1n1lseo6.us-west-2.rds.amazonaws.com',
    port: 3306,
    user: 'root',
    password: 'rootroot',
    database: 'digilockDB',
    schema: {
        tableName: 'sessions',
        columnNames: {
            session_id: 'session_id',
            expires: 'expires',
            data: 'data'
        }
    }
};

var sessionStore = new MySQLStore(options);

//SETTING UP SESSION
app.use(expressSession({
    key: 'session_cookie_digilock',
    secret: 'digilockDB',
    resave: false,
    saveUninitialized: false,
    cookie: {},
    store: sessionStore

}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
// app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.set("public", path.join(__dirname, 'public'));

//routes
app.use('/', index);
app.use('/users', users);
app.get('/userAboutPage', profile.getAboutPage);
app.post('/getInfo', profile.getUserInfo);
app.post('/updatePassword', profile.updateUserPassword);
app.get('/logout', profile.logout);
app.get('/verify', profile.verifyCode);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
});

app.set('port', process.env.PORT || 3000);
/**   
 * Create HTTP server.    
 */
http.createServer(app).listen(app.get('port'), function() {
    console.log('Digilocks Express server listening on port ' + app.get('port'));
});
module.exports = app;