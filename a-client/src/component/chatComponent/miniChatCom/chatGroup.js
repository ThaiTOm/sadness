import React, { useState, useEffect } from 'react'
import { getCookie } from '../../../helpers/auth';
import socketApp from '../../../socket';
import IconButton from '@material-ui/core/IconButton';
import "../../style/call.css"
import VolumeMuteIcon from '@material-ui/icons/VolumeMute';
import VolumeUpIcon from '@material-ui/icons/VolumeUp';
import VolumeOffIcon from '@material-ui/icons/VolumeOff';
import { createEmptyAudioTrack } from '../../../helpers/message/audio';
import SimpleMenu from '../miniChatCom/simpleMenu';
import MicIcon from '@material-ui/icons/Mic';
import MicOffIcon from '@material-ui/icons/MicOff';
import hark from "hark"
import RenderChat from '../renderChat';

// This function is use for send and view message
function ChatGroup(props) {
    const userId = getCookie().token;
    let socket = socketApp.getSocket();
    const { id, peerJS } = props;
    const [audio, setAudio] = useState([]);
    const [mic, setMic] = useState(false)
    const [volumn, setVolumn] = useState(false)
    const [oldPeer, setOldPeer] = useState(null)
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
            let arr = []
            for await (let data of audio) {
                // copy old object
                let value = Object.assign({}, data.stream.props, { seleted: false, writeable: true })
                let old = Object.assign({}, data.stream, { writeable: true, seleted: false })
                value.muted = !volumn
                // delete specific key
                delete value["seleted"]
                delete value["writeable"]
                old.props = value
                delete old["seleted"]
                delete old["writeable"]
                // create new object
                // to handle new data
                let obj = {
                    stream: old,
                    audio: data.audio,
                    mic: false
                }
                arr.push(obj)
            }
            setAudio(arr)
        }
    }
    // Turn on or turn off the own mic
    const handleSetMic = () => {
        setMic(!mic)
        if (mic === true) {
            const audioTrack = createEmptyAudioTrack();
            let data = oldPeer.connections
            for (let i = 0; i < audio.length; i++) {
                let userMic = Object.keys(data)[i]
                let sender = data[userMic][0].peerConnection.getSenders()[0] || []
                sender.replaceTrack(audioTrack)
            }
        }
        // else reconnect peer to peer 
        else {
            navigator.mediaDevices.getUserMedia({ video: false, audio: true }).then(stream => {
                let data = oldPeer.connections
                for (let i = 0; i < audio.length; i++) {
                    let userMic = Object.keys(data)[i]
                    let sender = data[userMic][0].peerConnection.getSenders()[0]
                    sender.replaceTrack(stream.getAudioTracks()[0])
                }
            }).catch(err => {
            })
        }
    }
    const handleSetVolumnOther = (value, i) => {
        // get id the user want to muted
        let idMuted = Object.keys(oldPeer.connections)[i]
        let sender = oldPeer.connections[idMuted][0].peerConnection.getSenders()[0] || []
        const returnAudio = (stream, streamNull) => {
            let a = (
                <audio ref={audio => audio ? audio.srcObject = stream : streamNull} playsInline autoPlay />
            )
            let obj = {
                stream: a,
                audio: false,
                mic: true
            }
            let arr = [...audio]
            arr[i] = obj
            setAudio(arr)
        }
        if (value.audio === true) {
            let audioTrack = createEmptyAudioTrack()
            sender.replaceTrack(audioTrack)
            const streamNull = new MediaStream([audioTrack]);
            returnAudio(streamNull, streamNull)
        } else {
            navigator.mediaDevices.getUserMedia({ video: false, audio: true }).then(stream => {
                sender.replaceTrack(stream.getAudioTracks()[0])
                returnAudio(stream, createNullStream())
            })
        }
    }
    const handleSetMicOther = (data, i) => {
        if (audio.length !== 0) {
            // copy old object
            let value = Object.assign({}, data.stream.props, { seleted: false, writeable: true })
            let old = Object.assign({}, data.stream, { writeable: true, seleted: false })
            value.muted = !volumn
            // delete specific key
            delete value["seleted"]
            delete value["writeable"]
            old.props = value
            delete old["seleted"]
            delete old["writeable"]
            // create new object
            // to handle new data
            let arr = [...audio]
            let obj = {
                stream: old,
                audio: data.audio,
                mic: false
            }
            arr[i] = obj
            setAudio(arr)
        }
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
    // fisrt route of connect peer to peer 
    const plus = (peer, stream) => {
        // check if that peer is destroyed or not destroy that mean that was created before
        if (peer.destroyed === false) {
            // run normally
            peer.on("call", call => {
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
            setOldPeer(peerJS)
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
            <RenderChat id={props.id} userId={userId} socket={socket} />
            <div className="call_div_container">
                <SimpleMenu onClick={(value) => props.onClick(value)} />
                <div className="main_user">
                    <p>Thành viên</p>
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
                    <p onClick={handleOpenAccor} className={accor === true ? "accordion active" : "accordion"}>Voice Chat</p>
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
        </div >
    )
}
export default ChatGroup