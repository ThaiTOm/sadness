import React, { useEffect, useState, useRef } from 'react';
import CryptoJS from 'crypto-js';
import classNames from 'classnames';
import { getCookie } from '../../helpers/auth';
import SendIcon from '@material-ui/icons/Send';
import axios from "axios"
import socketApp from '../../socket';
import ImageIcon from '@material-ui/icons/Image';
import IconButton from '@material-ui/core/IconButton';

function Chat() {
    let socket = socketApp.getSocket();
    const id = getCookie().token;
    const ipOfUser = "Dong nai";
    const [value, setValue] = useState([]);
    // len is len of rooms the user had join
    const [len, SetLen] = useState(0);
    const fileRef = useRef(null)
    //This id room contain every id of the message that they have

    const [message, setMessage] = useState("");
    const [idRoom, setidRoom] = useState("");
    const [wait, setWait] = useState(false);
    const [finish, setFinish] = useState(false);
    const myRef = useRef(null)
    const executeScroll = () => {
        try {
            myRef.current.scrollIntoView()
        } catch (error) {
        }
    }

    const encryptTo = text => {
        const passphrase = '123nguyenduythaise1';
        return CryptoJS.AES.encrypt(text, passphrase).toString();
    }
    const decryptWithAES = ciphertext => {
        const passphrase = '123nguyenduythaise1';
        const bytes = CryptoJS.AES.decrypt(ciphertext, passphrase);
        const originalText = bytes.toString(CryptoJS.enc.Utf8);
        return originalText;
    };
    const handleFileUpload = (e) => {
        let file = e.target.files;
        let reader = new FileReader()
        for (let i = 0; i < file.length; i++) {
            reader.readAsDataURL(file[i])
            reader.onloadend = () => {
                console.log(reader.result)
                socket.emit("sendImageOff", { room: idRoom, image: reader.result, userId: id })
            }
        }
    }
    const useRefTrigger = () => {
        fileRef.current.click()
    }
    const HanldeClickFind = (e) => {
        if (wait !== true) {
            socket.emit("join", { id, len, ipOfUser }, (error) => {
                if (error === "error") {
                    setWait(true)
                } else {
                    setFinish(true)
                    setidRoom(error)
                }
            })
        } else {
            setWait(false)
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
    }, [])
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
                setValue(img => [...img, msg.image + ";" + msg.user])
            }
            else if (msg.text) {
                setValue(msgs => [...msgs, msg.text + "," + msg.user])
                executeScroll()
            }
        })
    }, [])
    //defined button find partner classname
    var btnClassFind = classNames({
        "onclic": wait,
    })
    return (
        <div className="message_container">
            <div className="container_button">
                <button
                    style={finish === true ? { display: "none" } : {}}
                    id="button_find_partner"
                    className={btnClassFind}
                    onClick={HanldeClickFind}
                >
                </button>
            </div>
            <ul
                style={finish === false ? { display: "none" } : {}}>
                {
                    Object.values(value).map(function (item, i) {
                        let arr = item.split(",")
                        if (arr[0] === "image") {
                            let imgUrl = arr[1] + "," + arr[2].split(";")[0]
                            if (arr[2].split(";")[1] === id) {
                                return (
                                    <li
                                        ref={myRef}
                                        key={i}
                                        className="messageImage mIOwn">
                                        <input type="checkbox" id={i}></input>
                                        <label for={i}>
                                            <img src={imgUrl}></img>
                                        </label>
                                    </li>
                                )
                            } else {
                                return (
                                    <li
                                        ref={myRef}
                                        key={i}
                                        className="messageImage mIOther">
                                        <input type="checkbox" id={i}></input>
                                        <label for={i}>
                                            <img src={imgUrl}></img>
                                        </label>
                                    </li>
                                )
                            }
                        } else {
                            let msgs = decryptWithAES(arr[0])
                            if (arr[1] === id) {
                                return (
                                    <li className="messageLiOwn"
                                        key={i}
                                        ref={myRef}>
                                        {msgs.length > 60 ?
                                            <div className="own_message_same_div messageLiOwnm60">
                                                <span>{msgs}</span>
                                            </div> :
                                            <div className="own_message_same_div messageLiOwnl60">
                                                <span>{msgs}</span>
                                            </div>

                                        })
                                    </li>
                                )
                            } else {
                                return (
                                    <li className="messageLiOther"
                                        key={i}
                                        ref={myRef}>
                                        {msgs.length > 60 ?
                                            <div className="other_message_same_div messageLiOtherm60">
                                                <span>{msgs}</span>
                                            </div> :
                                            <div className="other_message_same_div messageLiOtherl60">
                                                <span>{msgs}</span>
                                            </div>

                                        })
                                    </li>
                                )
                            }
                        }
                    })
                }
            </ul>
            <form
                className="formMessage"
                style={finish === false ? { display: "none" } : {}}
                onSubmit={handleSubmit}>
                {/* <input value={message} type="text" onChange={handleChange}></input> */}
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
                        onChange={handleFileUpload}
                        ref={fileRef}
                    />
                    <IconButton onClick={useRefTrigger}>
                        <ImageIcon />
                    </IconButton>
                </div>
                <button type="submit">
                    <SendIcon />
                </button>
            </form>
        </div>
    )
}

export default Chat
