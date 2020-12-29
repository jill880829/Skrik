import React from 'react';
import './modal.css'
const Modal = (props) => {
    const [display, setDisplay] = React.useState(true);
    const open = () => {
        setDisplay(true);
    };
    const close = () => {
        setDisplay(false);
    };
    if (display) { 
        return (
        <div className='modal-wrapper'>
            <div className='modal-backdrop' />
            <div className='modal-box'>
                { props.children}
            </div>
        </div>
        )
    }
    return null;
    

}

export default Modal;