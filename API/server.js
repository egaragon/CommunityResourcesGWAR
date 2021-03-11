const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const mssql = require('mssql');
const { type } = require('os');

const app = express();
app.use(cors());
//app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());



//database config
let config = {
    user: 'earagon',
    password: 'Pass123!',
    server: 'AAD-CON-VIR',
    database: 'Community Resources Database'
};

//magic that connects to the sql database or something idk
const runSqlQuery = (sqlString) => {
    return new Promise((resolve, reject) => {
        mssql.connect(config)
        .then((connection) => {
            connection.request().query(sqlString)
            .then((results) => {
                resolve(results);
            }).catch(reject);
        })
        .catch(reject);
    })
}

const runInsertQuery = (sqlString, input) => {
    return new Promise((resolve, reject) => {
        mssql.connect(config)
        .then((connection) => {
            const request = new mssql.Request(connection);
            for(key in input) {
                request.input(key, input[key])

            }
            request.query(sqlString)
            .then((results) => {
                resolve(results);
            })
            .catch(reject);
        })
        .catch(reject);
    })
}

//getting data from sql database using magic from before
app.get('/', function (req, res) {

    runSqlQuery('SELECT * FROM CommunityResource;') //injecting sql to run queries
    .then((results) => {
        res.send(JSON.stringify(results)); //returns results of query as a string
    })
    .catch((err) =>{ //in case shit's fucked up
        console.error(err);
        res.status(500).send();
    })
    

});



app.post('/', function(req,res){
    
    console.log(JSON.stringify(req.body));
    const sqlInput = req.body;
    
    sqlInput.resourceCategory = JSON.stringify(req.body.resourceCategory);
    sqlInput.resourceAddress = req.body.resourceAddress ? JSON.stringify(req.body.resourceAddress + ' ' + req.body.unitNumber) : '';
    sqlInput.county = req.body.county || '';

    runSqlQuery('SELECT resourceAddress FROM CommunityResource;')
    .then(dbReturn => {

        console.log(req.body.resourceAddress);

        if(req.body.resourceAddress !== '' && dbReturn.recordset.some((addressObj) => {
            return addressObj.resourceAddress === req.body.resourceAddress;
        })) {
            res.status(418).send('Address is already used');
        }
        else {
            runInsertQuery(
            `INSERT INTO CommunityResource (resourceName, resourceCategory, resourceAddress, county, website, phoneNumber, information)
            VALUES (@resourceName, @resourceCategory, @resourceAddress, @county, @website, @phoneNumber, @information)
            `, sqlInput
            )
            .then((results) => { //return the inserted record
                res.status(201).send(JSON.stringify(results)); //tells us that insertion was successful
            })
            .catch((err) =>{ //in case shit's fucked up
                console.error(err);
                res.status(500).send();
            }) 
        }
    })
    
   
        
});





let server = app.listen(5000, function() {
    console.log('Server is running');

});