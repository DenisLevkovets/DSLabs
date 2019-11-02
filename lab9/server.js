let http = require('http');
let static = require('node-static');
let express = require('express');
const bodyParser = require('body-parser');
let app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
var cors = require('cors');
app.options('*', cors());

let file = new static.Server('.');

const mongoose = require("mongoose");
const connectionString = 'mongodb://mongo-admin:password@i1:27017,i2:27017,i3:27017/mydb?replicaSet=main&authSource=admin&w=1';


mongoose.connect(connectionString, {useNewUrlParser: true});
const db = mongoose.connection;

db.on("error", () => {
    console.log("> error occurred from the database");
});

db.once('open', () => {
    console.log('nice')
});


let Msgs = mongoose.model('Msgs', new mongoose.Schema({msg: 'string', who: 'number'}));
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.get('/msgs', function (req, res) {
    Msgs.find({}, function (err, collection) {
        res.send(JSON.stringify(collection))
    })

});

app.post('/add', function (req, res) {
    console.log(req.body.msg, req.body.who)
    let msg = new Msgs({msg: req.body.msg, who: req.body.who});
    msg.save();
    res.send('ok')
});

app.get('/', function (req, res) {
    res.send('asd')
});
app.listen(8080, () => console.log('nice'))
console.log('Server running on port 8080');
