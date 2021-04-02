import React, { useState, useEffect } from 'react'
import { getCookie } from '../../../helpers/auth';
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
function ChatCouple(props) {
    const userId = getCookie().token;
    const { id, peerJS, socket } = props;
    const [audio, setAudio] = useState(null);
    const [mic, setMic] = useState(false)
    const [volumn, setVolumn] = useState(false)
    const [user, setUser] = useState(null)
    const [talk, setTalk] = useState(false)
    const [accor, setAccor] = useState(false)

    const handleOpenAccor = () => {
        setAccor(!accor)
    }

    const handleSetVolumn = () => {
        if (audio) {
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

    const handleSetMic = () => {
        // if value send from server is only one person return that else do another
        let userMic = typeof user === "string" ? user : user[0] === userId ? user[1] : user[0]
        try {
            if (mic === true) {
                const audioTrack = createEmptyAudioTrack();
                let data = peerJS.connections
                let sender = data[userMic][0].peerConnection.getSenders()[0]
                sender.replaceTrack(audioTrack)
            }
            else {
                navigator.mediaDevices.getUserMedia({ video: false, audio: true }).then(stream => {
                    let data = peerJS.connections
                    let sender = data[userMic][0].peerConnection.getSenders()[0]
                    sender.replaceTrack(stream.getAudioTracks()[0])
                }).catch(err => {
                })
            }
        } catch (error) {
        }
        setMic(!mic)
    }

    let createNullStream = async () => {
        let audioStream = async () => {
            try {
                const audioTrack = createEmptyAudioTrack();
                const streamNull = new MediaStream([audioTrack]);
                audioStream = (
                    <audio muted={true} ref={audio => audio.srcObject = streamNull} playsInline autoPlay />
                )
            } catch (error) {
                return
            }
        }
        let a = await audioStream()
        setAudio(a)
    }

    const createCall = (call) => {
        call.on("stream", async (userVideoStream) => {
            let audioStream = async () => {
                const audioTrack = createEmptyAudioTrack();
                const streamNull = new MediaStream([audioTrack]);
                let speechEvents = hark(userVideoStream, {})
                speechEvents.on('speaking', function () {
                    setTalk(true)
                });
                speechEvents.on('stopped_speaking', function () {
                    setTalk(false)
                });
                try {
                    return <audio playsInline muted={false} ref={audio => audio ? audio.srcObject = userVideoStream : streamNull
                    } autoPlay />
                } catch (error) {
                    createNullStream()
                }
            }
            let a = await audioStream()
            setAudio(a)
        })
    }

    const plus = (peer, stream) => {
        // check if that peer is destroyed or not destroy that mean that was created before
        if (peer.destroyed === false) {
            // run normally
            peer.on("call", call => {
                call.answer(stream)
                createCall(call)
            })
            socket.on("user-connect", value => {
                if (value.idRoom === id) {
                    console.log(id)
                    const call = peer.call(value.id, stream)
                    setUser(value.id)
                    createCall(call)
                }

            })
        } else {
            createNullStream()
        }
    }

    // if we join another room then delete old peer connections 

    useEffect(() => {
        let fnc = () => {
            peerJS.on("open", () => {
                socket.emit("chatVideo", { idRoom: id, id: userId, g: null }, (callback) => {
                    setUser(callback)
                })
            })
            // get user media
            navigator.mediaDevices.getUserMedia({ video: false, audio: false }).then(stream => {
                plus(peerJS, stream)
            }).catch(err => {
                // if user does not accept to stream then create new null stream
                const audioTrack = createEmptyAudioTrack();
                const stream = new MediaStream([audioTrack]);
                plus(peerJS, stream)
            })
        };
        fnc();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div className="message_container">
            <div className="call_div_container">
                <SimpleMenu onClick={(value) => props.onClick(value)} />
                <div className="main_mic">
                    <p onClick={handleOpenAccor} className={accor === true ? "accordion active" : "accordion"}>Voice Chat</p>
                    <div style={accor === true ? { maxHeight: "200px" } : { maxHeight: null }} className="panel">
                        <div className="user_device">
                            <img
                                alt="demom"
                                src="../demo.jpeg"></img>
                            <div className="icon_device">
                                {audio}
                                <IconButton onClick={(e) => handleSetMic(!mic)}>
                                    {mic === true ? <MicIcon /> : <MicOffIcon />}
                                </IconButton>
                                <IconButton onClick={(e) => handleSetVolumn()}>
                                    {volumn === false ? talk === true ? <VolumeUpIcon /> : <VolumeMuteIcon /> : <VolumeOffIcon />}
                                </IconButton>
                            </div>
                        </div>
                    </div>
                    {
                        audio ? <div className="user_device">
                            <img
                                alt="avatar"
                                style={talk === true ? { border: "2px solid rgba(46, 229, 157, 0.4)" } : {}}
                                src="../demo.jpeg"></img>
                            <div className="icon_device">
                                {audio}
                                <IconButton onClick={(e) => handleSetVolumn()}>
                                    {volumn === false ? talk === true ? <VolumeUpIcon /> : <VolumeMuteIcon /> : <VolumeOffIcon />}
                                </IconButton>
                            </div>
                        </div> : <></>
                    }
                </div>
            </div>
            <div className="message_container_div">
                <RenderChat id={id} userId={userId} socket={socket} />
            </div>
        </div >
    )
}
export default ChatCouple