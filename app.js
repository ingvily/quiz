var http = require('http');
var sockjs = require('sockjs');
var _ = require('underscore');
var express = require('express');
var fs = require('fs');


var connections = function() {
    var items = [];

    return {
        add: function(id, conn, name) {
            items.push({ id: id, conn: conn, name: name });

        },
        remove: function(id) {
            items = _.reject(items, function(item) {
                return item.id === id;
            });
        },
        size: function() {
            return items.length;
        },
        broadcast: function(data) {
            items.forEach(function(item) {
                item.conn.write(JSON.stringify(data));
            });
        },
        items: function ()  {
            return items;
        }
    }
};

var admins = connections();
var users = connections();

var skriver = function () {
    console.log('hei');
    fs.writeFile('scores.txt', 'Hello World kjetil!', function (err) {
        if (err) return console.log(err);
        console.log('Hello World > helloworld.txt');
    });
    console.log('ferdig');
};

var echo = sockjs.createServer();
echo.on('connection', function(conn) {
    conn.on('data', function(message) {
        var data = JSON.parse(message);

        if (data.type === 'connect') {
            if (data.isAdmin === true) {
                admins.add(conn.id, conn, "admin");
            } else {
                users.add(conn.id, conn, data.name);
            }

            admins.broadcast({
                numberOfUsers: users.size()
            });

        }
        if (data.type === 'answer') {
            admins.broadcast({
                type: 'answer',
                user: conn.id,
                alternative: data.alternative,
                name: data.name
            });
        }
    });


    conn.on('close', function() {
        admins.remove(conn.id);
        users.remove(conn.id);
        admins.broadcast({ numberOfUsers: users.size() });
    });
});

echo.on('fil', function(conn) {
    conn.on('data', function(message) {
            skriver();

    });

});

var app = express();

app.get('/admin/questions.js', function(req, res) {
    var questions = [];
    try {
        questions = require('./questions');
    } catch(e) {
        console.log(e);
    }

    res.set('Content-Type', 'application/javascript');
    res.send('window.questions = ' + JSON.stringify(questions) + ';');
});

app.use(express.compress());
app.use(express.static('dist'));
app.use(express.static('public'));

var server = http.createServer(app);
echo.installHandlers(server, { prefix: '/echo' });
server.listen(9999, '0.0.0.0');
