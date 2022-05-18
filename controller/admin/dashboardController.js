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
        pool: {
            max: 5,
            min: 0,
            idle: 10000
    }
});


exports.loadDashboardPage = async function(req,res){
    var userTableDetails = await models.Users.findOne({where:{status:'Yes'}});
    if(userTableDetails){
        return res.render('admin/dashboard/page', {
            userTableDetails:userTableDetails,
            title:'Dashboard',
            s_msg: req.flash('info'),
            e_msg: req.flash('err'),
            helper: helper
        })
    }
}



