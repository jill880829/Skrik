import React, { useState } from 'react'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/material-darker.css'
import 'codemirror/mode/xml/xml'
import 'codemirror/mode/python/python'
import 'codemirror/mode/javascript/javascript'
import 'codemirror/mode/css/css'
import 'codemirror/mode/verilog/verilog'
import 'codemirror/mode/clike/clike'
import { Controlled as ControlledEditor } from 'react-codemirror2'
import CodeSelect from './components/codeSelect'
import FileStructure from './structure'
import useEdit from'./useEdit'

const codingOptions = [
    { label: 'Python', value: 'python'},
    { label: 'HTML', value: 'xml' },
    { label: 'Javascript', value: 'javascript' },
    { label: 'C++', value: 'text/x-c++src' },
    { label: 'Verilog', value: 'verilog' },
    { label: 'CSS', value: 'css'},
]

export default function Editor(props) {
    const { codes, opened, sendCodes } = useEdit();
    const [language, setLan] = useState('python');
    function onChangeCode(value) { 
        console.log(value);
        setLan(value.value);
    }
    function onChange(value) { 
        sendCodes(value);
        // setValue(value);
        console.log(value);
        console.log(language);
    }

    return (
        <div>
            <div className='page_container'>
                <div id='folder_structure'>
                    <FileStructure/>
                </div>
                <div id='editor_container'>
                    <div id='editor_title'>
                        File Name
                        <CodeSelect options={codingOptions} onChange={onChangeCode} />
                    </div>
                    
                    <ControlledEditor
                        onBeforeChange={(editor, data, value) => { onChange(value);}}
                        value={opened? codes: 'Loading...'}
                        className="code_mirror_wrapper"
                        options={{
                            lineWrapping: true,
                            lint: true,
                            mode: language,
                            theme: 'material-darker',
                            lineNumbers: true,
                            cursorHeight: 0.85,
                        }}
                        placeholder='Select a code mode...'
                        defaultValue={{ label: "Select a code mode...", value: 0 }}
                    />
                </div>
            </div>
        </div>
    )
}

