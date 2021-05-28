const express = require("express")
const fs = require("fs");
const app = express()
const mysql = require('mysql')
const md5 = require('md5');

// accepting server json data
app.use(express.json())

const PORT = 4000

app.post('/write-data', async (req, res) => {

    var data = req.body.data;
    var driver = []

    for (x in data) {
        driver.push(data[x])
    }

    var key = data['mobile'] + data['aadhar'] + data['vehical'];
    var hash = md5(key);

    console.log("key " + hash)

    // connecting to mysql
    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "driver_validation"
    });
    
    con.connect(function(err) {
        if (err) throw err;
        console.log("Connected for insertion!");
        let query = `INSERT INTO drivers (name, mobile, email, aadhar, vehical_number, aadhar_path, vehical_path) VALUES (?, ?, ?, ?, ?, ?, ?);`;
        con.query(query, driver, function (err, rows) {
          if (err) throw err;
          console.log("Row inserted with id = " + rows.insertId);
          res.send({hash: hash})
        });
    });

})

app.get('/validate-driver/:name/:hash', async (req, res) => {

    var hash = req.params.hash
    var name = req.params.name
    
    // retriving data
    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "driver_validation"
    });
    
    con.connect(function(err) {
        if (err) throw err;
        console.log("Connected for retriving");
        let query = `SELECT name, mobile, aadhar, vehical_number FROM drivers where name = ?`;
        con.query(query, name, function (err, result) {
          if (err) throw err;

          var key = result[0].mobile + result[0].aadhar + result[0].vehical_number
          var created_hash = md5(key);

          console.log("key " + created_hash)

          if(hash == created_hash){
            res.send('Success')
          }else{
            res.send('Fail')
          }
        });
    });
})

// Server listening
app.listen(PORT, (err) => {
    if(err){
        console.log('Server not started. ')
    }else{
        console.log('Server running on PORT ', PORT)
    }
})

