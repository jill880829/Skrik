var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var redisClient = require('./utils/redis')
const http = require("http");
const WebSocket = require("ws");
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const session = require('express-session')  
const RedisStore = require('connect-redis')(session);
const cors = require('cors');

var loginRouter = require('./routes/LoginRouter');
var apiRouter = require('./routes/ApiRouter');
const QueryProject = require('./utils/db/QueryProject');
const QueryUser = require('./utils/db/QueryUser');

var app = express();

// use cors
var corsOptions = {
    credentials: true,
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200, // For legacy browser support
    methods: "GET, POST"
}
app.use(cors(corsOptions));

const { text } = require('body-parser');
const projectid = "5ff17b374b87d05f09acb6aa";
const filename = "test_file"

function empty(a, name) {
    let t = (a === undefined || a === "")
    if(t == true) {
        console.error("[env] missing environment variable: " + name)
    }
    return t
}

// environment check
if (
    empty(process.env.MONGO_USERNAME, "MONGO_USERNAME") ||
    empty(process.env.MONGO_PASSWORD, "MONGO_PASSWORD") ||
    empty(process.env.MONGO_DATABASE, "MONGO_DATABASE") ||
    empty(process.env.MONGO_URL, "MONGO_URL") ||
    empty(process.env.PROJECT_SECRET, "PROJECT_SECRET") ||
    empty(process.env.SESSION_SECRET, "SESSION_SECRET") ||
    // empty(process.env.LOGIN_URL, "LOGIN_URL") ||
    // empty(process.env.FB_APP_ID, "FB_APP_ID") ||
    // empty(process.env.FB_APP_SECRET, "FB_APP_SECRET") ||
    empty(process.env.HTTP_PORT, "HTTP_PORT") ||
    empty(process.env.SOCKETIO_PORT, "SOCKETIO_PORT") ||
    empty(process.env.REDIS_URL, "REDIS_URL") ||
    empty(process.env.REDIS_PASSWORD, "REDIS_PASSWORD")
){
    throw "MISS_ENV";
}

// mongo setup
var username = process.env.MONGO_USERNAME;
var password = process.env.MONGO_PASSWORD;
var database = process.env.MONGO_DATABASE;
var dburl = process.env.MONGO_URL;
var dbport = process.env.MONGO_PORT;
const mongoDB = `mongodb://${username}:${password}@${dburl}:${dbport}/${database}`
console.log("trying to connect to " + mongoDB + "...")
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect(mongoDB);

mongoose.connection.on('connected', function () {
    console.error('[db] db connected.');
})

mongoose.connection.on('disconnected', function () {
    console.error('[db] db connection dropped.');
    mongoose.connect(mongoDB);
})

mongoose.connection.on('error', function (err) {
    console.error('[db] db error: ' + err.message);
})

// session and body-parser init
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(session({
    name: "PHPSESSID",
    secret: process.env.SESSION_SECRET,
    resave: 'false',
    store: new RedisStore({ client: redisClient }),
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
let buffers = {}

wss.on('connection', ws => {
    const sendData = (client, data) => {
        client.send(JSON.stringify(data))
    }
    const sendErr = (data) => {
        ws.send(JSON.stringify(data))
    }
    // sendData(ws, ['output', codes])

    ws.onmessage = async (message) => {
        const { data } = message
        console.log(data)
        const [task, payload] = JSON.parse(data)

        switch (task) {
            case 'input': {
                const author = payload.author
                const content = payload.content
                if (content.length === 2 && content[0].ope + content[1].ope === 1 &&
                    content[0].start === content[1].start && content[0].start + 1 === content[0].end &&
                    content[0].end === content[1].end) {
                    if (content[0].start != buffers[author].line) {
                        if (buffers[author].text != '') {
                            let textToDB = buffers[author].text.slice(0, -1)
                            var result = await QueryProject.addLineChange(projectid, filename, author, buffers[author].line + 1, 'delete', '')
                            console.log('delete', buffers[author].line + 1)
                            if (result['success'] === false) {
                                console.log("error", result['description'])
                            }
                            var result = await QueryProject.addLineChange(projectid, filename, author, buffers[author].line + 1, 'insert', textToDB)
                            console.log('insert', buffers[author].line + 1, textToDB)
                            if (result['success'] === false) {
                                console.log("error", result['description'])
                            }
                        }
                        buffers[author].text = ''
                    }
                    buffers[author].line = content[0].start
                    buffers[author].text = (content[0].ope === 0) ? content[0].content : content[1].content
                }
                else {
                    if (buffers[author] === undefined) {
                        buffers[author] = { line: content[0].start, text: '' }
                    }
                    if (buffers[author].text != '') {
                        let textToDB = (buffers[author].text.slice(-1) === '\n') ? buffers[author].text.slice(0, -1) : buffers[author].text
                        var result = await QueryProject.addLineChange(projectid, filename, author, buffers[author].line + 1, 'delete', '')
                        console.log('delete', buffers[author].line + 1)
                        if (result['success'] === false) {
                            console.log("error", result['description'])
                        }
                        var result = await QueryProject.addLineChange(projectid, filename, author, buffers[author].line + 1, 'insert', textToDB)
                        console.log('insert', buffers[author].line + 1, textToDB)
                        if (result['success'] === false) {
                            console.log("error", result['description'])
                        }
                        buffers[author].text = ''
                    }
                    if (content.length === 2) {
                        await content.forEach(async element => {
                            if (element.ope === 0) {
                                let textToDB = (element.content.slice(-1) === '\n') ? element.content.slice(0, -1) : element.content
                                textToDB = textToDB.split('\n')
                                await textToDB.forEach(async (line, idx) => {
                                    var result = await QueryProject.addLineChange(projectid, filename, author, element.start + idx + 1, 'insert', line)
                                    console.log('insert', element.start + idx + 1, line)
                                    if (result['success'] === false) {
                                        // sendErr(['error', 'bad operation'])
                                        console.log("error", result['description'])
                                    }
                                })
                            }
                            else {
                                let textToDB = (element.content.slice(-1) === '\n') ? element.content.slice(0, -1) : element.content
                                textToDB = textToDB.split('\n')
                                await textToDB.forEach(async (line, idx) => {
                                    var result = await QueryProject.addLineChange(projectid, filename, author, element.start + idx + 1, 'delete', '')
                                    console.log('delete', element.start + idx + 1)
                                    if (result['success'] === false) {
                                        // sendErr(['error', 'bad operation'])
                                        console.log("error", result['description'])
                                    }
                                })
                            }
                        })
                    }
                    else if (content.length === 1 && content[0].ope === 0) {
                        let textToDB = (content[0].content.slice(-1) === '\n') ? content[0].content.slice(0, -1) : content[0].content
                        textToDB = textToDB.split('\n')
                        await textToDB.forEach(async (line, idx) => {
                            var result = await QueryProject.addLineChange(projectid, filename, author, content[0].start + idx + 1, 'insert', line)
                            console.log('insert', content[0].start + idx + 1, line)
                            if (result['success'] === false) {
                                // sendErr(['error', 'bad operation'])
                                console.log("error", result['description'])
                            }
                        })
                    }
                    else if (content.length === 1 && content[0].ope === 1) {
                        let textToDB = (content[0].content.slice(-1) === '\n') ? content[0].content.slice(0, -1) : content[0].content
                        textToDB = textToDB.split('\n')
                        await textToDB.forEach(async (line, idx) => {
                            var result = await QueryProject.addLineChange(projectid, filename, author, content[0].start + idx + 1, 'delete', '')
                            console.log('delete', content[0].start + idx + 1)
                            if (result['success'] === false) {
                                // sendErr(['error', 'bad operation'])
                                console.log("error", result['description'])
                            }
                        })
                    }
                }
                wss.clients.forEach((client) => {
                    if (client.readyState === WebSocket.OPEN) {
                        sendData(client, ['output', payload])
                    }
                })
                break
            }
            case 'path': {
                wss.clients.forEach((client) => {
                    if (client.readyState === WebSocket.OPEN) {
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
const socketio_port = process.env.SOCKETIO_PORT

server.listen(socketio_port, () => {
    console.log(`http server listening on ${socketio_port}`)
})

module.exports = app;
