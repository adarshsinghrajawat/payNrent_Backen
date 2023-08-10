var express = require('express');
var router = express.Router();
var pool = require('./pool');
var upload = require('./multer');
var fs = require('fs');

router.post('/submit', upload.any(), function (req, res, next) {
    pool.query('insert into subcategory(categoryid, subcategoryname, priority, icon) values(?,?,?,?)',
        [
            req.body.categoryid,
            req.body.subcategoryname,
            req.body.priority,
            req.files[0].filename
        ],
        function (error, result) {
            if (error) {
                res.status(500).json({ status: false, message: 'Server Error' })
            }
            else {
                res.status(200).json({ status: true, message: 'Sub Category Submitted Succeessfully' })
            }
        })
});

router.get('/display_subcategory', function (req, res, next) {
    pool.query('select SC.*,(select categoryname from category C where C.categoryid=SC.categoryid) as cname from subcategory SC', function (error, result) {
        if (error) {
            res.status(500).json({ status: false, message: 'Server Error' })
        }
        else {
            res.status(200).json({ status: true, data: result })
        }
    })
});

router.post('/fetch_subcategory_by_category', function (req, res, next) {
    pool.query("select S.*,(select C.categoryname from category C where C.categoryid=S.categoryid) as categoryname from subcategory S where S.categoryid=?", [req.body.categoryid], function (error, result) {
        if (error) {
            console.log(error)
            res.status(500).json({ status: false, message: 'Server Error', result: [] })
        }
        else {
            res.status(200).json({ status: true, data: result })
        }
    });
});

module.exports = router