import React, { useState, useEffect } from 'react'
import socketApp from '../../../socket';
import { ToastContainer, toast } from "react-toastify";
import SkeletonComment from "../exNews/SkeletonComment"
import InfiniteScroll from "react-infinite-scroll-component";
import axios from "axios"
import LikeComment from "./likeComment"
import RequireLogin from '../../../helpers/requireLogin';


function Comment(props) {
    const { value, id } = props.props
    let socket = socketApp.getSocket();
    const [text, setText] = useState("")
    const [start, setStart] = useState(0)
    const [end, setEnd] = useState(10)
    const [comment, setComment] = useState([])
    const [login, setLogin] = useState(null)
    const handleSubmit = (e) => {
        if (text.length > 0) {
            e.preventDefault()
            setText("")
            socket.emit("comment", { idRecieve: value.idBlog, idSent: id, value: text }, (error) => {
                if (error === "error") {
                    toast.error("Có lỗi đó xảy ra bạn hãy thử lại sau")
                } else {
                    toast.success("Yêu cầu của bạn đã được thực hiện")
                }
            })
        }
    }
    const fetchData = () => {
        setTimeout(() => {
            setStart(start + 10)
            setEnd(end + 10)
        }, 1500);
    }
    const handleLoginValidate = () => {
        if (!id) {
            setLogin(true)
        } else {
            setLogin(null)
        }
    }
    useEffect(() => {
        setComment([])
        axios.get("http://localhost:2704/api/news/comment?start=" + start + "&end=" + end + "&id=" + id + "&blog=" + value.idBlog)
            .then(async res => {
                let a = res.data.data
                for await (let value of a) {
                    setComment(a => [...a, value])
                }
            })
            .catch(err => {
                return (
                    <div>
                        Có lỗi đả xảy ra bạn hãy thử lại sau
                    </div>
                )
            })
    }, [value.idBlog])
    useEffect(() => {
        axios.get("http://localhost:2704/api/news/comment?start=" + start + "&end=" + end + "&id=" + id + "&blog=" + value.idBlog)
            .then(async res => {
                let a = res.data.data
                for await (let value of a) {
                    setComment(a => [...a, value])
                }
            })
            .catch(err => {
                return (
                    <div>
                        Có lỗi đả xảy ra bạn hãy thử lại sau
                    </div>
                )
            })
    }, [start])
    return (
        <div className="comment_a_blog">
            {login ? <RequireLogin onClick={(value) => setLogin(value)} /> : console.log()}
            <ToastContainer />
            <form className="input-container ex" onSubmit={handleSubmit}>
                <div
                    onClick={handleLoginValidate}
                    suppressContentEditableWarning={true}
                    contentEditable
                    id="txtSearch"
                    onInput={e => setText(e.target.innerText)}
                >
                </div>
                <input type="submit" id="btnSearch" value="enter" />
            </form>
            <InfiniteScroll
                dataLength={comment.length}
                next={fetchData}
                hasMore={true}
                endMessage={
                    <p style={{ textAlign: 'center' }}>
                        <b>het</b>
                    </p>
                }
                loader={<SkeletonComment />}
            >
                {
                    comment.length > 0 ? comment.map(function (vari, i) {
                        return (
                            <div key={i} className="content_comment_a_blog">
                                <div className="value_content_comment_a_blog">
                                    <img src="../demo.jpeg"></img>
                                    <div>
                                        {
                                            vari.data.map(function (data) {
                                                return <p>{data}</p>
                                            })
                                        }
                                    </div>
                                </div>
                                <div className="activities">
                                    <LikeComment props={{ data: vari, i, value: value.idBlog }} />
                                    <div className="comment list">
                                        {/* <ChatBubbleOutlineIcon /> comment */}
                                    </div>
                                </div>
                            </div>
                        )
                    }) : console.log()
                }
            </InfiniteScroll>
        </div>
    )
}

export default Comment
