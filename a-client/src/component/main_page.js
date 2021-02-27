import React, { useState, useEffect } from 'react'
import Chat from './chatComponent/chat.js';
import SimpleMenu from './chatComponent/miniChatCom/simpleMenu.js';
import { useHistory } from 'react-router-dom';
import ContactContain from './chatComponent/miniChatCom/contactContain.js';
import { getCookie } from '../helpers/auth.js';
import axios from "axios"
import SendContact from './chatComponent/sendContact.js';
import { navbar_right } from '../helpers/message.js';
import socketApp from '../socket.js';


function Main_page() {
    var socket = socketApp.getSocket();
    const history = useHistory()
    const [room, setRoom] = useState("");
    const id = getCookie().token;
    const [start, setStart] = useState(0);
    const [end, setEnd] = useState(10);
    //value contain idRooms
    const [value, setValue] = useState([]);
    const [name, setName] = useState("Recal")
    // user contain 2 user 
    const [user, setUser] = useState("")
    useEffect(() => {
        axios.post("http://localhost:2704/api/msgC/contactL?start=" + start + "&end=" + end, { id })
            .then(res => {
                if (res.data.message) {
                    history.push("/report")
                } else {
                    setValue(val => [...val, res.data])
                }
            }).catch(err => {
            })
    }, [start])
    const hanldeSetRoom = value => {
        let id = value.split(",")
        setRoom(id[0])
        setUser(id[1])
    }

    return (
        <div className="main_page_auth">
            <div className="container">
                {navbar_right}
                {
                    // id room id not exists than render chat component
                    room ? <SendContact onClick={(value) => hanldeSetRoom(null)} id={room} name={(value) => setName(value)} /> : <Chat />
                }
                <div className="contact" >
                    {
                        // if value have then we can use this 
                        value.length > 0 ?
                            value[0].map((val, i) => <div key={i}><ContactContain onClick={(value) => hanldeSetRoom(value)} message={val[2]} user1={val[0]} user2={val[1]} idRoom={val[3]} target={room} /></div>)
                            : console.log()
                    }
                </div>
            </div>
        </div >
    )
}

export default Main_page