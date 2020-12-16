import { useState } from 'react'


const useStructure = (str) => {

    const [treeStructure, setTree] = useState(str);
    const [currentFilePath, setCurrentFilePath] = useState([]);
    // 
    const modifyClickTree = (fp_arr) => {
        let a = treeStructure
        console.log(a,fp_arr)
        for(let i=0;i<fp_arr.length-1;i++){
            a = a[fp_arr[i]].data
        }
        console.log("cur",a[fp_arr[fp_arr.length-1]])
        a[fp_arr[fp_arr.length-1]].status='on'
        console.log(a)
        
    }
    const loadStructure = (data) => {
        console.log("Function for reading message from backend")
    }
    const onClickFile = (fp) => {
        console.log("In Onclickfile",fp)
        let fp_arr = fp.split('_') 
        setCurrentFilePath(fp_arr)
        console.log(treeStructure[0].data[0].data[0])
        console.log(fp_arr)
        modifyClickTree(fp_arr)
    }
    // const sendCodes = (codes) => {
    //     sendData(['input', codes])
    // }

    return {
        treeStructure,loadStructure,onClickFile,currentFilePath
       
    }
}

export default useStructure
