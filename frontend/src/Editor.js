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
import { DiJsBadge, DiCss3Full, DiHtml5, DiReact, DiPython } from "react-icons/di";
import { SiCplusplus, SiJson } from "react-icons/si";
import { AiOutlineFile, AiFillHome } from "react-icons/ai";
import transfer from './functions/transfer'
import rmduplicate from './functions/rmduplicate'
import sort_files from './functions/sort'
import FileStructure from './Structure'
import useStructure from './useStructure'
import { IconContext } from "react-icons";
import { useParams } from 'react-router-dom'
import './css/Editor.css'
import { message } from 'antd'
import { BiLogOutCircle } from 'react-icons/bi';

// const USERMARK_COLOR = '#00ff00'
const BOOKMARK_COLOR = [
    '#00aa00', '#0283ff', '#ff0000', '#fec703', '#ff00ff',
    '#00ffff', '#aaaaff', '#aaffaa', '#ffaaaa', '#ffffff',
]

const FILE_ICONS = {
    js: <DiJsBadge />,
    css: <DiCss3Full />,
    html: <DiHtml5 />,
    jsx: <DiReact />,
    py: <DiPython />,
    cpp: <SiCplusplus />,
    json: <SiJson />
};
const codeMap = {
    py: 'python',
    html: 'xml',
    js: 'javascript',
    cpp: 'text/x-c++src',
    v: 'verilog',
    css: 'css',
    json: 'application/ld+json',
}
const client = new WebSocket('wss://skrik.net/api/wss')
// const client = new WebSocket('ws://localhost:3002')

function defaultSpan(crName, color) {
    const newSpan = document.createElement('span')
    const tmpDiv = document.createElement('div')

    // const cursorName = document.createElement('span')
    tmpDiv.innerHTML = crName;
    var width = crName.length * 8 + 16;

    tmpDiv.style.backgroundColor = color;
    tmpDiv.className = 'cursorName'
    tmpDiv.style.width = width.toString() + 'px';
    newSpan.appendChild(tmpDiv)
    newSpan.style.borderLeftStyle = 'solid';
    newSpan.style.borderLeftWidth = '2px';
    newSpan.style.borderLeftColor = color;
    // newSpan.className = 'blink';
    // newSpan.classList.add('newSpan')
    newSpan.addEventListener("mouseover", function (event) {
        tmpDiv.style.visibility = 'visible'
        newSpan.style.cursor = 'pointer'
        setTimeout(function () {
            tmpDiv.style.visibility = 'hidden'
            newSpan.style.cursor = 'default'
        }, 3000);
    }, false);

    return newSpan
}

export default function Editor(props) {
    const ls = []
    const { treeStructure, setTree, resetStatus, onClickFile, onClickFolder, AddNewFile, SaveToTree, currentFilePath } = useStructure([
        { type: "blankFolder", displayAddBlank: false, },
        { type: "blankFile", displayAddBlank: false, },]);
    const [filesStructure, setFile] = useState(ls);
    const [fileName, setFileName] = useState('Untitled')
    const { hash, username } = useParams()
    const [projectName, setProjectName] = useState("")
    const [filePath, setFilePath] = useState('Untitled')
    const [deletePath, setDeletePath] = useState("Untitled")
    const [refresh, setRefresh] = useState(false)
    const [otherEdit, setOtherEdit] = useState(false)
    const [collabs, setCollabs] = useState('')
    // Cursors and Bookmarks (include mine)
    const [bookMarks, setBookMarks] = useState({})
    const [cursors, setCursors] = useState({})


    useEffect(async () => {
        //console.log("Load from backend")
        const result = await fetch(`/api/ls/${hash}`, {
            method: 'GET',
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        })
        if (result.status === 401) {
            result.text().then(res => {
                window.location.href = '/Login'
            })
        }
        else if (result.status === 403) {
            result.text().then(res => {
                message.error({ content: `403 Forbidden: Refuse to create the project!\n${res}`, duration: 2 })
                window.location.href = '/Menu'
            })
        }
        else if (result.status === 500) {
            result.text().then(res => {
                message.error({ content: `500 Internal Server Error\n${res}`, duration: 2 })
            })
        }
        else if (result.status === 200) {
            const { project_name, files, collaborators } = await result.json()
            setCollabs(collaborators);
            // console.log('Colabs: ', collaborators);
            if (Object.entries(cursors).length === 0 && cursors.constructor === Object) {
                let tmp_cursors = {}
                for (var i = 0; i < collaborators.length; i++) {
                    let tmp_pos = { line: i, ch: i, sticky: null }
                    tmp_cursors[collaborators[i]] = tmp_pos
                }
                setCursors(tmp_cursors)
            }
            setProjectName(project_name);
            if (files.length !== 0) {
                setFile([...files])
                setTree([...transfer(rmduplicate(files).list)])
            }
            else {
                setFile([])
                setTree([
                    { type: "blankFolder", displayAddBlank: false, },
                    { type: "blankFile", displayAddBlank: false, }])
                //setTree([...transfer([])])
            }
        }
        else {
            message.error({ content: "Unknown Error!", duration: 2 })
        }
        setFileName("Untitled")
    }, [refresh])

    function onChange(value, cursor) {
        sendCodes(value, { ...cursor, user: username });
    }

    const [projectInit, setProjectInit] = useState(false)
    const [codes, setCodes] = useState('')
    const [opened, setOpened] = useState(false)

    client.onmessage = (msg) => {
        const { data } = msg
        const [task, update] = JSON.parse(data)
        if (task === 'init-finish') {
            setProjectInit(true)
        }
        else if (task === 'init-file') {
            setCodes(update)
            setOpened(true)
        }
        else if (task === 'output') {
            let tmp = codes;
            if (update.filepath === filePath) {
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
                if (update.editor === username) {
                    setOtherEdit(false)
                }
                else {
                    setOtherEdit(true)
                }
                setCodes(tmp)
            }
            const { user, line, ch, sticky } = update.cursor
            if (user !== username) {
                //message.info({ content: `${user}'s cursor at line${line}, ch${ch}`, duration: 2 })
                let last_cursors = cursors;
                last_cursors[user] = {
                    line: line,
                    ch: ch,
                    sticky: sticky
                }
                setCursors(last_cursors)
            }
        }
        else if (task === 'output-path') {
            const rmdup = rmduplicate([...filesStructure, update])
            const sorted = sort_files(rmdup.list)
            setFile([...sorted])
            setTree(transfer([...sorted]))
        }
        else if (task === 'delete') {
            message.info({ content: `${update.deleter} deletes ${update.path}, refresh automatically.`, duration: 2 })
            setRefresh(!refresh)
        }
        else if (task === 'rename') {
            message.info({ content: `${update.name} renames ${update.old} to ${update.new}.`, duration: 2 })
            setRefresh(!refresh)
        }
        else if (task === 'other-cursor') {
            const { user, line, ch, sticky } = update
            if (user !== username) {
                // message.info({ content: `${user}'s cursor at line${line}, ch${ch}`, duration: 2 })
                let last_cursors = cursors;
                last_cursors[user] = {
                    line: line,
                    ch: ch,
                    sticky: sticky
                }
                setCursors(last_cursors)
            }
        }
        else if (task === 'download') {
            window.location.href = "/api/download"
        }
    }

    client.onopen = () => {
        //console.log('websocket open')
        client.send(JSON.stringify(['init', hash]))
    }

    client.onclose = () => {
        //console.log('websocket close')
        setOpened(false)
        setProjectInit(false)
    }

    const sendData = (data) => {
        if (projectInit) {
            client.send(JSON.stringify(data))
        }
    }

    const sendCodes = (code, cursor) => {
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

        sendData(['input', { filepath: filePath, content: diff_code, editor: username, cursor: cursor, timestamp: Date.now() }])
    }

    const sendNewFile = (ls) => {
        sendData(['path', ls])
    }
    const requestFileContext = (ls) => {
        if (ls.type === "file") {
            sendData(['request_file', ls.name])
            setFilePath(ls.name)
            const filenamesplit = ls.name.split('/')
            setFileName(filenamesplit[filenamesplit.length - 1])

        }
        setDeletePath(ls.name)
    }
    const handleDelete = () => {
        //console.log(deletePath)
        if (deletePath !== "Untitled")
            //console.log("DE:")
            sendData(['delete', { "deleter": username, "path": deletePath }])
        setDeletePath("Untitled")
        setFileName("Untitled")
    }

    const handleDownload = () => {
        message.info({ content: "Start download the project", duration: 2 })
        // alert("Download Click")
        sendData(['download', {}])
    }

    const handleRename = (ls) => {

        const arr = filePath.split('/')
        arr.pop()
        const _new = (arr.join('/') + '/' + ls)
        sendData(['rename', { old: filePath, new: _new, name: username }])

    }
    const ext = fileName.split(".")[1];
    return (
        <div>
            <div className='page_container'>
                <div className='folder_structure'>
                    <FileStructure
                        projectName={projectName}
                        returnNewFile={sendNewFile}
                        returnDelete={handleDelete}
                        returnRename={handleRename}
                        returnDownload={handleDownload}
                        returnClickFile={requestFileContext}
                        fileList={filesStructure}
                        treeStructure={treeStructure}
                        setTree={setTree}
                        resetStatus={resetStatus}
                        onClickFile={onClickFile}
                        onClickFolder={onClickFolder}
                        AddNewFile={AddNewFile}
                        SaveToTree={SaveToTree}
                        currentFilePath={currentFilePath}
                    />
                </div>
                {fileName !== 'Untitled' ?
                    <div className='editor_container'>
                        <div id='editor_title'>
                            <div>
                                {FILE_ICONS[ext] || <AiOutlineFile />}
                                <span style={{ marginLeft: "10px" }}>{fileName}</span>
                            </div>
                        </div>

                        <ControlledEditor
                            onBeforeChange={(editor, data, value) => {
                                setOtherEdit(false);
                                onChange(value, editor.getCursor());
                            }}
                            autoCursor={otherEdit ? false : true}
                            onChange={(editor, data, value) => {
                                if (!(Object.entries(bookMarks).length === 0 && bookMarks.constructor === Object)) {
                                    // console.log('Clear old bookmarks', bookMarks)
                                    for (var i = 0; i < collabs.length; i++) {
                                        if (collabs[i] !== username) bookMarks[collabs[i]].clear();
                                    }
                                }
                                let initBookMarks = {}
                                for (var i = 0; i < collabs.length; i++) {
                                    if (collabs[i] !== username) {
                                        const newSpan = new defaultSpan(collabs[i], BOOKMARK_COLOR[i % 10])
                                        var newBookMark = editor.getDoc().setBookmark({
                                            line: cursors[collabs[i]].line,
                                            ch: cursors[collabs[i]].ch + 2,
                                            sticky: cursors[collabs[i]].sticky
                                        }, { widget: newSpan })
                                        initBookMarks[collabs[i]] = newBookMark
                                    }
                                }
                                setBookMarks(initBookMarks)
                            }}
                            value={opened ? codes : 'Loading...'}
                            className="code_mirror_wrapper"
                            options={{
                                lineWrapping: true,
                                lint: true,
                                mode: codeMap[ext],
                                theme: 'material-darker',
                                lineNumbers: true,
                                cursorHeight: 1,
                                curserWidth: 2,
                                indentUnit: 0,
                                electricChars: false,

                            }}
                            smartIndent={false}
                            placeholder='Select a code mode...'
                            defaultValue={{ label: "Select a code mode...", value: 0 }}
                        />
                    </div>
                    :
                    <div className='editor_container'>
                        <div className='display_wrapper'>
                            <div className='default_display'></div>
                        </div>
                    </div>
                }

                <div className='help_bar'>
                    <IconContext.Provider value={{ className: 'helpBar_btn' }}>
                        <div style={{ display: 'flex', height: '100%' }}>
                            <div className='helpBar_navbar'>
                                <BiLogOutCircle className='logoutBtn' onClick={() => { window.location.href = '/Login' }} />
                                <AiFillHome className='homeBtn' onClick={() => { window.location.href = '/Menu' }} />
                            </div>
                        </div>
                    </IconContext.Provider>
                </div>
            </div>
        </div>
    )
}