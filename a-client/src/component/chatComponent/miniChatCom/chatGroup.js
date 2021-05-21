import React, { useState, useEffect } from 'react'
import { getCookie } from '../../../helpers/auth';
import socketApp from '../../../socket';
import IconButton from '@material-ui/core/IconButton';
import "../../../assets/style/call.css"
import VolumeMuteIcon from '@material-ui/icons/VolumeMute';
import VolumeUpIcon from '@material-ui/icons/VolumeUp';
import VolumeOffIcon from '@material-ui/icons/VolumeOff';
import { createEmptyAudioTrack } from '../../../helpers/message/audio';
import SimpleMenu from '../miniChatCom/simpleMenu';
import MicIcon from '@material-ui/icons/Mic';
import MicOffIcon from '@material-ui/icons/MicOff';
import hark from "hark"
import RenderChat from '../renderChat';
import { setMicOwn, setVolumnOther, setVolumnOwn, setMicOther } from '../../../helpers/main/PeerMany';

// This function is use for send and view message
function ChatGroup(props) {
    const userId = getCookie().token;
    let socket = socketApp.getSocket();
    const { id, peerJS } = props;
    const [audio, setAudio] = useState([]);
    const [mic, setMic] = useState(false)
    const [volumn, setVolumn] = useState(false)
    const [talk, setTalk] = useState(false)
    const [accor, setAccor] = useState(false)

    const handleOpenAccor = () => {
        setAccor(!accor)
    }
    // turn on or turn off own volumn
    const handleSetVolumn = async () => {
        // does any another user in the room
        if (audio.length !== 0) {
            setVolumn(!volumn)
            let arr = await setVolumnOwn({ audio, volumn })
            setAudio(arr)
        }
    }
    // Turn on or turn off the own mic
    const handleSetMic = () => {
        setMic(!mic)
        return setMicOwn({ mic, oldPeer: peerJS, audio })
    }

    const handleSetVolumnOther = (value, i) => {
        // get id the user want to muted
        let arr = setVolumnOther({ oldPeer: peerJS, i, audio, value })
        setAudio(arr)
    }
    const handleSetMicOther = (data, i) => {
        let arr = setMicOther({ audio, data, volumn, i })
        setAudio(arr)
    }
    // create null stream to handle error 
    let createNullStream = () => {
        let audioStream = () => {
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
        return audioStream()
    }
    // new user go to the room
    const createCall = (call) => {
        call.on("stream", async (userVideoStream) => {
            console.log("stream")
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
                    return <audio playsInline muted={false} ref={audio => audio ? audio.srcObject = userVideoStream : streamNull} autoPlay />
                } catch (error) {
                    let a = createNullStream()
                    let obj = {
                        stream: a,
                        audio: false,
                        mic: false
                    }
                    setAudio(value => [...value, obj])
                }
            }
            let a = await audioStream()
            let obj = {
                stream: a,
                audio: true,
                mic: true
            }
            setAudio(value => [...value, obj])
        })
    }
    // fisrt  connect peer to peer 
    const plus = (peer, stream) => {
        // check if that peer is destroyed or not destroy that mean that was created before
        if (peer.destroyed === false) {
            // run normally
            peer.on("call", call => {
                console.log("call")
                call.answer(stream)
                createCall(call)
            })
            // recieve from server
            socket.on("user-connect", value => {
                if (value.idRoom === id) {
                    const call = peer.call(value.id, stream)
                    createCall(call)
                }
            })
        }
    }
    useEffect(() => {
        const fn = () => {
            socket.emit("chatVideo", { idRoom: id, id: userId, g: "a" }, (callback) => { })

            peerJS.on("open", () => {
                socket.emit("chatVideo", { idRoom: id, id: userId, g: "a" }, (callback) => { })
            })
            // get user media
            navigator.mediaDevices.getUserMedia({ video: false, audio: mic }).then(stream => {
                plus(peerJS, stream)
            }).catch(err => {
                // if user does not accept to stream then create new null stream
                const audioTrack = createEmptyAudioTrack();
                const stream = new MediaStream([audioTrack]);
                plus(peerJS, stream)
            })
        }
        fn()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return (
        <div className="message_container">
            <div className="call_div_container">
                <SimpleMenu onClick={(value) => props.onClick(value)} />
                <div className="main_user">
                    <strong style={{ color: "white" }}>Thành viên</strong>
                    <div className="user_device">

                    </div>
                </div>
                <div className="main_mic">
                    <div className="user_device">
                        <img
                            alt="demom"
                            style={talk === true ? { border: "2px solid rgba(46, 229, 157, 0.4)" } : {}}
                            src="../demo.jpeg"></img>
                        <div className="icon_device">
                            <IconButton onClick={(e) => handleSetMic()}>
                                {mic === true ? <MicIcon /> : <MicOffIcon />}
                            </IconButton>
                            <IconButton onClick={(e) => handleSetVolumn()}>
                                {volumn === false ? talk === true ? <VolumeUpIcon /> : <VolumeMuteIcon /> : <VolumeOffIcon />}
                            </IconButton>
                        </div>
                    </div>
                    <div onClick={handleOpenAccor} className={accor === true ? "cA accordion active" : "accordion cA"}>
                        <section className="cA">
                            <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                                viewBox="0 0 512 512" xmlSpace="preserve">
                                <g>
                                    <g>
                                        <path d="M155.327,57.142c-51.531,0-93.454,44.45-93.454,99.086c0,54.636,41.923,99.086,93.454,99.086s93.455-44.45,93.455-99.086
			C248.782,101.592,206.859,57.142,155.327,57.142z"/>
                                    </g>
                                </g>
                                <g>
                                    <g>
                                        <path d="M367.798,71.321c-0.211,0-0.425,0.001-0.636,0.002c-21.626,0.179-41.826,9.31-56.878,25.713
			c-14.788,16.113-22.829,37.37-22.644,59.854c0.186,22.484,8.577,43.605,23.628,59.473c15.17,15.991,35.265,24.773,56.651,24.773
			c0.215,0,0.43-0.001,0.646-0.002c21.626-0.179,41.826-9.311,56.878-25.713c14.788-16.113,22.829-37.37,22.644-59.855
			C447.702,108.972,411.747,71.321,367.798,71.321z"/>
                                    </g>
                                </g>
                                <g>
                                    <g>
                                        <path d="M371.74,257.358h-7.76c-36.14,0-69.12,13.74-94.02,36.26c6.23,4.78,12.16,9.99,17.78,15.61
			c16.58,16.58,29.6,35.9,38.7,57.42c8.2,19.38,12.88,39.8,13.97,60.83H512v-29.87C512,320.278,449.08,257.358,371.74,257.358z"/>
                                    </g>
                                </g>
                                <g>
                                    <g>
                                        <path d="M310.35,427.478c-2.83-45.59-25.94-85.69-60.43-111.39c-25.09-18.7-56.21-29.77-89.92-29.77h-9.34
			C67.45,286.319,0,353.768,0,436.978v17.88h310.65v-17.88C310.65,433.788,310.55,430.618,310.35,427.478z"/>
                                    </g>
                                </g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg>
                            <p >Voice Chat</p>
                        </section>
                    </div>
                    <div style={accor === true ? { maxHeight: "200px" } : { maxHeight: null }} className="panel">
                        {
                            audio.length > 0 ? audio.map(function (value, i) {
                                return <div className="user_device" key={i}>
                                    <img
                                        alt="demom"
                                        style={talk === true ? { border: "2px solid rgba(46, 229, 157, 0.4)" } : {}}
                                        src="../demo.jpeg"></img>
                                    <div className="icon_device">
                                        {value.stream}
                                        {value.mic}
                                        <IconButton onClick={(e) => handleSetMicOther(value, i)}>
                                            {value.mic === true ? <MicIcon /> : <MicOffIcon />}
                                        </IconButton>
                                        <IconButton onClick={(e) => handleSetVolumnOther(value, i)}>
                                            {value.audio === true ? talk === true ? <VolumeUpIcon /> : <VolumeMuteIcon /> : <VolumeOffIcon />}
                                        </IconButton>
                                    </div>
                                </div>
                            }) : console.log()
                        }
                    </div>
                </div>
            </div>
            <div className="message_container_div">
                <RenderChat id={props.id} userId={userId} socket={socket} />
            </div>
        </div >
    )
}
export default ChatGroup