import React, { useContext, useEffect, useState } from 'react'
import Peer from 'peerjs'
import { getCookie } from '../../helpers/auth'
import { PeerJS } from '../../userContext'
// This function is use for send and view message
import ChatCouple from "./miniChatCom/chatCouple"
import ChatGroup from './miniChatCom/chatGroup'

function SendContact(props) {
    const { peer, setPeer } = useContext(PeerJS)
    const [open, setOpen] = useState(false)
    let id = getCookie().token

    useEffect(() => {
        open === true && setOpen(false)
        return () => { }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.id])

    useEffect(() => {
        let fnc = () => {
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
            setOpen(true)
            newNull()
            let peerJS = createPeer()
            peerJS && setPeer(peerJS)
        }
        open === false && fnc()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open])
    return (
        <>
            {open === true ? props.id[props.id.length - 1] === "g" ?
                <ChatGroup onClick={(value) => props.onClick(value)} peerJS={peer} id={props.id} socket={props.socket} /> :
                <ChatCouple onClick={(value) => props.onClick(value)} peerJS={peer} id={props.id} socket={props.socket} /> :
                console.log()
            }
        </>
    )
}

export default SendContact