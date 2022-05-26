let models = require("../models");

exports.checkRole = (role)=> {
    var getRoleArray = role.split(",");
    return async function (req, res, next) {
        var checkRoleStatus = await models.Role.findAll({where:{role_name:  getRoleArray}});
        var tableRoleId = [];
        checkRoleStatus.forEach(element => {
            tableRoleId.push(element.role_id)
        });
        if(typeof req.session.user.role !== "undefined"  && tableRoleId.includes(req.session.user.role) == true){                     
            next();
        } else {
            res.redirect('/admin/login');
        }
    }
}