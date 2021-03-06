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
    
    var projectTableDetails = await models.Projects.findAll({order: [['project_name', 'ASC']]});
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
                req.flash('error','Something wrong! Please try again.');
                return res.redirect('project'); 
            }
        })
    }else{
        req.flash('err',"Project name is required.");
        return res.redirect("project");
    }
}


exports.addDevForProject = async function(req,res){
    var getExistUser = await models.UserProject.findAll({where:{project_id : req.query.projectId}});
    var getExistUserArray = [];
    getExistUser.forEach(element => {
        getExistUserArray.push(element.user_id)
    });
    var getDevRole = await models.Role.findOne({attributes : ['role_id'], where:{role_name : 'Developer'}});
    getExistUserArray.push(getDevRole.role_id);
    getExistUserArray.push(req.session.user.user_id);
    var uniqueGetExistUserArray = [...new Set(getExistUserArray)];
    var UserList = await models.Users.findAll({where :{user_id: {[Op.notIn]:uniqueGetExistUserArray}}});
    
    if(UserList.length > 0){
        res.send({
            status : true,
            data : UserList
        })
    }else{
        res.send({
            status : false,
            data : ''
        })
    }
}

exports.addDevForProjectPost = async function(req,res){
    if(req.body.selectedUser){
        var dev = req.body.selectedUser;
        dev = dev.toString().split(",");
        jsonCreateData = [];
        dev.forEach(element => {
            jsonCreateData.push({
                project_id : req.body.add_dev_project_id,
                user_id : element
            })
        });
        models.UserProject.bulkCreate(jsonCreateData).then(function(crt){
            if(crt){
                req.flash('info',"Developers added successfully.");
                return res.redirect("project/"+req.body.add_dev_project_id);
            }else{
                req.flash('error','Something wrong! Please try again.');
                return res.redirect("project/"+req.body.add_dev_project_id); 
            }
        })        
    }else{
        req.flash('err',"Please select developer.");
        return res.redirect("project/"+req.body.add_dev_project_id);
    }
}

exports.removeDevFromProject = async function(req,res){
    if(req.params.uid && req.params.pid){
        models.UserProject.destroy({where:{project_id : req.params.pid, user_id : req.params.uid}}).then(function(det){
            if(det){
                req.flash('info',"Developers successfully remove.");
                return res.redirect('back');
            }else{
                req.flash('error','Something wrong! Please try again.');
                return res.redirect('back'); 
            }
        })
    }else{
        req.flash('error','Something wrong! Please try again.');
        return res.redirect('back'); 
    }
}


exports.updateProjectStatus = async function(req,res){
    if(req.query.pro_id && req.query.pro_status){
        await models.Projects.update({
            status: (req.query.pro_status == 'Active') ? 'Inactive' : 'Active'
         },{ where: { project_id: req.query.pro_id } 
        }).then(async function(upd){
            if(upd){
                var projectName = await models.Projects.findOne({attributes : ['project_name'], where:{project_id: req.query.pro_id}});
                res.send({
                    status : true,
                    projectName : projectName
                })
            }else{
                res.send({
                    status : false,
                    projectName : ''
                })
            }
        })
    }else{
        res.send({
            status : false,
            projectName : ''
        })
    }
}