var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const http = require("http");
const WebSocket = require("ws");
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session);
var loginRouter = require('./routes/LoginRouter');
var apiRouter = require('./routes/ApiRouter');

var app = express();

// mongo setup
var username = process.env.USERNAME || 'Skrik User';
var password = process.env.PASSWORD || 'password';
var database = process.env.DATABASE || 'skrik';
var dburl = process.env.DBURL || 'localhost:27017';
const mongoDB = `mongodb://${username}:${password}@${dburl}/${database}`
console.log("trying to connect to " + mongoDB + "...")
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

// session and body-parser init
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(session({
    name: "PHPSESSID",
    secret: process.env.SESSION_SECRET || "session secret",
    resave: 'false',
    store: new MongoStore({mongooseConnection: mongoose.connection}),
    saveUninitialized: 'false',
    cookie: {
        maxAge: 60 * 60 * 1000
    }
}))

// handle login
app.use(loginRouter.passport.initialize());
app.use(loginRouter.passport.session());
app.use('/api/login', loginRouter.router);

// auto-gen code
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', apiRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

app2 = express()
const server = http.createServer(app2)
const wss = new WebSocket.Server({ server })

wss.on('connection', ws => {
  const sendData = (client, data) => {
    client.send(JSON.stringify(data))
  }

  // sendData(ws, ['output', codes])

  ws.onmessage = (message) => {
    const { data } = message
    console.log(data)
    const [task, payload] = JSON.parse(data)

    switch (task) {
      case 'input': {
        wss.clients.forEach((client) => {
          if(client.readyState === WebSocket.OPEN) {
            sendData(client, ['output', payload])
          }
        })
        break
      }

      case 'path': {
        wss.clients.forEach((client) => {
          if(client.readyState === WebSocket.OPEN) {
            sendData(client, ['output-path', payload])
          }
        })
        break
      }

      case 'file': {
        
        break
      }

      default:
        break
    }
  }
})
const PORT = process.env.SOCKETIO_PORT || 4000

server.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`)
})

module.exports = app;
