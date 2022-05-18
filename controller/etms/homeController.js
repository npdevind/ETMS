const express = require('express');
var app = express();
var bodyParser = require('body-parser');
var models = require('../../models');
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
        pool: {
            max: 5,
            min: 0,
            idle: 10000
    }
});

exports.home = async function(req,res){

    return res.render("etms/home/index",{
        contactTableDetails :[],
        arrTeamData:  [],
        arrtypeCount :[],
        ARR_PortTypeCount :  [],
        arrFeatureData : [],
        arrServiceData : [],
        arrAboutUsData : [],
        arrTestimonialData :  [],
        arrFaqlData : [],
        helper: helper
    });

    
}