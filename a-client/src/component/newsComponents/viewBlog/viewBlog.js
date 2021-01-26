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
                                                    <img src={value.image[0]} />
                                                </div>
                                                : value.image.length === 2 ?
                                                    <div className="two">
                                                        <img src={value.image[0]}></img>
                                                        <img src={value.image[1]}></img>
                                                    </div>
                                                    : value.image.length >= 3 ?
                                                        <div className="three">
                                                            <div className="two">
                                                                <img src={value.image[0]}></img>
                                                                <img src={value.image[1]}></img>
                                                            </div>

                                                            <img src={value.image[2]}></img>
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
                                            value.comment.map(function (data, i) {
                                                return <div
                                                    key={i}
                                                    className="comment_blog"
                                                >
                                                    <div className="content">
                                                        <img src="./demo.jpeg"></img>
                                                        <span>{data.value}</span>
                                                    </div>
                                                    <div className="activities">
                                                        <LikeComment props={{ data, i, value: value.idBlog }} />
                                                        <div className="comment list">
                                                            <li >
                                                                <ChatBubbleOutlineIcon /> comment
                                                            </li>
                                                        </div>
                                                    </div>
                                                </div>
                                            })
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
