import React, { useState, useEffect } from 'react'
import Chat from '../chatComponent/chat.js';
import SimpleMenu from '../chatComponent/miniChatCom/simpleMenu.js';
import { Link, useHistory } from 'react-router-dom';
import MessageIcon from '@material-ui/icons/Message';
import HomeIcon from '@material-ui/icons/Home';
import ContactContain from '../chatComponent/miniChatCom/contactContain.js';
import { getCookie } from '../../helpers/auth.js';
import axios from "axios"
import SendContact from '../chatComponent/sendContact.js';
import PolicyOutlinedIcon from '@material-ui/icons/PolicyOutlined';
import DynamicFeedOutlinedIcon from '@material-ui/icons/DynamicFeedOutlined';
import ContactSupportOutlinedIcon from '@material-ui/icons/ContactSupportOutlined';

function Main_page() {
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
        sessionStorage.removeItem(id)
    }
    return (
        <div className="main_page_auth">
            <header>
                <div className="navbar_auth">
                    <SimpleMenu onClick={(value) => hanldeSetRoom("")} id={room + ";" + user} />
                    <p> {name} </p>

                </div>
            </header>
            <div className="container">
                <div className="navbar_right">
                    <ul >
                        <li className="inner_title">
                            <Link className="message_icon" to="/">
                                <MessageIcon />
                            </Link>
                            <span className="title" id="m_title">
                                Tin nhắn
                            </span>
                        </li>
                        <li className="inner_title">
                            <Link className="home_icon icon_nav" to="/news">
                                <HomeIcon />
                            </Link>
                            <span className="title" id="h_title">
                                Trang chủ
                            </span>
                        </li>
                        <li className="inner_title">
                            <Link className="feedback_icon icon_nav" to="/feedback">
                                <DynamicFeedOutlinedIcon />
                            </Link>
                            <span className="title" id="f_title">
                                Góp ý và cải thiện
                            </span>
                        </li>
                        <li className="inner_title">
                            <Link className="contact_icon icon_nav" to="/help">
                                <ContactSupportOutlinedIcon />
                            </Link>
                            <span className="title" id="c_title">
                                Trợ giúp
                            </span>
                        </li>
                        <li className="inner_title">
                            <Link className="policy_icon icon_nav" to="/policy">
                                <PolicyOutlinedIcon />
                            </Link>
                            <span className="title" id="p_title">
                                Điều khoản và dịch vụ
                            </span>
                        </li>
                    </ul>
                </div>
                {
                    // id room id not exists than render chat component
                    room ? <SendContact id={room} name={(value) => setName(value)} /> : <Chat />
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
