var express = require('express');
var router = express.Router();

const home = require('../controller/etms/homeController'); 
router.get('/home',home.home);

const email = require('../controller/etms/contactusemailController'); 
router.post('/send',email.email);

const blog = require('../controller/etms/blogController'); 
router.get('/blog/:cat_id?',blog.list);

module.exports = router;