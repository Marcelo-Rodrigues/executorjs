var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var nedb = require('nedb');
var db = new nedb({ filename: 'banco.db', autoload: true });

var clients = {};

app.get('/', function (req, res) {
    res.send('server is running');
});

io.on('connection', (socket) => {

    socket.on("message", function (msg) {


        db.insert({ msg: msg }, function (err) {
            if (err) return console.log(err); //caso ocorrer algum erro
            
            io.emit("message", db.getAllData());
            console.log("Novo msg adicionado!");
        });
    });

});

http.listen(3000, function () {
    console.log('listening on port 3000');
});