import React, { useState, useEffect, useRef } from 'react'
import axios from "axios"
import { decryptWithAES, encryptTo, getCookie } from '../../helpers/auth';
import SendOutlinedIcon from '@material-ui/icons/Send';
import socketApp from '../../socket';
import ImageIcon from '@material-ui/icons/Image';
import IconButton from '@material-ui/core/IconButton';
import "../style/call.css"
import MicIcon from '@material-ui/icons/Mic';
import HeadsetIcon from '@material-ui/icons/Headset';
import Peer from "peerjs"
import { createEmptyAudioTrack } from '../../helpers/audio';
import { set } from 'js-cookie';
const userId = getCookie().token;


// This function is use for send and view message
function SendContact(props) {
    let socket = socketApp.getSocket();
    let createPeer = async () => {
        return new Peer(userId, {
            host: "/",
            port: 3001
        })
    }
    const { id } = props;
    const [start, setStart] = useState(0);
    const [end, setEnd] = useState(10);
    //msg contain all message before

    const [msg, setMsg] = useState([]);
    // about message is contain new message typing
    const [message, setMessage] = useState("");
    const myRef = useRef(null);
    const fileRef = useRef(null);
    const [load, setLoad] = useState(false);
    const [useer, setUser] = useState(null);
    const [audio, setAudio] = useState(null);
    const executeScroll = () => {
        try {
            myRef.current.scrollIntoView()
        } catch (error) {
        }
    }

    const handleSubmit = e => {
        e.preventDefault();
        setMessage("")
        if (message) {
            let value = encryptTo(message)
            socket.emit('sendMessageOff', { room: id, message: value, userId });
        }
    }
    const handleClickLoad = () => {
        // console.run
        setLoad(true);
        let a = end + 10
        setEnd(a)
    }
    const handleFileUpload = (e) => {
        let file = e.target.files;
        let reader = new FileReader()
        for (let i = 0; i < file.length; i++) {
            reader.readAsDataURL(file[i])
            reader.onloadend = () => {
                socket.emit("sendImageOff", { room: id, image: reader.result, userId })
            }
        }
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

    // get message 
    useEffect(() => {
        socket.on("message", msg => {
            if (msg.image) {
                setMsg(img => [...img, msg.image + ";" + msg.user])
            } else {
                setMsg(msgs => [...msgs, msg.text + "," + msg.user])
            }
            executeScroll()
        })
    }, [])
    // Use effect for voice chat
    var audioStream

    let createNullStream = () => {
        const audioTrack = createEmptyAudioTrack();
        const streamNull = new MediaStream([audioTrack]);
        audioStream = (
            <audio muted playsInline autoPlay />
        )
        setAudio(audioStream)
    }
    const createCall = (call) => {
        call.on("stream", async (userVideoStream) => {
            let audioStream = async () => {
                const audioTrack = createEmptyAudioTrack();
                const streamNull = new MediaStream([audioTrack]);
                try {
                    // <audio playsInline ref={audio => }/>
                    return <audio playsInline ref={audio => audio ? audio.srcObject = userVideoStream : streamNull} autoPlay />
                } catch (error) {
                    console.log("run 123")
                }
            }
            let a = await audioStream()
            console.log(a)
            setAudio(a)
        })
    }
    const plus = async (peer, stream) => {
        // check if that peer is destroyed or not 
        if (peer.destroyed === false) {
            // run normally
            peer.on("call", call => {
                call.answer(stream)
                createCall(call)
            })
            socket.on("user-connect", value => {
                const call = peer.call(value.id, stream)
                createCall(call)
            })
        } else {
            createNullStream()
        }
    }

    useEffect(async () => {
        let peerJS = await createPeer()
        peerJS.on("open", idPeer => {
            socket.emit("chatVideo", { idRoom: id, id: userId })
        })
        // get user media
        navigator.mediaDevices.getUserMedia({ video: false, audio: true }).then(stream => {
            plus(peerJS, stream)
        }).catch(err => {
            // if user does not accept to stream then create new null stream
            const audioTrack = createEmptyAudioTrack();
            const stream = new MediaStream([audioTrack]);
            plus(peerJS, stream)
        })
    }, [id])


    return (
        <div className="message_container">
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
                                if (arr[2].split(";")[1] === userId) {
                                    return (
                                        // message image own
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
                                        //message image other
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
                                if (arr[1] === userId) {
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
                                            }
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
                                            }
                                        </li>
                                    )
                                }
                            }
                        }) : console.log()
                }
            </ul>
            <form
                className="formMessage"
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
                    <div classNam="inner_title">
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
            <div className="call_div_container">
                <div>
                    <span>Voice Chat</span>
                </div>
                <div className="main_mic">
                    <div className="user_device">
                        <img src="../demo.jpeg"></img>
                        <div className="icon_device">
                            {audio}
                            <MicIcon />
                            <HeadsetIcon />
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default SendContact