import React, { useState, useEffect } from 'react'
import { ToastContainer, toast } from "react-toastify";
import axios from "axios"
import LikeComment from "./likeComment"
import ChatBubbleOutlineOutlinedIcon from '@material-ui/icons/ChatBubbleOutlineOutlined';
import { IconButton } from '@material-ui/core';
import RequireLogin from './requireLogin';
import socketApp from '../socket';

function Comment(props) {
    const { value, id } = props.props
    let socket = socketApp.getSocket();
    const [text, setText] = useState("")
    const [start, setStart] = useState(0)
    const [end, setEnd] = useState(10)
    const [comment, setComment] = useState([])
    const [login, setLogin] = useState(null)
    const [load, setLoad] = useState(false)
    const [buttonFind, setButtonfind] = useState(true)

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
        setLoad(true)
        setTimeout(() => {
            setStart(start + 10)
            setEnd(end + 10)
        }, 1500)
    }
    const handleLoginValidate = () => {
        if (!id) {
            setLogin(true)
        } else {
            setLogin(null)
        }
    }
    let loadMoreButton = <div className="button_load_more">
        {load === false ? <button onClick={fetchData}>Tải thêm</button>
            :
            <div className="loaderBalls">
                <div className="yellow"></div>
                <div className="red"></div>
                <div className="blue"></div>
            </div>
        }
    </div>

    useEffect(() => {
        axios.get("http://localhost:2704/api/news/comment?start=" + start + "&end=" + end + "&id=" + id + "&blog=" + value.idBlog)
            .then(async res => {
                let a = res.data.data
                if (a.length >= 4) {
                    setButtonfind(false)
                    return setLoad(false)
                }
                for await (let value of a) {
                    setComment(a => [...a, value])
                }
                setLoad(false)
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
                <IconButton type="submit" id="btnSearch" className="comment">
                    <ChatBubbleOutlineOutlinedIcon />
                </IconButton>
            </form>
            {
                comment.length > 0 ? comment.map(function (vari, i) {
                    return (
                        <div key={i} className="content_comment_a_blog">
                            <div className="value_content_comment_a_blog">
                                <img alt="avatar_user" src="../demo.jpeg"></img>
                                <div>
                                    {
                                        vari.data.map(function (data, index) {
                                            return <p key={index}>{data}</p>
                                        })
                                    }
                                    <LikeComment props={{ data: vari, i, value: value.idBlog }} />
                                </div>
                            </div>

                        </div>
                    )
                }) : console.log()
            }
            {buttonFind === true && comment.length > 5 ? loadMoreButton : console.log()}
        </div>
    )
}

export default Comment
