const fs = require('fs');
const exec = require('child_process').execSync;


function sort_files(files){
    files = files.sort(function(a,b) {
        var _range = (a.length < b.length)? a.length : b.length;
        for(var i = 0; i <= _range; i++) {
            if (a[i] === b[i])
                continue;
            else if ( a[i] === undefined || a[i] < b[i]) {
                if((b.match(/\x2f/g) || []).length > (a.match(/\x2f/g) || []).length)
                    return 1;
                else
                    return -1;
            }
            else if (b[i] === undefined || a[i] > b[i]){
                if((a.match(/\x2f/g) || []).length > (b.match(/\x2f/g) || []).length)
                    return -1;
                else
                    return 1;
            }
        }
        return -1;
    });
    return files;
}

function write_file_structure(base, files, datas){
    for (let i in files){
        let f = files[i].split('/');
        let file_name = f[f.length - 1];
        let dir = base + f.slice(0, f.length - 1).join('/');
        fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(dir + '/' + file_name, datas[i], function (err) {
            if (err)
                console.log(err);
        });
    }
}

async function zip_project(filedir, projectname){
    exec(`cd ${filedir}; zip -r ${projectname}.zip ${projectname}`, (err, stdout, stderr) => {
        if (err) {
          console.error(`exec error: ${err}`);
          return;
        }
        console.log(stdout);
    });
}
module.exports = {sort_files: sort_files,
                  write_file_structure:write_file_structure,
                  zip_project: zip_project};