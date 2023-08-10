var express = require('express');
var router = express.Router();
var pool = require('./pool')
var upload = require('./multer');
var fs = require('fs')
var dotenv = require("dotenv");

dotenv.config();

const filepath = process.env.FILEPATH;

/* GET users listing. */
router.post('/submit', upload.any(), function (req, res, next) {
   console.log(req.files)
   pool.query("insert into model(categoryid,subcategoryid,companyid,modelname,year,icon) values(?,?,?,?,?,?)", [req.body.categoryid, req.body.subcategoryid, req.body.companyid, req.body.modelname, req.body.year, req.files[0].filename], function (error, result) {
      if (error) {
         console.log(error)
         res.status(500).json({ status: false, message: 'Server Error' })
      }
      else {

         res.status(200).json({ status: true, message: 'Model Submitted Successfully' })
      }



   })
});

router.post('/edit_picture', upload.single('icon'), function (req, res, next) {
   console.log(req.file)
   pool.query("update model set icon=? where modelid=?", [req.file.filename, req.body.modelid], function (error, result) {
      if (error) {
         console.log(error)
         res.status(500).json({ status: false, message: 'Server Error' })
      }
      else {
         fs.unlinkSync(`${filepath}/images/${req.body.oldicon}`);
         res.status(200).json({ status: true, message: 'Icon Updated Successfully' })
      }



   })

});

router.post('/edit_data', upload.single('icon'), function (req, res, next) {
   console.log(req.file)
   pool.query("update model set modelname=? where modelid=?", [req.body.modelname, req.body.modelid], function (error, result) {
      if (error) {
         console.log(error)
         res.status(500).json({ status: false, message: 'Server Error' })
      }
      else {

         res.status(200).json({ status: true, message: 'Model Updated Successfully' })
      }



   })

});

router.post('/delete_data', upload.single('icon'), function (req, res, next) {
   console.log(req.file)
   pool.query("delete from  model where modelid=?", [req.body.modelid], function (error, result) {
      if (error) {
         console.log(error)
         res.status(500).json({ status: false, message: 'Server Error' })
      }
      else {
         fs.unlinkSync(`${filepath}/images/${req.body.oldicon}`);
         res.status(200).json({ status: true, message: 'Model Deleted Successfully' })
      }



   })

});

router.get('/display_all_model', function (req, res, next) {
   pool.query("select M.*,(select categoryname from category C where C.categoryid=M.categoryid)as categoryname,(select subcategoryname from subcategory SC where SC.subcategoryid=M.subcategoryid )as subcategoryname,(select companyname from company Cmp where Cmp.companyid=M.companyid) as companyname from model M", function (error, result) {

      if (error) {
         res.status(500).json({ status: false, message: 'Server Error' })
      }
      else {
         res.status(200).json({ status: true, data: result })
      }

   })
})

router.post('/fetch_model_by_company', function (req, res, next) {
   pool.query("select S.*,(select C.companyname from company C where C.companyid=S.companyid) as companyname from model S where S.companyid=?", [req.body.companyid], function (error, result) {
      if (error) {
         console.log(error)
         res.status(500).json({ status: false, message: 'Server Error', result: [] })
      }
      else {

         res.status(200).json({ status: true, data: result })
      }
   })
})




module.exports = router;