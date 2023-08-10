var express = require('express');
var router = express.Router();
var pool = require('./pool');
var jwt = require('jsonwebtoken');
var LocalStorage = require('node-localstorage').LocalStorage;
var localStorage = new LocalStorage('./scratch');

/* GET home page. */
router.post('/check_admin_login', function (req, res, next) {
  pool.query("select * from administrator where (emailid=? or mobile=?) and password=?", [req.body.emailid, req.body.emailid, req.body.password], function (error, result) {
    if (error) {
      res.status(500).json({ status: false, message: 'Server Error' });
    }
    else {
      if (result.length == 1) {
        const token = jwt.sign({ emailid: result[0].emailid }, "jwtSecret",
          {
            expiresIn: '30s'
          });
        localStorage.setItem('jwttoken', JSON.stringify({ token: token }));
        res.status(200).json({ status: true, admin: result[0], token: token });
      }
      else
        res.status(200).json({ status: false, message: 'Invalid Emailid/Mobile Number/Password' });
    }
  });
});

const verifyJWT = (req, res, next) => {
  console.log(req.headers);
  const token = req.headers.authorization;
  console.log("Token:", token);

  if (!token) {
    res.send("We need a token, please give it to us next time");
  } else {
    jwt.verify(token, "jwtSecret", (err, decoded) => {
      console.log(decoded);
      if (err) {
        console.log(err);
        res.json({ auth: false, message: "you are failed to authenticate" });
      } else {
        req.userId = decoded.id;
        next();
      }
    });
  }
};

router.get("/getToken", (req, res) => {
  var myToken = JSON.parse(localStorage.getItem('jwttoken'))
  res.json({ token: myToken.token })
})

router.get("/isUserAuth", verifyJWT, (req, res) => {
  res.json({ auth: true, message: "you are authenticated Congrats:" })
});


module.exports = router;
