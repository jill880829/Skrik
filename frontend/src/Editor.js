import React, { useState, useEffect} from 'react'
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
import { AiOutlineFile, AiFillRest} from "react-icons/ai";
import CodeSelect from './components/codeSelect'
import transfer from './functions/transfer'
import rmduplicate from './functions/rmduplicate'
import FileStructure from './structure'
import useStructure from './useStructure'
import {useParams,useLocation} from 'react-router-dom'

const FILE_ICONS = {
    js: <DiJavascript1 />,
    css: <DiCss3Full />,
    html: <DiHtml5 />,
    jsx: <DiReact />,
    py: <DiPython />,
    cpp: <SiCplusplus />,
    json: <SiJson />
};

const client = new WebSocket('ws://localhost:4000')

const codingOptions = [
    { label: 'Python', value: 'python' },
    { label: 'HTML', value: 'xml' },
    { label: 'Javascript', value: 'javascript' },
    { label: 'C++', value: 'text/x-c++src' },
    { label: 'Verilog', value: 'verilog' },
    { label: 'CSS', value: 'css' },
]

export default function Editor(props) {
    const ls=[]
    const {treeStructure, setTree, resetStatus, onClickFile, onClickFolder, AddNewFile, SaveToTree, currentFilePath } = useStructure([{
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
    const {hash} = useParams()
    
    useEffect( async () => {
        const result = await
        fetch(`/api/ls/${hash}`, {
            method: 'GET',
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        })
        
        const backendList = await result.json()
        if(backendList!==undefined){
            setFile([...backendList])
            setTree([...transfer(rmduplicate(backendList).list)])
        }
        
        
        
        
    }, [])
    console.log(treeStructure)
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
        if (task === 'output') {
            let tmp = codes;
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
        else if(task === 'output-path'){
            const rmdup = rmduplicate([...filesStructure,update])
            if(rmdup.duplicate){
                console.log("EXISTS")
            }
            setFile([...rmdup.list])
            setTree(transfer([...rmdup.list]))
        }
    }

    client.onopen = () => {
        console.log('onopen')
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
        sendData(['input', { author: 'a', content: diff_code }])
    }

    const sendNewFile = (ls) => {
        sendData(['path', ls])
    }
    const requestFileContext = (ls) => {
        sendData(['file', ls])
        const filenamesplit = ls.split('/')
        setFileName(filenamesplit[filenamesplit.length-1])
    }
    const deb = (ls) => {
        rmduplicate(ls)
        console.log(transfer(rmduplicate(ls).list))
    }
    const ext = fileName.split(".")[1];
    return (
        <div>
            <span onClick={()=>deb(ls)}>debugger</span>
            <div className='page_container'>
                <div id='folder_structure'>
                    <FileStructure returnNewFile={sendNewFile} returnClickFile={requestFileContext} treeStructure={treeStructure}
                    setTree={setTree} resetStatus={resetStatus} onClickFile={onClickFile} onClickFolder={onClickFolder} 
                    AddNewFile={AddNewFile} SaveToTree={SaveToTree} currentFilePath= {currentFilePath}/>
                </div>
                <div id='editor_container'>
                    <div id='editor_title'>
                        <div>
                            {FILE_ICONS[ext] || <AiOutlineFile />}
                            <span style={{marginLeft:"10px"}}>{fileName}</span>
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
                            smartIndent:false,
                            electricChars:false
                        }}
                        placeholder='Select a code mode...'
                        defaultValue={{ label: "Select a code mode...", value: 0 }}
                    />
                </div>
            </div>
        </div>
    )
}

