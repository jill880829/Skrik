import React from 'react';

function add_folder() { 

}
const initList = [
    {
        id: '0',
        name: 'folder1'
    }
];


const Menu = () => { 
    const [list, setList] = React.useState(initList);
    return (
        <div id='menu_container' >
            <ul>
                {list.map((item) => (
                    <div className='menu_folder' key={item.id}>{item.name}</div>
                    // <li >{item.name}</li>
                ))}
            </ul>
            <button id='menu_add_btn' onClick={add_folder}>+</button>
        </div>
    )
}


export default Menu;