import React, { useState, useEffect, useContext } from 'react'
import Chat from './chat.js';
import ContactContain from './miniChatCom/contactContain.js';
import SendContact from './sendContact.js';
import { HeaderPage, NavbarRight } from '../../helpers/news.js';
import socketApp from '../../socket.js';
import { MessageList } from '../../userContext.js';

function Main_page() {
    const { listMessage, setListMessage } = useContext(MessageList)
    var socket = socketApp.getSocket();
    const [room, setRoom] = useState("");
    const [change, setChange] = useState(null)
    //value contain Rooms
    const [name, setName] = useState("Recal")
    // user contain 2 user 
    const [user, setUser] = useState("")

    const hanldeSetRoom = value => {
        let id = value.split(",")
        setRoom(id[0])
        setUser(id[1])
    }
    return (
        <div className="main_page_auth">
            <HeaderPage />
            <div className="container">
                <NavbarRight />
                {
                    // id room id not exists than render chat component
                    room ?
                        <SendContact
                            onClick={(value) => hanldeSetRoom(value)}
                            id={room}
                            name={(value) => setName(value)}
                        /> : <Chat />
                }
                <div className="contact">
                    {
                        // if value have then we can use this 
                        listMessage && listMessage.length > 0 ? listMessage.map((val, i) => <div key={i}>
                            <ContactContain
                                change={change}
                                onClick={(value) => hanldeSetRoom(value)}
                                message={val.data}
                                users={val.user}
                                idRoom={val.idRoom}
                                target={room}
                                nread={val.nread}
                            />
                        </div>) : console.log()
                    }
                </div>
            </div>
        </div >
    )
}

export default Main_page