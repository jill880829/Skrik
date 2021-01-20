import React, { useState, useEffect, Component } from 'react';
import Modal from './components/modal';
import { IconContext } from "react-icons";
import { FcPlus } from "react-icons/fc";

import { GoLocation, GoMail } from "react-icons/go";
import { FaFacebook, FaGithub } from 'react-icons/fa'
import { BiBuildingHouse , BiLogOutCircle } from 'react-icons/bi';
import { message } from 'antd'
import './components/project.css'
import './css/Menu.css'
import Project from './components/project'

const ls = []
const transfer = (ele) => {
    return ele.map(element => ({
        'id': element.id_hash,
        'name': element.project_name,
        'history': '0',
        'colab': element.project_users,
    }));
}

function Menu() {
    const [list, setList] = useState(transfer(ls));
    const [editMode, setEdit] = useState(false);
    const [nickname, setNickname] = useState('Loading...');
    const [newProject, setNewProject] = useState('')
    const [company, setCompany] = useState('');
    const [git, setGit] = useState('');
    const [fb, setFb] = useState('');
    const [location, setLoc] = useState('');
    const [email, setEmail] = useState('');
    const [savedData, setData] = useState(['', '', '', '', ''])
    const [update, setUpdate] = useState({});
    const [waiting, setWaiting] = useState(true)

    useEffect(async () => {
        const result = await
            fetch('/api/projects', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
        if(result.status===401){
            result.text().then(res => {
                window.location.href = '/Login'
            })
        }
        else if(result.status===403){
            result.text().then(res => {
                message.error({content: `403 Forbidden: Refuse to create the project!\n${res}`, duration:1.5})
            })
        }
        else if(result.status===500){
            result.text().then(res => {
                message.error({content: `500 Internal Server Error\n${res}`, duration:1.5})
            })
        }
        else if (result.status===200){
            const backendList = await result.json()
            //console.log(backendList)
            setList([...transfer(backendList)])
            const content = {
                content: "Personal data up to date",
                duration: 2
            }
            message.success(content)
        }
        else{
            message.error({content: `Unknown Error!`, duration:1.5})
        }
        const resProfile = await
            fetch('/api/get_profile', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
        if(resProfile.status===401){
            resProfile.text().then(res => {
                window.location.href = '/Login'
            })
        }
        else if(resProfile.status===403){
            resProfile.text().then(res => {
                message.error({content: `403 Forbidden: Refuse to create the project!\n${res}`, duration:1.5})
            })
        }
        else if(resProfile.status===500){
            resProfile.text().then(res => {
                message.error({content: `500 Internal Server Error\n${res}`, duration:1.5})
            })
        }
        else if(resProfile.status===200){
            let {Nickname, Company, Email, Githubname, Facebookname, Location} = await resProfile.json()
            Nickname     = Nickname===undefined     ? '' : Nickname
            Company      = Company===undefined      ? '' : Company
            Email        = Email===undefined        ? '' : Email
            Githubname   = Githubname===undefined   ? '' : Githubname
            Facebookname = Facebookname===undefined ? '' : Facebookname
            Location     = Location===undefined     ? '' : Location
            
            setNickname(Nickname)
            setCompany(Company)
            setGit(Githubname)
            setFb(Facebookname)
            setLoc(Location)
            setEmail(Email)
            setData([Company, Githubname, Facebookname, Location, Email]);
            setWaiting(false)
        }
    }, [newProject,update])
    
    const modalRef = React.useRef();

    const openModal = () => {
        if (editMode === true) setEdit(false);
        modalRef.current.openModal();
    }

    const intoProject = (e) => {
        window.location.href = `/Editor/${e}/${nickname}`
    }
    // const handleModalKeyUp = (e) => {
    //     if (e.key === 'Enter' && e.target.value !== "") {
    //         var ConfirmBtn = document.getElementById('confirmBtn');
    //         confirmModal(ConfirmBtn)
            
    //     }
    // }
    const confirmModal = async (e) => {
        // console.log('e',e)
        if (e.target.parentNode.parentNode.childNodes[1].childNodes[1].nodeName.toLowerCase() === 'input') {
            if (e.target.parentNode.parentNode.childNodes[1].childNodes[1].value !== '') {
                let inputPro = e.target.parentNode.parentNode.childNodes[1].childNodes[1]
                let newPro = e.target.parentNode.parentNode.childNodes[1].childNodes[1].value;
                let newColab = (e.target.parentNode.parentNode.childNodes[1].childNodes[3].value).split(';');
                const same = list.filter(project => { 
                    if (project.name.split('/')[1] === newPro && project.name.split('/')[0] === nickname) return true 
                })
                if (same.length > 0) {
                    message.error({content:'This project name has already existed!',duration:1.5})
                    
                    inputPro.classList.add('menu_modal_input_warning');
                    inputPro.parentNode.childNodes[0].childNodes[1].className = 'menu_modal_warning_visible'
                }
                else {
                    let newProject
                    if (newColab.length === 1 && newColab[0] === "") {
                        newProject = {
                            'project_name': newPro,
                            'colabs': [],
                        }
                    }
                    else {
                        newProject = {
                            'project_name': newPro,
                            'colabs': newColab,
                        }
                    }
                    const res = await fetch('/api/create_project', {
                        method: 'POST', // or 'PUT'
                        body: JSON.stringify(newProject),
                        headers: new Headers({
                            'Content-Type': 'application/json'
                        })
                    })
                    if (res.status === 403) {

                        res.text().then(res => {
                            message.error({content: `403 Forbidden: Refuse to create the project!\n${res}`, duration:1.5})
                        })
                    }
                    else if (res.status === 500) {
                        res.text().then(res => {
                            message.error({content: `500 Internal Server Error\n${res}`, duration:1.5})
                        })
                    }
                    else if (res.status === 200) {
                        setNewProject(newPro)
                        modalRef.current.closeModal();
                    }
                    else if (res.status === 401) {
                        res.text().then(res => {
                            message.error({content: `401 Unauthorized\n${res}`, duration:1.5})
                        })
                        window.location.href = '/Login'
                    }

                }
            }
            else {
                // console.log('cant create!')
            }
        }
    }

    const deleteProject = (id) => {
        // const newList = list.filter(project => project.id !== id)
        // setList(newList)
        // console.log(id)
        const passData = {idsha: id}
        fetch('/api/delete_project', {
            method: 'POST', // or 'PUT'
            body: JSON.stringify(passData),
            headers: new Headers({
                'Content-Type': 'application/json',
            })
        }).then(res => {
            if (res.status === 401) {
                res.text().then(res => {
                    message.error({content: `401 Unauthorized\n${res}`, duration:1.5})
                })
                window.location.href = '/Login'
            }
            else if (res.status === 403) {
                res.text().then(res => {
                    message.error({content: `403 Forbidden: Refuse to delete the project!\n${res}`, duration:1.5})
                    if(res === "Project Has Been Deleted!!!"){
                        message.info({content: `Wait for automatically refresh!`, duration:1.5})
                        setUpdate(res)
                    }
                })
            }
            else if (res.status === 500) {
                res.text().then(res => {
                    message.error({content: `500 Internal Server Error\n${res}`, duration:1.5})
                })
            }
            else if (res.status === 200) {
                setUpdate(passData);
            }
            else {
                message.error({content: `Unknown Error!`, duration:1.5})
            }
        })
    }

    const editProfile = () => {
        if(!waiting)
            setEdit(true);
        else{
            message.warning({content:"Please wait until your profile up to date"})
        }
    }

    const back2Profile = () => { setEdit(false); }
    const logout = () => {
        fetch('/api/logout', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }) 
        window.location.href='/Login';
    }
    const save = () => {
        setData([company, git, fb, location, email]);
        const passData = {
            "Nickname": nickname,
            "Company": company,
            "Email": email,
            "Githubname": git,
            "Facebookname": fb,
            "Location": location,
        }
        fetch('/api/set_profile', {
            method: 'POST',
            body: JSON.stringify(passData),
            headers: new Headers({
                'Content-Type': 'application/json',
            })
        }).then(res => {
            if (res.status === 401) {
                res.text().then(res => {
                    message.error({content: `401 Unauthorized\n${res}`, duration:1.5})
                })
                window.location.href = '/Login'
            }
            else if (res.status === 403) {
                res.text().then(res => {
                    message.error({content: `403 Forbidden: Refuse to create the project!\n${res}`, duration:1.5})
                })
            }
            else if (res.status === 200) {
                setEdit(false);
                setUpdate(passData);
                setWaiting(true);
            }
            else {
                // console.log("ERROR")
            }
        })
    }
    return (
        
        <div className='menu_container' >
            <div className='menuProfile' >
                <div className='menu_profile'>
                    <div className="profile_container">
                        <div style={{ display: 'flex' }}>
                            <img className="profile_photo" src="https://i.imgur.com/1nzuh87.png" alt="photos"></img>
                        </div>
                        <div className="profile_names">
                            <p id='profile_realname'>{nickname}</p>
                        </div>

                        {editMode ?
                            <div className = 'profile_edit_mode'>
                                <div className="profile_detail">
                                    <IconContext.Provider value={{ color: '#bbbbbb', size: '20px' }}>
                                        <BiBuildingHouse style={{ verticalAlign: 'middle' }} />
                                    </IconContext.Provider>
                                    <div style={{ marginLeft: '20px' }}></div>
                                    <input className='profile_edit_input'
                                        placeholder='Company'
                                        // onKeyUp={ }
                                        onChange={(event) => { setCompany(event.target.value) }}
                                        defaultValue={savedData[0]}>
                                    </input>
                                </div>
                                <div className="profile_detail">
                                    <IconContext.Provider value={{ color: '#bbbbbb', size: '20px' }}>
                                        <FaGithub style={{ verticalAlign: 'middle' }} />
                                    </IconContext.Provider>
                                    <div style={{ marginLeft: '20px' }}></div>
                                    <input className='profile_edit_input'
                                        placeholder='Github Username'
                                        onChange={(event) => { setGit(event.target.value) }}
                                        defaultValue={savedData[1]}
                                    >
                                    </input>
                                </div>
                                <div className="profile_detail">
                                    <IconContext.Provider value={{ color: '#bbbbbb', size: '20px' }}>
                                        <FaFacebook style={{ verticalAlign: 'middle' }} />
                                    </IconContext.Provider>
                                    <div style={{ marginLeft: '20px' }}></div>
                                    <input className='profile_edit_input'
                                        placeholder='Facebook Username'
                                        onChange={(event) => { setFb(event.target.value) }}
                                        defaultValue={savedData[2]}
                                    >
                                    </input>
                                </div>
                                <div className="profile_detail">
                                    <IconContext.Provider value={{ color: '#bbbbbb', size: '20px' }}>
                                        <GoLocation style={{ verticalAlign: 'middle' }} />
                                    </IconContext.Provider>
                                    <div style={{ marginLeft: '20px' }}></div>
                                    <input className='profile_edit_input'
                                        placeholder='Location'
                                        onChange={(event) => { setLoc(event.target.value) }}
                                        defaultValue={savedData[3]}
                                    >
                                    </input>
                                </div>
                                <div className="profile_detail">
                                    <IconContext.Provider value={{ color: '#bbbbbb', size: '20px' }}>
                                        <GoMail style={{ verticalAlign: 'middle' }} />
                                    </IconContext.Provider>
                                    <div style={{ marginLeft: '20px' }}></div>
                                    <input className='profile_edit_input'
                                        placeholder='Email Address'
                                        onChange={(event) => { setEmail(event.target.value) }}
                                        defaultValue={savedData[4]}
                                    >
                                    </input>
                                </div>
                                <div className='profile_last_btns_list'>
                                    <button className='profile_last_btn' onClick={save} style={{ backgroundColor: ' #48a147' }}>Save</button>
                                    <button className='profile_last_btn' onClick={back2Profile} style={{ backgroundColor: ' #aaaaaa'}}>Cancel</button>
                                </div>
                            </div>
                            :
                            <div className='profile_display_mode'>
                                <div style={{ textAlign: 'center', display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                                    <button className='profile_edit_btn' variant='contained' onClick={editProfile}>Edit Profile</button>
                                </div>
                                <div style={{ height: 20 }} />
                                <div className = 'profile_display_list'>
                                    {savedData[0] !== '' && savedData[0] !== undefined ?
                                        <div className="profile_detail">
                                            <IconContext.Provider value={{ color: '#bbbbbb', size: '20px' }} >
                                                <BiBuildingHouse style={{ marginRight: 30, marginLeft: 5, verticalAlign: 'middle' }} />
                                            </IconContext.Provider>
                                            {savedData[0].length <= 20 ?
                                                <span className="profile_span">{savedData[0]}</span>
                                                :
                                                <span className="profile_span">{savedData[0].substring(0, 20)}...</span>
                                            }
                                        </div>
                                        : null
                                    }
                                    {savedData[1] !== '' && savedData[1] !== undefined ?
                                        <div className="profile_detail">
                                            <IconContext.Provider value={{ color: '#bbbbbb', size: '20px' }} >
                                                <FaGithub style={{ marginRight: 30, marginLeft: 5, verticalAlign: 'middle' }} />
                                            </IconContext.Provider>
                                            {savedData[1].length <= 20 ?
                                                <span className="profile_span">{savedData[1]}</span>
                                                :
                                                <span className="profile_span">{savedData[1].substring(0, 20)}...</span>
                                            }
                                        </div>
                                        : null
                                    }
                                    {savedData[2] !== '' && savedData[2] !== undefined ?
                                        <div className="profile_detail">
                                            <IconContext.Provider value={{ color: '#bbbbbb', size: '20px' }} >
                                                <FaFacebook style={{ marginRight: 30, marginLeft: 5, verticalAlign: 'middle' }} />
                                            </IconContext.Provider>
                                            {savedData[2].length <= 20 ?
                                                <span className="profile_span">{savedData[2]}</span>
                                                :
                                                <span className="profile_span">{savedData[2].substring(0, 20)}...</span>
                                            }
                                        </div>
                                        : null
                                    }
                                    {savedData[3] !== '' && savedData[3] !== undefined ?
                                        <div className="profile_detail">
                                            <IconContext.Provider value={{ color: '#bbbbbb', size: '20px' }} >
                                                <GoLocation style={{ marginRight: 30, marginLeft: 5, verticalAlign: 'middle' }} />
                                            </IconContext.Provider>
                                            {savedData[3].length <= 20 ?
                                                <span className="profile_span">{savedData[3]}</span>
                                                :
                                                <span className="profile_span">{savedData[3].substring(0, 20)}...</span>
                                            }
                                        </div>
                                        : null
                                    }
                                    {savedData[4] !== '' && savedData[4] !== undefined ?
                                        <div className="profile_detail">
                                            <IconContext.Provider value={{ color: '#bbbbbb', size: '20px' }} >
                                                <GoMail style={{ marginRight: 30, marginLeft: 5, verticalAlign: 'middle' }} />
                                            </IconContext.Provider>
                                            {savedData[4].length <= 20 ?
                                                <span className="profile_span">{savedData[4]}</span>
                                                :
                                                <span className="profile_span">{savedData[4].substring(0, 20)}...</span>
                                            }
                                        </div>
                                        : null
                                    }
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>
            <div className='menuMenu'>
                <div className='menu_menu' >
                    {list.map(project => (
                        <Project
                            id={project.id}
                            key={project.id}
                            name={project.name}
                            hist={project.history}
                            colab={project.colab}
                            intoProject={() => intoProject(project.id, project.name)}
                            deleteProject={() => deleteProject(project.id)}
                        >
                        </Project>))
                    }
                </div>
            </div>
            <div className='menuBar'>
                <IconContext.Provider value={{ className:'menuBar_btn' }}>
                    <div style={{display:'flex' ,height:'100%'}}>
                        <div className='menuBar_navbar'>
                            <BiLogOutCircle className='logoutBtn' onClick={logout}/>
                            <FcPlus onClick={openModal} className='plusBtn'/>
                        </div>
                    </div>
                </IconContext.Provider>
            </div>
            <Modal ref={modalRef}>
                <span className='menu_modal_span'>Create a project</span>
                <div className='menu_modal_inputs'>
                    <div>
                        <p style={{ display: 'inline-block', fontSize:'20px'}}>Project Name</p>
                        <p className='menu_modal_warning_hidden'>* Project Name error!</p>
                    </div>
                    <input className='menu_modal_input' type='text' name='name' id='name'  />
                        <p style={{ display: 'inline-block', fontSize:'20px'}}>Collaborators</p>
                    <input className='menu_modal_input' ></input>
                    <p style={{ color: '#CCCCCC', fontSize: 10, lineHeight: 0.8 }}>* Use ";" to split collaborators</p>
                </div>
                <div className='menu_modal_btns'>
                    <button className='menu_modal_btn menu_btn_close' onClick={() => modalRef.current.closeModal()}>Cancel</button>
                    <button id = 'confirmBtn' className='menu_modal_btn menu_btn_confirm' onClick={confirmModal}>Confirm</button>
                </div>
            </Modal>
        </div>
    )
}


export default Menu;