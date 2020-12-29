import React, { Component } from 'react';
import { Button, Grid, TextField } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles';
import AccountCircle from '@material-ui/icons/AccountCircle';
import InputAdornment from '@material-ui/core/InputAdornment';
import Lock from '@material-ui/icons/Lock';

// import GoogleLogin from 'react-google-login';
// import FacebookLogin from 'react-facebook-login';

// import GitHubLogin from 'react-github-login';

import SocialButton from './components/socialButton'
// import { FaFacebookF, FaGoogle, FaGithub } from "react-icons/fa";
import { ImFacebook2,ImGoogle, ImGithub} from "react-icons/im";
import {IconContext} from "react-icons";



class Login extends Component { 
    constructor(props){ 
        super(props);
        this.states={ 
            redirect:false
        }
        this.signup = this.signup.bind(this);
    }
// BACKEND
    signup(res, type){ 

    };
//
    render() { 
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

//BACKEND
        // const responseFacebook = (response) => {
        //     console.log(response);
        //     this.signup(response, 'facebook');
        // }
        // const responseGoogle = (response) => {
        //     console.log(response);
        //     this.signup(response, 'google');
        // }
        // const onSuccess = response => console.log(response);
        // const onFailure = response => console.error(response);

        const handleSocialLogin = (user) => {console.log(user)}

        const handleSocialLoginFailure = (err) => {console.error(err)}
//



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
                    <Grid container item xs={12} sm={6} style={{ padding: 10, backgroundColor:' hsl(225, 6%, 13%)'}} direction='column' justify='space-between' alignItems='center'>
                        <div />
                            <div style={{display:'flex', flexDirection:'column',padding:30, borderRadius:'10%'}}>
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
                                InputLabelProps={{ style: { color: "#a2693b" , } }}
                                InputProps={{
                                    style: { color: "#a2693b", letterSpacing:1},
                                    startAdornment: (
                                        <InputAdornment position="start"><AccountCircle /></InputAdornment>)
                                }}>
                            </CssTextField>
                                <CssTextField
                                label='Password'
                                type="password"
                                margin='normal'
                                variant="outlined"
                                InputLabelProps={{ style: { color: "#a2693b" } }}
                                InputProps={{
                                    style: { color: "#a2693b", letterSpacing:1, size:30},
                                    startAdornment: (
                                        <InputAdornment position="start"><Lock /></InputAdornment>)
                                }}>
                            </CssTextField>
                                <div style={{ height: 20 }} />
                                <Button id='login_login_btn' variant='contained' >
                                Log in
                            </Button>
                                <div style={{ height: 20}} />
                                <Button id='login_join_btn'>Interested in joining?</Button>
                                <div id = 'login_separator'>or</div>
                                <div id='login_social_login_container'>
                                    {/* <GoogleLogin
                                        clientId="1003856103545-uquo9c3ki6ka55lsbct1etdkctsirfqb.apps.googleusercontent.com"
                                        onSuccess={responseGoogle}
                                        onFailure={responseGoogle}
                                        // cookiePolicy={'single_host_origin'}
                                        className='login_social_btn login_google_btn'
                                        icon="fa fa-google"
                                    />
                                    
                                    <FacebookLogin
                                        appId="1085741245183609"
                                        autoLoad={true}
                                        fields="name,email,picture"
                                        // onClick={componentClicked}
                                        callback={responseFacebook}
                                        cssClass='login_social_btn login_fb_btn'
                                        icon="fa-facebook"
                                        textButton	='Sign in with Facebook'
                                    />
                                    <GitHubLogin clientId="ac56fad434a3a3c1561e"
                                        buttonText="Login with Github"
                                        onSuccess={onSuccess}
                                        onFailure={onFailure}
                                        className='login_social_btn'
                                        icon='AiOutlineGithub'
                                    
                                    /> */}
                                    <SocialButton
                                        provider='facebook'
                                        appId='1085741245183609'
                                        onLoginSuccess={handleSocialLogin}
                                        onLoginFailure={handleSocialLoginFailure}
                                        className='login_social_btn login_fb_btn'
                                    > 
                                        <IconContext.Provider value={{color: 'white', size: '20px' }}>
                                            <ImFacebook2 style={{marginRight:30, marginLeft:5, verticalAlign:'middle'}}/>
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
                                        <IconContext.Provider value={{color: 'white', size: '20px' }}>
                                            <ImGoogle style={{marginRight:30, marginLeft:5, verticalAlign:'middle'}}/>
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
                                        <IconContext.Provider value={{color: 'white', size: '20px' }}>
                                            <ImGithub style={{marginRight:30, marginLeft:5, verticalAlign:'middle'}}/>
                                        </IconContext.Provider>
                                        Login with Github
                                    </SocialButton>
                                </div>
                            </div>
                        <div />
                    </Grid>
                </Grid>           
            </div>
        )
    }
    
}
export default Login;