import React, { useState } from 'react'
import "../../assets/style/homepage.css"
import LoginForm from "./LoginForm"
import RegisterForm from "./RegisterForm"


function PageNotAuth() {
    // const [anchorEl, setAnchorEl] = React.useState(null);
    const [openSignIn, setOpenSignIn] = useState(false);
    const [openSignUp, setOpenSignUp] = useState(false);
    const handleOpenSignIn = () => {
        console.log("cun")
        setOpenSignIn(true);
    };

    const handleCloseSignIn = () => {
        setOpenSignIn(false);

    };
    const handleOpenSignUp = () => {
        setOpenSignUp(true);
    };

    const handleCloseSignUp = () => {
        setOpenSignUp(false);
    };
    const handleClick = (e) => {
        if (e.target === e.currentTarget) {
            setOpenSignIn(false)
        }
    }
    return (
        < div className="homepage percent">
            <header className="header_notAuth percent">
                <div className="modal_container" onClick={e => handleClick(e)} style={openSignIn === true ? { display: "flex" } : { display: "none" }}>
                    <div className="div">
                        <LoginForm onClick={value => handleCloseSignIn()} />
                    </div>
                </div>
                <div className="modal_container" onClick={e => handleClick(e)} style={openSignUp === true ? { display: "flex" } : { display: "none" }}>
                    <div className="div">
                        <RegisterForm onClick={e => handleCloseSignUp()} />
                    </div>

                </div>
                <div className="navbar">
                    <p>
                        <a href="/"> Sadnessly </a>
                    </p>
                </div>
                <div className="text-navbar">
                    <p className="text-navbar-first">
                        Bạn có thể chia sẻ câu chuyện của mình mà không ai biết bạn là ai!!
                    </p>
                    <p className="text-navbar-second">
                        Đừng để bản thân quá nặng lòng hãy mở lòng và bạn sẽ thấy thoải mái hơn. Cho đi là nhận lại!
                    </p>
                </div>
                <div className="button-navbar treat-wrapper">
                    <button className="signIn-navbar treat-button" type="button" onClick={e => handleOpenSignIn()}>Đăng nhập</button>
                    <button className="signUp-navbar treat-button" type="button" onClick={e => handleOpenSignUp()}>Đăng ký</button>

                    {/* ************************************ End of the Modal   *********** */}

                </div>
            </header>
        </div>
    )
}

export default PageNotAuth
