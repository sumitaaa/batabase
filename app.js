const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/mydb";

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
            name: 'Sikarin',
            email: 'afumagic3@gmail.com',
            phone: '1234567890',
        },
        vehicle: {
            id: 'ver001',
        },
        accesso: {
            id: 'acc001',
        },
        electornic: {
            id: 'ele001',
        },
        home: {
            id: 'home001',
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

    MongoClient.connect(url, function (err, db) {

        var dbo = db.db("mydb");

        dbo.collection("backup").insertOne(backUpdata, function (err, data) {
            if (err) res.status(400).send(err)

            // send line $$

            let id = data.ops[0]._id

            request({
                method: 'POST',
                uri: 'https://notify-api.line.me/api/notify',
                header: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                auth: {
                    bearer: 'Aul4lyrF8awcPHKaVrU5LbZkTMcwTUiZWegU4k3XEkm', //token
                },
                form: {
                    message: 'ทดสอบ', //ข้อความที่จะส่ง
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


// post-transfer to db

// get transfer from db

var port = process.env.PORT || 3000
app.listen(port, () => {
    console.log('run on port : ', port)
})
