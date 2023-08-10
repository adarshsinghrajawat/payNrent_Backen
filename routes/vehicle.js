var express = require('express');
var router = express.Router();
var pool = require('./pool')
var upload = require('./multer');
var fs = require('fs')
var dotenv = require("dotenv");
dotenv.config();
const filePath = process.env.FILEPATH;

/* GET users listing. */
router.post('/submit', upload.any(), function (req, res, next) {
   console.log(req.files)
   pool.query("insert into vehicle(categoryid,subcategoryid,companyid,modelid,vendorid,registration,color,fueltype,ratings,average,remarks,capacity,status,feature,icon) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
      [
         req.body.categoryid,
         req.body.subcategoryid,
         req.body.companyid,
         req.body.modelid,
         req.body.vendorid,
         req.body.registration,
         req.body.color,
         req.body.fueltype,
         req.body.ratings,
         req.body.average,
         req.body.remarks,
         req.body.capacity,
         req.body.feature,
         req.body.status,
         req.files[0].filename],
      function (error, result) {
         if (error) {
            console.log(error)
            res.status(500).json({ status: false, message: 'Server Error' })
         }
         else {

            res.status(200).json({ status: true, message: 'Vehicle Submitted Successfully' })
         }



      })
});
router.post('/edit_picture', upload.single('icon'), function (req, res, next) {
   console.log(req.file)
   pool.query("update vehicle set icon=? where vehicleid=?", [req.file.filename, req.body.vehicleid], function (error, result) {
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
   pool.query("update vehicle set categoryid=?,subcategoryid=?,companyid=?,modelid=?,vendorid=?,registrationno=?,color=?,fueltype=?,ratings=?,average=?,remarks=?,capacity=?,status=?,feature=? where vehicleid=?",
      [req.body.categoryid,
      req.body.subcategoryid,
      req.body.companyid,
      req.body.modelid,
      req.body.vendorid,
      req.body.registrationno,
      req.body.color,
      req.body.fueltype,
      req.body.ratings,
      req.body.average,
      req.body.remarks,
      req.body.capacity,
      req.body.status,
      req.body.feature,
      req.body.vehicleid], function (error, result) {
         if (error) {
            console.log(error)
            res.status(500).json({ status: false, message: 'Server Error' })
         }
         else {

            res.status(200).json({ status: true, message: 'Vehicle Updated Successfully' })
         }



      })

});


router.post('/delete_data', function (req, res, next) {
   pool.query("delete from vehicle where vehicleid=?", [req.body.vehicleid]
      , function (error, result) {

         if (error) {
            res.status(500).json({ status: false, message: 'Server Error' })
         }
         else {
            fs.unlinkSync(`${filepath}/images/${req.body.oldicon}`);
            res.status(200).json({ status: true, message: 'Vehicle delete Successfully' })
         }
      })
});


router.get('/display_vehicles', function (req, res, next) {
   pool.query("select V.*,(select C.categoryname from category C where C.categoryid=V.categoryid) as categoryname, (select S.subcategoryname from subcategory S where S.subcategoryid=V.subcategoryid) as subcategoryname,(select CM.companyname from company CM where CM.companyid=V.companyid) as companyname,(select M.modelname from model M where M.modelid=V.modelid) as modelname  from vehicle V", function (error, result) {

      if (error) {
         res.status(500).json({ status: false, message: 'Server Error' })
      }
      else {
         res.status(200).json({ status: true, data: result })
      }

   })
});


module.exports = router;