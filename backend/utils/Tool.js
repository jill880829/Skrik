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

module.exports = {sort_files: sort_files};