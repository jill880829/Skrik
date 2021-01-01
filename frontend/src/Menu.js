import React, { useState, Component } from 'react';
import Modal from './components/modal';
// import Project from './components/project'
import {IconContext} from "react-icons";
import { FcPlus } from "react-icons/fc";
import { BsTrash, BsClockHistory } from "react-icons/bs";
import './components/project.css'

class Project extends Component { 
    render() { 
        const { id, name, hist, intoProject, deleteProject} = this.props;
        return (
            <div id={id} key={id} className='project_container' onClick={intoProject}>
                <div className='project_wrapper' style={{ position: 'relative' }} onclick={this.intoProject}>
                    <p className='project_title'>{name}</p>
                    <div className='project_history'>
                        <IconContext.Provider value={{ color: 'gray', size: '12px', className: 'project_history' }}>
                            <BsClockHistory /> <span>changed {hist} days ago</span>
                        </IconContext.Provider>
                    </div>
                    <div className='project_btn' onClick={deleteProject}>
                        <button className='project_trash' >
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






const initList = [
    {
        id:1,
        name: 'folder1',
        history:'0'
    },
    
];

function Menu(){ 
    const [list, setList] = useState(initList);
    
    
    const modalRef = React.useRef();
    
    const openModal = () => { 
        modalRef.current.openModal();
    }
    const intoProject = (e) => { 
        console.log('into project')
    }
    const handleKeyUp = (e) => { 
        if (e.key === 'Enter' && e.target.value !== "") { 
            console.log(e.target.value)
        }
    }    
    const confirmModal = (e) => { 
        if (e.target.parentNode.parentNode.childNodes[1].childNodes[1].nodeName.toLowerCase() === 'input') { 
            if (e.target.parentNode.parentNode.childNodes[1].childNodes[1].value !== '') {
                let inputPro = e.target.parentNode.parentNode.childNodes[1].childNodes[1]
                let newPro = e.target.parentNode.parentNode.childNodes[1].childNodes[1].value;
                let newColab = e.target.parentNode.parentNode.childNodes[1].childNodes[3].value;
                
                const same = list.filter(project =>{ if(project.name === newPro) return true})
                if (same.length > 0) {
                    console.log('This project name has already existed!');
                    inputPro.classList.add('menu_modal_input_warning');
                    inputPro.parentNode.childNodes[0].childNodes[1].className='menu_modal_warning_visible'
                }
                else { 
                    console.log(list.length)
                    console.log(list)
                    setList([...list, { id: list.length + 1, name: newPro, history: 0 }]) 
                    modalRef.current.closeModal();
                }
            }
            else { 
                console.log('cant create!')
            }
        }
    }

    const deleteProject = (id) => { 
        // let proID = e.target.parentNode.parentNode.parentNode.parentNode.parentNode.id
        const newList = list.filter(project => project.id !== id)
        setList(newList)
    }
    return (
        <div id='menu_container' >
            <div style={{ float: 'left', width: '10%', height: '100%', backgroundColor: 'transparent' }}>
                <button id='menu_add_btn' onClick={openModal}>
                    <IconContext.Provider value={{color: 'gray', size: '30px'}}>
                        <FcPlus/>
                    </IconContext.Provider>
                </button>
            </div>
            <div style={{ float: 'left', width: '90%', height: '100%', padding: '30px'}}>
                <div className='menu_menu' >
                    {list.map(project => (
                        <Project
                            id={project.id}
                            name={project.name}
                            hist={project.history}
                            intoProject={intoProject}
                            deleteProject={() => deleteProject(project.id)}>
                        </Project>))
                    }
                </div>
                
            </div>
            {/* <div style={{float:'right',width:'10%',height:'100%',backgroundColor:'transparent'}}></div> */}

            <Modal ref={modalRef}>
                <span className='menu_modal_span'>Create a project</span>
                <div className='menu_modal_inputs'>
                    <div>
                        <p style={{display:'inline-block'}}>Project Name</p>
                        <p className='menu_modal_warning_hidden'>* Project Name error!</p>
                    </div>
                    <input className='menu_modal_input' type='text' name='name' id='name' onKeyUp={handleKeyUp} /> 
                    Collaborators
                    <input className='menu_modal_input'></input>
                </div>
                <div className='menu_modal_btns'>
                    <button className='menu_modal_btn menu_btn_close' onClick={ ()=>modalRef.current.closeModal()}>Close</button>
                    <button className='menu_modal_btn menu_btn_confirm' onClick={confirmModal}>Confirm</button>
                </div>
            </Modal>
        </div>
    )
}


export default Menu;