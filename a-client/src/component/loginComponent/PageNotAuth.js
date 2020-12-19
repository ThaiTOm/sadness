import React from 'react'
import "../style/homepage.css"
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import LoginForm from "./LoginForm"
import RegisterForm from "./RegisterForm"

const useStyles = makeStyles((theme) => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        border: '1px solid #000',
        // boxShadow: theme.shadows[5],
        padding: theme.spacing(1, 10, 10),
    }
}));
function PageNotAuth() {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [openSignIn, setOpenSignIn] = React.useState(false);
    const [openSignUp, setOpenSignUp] = React.useState(false);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleOpenSignIn = () => {
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
    return (
        <div className="main_page">
            < div className="homepage">
                <header className="header_notAuth" >
                    <div className="navbar">
                        <p>
                            <a href="/"> Sadnessly </a>
                        </p>
                        <span aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
                            &#9776;
                    </span>
                        <Menu
                            id="simple-menu"
                            anchorEl={anchorEl}
                            keepMounted
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                        >
                            <MenuItem onClick={handleClose}>
                                <a href="/">
                                    <AccountCircleIcon />
                                    <p>Profile Of me</p>
                                </a>
                            </MenuItem>
                            <MenuItem onClick={handleClose}>
                                <a href="/">
                                    <AccountCircleIcon />
                                    <p>What do you think</p>
                                </a>
                            </MenuItem>
                            <MenuItem onClick={handleClose}>
                                <a href="/">
                                    <AccountCircleIcon />
                                    <p>Profile</p>
                                </a>
                            </MenuItem>
                        </Menu>


                    </div>
                    <div className="text-navbar">
                        <p className="text-navbar-first">
                            Bạn có thể chia sẻ câu chuyện của mình mà không ai biết bạn là ai!!
                    </p>
                        <p className="text-navbar-second">
                            Đừng để bản thân quá nặng lòng hãy mở lòng và bạn sẽ thấy thoải mái hơn. Cho đi là nhận lại!
                    </p>
                    </div>
                    <div className="button-navbar treat-wrapper row">
                        <button className="signIn-navbar treat-button col-sm-12 col-md-6" type="button" onClick={handleOpenSignIn}>Đăng nhập</button>
                        {/* **************************** Modal to Login ****************************************/}
                        <Modal
                            aria-labelledby="transition-modal-title"
                            aria-describedby="transition-modal-description"
                            className={classes.modal}
                            open={openSignIn}
                            onClose={handleCloseSignIn}
                            closeAfterTransition
                            BackdropComponent={Backdrop}
                            BackdropProps={{
                                timeout: 500,
                            }}
                        >
                            <Fade in={openSignIn}>
                                <div className={classes.paper}>
                                    <LoginForm />
                                </div>
                            </Fade>
                        </Modal>

                        {/* ************** * * * **   Button to SignUp                  *   ************* */}

                        <button className="signUp-navbar treat-button col-sm-12 col-md-6" type="button" onClick={handleOpenSignUp}>Đăng ký</button>
                        <Modal
                            aria-labelledby="transition-modal-title"
                            aria-describedby="transition-modal-description"
                            className={classes.modal}
                            open={openSignUp}
                            onClose={handleCloseSignUp}
                            closeAfterTransition
                            BackdropComponent={Backdrop}
                            BackdropProps={{
                                timeout: 500,
                            }}
                        >
                            <Fade in={openSignUp}>
                                <div className={classes.paper}>
                                    <RegisterForm />
                                </div>
                            </Fade>
                        </Modal>

                        {/* ************************************ End of the Modal   *********** */}

                    </div>
                </header>

            </div>
        </div>
    )
}

export default PageNotAuth
