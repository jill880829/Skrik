import React, { useState } from "react";
import styled from "styled-components";
import { IconContext } from "react-icons";
import { AiOutlineFile, AiOutlineFolder } from "react-icons/ai";
import { DiJavascript1, DiCss3Full, DiHtml5, DiReact, DiPython } from "react-icons/di";
import { VscNewFile, VscNewFolder, VscRefresh, VscCollapseAll } from "react-icons/vsc";
import "./styles.css";
import { components } from "react-select/dist/react-select.cjs.dev";
import useStructure from'./useStructure'


const FILE_ICONS = {
    js: <DiJavascript1 onClick={(event)=>console.log("Click on ",event.target.parentNode)}/>,
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
    const File = ({ name,filepath }) => {
        let ext = name.split(".")[1];
    
        return (
            <div id={filepath} className="file" filepath={filepath} key={filepath}>
                {/* onClick={(event)=>console.log("Click on ",event.target)} */}
                {FILE_ICONS[ext] || <AiOutlineFile />}
                <span className="fileSpan" onClick={(event)=>handleclickFile(event)}>{name}</span>
            </div>
        );
    };
    
    const Folder = ({ name, children, folderpath}) => {
        const [isOpen, setIsOpen] = useState(false);
    
        const handleToggle = e => {
            e.preventDefault();
            setIsOpen(!isOpen);
        };
    
        return (
            <div className="folder" folderpath={folderpath}>
                <div className="folder--label" onClick={handleToggle}>
                    <AiOutlineFolder />
                    <span className="folderSpan">{name}</span>
                </div>
                <Collapsible isOpen={isOpen}>{children}</Collapsible>
            </div>
        );
    };
    
    const Tree = ({ children }) => {
        return <StyledTree>{children}</StyledTree>;
    };
    
    Tree.File = File;
    Tree.Folder = Folder;
    
    
    const FolderStructure = ({ projectName }) => {
        return (
            <div className="title">
                <span className="titleName">{projectName}</span>
                <IconContext.Provider value={{ className: 'react-icons' }}>
                    <div className="titleFunction">
                        <VscNewFile onClick={() => { alert("Make New File") }} />
                        <VscNewFolder onClick={() => { alert("Make New Folder") }} />
                        <VscRefresh onClick={() => { alert("Refresh") }} />
                        <VscCollapseAll onClick={() => { alert("Collapse All") }} />
                    </div>
                </IconContext.Provider>
            </div>
        )
    }
    let filepath='';
    const displayStruct = (ele,i) => {
        // console.log(ele)
        if(Array.isArray(ele)){
            return ele.map(displayStruct)
        }
        else if (ele==="EOF") {
            let spl = filepath.split("_")
            filepath = filepath.substr(0,filepath.length-1-spl[spl.length-2].length)
        }
        else if (ele.type === "file") {
            //console.log("Filepath:" ,filepath+i)
            return <Tree.File name={ele.name} filepath={filepath+i}/>        
        }
        else if (ele.type === "folder"){
            filepath+=`${i}_`
            //console.log("FOC: ",filepathc)
            return (
                <Tree.Folder name={ele.name} folderpath={filepath.substr(0,filepath.length-1)}>
                    {
                        displayStruct(ele.data)
                    }
                </Tree.Folder>
            )
        }
        else {
        }
        
    }
    const str1= [
        {   
            type:"folder",
            name:"src",
            data:[
                {
                    type:"folder",
                    name:"components",
                    data:[
                        {
                            type:"file",
                            name:"Modal.js",
                            status:"off",
                        },
                        {
                            type:"file",
                            name:"Modal.css",
                            status:"off"
                        },
                        "EOF"
                    ]
                },
                {
                    type:"file",
                    name:"index.js",
                    status:"off"
                },
                {
                    type:"file",
                    name:"index.html",
                    status:"off"
                },
                {
                    type:"file",
                    name:"test.py",
                    status:"off"
                },
                "EOF"
            ]
        },
        {
            type:"file",
            name:"package.json",
            status:"off"
        },
    ]

    const { treeStructure,loadStructure,onClickFile,currentFilePath } = useStructure(str1);
    const handleclickFile = (event) => {
        let fp = event.target.parentNode.id
        // let path = String(fp).split('_')
        // console.log(path)
        onClickFile(String(fp))

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
