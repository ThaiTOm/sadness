import React, { useState, useEffect } from 'react'
import "../../style/viewBlog.css"
import axios from "axios"
import Skeleton from "../exNews/Skeleton"
import InfiniteScroll from "react-infinite-scroll-component";
import { getCookie } from '../../../helpers/auth';
import TextField from '@material-ui/core/TextField';
import socketApp from '../../../socket';
import { ToastContainer, toast } from "react-toastify";
import SeeLike from '../exNews/seeLike';
import LikeComment from '../exOne/likeComment';
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';
import { Link } from "react-router-dom"

function ViewBlog() {
    let socket = socketApp.getSocket();
    const [start, setStart] = useState(0)
    const [end, setEnd] = useState(3)
    const [blog, setBlog] = useState([])
    const [comment, setComment] = useState("")
    const id = getCookie().token
    const handleSubmit = (e, value) => {
        e.preventDefault()
        setComment("")
        socket.emit("comment", { idRecieve: value.idBlog, idSent: id, value: comment }, (error) => {
            if (error === "error") {
                toast.error("Có lỗi đó xảy ra bạn hãy thử lại sau")
            } else {
                toast.success("Yêu cầu của bạn đã được thực hiện")
            }
        })
    }
    const fetchData = () => {
        setTimeout(() => {
            setStart(start + 3)
            setEnd(end + 3)
        }, 1500);
    }

    useEffect(() => {
        axios.get("http://localhost:2704/api/news/data?start=" + start + "&end=" + end + "&id=" + id)
            .then(async res => {
                let a = res.data.data
                for await (let value of a) {
                    setBlog(a => [...a, value])
                }
            })
            .catch(err => {
                return (
                    <div>
                        Có lỗi đả xảy ra bạn hãy thử lại sau
                    </div>
                )
            })
    }, [end])
    return (
        <div className="viewBlog">
            <ToastContainer />
            {blog.length === 0 && <Skeleton />}
            <InfiniteScroll
                dataLength={blog.length}
                next={fetchData}
                hasMore={true}
                loader={<Skeleton />}
            >
                {
                    blog !== undefined ? blog.map(function (value, i) {
                        return (
                            <li className="viewBlog_li" key={i}>
                                <div className="contain_blog" >
                                    <div className="text_blog">
                                        {
                                            value.text.map(function (data) {
                                                return <p>{data}</p>
                                            })
                                        }
                                    </div>
                                    <div className="image-blog">
                                        {
                                            value.image.length === 1 ?
                                                <div className="one">
                                                    <Link to={"/posts/id=" + value.idBlog}>
                                                        <img
                                                            style={{
                                                                borderTopLeftRadius: "25px",
                                                                borderBottomLeftRadius: "25px",
                                                                borderTopRightRadius: "25px",
                                                                borderBottomRightRadius: "25px"
                                                            }}
                                                            src={value.image[0]} />
                                                    </Link>
                                                </div>
                                                : value.image.length === 2 ?
                                                    <div className="two">
                                                        <Link to={"/posts/id=" + value.idBlog}>
                                                            <img
                                                                style={{
                                                                    borderTopLeftRadius: "25px",
                                                                    borderBottomLeftRadius: "25px"
                                                                }}
                                                                src={value.image[0]}></img>
                                                            <img
                                                                style={{
                                                                    borderTopRightRadius: "25px",
                                                                    borderBottomRightRadius: "25px"
                                                                }}
                                                                src={value.image[1]}></img>
                                                        </Link>
                                                    </div>
                                                    : value.image.length === 3 ?
                                                        <div className="three">
                                                            <Link to={"/posts/id=" + value.idBlog}>
                                                                <div className="two">
                                                                    <img
                                                                        style={{
                                                                            borderTopLeftRadius: "25px"
                                                                        }}
                                                                        src={value.image[0]}></img>
                                                                    <img
                                                                        style={{
                                                                            borderTopRightRadius: "25px"
                                                                        }}
                                                                        src={value.image[1]}></img>
                                                                </div>
                                                                <img
                                                                    style={{
                                                                        borderBottomLeftRadius: "25px",
                                                                        borderBottomRightRadius: "25px"
                                                                    }}
                                                                    src={value.image[2]}></img>
                                                            </Link>
                                                        </div>
                                                        : value.image.length === 4 ?
                                                            <div className="three">
                                                                <Link to={"/posts/id=" + value.idBlog}>
                                                                    <div className="two">
                                                                        <img
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
                                                                    <div className="two">
                                                                        <img
                                                                            style={{
                                                                                borderBottomLeftRadius: "25px",
                                                                            }}
                                                                            src={value.image[2]}></img>
                                                                        <img
                                                                            style={{
                                                                                borderBottomRightRadius: "25px",
                                                                            }}
                                                                            src={value.image[3]}></img>
                                                                    </div>
                                                                </Link>
                                                            </div>
                                                            : value.image.length > 4 ?
                                                                <div className="three">
                                                                    <Link to={"/posts/id=" + value.idBlog}>
                                                                        <div className="two">
                                                                            <img
                                                                                style={{
                                                                                    borderTopLeftRadius: "25px",
                                                                                }} src={value.image[0]}></img>
                                                                            <img
                                                                                style={{
                                                                                    borderTopRightRadius: "25px",
                                                                                }} src={value.image[1]}></img>
                                                                        </div>
                                                                        <div className="two" >
                                                                            <img
                                                                                style={{
                                                                                    borderBottomLeftRadius: "25px",
                                                                                }} src={value.image[2]}></img>
                                                                            <div style={{ position: "relative", width: "90%" }}>
                                                                                <img
                                                                                    style={{
                                                                                        borderBottomRightRadius: "25px",
                                                                                    }} className="more_image" src={value.image[3]}></img>
                                                                                <span className="last_image">
                                                                                    + {value.image.length - 4}
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    </Link>
                                                                </div>
                                                                : value.image.length === 0 ?
                                                                    <div>
                                                                    </div> : {}
                                        }
                                    </div>
                                    <div className="activities_blog">
                                        <SeeLike props={{ value, i }} />
                                        <div>
                                            <li className="comment list">
                                                <Link to={"/posts/id=" + value.idBlog}>
                                                    comment
                                                </Link>
                                            </li>
                                        </div>
                                        <div>
                                            <li className="share list">
                                                Share
                                        </li>
                                        </div>
                                    </div>
                                    <div className="comment_blog_view">
                                        {
                                            value.comment[0] !== undefined ? <div
                                                className="comment_blog"
                                            >
                                                <div className="content">
                                                    <img src="./demo.jpeg"></img>
                                                    <span>{value.comment[0].value}</span>
                                                </div>
                                                <div className="activities">
                                                    <LikeComment props={{ data: value.comment[0], i: value.comment[0].id + 0, value: value.idBlog }} />
                                                    <div className="comment list">
                                                        <li >
                                                            <ChatBubbleOutlineIcon /> comment
                                                            </li>
                                                    </div>
                                                </div>
                                            </div> : console.log()
                                        }
                                        {
                                            value.comment[1] !== undefined ? <div
                                                className="comment_blog"
                                            >
                                                <div className="content">
                                                    <img src="./demo.jpeg"></img>
                                                    <span>{value.comment[1].value}</span>
                                                </div>
                                                <div className="activities">
                                                    <LikeComment props={{ data: value.comment[1], i: value.comment[1].id + 1, value: value.idBlog }} />
                                                    <div className="comment list">
                                                        <li >
                                                            <ChatBubbleOutlineIcon /> comment
                                                            </li>
                                                    </div>
                                                </div>
                                            </div> : console.log()
                                        }
                                        {
                                            value.comment[2] !== undefined ? <div
                                                className="comment_blog"
                                            >
                                                <div className="content">
                                                    <img src="./demo.jpeg"></img>
                                                    <span>{value.comment[2].value}</span>
                                                </div>
                                                <div className="activities">
                                                    <LikeComment props={{ data: value.comment[2], i: value.comment[2].id + 2, value: value.idBlog }} />
                                                    <div className="comment list">
                                                        <li >
                                                            <ChatBubbleOutlineIcon /> comment
                                                            </li>
                                                    </div>
                                                </div>
                                            </div> : console.log()
                                        }

                                        <form onSubmit={e => { handleSubmit(e, value) }}>
                                            <TextField
                                                onChange={e => setComment(e.target.value)}
                                                value={comment}
                                                label="Comment" />
                                        </form>
                                    </div>
                                </div>
                            </li>
                        )
                    }) : {}
                }
            </InfiniteScroll>
        </div>
    )
}

export default ViewBlog
