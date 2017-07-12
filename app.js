var Hapi = require('hapi');
var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'Ravisankar.ceskpyjwoq4q.ap-south-1.rds.amazonaws.com',
    user: 'Ravisankar',
    password: '1q2w3e4r',
    port: '3306',
    database: 'hapi_assignment'
});

var server = new Hapi.Server();
server.connection({
    port: process.env.PORT || 8080
});
connection.connect();

server.register(require('inert'));
server.register(require('vision'), function(err) {

    if (err) {
        throw err;
    }

    server.route({
        method: 'GET',
        path: '/',
        handler: function(request, reply) {
            connection.query('SELECT quotes,credit from quotes order by rand() limit 1', function(err, rows, fields) {
                if (err) throw err;
                reply.view('index', {
                    quotes: rows[0].quotes,
                    credit: rows[0].credit
                });
            });
        }
    });

    server.route({
        method: 'GET',
        path: '/{param*}',
        handler: {
            directory: {
                path: 'public'
            }
        }
    });


    server.views({
        engines: {
            html: require('handlebars')
        },
        relativeTo: __dirname,
        path: 'templates'
    });


});

server.start(function() {
    console.log('Server running at: ' + server.info.uri);
});
