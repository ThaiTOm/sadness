import React, { useState, useContext } from 'react'
import Chat from './chat.js';
import ContactContain from './miniChatCom/contactContain.js';
import SendContact from './sendContact.js';
import { HeaderPage, NavbarRight } from '../../helpers/news/news.js';
import { MessageList } from '../../userContext.js';
import socketApp from '../../socket.js';
import { getCookie } from '../../helpers/auth.js';

function Main_page() {
    const socket = socketApp.getSocket();
    const cookieId = getCookie().token;
    const { listMessage } = useContext(MessageList)
    const [find, setFind] = useState(null)
    const [room, setRoom] = useState("");
    //value contain Rooms
    // const [name, setName] = useState("Recal")
    // user contain 2 user 
    // const [user, setUser] = useState("")

    const hanldeSetRoom = value => {
        let id = value.split(",")
        setRoom(id[0])
        // setUser(id[1])
    }

    const handleStopFind = () => {
        socket.emit("outJoinChat", { id: cookieId })
    }
    return (
        <div className="main_page_auth" onClick={e => find && handleStopFind()}>
            <HeaderPage />
            <div className="container">
                <NavbarRight />
                {
                    // id room id not exists than render chat component
                    room ?
                        <SendContact
                            socket={socket}
                            onClick={(value) => hanldeSetRoom(value)}
                            id={room}
                        // name={(value) => setName(value)}
                        /> : <Chat handleRoom={value => setFind(value)} />
                }
                <div className="contact">
                    {
                        // if value have then we can use this 
                        listMessage && listMessage.length > 0 ? listMessage.map((val, i) => <div key={i}>
                            <ContactContain
                                socket={socket}
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