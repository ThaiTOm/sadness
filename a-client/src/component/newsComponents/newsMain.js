import React, { useEffect, useState } from 'react'
import MessageIcon from '@material-ui/icons/Message';
import { Link } from 'react-router-dom';
import HomeIcon from '@material-ui/icons/Home';
import HelpIcon from '@material-ui/icons/Help';
import "../style/newspage.css"
import PostBlogMain from "./exNews/postBlog"
import ViewBlogMain from "./viewBlog/viewBlog"
import socketApp from "../../socket"
import { getCookie } from "../../helpers/auth"
import { ToastContainer, toast } from "react-toastify";

function NewsMain() {
    const id = getCookie().token
    let socket = socketApp.getSocket();
    const [open, setOpen] = useState(true);
    const closeNavbar = (e) => {
        setOpen(!open)
    }
    useEffect(() => {
        socket.emit("join", { id })
    }, [])
    useEffect(() => {
        socket.on("activities", msg => {
            console.log(msg.type)
            toast.success(msg.type)
        })
    })
    return (
        <div className="news_page">
            <ToastContainer />
            <header>
                <div className="navbar_auth">
                    <p> Recal </p>
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
        </div>
    )
}

export default NewsMain
