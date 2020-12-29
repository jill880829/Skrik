import React, { useState} from 'react';
import Modal from './components/modal';
import Project from './components/project'
import {IconContext} from "react-icons";
import { FcPlus } from "react-icons/fc";

const initList = [
    {
        name: 'folder1',
        history:'0'
    },
    {
        name: 'folder2',
        history:'1'
    },
    {
        name: 'folder3',
        history:'2'
    },
];
let a = initList.map(pro => (<Project name={pro.name} hist={ pro.history}></Project>))
console.log(a)



function Menu(){ 
    const [list, setList] = useState(initList);
    
    const modalRef = React.useRef();
    
    const openModal = () => { 
        modalRef.current.openModal();
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
            <div className='menu_menu' style={{float:'left',width:'80%',height:'100%', padding:'30px'}}>
                {initList.map(project => (<Project name={project.name} hist={ project.history}></Project>))}
            </div>
            <div style={{float:'right',width:'10%',height:'100%',backgroundColor:'transparent'}}></div>

            <Modal ref={modalRef}>
                <span className='menu_modal_span'>Create a project</span>
                <div className='menu_modal_inputs'>
                    Project Name <input className='menu_modal_input' type='text' name='name' id='name' required='true'/> 
                    Collaborators <input className='menu_modal_input'></input>
                </div>
                <div className='menu_modal_btns'>
                    <button className='menu_modal_btn menu_btn_close' onClick={ ()=>modalRef.current.closeModal()}>Close</button>
                    <button className='menu_modal_btn menu_btn_confirm' onClick={ ()=>modalRef.current.closeModal()}>Confirm</button>
                </div>
            </Modal>
        </div>
    )
}


export default Menu;