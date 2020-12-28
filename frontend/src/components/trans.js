const transfer = (ls,_keys) => {
    //console.log(ls)
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
            //console.log(copyls[copyls.length-1])
            data.push(transfer(copyls[keys],keys))
        }
        if(_keys===undefined) {
            console.log("12e3r4t5hy")
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
    else{//Terminated
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