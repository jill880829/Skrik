var http = require('http');
var express = require('express');

var app = express();
var debug = require('debug')('backend:server');
var apiRouter = require('./ApiRouter');

var port = normalizePort('3000');

const mongoose = require('mongoose');

 
// mongo setup

var username = process.env.USERNAME || 'Skrik User';
var password = process.env.PASSWORD || 'password';
var database = process.env.DATABASE || 'skrik';
var dburl = process.env.DBURL || 'localhost:27017';
const mongoDB = `mongodb://${username}:${password}@${dburl}/${database}`
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect(mongoDB);

mongoose.connection.on('disconnected',function(){
    console.error('[db] db connection dropped.');
})

mongoose.connection.on('error',function(err){
    console.error('[db] db error: ' + err.message);
})



app.set('port', port);
// ..
app.use('/api', apiRouter);
const server = http.createServer(app)
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
    var port = parseInt(val, 10);
  
    if (isNaN(port)) {
      // named pipe
      return val;
    }
  
    if (port >= 0) {
      // port number
      return port;
    }
  
    return false;
  }
/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== 'listen') {
      throw error;
    }
  
    var bind = typeof port === 'string'
      ? 'Pipe ' + port
      : 'Port ' + port;
  
    // handle specific listen errors with friendly messages
    switch (error.code) {
      case 'EACCES':
        console.error(bind + ' requires elevated privileges');
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(bind + ' is already in use');
        process.exit(1);
        break;
      default:
        throw error;
    }
  }
  
  /**
   * Event listener for HTTP server "listening" event.
   */
  
  function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
      ? 'pipe ' + addr
      : 'port ' + addr.port;
    debug('Listening on ' + bind);
  }
  