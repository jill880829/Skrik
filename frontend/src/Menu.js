import React from 'react';
import Modal from './components/modal';


const initList = [
    {
        id: '0',
        name: 'folder1'
    }
];


function Menu(){ 
    const [list, setList] = React.useState(initList);
    
    const modalRef = React.useRef();
    
    const openModal = () => { 
        modalRef.current.openModal();
    }
    
    return (
        <div id='menu_container' >
            <button id='menu_add_btn' onClick={openModal}>+</button>
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