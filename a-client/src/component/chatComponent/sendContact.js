import React, { useState, useEffect } from 'react'
import { getCookie } from '../../helpers/auth';
// This function is use for send and view message
import ChatCouple from "./miniChatCom/chatCouple"
import ChatGroup from './miniChatCom/chatGroup'
import Peer from "peerjs"

function SendContact(props) {
    const [peer, setPeer] = useState(null)
    const userId = getCookie().token;
    let newNull = () => {
        peer.destroy()
    }
    let createPeer = () => {
        var peerJS = new Peer(userId, {
            host: "/",
            port: 2704,
            path: "/peerjs"
        })
        return peerJS
    }
    useEffect(() => {
        peer && newNull()
        let peerJS = createPeer()
        setPeer(peerJS)
    }, [props.id])

    return (
        <>
            {peer ?
                props.id[props.id.length - 1] === "a" ?
                    <ChatCouple onClick={(value) => props.onClick(value)} peerJS={peer} id={props.id} /> :
                    <ChatGroup onClick={(value) => props.onClick(value)} peerJS={peer} id={props.id} /> :
                console.log()
            }
        </>
    )
}

export default SendContact