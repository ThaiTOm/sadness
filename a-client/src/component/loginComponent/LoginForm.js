import React, { useState } from 'react'
import TextField from '@material-ui/core/TextField';
import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login';
import { makeStyles } from '@material-ui/core/styles';
import { authenicate, isAuth } from "../../helpers/auth";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
    floatingLabelFocusStyle: {
        color: "#fff"
    }
}));

function LoginForm() {
    const classes = useStyles();
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    })
    const { email, password } = formData;
    const handleChange = text => e => {
        setFormData({ ...formData, [text]: e.target.value })
    }
    const handleSubmit = e => {
        e.preventDefault();
        if (email && password) {
            axios.post(`http://localhost:2704/api/login`, {
                email, password
            }).then(res => {
                console.log(res.data)
                setFormData({
                    ...formData,
                    email: "",
                    password: ""
                })
                toast.success(res.data.message)
                authenicate(res);
                window.location.reload(false);
            }).catch(err => {
                toast.error(err.response.data.error)
            })
        }
        else {
            toast.error("Please fill all text field")
        }
    }
    const sendGoogleToken = tokenId => {
        axios.post("http://localhost:2704/api/googlelogin", {
            idToken: tokenId
        }).then(res => {
            authenicate(res)
            window.location.reload(false);
        }).catch(err => {
            console.log(err)
            toast.error("Login with Google failed")
        })
    }
    const sendFacebookToken = (userID, accessToken) => {
        axios.post("http://localhost:2704/api/facebooklogin", {
            userID, accessToken
        }).then(res => {
            authenicate(res)
            window.location.reload(false);
        }).catch(err => {

            toast.error("Login with Facebook failed")
        })
    }
    const responseGoogle = response => {
        sendGoogleToken(response.tokenId)
    }
    const responseFacebook = response => {
        console.log(response)
        sendFacebookToken(response.userID, response.accessToken)
    }
    return (
        <form className="form_signIn" onSubmit={handleSubmit}>
            <ToastContainer />
            <p className="sign_in_title">Sign In</p>
            <div className="inputField">
                <TextField
                    value={email}
                    onChange={handleChange("email")}
                    id="outlined-basic"
                    label="Email"
                    variant="outlined"
                    InputLabelProps={{
                        className: classes.floatingLabelFocusStyle,
                    }}
                />
            </div>
            <div className="inputField">
                <TextField
                    value={password}
                    onChange={handleChange("password")}
                    id="outlined-password-input"
                    label="Password"
                    type="password"
                    autoComplete="current-password"
                    variant="outlined"
                    InputLabelProps={{
                        className: classes.floatingLabelFocusStyle,
                    }}
                />
                <div className="button-sign">
                    <Link to="/users/forget">Quên mật khẩu</Link>
                    <button className="treat-button" type="submit">Đăng nhập</button>
                </div>
            </div>
            <div className="divider"></div>
            <GoogleLogin
                className="google_login"
                clientId="583969708221-h0kl5ki0e91mkb3mafoecak1sj8b4ih3.apps.googleusercontent.com"
                buttonText="Login with Google"
                onSuccess={responseGoogle}
                cookiePolicy={'single_host_origin'}
            />
            <FacebookLogin
                appId="688117411891893"
                fields="name,email,picture"
                callback={responseFacebook}
                cssClass="facebook_login"
                icon="fa-facebook"
            />
        </form>

    )
}

export default LoginForm
