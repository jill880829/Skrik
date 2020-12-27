import React from 'react';
import { Button, Grid, TextField } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles';
import AccountCircle from '@material-ui/icons/AccountCircle';
import InputAdornment from '@material-ui/core/InputAdornment';
import Lock from '@material-ui/icons/Lock';
// import { useHistory } from "react-router-dom";
// import PasswordField from 'material-ui-password-field';




export default function Login() { 
    const CssTextField = withStyles({
        root: {
            '& label.Mui-focused': { color: 'blue', },
            '& .MuiInput-underline:after': { borderBottomColor: '#db9853', },
            '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#db9853', },
                '&:hover fieldset': { borderColor: '#db9853', },
                '&.Mui-focused fieldset': { borderColor: '#db9853', },
            },
        },
    })(TextField);




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
                            InputLabelProps={{ style: { color: "#db9853" } }}
                            InputProps={{
                                style: { color: "#db9853" },
                                startAdornment: (
                                    <InputAdornment position="start"><AccountCircle /></InputAdornment>)
                            }}>
                        </CssTextField>
                        <CssTextField
                            label='Password'
                            type="password"
                            margin='normal'
                            variant="outlined"
                            InputLabelProps={{ style: { color: "#db9853" } }}
                            InputProps={{
                                style: { color: "#db9853" },
                                startAdornment: (
                                    <InputAdornment position="start"><Lock /></InputAdornment>)
                            }}>
                        </CssTextField>
                        <div style={{ height: '20' }} />
                        <Button variant='contained' style={{backgroundColor:'#a2693b', color:'white'}}>
                            Log in
                        </Button>
                    </div>
                    <div />
                </Grid>
            </Grid>

        </div>
    )
}