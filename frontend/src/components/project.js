import React, { Component } from 'react'
import './project.css';
import { IconContext } from "react-icons";
import { BsTrash, BsFillPeopleFill, BsTagFill } from "react-icons/bs";

const handleTitle = (name) => {
    const title = (name.split('/'))[1]
    if (title.length > 20)
        return (title.substring(0, 17) + '...')
    else return (title)
}
const handleOwner = (name) => { return (name.split('/'))[0]; }
const handleCollab = (colab) => {
    const count = colab.length - 1
    if (count < 2) return (count + ' collaborator')
    else return (count + ' collaborators')
}

class Project extends Component {
    render() {
        const { id, key, name, hist, colab, intoProject, deleteProject } = this.props;
        return (
            <div id={id} key={key} className='project_container' >
                <div className='project_wrapper' >
                    <div className='project_fir_col' onClick={intoProject}>
                        <div className='project_fir_row'><span>{handleTitle(name)}</span></div>
                        <div className='project_sec_row'>
                            <div className='project_info_div'>
                                <div className='info_row'>
                                    <IconContext.Provider value={{ className: 'info_icons' }}>
                                        <BsTagFill />
                                        <span className='info_span'>{handleOwner(name)}</span>
                                    </IconContext.Provider>
                                </div>
                                <div className='info_row'>
                                    <IconContext.Provider value={{ className: 'info_icons' }}>
                                        <BsFillPeopleFill />
                                        <span className='info_span'>{handleCollab(colab)}</span>
                                    </IconContext.Provider>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='project_sec_col'>
                        <div className='project_trash_div'>
                            <IconContext.Provider value={{ className: 'trash_icon' }}>
                                <div className='trash_btn' onClick={() => deleteProject(id)}>
                                    <BsTrash />
                                </div>
                            </IconContext.Provider>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Project;