import React from 'react'
import { NavbarRight } from '../../helpers/news/news'
import "../../assets/style/audioChat.css"
import ButtonCreate from './buttonCreate'
import { getCookie } from '../../helpers/auth'
import socketApp from '../../socket'
import RenderRooms from './renderRooms'

function ChatAudioCom() {

    const id = getCookie().token
    let socket = socketApp.getSocket();

    return (
        <div className="audioChat percent">
            <NavbarRight />
            <ButtonCreate id={id} socket={socket} />
            <RenderRooms />
        </div>
    )
}

export default ChatAudioCom
