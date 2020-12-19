import React, { useEffect, useState, useRef } from 'react';
import CryptoJS from 'crypto-js';
import classNames from 'classnames';
import { getCookie } from '../../helpers/auth';
import SendIcon from '@material-ui/icons/Send';
import axios from "axios"
import socketApp from '../../socket';

function Chat() {
    let socket = socketApp.getSocket();
    const id = getCookie().token;
    const ipOfUser = "Dong nai";
    const [value, setValue] = useState([]);
    const [len, SetLen] = useState(0);
    //This id room contain every id of the message that they have
    const [idRooms, setIdRooms] = useState([])
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

    const handleChange = (e) => {
        setMessage(e.target.value)
    }

    //Fetch data to recive the idRoom
    useEffect(() => {
        axios.post("http://localhost:2704/api/msgC/getIdRoom", { id })
            .then(res => {
                SetLen(res.data.len)
                setIdRooms(res.data.idRooms)
            }).catch(err => {
                console.log(err)
            })
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
            if (msg.text) {
                let msgText = decryptWithAES(msg.text)
                let value = { text: msgText, user: msg.user }
                // inputRef.current.focus();
                setValue(msgs => [...msgs, value])
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
                        if (item.user === id) {
                            return <li
                                ref={myRef}
                                key={i}
                                className="messageLiOwn row">
                                <div >
                                    <span>{item.text}</span>
                                </div>
                            </li>
                        } else {
                            return <li
                                ref={myRef}
                                key={i}
                                className="messageLiOther"
                            >
                                <div>
                                    <span>{item.text}</span>
                                </div>
                            </li>
                        }
                    }
                    )
                }
            </ul>
            <form
                className="formMessage"
                style={finish === false ? { display: "none" } : {}}
                onSubmit={handleSubmit}>
                {/* <input value={message} type="text" onChange={handleChange}></input> */}
                <p>
                    <span className="input">
                        <input
                            value={message}
                            onChange={handleChange}
                            type="text"
                            placeholder="Enter text" />
                        <span></span>
                    </span>
                    <button type="submit">
                        <SendIcon />
                    </button>
                </p>
            </form>
        </div>
    )
}

export default Chat
