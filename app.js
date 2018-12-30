let port = normalizePort(process.argv[2] || process.env.PORT || '3000');
if (process.argv[3] === "development") {
    process.env.NODE_ENV = "development";
} else {
    process.env.NODE_ENV = "production";
}
const portRange = port + 10;
const express = require('express');
const createError = require("http-errors");
const app = express();
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io').listen(server);
const jpegSocket = require('./jpeg')(app, io);
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
console.log(process.env.NODE_ENV);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('io', io);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use("/javascripts/jquery.min.js", express.static(path.join(__dirname, 'node_modules', 'jquery', 'dist', 'jquery.min.js')));
app.use("/javascripts/socket.io.js", express.static(path.join(__dirname, 'node_modules', 'socket.io-client', 'dist', 'socket.io.js')));
app.use("/javascripts/material.min.js", express.static(path.join(__dirname, 'node_modules', 'material-design-lite', 'material.min.js')));
app.use("/stylesheets/material.grey-indigo.min.css", express.static(path.join(__dirname, 'node_modules', 'material-design-lite', 'dist', 'material.grey-indigo.min.css')));


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

function normalizePort(val) {
    const port = parseInt(val, 10);
    if (isNaN(port)) {
        return val;
    }
    if (port >= 0) {
        return port;
    }
    return !1;
}

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }
    const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            return process.exit(1);
        case 'EADDRINUSE':
            console.error(`${bind} is already in use.`);
            if (typeof port === 'string' || port >= portRange) {
                return process.exit(1);
            }
            console.log(`Incrementing to port ${++port} and trying again.`);
            server.listen(port);
            break;
        default:
            throw error;
    }
}

function onListening() {
    const addr = server.address();
    const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
    console.log(`Listening on ${bind}.`);
}

module.exports = app;