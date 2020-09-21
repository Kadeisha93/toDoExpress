const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient

var db, collection;

const url = "mongodb+srv://kadeisha:savage@cluster0.ac8xx.mongodb.net/realtodo?retryWrites=true&w=majority";
const dbName = "realtodo";

app.listen(3000, () => {
    MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
        if(error) {
            throw error;
        }
        db = client.db(dbName);
        console.log("Connected to `" + dbName + "`!");
    });
});

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static('public'))

app.get('/', (req, res) => {
  db.collection('realtodo').find().toArray((err, result) => {
    if (err) return console.log(err)
    res.render('index.ejs', {realtodo: result})
  })
})

app.post('/realtodo', (req, res) => { //sends to database initally
  db.collection('realtodo').insertOne({name: req.body.name}, (err, result) => {
    if (err) return console.log(err)
    console.log('saved to database')
    res.redirect('/')
  })
})

app.put('/realtodo', (req, res) => {
  db.collection('realtodo') //realtodo is the collection the info is being stored in
  .findOneAndUpdate({name: req.body.name}, {
    $set: {
      // strikeThrough: true
    }
  }, {
    sort: {_id: -1},
    upsert: true
  }, (err, result) => {
    if (err) return res.send(err)
    res.send(result)
  })
})

app.delete('/realtodo', (req, res) => {
  db.collection('realtodo').findOneAndDelete({name: req.body.name}, (err, result) => {
    if (err) return res.send(500, err)
    res.send('Message deleted!')
  })
})
