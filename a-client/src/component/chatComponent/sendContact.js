import React from 'react'
// This function is use for send and view message
import ChatCouple from "./miniChatCom/chatCouple"
import ChatGroup from './miniChatCom/chatGroup'
function SendContact(props) {
    return (
        <>
            {props.id[props.id.length - 1] === "a" ?
                < ChatCouple onClick={(value) => props.onClick(value)} id={props.id} /> :
                <ChatGroup onClick={(value) => props.onClick(value)} id={props.id} />}
        </>
    )
}

export default SendContact