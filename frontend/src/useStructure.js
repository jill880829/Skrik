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
        for (let i = 0; i < fp_arr.length - 1; i++) {
            a[fp_arr[i]].status = 'open'
            if ((i === fp_arr.length - 2) && !isFolder) a[fp_arr[i]].status = 'innestopen'
            a = a[fp_arr[i]].data
        }
        if (isFolder) {
            a[fp_arr[fp_arr.length - 1]].status = 'innestopenFocus'
        }
        else {
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
                if (IterComfirmNewFile(ele[i].data, name, isFolder) === 'find') {
                    return "find"
                }
                else return undefined
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
                            return "find"
                        }
                    }
                    else {
                        if (ele[i].data[j].type === 'blankFile') {
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
        let findInsertPlace = IterComfirmNewFile(treeStructure, name, isFolder)
        if (findInsertPlace !== 'find') {
            for (let i = 0; i < treeStructure.length; i++) {
                if (isFolder) {
                    if (treeStructure[i].type === 'blankFolder') {
                        treeStructure[i].displayAddBlank = false;
                        let cnt = 0
                        for (let k = 0; k < treeStructure.length; k++) {
                            if (treeStructure[k].type === 'blankFile') {
                                cnt = k
                            }
                        }
                        treeStructure.splice(cnt, 0, {
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
                    if (treeStructure[i].type === 'blankFile') {
                        treeStructure[i].displayAddBlank = false;
                        treeStructure.push({
                            type: "file",
                            name: name,
                            status: "off"
                        });
                    }
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
