var mysql=require('mysql')
var pool=mysql.createConnection({
host:'localhost',
port:3306,
database:'paynrent',
user:'root',
password:'123',
multipleStatements:true,
})
module.exports=pool