var express = require('express');
var router = express.Router();
var pool = require('./pool')
var upload = require('./multer');
var fs = require('fs');
var dotenv = require('dotenv');
dotenv.config();
const filepath = process.env.FILEPATH;

router.post('/submit', upload.single('icon'), function(req, res, next){
    console.log(req.files)
    pool.query("insert into category(categoryname, icon) values(?,?)",
    [
        req.body.categoryname,
        req.file.filename
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

router.get('/display_category', function(req, res, next){
    pool.query('select * from category', function(error, result){
        if(error)
        {
            res.status(500).json({status:false, message:'Server Error'})
        }
        else
        {
            res.status(200).json({data:result, status:true})
        }
    });
});

router.post('/edit_icon', upload.single('icon'), function(req, res,next){
    //console.log(req.body)
    //console.log(req.file.filename)
    pool.query("update category set icon=? where categoryid=?", 
    [  req.file.filename,
        req.body.categoryid
      
    ],
    function(error, result){
        if(error){
            res.status(500).json({status:false, message:'Server Error'})
        }
        else{ 
            fs.unlinkSync(`${filepath}/${req.body.oldicon}`);
            res.status(200).json({status:true, message: 'Icon Edited successfully'})
        }
    });
});

router.post('/edit_data', function(req, res,next){
    pool.query("update category set categoryname=? where categoryid=?", 
    [  
        req.body.categoryname,
        req.body.categoryid
    ],
    function(error, result){
        if(error){
            res.status(500).json({status:false, message:'Server Error'})
        }
        else{
            res.status(200).json({status:true, message: 'Icon Edited successfully'})
        }
    });
});


router.post('/delete_data', function(req, res,next){
    pool.query("delete from category where categoryid=?", 
    [  
        req.body.categoryid 
    ],
    function(error, result){
        if(error){
            res.status(500).json({status:false, message:'Server Error'})
        }
        else{
            fs.unlinkSync(`${filepath}/${req.body.oldicon}`);
            res.status(200).json({status:true, message: 'Icon Edited successfully'})
        }
    });
});
module.exports = router;