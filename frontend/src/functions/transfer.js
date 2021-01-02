const transfer = (ls, _keys) => {
    if (ls.length > 1 || ls[0] !== "") {
        let copyls = {}
        let data = []
        for (let i = 0; i < ls.length; i++) {
            let tokens = ls[i].split('/')[0]
            const _split = ls[i].split('/') 
            let content = ls[i].split('/').slice(1)
            let contentjoin = content.join('/')
            if(_split[_split.length-1]===''&&_split.length===2){
                tokens = tokens+'/'
            }
            if (copyls.hasOwnProperty(tokens)) {
                copyls[tokens].push(contentjoin)
            }
            else {
                copyls[tokens] = [contentjoin]
            }
        }
        for (const keys in copyls) {
            data.push(transfer(copyls[keys], keys))
        }
        if (_keys === undefined) {
            let a = data[0].data
            a.pop()
            return a
        }
        else {
            data.push("EOF")
            data.splice(0, 0, {
                type: "blankFolder",
                displayAddBlank: false,
            })
            for (let k = 0; k < data.length; k++) {
                if (data[k].type === "file"||k===data.length-1) {
                    data.splice(k, 0, {
                        type: "blankFile",
                        displayAddBlank: false,
                    })
                    break;
                }
            }
            return ({
                type: "folder",
                name: _keys,
                status: "close",
                data: data
            })
        }
    }
    else {
        if(_keys[_keys.length-1]==='/'){
            return ({
                type: "folder",
                name: _keys.substring(0,_keys.length-1),
                status: "close",
                data: [{
                    type: "blankFolder",
                    displayAddBlank: false,
                },{
                    type: "blankFile",
                    displayAddBlank: false,
                },"EOF"]
            })
        }
        else
            return ({
                type: "file",
                name: _keys,
                status: "off",
            })
    }
}
export default transfer