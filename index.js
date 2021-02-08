const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

app.get('/', function (req, res) {

    let sql = require('mssql');

    //database config
    let config = {
        user: 'earagon',
        password: 'Pass123!',
        server: 'AAD-CON-VIR',
        database: 'Community Resources Database'
    };

    // connect to the database
    sql.connect(config, function(err) {

        if (err) console.log(err);
        
        //create Request Object
        let request = new sql.Request();
        
        

        //query to the database
        request.query('SELECT * FROM CommunityResource', function (err, recordset) {

            if (err) console.log(err)
            
            //send records as a response
            res.send(recordset);
        });
    });
});

let server = app.listen(5000, function() {
    console.log('Server is running');

});