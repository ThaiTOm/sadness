import React, { useState } from 'react'
import "../style/homepage.css"
import TextField from '@material-ui/core/TextField';
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";


function Forget() {
    const [formData, setFormData] = useState({
        email: ""
    })
    const { email } = formData;
    const handleChange = text => e => {
        setFormData({ ...formData, [text]: e.target.value })
    }
    const handleSubmit = e => {
        e.preventDefault();
        if (email) {
            axios.put(`http://localhost:2704/api/password/forget`, {
                email
            }).then(res => {
                setFormData({
                    ...formData,
                    email: ""
                })
                toast.success(res.data.message)
            }).catch(err => {
                toast.error(err.response.data.error)
            })
        }
        else {
            toast.error("Please fill all text field")
        }
    }
    return (
        <div className="forget_container">
            <ToastContainer />
            <form onSubmit={handleSubmit}>
                <p>Quên mật khẩu</p>
                <TextField id="standard-basic" onChange={handleChange("email")} label="Email" />
                <div className="button-sign">
                    <button className="treat-button" id="forget_button" type="submit"> Submit </button>
                </div>
            </form>
        </div>
    )
}

export default Forget
