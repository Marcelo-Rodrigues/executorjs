var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var nedb = require('nedb');
var neo4j = require('./neo');
var db = new nedb({ filename: 'banco.db', autoload: true });

var clients = {};

app.get('/teste', function (req, res) {
    neo4j.consultar('MATCH (ee:Person) WHERE ee.name = "Emil" RETURN ee;', function(result) {
        res.send(result);
    })
});

app.get('/', function (req, res) {
    res.send('server is running');
});

io.on('connection', (socket) => {

    socket.on("message", function (msg) {

        let obj;
        if(Array.isArray(msg)) {
            obj = msg.length && msg[0] ? msg[0].msg : '';
        } else {
            obj = msg;
        }

        db.insert({ msg: obj }, function (err) {
            if (err) return console.log(err); //caso ocorrer algum erro
            
            io.emit("message", db.getAllData());
            console.log("Novo msg adicionado!");
        });
    });

    io.emit("message", db.getAllData());
});

http.listen(3000, function () {
    console.log('listening on port 3000');
});