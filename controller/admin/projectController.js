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
    logging: true,
    pool: 
    {
        max: 5,
        min: 0,
        idle: 10000
    }
});


exports.loadProjectPage = async function(req,res){
    
    var projectTableDetails = await models.Projects.findAll();
    var proArray = [];
    projectTableDetails.forEach(element => {
        proArray.push({
            id:    element.project_id,
            name:  element.project_name,
            des : element.project_des
        })
    });
    if(req.params.id){
        var projectData = await models.Projects.findOne({where:{project_id:req.params.id}});
        var assignDev = await sequelize.query("select * from users as a "+
        "left join user_project as b on b.user_id = a.user_id "+
        "left join role as c on c.role_id = a.role "+
        "where c.role_name= 'Developer' and b.project_id = "+req.params.id,{ type: Sequelize.QueryTypes.SELECT })
        return res.render('admin/project/list', {
            projectTableDetails:projectTableDetails,
            title:'Projects',
            messages: req.flash('info'),
            errors: req.flash('err'),
            helper: helper,
            proArray : proArray,
            projectData : projectData,
            assignDev : assignDev
        })
    }else{
        return res.render('admin/project/list', {
            projectTableDetails:projectTableDetails,
            title:'Projects',
            messages: req.flash('info'),
            errors: req.flash('err'),
            helper: helper,
            proArray : proArray,
            projectData : '',
            assignDev : ''
        })
    }
    
}




exports.addNewProject = async function(req,res){
    if(req.body.project !=''){
       await models.Projects.create({
        project_name : req.body.project,
        project_des : req.body.project_des
       }).then(function(addPro){
            if(addPro){
                req.flash('info','Successfully Created');
                return res.redirect('project'); 
            }else{
                req.flash('error','Something worng! Please try again.');
                return res.redirect('project'); 
            }
        })
    }else{
        req.flash('err',"Project name is required.");
        return res.redirect("project");
    }
}


exports.addDevForProject = async function(req,res){
    console.log(req.query.projectId);
    var getExistUser = await models.UserProject.findAll({where:{project_id : req.query.projectId}});
    console.log(getExistUser);
    var userListArray = [];
    var UserList = await models.Users.findAll({where :{id: {[Op.notIn]:[]}}})

}