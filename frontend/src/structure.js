import React, { useState } from "react";
import styled from "styled-components";
import { IconContext } from "react-icons";
import { AiOutlineFile, AiOutlineFolder, AiOutlineFolderOpen } from "react-icons/ai";
import { DiJavascript1, DiCss3Full, DiHtml5, DiReact, DiPython } from "react-icons/di";
import { VscNewFile, VscNewFolder, VscRefresh, VscCollapseAll } from "react-icons/vsc";
import { SiCplusplus, SiJson } from "react-icons/si";
import "./styles.css";
//import { components } from "react-select/dist/react-select.cjs.dev";
import useStructure from './useStructure'
//import rightClick from './components/rightClick'
import transfer from './components/trans'

const FILE_ICONS = {
    js: <DiJavascript1 />,
    css: <DiCss3Full />,
    html: <DiHtml5 />,
    jsx: <DiReact />,
    py: <DiPython />,
    cpp: <SiCplusplus />,
    json: <SiJson />
};

const StyledTree = styled.div`
  line-height: 1.5;
`;
const Collapsible = styled.div`
  height: ${p => (p.isOpen ? "0" : "auto")};
  overflow: hidden;
`;

export default function Structure() {

    const File = ({ name, filepath, focusOn }) => {
        let ext = name.split(".")[1];

        return (
            <div id={filepath} className={focusOn ? "fileFocus" : "file"} filepath={filepath} key={filepath}>
                {FILE_ICONS[ext] || <AiOutlineFile />}
                <span className="fileSpan" onClick={(event) => handleclickFile(event)} key={filepath + ' span'}>{name}</span>
            </div>
        );
    };

    const Folder = ({ name, children, folderpath, focusOn }) => {
        const [isOpen, setIsOpen] = useState(false);

        const handleToggle = e => {
            e.preventDefault();
            setIsOpen(!isOpen);
        };

        return (
            <div id={folderpath} className={focusOn ? "folderFocus" : "folder"} folderpath={folderpath} key={folderpath}>
                <div className="folder--label" onClick={handleToggle} key={folderpath + ' div'}>
                    {(!isOpen) ? <AiOutlineFolderOpen /> : <AiOutlineFolder />}
                    <span className="folderSpan" key={folderpath + ' span'} onClick={(event) => handleclickFolder(event)}>{name}</span>
                </div>
                <Collapsible isOpen={isOpen}>{children}</Collapsible>
            </div>
        );
    };
    const Input = ({ isFolder, filepath, focusOn }) => {
        return (
            <div id={filepath} className={focusOn ? "fileFocus" : "file"} filepath={filepath} key={filepath}>
                {/* onClick={(event)=>console.log("Click on ",event.target)} */}
                {isFolder ? <AiOutlineFolder /> : <AiOutlineFile />}
                <input className="inputSpan" placeholder={isFolder ? "Type folder name here" : "Type file name here"} onKeyPress={(event) => handlePressEnter(event, isFolder)}></input>
            </div>
        )
    }
    const Tree = ({ children }) => {
        return <StyledTree>{children}</StyledTree>;
    };
    Tree.Input = Input;
    Tree.File = File;
    Tree.Folder = Folder;
    const handlePressEnter = (event, isFolder) => {
        if (event.key === 'Enter') {
            let newFileName = event.target.value
            SaveToTree(newFileName, isFolder)
        }
    }
    const handleAddNewFile = () => {
        AddNewFile(false)
    }
    const handleAddNewFolder = () => {
        AddNewFile(true)
    }
    const FolderStructure = ({ projectName }) => {
        return (
            <div className="title">
                <span className="titleName">{projectName}</span>
                <IconContext.Provider value={{ className: 'react-icons' }}>
                    <div className="titleFunction">
                        <VscNewFile onClick={() => handleAddNewFile()} />
                        <VscNewFolder onClick={() => handleAddNewFolder()} />
                        <VscRefresh onClick={() => transfer(ls)} />
                        <VscCollapseAll onClick={() => { alert("Collapse All") }} />
                    </div>
                </IconContext.Provider>
            </div>
        )
    }
    let filepath = '';
    const displayStruct = (ele, i) => {
        if (Array.isArray(ele)) {
            return ele.map(displayStruct)
        }
        else if (ele === "EOF") {
            let spl = filepath.split("_")
            filepath = filepath.substr(0, filepath.length - 1 - spl[spl.length - 2].length)
        }
        else if (ele.type === "file") {
            return <Tree.File name={ele.name} filepath={filepath + i} focusOn={ele.status === 'on'} />
        }
        else if (ele.type === "folder") {
            filepath += `${i}_`
            return (
                <Tree.Folder name={ele.name} folderpath={filepath.substr(0, filepath.length - 1)} focusOn={ele.status === 'innestopenFocus'}>
                    {
                        displayStruct(ele.data)
                    }
                </Tree.Folder>
            )
        }
        else if (ele.type === "blankFile") {
            if (ele.displayAddBlank)
                return (
                    <Tree.Input isFolder={false} filepath={filepath + i} focusOn={ele.status === 'false'} />
                )
        }
        else if (ele.type === "blankFolder") {
            if (ele.displayAddBlank)
                return (
                    <Tree.Input isFolder={true} filepath={filepath + i} focusOn={ele.status === 'false'} />
                )
        }

    }
    const str = [
        {
            type: "blankFolder",
            displayAddBlank: false,
        },
        {
            type: "blankFile",
            displayAddBlank: false,
        },
    ]
    const ls=['src/components/SkrikPage.js','src/components/SkrikPage.css','src/index.js','src/index.html','src/text.py','package.js']
    const str1 = [
        {
            type: "blankFolder",
            displayAddBlank: false,
        },
        {
            type: "folder",
            name: "src",
            status: "open",
            data: [
                {
                    type: "blankFolder",
                    displayAddBlank: false,
                },
                {
                    type: "folder",
                    name: "components",
                    status: "open",
                    data: [
                        {
                            type: "blankFolder",
                            displayAddBlank: false,
                        },
                        {
                            type: "blankFile",
                            displayAddBlank: false,
                        },
                        {
                            type: "file",
                            name: "SkrikPage.js",
                            status: "off",
                        },
                        {
                            type: "file",
                            name: "SkrikPage.css",
                            status: "off"
                        },
                        "EOF"
                    ]
                },
                {
                    type: "blankFile",
                    displayAddBlank: false,
                },
                {
                    type: "file",
                    name: "index.js",
                    status: "off"
                },
                {
                    type: "file",
                    name: "index.html",
                    status: "off"
                },
                {
                    type: "file",
                    name: "test.py",
                    status: "off"
                },
                "EOF"
            ]
        },
        {
            type: "blankFile",
            displayAddBlank: false,
        },
        {
            type: "file",
            name: "package.json",
            status: "off"
        },

    ]

    const { treeStructure, loadStructure, resetStatus, onClickFile, onClickFolder, AddNewFile, SaveToTree, currentFilePath } = useStructure(str1);
    const handleclickFile = (event) => {
        let fp = event.target.parentNode.id
        resetStatus()
        onClickFile(String(fp))
    }
    const handleclickFolder = (event) => {
        let fp = event.target.parentNode.parentNode.id
        resetStatus()
        onClickFolder(String(fp))
    }
    return (
        <div className="App">
            <FolderStructure projectName="My Project" />
            <Tree>
                {displayStruct(treeStructure)}
            </Tree>
            <rightClick/>
        </div>
    );
}
