import React, { useEffect, useState, useContext } from 'react'
import MessageIcon from '@material-ui/icons/Message';
import { Link } from 'react-router-dom';
import HomeIcon from '@material-ui/icons/Home';
import "../style/newspage.css"
import PostBlogMain from "./exNews/postBlog"
import ViewBlogMain from "./viewBlog/viewBlog"
import socketApp from "../../socket"
import { getCookie, signOut } from "../../helpers/auth"
import { ToastContainer, toast } from "react-toastify";
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { MenuItem, Menu, Button } from '@material-ui/core';
import NotificationsIcon from '@material-ui/icons/Notifications';
import { Notifications } from '../../userContext';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import PolicyOutlinedIcon from '@material-ui/icons/PolicyOutlined';
import DynamicFeedOutlinedIcon from '@material-ui/icons/DynamicFeedOutlined';
import ContactSupportOutlinedIcon from '@material-ui/icons/ContactSupportOutlined';

function NewsMain() {
    const id = getCookie().token || ""
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
    }, [])
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
                                value.map(function (data) {
                                    return <Link to={data.type}>
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
                <div className="navbar_right">
                    <ul>
                        <li className="inner_title">
                            <Link className="message_icon" to="/">
                                <MessageIcon />
                            </Link>
                            <span className="title" id="m_title">
                                Tin nhắn
                            </span>
                        </li>
                        <li className="inner_title">
                            <Link className="home_icon icon_nav" to="/news">
                                <HomeIcon />
                            </Link>
                            <span className="title" id="h_title">
                                Trang chủ
                            </span>
                        </li>
                        <li className="inner_title">
                            <Link className="feedback_icon icon_nav" to="/feedback">
                                <DynamicFeedOutlinedIcon />
                            </Link>
                            <span className="title" id="f_title">
                                Góp ý và cải thiện
                            </span>
                        </li>
                        <li className="inner_title">
                            <Link className="contact_icon icon_nav" to="/help">
                                <ContactSupportOutlinedIcon />
                            </Link>
                            <span className="title" id="c_title">
                                Trợ giúp
                            </span>
                        </li>
                        <li className="inner_title">
                            <Link className="policy_icon icon_nav" to="/policy">
                                <PolicyOutlinedIcon />
                            </Link>
                            <span className="title" id="p_title">
                                Điều khoản và dịch vụ
                            </span>
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
