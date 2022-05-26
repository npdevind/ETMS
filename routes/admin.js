var express = require('express');
var router = express.Router();
let models = require("../models");
var config = require('../config/config.json');
var passport = require('passport');
var permission  = require('../config/permission.js');
const Sequelize = require("sequelize");
var sequelize = new Sequelize(
    config.development.database, 
    config.development.username,
    config.development.password, {
        host: 'localhost',
        dialect: 'postgres',
        logging: true,
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
    await models.Users.findOne({ where: { username: (req.session.user.username) } }).then(async function (user) {
        await sequelize.query(`select r.role_name from users as a left join role as r on r.role_id = a.role where a.user_id =`+user.user_id,
            { type: Sequelize.QueryTypes.SELECT }).then(async function(role){
            if (user) {
                res.locals.sessionUserFullName = user.name;
                res.locals.sessionUserImage = user.image;
                res.locals.sessionUserPh = user.mobile;
                res.locals.sessionUserId = user.user_id;
                res.locals.sessionUserEmail = user.email;
                res.locals.sessionUserRole = user.role;
                res.locals.sessionUserRoleName = role[0].role_name;
            } else {
                //req.session.destroy();
                //res.redirect("/auth/signin");
                //req.logout();
                res.redirect('/');
            }
        });
    })
    
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
router.get('/dashboard', checkAdminLogin,  middleHandler, permission.checkRole('Administrator,Developer'), dashboard.loadDashboardPage);


const user = require('../controller/admin/userController');
router.get('/edit-user', checkAdminLogin, middleHandler, permission.checkRole('Administrator,Developer'), user.loadEditUserPage);
router.get('/developer', checkAdminLogin, middleHandler, permission.checkRole('Administrator'), user.loadDeveloperPage);
router.get('/developer/:user_id?', checkAdminLogin, middleHandler, permission.checkRole('Administrator'), user.loadDeveloperEditPage);
router.get('/update-developer-status', checkAdminLogin, middleHandler, permission.checkRole('Administrator'), user.updateDeveloperStatus)

const project = require('../controller/admin/projectController');
router.get('/project/:id?', checkAdminLogin, middleHandler, permission.checkRole('Administrator'), project.loadProjectPage);
router.post('/add-project', checkAdminLogin, middleHandler, permission.checkRole('Administrator'), project.addNewProject);
router.get('/add-developer-for-project', checkAdminLogin, middleHandler, permission.checkRole('Administrator'), project.addDevForProject);
router.post('/post-add-developer-for-project', checkAdminLogin, middleHandler, permission.checkRole('Administrator'), project.addDevForProjectPost);
router.get('/remove-dev-from-project/:uid/:pid?',checkAdminLogin, middleHandler, permission.checkRole('Administrator'), project.removeDevFromProject )
router.get('/update-project-status', checkAdminLogin, middleHandler, permission.checkRole('Administrator'), project.updateProjectStatus);


const task = require('../controller/admin/taskController');
router.get('/task', checkAdminLogin, middleHandler, permission.checkRole('Developer'), task.loadTaskPage);

module.exports = router;
