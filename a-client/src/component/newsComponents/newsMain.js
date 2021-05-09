import React from 'react'
import "../../assets/style/newspage.css"
import PostBlogMain from "../../helpers/news/postBlog"
import ViewBlogMain from "./viewBlog/viewBlog"
import { ToastContainer } from "react-toastify";
import { NavbarRight } from '../../helpers/news/news'


function NewsMain() {
    // const id = getCookie().token || ""
    return (
        <div className="news_page">
            <ToastContainer />
            <div className="container" id="news" style={{ height: "max-content" }}>
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
