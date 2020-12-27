import React, { useState, useEffect } from 'react'
import Chat from '../chatComponent/chat.js';
import SimpleMenu from '../chatComponent/miniChatCom/simpleMenu.js';
import { Link,useHistory } from 'react-router-dom';
import MessageIcon from '@material-ui/icons/Message';
import HomeIcon from '@material-ui/icons/Home';
import HelpIcon from '@material-ui/icons/Help';
import ContactContain from '../chatComponent/miniChatCom/contactContain.js';
import { getCookie } from '../../helpers/auth.js';
import axios from "axios"
import SendContact from '../chatComponent/sendContact.js';

function Main_page() {
    const history = useHistory()
    const [room, setRoom] = useState("");
    const [open, setOpen] = useState(true);
    const closeNavbar = (e) => {
        setOpen(!open)
    }
    const id = getCookie().token;
    const [start, setStart] = useState(0);
    const [end, setEnd] = useState(10);
    //value contain the messag last and id of 2 people
    const [value, setValue] = useState([]);
    const [name, setName] = useState("Recal")
    // user contain 2 user 
    const [user, setUser] = useState("")
    useEffect(() => {
        axios.post("http://localhost:2704/api/msgC/contactL?start=" + start + "&end=" + end, { id })
            .then(res => {
                if(res.data.message){
                    history.push("/report")
                }else{
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
            {/* <ChatComponent /> */}
            <header>
                <div className="navbar_auth">
                    <SimpleMenu onClick={(value) => hanldeSetRoom("")} id={room + ";" + user} />
                    <p> {name} </p>

                </div>
            </header>
            <div className="container">
                <div className="navbar_right"
                    style={open === true ? { width: "15%" } :
                        { overflowY: "hidden", width: "0px" }}
                >
                    <div
                        onClick={closeNavbar}
                        id="triangle-right"
                        style={open === true ?
                            { left: "185px" } :
                            { left: "0", borderLeft: "20px solid yellow", borderRight: "0" }}>
                    </div>
                    <ul >
                        <li >
                            <MessageIcon />
                            <Link to="/">Trò chuyện</Link>
                        </li>
                        <li>
                            <HomeIcon />
                            <Link to="/news">Trang chủ</Link>
                        </li>
                        {/* <li>
                            <HelpIcon />
                            <Link to="/rule">Thông báo</Link>
                        </li> */}
                        <li>
                            <HelpIcon />
                            <Link to="/friend">Bạn bè</Link>
                        </li>
                        <li>
                            <HelpIcon />
                            <Link to="/news">Cài đặt</Link>
                        </li>
                        <li>
                            <HelpIcon />
                            <Link to="/news">Hỗ trợ</Link>
                        </li>
                        <li>
                            <HelpIcon />
                            <Link to="/news">Điều khoản </Link>
                        </li>
                    </ul>
                </div>
                {
                    // id room id not exists than render chat component
                    room ? <SendContact id={room} name={(value) => setName(value)} /> : <Chat />
                }
                <div className="contact" style={open === true ? { width: "20%" } : { width: "35%" }}>
                    {
                        // if value have then we can use this 
                        value.length > 0 ?
                            value[0].map((val, i) => <div key={i}><ContactContain onClick={(value) => hanldeSetRoom(value)} message={val[2]} user1={val[0]} user2={val[1]} idRoom={val[3]} /></div>)
                            : console.log()
                    }
                </div>
            </div>
        </div >
    )
}

export default Main_page
