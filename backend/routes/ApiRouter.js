var express = require('express');
var bodyParser = require('body-parser')
var router = express.Router();
const sha256 = require('crypto-js/sha256');

const QueryUser = require('../utils/db/QueryUser');
const QueryProject = require('../utils/db/QueryProject');
const QueryRedis = require('../utils/db/QueryRedis');
const Tool = require('../utils/Tool')


// handle ID sha256
var counter = 0;
var secret = process.env.ID_SECRET;

// create json parser.
var jsonParser = bodyParser.json({ extended: true })

/* GET home page. */
router.get('/', function (req, res) {
    // res.render('index', { title: 'Express' });
    return res.status(403).send('Invalid page');
});

/* POST register */
router.post('/register', jsonParser, async function (req, res) {
    var username = req.body.username;
    var password = req.body.password;
    console.log(typeof(username))
    var result = await QueryUser.createUser(username, password);
    
    if (result["success"] === false) 
    {
        if (result["description"].includes("Failed!!!"))
            return res.status(500).send(result["description"]);
        else
            return res.status(403).send(result["description"]);
    }
    else
        return res.send(result);
});

/* Get profile page and list projectids */
router.get('/projects', async function (req, res) {
    if(! req.isAuthenticated())
        return res.status(401).send("Invalid User!!!");
    var queryUsername = req.session.passport.user;
    var result = await QueryUser.listProjectids(queryUsername);
    if (result["success"] === false) {
        if (result["description"] === "Querying user Failed!!!")
            return res.status(500).send(result["description"]);
        else
            return res.status(403).send(result["description"]);
    }
    else {
            var projects_info = [];
            for (let id of result["ids"])
            {
                var idHash = sha256(id + counter.toString() + secret).toString();
                counter += 1;
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
        }
        return res.send(projects_info);
});

/* list sorted files */
/* TODO:
    ls need to expire old key, still thinking
*/
router.get('/ls/:idsha', async function (req, res) {
    if(! req.isAuthenticated())
        return res.status(401).send("Invalid User!!!");
    var idsha = req.params.idsha;
    console.log('get id...');
    var get_res = await QueryRedis.getID(idsha);
    console.log(get_res);
    if (get_res["success"] === false) 
        return res.status(403).send(get_res["description"]);
    else
        var projectid = get_res["id"];
    
    var result = await QueryProject.listFiles(projectid);
    if (result["success"] === false) 
    {
        if (result["description"] === "Querying user Failed!!!")
            return res.status(500).send(result["description"]);
        else
            return res.status(403).send(result["description"]);
    }
    var project_name_res = await QueryProject.getProjectName(projectid);
    var files = result["files"];
    if (files !== null)
        files = Tool.sort_files(files);
    return res.json({"project_name": project_name_res["name"], "files":files});

});

/* create project */
router.post('/create_project', jsonParser, async function (req, res) {
    if(! req.isAuthenticated())
        return res.status(401).send("Invalid User!!!");
    var owner = req.session.passport.user;
    var projectname = req.body.project_name;
    var colabs = req.body.colabs;
    var result = await QueryProject.createProject(projectname, colabs, owner);
    if (result["success"] === false) 
    {
        if (result["description"] === "Project creation Failed!!!")
            return res.status(500).send(result["description"]);
        else
            return res.status(403).send(result["description"]);
    }
    return res.send(result["description"]);
});

/* TODO download project */
router.get('/download_project', async function (req, res){
    // TODO
    return res.send('still working...');
});

module.exports = router;

