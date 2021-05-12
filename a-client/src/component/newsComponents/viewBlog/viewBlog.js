import React, { useState, useEffect } from 'react'
import { Link } from "react-router-dom"
import axios from "axios"
import Skeleton from "../../../helpers/news/Skeleton"
import InfiniteScroll from "react-infinite-scroll-component";
import "../../../assets/style/viewBlog.css"
import { getCookie } from '../../../helpers/auth';
import SeeLike from "../../../helpers/news/seeLike"
import LikeComment from "../../../helpers/news/likeComment"
import RequireLogin from '../../../helpers/news/requireLogin';
import ShareBlog from "../../../helpers/news/shareBlog"
import { ImageRender, VideoRender } from '../../../helpers/news/news';
import { IconButton } from '@material-ui/core';
import { MessageContainer } from '../../../helpers/message/message';
import socketApp from '../../../socket';


function ViewBlog() {
    const [start, setStart] = useState(0)
    const [end, setEnd] = useState(3)
    const [blog, setBlog] = useState([])
    const [hasmore, setHasmore] = useState(true)
    const socket = socketApp.getSocket()
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
                axios.get(`http://localhost:2704/api/news/data?start=${end - 3}&end=${end}&id=${id}`)
                    .then(res => {
                        if (res.data.data !== undefined) setBlogRes(res)
                        else setHasmore(false)
                    })
                    .catch(err => {
                        handleError()
                    })
            } else {
                axios.get(`http://localhost:2704/api/news/dataNo?start=${end - 3}&end=${end}`)
                    .then(res => {
                        setBlogRes(res)
                    })
                    .catch(err => {
                        handleError()
                    })
            }
        }
        fn()
    }, [end, id])

    const CommentRender = (cb) => {
        const { value, i } = cb.props
        return <>
            {
                value.comment[i] !== undefined ? <div className="comment_blog">
                    <div className="content">
                        <img alt="avatart_user" src="./demo.jpeg"></img>
                        <span>{value.comment[i].value}</span>
                        <div className="activities">
                            <LikeComment props={{ data: value.comment[i], i: value.comment[i].id + i, value: value.idBlog, socket, idUser: id }} />
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

            {/* for message */}
            <MessageContainer />
            <InfiniteScroll
                dataLength={blog.length}
                next={fetchData}
                hasMore={hasmore}
                loader={<div className="loaderBalls" id="ball_load">
                    <div className="yellow"></div>
                    <div className="red"></div>
                    <div className="blue"></div>
                </div>}
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
                                        {value && value.image && value.image[0].split(".")[1] === "jpeg" ? <ImageRender props={{ value, id }} /> : <VideoRender value={value.image} idBlog={value.idBlog} />}

                                    </div>
                                    <div className="activities_blog">
                                        <SeeLike props={{ value, i, className: "inner", socket, id }} />
                                        <div className="inner">
                                            <Link to={"/posts/id=" + value.idBlog}>
                                                <li className="comment list">
                                                    <svg viewBox="-10 -30 590 512" xmlns="http://www.w3.org/2000/svg"><path d="m456.835938 0h-401.667969c-30.421875 0-55.167969 24.746094-55.167969 55.167969v294.238281c0 30.417969 24.746094 55.164062 55.167969 55.164062h127.296875l42.15625 84.316407c7.34375 14.6875 18.777344 23.113281 31.378906 23.113281s24.035156-8.425781 31.378906-23.113281l42.160156-84.3125h127.296876c30.417968 0 55.164062-24.75 55.164062-55.167969v-294.238281c0-30.421875-24.746094-55.167969-55.164062-55.167969zm0 0" /></svg>
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