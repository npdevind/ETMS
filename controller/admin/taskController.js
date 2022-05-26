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


exports.loadTaskPage = async function(req,res){
    var projects = await sequelize.query(`select a.project_name, a.project_id from projects as a
    left join user_project as b on b.project_id = a.project_id
    left join users as c on c.user_id = b.user_id
    where c.user_id = ${req.session.user.user_id} and a.status = 'Active'`,{ type: Sequelize.QueryTypes.SELECT });
    if(projects){
        return res.render('admin/task/main_page', {
            title:'Task',
            messages: req.flash('info'),
            errors: req.flash('err'),
            helper: helper,
            projects : projects
        })
    }else{
        
    }
}
