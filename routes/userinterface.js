var express = require('express');
var router = express.Router();
var pool = require('./pool')
var upload = require('./multer');
var fs = require('fs');
var dotenv = require('dotenv');
dotenv.config();


router.get('/display_category', function (req, res, next) {
    pool.query('select * from category', function (error, result) {
        if (error) {
            res.status(500).json({ status: false, message: 'Server Error' })
        }
        else {
            res.status(200).json({ data: result, status: true })
        }
    });
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



router.get('/display_cities', function (req, res, next) {
    pool.query('select * from cities', function (error, result) {
        if (error) {
            res.status(500).json({ status: false, message: 'Server Error' })
        }
        else {
            res.status(200).json({ data: result, status: true })
        }
    });
});

router.get('/display_feature', function (req, res, next) {
    pool.query('select * from featured', function (error, result) {
        if (error) {
            res.status(500).json({ status: false, message: 'Server Error' })
        }
        else {
            res.status(200).json({ data: result, status: true })
        }
    });
});

router.get('/display_offer', function (req, res, next) {
    pool.query("select * from offers", function (error, result) {
        if (error) {
            res.status(500).json({ status: false, message: 'Server Error' })
        }
        else {
            console.log('resulttttt:', result)
            res.status(200).json({ status: true, data: result })
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

router.get('/filtering', function (req, res, next) {
    pool.query("select V.*,(select C.categoryname from category C where C.categoryid=V.categoryid) as categoryname, (select S.subcategoryname from subcategory S where S.subcategoryid=V.subcategoryid) as subcategoryname,(select CM.companyname from company CM where CM.companyid=V.companyid) as companyname,(select M.modelname from model M where M.modelid=V.modelid) as modelname  from vehicle V where V. companyid in (select V.companyid from company C where C.companyid in(?))",
        [
            req.body.companyid
        ],
        function (error, result) {

            if (error) {
                res.status(500).json({ status: false, message: 'Server Error' })
            }
            else {
                res.status(200).json({ status: true, data: result })
            }

        })
});


router.post('/user_details_submit', function (req, res, next) {
    console.log(req.files)
    pool.query("insert into userdetails(mobile, email, fullname, dob, aadhar, license) values(?,?,?,?,?,?)",
        [
            req.body.mobile,
            req.body.email,
            req.body.fullname,
            req.body.dob,
            req.body.aadhar,
            req.body.license
        ],
        function (error, result) {
            if (error) {
                console.log(error)
                res.status(500).json({ status: false, message: 'Server Error' })
            }
            else {

                res.status(200).json({ status: true, message: 'Company Submitted Successfully' })
            }
        });
});

router.post('/check_user_mobile', function (req, res, next) {
    pool.query("select * from userdetails where mobile=?",
        [
            req.body.mobile
        ],
        function (error, result) {

            if (error) {
                res.status(500).json({ status: false, message: 'Server Error' })
            }
            else {
                if (result.length == 1) {
                    res.status(200).json({ status: true, data: result[0] })
                }
                else {
                    res.status(200).json({ status: true, data: [] })
                }
            }

        });
});

router.post('/check_user', function (req, res, next) {
    pool.query("select * from userdetails where (mobile=? or email=?) and password=?",
        [
            req.body.mobile,
            req.body.email,
            req.body.password
        ],
        function (error, result) {

            if (error) {
                res.status(500).json({ status: false, message: 'Server Error' })
            }
            else {
                if (result.length == 1) {
                    res.status(200).json({ status: true, data: result[0] })
                }
                else {
                    res.status(200).json({ status: true, data: [] })
                }
            }

        });
});


module.exports = router;
