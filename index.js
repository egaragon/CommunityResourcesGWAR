const express = require('express');
const app = express();

app.get('/', function (req, res) {

    let sql = require('mssql');

    //database config
    let config = {
        user: 'earagon',
        password: 'Pass123!',
        server: 'AAD-CON-VIR',
        database: 'Community Resource Database'
    };

    // connect to the database
    sql.ConnectionError(config, function(err) {

        if (err) console.log(err);
        
        //create Request Object
        let request = new sql.request();

        //query to the database
        request.query('SELECT * FROM ResourceCategory', function (err, recordset) {

            if (err) console.log(err)
            
            //send records as a response
            res.send(recordset);
        });
    });
});

let server = app.listen(5000, function() {
    console.log('Server is running');

});