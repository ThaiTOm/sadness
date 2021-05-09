import React, { useEffect, useState, useRef } from 'react';
import classNames from 'classnames';
import { getCookie, decryptWithAES } from '../../helpers/auth';
import axios from "axios"
import socketApp from '../../socket';
import { messageLiRender, messageLiImageRender, executeScroll, Spinning, FormSend } from '../../helpers/message/message';
import { toast, ToastContainer } from "react-toastify"
import ShortStatus from './miniChatCom/shortStatus';


function Chat({ handleRoom }) {
    let socket = socketApp.getSocket();
    const id = getCookie().token;
    const ipOfUser = "Dong nai";
    const [value, setValue] = useState([]);
    // len is len of rooms the user had join
    const [len, SetLen] = useState(0);

    //This id room contain every id of the message that they have
    // waitG = wait group
    const [waitG, setWaitG] = useState(null);

    const [idRoom, setidRoom] = useState(null);
    const [wait, setWait] = useState(false);
    const [finish, setFinish] = useState(false);
    const myRef = useRef(null)

    const HanldeClickFind = (e) => {
        if (wait !== true) {
            socket.emit("joinChat", { id, len, ipOfUser }, (error) => {
                if (error === "error") {
                    setWait(true)
                } else {
                    setFinish(true)
                    setidRoom(error)
                }
            })
        } else {
            handleRoom(null)
            setWait(false)
            socket.emit("joinChat", { id, len, ipOfUser }, (error) => {
                if (error !== "error") {
                    setFinish(true)
                    setidRoom(error)
                }
            })
        }
    }
    //Fetch data to recive the idRoom
    useEffect(() => {
        const source = axios.CancelToken.source()
        const fetchData = () => {
            axios.post("http://localhost:2704/api/msgC/getIdRoom", { id })
                .then(res => {
                    if (res.data.len >= 0) SetLen(res.data.len)
                    else toast.error("Có lỗi đã xảy ra bạn hãy đăng nhập lại hoặc thử lại sau")
                }).catch(err => {
                    toast.error("Có lỗi đã xảy ra bạn hãy đăng nhập lại hoặc thử lại sau")
                })
        }
        fetchData()
        return () => {
            source.cancel()
        }
    }, [id])
    //load message
    useEffect(() => {
        socket.on("message", msg => {
            if (msg.roomId) {
                // If we have a couple together than we start to chat
                setWait(false)
                setFinish(true)
                setidRoom(msg.roomId)
            }
            if (msg.image && idRoom === msg.idRoom) {
                // if message send is image
                setValue(img => [...img, msg.image])
            }
            else if (msg.data && idRoom === msg.idRoom) {
                setValue(msgs => [...msgs, msg.data])
                executeScroll(myRef)
            }
        })

    }, [socket, idRoom])

    //defined button find partner classname
    var btnClassFind = classNames({
        "onclic": wait,
    })
    const changeStateWaitGroup = () => {
        if (waitG === null) {
            handleRoom("yes")
            setWaitG("active")
            socket.emit("joinChatGroup", { id, len, ipOfUser }, (callback) => {
                if (callback !== "error") {
                    setFinish(true)
                    setidRoom(callback)
                }
            })
        }
        else {
            handleRoom(null)
            setWaitG(null)
        }
    }
    return (
        <div style={finish === true ? { display: "flex" } : { display: "block" }} className="message_container">
            <ShortStatus id={id} socket={socket} />
            <ToastContainer />
            <div className="container_button" style={finish === true ? { display: "none" } : {}}>
                <div className="container_button_header">
                    <svg viewBox="0 0 512.012 512.012" width="13pt" height="13pt" xmlns="http://www.w3.org/2000/svg"><g><path d="m333.201 115.038c-28.905-59.021-89.37-98.042-157.193-98.042-97.047 0-176 78.505-176 175 0 26.224 5.63 51.359 16.742 74.794l-16.451 82.265c-2.094 10.472 7.144 19.728 17.618 17.656l83.279-16.465c11.213 5.319 22.813 9.364 34.732 12.151-26.717-126.541 69.199-245.321 197.273-247.359z" /><path d="m495.266 394.79c2.874-6.061 5.373-12.237 7.511-18.514h-.549c37.448-109.917-41.305-225.441-157.567-231.066-.002-.006-.003-.012-.005-.018-100.036-4.61-183.148 75.486-183.148 174.804 0 96.414 78.361 174.857 174.743 174.997 26.143-.035 51.201-5.663 74.568-16.747 91.207 18.032 84.094 16.75 86.189 16.75 9.479 0 16.56-8.686 14.709-17.941z" /></g></svg>
                    <p>Nhan tin voi ngoui la</p>
                </div>
                <div className="container_button_div">
                    <div className="part_1">
                        <button
                            id="button_find_partner"
                            className={`${btnClassFind} tooltip`}
                            onClick={HanldeClickFind}
                        >
                            <span className="tooltiptext">
                                Tìm cặp
                        </span>
                            {wait === true ? < Spinning /> : "Tìm cặp"}
                        </button>

                    </div>
                    <div className="part_2 ">
                        <div onClick={changeStateWaitGroup} className={"chat_button_group tooltip " + waitG}>
                            <div className="background"></div>
                            <svg className="chat-bubble" width="100" height="100" viewBox="0 0 100 100">
                                <g className="bubble">
                                    <path className="line line1" d="M 30.7873,85.113394 30.7873,46.556405 C 30.7873,41.101961          36.826342,35.342 40.898074,35.342 H 59.113981 C 63.73287,35.342          69.29995,40.103201 69.29995,46.784744" />
                                    <path className="line line2" d="M 13.461999,65.039335 H 58.028684 C            63.483128,65.039335 69.243089,59.000293 69.243089,54.928561 V 45.605853 C            69.243089,40.986964 65.02087,35.419884 58.339327,35.419884" />
                                </g>
                                <circle className="circle circle1" r="1.9" cy="50.7" cx="42.5" />
                                <circle className="circle circle2" cx="49.9" cy="50.7" r="1.9" />
                                <circle className="circle circle3" r="1.9" cy="50.7" cx="57.3" />
                            </svg>
                            <span className="tooltiptext">
                                Ghép nhóm
                        </span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="message_container_div" style={finish === false ? { display: "none" } : { display: "block" }}>
                <ul>
                    {
                        value.length > 0 ?
                            value.map(function (item, i) {
                                if (item.image) {
                                    let imgUrl = item.image
                                    if (item.id === idRoom) return messageLiImageRender("mIOwn", i, imgUrl, myRef)
                                    else return messageLiImageRender("mIOther", i, imgUrl, myRef)
                                } else {
                                    let msgs = item.data[0] ? decryptWithAES(item.data[0]) : ""
                                    if (item.id === id) return messageLiRender("messageLiOwn", "own_message_same_div messageLiOwnm60", "own_message_same_div messageLiOwnl60", msgs, i, myRef)
                                    else return messageLiRender("messageLiOther", "other_message_same_div messageLiOtherm60", "other_message_same_div messageLiOtherl60", msgs, i, myRef)
                                }
                            }) : console.log()
                    }
                </ul>
                {idRoom ? <FormSend id={idRoom} userId={id} /> : console.log()}
            </div>
        </div >
    )
}

export default Chat
