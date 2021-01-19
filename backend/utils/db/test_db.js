const mongoose = require('mongoose');
const QueryProject = require('./QueryProject');
const QueryUser = require('./QueryUser');

// mongo setup

var username = process.env.USERNAME || 'SkrikUser';
var password = process.env.PASSWORD || 'rgheklnvkfsvewahaorebn';
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
    var a = await QueryProject.createProject('projectzero', ['b'],'a');
    console.log(a);
    var a = await QueryProject.createProject('projectzero', ['a','d'],'c');
    console.log(a);
    var a = await QueryUser.listProjectids('a');
    console.log(a);
    
}

async function init_v2(){
    // create users
    // var a = await QueryUser.createUser('a_2', '111');
    // console.log(a);
    // var a = await QueryUser.createUser('b_2', '222');
    // console.log(a);
    // var a = await QueryUser.createUser('c_2', '333');
    // console.log(a);
    // var a = await QueryUser.createUser('d_2', '444');
    // console.log(a);
    // create projects
    var a = await QueryProject.createProject('projectzero', ['b_2'],'a_2');
    console.log(a);
    var a = await QueryProject.createProject('projectzero', ['a_2','d_2'],'c_2');
    console.log(a);
    var a = await QueryUser.listProjectids('a_2');
    console.log(a);
}
async function test(){
    /// add some commit
    // var a = await QueryProject.addLineChange('5feebc87fdcffa793790dd9e','/testdir/lala','a', 1, 'insert', 'hallo!');
    // console.log(a);
    // var a = await QueryProject.addLineChange('5feebc87fdcffa793790dd9e','/testdir/lala','b', 1, 'delete', '');
    // console.log(a);
    // var a = await QueryProject.addLineChange('5feebc87fdcffa793790dd9e','/testdir/lala','b', 1, 'insert', 'hello!');
    // console.log(a);
    // var a = await QueryProject.addLineChange('5feebc87fdcffa793790dd9e','/testdir/lala','b', 1, 'delete', '');
    // console.log(a);
    // var a = await QueryProject.addLineChange('5feebc87fdcffa793790dd9e','/testdir/lala','a', 2, 'insert', 'byebye!');
    // console.log(a);
    // var a = await QueryProject.addLineChange('5feebc87fdcffa793790dd9e','/testdir/hehehela','b', 1, 'insert', 'yeahyeeee');
    // console.log(a);
    // var a = await QueryProject.addLineChange('5feebc87fdcffa793790dd9e','/testdir/hehehela','a', 2, 'insert', 'wtf');
    // console.log(a);
    // var a = await QueryProject.addLineChange('5feebc87fdcffa793790dd9e','/testdir/hehehela','a', 3, 'insert', 'coooooool~');
    // console.log(a);
    // var a = await QueryProject.addLineChange('5feebc87fdcffa793790dd9e','/testdir/hehehela','a', 4, 'insert', 'good job!');
    // console.log(a);
    // var a = await QueryProject.addLineChange('5feebc87fdcffa793790dd9e','/testdir/hehehela','b', 5, 'insert', 'FLAG{this_is_your_flag!!!!!!!!}');
    // console.log(a);
    // var a = await QueryProject.addLineChange('5feebc87fdcffa793790dd9e','/testdir/test_del_v3','b', 5, 'insert', 'FLAG{this_is_your_flag_v3!!!!!!!!}');
    // console.log(a);
    // var a = await QueryProject.deleteFile('5feebc87fdcffa793790dd9e','/testdir/test_del_v3','a');
    // console.log(a);
    // var a = await QueryProject.addLineChange('5feebc87fdcffa793790dd9e','/testdir.xxxx','a', 1, 'insert', 'test_sorting!');
    // console.log(a);
    
    // var a = await QueryProject.getFile('5feebc87fdcffa793790dd9e', '/testdir/hehehela');
    // console.log(a);
    // var a = await QueryProject.getFile('5fe81fa209d2e7324fb729a6', 'hehehela');
    // console.log(a);
    
}

async function test_v2(){
    /// add some commit
    var a = await QueryProject.addLineChange('5ff74f19facae41a4c27f5c2','/testdir/lala','a_3', 1, 'insert', 'hallo!');
    console.log(a);
    var a = await QueryProject.addLineChange('5ff74f19facae41a4c27f5c2','/testdir/lala','a_3', 2, 'insert', 'line2!');
    console.log(a);
    var a = await QueryProject.addLineChange('5ff74f19facae41a4c27f5c2','/testdir/lala','a_3', 3, 'insert', 'FLAG{yeahyeeeeeeeeeeeee}');
    console.log(a);
    var a = await QueryProject.addLineChange('5ff74f19facae41a4c27f5c2','/testdir/lala','a_3', 4, 'insert', 'do not write FLAG!!!!');
    console.log(a);
    var a = await QueryProject.addLineChange('5ff74f19facae41a4c27f5c2','/testdir/lala','a_3', 5, 'insert', 'All right...');
    console.log(a);
    var a = await QueryProject.addLineChange('5ff74f19facae41a4c27f5c2','/.testfile','a_3', 1, 'insert', 'All right...');
    console.log(a);
    var a = await QueryProject.addLineChange('5ff74f19facae41a4c27f5c2','/.testfile','a_3', 2, 'insert', 'All right...');
    console.log(a);
    var a = await QueryProject.addLineChange('5ff74f19facae41a4c27f5c2','/.testfile','a_3', 3, 'insert', 'All right...');
    console.log(a);
    var a = await QueryProject.addLineChange('5ff74f19facae41a4c27f5c2','/testdir/haha','a_3', 1, 'insert', 'Good!');
    console.log(a);
    var a = await QueryProject.addLineChange('5ff74f19facae41a4c27f5c2','/testdir/haha','a_3', 2, 'insert', 'Good!');
    console.log(a);
    var a = await QueryProject.addLineChange('5ff74f19facae41a4c27f5c2','/testdir/haha','a_3', 3, 'insert', 'Good!');
    console.log(a);
    
    // var a = await QueryProject.getFile('5ff181955bf3050a232a7e61','/testfile','c_2', 5, 'insert', 'All right...');
    // console.log(a);
    
}
async function test_v3(){
    // var a = await QueryProject.addLineChange('60069f2fcd96ad16c3110379','/testdir/haha','test', 1, 'insert', 'wrong!');
    // console.log(a);
    // var a = await QueryProject.addLineChange('60069f2fcd96ad16c3110379','/testdir/haha','test', 2, 'insert', 'Good!3');
    // console.log(a);
    // var a = await QueryProject.addLineChange('60069f2fcd96ad16c3110379','/testdir/haha','test', 3, 'insert', 'wrong!4');
    // console.log(a);
    // var a = await QueryProject.addLineChange('60069f2fcd96ad16c3110379','/testdir/haha','test', 2, 'insert', 'Good!2');
    // console.log(a);
    // var a = await QueryProject.addLineChange('60069f2fcd96ad16c3110379','/testdir/haha','test', 1, 'update', 'Good!1');
    // console.log(a);
    // var a = await QueryProject.addLineChange('60069f2fcd96ad16c3110379','/testdir/haha','test', 5, 'insert', 'Good!4');
    // console.log(a);
    // var a = await QueryProject.addLineChange('60069f2fcd96ad16c3110379','/testdir/haha','test', 4, 'delete', '');
    // console.log(a);
    var a = await QueryProject.getFile('60069f2fcd96ad16c3110379','/testdir/haha');
    console.log(a);
}
// init();
// test();
// init_v2();
test_v3();
