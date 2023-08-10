var express = require('express');
var router = express.Router();
var pool = require('./pool')
var upload = require('./multer');
var fs = require('fs');
var dotenv = require("dotenv");

dotenv.config();

const filepath = process.env.FILEPATH;
/* GET users listing. */
router.post('/fetch_company_by_subcategory', function (req, res, next) {
    console.log(req.body)
    pool.query("select S.*,(select C.subcategoryname from subcategory C where C.subcategoryid=S.subcategoryid) as subcategoryname from company S where S.subcategoryid=?", [req.body.subcategoryid], function (error, result) {
        if (error) {
            console.log(error)
            res.status(500).json({ status: false, message: 'Server Error', result: [] })
        }
        else {

            res.status(200).json({ status: true, data: result })
        }
    });
});


router.post('/submit', upload.any(), function (req, res, next) {
    console.log(req.files)
    pool.query("insert into company(categoryid,subcategoryid,companyname,icon) values(?,?,?,?)", [req.body.categoryid, req.body.subcategoryid, req.body.companyname, req.files[0].filename], function (error, result) {
        if (error) {
            console.log(error)
            res.status(500).json({ status: false, message: 'Server Error' })
        }
        else {

            res.status(200).json({ status: true, message: 'Company Submitted Successfully' })
        }
    });
});


router.post('/edit_picture', upload.single('icon'), function (req, res, next) {
    console.log(req.file)
    pool.query("update company set icon=? where companyid=?", [req.file.filename, req.body.companyid], function (error, result) {
        if (error) {
            console.log(error)
            res.status(500).json({ status: false, message: 'Server Error' })
        }
        else {
            fs.unlinkSync(`${filepath}/images/${req.body.oldicon}`)
            res.status(200).json({ status: true, message: 'Icon Updated Successfully' })
        }
    });
});


router.post('/edit_data', upload.single('icon'), function (req, res, next) {
    console.log(req.file)
    pool.query("update company set companyname=? where companyid=?", [req.body.companyname, req.body.companyid], function (error, result) {
        if (error) {
            console.log(error)
            res.status(500).json({ status: false, message: 'Server Error' })
        }
        else {

            res.status(200).json({ status: true, message: 'Company Updated Successfully' })
        }
    });
});


router.post('/delete_data', upload.single('icon'), function (req, res, next) {
    console.log(req.file)
    pool.query("delete from  company where companyid=?", [req.body.companyid], function (error, result) {
        if (error) {
            console.log(error)
            res.status(500).json({ status: false, message: 'Server Error' })
        }
        else {
            fs.unlinkSync(`${filepath}/images/${req.body.oldicon}`)
            res.status(200).json({ status: true, message: 'Company Deleted Successfully' })
        }
    });
});



router.get('/display_company', function (req, res, next) {
    pool.query("select Cmp.*,(select categoryname from category C where C.categoryid=Cmp.categoryid)as categoryname,(select subcategoryname from subcategory SC where SC.subcategoryid=Cmp.subcategoryid )as subcategoryname from company Cmp", function (error, result) {

        if (error) {
            res.status(500).json({ status: false, message: 'Server Error' })
        }
        else {
            res.status(200).json({ status: true, data: result })
        }

    });
});





module.exports = router;
