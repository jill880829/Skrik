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
        else if (ele.type === 'blankFile' || ele.type === 'blankFolder') {
            ele.displayAddBlank = false
        }
        else if (ele.type === 'folder') {
            ele.status = 'close'
            resetIter(ele.data)
        }
    }
    const modifyClickTree = (fp_arr, isFolder) => {
        let a = treeStructure
        let filename='/'
        for (let i = 0; i < fp_arr.length - 1; i++) {
            a[fp_arr[i]].status = 'open'
            filename += (`${a[fp_arr[i]].name}/`)
            if ((i === fp_arr.length - 2) && !isFolder) a[fp_arr[i]].status = 'innestopen'
            a = a[fp_arr[i]].data
        }
        if (isFolder) {
            a[fp_arr[fp_arr.length - 1]].status = 'innestopenFocus'
            filename += (`${a[fp_arr[fp_arr.length - 1]].name}/`)
        }
        else {
            a[fp_arr[fp_arr.length - 1]].status = 'on'
            filename += (`${a[fp_arr[fp_arr.length - 1]].name}`)
        }
        
        setTree([...treeStructure])
        return(filename)
    }
    const loadStructure = (data) => {
        console.log("Function for reading message from backend")
    }
    const onClickFile = (fp) => {
        let fp_arr = fp.split('_')
        setCurrentFilePath(fp_arr)
        const filename = modifyClickTree(fp_arr, false)
        return filename
    }
    const onClickFolder = (fp) => {
        let fp_arr = fp.split('_')
        setCurrentFilePath(fp_arr)
        const foldername = modifyClickTree(fp_arr, true)
        return foldername
    }
    const IterAddNewFile = (ele, isFolder) => {
        for (let i = 0; i < ele.length; i++) {
            if (ele[i].type === 'folder' && ele[i].status === 'open') {
                let find = IterAddNewFile(ele[i].data, isFolder)
                if (find === 'find') {
                    return "find"
                }
                else return undefined
            }
            else if (ele[i].type === 'folder' && (ele[i].status === 'innestopen' || ele[i].status === 'innestopenFocus')) {
                for (let j = 0; j < ele[i].data.length; j++) {
                    if (isFolder) {
                        if (ele[i].data[j].type === 'blankFolder') {
                            ele[i].data[j].displayAddBlank = true
                            return "find"
                        }
                    }
                    else {
                        if (ele[i].data[j].type === 'blankFile') {
                            ele[i].data[j].displayAddBlank = true
                            return "find"
                        }
                    }
                }
            }
        }
    }
    const IterComfirmNewFile = (ele, name, isFolder) => {
        for (let i = 0; i < ele.length; i++) {
            if (ele[i].type === 'folder' && ele[i].status === 'open') {
                const result = IterComfirmNewFile(ele[i].data, name, isFolder)
                if (result.find === 'find') {
                    const currentFilePath = `${ele[i].name}/${result.path}`
                    console.log(currentFilePath)
                    return {"find":"find","path":currentFilePath}

                }
                else return {"find":"unfind","path":""}
            }
            else if (ele[i].type === 'folder' && (ele[i].status === 'innestopen' || ele[i].status === 'innestopenFocus')) {
                for (let j = 0; j < ele[i].data.length; j++) {
                    if (isFolder) {
                        if (ele[i].data[j].type === 'blankFolder') {
                            ele[i].data[j].displayAddBlank = false
                            let cnt = 0
                            for (let k = 0; k < ele[i].data.length; k++) {
                                if (ele[i].data[k].type === 'blankFile') {
                                    cnt = k
                                }
                            }
                            ele[i].data.splice(cnt - 1, 0, {
                                type: "folder",
                                name: name,
                                status: "close",
                                data: [
                                    {
                                        type: "blankFolder",
                                        displayAddBlank: false,
                                    },
                                    {
                                        type: "blankFile",
                                        displayAddBlank: false,
                                    },
                                    "EOF"
                                ]
                            });
                            return {"find":"find","path":`${ele[i].name}/${name}/`}
                        }
                    }
                    else {
                        if (ele[i].data[j].type === 'blankFile') {
                            const currentFilePath = `${ele[i].name}/${name}` 
                            return {"find":"find","path":currentFilePath}
                        }
                    }
                }
            }
        }
        let returnName
        for(let i=0;i<ele.length;i++){
            if(isFolder){
                if (ele[i].type === 'blankFolder') {
                    returnName = name+'/'
                    ele[i].displayAddBlank = false;
                    let cnt = 0
                    for (let k = 0; k < ele.length; k++) {
                        if (ele[k].type === 'blankFile') {
                            cnt = k
                        }
                    }
                    ele.splice(cnt, 0, {
                        type: "folder",
                        name: name,
                        status: "close",
                        data: [
                            {
                                type: "blankFolder",
                                displayAddBlank: false,
                            },
                            {
                                type: "blankFile",
                                displayAddBlank: false,
                            },
                            "EOF"
                        ]
                    });
                }
            }
            else {
                if (ele[i].type === 'blankFile') {
                    ele[i].displayAddBlank = false;
                    returnName = name;
                }
            }
        }
        return {"find":"find","path":returnName}
    }
    const AddNewFile = (isFolder) => {
        let findInsertPlace = IterAddNewFile(treeStructure, isFolder)
        if (findInsertPlace !== 'find') {
            for (let i = 0; i < treeStructure.length; i++) {
                if (isFolder) {
                    if (treeStructure[i].type === 'blankFolder') {
                        treeStructure[i].displayAddBlank = true;
                    }
                }
                else {
                    if (treeStructure[i].type === 'blankFile') {
                        treeStructure[i].displayAddBlank = true;
                    }
                }
            }
        }
        setTree([...treeStructure])
    }
    const SaveToTree = (name, isFolder) => {
        let result = IterComfirmNewFile(treeStructure, name, isFolder).path
        console.log(result)
        setTree([...treeStructure])
        result = `/${result}`
        return result
    }



    // const sendCodes = (codes) => {
    //     sendData(['input', codes])
    // }

    return {
        treeStructure, setTree, resetStatus, onClickFile, onClickFolder, AddNewFile, SaveToTree, currentFilePath

    }
}

export default useStructure
