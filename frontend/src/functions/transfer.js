const transfer = (ls,_keys) => {
    if(ls.length>1||ls[0]!==""){
        let copyls = {}
        let data = []
        for(let i=0;i<ls.length;i++){
            let tokens = ls[i].split('/')[0]
            let content = ls[i].split('/').slice(1)
            let contentjoin = content.join('/')
            if(copyls.hasOwnProperty(tokens)){
                copyls[tokens].push(contentjoin)
            }
            else{
                copyls[tokens] = [contentjoin]
            }
        }
        for(const keys in copyls){
            data.push(transfer(copyls[keys],keys))
        }
        if(_keys===undefined) {
            let a = data[0].data
            a.pop()
            return a
        }
        else{
            data.push("EOF")
            data.splice(0, 0, {
                type: "blankFolder",
                displayAddBlank: false,
            })
            for(let k=0;k<data.length;k++){
                if(data[k].type==="file"){
                    data.splice(k, 0, {
                        type: "blankFile",
                        displayAddBlank: false,
                    })
                    break;
                }
            }
            return({
                type: "folder",
                name: _keys,
                status: "close",
                data: data
            })
        }
    }
    else{
        return(
            {
                type: "file",
                name: _keys,
                status: "off",
            }
        )
    }
}
export default transfer