import React, { useState, useEffect, useRef } from 'react'
import { handleFileUpload, messageLiImageRender, messageLiRender } from '../../helpers/message';
import { decryptWithAES, encryptTo } from '../../helpers/auth';
import SendOutlinedIcon from '@material-ui/icons/Send';
import ImageIcon from '@material-ui/icons/Image';
import IconButton from '@material-ui/core/IconButton';
import axios from 'axios';
import socketApp from '../../socket';
import { executeScroll } from "../../helpers/message"


function RenderChat(props) {
    let socket = socketApp.getSocket();
    let { id, userId } = props
    const [message, setMessage] = useState("");
    const [msg, setMsg] = useState([]);
    const fileRef = useRef(null);
    const [load, setLoad] = useState(false);
    const [start, setStart] = useState(0);
    const [end, setEnd] = useState(10);
    const myRef = useRef(null);


    const handleSubmit = e => {
        e.preventDefault();
        setMessage("")
        if (message) {
            let value = encryptTo(message)
            socket.emit('sendMessageOff', { room: id, message: value, userId });
        }
    }
    const handleClickLoad = () => {
        setLoad(true);
        let a = end + 10
        setEnd(a)
    }

    const useRefTrigger = () => {
        fileRef.current.click()
    }
    useEffect(() => {
        axios.get("http://localhost:2704/api/msgC/sendContact?id=" + id + "&start=" + start + "&end=" + end)
            .then(res => {
                setMsg(res.data)
                setLoad(false)
            }).catch(err => {
                return <div>Oops, bạn hãy thử lại sau</div>
            })
    }, [id, start, end])
    useEffect(() => {
        socket.on("message", msg => {
            if (msg.image) {
                setMsg(img => [...img, msg.image + ";" + msg.user])
            } else {
                setMsg(msgs => [...msgs, msg.text + "," + msg.user])
            }
            executeScroll(myRef)
        })
    }, [socket])
    return (
        <>
            <ul>
                <div className="button_load_more">
                    {load === false ? <button onClick={handleClickLoad}>Tải thêm</button>
                        :
                        <div className="loaderBalls">
                            <div className="yellow"></div>
                            <div className="red"></div>
                            <div className="blue"></div>
                        </div>
                    }
                </div>
                {
                    msg.length > 0 ?
                        msg.map(function (item, i) {
                            let arr = item.split(",")
                            if (arr[0] === "image") {
                                let imgUrl = arr[1] + "," + arr[2].split(";")[0]
                                if (arr[2].split(";")[1] === userId) return messageLiImageRender("mIOwn", i, imgUrl, myRef)
                                else return messageLiImageRender("mIOther", i, imgUrl, myRef)
                            } else {
                                let msgs = decryptWithAES(arr[0])
                                if (arr[1] === userId) {
                                    return messageLiRender("messageLiOwn", "own_message_same_div messageLiOwnm60", "own_message_same_div messageLiOwnl60", msgs, i, myRef)
                                } else {
                                    return messageLiRender("messageLiOther", "other_message_same_div messageLiOtherm60", "other_message_same_div messageLiOtherl60", msgs, i, myRef)
                                }
                            }
                        }) : console.log()
                }
            </ul>
            <form
                className="formMessage"
                onSubmit={handleSubmit}>
                <span className="input">
                    <input
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        type="text"
                        placeholder="Enter text" >
                    </input>
                    <span></span>
                </span>
                <div className="extension_input">
                    <input
                        id="icon_button_file"
                        type="file"
                        onChange={(e) => handleFileUpload(e, userId, id)}
                        ref={fileRef}
                    />
                    <div className="inner_title">
                        <IconButton className="image_upload_message_icon" onClick={useRefTrigger}>
                            <ImageIcon />
                        </IconButton>
                        <span className="title" id="image_upload_message_title">
                            Đăng tải ảnh
                    </span>
                    </div>
                </div>
                <button type="submit">
                    <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABmJLR0QA/wD/AP+gvaeTAAABu0lEQVRoge2ZO0oDURSGvyOChYXaRVCitmJlbaWtC7ATUWzEJdjY6AZcgG5BC7W10p1Y+ETE528Rg3EymcmdzONemA9C4Mwk+T8yuTlzLtTU1ASNpZ0gaQHYBuaBF+AcODazx4KzDY6kXUmf6uZO0p6ksaoz9kTSiqTvmPBhiEi6TAnvt4ikeweBNk+SDiSNV52fDOH9EhlQoHqRnASqE8lZoHyRggTKEylYIDeRnq2EJGV90ww8A0fAgZk9uLzQF4E2ziJJApvAFDD7+5gDJoGhwXOm0rdIksBaTHkYaPBfqgmMZI6aTKqIq0AcQ7SkmsDM73MTyLMvugU2zOwseiAPgV6M8yfTlmskfWYK78CSmV13FosUiGMEmKYlMwMs4vZNnZrZamehbIEo08Chw/kPZjbRWShjRUnC9XLqWtqHcwrSL3GXkAtX0UKRAnn/iN+A/WgxD4GyltF1M7uJHnAV8O6PLElglMBbiSCaubJXoV5kbqerFsgcPBXf78SqEgj2pj7YsUqwgy0vRovBD3cvHIJ7OV5flvQVXPBOJO1I+vA5eD+bfPPAFq1NvlfgAjgJYpOvpqbGf34ADyqvY/et3aUAAAAASUVORK5CYII=" />
                </button>
            </form>
        </>
    )
}

export default RenderChat
