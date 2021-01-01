const mongoose = require('mongoose');
const QueryProject = require('./QueryProject');
const QueryUser = require('./QueryUser');

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

async function init(){
    // create users
    var a = await QueryUser.createUser('a', '111');
    console.log(a);
    var a = await QueryUser.createUser('b', '222');
    console.log(a);
    var a = await QueryUser.createUser('c', '333');
    console.log(a);
    var a = await QueryUser.createUser('d', '444');
    console.log(a);
    // create projects
    var a = await QueryProject.createProject('projectzero', ['a','b']);
    console.log(a);
    var a = await QueryProject.createProject('projectzero', ['a','c','d']);
    console.log(a);
    var a = await QueryUser.listProjectids('a');
    console.log(a);
}

async function test(){
    /// add some commit
    var a = await QueryProject.addLineChange('5feebc87fdcffa793790dd9e','/testdir/lala','a', 1, 'insert', 'hallo!');
    console.log(a);
    var a = await QueryProject.addLineChange('5feebc87fdcffa793790dd9e','/testdir/lala','b', 1, 'delete', '');
    console.log(a);
    var a = await QueryProject.addLineChange('5feebc87fdcffa793790dd9e','/testdir/lala','b', 1, 'insert', 'hello!');
    console.log(a);
    var a = await QueryProject.addLineChange('5feebc87fdcffa793790dd9e','/testdir/lala','b', 1, 'delete', '');
    console.log(a);
    var a = await QueryProject.addLineChange('5feebc87fdcffa793790dd9e','/testdir/lala','a', 2, 'insert', 'byebye!');
    console.log(a);
    var a = await QueryProject.addLineChange('5feebc87fdcffa793790dd9e','/testdir/hehehela','b', 1, 'insert', 'yeahyeeee');
    console.log(a);
    var a = await QueryProject.addLineChange('5feebc87fdcffa793790dd9e','/testdir/hehehela','a', 2, 'insert', 'wtf');
    console.log(a);
    var a = await QueryProject.addLineChange('5feebc87fdcffa793790dd9e','/testdir/hehehela','a', 3, 'insert', 'coooooool~');
    console.log(a);
    var a = await QueryProject.addLineChange('5feebc87fdcffa793790dd9e','/testdir/hehehela','a', 4, 'insert', 'good job!');
    console.log(a);
    var a = await QueryProject.addLineChange('5feebc87fdcffa793790dd9e','/testdir/hehehela','b', 5, 'insert', 'FLAG{this_is_your_flag!!!!!!!!}');
    console.log(a);
    var a = await QueryProject.addLineChange('5feebc87fdcffa793790dd9e','/testdir/test_del_v3','b', 5, 'insert', 'FLAG{this_is_your_flag_v3!!!!!!!!}');
    console.log(a);
    var a = await QueryProject.deleteFile('5feebc87fdcffa793790dd9e','/testdir/test_del_v3','a');
    console.log(a);
    
    // var a = await QueryProject.getFile('5fe81fa209d2e7324fb729a6', 'lalalaa');
    // console.log(a);
    // var a = await QueryProject.getFile('5fe81fa209d2e7324fb729a6', 'hehehela');
    // console.log(a);
    
}
// init();
test();