function sort_files(files){
    files = files.sort(function(a,b) {
        var _range = (a.length < b.length)? a.length : b.length;
        console.log("----------")
        console.log(a,b)
        
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

export default sort_files