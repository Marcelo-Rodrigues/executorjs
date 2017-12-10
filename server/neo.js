var neo4j = require('neo4j');
var db = new neo4j.GraphDatabase('http://neo4j:admin@localhost:7474');

var neo = function() { };

neo.prototype.consultar = function (consulta, callback) {
        db.cypher({
            query: consulta
        }, function (err, results) {
            if (err) throw err;
            callback(results);
        });
}

exports = module.exports = new neo();