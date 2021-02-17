import React, { useState, useEffect, useRef } from 'react'
import socketApp from '../../socket';
import Peer from "simple-peer"

function ChatGroup() {
    const [stream, setStream] = useState(null)
    let socket = socketApp.getSocket();
    const [a, setA] = useState(null)
    const [user, setUser] = useState(null)
    let UserVideo = useRef()
    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(streamVideo => {
            const peer = new Peer({
                initiator: true,
                trickle: false,
                stream: streamVideo
            })
            // setUser(y)
            peer.on("signal", data => {
                socket.emit("test", { data: data, stream })
            })
            peer.on("stream", value => {
                setStream("ok")
                if (UserVideo.current) {
                    UserVideo.current.srcObject = value
                }
            })
        })
    }, [])

    socket.on("x", valu => {
        let { data, stream } = valu
        let peer1 = new Peer({
            initiator: true,
            trickle: false,
            stream
        })
        console.log(data)
        peer1.signal(data)
    })
    socket.on("ok", data => {
        let value = data.data
        const newPeer = new Peer()
        newPeer.signal(value)
        newPeer.on("stream", gg => {
            setStream("ok")
            if (UserVideo.current) {
                console.log(gg)
                UserVideo.current.srcObject = gg
            }
        })
    })
    let userVideo
    if (stream) {
        userVideo = (
            <video playsInline ref={UserVideo} autoPlay />
        )
    }
    return (
        <div>
            {/* {a} */}
            {userVideo}
        </div>
    )
}

export default ChatGroup
