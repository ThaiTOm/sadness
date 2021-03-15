import React, { useEffect, useState } from 'react'
import { decryptWithAES, getCookie } from '../../../helpers/auth';
import classNames from "classnames";
import socketApp from '../../../socket';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

var socket = socketApp.getSocket();

// This function is use for render list of contact

function ContactContain({ onClick, message, users, idRoom, target, nread }) {
    // msg == new message send by real time, message == old message 
    const [read, setRead] = useState(false);
    const [active, setActive] = useState(false);
    const [value, setValue] = useState("");
    const [count, setCount] = useState(nread)
    const [anchorEl, setAnchorEl] = useState(null);
    // the user in the room is online or not
    const [onl, setOnl] = useState(null)
    // lu last user, clu contain last user and message
    const id = getCookie().token;
    let lu;
    //this message is last message when not online
    let sliceMess = (a, user) => {
        if (a.length > 0) {
            let mess = a.length > 10 ? a.slice(0, 10) + "....." : a
            setValue(user + mess)
        }
        else {
            setValue(user + "đã gửi hình ảnh")
        }
    }
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    const validateImage = (value) => {
        if (value.image) {
            let a = "đã gửi hình ảnh"
            if (value.id === id) sliceMess(a, "Bạn: ")
            else {
                sliceMess(a, "Their: ")
                if (value.seen === "false") {
                    setRead(true)
                }
            }
        } else {
            let a = value.data[0] ? decryptWithAES(value.data[0]) : ""
            if (value.id === id) sliceMess(a, "Bạn: ")
            else {
                sliceMess(a, "Their: ")
                if (value.seen === "false") {
                    setRead(true)
                }
            }
        }
    }
    useEffect(() => {
        socket.on("message", msgs => {
            msgs.idRoom === idRoom && validateImage(msgs)
        })
    }, [message])

    useEffect(() => {
        //message contain when another not sending and that is the last time when message send
        let fnc = () => {
            socket.emit("joinChatBack", { idRoom })
            validateImage(message)
        }
        message && fnc()
    }, [])

    useEffect(() => {
        if (target === idRoom) {
            setActive(true)
            setRead(false)
            setCount(0)
            socket.emit("seenMessage", { id: idRoom, userId: id })
        }
        else {
            setActive(false)
        }
    }, [target, value])
    useEffect(() => {
        for (let value in users) {
            if (value !== id && users[value] === "online") {
                console.log("run")
                setOnl(true)
                break;
            }
        }
    }, [])

    //if last people send is who then assign that
    var classN = classNames({
        "contact_container": true,
        "active_contact": active,
        "not_read_contact": read
    })
    return (
        <div className={classN} >
            <div className="contact_contain_text">
                <div className="setting_chat">
                    <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
                        ...
                    </Button>
                    <Menu
                        className="setting_chat_modal"
                        id="simple-menu"
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                    >
                        <MenuItem onClick={handleClose}>
                            <img alt="out_image" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABmJLR0QA/wD/AP+gvaeTAAAAoklEQVRIie2VQQ6CMBBFn56GhexceQKI9zacgxKNrPAEdVPATKShzLBA+clsOvn/tzPTFnYk4go0gF8YDihjBk4h3kf9KXgQBj7xxFMYdI9GgpPQGlTAK4WQUutb4JyAp8iZGHRB/JuJiYEHWiAP3Ay4LzG4xAgCZ2kwp8lylFXQlujBlpq8+ph6xosm1wf83lvUGGi6WLJE9yfUQGGwyX/CG5rJq/ywf6OxAAAAAElFTkSuQmCC" />
                        Thoát cuộc trò chuyện</MenuItem>
                        <MenuItem onClick={handleClose}>
                            <img alt="delete_icon" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABmJLR0QA/wD/AP+gvaeTAAAAkklEQVRIie2UUQrDIBBEX3OafNhD1Fwsn72fP71Biz2E+dnARoUWbWqLGViQUWcWhxV6wQyEqK7vXDxluFDZzEZzqBTrALkMoDyHRG/3DH7C4AZcgIfinsAEuFJjPVBWOAN4KSOcjc4WGWhBE639JwxWk7PaH4F75lyCZpP81SfaPWQnQrpbL5x7ZXB8Fe0N/h8LhlVEflv4ChYAAAAASUVORK5CYII=" />
                            Xóa cuộc trò chuyện</MenuItem>
                        <MenuItem onClick={handleClose}>
                            <img alt="seen_icon" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABmJLR0QA/wD/AP+gvaeTAAAA1ElEQVRIie3VOwrCQBRA0SvuwJW4AkvRUhHtVCzE1v8fwc4fbsSFuAIXYqNoYiycwCNFJo4TbHLbvJw3DIFA0h/LAal0THgbOAGZOPAW4AIeMLGNNwU+tY03BD6zjdeAp8LntvGqwBe28YrAl2GDWQNcnjwUXwMOUP8CLwMPha90w2M16PD5EnSVBL6JeqKResHVLCkCdzW7jYr7DTVLCgLffYv7DRTwAjoB/Kae7U1xv35gSV7gh19xP3ldxneuq6tgDziaImH/gzNwBS5Az3RBkrY3LltA/9XJVDYAAAAASUVORK5CYII=" />
                            Đánh dấu là đã đọc</MenuItem>
                    </Menu>
                </div>
                <p onClick={() => onClick(idRoom, users, id)}>
                    <span className="content">
                        {value}
                    </span>
                    {count > 0 ? <span className="count"> {count}</span> : ""}
                </p>
                <img onClick={() => onClick(idRoom, users, id)} alt="avatar" src="./demo.jpeg" />
                {onl === true ? <span className="dot"></span> : console.log()}
            </div>
        </div >
    )
}

export default ContactContain
