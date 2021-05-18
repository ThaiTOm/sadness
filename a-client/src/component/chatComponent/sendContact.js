import React, { useState, useContext } from 'react'
import { PeerJS } from '../../userContext'
// This function is use for send and view message
import ChatCouple from "./miniChatCom/chatCouple"
import ChatGroup from './miniChatCom/chatGroup'


function SendContact(props) {
    const value = useContext(PeerJS)
    return (
        <>
            {value ?
                props.id[props.id.length - 1] === "g" ?
                    <ChatGroup onClick={(value) => props.onClick(value)} peerJS={value} id={props.id} socket={props.socket} /> :
                    <ChatCouple onClick={(value) => props.onClick(value)} peerJS={value} id={props.id} socket={props.socket} />
                :
                console.log()
            }
        </>
    )
}

export default SendContact