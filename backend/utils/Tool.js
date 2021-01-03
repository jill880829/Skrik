function sort_files(files){
    files = files.sort(function(a,b){
        var _range = (a.length < b.length)? a.length : b.length;
        for(var i = 0; i < _range; i++)
        {
            if (a[i] === b[i])
                continue;
            else if (a[i] === "/" && b[i] !== "/")
                return false;
            else if (b[i] === "/" && a[i] !== "/")
                return true;
            else
                return a[i] > b[i];
        }
        return (a.length > b.length);
    });
    return files
}

module.exports = {sort_files: sort_files};