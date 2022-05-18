var express = require('express');
var router = express.Router();
let models = require("../models");
var config = require('../config/config.json');
var passport = require('passport');
const Sequelize = require("sequelize");
var sequelize = new Sequelize(
    config.development.database, 
    config.development.username,
    config.development.password, {
        host: 'localhost',
        dialect: 'postgres',
        logging: false,
        pool: {
        max: 5,
        min: 0,
        idle: 10000
    }
});
/**
 * If not logged in then it will redirects every page to the admin login page
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
function checkAdminLogin(req, res, next) {
    var sess = req.session.user;
    try {
        if(!sess.username) {
            res.redirect("/admin/login");
        }
    } catch(err) {
        res.redirect("/admin/login");
    }
    next();
}



/**
 * This function checks whether any admin is logged in or not
 * If logged in then it will redirects login page to the dashboard
 */
function checkLoggedInAdmin(req, res, next) {
    try {
        if(req.session.admin) {
            res.redirect("/admin/dashboard");
        }
    } catch(err) {
        res.redirect("/admin/logout");
    }
    next();
}

var expressValidator = require('express-validator');
router.use(expressValidator())


async function middleHandler(req, res, next) {
    models.Users.findOne({ where: { username: (req.session.user.username) } }).then(async function (user) {
        if (user) {
            res.locals.sessionUserFullName = user.name;
            res.locals.sessionUserImage = user.image;
            res.locals.sessionUserPh = user.mobile;
            res.locals.sessionUserId = user.user_id;
            res.locals.sessionUserEmail = user.email;
        } else {
            //req.session.destroy();
            //res.redirect("/auth/signin");
            //req.logout();
            res.redirect('/');
        }

    });
    next();
}

router.get('/', function (req, res) {
    res.redirect('login');
});

const auth = require('../controller/admin/authController');
router.get('/login', checkLoggedInAdmin, auth.loadLoginPage);
router.post('/login', checkLoggedInAdmin, auth.checkLogin);
router.get('/logout', checkAdminLogin, middleHandler, auth.logout);

router.get('/register', checkLoggedInAdmin, auth.loadRegisterPage);
router.post('/register', checkLoggedInAdmin, auth.addNewUser);

const dashboard = require('../controller/admin/dashboardController');
router.get('/dashboard', checkAdminLogin, middleHandler, dashboard.loadDashboardPage);


const user = require('../controller/admin/userController');
router.get('/edit-user', checkAdminLogin, middleHandler, user.loadEditUserPage);
router.get('/developer', checkAdminLogin, middleHandler, user.loadDeveloperPage);


const project = require('../controller/admin/projectController');
router.get('/project/:id?', checkAdminLogin, middleHandler, project.loadProjectPage);
router.post('/add-project', checkAdminLogin, middleHandler, project.addNewProject);



module.exports = router;
