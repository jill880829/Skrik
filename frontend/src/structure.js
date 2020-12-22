import React, { useState } from "react";
import styled from "styled-components";
import { IconContext } from "react-icons";
import { AiOutlineFile, AiOutlineFolder } from "react-icons/ai";
import { DiJavascript1, DiCss3Full, DiHtml5, DiReact, DiPython } from "react-icons/di";
import { VscNewFile, VscNewFolder, VscRefresh, VscCollapseAll } from "react-icons/vsc";
import "./styles.css";
import { components } from "react-select/dist/react-select.cjs.dev";
import useStructure from './useStructure'


const FILE_ICONS = {
    js: <DiJavascript1 onClick={(event) => console.log("Click on ", event.target.parentNode)} />,
    css: <DiCss3Full />,
    html: <DiHtml5 />,
    jsx: <DiReact />,
    py: <DiPython />
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
                    <AiOutlineFolder />
                    <span className="folderSpan" key={folderpath + ' span'} onClick={(event)=>handleclickFolder(event)}>{name}</span>
                </div>
                <Collapsible isOpen={isOpen}>{children}</Collapsible>
            </div>
        );
    };
    const Input = ({ name, filepath, focusOn }) => {
        return (
            <div id={filepath} className={focusOn ? "fileFocus" : "file"} filepath={filepath} key={filepath}>
                {/* onClick={(event)=>console.log("Click on ",event.target)} */}
                {<AiOutlineFile />}
                <input className="inputSpan" placeholder="Type file name here" onKeyPress={(event)=>handlePressEnter(event)}></input>
            </div>
        )
    }
    const Tree = ({ children }) => {
        return <StyledTree>{children}</StyledTree>;
    };
    Tree.Input = Input;
    Tree.File = File;
    Tree.Folder = Folder;
    const handlePressEnter = (event) => {
        if(event.key==='Enter'){
            let newFileName = event.target.value
            SaveToTree(newFileName)
        }
    }
    const handleAddNewFile = () => {
        AddNewFile()
    }
    const FolderStructure = ({ projectName }) => {
        return (
            <div className="title">
                <span className="titleName">{projectName}</span>
                <IconContext.Provider value={{ className: 'react-icons' }}>
                    <div className="titleFunction">
                        <VscNewFile onClick={() => handleAddNewFile()} />
                        <VscNewFolder onClick={() => { alert("Make New Folder") }} />
                        <VscRefresh onClick={() => { alert("Refresh") }} />
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
        else if (ele.type === "blank") {
            if (ele.displayAddBlank)
                return (
                    <Tree.Input name="I am a blank" filepath={filepath + i} focusOn={ele.status === 'false'} />
                )
        }

    }
    const str1 = [
        {
            type: "folder",
            name: "src",
            status: "open",
            data: [
                {
                    type: "folder",
                    name: "components",
                    status: "open",
                    data: [
                        {
                            type: "blank",
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
                    type: "blank",
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
            type: "blank",
            displayAddBlank: false,
        },
        {
            type: "file",
            name: "package.json",
            status: "off"
        },
        
    ]

    const { treeStructure, loadStructure, resetStatus, onClickFile, onClickFolder, AddNewFile, SaveToTree ,currentFilePath } = useStructure(str1);
    const handleclickFile = (event) => {
        let fp = event.target.parentNode.id
        resetStatus()
        onClickFile(String(fp))
    }
    const handleclickFolder = (event) => {
        let fp = event.target.parentNode.parentNode.id
        resetStatus()
        onClickFolder(String(fp))
        console.log(treeStructure)
    }
    return (
        <div className="App">
            <FolderStructure projectName="My Project" />
            <Tree>
                {displayStruct(treeStructure)}
            </Tree>
        </div>
    );
}
