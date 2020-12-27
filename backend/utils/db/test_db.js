const mongoose = require('mongoose');
const QueryProject = require('./QueryProject');
const QueryUser = require('./QueryUser');

// mongo setup
var username = process.env.USERNAME || 'skrik';
var password = process.env.PASSWORD || 'qrghfvbhfggiyreghruqoqhfriegyireygr';
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

async function init(){
    var a = await QueryUser.createUser('a', '111');
    console.log(a);
    var a = await QueryUser.createUser('b', '222');
    console.log(a);
    var a = await QueryUser.createUser('c', '333');
    console.log(a);
    var a = await QueryUser.createUser('d', '444');
    console.log(a);
    var a = await QueryProject.createProject('projectzero', ['a','b']);
    console.log(a);
    var a = await QueryProject.createProject('projectzero', ['a','b']);
    console.log(a);
}

async function test(){
    var a = await QueryProject.addLineChange('5fe81fa209d2e7324fb729a6','testdir/hehehela','a', 1, 'insert', 'hallo!');
    console.log(a);
    // var a = await QueryProject.getFile('5fe81fa209d2e7324fb729a6', 'lalalaa');
    // console.log(a);
    // var a = await QueryProject.getFile('5fe81fa209d2e7324fb729a6', 'hehehela');
    // console.log(a);
    
}
// init();
test();