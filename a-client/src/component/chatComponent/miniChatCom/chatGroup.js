import React, { useState, useEffect, useRef } from 'react'
import axios from "axios"
import { decryptWithAES, encryptTo, getCookie } from '../../../helpers/auth';
import SendOutlinedIcon from '@material-ui/icons/Send';
import socketApp from '../../../socket';
import ImageIcon from '@material-ui/icons/Image';
import IconButton from '@material-ui/core/IconButton';
import "../../style/call.css"
import VolumeMuteIcon from '@material-ui/icons/VolumeMute';
import VolumeUpIcon from '@material-ui/icons/VolumeUp';
import VolumeOffIcon from '@material-ui/icons/VolumeOff';
import Peer from "peerjs"
import { createEmptyAudioTrack } from '../../../helpers/audio';
import { handleFileUpload, messageLiImageRender, messageLiRender, executeScroll } from '../../../helpers/message';
import SimpleMenu from '../miniChatCom/simpleMenu';
import MicIcon from '@material-ui/icons/Mic';
import MicOffIcon from '@material-ui/icons/MicOff';
import hark from "hark"

// This function is use for send and view message
function ChatGroup(props) {
    const userId = getCookie().token;
    let socket = socketApp.getSocket();

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
    const [audio, setAudio] = useState([]);
    const [mic, setMic] = useState(true)
    const [volumn, setVolumn] = useState(false)
    const [volumn1, setVolumn1] = useState(false)
    const [volumn2, setVolumn2] = useState(false)
    const [volumn3, setVolumn3] = useState(false)
    const [volumn4, setVolumn4] = useState(false)

    const [oldPeer, setOldPeer] = useState(null)
    const [user, setUser] = useState(null)
    const [talk, setTalk] = useState(false)

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

    const handleSetVolumn = (current) => {
        if (audio.length !== 0) {
            setVolumn(!volumn)
            let value = Object.assign({}, audio.props, { seleted: false, writeable: true })
            value.muted = !volumn
            delete value["seleted"]
            delete value["writeable"]
            let old = Object.assign({}, audio, { writeable: true, seleted: false })
            old.props = value
            delete old["seleted"]
            delete old["writeable"]
            setAudio(old)
        }
    }

    const handleSetMic = (i) => {
        setMic(!mic)
        try {
            if (mic === true) {
                const audioTrack = createEmptyAudioTrack();
                let data = oldPeer.connections
                let userMic = Object.keys(data)[i]
                console.log(userMic, data, i)
                let sender = data[userMic][0].peerConnection.getSenders()[0]
                sender.replaceTrack(audioTrack)
            }
            else {
                navigator.mediaDevices.getUserMedia({ video: false, audio: true }).then(stream => {
                    let data = oldPeer.connections
                    let userMic = Object.keys(data)[i]
                    console.log(userMic)
                    let sender = data[userMic][0].peerConnection.getSenders()[0]
                    sender.replaceTrack(stream.getAudioTracks()[0])
                }).catch(err => {
                })
            }
        } catch (error) {

        }
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
            executeScroll(myRef)
        })
    }, [socket])
    // Use effect for voice chat
    let createNullStream = async () => {
        let audioStream = async () => {
            try {
                const audioTrack = createEmptyAudioTrack();
                const streamNull = new MediaStream([audioTrack]);
                return audioStream = (
                    <audio muted={true} ref={audio => audio.srcObject = streamNull} playsInline autoPlay />
                )
            } catch (error) {
                return
            }
        }
        let a = await audioStream()
        setAudio(value => [...value, a])
    }
    const createCall = (call) => {
        call.on("stream", async (userVideoStream) => {
            let audioStream = async () => {
                const audioTrack = createEmptyAudioTrack();
                const streamNull = new MediaStream([audioTrack]);
                try {
                    let speechEvents = hark(userVideoStream, {})
                    speechEvents.on('speaking', function () {
                        setTalk(true)
                    });
                    speechEvents.on('stopped_speaking', function () {
                        setTalk(false)
                    });
                    return <audio playsInline muted={false} ref={audio => audio ? audio.srcObject = userVideoStream : streamNull
                    } autoPlay />
                } catch (error) {
                    return await createNullStream()
                }
            }

            let a = await audioStream()
            setAudio(value => [...value, a])
        })
    }
    const plus = (peer, stream) => {
        // check if that peer is destroyed or not destroy that mean that was created before
        if (peer.destroyed === false && mic === true) {
            // run normally
            peer.on("call", call => {
                call.answer(stream)
                createCall(call)
            })
            socket.on("user-connect", value => {
                const call = peer.call(value.id, stream)
                value.id !== undefined && setUser(value => [...value, value.id])
                createCall(call)
            })
        } else {
            createNullStream()
        }
    }

    useEffect(() => {
        const fn = () => {
            var peerJS = new Peer(userId, {
                host: "/",
                port: 3001
            })
            setOldPeer(peerJS)
            peerJS.on("open", () => {
                socket.emit("chatVideo", { idRoom: id, id: userId, g: "a" }, (callback) => {
                    setUser(callback)
                })
            })
            // get user media
            navigator.mediaDevices.getUserMedia({ video: false, audio: mic }).then(stream => {
                plus(peerJS, stream)
            }).catch(err => {
                // if user does not accept to stream then create new null stream
                const audioTrack = createEmptyAudioTrack();
                const stream = new MediaStream([audioTrack]);
                let none = true
                plus(peerJS, stream, none)
            })
        }
        fn()
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
                    <SendOutlinedIcon />
                </button>
            </form>
            <div className="call_div_container">
                <SimpleMenu onClick={(value) => props.onClick(value)} />
                <div className="main_mic">
                    <p>Voice Chat</p>
                    <div className="user_device">
                        <img
                            alt="demom"
                            style={talk === true ? { border: "2px solid rgba(46, 229, 157, 0.4)" } : {}}
                            src="../demo.jpeg"></img>
                        <div className="icon_device">
                            {audio}
                            <IconButton onClick={(e) => handleSetMic()}>
                                {mic === true ? <MicIcon /> : <MicOffIcon />}
                            </IconButton>
                            <IconButton onClick={(e) => handleSetVolumn()}>
                                {volumn === false ? talk === true ? <VolumeUpIcon /> : <VolumeMuteIcon /> : <VolumeOffIcon />}
                            </IconButton>
                        </div>
                    </div>
                    {
                        audio.length > 0 ? audio.map(function (value, i) {
                            return <div className="user_device" key={i}>
                                <img
                                    alt="demom"
                                    style={talk === true ? { border: "2px solid rgba(46, 229, 157, 0.4)" } : {}}
                                    src="../demo.jpeg"></img>
                                <div className="icon_device">
                                    {value}
                                    <IconButton onClick={(e) => handleSetVolumn(i)}>
                                        {mic === true ? <MicIcon /> : <MicOffIcon />}
                                    </IconButton>
                                    <IconButton onClick={(e) => handleSetMic(i)}>
                                        {volumn === false ? talk === true ? <VolumeUpIcon /> : <VolumeMuteIcon /> : <VolumeOffIcon />}
                                    </IconButton>
                                </div>
                            </div>
                        }) : console.log()
                    }

                </div>
            </div>
        </div >
    )
}
export default ChatGroup