import React, { useEffect, useState } from 'react'
import { decryptWithAES, getCookie } from '../../../helpers/auth';
import classNames from "classnames";
import socketApp from '../../../socket';
var socket = socketApp.getSocket();

// This function is use for render list of contact

function ContactContain({ onClick, message, users, idRoom, target, nread }) {
    // msg == new message send by real time, message == old message 
    const [read, setRead] = useState(false);
    const [active, setActive] = useState(false);
    const [value, setValue] = useState("");
    const [count, setCount] = useState(nread)
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
    useEffect(() => {
        socket.on("message", msgs => {
            let fnc = () => {
                // [message, idSend, seen or not]
                lu = msgs.idRoom
                let a = msgs.data.data[0] ? decryptWithAES(msgs.data.data[0]) : ""
                console.log(a, msgs)
                if (lu === id) sliceMess(a, "Bạn: ")
                else {
                    sliceMess(a, "Their: ")
                    // arr[2] contain true or false read
                    if (msgs.seen === "false") {
                        setRead(true)
                    }
                }
            }
            msgs.type === "message" && msgs.idRoom === idRoom && fnc()
        })
    }, [value, message])

    useEffect(() => {
        //message contain when another not sending and that is the last time when message send
        let fnc = () => {
            socket.emit("joinChatBack", { idRoom })
            let a = decryptWithAES(message.data[0])
            if (message.id === id) sliceMess(a, "Bạn: ")
            else {
                sliceMess(a, "Their: ")
                // arr[2] contain true or false read
                if (message.seen === "false") {
                    setRead(true)
                }
            }
        }
        message && fnc()
    }, [value])

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
    //if last people send is who then assign that
    var classN = classNames({
        "contact_container": true,
        "active_contact": active,
        "not_read_contact": read
    })
    return (
        <div className={classN} onClick={() => onClick(idRoom, users, id)}>

            <div className="contact_contain_text">
                <p>
                    <span className="content">
                        {value}
                    </span>
                    {count > 0 ? <span className="count"> {count}</span> : ""}
                </p>
                <img alt="avatar" src="./demo.jpeg"></img>
            </div>
        </div >
    )
}

export default ContactContain
