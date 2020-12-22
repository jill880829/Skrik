import { useState } from 'react'


const useStructure = (str) => {

    const [treeStructure, setTree] = useState(str);
    const [currentFilePath, setCurrentFilePath] = useState([]);
    const resetStatus = () => {
        resetIter(treeStructure)
        setTree(treeStructure)
    }
    const resetIter = (ele) => {
        if (Array.isArray(ele)) return ele.map(resetIter)
        else if (ele.type === 'file') {
            ele.status = 'off';
        }
        else if (ele.type === 'folder') {
            ele.status = 'close'
            resetIter(ele.data)
        }
    }
    const modifyClickTree = (fp_arr,isFolder) => {
        let a = treeStructure
        for (let i = 0; i < fp_arr.length - 1; i++) {
            a[fp_arr[i]].status = 'open'
            if ((i === fp_arr.length - 2)&&!isFolder) a[fp_arr[i]].status = 'innestopen'
            a = a[fp_arr[i]].data
        }
        if(isFolder){
            a[fp_arr[fp_arr.length - 1]].status = 'innestopenFocus'
        }
        else{
            a[fp_arr[fp_arr.length - 1]].status = 'on'
        }
        setTree([...treeStructure])
    }
    const loadStructure = (data) => {
        console.log("Function for reading message from backend")
    }
    const onClickFile = (fp) => {
        let fp_arr = fp.split('_')
        setCurrentFilePath(fp_arr)
        modifyClickTree(fp_arr, false)
    }
    const onClickFolder = (fp) => {
        let fp_arr = fp.split('_')
        setCurrentFilePath(fp_arr)
        modifyClickTree(fp_arr, true)
    }
    const IterAddNewFile = (ele) => {
        for (let i = 0; i < ele.length; i++) {
            if (ele[i].type === 'folder' && ele[i].status === 'open') {
                let find = IterAddNewFile(ele[i].data)
                if(find==='find'){
                    return "find"
                }
                else return undefined
            }
            else if (ele[i].type === 'folder' && (ele[i].status === 'innestopen'||ele[i].status === 'innestopenFocus')) {
                for (let j = 0; j < ele[i].data.length; j++) {
                    if (ele[i].data[j].type === 'blank') {
                        ele[i].data[j].displayAddBlank = true
                        return "find"
                    }
                }
            }
        }
    }
    const IterComfirmNewFile = (ele,name) => {
        for (let i = 0; i < ele.length; i++) {
            if (ele[i].type === 'folder' && ele[i].status === 'open') {
                if(IterComfirmNewFile(ele[i].data,name)==='find'){
                    return "find"
                }
                else return undefined
            }
            else if (ele[i].type === 'folder' && (ele[i].status === 'innestopen'||ele[i].status === 'innestopenFocus')) {
                for (let j = 0; j < ele[i].data.length; j++) {
                    if (ele[i].data[j].type === 'blank') {
                        ele[i].data[j].displayAddBlank = false
                        ele[i].data.splice(-1, 0, {
                            type: "file",
                            name: name,
                            status: "off"
                        });
                        return "find"
                    }
                }
            }
        }
    }
    const AddNewFile = () => {
        let findInsertPlace = IterAddNewFile(treeStructure)
        if(findInsertPlace!=='find'){
            for(let i=0;i<treeStructure.length;i++){
                if(treeStructure[i].type==='blank'){
                    treeStructure[i].displayAddBlank=true;
                }
            }
        }
        setTree([...treeStructure])    
    }
    const SaveToTree = (name) => {
        let findInsertPlace = IterComfirmNewFile(treeStructure,name)
        if(findInsertPlace!=='find'){
            for(let i=0;i<treeStructure.length;i++){
                if(treeStructure[i].type==='blank'){
                    treeStructure[i].displayAddBlank=false;
                    treeStructure.push({
                        type: "file",
                        name: name,
                        status: "off"
                    });
                }
            }
        }
        setTree([...treeStructure]) 
    }



    // const sendCodes = (codes) => {
    //     sendData(['input', codes])
    // }

    return {
        treeStructure, loadStructure, resetStatus, onClickFile, onClickFolder, AddNewFile, SaveToTree, currentFilePath

    }
}

export default useStructure
