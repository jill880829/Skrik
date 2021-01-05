// TODO:
// Profile data are all called in 'savedData'
// 'savedData' is a list which contain 5 string(company, git, fb, location, email)
// 'USERNAME' must be called by DB, use 'setUSERNAME' to initialize it!
// Anita's TODO: Every profile's realname and photo must be editable, this is working, but not done yet.

import React, { useState, useEffect, Component } from 'react';
import Modal from './components/modal';
import ReadMoreReact from 'read-more-react';
// import Project from './components/project'
import { IconContext } from "react-icons";
import { FcPlus } from "react-icons/fc";
import { BsTrash, BsClockHistory, BsFillPeopleFill } from "react-icons/bs";
import { GoLocation,GoLink,GoDeviceMobile,GoMail } from "react-icons/go";
import { ImFacebook, ImGithub } from "react-icons/im";
import { FaFacebook, FaGithub} from 'react-icons/fa'
import { BiBuildingHouse } from 'react-icons/bi';
import './components/project.css'
import Select from 'react-select';

class Project extends Component {
    render() {
        const { id,key, name, hist, colab, intoProject, deleteProject } = this.props;
        return (
            <div id={id} key={key} className='project_container' onClick={intoProject}>
                <div className='project_wrapper' style={{ position: 'relative' }} onClick={this.intoProject}>
                    <p className='project_title'>{name}</p>
                    <div className='project_history'>
                        <IconContext.Provider value={{ color: 'gray', size: '12px', className: 'project_history' }}>
                            <div>
                                <BsClockHistory /> <span>changed {hist} days ago</span>
                            </div>
                            <div>
                                <BsFillPeopleFill /> <span>{colab.length-1} collaborators</span>
                            </div>
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



const ls = []
const transfer = (ele) => {
    return ele.map(element => ({
        'id': element.id_hash,
        'name': element.project_name,
        'history':'0',
        'colab':element.project_users,
    }));
}

function Menu() {
    const [list, setList] = useState(transfer(ls));
    const [editMode, setEdit] = useState(false);
    const [USERNAME, setUSERNAME] = useState('init');

    const [company, setCompany] = useState('');
    const [git, setGit] = useState('');
    const [fb, setFb] = useState('');
    const [location, setLoc] = useState('');
    const [email, setEmail] = useState('');
    const [savedData, setData] = useState(['','','','',''])

    // const []

    useEffect(async () => {
        const result = await
            fetch('/api/projects', {
                method: 'GET',
                headers: new Headers({
                    'Content-Type': 'application/json'
                })
            })
        const backendList = await result.json()
        console.log(backendList)
        setList([...transfer(backendList)])
    }, [])

    const modalRef = React.useRef();

    const openModal = () => {
        modalRef.current.openModal();
    }
    const intoProject = (e) => {
        console.log(e)
        window.location.href = '/Editor/'+e
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
                let newColab = (e.target.parentNode.parentNode.childNodes[1].childNodes[3].value).split(';');
                // console.log(e.target.parentNode.parentNode.childNodes[1].childNodes[3])
                const same = list.filter(project => { if (project.name === newPro) return true })
                if (same.length > 0) {
                    console.log('This project name has already existed!');
                    inputPro.classList.add('menu_modal_input_warning');
                    inputPro.parentNode.childNodes[0].childNodes[1].className = 'menu_modal_warning_visible'
                }
                else {
                    console.log(list.length)
                    console.log(list)
                    const newProject = {
                        'project_name': newPro,
                        'colabs': newColab,
                    }
                    fetch('/api/create_project', {
                        method: 'POST', // or 'PUT'
                        body: JSON.stringify(newProject),
                        headers: new Headers({
                            'Content-Type': 'application/json'
                        })
                    }).then(res => {
                        console.log(res.status)
                        if (res.status === 403) {
                            console.log("403")
                        }
                        else if (res.status === 500) {
                            console.log("500")
                        }
                        else if (res.status === 200) {
                            console.log("success")
                        }
                        else {
                            console.log("ERROR")
                        }
                    })
                    
                    setList([...list, { id: list.length + 1, name: newPro, history: 0, colab: newColab }])
                    modalRef.current.closeModal();
                }
            }
            else {
                console.log('cant create!')
            }
        }
    }

    const deleteProject = (id) => {
        const newList = list.filter(project => project.id !== id)
        setList(newList)
    }
    const editProfile = () => { 
        console.log('edit');
        setEdit(true);
    }
    const back2Profile = () => { setEdit(false); }
    const save = () => { 
        setData([company, git, fb, location, email]);
        console.log(savedData)
        setEdit(false);
    }
    return (
        <div id='menu_container' >
            <div style={{ float: 'left', width: '4%', height: '100%', backgroundColor: 'transparent' }}></div>
            <div style={{ float: 'left', width: '20%', height: '100%', backgroundColor: 'transparent' }}>
                <div className='menu_profile'>
                    <div className="profile_container">
                        <div style={{display:'flex'}}>
                            <img className="profile_photo" src="https://i.imgur.com/1nzuh87.png" alt="photos"></img>
                        </div>
                        <div className="profile_names">
                            <p id='profile_realname'>Anita Lu</p>
                            <p id='profile_username'>{ USERNAME }</p>
                        </div>
                        
                        {editMode ?
                            <div>
                            <div class="profile_detail">
                                <IconContext.Provider value={{color: '#bbbbbb', size: '20px' }}>
                                    <BiBuildingHouse style={{ verticalAlign:'middle'}}/>
                                </IconContext.Provider>
                                <div style={{marginLeft:'20px'}}></div>
                                    <input className='profile_edit_input'
                                        placeholder='Company'
                                        onChange={(event) => { setCompany(event.target.value) }}
                                        defaultValue={ savedData[0]}>
                                    </input>
                            </div>
                            <div class="profile_detail">
                                <IconContext.Provider value={{color: '#bbbbbb', size: '20px' }}>
                                    <FaGithub style={{ verticalAlign:'middle'}}/>
                                </IconContext.Provider>
                                <div style={{marginLeft:'20px'}}></div>
                                <input className='profile_edit_input'
                                    placeholder='Github Username'
                                        onChange={(event) => { setGit(event.target.value) }}
                                        defaultValue={ savedData[1]}
                                >
                                </input>
                            </div>
                            <div class="profile_detail">
                                <IconContext.Provider value={{color: '#bbbbbb', size: '20px' }}>
                                    <FaFacebook style={{ verticalAlign:'middle'}}/>
                                </IconContext.Provider>
                                <div style={{marginLeft:'20px'}}></div>
                                <input className='profile_edit_input'
                                    placeholder='Facebook Username'
                                        onChange={(event) => { setFb(event.target.value) }}
                                        defaultValue={ savedData[2]}
                                >
                                </input>
                            </div>
                            <div class="profile_detail">
                                <IconContext.Provider value={{color: '#bbbbbb', size: '20px' }}>
                                    <GoLocation style={{ verticalAlign:'middle'}}/>
                                </IconContext.Provider>
                                <div style={{marginLeft:'20px'}}></div>
                                <input className='profile_edit_input'
                                    placeholder='Location'
                                        onChange={(event) => { setLoc(event.target.value) }}
                                        defaultValue={ savedData[3]}
                                >
                                </input>
                            </div>
                            <div class="profile_detail">
                                <IconContext.Provider value={{color: '#bbbbbb', size: '20px' }}>
                                    <GoMail style={{ verticalAlign:'middle'}}/>
                                </IconContext.Provider>
                                <div style={{marginLeft:'20px'}}></div>
                                <input className='profile_edit_input'
                                    placeholder='Email Address'
                                        onChange={(event) => { setEmail(event.target.value) }}
                                        defaultValue={ savedData[4]}
                                >
                                </input>
                            </div>
                            <div style={ {display:'flex', textAlign:'center', justifyContent:'center'}}>
                                <button onClick={save} style={ {display:'inline-block', margin:'20px', padding:'2px 10px', backgroundColor:' #48a147', borderColor:'transparent', borderRadius:'10px', color:'white'}}>Save</button>
                                <button onClick={back2Profile} style={ {display:'inline-block', margin:'20px', padding:'2px 10px', backgroundColor:' #aaaaaa', borderColor:'transparent', borderRadius:'10px', color:'white'}}>Cancel</button>
                            </div>
                            
                            </div>
                        :
                            <div>
                                <div style={{ textAlign: 'center', display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                                    <button className='profile_edit_btn' variant='contained' onClick={ editProfile }>Edit Profile</button>
                                </div>
                                <div style={{ height: 20 }} />  
                                <div>
                                    {savedData[0] !== '' ?
                                        <div class="profile_detail">
                                            <IconContext.Provider value={{ color: '#bbbbbb', size: '20px' }} >
                                                    <BiBuildingHouse style={{marginRight:30, marginLeft:5, verticalAlign:'middle'}}/>
                                            </IconContext.Provider>
                                            {savedData[0].length <= 20 ?
                                                <span className="profile_span">{savedData[0]}</span>
                                                :
                                                <span className="profile_span">{savedData[0].substring(0,20)}...</span>
                                            }
                                    </div>
                                    :null
                                    }
                                    {savedData[1] !== '' ?
                                        <div class="profile_detail">
                                            <IconContext.Provider value={{ color: '#bbbbbb', size: '20px' }} >
                                                    <FaGithub style={{marginRight:30, marginLeft:5, verticalAlign:'middle'}}/>
                                            </IconContext.Provider>
                                            {savedData[1].length <= 20 ?
                                                <span className="profile_span">{savedData[1]}</span>
                                                :
                                                <span className="profile_span">{savedData[1].substring(0,20)}...</span>
                                            }
                                    </div>
                                    :null
                                    }
                                    {savedData[2] !== '' ?
                                        <div class="profile_detail">
                                            <IconContext.Provider value={{ color: '#bbbbbb', size: '20px' }} >
                                                    <FaFacebook style={{marginRight:30, marginLeft:5, verticalAlign:'middle'}}/>
                                            </IconContext.Provider>
                                            {savedData[2].length <=20 ?
                                                <span className="profile_span">{savedData[2]}</span>
                                                :
                                                <span className="profile_span">{savedData[2].substring(0,20)}...</span>
                                            }
                                    </div>
                                    :null
                                    }
                                    {savedData[3] !== '' ?
                                        <div class="profile_detail">
                                            <IconContext.Provider value={{ color: '#bbbbbb', size: '20px' }} >
                                                    <GoLocation style={{marginRight:30, marginLeft:5, verticalAlign:'middle'}}/>
                                            </IconContext.Provider>
                                            {savedData[3].length <= 20 ?
                                                <span className="profile_span">{savedData[3]}</span>
                                                :
                                                <span className="profile_span">{savedData[3].substring(0,20)}...</span>
                                            }
                                    </div>
                                    :null
                                    }
                                    {savedData[4] !== '' ?
                                        <div class="profile_detail">
                                            <IconContext.Provider value={{ color: '#bbbbbb', size: '20px' }} >
                                                    <GoMail style={{marginRight:30, marginLeft:5, verticalAlign:'middle'}}/>
                                            </IconContext.Provider>
                                            {savedData[4].length <= 20 ?
                                                <span className="profile_span">{savedData[4]}</span>
                                                :
                                                <span className="profile_span">{savedData[4].substring(0,20)}...</span>
                                            }
                                    </div>
                                    :null
                                    }
                            </div>
                        </div>
                        }
                    </div>
                </div>
            </div>
            <div style={{ float: 'left', width: '68%', height: '100%', padding: '30px' }}>
                <div className='menu_menu' >
                    {list.map(project => (
                        <Project
                            id={project.id}
                            key={project.id}
                            name={project.name}
                            hist={project.history}
                            colab={project.colab}
                            intoProject={() => intoProject(project.id)}
                            deleteProject={() => deleteProject(project.id)}
                        >
                        </Project>))
                    }
                </div>
            </div>
            <div style={{ float: 'left', width: '4%', height: '100%', backgroundColor: 'transparent' }}>
                <button id='menu_add_btn' onClick={openModal}>
                    <IconContext.Provider value={{ color: 'gray', size: '50px' }}>
                        <FcPlus />
                    </IconContext.Provider>
                </button>
            </div>
            <div style={{ float: 'right', width: '4%', height: '100%', backgroundColor: 'transparent' }}></div>
            <Modal ref={modalRef}>
                <span className='menu_modal_span'>Create a project</span>
                <div className='menu_modal_inputs'>
                    <div>
                        <p style={{ display: 'inline-block' }}>Project Name</p>
                        <p className='menu_modal_warning_hidden'>* Project Name error!</p>
                    </div>
                    <input className='menu_modal_input' type='text' name='name' id='name' onKeyUp={handleKeyUp} />
                    Collaborators
                    <input className='menu_modal_input' ></input>
                    <p style={{ color: '#CCCCCC', fontSize: 10, lineHeight: 0.8 }}>* Use ";" to split collaborators</p>
                </div>
                <div className='menu_modal_btns'>
                    <button className='menu_modal_btn menu_btn_close' onClick={() => modalRef.current.closeModal()}>Close</button>
                    <button className='menu_modal_btn menu_btn_confirm' onClick={confirmModal}>Confirm</button>
                </div>
            </Modal>
        </div>
    )
}


export default Menu;