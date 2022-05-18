let models = require("../../models");
const { Op } = require("sequelize");
const bcrypt = require("bcrypt");
var multiparty = require('multiparty');
var bodyParser = require('body-parser');


exports.loadLoginPage = async function(req, res, next) {    
    res.render('admin/auth/login', {
        title:"Login | ETMS",       
        s_msg: req.flash('info'),
        e_msg: req.flash('err')
    }); 
}


/**
 * Check login of the admin/operator users
 */
exports.checkLogin = async function(req, res, next) {
    var username = req.body.username;
    var password = req.body.password;

    if(username != '' && password != '') {
        var user = await models.Users.findOne({where:{[Op.or]: [{ email: username }, { username: username }]}});
        if(user) {
            if(user.status  == 'Yes'){
                bcrypt.compare(password, user.password, function(err, result) {
                    if(err) {
                        req.flash('err',"Invalid password!");
                        return res.redirect("login");
                    } 
                    
                    if(result) {
                        req.session.user = user;
                        return res.redirect('dashboard');
                    } else {
                        req.flash('err',"Invalid username or password!");
                        return res.redirect("login");
                    }
                });
            }else{
                req.flash('err',"You are not yet approved!");
                return res.redirect("login");
            }
            
        } else {
            req.flash('err',"Invalid user!");
            return res.redirect("login");
        }
    } else {
        req.flash('err',"All fields are mandatory");
        return res.redirect("login");
    }
}



/**
 * Logout admin from the system and destroy session
 */
exports.logout = function(req, res, next) {
    //sess = req.session;
    
    req.session.destroy(function(err) {
        if(err){
            msg = 'Error destroying session';
            res.json(msg);
        }else{
            msg = 'Session destroy successfully';
            console.log(msg)
            return res.redirect('/admin/login');
        }
    });
}


exports.loadRegisterPage = async function(req,res){
    var roles = await models.Role.findAll();
    res.render('admin/auth/register', {
        title:"Register | ETMS",
        roles : roles,
        s_msg: req.flash('info'),
        e_msg: req.flash('err')
    });
}


exports.addNewUser = async function(req,res){    
    var form = new multiparty.Form();
    form.parse(req, async function (err, fields) {
        if(fields.username !='' && fields.fullname !='' && fields.email !='' && fields.password !='' && fields.role !=''){
            var checkEmail = await models.User.findAll({where:{email :fields.email }});
            if(checkEmail.length == 0){
                var checkUsername = await models.User.findAll({where:{username :fields.username }});
                if(checkUsername == 0){
                    var password = fields.password[0];
                    var hash = bcrypt.hashSync(password, 10);
                    var checkRole = await models.Role.findOne({where :{ role_id : fields.role}});
                    var status = '';
                    if(checkRole.role_name == 'Administrator'){
                        status = 'Yes';
                    }else{
                        status = 'No';
                    }
                    //console.log(status);
                    models.User.create({
                        username: fields.username[0],
                        name: fields.fullname[0],
                        email: fields.email[0],
                        password: hash,
                        role : fields.role,
                        status : status
                    }).then(function (crt) {
                        if(crt){
                            req.flash('info',"You are successfully register");
                            return res.redirect("login");
                        }else{
                            req.flash('err',"Something wrong! please try again later");
                            return res.redirect("register");
                        }
                    })
                }else{
                    req.flash('err',"Username already exist");
                return res.redirect("register");
                }                
            }else{
                req.flash('err',"Email already exist");
                return res.redirect("register");
            }
            
        }else{
            req.flash('err',"All fields are mandatory");
            return res.redirect("register");
        }
    })    
}