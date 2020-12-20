import React, { useState, useEffect } from 'react'
import jwt from "jsonwebtoken"
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { Redirect } from "react-router-dom"
import { isAuth, authenicate } from "../../helpers/auth";
function ActivatePage(props) {
    const [formData, setFormData] = useState({
        name: "",
        token: ""
    })
    useEffect(() => {
        let token = props.match.params.token;
        let name = jwt.decode(token)
        if (token) {
            setFormData({ ...formData, name, token })
        }
    }, [])
    const { token } = formData;
    const hanldeSubmit = e => {
        e.preventDefault()
        axios.post("http://localhost:2704/api/activision", {
            token
        })
            .then(res => {
                toast.success(res.data.message)
                authenicate(res)
            }).catch(err => {
                toast.error(err.response.data.error)
            })
    }
    return (
        <div>
            {isAuth() ? <Redirect to="/" /> : null}
            <ToastContainer />
            <form onSubmit={hanldeSubmit}>
                <button type="submit">active</button>
            </form>
            <h1>Nguyendutyhas</h1>
        </div>
    )
}

export default ActivatePage
