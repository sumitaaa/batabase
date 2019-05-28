const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
var ObjectId = require('mongodb').ObjectId

var MongoClient = require('mongodb').MongoClient;
var url = process.env.MONGODB_URI || "mongodb://localhost:27017/mydb";
//MongoClient.connect('mongodb://'+DATABASEUSERNAME+':'+DATABASEPASSWORD+'@'+DATABASEHOST+':'DATABASEPORT+'/'+DATABASENAME,function(err, db){ 
var url = 'mongodb://database:database123456789@djt3nhfgnq17tj74sme1rv4ubr@ds157956.mlab.com:57956/heroku_b3km553l/mydb'
//var url = 'mongodb://heroku_b3km553l:djt3nhfgnq17tj74sme1rv4ubr@ds157956.mlab.com:57956/heroku_b3km553l/mydb'

MongoClient.connect(url, function (err, db) {
    if (err) throw err;

    var dbo = db.db("mydb");

    dbo.createCollection("backup", function (err, res) {
        if (err) throw err;
        console.log("Collection created!");
    });

    dbo.createCollection("transfer", function (err, res) {
        if (err) throw err;
        console.log("Collection created!");
    });

    let backUpdata = {
        user: {
            name: '',
            email: '',
            phone: '',
        },
        vehicle: {
            id: '',
            type: '',
            brand: '',
            number: '',
            color: '',
            tabain: '',
            date: '',
            province: '',
            ownership: '',
            partner: '',
            note: ''
        },
        accesso: {
            id: '',
            type: '',
            brand: '',
            number: '',
            color: '',
            size: '',
            weight: '',
            partner: '',
            note: ''
        },
        electornic: {
            id: '',
            type: '',
            brand: '',
            number: '',
            color: '',
            date: '',
            insurance: '',
            store: '',
            partner: '',
            note: ''

        },
        home: {
            id: '',
            type: '',
            number: '',
            width: '',
            long: '',
            ownership: '',
            partner: '',
            note: ''
        },
        // home1: {

        // },
        // home2: {

        // },
        // home3: {

        // },
    }

    let transferData = {
        id: 'ver001',
        tabain: 'กข123',
        color: 'red',
    }

    // dbo.collection("backup").insertOne(backUpdata, function (err, res) {
    //     if (err) throw err
    //     console.log('inserted')
    // })

    // dbo.collection("transfer").insertOne(transferData, function (err, res) {
    //     if (err) throw err
    //     console.log('inserted')
    // })

});

var app = express()

app.use(bodyParser.json())

app.post('/post-backup', (req, res) => { // save back-up to db
    let backUpdata = req.body
    console.log('data: ', req.body)

    MongoClient.connect(url, function (err, db) {

        var dbo = db.db("mydb");

        dbo.collection("backup").insertOne(backUpdata, function (err, data) {
            if (err) res.status(400).send(err)

            let id = data.ops[0]._id

            //line
            request({
                method: 'POST',
                uri: 'https://notify-api.line.me/api/notify',
                header: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                auth: {
                    bearer: 'JWmhiC5VYrwwERudEvnv9THHGByNDA9LAJROmAgBNWh', //token
                },
                form: {
                    message: '' + id, //ข้อความที่จะส่ง
                },
            }, (err, httpResponse, body) => {
                if (err) {
                    console.log(err)
                } else {
                    console.log(body)
                }
            })
            console.log('id : ', id)

            res.send('save data sucess : ' + id)
        })
    })
})

app.get('/', (req, res) => {
    res.send('hello')
})

app.post('/post-transfer', (req, res) => { // save back-up to db
    let transferData = req.body

    MongoClient.connect(url, function (err, db) {

        var dbo = db.db("mydb");

        dbo.collection("transfer").insertOne(transferData, function (err, datatransfer) {
            if (err) res.status(400).send(err)

            let id = datatransfer.ops[0]._id

            //line
            request({
                method: 'POST',
                uri: 'https://notify-api.line.me/api/notify',
                header: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                auth: {
                    bearer: 'JWmhiC5VYrwwERudEvnv9THHGByNDA9LAJROmAgBNWh', //token
                },
                form: {
                    message: '' + id, //ข้อความที่จะส่ง
                },
            }, (err, httpResponse, body) => {
                if (err) {
                    console.log(err)
                } else {
                    console.log(body)
                }
            })
            console.log('id : ', id)

            res.send('save data sucess : ' + id)
        })
    })
})
// get back-up from db
// app.post findOne({_id: req.body._id}) response data
app.post('/get-backup', (req, res) => {
    console.log('tt : ', req.body._id)
    MongoClient.connect(url, function (err, db) {

        var dbo = db.db("mydb");
        // db.test.find(ObjectId("4ecc05e55dd98a436ddcc47c")) 
        // dbo.collection("customers").find({}).toArray(function(err, result) 
        dbo.collection("backup").find(ObjectId(req.body._id)).toArray(function (err, result) {
            if (err) res.status(400).send(err)
            res.send(result[0])
        })
    })
})
app.post('/get-transfer', (req, res) => {
    console.log('tt : ', req.body._id)
    MongoClient.connect(url, function (err, db) {

        var dbo = db.db("mydb");
        // db.test.find(ObjectId("4ecc05e55dd98a436ddcc47c")) 
        // dbo.collection("customers").find({}).toArray(function(err, result) 
        dbo.collection("transfer").find(ObjectId(req.body._id)).toArray(function (err, result) {
            if (err) res.status(400).send(err)
            res.send(result[0])
        })
    })
})
// post-transfer to db

// get transfer from db

var port = process.env.PORT || 3000
app.listen(port, () => {
    console.log('run on port : ', port)
})
