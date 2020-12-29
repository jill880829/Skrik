import React,{ useState, Component }  from 'react'
import './project.css'
import {IconContext} from "react-icons";
import { BsTrash,BsClockHistory } from "react-icons/bs";
import { render } from 'react-dom';



class Project extends Component { 
    render() { 
        const { name, hist } = this.props;
        console.log(name)
        return (
            <div className='project_container'>
                <div className='project_wrapper' style={{ position: 'relative' }}>
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
    // const [title, setTitle] = useState("");
    // const [history, setHistory] = useState('0');
    
    // console.log("file Project.js")
    // console.log(this.props.name, this.props.hist);
    // setTitle(this.props.name);
    // setHistory(this.props.hist);
    
}
export default Project;