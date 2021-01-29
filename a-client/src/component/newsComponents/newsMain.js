import React, { useEffect, useState, useContext } from 'react'
import MessageIcon from '@material-ui/icons/Message';
import { Link, Redirect } from 'react-router-dom';
import HomeIcon from '@material-ui/icons/Home';
import HelpIcon from '@material-ui/icons/Help';
import "../style/newspage.css"
import PostBlogMain from "./exNews/postBlog"
import ViewBlogMain from "./viewBlog/viewBlog"
import socketApp from "../../socket"
import { getCookie, signOut, isAuth } from "../../helpers/auth"
import { ToastContainer, toast } from "react-toastify";
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { MenuItem, Menu, Button } from '@material-ui/core';
import NotificationsIcon from '@material-ui/icons/Notifications';
import { Notifications } from '../../userContext';

function NewsMain() {
    const id = getCookie().token
    const [openNoti, setOpenNoti] = useState(null)
    const [anchorEl, setAnchorEl] = useState(null);
    const [open, setOpen] = useState(true);
    const closeNavbar = (e) => {
        setOpen(!open)
    }
    const { value, setValue } = useContext(Notifications);
    let socket = socketApp.getSocket();
    useEffect(() => {
        if (id === undefined) {
            <Redirect to="/" />
        }
        socket.emit("join", { id })
    }, [])
    useEffect(() => {
        socket.on("activities", msg => {
            toast.success(msg.type)
        })
    })
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogOut = () => {
        signOut();
        window.location.reload(false);
    }
    const handleClickNoti = (e) => {
        setOpenNoti(e.currentTarget)
    }
    const handleCloseNoti = () => {
        setOpenNoti(null);
    };
    return (
        <div className="news_page">
            {isAuth() ? null : <Redirect to="/" />}
            <ToastContainer />
            <header>
                <div className="navbar_auth">
                    <p> Recal </p>
                    <div className="extension_auth">
                        <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClickNoti}>
                            <NotificationsIcon />
                        </Button>
                        <Menu
                            id="menuContainerMessage"
                            anchorEl={openNoti}
                            keepMounted
                            open={Boolean(openNoti)}
                            onClose={handleCloseNoti}
                        >
                            {
                                value.map(function (data) {
                                    return <Link to={data.value}>
                                        <MenuItem>
                                            <span className="simple_menu_span">
                                                {data.type}
                                            </span>
                                        </MenuItem>
                                    </Link>
                                })
                            }

                        </Menu>
                        <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
                            <AccountCircleIcon />
                        </Button>
                        <Menu
                            id="menuContainerMessage"
                            anchorEl={anchorEl}
                            keepMounted
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                        >
                            <MenuItem onClick={handleLogOut}>
                                <span className="simple_menu_span">
                                    Đăng xuất
                                </span>
                            </MenuItem>
                        </Menu>
                    </div>
                </div>
            </header>
            <div className="container">
                <div className="navbar_right"
                    style={open === true ? { width: "15%" } :
                        { overflowY: "hidden", width: "0px" }}
                >
                    <div
                        onClick={closeNavbar}
                        id="triangle-right"
                        style={open === true ?
                            { left: "185px" } :
                            { left: "0", borderLeft: "20px solid yellow", borderRight: "0" }}>
                    </div>
                    <ul >
                        <li>
                            <MessageIcon />
                            <Link to="/">Trò chuyện</Link>
                        </li>
                        <li>
                            <HomeIcon />
                            <Link to="/news">Trang chủ</Link>
                        </li>
                        <li>
                            <HelpIcon />
                            <Link to="/friend">Bạn bè</Link>
                        </li>
                        <li>
                            <HelpIcon />
                            <Link to="/news">Cài đặt</Link>
                        </li>
                        <li>
                            <HelpIcon />
                            <Link to="/news">Hỗ trợ</Link>
                        </li>
                        <li>
                            <HelpIcon />
                            <Link to="/news">Điều khoản </Link>
                        </li>
                    </ul>
                </div>
                <div className="main_news">
                    <PostBlogMain />
                    <ViewBlogMain />
                </div>

            </div>
        </div >
    )
}

export default NewsMain
