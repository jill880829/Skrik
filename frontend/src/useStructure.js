import { useState } from 'react'


const useStructure = (str) => {

    const [treeStructure, setTree] = useState(str);
    const [currentFilePath, setCurrentFilePath] = useState([]);
    const resetStatus = () =>{
        resetIter(treeStructure)
        setTree(treeStructure)
    }
    const resetIter = (ele) =>{
        if(Array.isArray(ele)) return ele.map(resetIter)
        else if(ele.type==='file'){
            ele.status='off';
        }
        else if(ele.type==='folder'){
            ele.status='close'
            resetIter(ele.data)
        }
    }
    const modifyClickTree = (fp_arr) => {
        let a = treeStructure
        for(let i=0;i<fp_arr.length-1;i++){
            a[fp_arr[i]].status='open'
            if(i===fp_arr.length-2) a[fp_arr[i]].status='innestopen'
            a = a[fp_arr[i]].data
        }
        a[fp_arr[fp_arr.length-1]].status='on'
        //console.log(treeStructure)
        setTree([...treeStructure])
    }
    const loadStructure = (data) => {
        console.log("Function for reading message from backend")
    }
    const onClickFile = (fp) => {
        //console.log("In Onclickfile",fp)
        let fp_arr = fp.split('_') 
        setCurrentFilePath(fp_arr)
        modifyClickTree(fp_arr,false)
    }
    const IterAddNewFile = (ele) => {
        for(let i=0;i<ele.length;i++){
            //console.log(ele)
            if(ele[i].type==='folder'&&ele[i].status==='open'){
                IterAddNewFile(ele[i].data)
            }
            else if(ele[i].type==='folder'&&ele[i].status==='innestopen'){
                for(let j=0;j<ele[i].data.length;j++){
                    if(ele[i].data[j].type==='blank'){
                        ele[i].data[j].displayAddBlank=true
                    }
                }
            }
        }
        setTree([...ele])
    }
    const AddNewFile = () => {
        //console.log(treeStructure)
        IterAddNewFile(treeStructure)
        //setTree(treeStructure)
        //console.log(treeStructure)     
    }




    // const sendCodes = (codes) => {
    //     sendData(['input', codes])
    // }

    return {
        treeStructure,loadStructure,resetStatus,onClickFile,AddNewFile,currentFilePath
       
    }
}

export default useStructure
