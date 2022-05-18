let models = require("../../models");
const { Op } = require("sequelize");
var helper = require('../../helpers/helper_function');
var config = require('../../config/config.json');
const Sequelize = require("sequelize");
var sequelize = new Sequelize(
    config.development.database, 
    config.development.username,
    config.development.password, {
    host: 'localhost',
    dialect: 'postgres',
    logging: false,
    pool: 
    {
        max: 5,
        min: 0,
        idle: 10000
    }
});


exports.loadEditUserPage = async function(req,res){
    var sessionId = req.session.user.user_id;
    var userTableDetails = await models.Users.findOne({where:{user_id:sessionId}});
    if(userTableDetails){
        return res.render('admin/user/edit', {
            userTableDetails:userTableDetails,
            title:'Update Your Details',
            s_msg: req.flash('info'),
            e_msg: req.flash('err'),
            helper: helper
        })
    }
}

exports.loadDeveloperPage = async function(req,res){
    // var userTableDetails = await models.Users.findAll({where: {role: { [Op.not]: 2}}});
    var userTableDetails = await sequelize.query("select a.name, a.email, b.role_name, a.status from users as a "+
    "left join role as b on a.role = b.role_id where a.role != 2",{ type: Sequelize.QueryTypes.SELECT })
    if(userTableDetails){
        return res.render('admin/user/developer_list', {
            userTableDetails:userTableDetails,
            title:'Developers',
            s_msg: req.flash('info'),
            e_msg: req.flash('err'),
            helper: helper
        })
    }
}