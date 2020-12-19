import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import Paper from '@material-ui/core/Paper';
import { Link } from 'react-router-dom';

function ChangePassword({ match }) {
    const [formData, setFormData] = useState({
        password1: '',
        password2: "",
        token: ""
    });
    const { password1, password2, token } = formData;
    useEffect(() => {
        let token = match.params.token;
        if (token) {
            setFormData({ ...formData, token });
        }
    }, [])
    const handleChange = text => e => {
        setFormData({ ...formData, [text]: e.target.value })
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        if (password1 === password2 && password1) {
            axios.put("http://localhost:2704/api/change/password", {
                newPassword: password1,
                passwordLink: token
            }).then(res => {
                setFormData({ password1: "", password2: "" });
                toast.success(res.data.message);
            }).catch(err => {
                console.log(err)
                toast.error(err.response.data.error)
            })
        } else {
            toast.error("Password does not match")
        }
    }
    return (
        <div className="forget_password_page">
            <ToastContainer />
            <Paper elevation={3} >
                <h6>Thay đổi mật khẩu của bạn </h6>
                <form onSubmit={handleSubmit} className="form__group field">
                    <div className="changePassword_input_div">
                        <input
                            value={password1}
                            onChange={handleChange("password1")}
                            type="password"
                            className="form__field"
                            placeholder="Mật khẩu mới"
                            name="name" />
                        <label className="form__label">Mật khẩu mới</label>
                    </div>
                    <div>
                        <input
                            value={password2}
                            onChange={handleChange("password2")}
                            type="password"
                            className="form__field"
                            placeholder="Nhập lại"
                            name="password" />
                        <label className="form__label">Nhập lại</label>
                    </div>
                    <div className="button-sign">
                        <button id="button_change_password" className="treat-button" type="submit">Thay đổi</button>
                    </div>
                    <Link className="href_link" to="/">Quay trở lại trang chủ</Link>
                </form>

            </Paper>
        </div >
    )
}

export default ChangePassword
