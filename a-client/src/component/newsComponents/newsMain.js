import React, { useEffect, useState, useContext } from 'react'
import { Link } from 'react-router-dom';
import "../style/newspage.css"
import PostBlogMain from "./exNews/postBlog"
import ViewBlogMain from "./viewBlog/viewBlog"
import socketApp from "../../socket"
import { signOut } from "../../helpers/auth"
import { ToastContainer } from "react-toastify";
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { MenuItem, Menu, Button } from '@material-ui/core';
import NotificationsIcon from '@material-ui/icons/Notifications';
import { Notifications } from '../../userContext';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { NavbarRight } from '../../helpers/message';


function NewsMain() {
    // const id = getCookie().token || ""
    const [openNoti, setOpenNoti] = useState(null)
    const [anchorEl, setAnchorEl] = useState(null);
    const { value, setValue } = useContext(Notifications);
    let socket = socketApp.getSocket();

    useEffect(() => {
        socket.on("activities", async (msg) => {
            let arr = {
                type: msg.type,
                value: msg.value,
                number: msg.number
            }
            let i = 0
            for await (let data of value) {
                if (data.type === arr.type && data.value === arr.value) {
                    let old = [...arr]
                    old.splice(i, 1)
                    old.unshift(data)
                    setValue(old)
                } else {
                    setValue(a => [...a, arr])
                }
                i++
            }
            if (value.length === 0) {
                setValue(a => [...a, arr])
            }
        })
    }, [socket])
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
            <ToastContainer />
            <header>
                <div className="navbar_auth">
                    <p> Recal </p>
                    <div className="extension_auth">
                        <div className="inner_title">
                            <Button className="notify_icon" aria-controls="simple-menu" aria-haspopup="true" onClick={handleClickNoti}>
                                <NotificationsIcon />
                            </Button>
                            <span className="title" id="notify_title">
                                Thông báo
                            </span>
                        </div>
                        <Menu
                            id="menu_main_page"
                            anchorEl={openNoti}
                            keepMounted
                            open={Boolean(openNoti)}
                            onClose={handleCloseNoti}
                        >
                            <p>Thông báo</p>
                            {
                                value.map(function (data, i) {
                                    return <Link to={data.type} key={i}>
                                        <MenuItem className="notifications_span">
                                            <span className="simple_menu_span">
                                                {data.number}{data.value}
                                            </span>
                                        </MenuItem>
                                    </Link>
                                })
                            }
                        </Menu>
                        <div className="inner_title">
                            <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick} className="account_icon">
                                <AccountCircleIcon />
                            </Button>
                            <span id="account_title" className="title">
                                Tài khoản
                            </span>
                        </div>
                        <Menu
                            id="menu_main_page"
                            anchorEl={anchorEl}
                            keepMounted
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                        >
                            <MenuItem onClick={handleLogOut}>
                                <span className="simple_menu_span">
                                    <ExitToAppIcon /> Đăng xuất
                                </span>
                            </MenuItem>
                        </Menu>
                    </div>
                </div>
            </header>
            <div className="container" id="news">
                <NavbarRight />
                <div className="main_news">
                    <PostBlogMain />
                    <ViewBlogMain />
                </div>

            </div>
        </div >
    )
}

export default NewsMain
