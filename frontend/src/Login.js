import React, { useState } from 'react';
import { Button, Grid, TextField } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import AccountCircle from '@material-ui/icons/AccountCircle';
import InputAdornment from '@material-ui/core/InputAdornment';
import Lock from '@material-ui/icons/Lock';
import { IoCheckbox } from "react-icons/io5";
import { IconContext } from "react-icons";
import Divider from '@material-ui/core/Divider';

import { ImFacebook2, ImGoogle, ImGithub } from "react-icons/im";
import { message } from 'antd'
import './css/Login.css'


const CssTextField = withStyles({
    root: {
        '& label.Mui-focused': { color: 'blue', },
        '& .MuiInput-underline:after': { borderBottomColor: '#db9853', },
        '& .MuiOutlinedInput-root': {
            '& fieldset': { borderColor: '#a2693b', },
            '&:hover fieldset': { borderColor: '#db9853', },
            '&.Mui-focused fieldset': { borderColor: '#db9853', },
        },
    },
})(TextField);

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    //const [confirm, setConfirm] = useState("");
    const [checked, setChecked] = useState(false);
    const [showRegister, setShowReg] = useState(false);
    const [checkIcon, setIconColor] = useState("#a2693b");

    const postRegister = () => {
        const data = { 'username': username, 'password': password };
        if (checked) {
            // Pass and push data to DB
            fetch('/api/register', {
                method: 'POST', // or 'PUT'
                body: JSON.stringify(data),
                headers: new Headers({
                    'Content-Type': 'application/json',
                })
            }).then(res => {
                if (res.status === 200) {
                    setShowReg(false);
                    message.success({ content: "Successfully Registered!", duration: 2 })
                }
                else if (res.status === 500) {
                    message.error({ content: "500 Internal Server Error", duration: 2 })
                }
                else if (res.status === 403) {
                    res.text().then(res => {
                        message.error({ content: `${res}!\nPlease Change a Username!`, duration: 2 })
                    })
                }
                else {
                    message.error({ content: "Unknown Error", duration: 2 })
                }
            })
                .catch(error => console.error('Error:Login Error'))

        }
        else {
            // Error messages
            message.error({ content: "Please check your confirm password!", duration: 2 })
            setShowReg(true);
        }
    }
    const postData = () => {
        const data = { "username": username, "password": password }
        fetch('/api/login', {
            method: 'POST', // or 'PUT'
            body: JSON.stringify(data),
            headers: new Headers({
                'Content-Type': 'application/json',
            })
        }).then(res => {
            if (res.status === 401) {
                const content = {
                    content: "Username or password wrong! Please check!",
                    duration: 2
                }
                message.error(content)
            }

            else if (res.status === 200) {
                window.location.href = '/Menu'
            }
            else {
                //console.log("ERROR")
            }
        })
            .catch(error => console.error('Error:Login Error'))
    }
    const handleKeyUp = (e) => {
        if (e === password) {
            setChecked(true);
            setIconColor('#48a147');
        }
        else {
            setChecked(false);
            setIconColor("#a2693b");
        }
    }

    const handleEnter = (e, now) => {
        if (e.key === 'Enter') {
            if (now === 'username') {
                let next = e.target.parentNode.parentNode.parentNode.childNodes[2].childNodes[1].childNodes[1];
                next.focus()
            }
            else if (now === 'password') {
                let next = e.target.parentNode.parentNode.parentNode.childNodes[4]
                next.click()
            }
            else if (now === 'newName') {
                let next = e.target.parentNode.parentNode.parentNode.childNodes[4].childNodes[1].childNodes[1]

                next.focus()
            }
            else if (now === 'newPass') {
                let next = e.target.parentNode.parentNode.parentNode.childNodes[5].childNodes[1].childNodes[1]
                next.focus()
            }
            else if (now === 'conPass') {
                let next = e.target.parentNode.parentNode.parentNode.childNodes[7]
                next.click()
            }
        }
    }




    const toRegister = () => {
        setShowReg(true);
    }
    const toLogin = () => {
        setShowReg(false);
    }

    return (
        <div>
            <Grid container style={{ minHeight: '100vh' }}>
                <Grid item xs={12} sm={6}>
                    <img
                        src='https://i.imgur.com/6lzo9u2.jpg'
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        alt='brand'
                    />
                </Grid>
                {showRegister &&
                    <Grid container item xs={12} sm={6} style={{ padding: 10, backgroundColor: ' #231f22' }} direction='column' justify='space-between' alignItems='center'>
                        <div />
                        <div style={{ display: 'flex', flexDirection: 'column', padding: 30, borderRadius: '10%' }}>
                            <h1 style={{ color: 'lightgray', textAlign: 'center' }}>Register</h1>
                            <Divider variant="fullWidth" style={{ backgroundColor: 'gray', width: '100%', textAlign: 'center', marginTop: '20px' }} />
                            <div style={{ height: 20 }} />
                            <CssTextField
                                label='Username'
                                margin='normal'
                                variant="outlined"
                                onKeyPress={(event) => { handleEnter(event, 'newName') }}
                                onChange={(event) => { setUsername(event.target.value) }}
                                InputLabelProps={{ style: { color: "#a2693b", } }}
                                InputProps={{
                                    style: { color: "#a2693b", letterSpacing: 1 },
                                    startAdornment: (
                                        <InputAdornment position="start"><AccountCircle /></InputAdornment>)
                                }}>
                            </CssTextField>
                            <CssTextField
                                label='Password'
                                type="password"
                                margin='normal'
                                variant="outlined"
                                onKeyPress={(event) => { handleEnter(event, 'newPass') }}
                                onChange={(event) => { setPassword(event.target.value); }}
                                InputLabelProps={{ style: { color: "#a2693b" } }}
                                InputProps={{
                                    style: { color: "#a2693b", letterSpacing: 1, size: 30 },
                                    startAdornment: (
                                        <InputAdornment position="start"><Lock /></InputAdornment>)
                                }}>
                            </CssTextField>
                            <CssTextField
                                label='Confirm Password'
                                type="password"
                                margin='normal'
                                variant="outlined"
                                onKeyPress={(event) => { handleEnter(event, 'conPass') }}
                                onChange={(event) => {
                                    //setConfirm(event.target.value);
                                    handleKeyUp(event.target.value);
                                }}
                                InputLabelProps={{ style: { color: "#a2693b" } }}
                                InputProps={{
                                    style: { color: "#a2693b", letterSpacing: 1, size: 30 },
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <IconContext.Provider value={{ color: checkIcon, size: '23px', className: 'project_icon' }}>
                                                <IoCheckbox />
                                            </IconContext.Provider>
                                        </InputAdornment>)
                                }}>
                            </CssTextField>
                            <div style={{ height: 20 }} />
                            <Button id='login_login_btn' variant='contained' onClick={postRegister}>
                                Register
                            </Button>

                            <div id='login_separator'>or</div>
                            <Button id='login_join_btn' onClick={toLogin}>Back to Login</Button>
                        </div>
                        <div />
                    </Grid>
                }
                {!showRegister &&
                    <Grid container item xs={12} sm={6} style={{ padding: 10, backgroundColor: '#231f22' }} direction='column' justify='space-between' alignItems='center'>
                        <div />
                        <div style={{ display: 'flex', flexDirection: 'column', padding: 30, borderRadius: '10%' }}>
                            <Grid container justify='center'>
                                <img
                                    src='https://i.imgur.com/qCO0nq4.png'
                                    alt='logo'
                                    width={150}
                                />
                            </Grid>
                            <CssTextField
                                label='Username'
                                margin='normal'
                                variant="outlined"
                                onKeyPress={(event) => { handleEnter(event, 'username') }}
                                onChange={(event) => { setUsername(event.target.value) }}
                                InputLabelProps={{ style: { color: "#a2693b", } }}
                                InputProps={{
                                    style: { color: "#a2693b", letterSpacing: 1 },
                                    startAdornment: (
                                        <InputAdornment position="start"><AccountCircle /></InputAdornment>)
                                }}>
                            </CssTextField>
                            <CssTextField
                                label='Password'
                                type="password"
                                margin='normal'
                                variant="outlined"
                                onKeyPress={(event) => { handleEnter(event, 'password') }}
                                onChange={(event) => { setPassword(event.target.value) }}
                                InputLabelProps={{ style: { color: "#a2693b" } }}
                                InputProps={{
                                    style: { color: "#a2693b", letterSpacing: 1, size: 30 },
                                    startAdornment: (
                                        <InputAdornment position="start"><Lock /></InputAdornment>)
                                }}>
                            </CssTextField>
                            <div style={{ height: 20 }} />
                            <Button id='login_login_btn' variant='contained' onClick={postData}>
                                Log in
                            </Button>
                            <div style={{ height: 20 }} />
                            <Button id='login_join_btn' onClick={toRegister}>Interested in joining?</Button>
                            <div id='login_separator'>or</div>
                            <div id='login_social_login_container'>
                                {/* <Button
                                    onClick={() => { window.location.href = '/api/login/fb' }}
                                    variant='contained'
                                    id='login_fb_btn'
                                    startIcon={<ImFacebook2 style={{ marginRight: 10, marginLeft: 5 }} />}>
                                    Login with Facebook
                            </Button>
                                <Button
                                    onClick={() => { window.location.href = '/api/login/google' }}
                                    variant='contained'
                                    id='login_google_btn'
                                    startIcon={<ImGoogle style={{ marginRight: 10, marginLeft: 5 }} />}>
                                    Login with Google
                            </Button> */}
                                <Button
                                    onClick={() => { window.location.href = '/api/login/github' }}
                                    variant='contained'
                                    id='login_git_btn'
                                    startIcon={<ImGithub style={{ marginRight: 10, marginLeft: 5 }} />}>
                                    Login with Github
                            </Button>
                            </div>
                        </div>
                        <div />
                    </Grid>
                }
            </Grid>
        </div>
    )
}


export default Login;