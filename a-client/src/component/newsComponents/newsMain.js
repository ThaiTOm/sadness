import React, { useEffect, useContext } from 'react'
import "../style/newspage.css"
import PostBlogMain from "./exNews/postBlog"
import ViewBlogMain from "./viewBlog/viewBlog"
import socketApp from "../../socket"
import { ToastContainer } from "react-toastify";
import { Notifications } from '../../userContext';
import { HeaderPage, NavbarRight } from '../../helpers/news'


function NewsMain() {
    // const id = getCookie().token || ""
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
    return (
        <div className="news_page">
            <ToastContainer />
            <HeaderPage value={value} />
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
