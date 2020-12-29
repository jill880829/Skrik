import React , { forwardRef, useImperativeHandle }from 'react';
import ReactDOM from 'react-dom';

import './modal.css'
const Modal = forwardRef((props, ref) => {
    const [display, setDisplay] = React.useState(false);
    useImperativeHandle(ref, () => {
        return {
            openModal: () => open(),
            closeModal:() => close()
        }
    });

    const open = () => {
        setDisplay(true);
    };
    const close = () => {
        setDisplay(false);
    };
    if (display) {
        return ReactDOM.createPortal(
            <div className={'modal-wrapper'}>
                <div onClick={close} className={'modal-backdrop'} />
                <div className={'modal-box'}>
                    {props.children}
                </div>
            </div>, document.getElementById('modal-root')
        )
    }
    return null;
});
export default Modal;