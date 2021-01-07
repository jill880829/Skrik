const fs = require('fs');

function sort_files(files){
    files = files.sort(function(a,b) {
        var _range = (a.length < b.length)? a.length : b.length;
        for(var i = 0; i <= _range; i++) {
            if (a[i] === b[i])
                continue;
            else if ( a[i] === undefined || a[i] < b[i]) {
                if((b.match(/\x2f/g) || []).length > (a.match(/\x2f/g) || []).length)
                    return true;
                else
                    return false;
            }
            else if (b[i] === undefined || a[i] > b[i]){
                if((a.match(/\x2f/g) || []).length > (b.match(/\x2f/g) || []).length)
                    return false;
                else
                    return true;
            }
        }
        return false;
    });
    return files;
}

function write_file_structure(projectname, files, datas){
    for (let i in files){
        let f = file[i].split('/');
        let file_name = f[f.length - 1];
        let dir = projectname + f.slice(0, f.length - 1).join('/');
        fs.mkdirSync(dir, { recursive: true });
        fs.writeFile(dir + '/' + file_name, datas[i], function (err) {
            if (err)
                console.log(err);
        });    
    }
}

function zip_project(project_name){
    // fs.mkdirSync(dir, { recursive: true });
}
module.exports = {sort_files: sort_files,
                  zip_project: zip_project};