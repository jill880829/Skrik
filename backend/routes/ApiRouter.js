var express = require('express');
var bodyParser = require('body-parser')
var router = express.Router();
const QueryUser = require('../utils/db/QueryUser');
const QueryProject = require('../utils/db/QueryProject');
const url = require('url');

 
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: true })

/* GET home page. */
router.get('/', function (req, res) {
    res.render('index', { title: 'Express' });
});

/* POST register */
router.post('/register', urlencodedParser, async function (req, res) {
    var username = req.body.name;
    var password = req.body.passwd;
    var result = await QueryUser.createUser(username, password);
    if (result["success"] === false) 
    {
        if (result["description"].includes("Failed!!!"))
            res.status(500).send(result["description"]);
        else
            res.status(403).send(result["description"]);
    }
    else
        res.send(result);
});

/* Get profile page and list projectids */
/* 
NOW :username version
TODO 
1. set sha  key:sha value:usename-projectid
2. Change to session version (find req.session cookie)
*/
router.get('/projects', async function (req, res) {
    var parts = url.parse(req.url, true);
    var queryUsername = parts.query["username"];
    var result = await QueryUser.listProjectids(queryUsername);
    if (result["success"] === false) {
        if (result["description"] === "Querying user Failed!!!")
            res.status(500).send(result["description"]);
        else
            res.status(403).send(result["description"]);
    }
    else
        res.send(result["ids"]);
});

/* list files (need sort) */

// TODO:
// 1. use sha to find value
// 2. ls need to expire old key
router.get('/ls/:id', async function (req, res) {
    var projectid = req.params.id;
    var result = await QueryProject.listFiles(projectid);
    if (result["success"] === false) 
    {
        if (result["description"] === "Querying user Failed!!!")
            res.status(500).send(result["description"]);
        else
            res.status(403).send(result["description"]);
    }
    else
    {
        var files = result["files"];
        if (files !== null)
            files = files.sort();
        res.send(files);
    }   
});

/* create project */
router.post('/create_project', urlencodedParser, async function (req, res) {
    var projectname = req.body.name;
    var usernames = req.body.usernames;
    var result = await QueryProject.createProject(projectname, usernames);
    if (result["success"] === false) 
    {
        if (result["description"] === "Project creation Failed!!!")
            res.status(500).send(result["description"]);
        else
            res.status(403).send(result["description"]);
    }
    else
    {
        res.send(result["description"]);
    }   
});

// TODO download project
router.get('/api/download_project', async function (req, res){
    // TODO
    res.send('still working...');
});


module.exports = router;

