var express = require('express');
var bodyParser = require('body-parser')
var router = express.Router();
const url = require('url');
const sha256 = require('crypto-js/sha256');
const base64 = require('crypto-js/enc-base64');
var passport = require('passport');


const QueryUser = require('../utils/db/QueryUser');
const QueryProject = require('../utils/db/QueryProject');
const QueryRedis = require('../utils/db/QueryRedis');
const Tool = require('../utils/Tool')
// handle ID sha256
var counter = 0;
var secret = process.env.ID_SECRET;

/* TODO
access control of route
*/

// create application/x-www-form-urlencoded parser.
// if needed, could change to json parser.
var jsonParser = bodyParser.json({ extended: true })

/* GET home page. */
router.get('/', function (req, res) {
    res.render('index', { title: 'Express' });
});

/* POST register */
router.post('/register', jsonParser, async function (req, res) {
    var username = req.body.username;
    var password = req.body.password;
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
router.get('/projects', async function (req, res) {
    if (req.session.passport === undefined || req.session.passport === null)
        var queryUsername = '';
    else
        var queryUsername = req.session.passport.user;
    var result = await QueryUser.listProjectids(queryUsername);
    if (result["success"] === false) {
        if (result["description"] === "Querying user Failed!!!")
            res.status(500).send(result["description"]);
        else
            res.status(403).send(result["description"]);
    }
    else {
            var projects_info = [];
            for (let id of result["ids"])
            {
                var idHash = sha256(id + counter.toString() + secret).toString();
                var store_res = QueryRedis.storeID(idHash, queryUsername, id)
                if (store_res["success"] === false)
                    res.status(500).send(store_res["description"]);
                else{
                    const projectname = await QueryProject.getProjectName(id);
                    if (projectname["success"] === false)
                        res.status(500).send(projectname["description"]);
                    const projectusers = await QueryProject.getProjectUsers(id);
                    if (projectusers["success"] === false)
                        res.status(500).send(projectusers["description"]);    
                    projects_info.push({"id_hash": idHash,"project_name": projectname["name"], "project_users": projectusers["users"]});
                }
            }
        res.send(projects_info);
    }
});

/* list sorted files */
// TODO:
// ls need to expire old key
router.get('/ls/:idsha', async function (req, res) {
    var idsha = req.params.idsha;
    var get_res = await QueryRedis.getID(idsha);
    if (get_res["success"] === false) 
        return get_res["description"];
    else
        var projectid = get_res["id"];
    
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
            files = Tool.sort_files(files);
        res.send(files);
    }   
});

/* create project */
router.post('/create_project', jsonParser, async function (req, res) {
    var owner = req.session.passport.user;
    var projectname = req.body.project_name;
    var colabs = req.body.colabs;
    var result = await QueryProject.createProject(projectname, colabs, owner);
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

/* TODO download project */
router.get('/download_project', async function (req, res){
    // TODO
    res.send('still working...');
});

module.exports = router;

