import React, { useEffect, useState } from 'react'
import CryptoJS from 'crypto-js';
import { getCookie } from '../../../helpers/auth';
import socketApp from '../../../socket';
import classNames from "classnames";

// This function is use for render list of contact
var socket = socketApp.getSocket();
function ContactContain({ onClick, message, user1, user2, idRoom, target }) {
    const [read, setRead] = useState(false);
    const [active, setActive] = useState(false);
    const [value, setValue] = useState("");
    // lu last user, clu contain last user and message
    let lu, clu;

    const id = getCookie().token;
    //this message is last message when not online
    let arr = message.split(",");

    const decryptWithAES = ciphertext => {
        const passphrase = '123nguyenduythaise1';
        const bytes = CryptoJS.AES.decrypt(ciphertext, passphrase);
        let originalText
        //if original text is defined that assign it
        try {
            originalText = bytes.toString(CryptoJS.enc.Utf8);
        } catch (error) {
            originalText = ""
        }
        return originalText;
    };
    const sendData = () => {
        onClick(idRoom + "," + user1 + ";" + user2 + ";" + id)
    }
    useEffect(() => {
        //message contain when another not sending and that is the last time when message send
        socket.emit("joinBack", { idRoom })
        if (arr[1] === id) {
            try {
                let a = decryptWithAES(arr[0])
                let mess = a.length > 10 ? a.slice(0, 10) + "....." : a.split(",")[0]
                setValue("Bạn:  " + mess)
            } catch (error) { }
        } else {
            try {
                let a = decryptWithAES(arr[0])
                let mess = a.length > 10 ? a.slice(0, 10) + "....." : a.split(",")[0]
                setValue("Đằng ấy:  " + mess)
                // arr[2] contain true or false read
                if(arr[2] === "false"){
                    setRead(true)
                }
            } catch (error) { }
        }

    }, [])
    // and this is when socket on 
    useEffect(() => {
        socket.on("message", msgs => {
            if (msgs.idRoom === idRoom) {
                lu = msgs.user
                let a = msgs.text.split(",")
                if (lu === id) {
                    try {
                        let mess = decryptWithAES(a[0])
                        mess = mess.length > 12 ? mess.slice(0, 12) + "......." : mess
                        setValue("Bạn:  " + mess)
                    } catch (error) { }
                } else {
                    try {
                        let mess = decryptWithAES(a[0])
                        mess = mess.length > 12 ? mess.slice(0, 12) + "......." : mess
                        setValue("Đằng ấy:  " + mess)
                        setRead(true)
                    } catch (error) { }
                }
            }
        })
    }, [])
    useEffect(() => {
        if (target === idRoom) {
            setActive(true)
            setRead(false)
            socket.emit("seenMessage", {id: idRoom, user1, user2})
        }
        else {
            setActive(false)
        }
    }, [target])
    //if last people send is who then assign that
    var classN = classNames({
        "contact_container": true,
        "active_contact": active,
        "not_read_contact": read
    })
    return (
        <div className={classN} onClick={sendData}>
            <div className="contact_contain_text">
                <p>
                    {value}
                </p>
                <img src="./demo.jpeg"></img>
            </div>
        </div>
    )
}

export default ContactContain
