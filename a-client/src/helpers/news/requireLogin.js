import React from 'react'
import LoginForm from '../../component/loginComponent/LoginForm'


function RequireLogin({ onClick }) {
    return (
        <div
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            className="paper"
        >
            <span onClick={e => onClick(false)} className="close_button">&#10005;</span>
            <p>Để thực hiện yêu cầu bạn hãy đăng nhập họặc đăng ký</p>
            <LoginForm />
            <button style={{ backgroundColor: "rgba(46, 229, 156, 0.788)" }} className="facebook_login">Đăng ký</button>
        </div>
    )
}

export default RequireLogin
