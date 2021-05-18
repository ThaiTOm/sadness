import React, { useState, useEffect } from 'react'
import axios from "axios"
import { Link } from "react-router-dom"
import Cookies from 'js-cookie'
import CryptoJs from "crypto-js"
import { useHistory } from "react-router-dom";


function RenderRooms({ peer }) {
    const [data, setData] = useState([])
    const [start, setStart] = useState(0)
    const [end, setEnd] = useState(5)
    const [open, setOpen] = useState(false)
    const [text, setText] = useState("")
    let history = useHistory();


    let handleSubmit = (e) => {
        e.preventDefault()
        if (text) {
            let value = CryptoJs.AES.encrypt(text, "do'aibie^tduoc!").toString()
            Cookies.set("user-name", value, {
                expires: 7
            })
            history.push(`/podcast/?name=${value}&id=${open}`)
        }

    }
    useEffect(() => {
        let fnc = () => {
            let value = Cookies.get("user-name")
            value ? value = CryptoJs.AES.decrypt(value, "do'aibie^tduoc!").toString(CryptoJs.enc.Utf8) : value = null
            setText(value)
        }
        window !== undefined && fnc()
    }, [])
    useEffect(() => {
        axios.get(`http://localhost:2704/api/audio/getRooms/?start=${start}&end=${end}`)
            .then(value => {
                if (value.data) {
                    for (let d of value.data) {
                        setData(x => [...x, d])
                    }
                } else {

                }
            })
            .catch(err => {
                console.log(err)
            })
    }, [end, start])
    return (
        <div className="podcast-render percent">
            <div className="podcast-container">
                {data.length && data.map(function (value) {
                    return <div key={value.id} className="podcast-div">
                        <div className="in">
                            {value.tag && value.tag.map(function (x) {
                                return <p key={x.length}> <Link to={x}>@{x}</Link></p>
                            })}
                            <section>
                                {value.text && value.text.map((x) => {
                                    return <p key={x.length}>{x}</p>
                                })}
                            </section>
                        </div>
                        <div style={{ display: "flex" }}>
                            <div className="podcast-many tooltip">
                                <span style={{ fontWeight: 700 }}> {value.users.length}</span>
                                <span className="tooltiptext">
                                    Số người trong phòng
                                </span>
                            </div>
                            <button onClick={e => setOpen(value.id)} className="podcast-join-button tooltip">
                                <span className="tooltiptext">
                                    Tham gia
                                </span>
                                <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 -10 453.232 453.232" xmlSpace="preserve">
                                    <g><g>
                                        <path d="M187.466,0c-0.1,0-0.3,0-0.6,0c-101.2,0-183.5,82.3-183.5,183.5c0,41.3,14.1,81.4,39.9,113.7l-26.7,62.1
			c-2.2,5.1,0.2,11,5.2,13.1c1.8,0.8,3.8,1,5.7,0.7l97.9-17.2c19.6,7.1,40.2,10.7,61,10.6c101.2,0,183.5-82.3,183.5-183.5
			C370.066,82.1,288.366,0.1,187.466,0z M124.666,146.6h54c5.5,0,10,4.5,10,10s-4.5,10-10,10h-54c-5.5,0-10-4.5-10-10
			S119.166,146.6,124.666,146.6z M248.666,216.6h-124c-5.5,0-10-4.5-10-10s4.5-10,10-10h124c5.5,0,10,4.5,10,10
			S254.166,216.6,248.666,216.6z"/>
                                    </g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg>
                            </button>
                        </div>
                    </div>
                })}
            </div>
            <div style={open ? { display: "flex" } : { display: "none" }} className="podcast-req percent">
                <form onSubmit={e => handleSubmit(e)} className="container-req">
                    <div className="header" onClick={e => setOpen(false)}>
                        <span>X</span>
                    </div>
                    <div>
                        <p>Tên hiển thị (tạm thời)</p>
                        <input value={text} onChange={e => setText(e.target.value)} placeholder="...." className="type_text_div" type="text" />
                    </div>
                    <div style={{ marginLeft: "auto", width: "max-content" }}>
                        <button type="submit">
                            ok
                    </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default RenderRooms