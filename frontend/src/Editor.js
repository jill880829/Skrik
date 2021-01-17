// 20210116_comment
// Add home button at 'help_home_btn'
// TODO: Add onClick function to this home btn
import React, { useState, useEffect } from 'react'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/material-darker.css'
import 'codemirror/mode/xml/xml'
import 'codemirror/mode/python/python'
import 'codemirror/mode/javascript/javascript'
import 'codemirror/mode/css/css'
import 'codemirror/mode/verilog/verilog'
import 'codemirror/mode/clike/clike'
import sliceLines from 'slice-lines'
import { diffLines } from 'diff'
import { Controlled as ControlledEditor } from 'react-codemirror2'
import { DiJavascript1, DiCss3Full, DiHtml5, DiReact, DiPython } from "react-icons/di";
import { SiCplusplus, SiJson } from "react-icons/si";
import { AiOutlineFile, AiFillRest, AiFillHome} from "react-icons/ai";
import CodeSelect from './components/codeSelect'
import transfer from './functions/transfer'
import rmduplicate from './functions/rmduplicate'
import sort_files from './functions/sort'
import FileStructure from './Structure'
import useStructure from './useStructure'
import { IconContext } from "react-icons";
import { useParams } from 'react-router-dom'

const FILE_ICONS = {
    js: <DiJavascript1 />,
    css: <DiCss3Full />,
    html: <DiHtml5 />,
    jsx: <DiReact />,
    py: <DiPython />,
    cpp: <SiCplusplus />,
    json: <SiJson />
};

<<<<<<< HEAD
//const client = new WebSocket('wss://skrik.net/api/wss')
const client = new WebSocket('ws://localhost:4000')
=======
var client = new WebSocket('ws://localhost:3002')

>>>>>>> origin/anita_0116
const codingOptions = [
    { label: 'Python', value: 'python' },
    { label: 'HTML', value: 'xml' },
    { label: 'Javascript', value: 'javascript' },
    { label: 'C++', value: 'text/x-c++src' },
    { label: 'Verilog', value: 'verilog' },
    { label: 'CSS', value: 'css' },
]

export default function Editor(props) {
    const ls = []
    const { treeStructure, setTree, resetStatus, onClickFile, onClickFolder, AddNewFile, SaveToTree, currentFilePath } = useStructure([{
        type: "blankFolder",
        displayAddBlank: false,
    },
    {
        type: "blankFile",
        displayAddBlank: false,
    },
    ]);
    const [filesStructure, setFile] = useState(ls);
    const [language, setLan] = useState('python');
    const [fileName, setFileName] = useState('Untitled')
    const { hash } = useParams()
    const [projectName, setProjectName] = useState("")
    const [filePath, setFilePath] = useState('Untitled')
    useEffect(async () => {
        const result = await fetch(`/api/ls/${hash}`, {
            method: 'GET',
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        })
        if (result.status === 401) {
            result.text().then(res => {
                // res.text().then(res => {
                //     alert(`401 Unauthorized\n${res}`)
                // })
                window.location.href = '/Login'
            })
        }
        else if (result.status === 403) {
            result.text().then(res => {
                alert(`403 Forbidden: Refuse to create the project!\n${res}`)
                window.location.href = '/Menu'
                //console.log(res) 
            })
        }
        else if (result.status === 500) {
            result.text().then(res => {
                alert(`500 Internal Server Error\n${res}`)
                //console.log(res) 
            })
        }
        else if (result.status === 200) {
            const { project_name, files } = await result.json()
            setProjectName(project_name)
            console.log(files)
            if (files.length !== 0) {
                setFile([...files])
                setTree([...transfer(rmduplicate(files).list)])
            }
        }
        else{
            alert("Unknown Error!")
        }
        //console.log(result)
        await sendData(['init', hash])
    }, [])

    function onChangeCode(value) {
        setLan(value.value);
    }
    function onChange(value) {
        sendCodes(value);
    }

    const [codes, setCodes] = useState('')
    const [opened, setOpened] = useState(false)

    client.onmessage = (message) => {
        const { data } = message
        const [task, update] = JSON.parse(data)
        if (task === 'init-file') {
            setCodes(update)
            setOpened(true)
        }
        else if (task === 'output') {
            let tmp = codes;
            // console.log(update.content)
            if(update.filepath === filePath) {
                const content = update.content
                content.forEach((part) => {
                    if (part.ope === 0) {
                        if (part.start === 0) tmp = part.content + sliceLines(tmp, part.start)
                        else tmp = sliceLines(tmp, 0, part.start) + '\n' + part.content + sliceLines(tmp, part.start)
                    }
                    else {
                        if (part.start === 0) tmp = sliceLines(tmp, part.end)
                        else tmp = sliceLines(tmp, 0, part.start) + '\n' + sliceLines(tmp, part.end)
                    }
                })
                setCodes(tmp)
            }
        }
        else if (task === 'output-path') {
            const rmdup = rmduplicate([...filesStructure, update])
            if (rmdup.duplicate) {
                console.log("EXISTS")
            }
            console.log(rmdup.list)
            const sorted = sort_files(rmdup.list)
            console.log(sorted)
            setFile([...sorted])
            setTree(transfer([...sorted]))
        }
    }

    client.onopen = () => {
        console.log('websocket open')
        setOpened(true)
    }

    client.onclose = () => {
        console.log('websocket close')
        setOpened(true)
    }

    const sendData = (data) => {
        client.send(JSON.stringify(data))
    }

    const sendCodes = (code) => {
        let diff = diffLines(codes, code)
        let diff_code = []
        let count_line = 0
        diff.forEach((part) => {
            if (part.added) {
                diff_code.push({ ope: 0, start: count_line, end: count_line + part.count, content: part.value })
                count_line += part.count
            }
            else if (part.removed) {
                diff_code.push({ ope: 1, start: count_line, end: count_line + part.count, content: part.value })
            }
            else {
                count_line += part.count
            }
        })
        sendData(['input', {filepath: filePath, content: diff_code}])
    }

    const sendNewFile = (ls) => {
        sendData(['path', ls])
    }
    const requestFileContext = (ls) => {
        sendData(['request_file', ls])
        setFilePath(ls)
        const filenamesplit = ls.split('/')
        setFileName(filenamesplit[filenamesplit.length - 1])
    }
    const deb = (ls) => {
        rmduplicate(ls)
        console.log(transfer(rmduplicate(ls).list))
    }
    const ext = fileName.split(".")[1];
    
    return (
        <div>
            <div className='page_container'>
<<<<<<< HEAD
                <div id='folder_structure'>
                    <FileStructure projectName={projectName} returnNewFile={sendNewFile} returnClickFile={requestFileContext} fileList={filesStructure} treeStructure={treeStructure}
=======
                <div className='folder_structure'>
                    <FileStructure projectName={projectName} returnNewFile={sendNewFile} returnClickFile={requestFileContext} treeStructure={treeStructure}
>>>>>>> origin/anita_0116
                        setTree={setTree} resetStatus={resetStatus} onClickFile={onClickFile} onClickFolder={onClickFolder}
                        AddNewFile={AddNewFile} SaveToTree={SaveToTree} currentFilePath={currentFilePath} />
                </div>
                <div className='editor_container'>
                    <div id='editor_title'>
                        <div>
                            {FILE_ICONS[ext] || <AiOutlineFile />}
                            <span style={{ marginLeft: "10px" }}>{fileName}</span>
                        </div>
                        <CodeSelect options={codingOptions} onChange={onChangeCode} />
                    </div>

                    <ControlledEditor
                        onBeforeChange={(editor, data, value) => { onChange(value); }}
                        value={opened ? codes : 'Loading...'}
                        className="code_mirror_wrapper"
                        options={{
                            lineWrapping: true,
                            lint: true,
                            mode: language,
                            theme: 'material-darker',
                            lineNumbers: true,
                            cursorHeight: 0.85,
                            indentUnit: 0,
                            smartIndent: false,
                            electricChars: false
                        }}
                        placeholder='Select a code mode...'
                        defaultValue={{ label: "Select a code mode...", value: 0 }}
                    />
                </div>
                <div className='help_bar'>
                    <div style={{display: 'table'}}>
                        <div className = 'help_btn_bar'>
                            <button className='help_home_btn'>
                                <IconContext.Provider value={{ color: 'white', size: '50px' }}>
                                    <AiFillHome />
                                </IconContext.Provider>
                            </button>
                        </div>
                    </div>
                    
                </div>
            </div>
        </div>
    )
}