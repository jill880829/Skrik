import React,{ useState, Component }  from 'react'
import './project.css'
import {IconContext} from "react-icons";
import { BsTrash,BsClockHistory } from "react-icons/bs";
import { render } from 'react-dom';
import swal from 'sweetalert';



class Project extends Component { 
    render() { 
        const { id, name, hist } = this.props;
        return (
            <div id={id} className='project_container'>
                <div className='project_wrapper' style={{ position: 'relative' }} onclick={this.intoProject}>
                    <p className='project_title'>{name}</p>
                    <div className='project_history'>
                        <IconContext.Provider value={{ color: 'gray', size: '12px', className: 'project_history' }}>
                            <BsClockHistory /> <span>changed {hist} days ago</span>
                        </IconContext.Provider>
                    </div>
                    <div className='project_btn'>
                        <button className='project_trash'>  {/*onClick={ Delete} */}
                            <IconContext.Provider value={{ color: 'gray', size: '16px', className: 'project_icon' }}>
                                <BsTrash />
                            </IconContext.Provider>
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}
export default Project;