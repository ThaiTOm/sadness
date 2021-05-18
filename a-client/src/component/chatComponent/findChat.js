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
                    <p>Nhắn tin với người lạ</p>
                </div>
                <div className="container_button_div">
                    <div className="part_1 cA">
                        <button
                            id="button_find_partner"
                            className={`${btnClassFind} tooltip cA`}
                            onClick={HanldeClickFind}
                        >
                            <span className="tooltiptext">
                                Tìm cặp
                        </span>
                            {wait === true ? < Spinning /> : "Tìm cặp"}
                        </button>

                    </div>
                    <div className="part_2  cA">
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
                <div id="chat-svg">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 863.91732 364.20537"><polygon points="311.959 119.745 0 119.745 0 222.156 11.817 222.156 11.817 248.941 38.601 222.156 311.959 222.156 311.959 119.745" fill="#f0f0f0" /><rect x="8.66553" y="129.71814" width="294.62811" height="81.92868" fill="#fff" /><rect x="34.72148" y="154.42552" width="141.85589" height="4.30497" fill="#f0f0f0" /><rect x="34.72148" y="169.31777" width="247.24292" height="4.30497" fill="#f0f0f0" /><rect x="34.72148" y="184.21003" width="247.00081" height="4.30497" fill="#f0f0f0" /><path d="M692.07274,618.96676s1.487-31.15875,31.97119-27.537" transform="translate(-168.04134 -267.89732)" fill="#f0f0f0" /><circle cx="515.41796" cy="306.16087" r="15.2571" fill="#f0f0f0" /><rect x="512.9354" y="331.85294" width="4.30672" height="30.14703" fill="#f0f0f0" /><circle cx="666.92952" cy="180.07338" r="123.29665" fill="#3f3d56" /><path d="M757.348,457.86815a32.62688,32.62688,0,0,1,50.081,0,36.26372,36.26372,0,1,0-51.27085-1.18987Q756.73918,457.28694,757.348,457.86815Z" transform="translate(-168.04134 -267.89732)" fill="#fff" /><path d="M855.26,457.86815a32.627,32.627,0,0,1,50.08092,0,36.26371,36.26371,0,1,0-51.2708-1.18987Q854.65117,457.28694,855.26,457.86815Z" transform="translate(-168.04134 -267.89732)" fill="#fff" /><circle cx="601.97649" cy="151.39215" r="12.47434" fill="#3f3d56" /><circle cx="699.88499" cy="151.39215" r="12.47434" fill="#3f3d56" /><circle cx="578.08341" cy="210.89752" r="14.50548" fill="#00b0ff" /><circle cx="744.8965" cy="210.89752" r="14.5055" fill="#00b0ff" /><polygon points="661.49 181.886 650.611 229.029 668.742 210.898 661.49 181.886" fill="#00b0ff" /><polygon points="717.39 363.205 705.038 352.839 705.326 363.205 701.49 363.205 701.183 352.244 684.507 363.205 677.526 363.205 701.059 347.737 700.147 315.258 699.466 290.728 703.293 290.623 703.984 315.258 704.894 347.708 723.354 363.205 717.39 363.205" fill="#3f3d56" /><polygon points="659.363 363.205 647.012 352.839 647.3 363.205 643.474 363.205 643.167 352.244 626.49 363.205 619.509 363.205 643.033 347.737 642.122 315.258 641.441 290.728 645.276 290.623 645.967 315.258 646.868 347.708 665.328 363.205 659.363 363.205" fill="#3f3d56" /><path d="M836.784,315.60813c-3.3831,0-6.36764,2.628-8.36294,6.66445-1.75872-6.06969-5.45374-10.29078-9.7689-10.29078a6.56326,6.56326,0,0,0-.87094.1463c-1.65871-6.4805-5.51368-11.02542-10.00816-11.02542-6.00841,0-10.8791,8.118-10.8791,18.13187s4.87073,18.13187,10.8791,18.13187a6.56119,6.56119,0,0,0,.87093-.14629c1.65871,6.4805,5.51369,11.02541,10.00817,11.02541,3.3831,0,6.36764-2.62795,8.36294-6.66444,1.75876,6.06971,5.45374,10.29077,9.7689,10.29077,6.00841,0,10.8791-8.118,10.8791-18.13187S842.79244,315.60813,836.784,315.60813Z" transform="translate(-168.04134 -267.89732)" fill="#3f3d56" /><path d="M718.72328,451.807l-67.92039-11.01653c-3.42269-.55515-6.90789-1.11141-10.34147-.6282s-6.87069,2.1737-8.62107,5.16688a8.651,8.651,0,0,0,9.14985,12.853c-3.70741-.12023-7.60411-.19978-10.894,1.51369s-5.61946,5.87559-4.01553,9.22024a8.27667,8.27667,0,0,0,1.91922,2.4289,17.60582,17.60582,0,0,0,18.52289,3.14128c-2.50047,3.58582-7.46212,4.11838-11.7541,4.94866s-9.25362,3.258-9.41312,7.62664c-.17922,4.90869,5.66264,7.51763,10.47189,8.51687A137.41687,137.41687,0,0,0,712.648,489.3171a30.98,30.98,0,0,0,7.737-3.95049,17.43266,17.43266,0,0,0-7.05356-30.96345" transform="translate(-168.04134 -267.89732)" fill="#3f3d56" /><path d="M1011.89005,507.47917a137.41884,137.41884,0,0,0-51.17256-57.63676,30.97519,30.97519,0,0,0-7.80737-3.80966,17.43272,17.43272,0,0,0-20.50879,24.24615l-5.31525-2.74921Q943.09323,497.98314,959.1,528.43656c1.61312,3.06929,3.26318,6.18918,5.71292,8.64309s5.86648,4.18514,9.31075,3.78525a8.6006,8.6006,0,0,0,6.77916-12.2999,16.64264,16.64264,0,0,0,5.752,5.05979c3.34648,1.59972,8.07321.9603,9.7823-2.33177a8.27455,8.27455,0,0,0,.78809-2.99368,17.60592,17.60592,0,0,0-8.62117-16.69248c4.36853-.1565,7.77622,3.48909,11.01912,6.42052,3.24327,2.93143,8.1652,5.43808,11.75289,2.94008C1015.40712,518.16062,1013.98161,511.92354,1011.89005,507.47917Z" transform="translate(-168.04134 -267.89732)" fill="#3f3d56" /><polygon points="55.757 0 506 0 506 147.807 488.945 147.807 488.945 186.463 450.289 147.807 55.757 147.807 55.757 0" fill="#cacaca" /><rect x="68.26381" y="14.39335" width="425.22943" height="118.24561" fill="#fff" /><rect x="102.45877" y="48.91591" width="204.73707" height="6.21326" fill="#00b0ff" /><rect x="102.45877" y="70.40954" width="356.83952" height="6.21326" fill="#00b0ff" /><rect x="102.45877" y="91.90316" width="356.49009" height="6.21326" fill="#00b0ff" /><path d="M1030.95866,632.10268h-381a1,1,0,0,1,0-2h381a1,1,0,0,1,0,2Z" transform="translate(-168.04134 -267.89732)" fill="#cacaca" /></svg>
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
