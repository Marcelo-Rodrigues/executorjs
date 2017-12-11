var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var nedb = require('nedb');
var neo4j = require('./neo');
var db = new nedb({ filename: 'banco.db', autoload: true });

var clients = {};

app.get('/teste', function (req, res) {
    neo4j.consultar('MATCH (ee:Person) WHERE ee.name = "Emil" RETURN ee;', function (result) {
        res.send(result);
    })
});

app.get('/', function (req, res) {
    res.send('server is running');
});

var allClients = [];

io.on('connection', (socket) => {
    allClients.push(socket);

    addEvent(socket, "test");

    socket.on('disconnect', function () {
        io.emit('user disconnected');

        var i = allClients.indexOf(socket);
        allClients.splice(i, 1);
    });

});


function addEvent(socket, event) {
    socket.on("new " + event, function (obj) {
        obj.type = event;
        db.insert(obj, function (err) {
            if (err) return console.log(err);
            io.emit("new " + event, obj);
        });
    });

    socket.on("get all " + event + "s", function () {
        db.find({ type: event }, function (err) {
            if (err) return console.log(err);
            socket.emit("all " + event, db.getAllData());
        });
    });
}

http.listen(3000, function () {
    console.log('listening on port 3000');
});