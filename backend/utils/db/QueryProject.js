const mongoose = require('mongoose');
const Projects = require('./ProjectSchema');

// if you want to "update line" delete line first then insert line 
// insert one line
// TODO Fool Proof?
function addLineChange(projectid, user, filename, linenum, log_type, content) {
    Projects.findOne({ ProjectId: projectid }, {Files: 1}, function(err, files){
        if(err) console.log(err);
        console.log('result：', files);
        for (let f of files) {
            if (f.FileName === filename){
                f.LineChanges.push({Index: linenum, 
                    Type: log_type, 
                    CreateTime: Date.now(), 
                    UpdateTime: Date.now(),
                    Deleted: false,
                    User: user,
                    Data: content});
                break;
            }
        }
        Projects.save(function(err, docs){
            if(err) console.log(err);
            console.log('save!');
        });
    });
}

// create a file in projectid
// TODO 架構問題,Fool Proof
function createFile(projectid, filename){
    Projects.findOne({ ProjectId: projectid }, function(err, project){
        if(err){ 
            console.log(err);
            return;
        }
        project.Files.push({FileName: filename, Deleted: false})
        project.save(function(err){
            if(err) console.log(err);
        });
    });
}

// delete a file in projectid
// TODO Fool Proof
// need to insert many linechange schema
function deleteFile(projectid, filename){
    Projects.findOne({ ProjectId: projectid }, function(err, project){
        if(err){ 
            console.log(err);
            return;
        }
        project.Files.push({FileName: filename, Deleted: true})
        project.save(function(err){
            if(err) console.log(err);
        });
    });
}

// create a project
// TODO Fool Proof
function createProject(projectname, projectid, user){
    Projects.create({ProjectName: projectname, ProjectId: projectid, Users: [user], Hash: "1234"}, function (err) {
        if (err) console.log(err);
      })
}

// delete a project
// TODO Fool Proof
function deleteProject(projectid, user){
    Projects.deleteOne({ProjectId: projectid}, function (err) {
        if (err) console.log(err);
      })
}

// return project_id
function getProjectid(projectname, user){
    Projects.find({ProjectName: projectname}, function (err, projects) {
        if (err) console.log(err);
        projects.forEach(function(project,id){
            project.Users.forEach(function(val,id){
                if (val === user){
                    return project.ProjectId;
                }
            })    
        })
        return null;
    })
}


/* TODO
Not testing yet!!!!!
Fool Proof
hash
*/