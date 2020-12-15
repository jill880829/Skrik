import React, { useState } from "react";
import styled from "styled-components";
import { IconContext } from "react-icons";
import { AiOutlineFile, AiOutlineFolder } from "react-icons/ai";
import { DiJavascript1, DiCss3Full, DiHtml5, DiReact, DiPython} from "react-icons/di";
import { VscNewFile, VscNewFolder, VscRefresh, VscCollapseAll} from "react-icons/vsc";
import "./styles.css";

const FILE_ICONS = {
  js: <DiJavascript1 />,
  css: <DiCss3Full />,
  html: <DiHtml5 />,
  jsx: <DiReact />,
  py: <DiPython />
};

const StyledTree = styled.div`
  line-height: 1.5;
`;
const StyledFile = styled.div`
  padding-left: 20px;
  display: flex;
  align-items: center;
  span {
    margin-left: 5px;
  }
`;
const StyledFolder = styled.div`
  padding-left: 20px;

  .folder--label {
    display: flex;
    align-items: center;
    span {
      margin-left: 5px;
    }
  }
`;
const Collapsible = styled.div`
  height: ${p => (p.isOpen ? "0" : "auto")};
  overflow: hidden;
`;

const File = ({ name }) => {
  let ext = name.split(".")[1];

  return (
    <StyledFile>
      {/* render the extension or fallback to generic file icon  */}
      {FILE_ICONS[ext] || <AiOutlineFile />}
      <span>{name}</span>
    </StyledFile>
  );
};

const Folder = ({ name, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = e => {
    e.preventDefault();
    setIsOpen(!isOpen);
  };

  return (
    <StyledFolder>
      <div className="folder--label" onClick={handleToggle}>
        <AiOutlineFolder />
        <span>{name}</span>
      </div>
      <Collapsible isOpen={isOpen}>{children}</Collapsible>
    </StyledFolder>
  );
};

const Tree = ({ children }) => {
  return <StyledTree>{children}</StyledTree>;
};

Tree.File = File;
Tree.Folder = Folder;

const FolderStructure = ( {projectName} ) => {
    return(
    <div className="title">
        <span className="titleName">{projectName}</span>
        <IconContext.Provider value={{ className: 'react-icons' }}>
        <div className="titleFunction">
            <VscNewFile />
            <VscNewFolder/>
            <VscRefresh/>
            <VscCollapseAll/>
        </div>
        </IconContext.Provider>
    </div>)
}
export default function Structure() {
  return (
    <div className="App">
      <FolderStructure projectName="My Project"/>
      <Tree>
        <Tree.Folder name="src">
          <Tree.Folder name="Components">
            <Tree.File name="Modal.js" />
            <Tree.File name="Modal.css" />
          </Tree.Folder>
          <Tree.File name="index.js" />
          <Tree.File name="index.html" />
          <Tree.File name="test.py" />
        </Tree.Folder>
        <Tree.File name="package.json" />
      </Tree>
    </div>
  );
}
