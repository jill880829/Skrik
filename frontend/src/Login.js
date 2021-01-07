import React, { useState } from 'react';
import { Button, Grid, TextField } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import AccountCircle from '@material-ui/icons/AccountCircle';
import InputAdornment from '@material-ui/core/InputAdornment';
import Lock from '@material-ui/icons/Lock';
import { IoCheckbox } from "react-icons/io5";
import { IconContext } from "react-icons";
import Divider from '@material-ui/core/Divider';

import SocialButton from './components/socialButton';
// import { FaFacebookF, FaGoogle, FaGithub } from "react-icons/fa";
import { ImFacebook2, ImGoogle, ImGithub } from "react-icons/im";

//import { Si1Password } from 'react-icons/si';


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
    const [confirm, setConfirm] = useState("");
    const [checked, setChecked] = useState(false); 
    const [showRegister, setShowReg] = useState(false);
    const [checkIcon, setIconColor] = useState("#a2693b");

    
    const handleSocialLogin = (user) => { console.log(user) }

    const handleSocialLoginFailure = (err) => { console.error(err) }
    const postRegister = () => {
        console.log(username, password)
        const data = { 'username': username, 'password': password };
        if(checked){
            // Pass and push data to DB
            fetch('/api/register', {
                method: 'POST', // or 'PUT'
                body: JSON.stringify(data),
                headers: new Headers({
                    'Content-Type': 'application/json',
                })
            }).then(res => {
                if(res.status===200){
                    setShowReg(false);
                    alert("Successfully Registered!")
                }
                else if(res.status===500){
                    alert("500 Internal Server Error")
                }
                else if(res.status===403){
                    console.log(res.data)
                    alert("403 Forbidden \nRefuse to register this set of username and password!")
                }
                else{
                    alert("Unknown Error")
                }
            })
                .catch(error => console.error('Error:Login Error'))

        }
        else{
            // Error messages
            alert("Please check your confirm password!")
            setShowReg(true);
        }
    }
    const postData = () => {
        console.log(username, password)
        const data = {"username":username,"password":password}
        fetch('/api/login', {
            method: 'POST', // or 'PUT'
            body: JSON.stringify(data),
            headers: new Headers({
                'Content-Type': 'application/json',
            })
        }).then(res => {
            console.log(res.status)
            if (res.status === 401) {
                alert("Username or password wrong! Please check!")
            }
            else if (res.status === 200) {
                window.location.href = '/Menu'
            }
            else {
                console.log("ERROR")
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
                    <Grid container item xs={12} sm={6} style={{ padding: 10, backgroundColor: ' hsl(225, 6%, 13%)' }} direction='column' justify='space-between' alignItems='center'>
                        <div />
                        <div style={{ display: 'flex', flexDirection: 'column', padding: 30, borderRadius: '10%' }}>
                            <h1 style={{ color: 'lightgray', textAlign: 'center' }}>Register</h1>
                            <Divider variant="fullWidth" style={{backgroundColor:'gray',width:'100%', textAlign:'center', marginTop:'20px' }}/>
                            <div style={{ height: 20 }} />
                            <CssTextField
                                    label='Username'
                                    margin='normal'
                                    variant="outlined"
                                    onChange={(event)=>{setUsername(event.target.value)}}
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
                                    onChange={(event) => {
                                        setPassword(event.target.value);
                                    }}
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
                                    onChange={(event) => {
                                        setConfirm(event.target.value);
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
                    <Grid container item xs={12} sm={6} style={{ padding: 10, backgroundColor: ' hsl(225, 6%, 13%)' }} direction='column' justify='space-between' alignItems='center'>
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
                                onChange={(event)=>{setUsername(event.target.value)}}
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
                                onChange={(event)=>{setPassword(event.target.value)}}
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
                                <SocialButton
                                    provider='facebook'
                                     appId='1085741245183609'
                                    onLoginSuccess={handleSocialLogin}
                                    onLoginFailure={handleSocialLoginFailure}
                                    className='login_social_btn login_fb_btn'
                                >
                                    <IconContext.Provider value={{ color: 'white', size: '20px' }}>
                                        <ImFacebook2 style={{ marginRight: 30, marginLeft: 5, verticalAlign: 'middle' }} />
                                    </IconContext.Provider>
                                    Login with Facebook
                                    </SocialButton>
                                <SocialButton
                                    provider='google'
                                    appId='1003856103545-uquo9c3ki6ka55lsbct1etdkctsirfqb.apps.googleusercontent.com'
                                    onLoginSuccess={handleSocialLogin}
                                    onLoginFailure={handleSocialLoginFailure}
                                    className='login_social_btn login_google_btn'
                                >
                                    <IconContext.Provider value={{ color: 'white', size: '20px' }}>
                                        <ImGoogle style={{ marginRight: 30, marginLeft: 5, verticalAlign: 'middle' }} />
                                    </IconContext.Provider>
                                    Login with Google
                                    </SocialButton>

                                <SocialButton
                                    provider='github'
                                    appId='YOUR_APP_ID'
                                    onLoginSuccess={handleSocialLogin}
                                    onLoginFailure={handleSocialLoginFailure}
                                    className='login_social_btn login_git_btn'
                                >
                                    <IconContext.Provider value={{ color: 'white', size: '20px' }}>
                                        <ImGithub style={{ marginRight: 30, marginLeft: 5, verticalAlign: 'middle' }} />
                                    </IconContext.Provider>
                                    Login with Github
                                    </SocialButton>
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