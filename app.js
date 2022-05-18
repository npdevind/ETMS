/**
 * Required External Modules
 */
const express = require("express");
const session = require('express-session');
const flash = require('connect-flash');
const path = require("path");
const cors = require('cors');
const bodyParser = require("body-parser");
const moment = require('moment');
const routes = require("./routes");
var partials = require('express-partials');
var favicon = require('static-favicon');
var expressValidator = require('express-validator');
var models = require("./models");
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var createError = require('http-errors');





/**
 * App Variables
 */
const app = express();
app.set('port', process.env.PORT || 4200);
var server = app.listen(app.get('port'), function () {

    models.sequelize.sync().then(() => {
        console.log('model load');
    }).catch(function (e) {
        console.log(e);
        throw new Error(e);
    });
    console.log('Express server listening on port ' + server.address().port);
    //debug('Express server listening on port ' + server.address().port);
});

app.locals.adminbaseurl = 'http://localhost:' + server.address().port + '/admin/';
app.locals.baseurl = 'http://localhost:' + server.address().port + '/';
app.locals.logouturl = 'http://localhost:' + server.address().port + '/';



/**
 *  App Configuration
 */
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(partials());
app.use(favicon());
app.use(session({ secret: 'asdf4321', saveUninitialized: true, resave: true }));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use('/favicon.ico', express.static(path.join(__dirname, 'favicon.ico')));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(flash());


// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//     next(createError(404));
//   });

/**
 * Routes Definitions
 */
app.use('/', routes);
var etms = require('./routes/etms');
app.use('/', etms);

var admin = require('./routes/admin');
app.use('/admin', admin);




app.use(expressValidator()); // Add this after the bodyParser middlewares!
module.exports = app;
