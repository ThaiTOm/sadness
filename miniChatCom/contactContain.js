import React, { useEffect, useState } from 'react'
import CryptoJS from 'crypto-js';
import { getCookie } from '../../../helpers/auth';
import socketApp from '../../../socket';

// This function is use for render list of contact
var socket = socketApp.getSocket();
function ContactContain({ onClick, message, user1, user2, idRoom }) {
    // lu last user, clu contain last user and message
    let lu, clu
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
    if (arr[1] === id) {
        try {
            let a = decryptWithAES(arr[0])
            let mess = a.length > 10 ? a.slice(0, 10) + "....." : a.split(",")[0]
            clu = "Bạn:  " + mess
        } catch (error) { }
    } else {
        try {
            let a = decryptWithAES(arr[0])
            let mess = a.length > 10 ? a.slice(0, 10) + "....." : a.split(",")[0]
            clu = "Đằng ấy:  " + mess
        } catch (error) { }
    }
    const [value, setValue] = useState(clu)
    useEffect(() => {
        //message contain when another not sending and that is the last time when message send
        socket.emit("joinBack", { idRoom })
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
                    } catch (error) { }
                }
            }
        })
    }, [])
    //if last people send is who then assign that

    return (
        <div className="contact_container" onClick={() => onClick(idRoom + "," + user1 + ";" + user2 + ";" + id)}>
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
