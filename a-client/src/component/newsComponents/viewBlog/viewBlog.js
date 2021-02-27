import React, { useState, useEffect } from 'react'
import { Link } from "react-router-dom"
import axios from "axios"
import Skeleton from "../exNews/Skeleton"
import InfiniteScroll from "react-infinite-scroll-component";
import "../../style/viewBlog.css"
import { getCookie } from '../../../helpers/auth';
import socketApp from '../../../socket';
import SeeLike from '../exNews/seeLike';
import LikeComment from '../exOne/likeComment';
import RequireLogin from '../../../helpers/requireLogin';
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';
import { TextField } from '@material-ui/core';
import ShareBlog from '../exOne/shareBlog';

function ViewBlog() {
    let socket = socketApp.getSocket();
    const [start, setStart] = useState(0)
    const [end, setEnd] = useState(3)
    const [blog, setBlog] = useState([])
    const [comment, setComment] = useState("")

    const id = getCookie().token
    const [login, setLogin] = useState(false)


    const handleSubmit = (e, value) => {
        e.preventDefault()
        setComment("")
        socket.emit("comment", { idRecieve: value.idBlog, idSent: id, value: comment }, (error) => {
        })
    }
    const fetchData = () => {
        setTimeout(() => {
            setStart(start + 3)
            setEnd(end + 3)
        }, 1500);
    }
    const handleValidateLogin = () => {
        if (id) setLogin(null)
        else setLogin("ok")

    }
    useEffect(() => {
        let fn = () => {
            const setBlogRes = async (res) => {
                let a = res.data.data
                for await (let value of a) {
                    setBlog(a => [...a, value])
                }
            }
            const handleError = () => {
                return (
                    <div>
                        Có lỗi đả xảy ra bạn hãy thử lại sau
                    </div>
                )
            }
            if (id) {
                axios.get("http://localhost:2704/api/news/data?start=" + start + "&end=" + end + "&id=" + id)
                    .then(res => {
                        setBlogRes(res)
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

    const ImageRender = (cb) => {
        const { value } = cb.props
        switch (value.image.length) {
            case 0:
                return <div></div>

            case 1:
                return <div className="one">
                    <Link to={"/posts/id=" + value.idBlog}>
                        <img
                            alt={value.image[0].slice(100, 110)}
                            style={{
                                borderTopLeftRadius: "25px",
                                borderBottomLeftRadius: "25px",
                                borderTopRightRadius: "25px",
                                borderBottomRightRadius: "25px"
                            }}
                            src={value.image[0]} />
                    </Link>
                </div>

            case 2:
                return <div className="two">
                    <Link to={"/posts/id=" + value.idBlog}>
                        <img
                            alt={value.image[0].slice(100, 110)}
                            style={{
                                borderTopLeftRadius: "25px",
                                borderBottomLeftRadius: "25px"
                            }}
                            src={value.image[0]}></img>
                        <img
                            alt={value.image[1].slice(100, 110)}
                            style={{
                                borderTopRightRadius: "25px",
                                borderBottomRightRadius: "25px"
                            }}
                            src={value.image[1]}></img>
                    </Link>
                </div>

            case 3:
                return <div className="three">
                    <Link to={"/posts/id=" + value.idBlog}>
                        <div className="two">
                            <img
                                alt={value.image[0].slice(100, 110)}
                                style={{
                                    borderTopLeftRadius: "25px"
                                }}
                                src={value.image[0]}></img>
                            <img
                                style={{
                                    borderTopRightRadius: "25px"
                                }}
                                alt={value.image[1].slice(100, 110)}
                                src={value.image[1]}></img>
                        </div>
                        <img
                            alt={value.image[2].slice(100, 110)}
                            style={{
                                borderBottomLeftRadius: "25px",
                                borderBottomRightRadius: "25px"
                            }}
                            src={value.image[2]}></img>
                    </Link>
                </div>

            case 4:
                return <div className="three">
                    <Link to={"/posts/id=" + value.idBlog}>
                        <div className="two">
                            <img
                                alt={value.image[0].slice(100, 110)}
                                style={{
                                    borderTopLeftRadius: "25px",
                                }}
                                src={value.image[0]}></img>
                            <img
                                alt={value.image[1].slice(100, 110)}
                                style={{
                                    borderTopRightRadius: "25px",
                                }}
                                src={value.image[1]}></img>
                        </div>
                        <div className="two">
                            <img
                                alt={value.image[2].slice(100, 110)}
                                style={{
                                    borderBottomLeftRadius: "25px",
                                }}
                                src={value.image[2]}></img>
                            <img
                                alt={value.image[3].slice(100, 110)}
                                style={{
                                    borderBottomRightRadius: "25px",
                                }}
                                src={value.image[3]}></img>
                        </div>
                    </Link>
                </div>

            default:
                return <div className="three">
                    <Link to={"/posts/id=" + value.idBlog}>
                        <div className="two">
                            <img
                                alt={value.image[0].slice(100, 110)}
                                style={{
                                    borderTopLeftRadius: "25px",
                                }}
                                src={value.image[0]}></img>
                            <img
                                style={{
                                    borderTopRightRadius: "25px",
                                }}
                                src={value.image[1]}></img>
                        </div>
                        <div className="two" >
                            <img
                                alt={value.image[1].slice(100, 110)}
                                style={{
                                    borderBottomLeftRadius: "25px",
                                }}
                                src={value.image[2]}></img>
                            <div style={{ position: "relative", width: "90%" }}>
                                <img
                                    alt={value.image[2].slice(100, 110)}
                                    style={{
                                        borderBottomRightRadius: "25px",
                                    }}
                                    className="more_image"
                                    src={value.image[3]}></img>
                                <span className="last_image">
                                    + {value.image.length - 4}
                                </span>
                            </div>
                        </div>
                    </Link>
                </div>
        }
    }
    const CommentRender = (cb) => {
        const { value, i } = cb.props
        return <>
            {
                value.comment[i] !== undefined ? <div
                    className="comment_blog"
                >
                    <div className="content">
                        <img src="./demo.jpeg"></img>
                        <span>{value.comment[i].value}</span>
                    </div>
                    <div className="activities">
                        <LikeComment props={{ data: value.comment[i], i: value.comment[i].id + i, value: value.idBlog }} />
                        <div className="comment list">
                            <li >
                                <ChatBubbleOutlineIcon /> comment
                </li>
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
            <InfiniteScroll
                dataLength={blog.length}
                next={fetchData}
                hasMore={true}
                loader={<Skeleton />}
            >
                {
                    blog !== undefined ? blog.map(function (value, i) {
                        return (
                            <div className="viewBlog_li" key={i}>
                                <div className="contain_blog" >
                                    <div className="profile">
                                        <img src="./demo.jpeg"></img>
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
                                        {/* Render comment */}
                                        <CommentRender props={{ value, i: 0 }} />
                                        <CommentRender props={{ value, i: 1 }} />
                                        <CommentRender props={{ value, i: 2 }} />
                                        <form onSubmit={e => { handleSubmit(e, value) }}>
                                            <TextField
                                                onClick={handleValidateLogin}
                                                onChange={e => setComment(e.target.value)}
                                                value={comment}
                                                label="Comment" />
                                        </form>
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