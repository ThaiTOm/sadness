import React, { useState, useEffect, useRef } from 'react'
import axios from "axios"
import CryptoJS from 'crypto-js';
import { getCookie } from '../../helpers/auth';
import SendIcon from '@material-ui/icons/Send';
import { useScrollPosition, useScrollXPosition, useScrollYPosition } from 'react-use-scroll-position';
import socketApp from '../../socket';

// This function is use for send and view message
function SendContact(props) {
    const userId = getCookie().token;
    let socket = socketApp.getSocket();
    const { id, name } = props;
    const [start, setStart] = useState(0);
    const [end, setEnd] = useState(10);
    //msg contain all message before
    const [msg, setMsg] = useState([]);
    // about message is contain new message typing
    const [message, setMessage] = useState("")
    const myRef = useRef(null)
    const [load, setLoad] = useState(false);

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
        let originalText
        //if original text is defined that assign it
        try {
            originalText = bytes.toString(CryptoJS.enc.Utf8);
        } catch (error) {
            originalText = ""
        }
        return originalText;
    };
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
    useEffect(() => {
        axios.post("http://localhost:2704/api/msgC/sendContact?id=" + id + "&start=" + start + "&end=" + end)
            .then(res => {
                setMsg(res.data.reverse().slice(2, res.data.length))
                // executeScroll()
                setLoad(false)
            }).catch(err => { })
    }, [id, start, end])

    // get message 
    useEffect(() => {
        socket.on("message", msg => {
            setMsg(msgs => [...msgs, msg.text + "," + msg.user])
            executeScroll()
        })
    }, [])

    return (
        <div className="message_container">
            <ul>
                <div className="button_load_more">
                    {load === false ?
                        <button onClick={handleClickLoad}>Tải thêm</button>
                        : <div className="loaderBalls">
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
                            let msgs = arr[0]
                            if (arr[1] === userId) {
                                return <li
                                    key={i}
                                    ref={myRef}
                                    className="messageLiOwn row">
                                    <div >
                                        <span>{decryptWithAES(msgs)}</span>
                                    </div>
                                </li>
                            } else {
                                return <li
                                    key={i}
                                    ref={myRef}
                                    className="messageLiOther"
                                >
                                    <div>
                                        <span>{decryptWithAES(msgs)}</span>
                                    </div>
                                </li>
                            }
                        }) : console.log()
                }
            </ul>
            <form
                className="formMessage"
                onSubmit={handleSubmit}>
                {/* <input value={message} type="text" onChange={handleChange}></input> */}
                <p>
                    <span className="input">
                        <input
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
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


    // <div className="send_container">
    //     <div className="">

    //     </div>
    // </div>

}

export default SendContact
