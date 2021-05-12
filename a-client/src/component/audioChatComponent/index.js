import React, { useState, useEffect } from 'react'
import { NavbarRight } from '../../helpers/news/news'
import "../../assets/style/audioChat.css"
import ButtonCreate from './buttonCreate'
import { getCookie } from '../../helpers/auth'
import socketApp from '../../socket'
import RenderRooms from './renderRooms'
import Peer from "peerjs"


function ChatAudioCom() {
    const [peer, setPeer] = useState(null)

    const id = getCookie().token
    let socket = socketApp.getSocket();

    let newNull = () => {
        peer.destroy()
    }
    let createPeer = () => {
        var peerJS = new Peer(id, {
            host: "/",
            port: 2704,
            path: "/peerjs"
        })
        return peerJS
    }
    useEffect(() => {
        // peer die then reconnect
        peer && newNull()
        let peerJS = createPeer()
        setPeer(peerJS)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return (
        <div className="audioChat">
            <NavbarRight />
            <ButtonCreate id={id} socket={socket} />
            <RenderRooms peer={peer} />
        </div>
    )
}

export default ChatAudioCom
