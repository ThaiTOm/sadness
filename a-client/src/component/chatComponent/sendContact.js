import Peer from 'peerjs'
import React, { useContext, useEffect } from 'react'
import { getCookie } from '../../helpers/auth'
import { PeerJS } from '../../userContext'
// This function is use for send and view message
import ChatCouple from "./miniChatCom/chatCouple"
import ChatGroup from './miniChatCom/chatGroup'


function SendContact(props) {
    const { peer, setPeer } = useContext(PeerJS)
    let id = getCookie().token
    useEffect(() => {
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
        newNull()
        let peerJS = createPeer()
        peerJS && setPeer(peerJS)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.id])
    console.log(peer)
    return (
        <>
            {peer ?
                props.id[props.id.length - 1] === "g" ?
                    <ChatGroup onClick={(value) => props.onClick(value)} peerJS={peer} id={props.id} socket={props.socket} /> :
                    <ChatCouple onClick={(value) => props.onClick(value)} peerJS={peer} id={props.id} socket={props.socket} />
                :
                console.log()
            }
        </>
    )
}

export default SendContact