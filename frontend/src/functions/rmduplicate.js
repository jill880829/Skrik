

const rmduplicate = (ls) => {
    let folderList = []
    for(let i=0;i<ls.length;i++){
        if(ls[i][ls[i].length-1]==='/'){
            folderList.push({"id":i,"name":ls[i]})
        }
    }
    let cnt=0
    for(let j=0;j<folderList.length;j++){
        const id = folderList[j].id
        const name = folderList[j].name
        const length = name.length
        for (let k=0;k<ls.length;k++){
            if(ls[k].substring(0,length)===name&&k!==(id-cnt)){
                ls.splice((id-cnt),1)
                cnt+=1
            }
        }
    }
    return(ls)
}
export default rmduplicate