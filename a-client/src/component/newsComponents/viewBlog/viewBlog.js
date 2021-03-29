import React, { useState, useEffect } from 'react'
import { Link } from "react-router-dom"
import axios from "axios"
import Skeleton from "../exNews/Skeleton"
import InfiniteScroll from "react-infinite-scroll-component";
import "../../style/viewBlog.css"
import { getCookie } from '../../../helpers/auth';
import SeeLike from '../exNews/seeLike';
import LikeComment from '../exOne/likeComment';
import RequireLogin from '../../../helpers/requireLogin';
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';
import ShareBlog from '../exOne/shareBlog';
import { ImageRender } from '../../../helpers/news';
import { IconButton } from '@material-ui/core';
import { MessageContainer } from '../../../helpers/message';

function ViewBlog() {
    const [start, setStart] = useState(0)
    const [end, setEnd] = useState(3)
    const [blog, setBlog] = useState([])
    const [hasmore, setHasmore] = useState(true)

    const id = getCookie().token
    const [login, setLogin] = useState(false)

    const fetchData = () => {
        setTimeout(() => {
            setStart(start + 3)
            setEnd(end + 3)
        }, 1500);
    }
    // const handleValidateLogin = () => {
    //     if (id) setLogin(null)
    //     else setLogin("ok")
    // }
    const setBlogRes = async (res) => {
        let a = res.data.data
        try {
            for await (let value of a) {
                setBlog(a => [...a, value])
            }
        } catch (error) {
            return
        }

    }
    const handleError = () => {
        return (
            <div>
                Có lỗi đả xảy ra bạn hãy thử lại sau
            </div>
        )
    }
    useEffect(() => {
        let fn = () => {
            if (id) {
                axios.get("http://localhost:2704/api/news/data?start=" + start + "&end=" + end + "&id=" + id)
                    .then(res => {
                        if (res.data.data !== undefined) setBlogRes(res)
                        else setHasmore(false)
                    })
                    .catch(err => {
                        handleError()
                    })
            } else {
                axios.get("http://localhost:2704/api/news/dataNo?start=" + start + "&end=" + end)
                    .then(res => {
                        setBlogRes(res)
                    })
                    .catch(err => {
                        handleError()
                    })
            }
        }
        fn()
    }, [end])

    const CommentRender = (cb) => {
        const { value, i } = cb.props
        return <>
            {
                value.comment[i] !== undefined ? <div className="comment_blog">
                    <div className="content">
                        <img alt="avatart_user" src="./demo.jpeg"></img>
                        <span>{value.comment[i].value}</span>
                        <div className="activities">
                            <LikeComment props={{ data: value.comment[i], i: value.comment[i].id + i, value: value.idBlog }} />
                        </div>
                    </div>

                </div> : console.log()
            }
        </>
    }
    return (
        <div className="viewBlog">
            {blog.length === 0 && <Skeleton />}
            {login ? <RequireLogin onClick={(value) => setLogin(value)} /> : console.log()}
            <MessageContainer />
            <InfiniteScroll
                dataLength={blog.length}
                next={fetchData}
                hasMore={hasmore}
                loader={<Skeleton />}
            >
                {
                    blog !== undefined ? blog.map(function (value, i) {
                        return (
                            <div className="viewBlog_li" key={i}>
                                <div className="contain_blog" >
                                    <IconButton className="menu">
                                        <span>&#8942;</span>
                                    </IconButton>
                                    <div className="profile">
                                        <img alt="profile_image" src="./demo.jpeg"></img>
                                        <div className="profile_text">
                                            <span>Người tỏa sáng nhất là người cô độc nhất</span>
                                            <div className="text_blog">
                                                {
                                                    value.text.map(function (data, i) {
                                                        return <p key={i}>{data}</p>
                                                    })
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    {/* Render Image */}
                                    <div className="image-blog">
                                        <ImageRender props={{ value }} />
                                    </div>
                                    <div className="activities_blog">
                                        <SeeLike props={{ value, i, className: "inner" }} />
                                        <div className="inner">
                                            <Link to={"/posts/id=" + value.idBlog}>
                                                <li className="comment list">
                                                    <ChatBubbleOutlineIcon />   Comment
                                                </li>
                                            </Link>
                                        </div>
                                        <div className="inner share">
                                            <ShareBlog />
                                        </div>
                                    </div>
                                    <div className="comment_blog_view">
                                        <CommentRender props={{ value, i: 0 }} />
                                        <CommentRender props={{ value, i: 1 }} />
                                        <CommentRender props={{ value, i: 2 }} />
                                    </div>
                                </div>
                            </div>
                        )
                    }) : {}
                }
            </InfiniteScroll>
        </div>
    )
}

export default ViewBlog