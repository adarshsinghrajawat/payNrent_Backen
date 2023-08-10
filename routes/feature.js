var express = require('express');
var router = express.Router();
var pool = require('./pool')
var upload = require('./multer');
var fs = require('fs');
var dotenv = require('dotenv');
dotenv.config();

router.post('/submit', upload.any(), function(req, res, next){
    console.log(req.files)
    pool.query("insert into featured(image, link) values(?,?)",
    [
        req.files[0].filename,
        req.body.link
    ],
    function(error, result){
        if(error)
        {
            res.status(500).json({status:false, message:'Error'})
        }
        else
        {
            
            res.status(200).json({status:true, message: 'Category Submitted Successfully'})
        }
    });
});


module.exports = router;