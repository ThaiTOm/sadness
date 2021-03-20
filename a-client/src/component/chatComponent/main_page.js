import React, { useState, useEffect } from 'react'
import Chat from './chat.js';
import { useHistory } from 'react-router-dom';
import ContactContain from './miniChatCom/contactContain.js';
import { getCookie } from '../../helpers/auth.js';
import axios from "axios"
import SendContact from './sendContact.js';
import { HeaderPage, NavbarRight } from '../../helpers/news.js';
import socketApp from '../../socket.js';
var socket = socketApp.getSocket();

function Main_page() {
    const history = useHistory()
    const [room, setRoom] = useState("");
    const id = getCookie().token;
    const [start, setStart] = useState(0);
    const [end, setEnd] = useState(10);
    const [change, setChange] = useState(null)
    //value contain Rooms
    const [value, setValue] = useState(null);
    const [name, setName] = useState("Recal")
    // user contain 2 user 
    const [user, setUser] = useState("")

    useEffect(() => {
        axios.post("http://localhost:2704/api/msgC/contactL?start=" + start + "&end=" + end, { id })
            .then(res => {
                if (res.data.message) {
                    history.push("/report")
                } else {
                    setValue(res.data)
                }
            }).catch(err => {
            })

    }, [start])

    useEffect(() => {
        let func = () => {
            let arr = [...value]
            socket.on("message", msgs => {
                if (msgs.type === "message") {
                    for (let i = 0; i < arr.length; i++) {
                        if (arr[i].idRoom === msgs.idRoom && i !== 0) {
                            arr.splice(i, 1)
                            arr.unshift(msgs)
                            setChange(null)
                            return setValue(arr)
                        }
                    }
                    // if the position of all value is not change
                    return setChange("abc")
                }
            })
        }
        value ? func() : console.log()
    })
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
                        /> :
                        <Chat />
                }
                <div className="contact">
                    {
                        // if value have then we can use this 
                        value && value.length > 0 ? value.map((val, i) => <div key={i}>
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