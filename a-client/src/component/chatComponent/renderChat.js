import React, { useState, useEffect, useRef } from 'react'
import { FormSend, messageLiImageRender, messageLiRender } from '../../helpers/message';
import { decryptWithAES } from '../../helpers/auth';
import axios from 'axios';
import socketApp from '../../socket';
import { executeScroll } from "../../helpers/message"


function RenderChat(props) {
    let socket = socketApp.getSocket();
    let { id, userId } = props
    const [msg, setMsg] = useState([]);
    const [load, setLoad] = useState(false);
    const [start, setStart] = useState(0);
    const [end, setEnd] = useState(10);
    const myRef = useRef(null);

    const handleClickLoad = () => {
        setLoad(true);
        setTimeout(() => {
            setEnd(end + 10)
        }, 1000)
    }
    useEffect(() => {
        axios.get("http://localhost:2704/api/msgC/sendContact?id=" + id + "&start=" + start + "&end=" + end)
            .then(res => {
                setMsg(res.data.data)
                setLoad(false)
            }).catch(err => {
                return <div>Oops, bạn hãy thử lại sau</div>
            })
    }, [id, start, end])
    useEffect(() => {
        socket.on("message", msg => {
            if (msg.image) {
                setMsg(img => [...img, msg.image])
            } else {
                setMsg(msgs => [...msgs, msg.data])
            }
            executeScroll(myRef)
        })
    }, [socket])
    return (
        <>
            <ul>
                <div className="button_load_more">
                    {load === false ? <button onClick={handleClickLoad}>Tải thêm</button>
                        : <div className="loaderBalls">
                            <div className="yellow"></div>
                            <div className="red"></div>
                            <div className="blue"></div>
                        </div>
                    }
                </div>
                {
                    msg.length > 0 ?
                        msg.map(function (item, i) {
                            if (item.image) {
                                let imgUrl = item.image
                                if (item.id === userId) return messageLiImageRender("mIOwn", i, imgUrl, myRef)
                                else return messageLiImageRender("mIOther", i, imgUrl, myRef)
                            } else {
                                let msgs = item.data[0] ? decryptWithAES(item.data[0]) : ""
                                if (item.id === userId) return messageLiRender("messageLiOwn", "own_message_same_div messageLiOwnm60", "own_message_same_div messageLiOwnl60", msgs, i, myRef)
                                else return messageLiRender("messageLiOther", "other_message_same_div messageLiOtherm60", "other_message_same_div messageLiOtherl60", msgs, i, myRef)
                            }
                        }) : console.log()
                }
            </ul>
            <FormSend id={id} userId={userId} />
        </>
    )
}

export default RenderChat
