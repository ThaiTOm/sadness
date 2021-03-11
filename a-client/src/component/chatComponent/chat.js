import React, { useEffect, useState, useRef } from 'react';
import classNames from 'classnames';
import { getCookie, encryptTo, decryptWithAES } from '../../helpers/auth';
import SendOutlinedIcon from '@material-ui/icons/SendOutlined';
import axios from "axios"
import socketApp from '../../socket';
import ImageIcon from '@material-ui/icons/Image';
import IconButton from '@material-ui/core/IconButton';
import { handleFileUpload, messageLiRender, messageLiImageRender, executeScroll, Spinning } from '../../helpers/message';
function Chat() {
    let socket = socketApp.getSocket();
    const id = getCookie().token;
    const ipOfUser = "Dong nai";
    const [value, setValue] = useState([]);
    // len is len of rooms the user had join
    const [len, SetLen] = useState(0);
    const fileRef = useRef(null)
    //This id room contain every id of the message that they have
    // waitG = wait group
    const [waitG, setWaitG] = useState(null);
    const [message, setMessage] = useState("");
    const [idRoom, setidRoom] = useState("");
    const [wait, setWait] = useState(false);
    const [finish, setFinish] = useState(false);
    const myRef = useRef(null)

    const useRefTrigger = () => {
        fileRef.current.click()
    }

    const HanldeClickFind = (e) => {
        if (wait !== true) {
            socket.emit("joinChat", { id, len, ipOfUser }, (error) => {
                if (error === "error") {
                    setWait(true)
                } else {
                    setFinish(true)
                    setidRoom(error)
                }
            })
        } else {
            setWait(false)
            socket.emit("joinChat", { id, len, ipOfUser }, (error) => {
                if (error !== "error") {
                    setFinish(true)
                    setidRoom(error)
                }
            })
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (message) {
            let value = encryptTo(message)
            socket.emit('sendMessage', { room: idRoom, message: value, id }, () => setMessage(""));
        }
    }
    //Fetch data to recive the idRoom
    useEffect(() => {
        const source = axios.CancelToken.source()
        const fetchData = async () => {
            try {
                await axios.post("http://localhost:2704/api/msgC/getIdRoom", { id })
                    .then(res => {
                        SetLen(res.data.len)
                    })
            } catch (error) {
            }
        }
        fetchData()
        return () => {
            source.cancel()
        }
    }, [id])
    //load message
    useEffect(() => {
        socket.on("message", msg => {
            if (msg.roomId) {
                // If we have a couple together than we start to chat
                setWait(false)
                setFinish(true)
                setidRoom(msg.roomId)
            }
            if (msg.image) {
                // if message send is image
                setValue(img => [...img, msg.image + ";" + msg.user])
            }
            else if (msg.text) {
                setValue(msgs => [...msgs, msg.text + "," + msg.user])
                executeScroll(myRef)
            }
        })
    }, [socket])
    //defined button find partner classname
    var btnClassFind = classNames({
        "onclic": wait,
    })
    const changeStateWaitGroup = () => {
        if (waitG === null) {
            setWaitG("active")
            socket.emit("joinChatGroup", { id, len, ipOfUser }, (callback) => {
                if (callback !== "error") {
                    setFinish(true)
                    setidRoom(callback)
                }
            })
        }
        else {
            setWaitG(null)
        }
    }
    return (
        <div className="message_container">
            <div className="container_button">
                <div className="part_1">
                    <button
                        style={finish === true ? { display: "none" } : {}}
                        id="button_find_partner"
                        className={btnClassFind}
                        onClick={HanldeClickFind}
                    >
                        {wait === true ? < Spinning /> : "Tìm cặp"}
                    </button>
                </div>
                <div
                    style={finish === true ? { display: "none" } : {}}
                    className="part_2">
                    <div onClick={changeStateWaitGroup} className={"chat_button_group " + waitG}>
                        <div className="chat_button_group" >
                            <div className="background"></div>
                            <svg className="chat-bubble" width="100" height="100" viewBox="0 0 100 100">
                                <g className="bubble">
                                    <path className="line line1" d="M 30.7873,85.113394 30.7873,46.556405 C 30.7873,41.101961
          36.826342,35.342 40.898074,35.342 H 59.113981 C 63.73287,35.342
          69.29995,40.103201 69.29995,46.784744" />
                                    <path className="line line2" d="M 13.461999,65.039335 H 58.028684 C
            63.483128,65.039335
            69.243089,59.000293 69.243089,54.928561 V 45.605853 C
            69.243089,40.986964 65.02087,35.419884 58.339327,35.419884" />
                                </g>
                                <circle className="circle circle1" r="1.9" cy="50.7" cx="42.5" />
                                <circle className="circle circle2" cx="49.9" cy="50.7" r="1.9" />
                                <circle className="circle circle3" r="1.9" cy="50.7" cx="57.3" />
                            </svg>
                        </div>
                    </div>
                </div>

            </div>
            <ul
                style={finish === false ? { display: "none" } : {}}>
                {
                    Object.values(value).map(function (item, i) {
                        let arr = item.split(",")
                        if (arr[0] === "image") {
                            // get image url
                            let imgUrl = arr[1] + "," + arr[2].split(";")[0]
                            // check if message is current user
                            if (arr[2].split(";")[1] === id) return messageLiImageRender("mIOwn", i, imgUrl)
                            else return messageLiImageRender("mIOther", i, imgUrl)
                        } else {
                            // encrypt the message 
                            let msgs = decryptWithAES(arr[0])
                            if (arr[1] === id) return messageLiRender("messageLiOwn", "own_message_same_div messageLiOwnm60", "own_message_same_div messageLiOwnl60", msgs, i)
                            else return messageLiRender("messageLiOther", "other_message_same_div messageLiOtherm60", "other_message_same_div messageLiOtherl60", msgs, i)
                        }
                    })
                }
            </ul>
            <form
                className="formMessage"
                style={finish === false ? { display: "none" } : {}}
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
                        onChange={(e) => handleFileUpload(e, id, idRoom)}
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
                    <SendOutlinedIcon />
                </button>
            </form>
        </div>
    )
}

export default Chat
