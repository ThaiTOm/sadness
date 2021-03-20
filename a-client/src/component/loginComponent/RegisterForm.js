import React, { useState } from 'react'
import "../style/homepage.css"
import TextField from '@material-ui/core/TextField';
import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login';
import { makeStyles } from '@material-ui/core/styles';
import { ToastContainer, toast } from "react-toastify";
import { authenicate } from "../../helpers/auth";
import axios from "axios";



require("dotenv").config({
    "path": "./config/config.env"
})

const useStyles = makeStyles((theme) => ({
    floatingLabelFocusStyle: {
        color: "rgb(167, 166, 166);"
    }
}));

function RegisterForm() {
    const [formData, setFormData] = useState({
        email: "",
        name: "",
        password1: "",
        password2: ""
    });
    const { email, name, password1, password2 } = formData;
    const handleChange = text => e => {
        setFormData({ ...formData, [text]: e.target.value })
    }
    const handleSubmit = e => {
        e.preventDefault();
        if (name && email && password1) {
            if (password1 !== password2) {
                toast.error("Password does not match");
            } else {
                axios.post(`http://localhost:2704/api/register`, {
                    name, email, password: password1
                }).then(res => {
                    setFormData({
                        ...formData,
                        name: "",
                        email: "",
                        password1: "",
                        password2: ""
                    })
                    toast.success(res.data.message)
                }).catch(err => {
                    toast.error(err.response.data.error)
                })
            }
        }
        else {
            toast.error("Please fill all text field")
        }
    }

    const classes = useStyles();
    const responseGoogle = (response) => {
        console.log(response);
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
    const responseFacebook = (response) => {
        sendFacebookToken(response.userID, response.accessToken)
    }
    return (
        <form className="form_signIn" onSubmit={handleSubmit}>
            <ToastContainer />
            <p className="sign_in_title">Đăng ký</p>
            <div className="row">
                <div className="col-sm-6">
                    <div className="inputField">
                        <TextField
                            value={email}
                            onChange={handleChange("email")}
                            id="outlined-basic"
                            label="Email "
                            variant="outlined"
                            InputLabelProps={{
                                className: classes.floatingLabelFocusStyle,
                            }}
                        />
                    </div>
                    <div className="inputField">
                        <TextField
                            value={name}
                            onChange={handleChange("name")}
                            id="outlined-basic-name"
                            label="Tên đăng nhập "
                            variant="outlined"
                            InputLabelProps={{
                                className: classes.floatingLabelFocusStyle,
                            }}
                        />
                    </div>
                    <div className="inputField">
                        <TextField
                            value={password1}
                            onChange={handleChange("password1")}
                            id="outlined-password-input"
                            label="Mật khẩu"
                            type="password"
                            variant="outlined"
                            InputLabelProps={{
                                className: classes.floatingLabelFocusStyle,
                            }}
                        />
                        <div className="inputField">
                            <TextField
                                value={password2}
                                onChange={handleChange("password2")}
                                id="outlined-repeatPassword-input"
                                label="Nhập lại mật khẩu"
                                type="password"
                                variant="outlined"
                                InputLabelProps={{
                                    className: classes.floatingLabelFocusStyle,
                                }}
                            />
                        </div>
                        <div className="button-sign">
                            <button className="treat-button" type="submit">Đăng ký</button>
                        </div>

                    </div>
                </div>

                <div className="col-sm-6">

                    <GoogleLogin
                        className="google_login"
                        clientId="658977310896-knrl3gka66fldh83dao2rhgbblmd4un9.apps.googleusercontent.com"
                        buttonText="Login with Google"
                        onSuccess={responseGoogle}
                        onFailure={responseGoogle}
                        cookiePolicy={'single_host_origin'}
                    />
                    <FacebookLogin
                        appId="688117411891893"
                        fields="name,email,picture"
                        callback={responseFacebook}
                        cssClass="facebook_login"
                        icon="fa-facebook"
                    />
                </div>
            </div>
        </form>

    )
}

export default RegisterForm
