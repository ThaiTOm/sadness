import React, { useState, useEffect, useRef } from 'react'
import { Link } from "react-router-dom"
import axios from "axios"
import { encryptTo } from '../../../helpers/auth'
import { IconButton } from "@material-ui/core"

function ShortStatus({ id, socket }) {
    const [data, setData] = useState([])
    const [start, setStart] = useState(0)
    const [image, setImage] = useState(null)
    const [imgBg, setImgBg] = useState(null)
    const [play, setPlay] = useState(true)
    const [duration, setDuration] = useState(null)
    const [mute, setMute] = useState(false)
    const [targetInput, setTargetInput] = useState(false)
    const [text, setText] = useState("")

    const videoRef = useRef(null)
    // sue for how when sorce finish 
    const [load, setLoad] = useState(null)

    let handleClick = (i) => {
        setLoad(null)
        if (image) {
            setImgBg(null)
            setImage(null)
        } else {
            setImgBg(data[i]["b-g"])
            setImage(data[i])
        }
    }

    let handleClickPause = (e) => {
        if (videoRef.current) {
            setPlay(!play)
            play === true && videoRef.current.pause()
            play !== true && videoRef.current.play()
        }
    }

    let changeShot = () => {
        setText(null)
        setDuration(null)
        setPlay(true)
        setMute(false)
        setTargetInput(false)
    }

    let handleNext = () => {
        let index = data.indexOf(image)
        if (index >= data.length - 1) {
            setStart(start + 5)
        } else {
            setImage(data[index + 1])
            setImgBg(data[index + 1]["b-g"])
            changeShot()
        }
    }

    let handlePre = () => {
        let index = data.indexOf(image)
        if (index > 0) {
            setImage(data[index - 1])
            setImgBg(data[index - 1]["b-g"])
            changeShot()
        }
    }

    let handleSubmit = (e) => {
        e.preventDefault()
        if (text) {
            let value = encryptTo(id)
            let text1 = encryptTo(text)

            socket.emit("shotReq", { id: value, idPost: image.id, value: text1, idUser: image["id-user"] });
        }
    }

    let handleChangeText = (e) => {
        setText(e.target.value)
        if (videoRef.current) {
            play === true && videoRef.current.pause()
            setPlay(false)
        }
    }

    useEffect(() => {
        axios.post("http://localhost:2704/api/news/get/shot", { start, end: start + 5 })
            .then(data => {
                for (let x of data.data) {
                    setData(value => [...value, x])
                }
            })
            .catch(err => {
                console.log(err)
            })
    }, [start])

    useEffect(() => {
        const interval = setInterval(() => {
            videoRef.current ? videoRef.current.currentTime === videoRef.current.duration ? handleNext() : setDuration(videoRef.current.currentTime) : setDuration(0)
        }, 50)
        return () => clearInterval(interval);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [videoRef.current, duration, play])

    return (
        <>
            <div className="shot">
                <div className="shot_header">
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg"><path d="m8.75 17.612v4.638c0 .324.208.611.516.713.077.025.156.037.234.037.234 0 .46-.11.604-.306l2.713-3.692z" /><path d="m23.685.139c-.23-.163-.532-.185-.782-.054l-22.5 11.75c-.266.139-.423.423-.401.722.023.3.222.556.505.653l6.255 2.138 13.321-11.39-10.308 12.419 10.483 3.583c.078.026.16.04.242.04.136 0 .271-.037.39-.109.19-.116.319-.311.352-.53l2.75-18.5c.041-.28-.077-.558-.307-.722z" /></svg>
                        <span>Shots</span>
                    </div>
                    <Link className="tooltip" to="/create/shots">
                        <svg id="add-svg" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                            viewBox="0 0 477.867 477.867" xmlxspace="preserve">
                            <g>
                                <g>
                                    <path d="M392.533,0h-307.2C38.228,0.056,0.056,38.228,0,85.333v307.2c0.056,47.105,38.228,85.277,85.333,85.333h307.2
			c47.105-0.056,85.277-38.228,85.333-85.333v-307.2C477.81,38.228,439.638,0.056,392.533,0z M443.733,392.533
			c0,28.277-22.923,51.2-51.2,51.2h-307.2c-28.277,0-51.2-22.923-51.2-51.2v-307.2c0-28.277,22.923-51.2,51.2-51.2h307.2
			c28.277,0,51.2,22.923,51.2,51.2V392.533z"/>
                                </g>
                            </g>
                            <g>
                                <g>
                                    <path d="M324.267,221.867H256V153.6c0-9.426-7.641-17.067-17.067-17.067s-17.067,7.641-17.067,17.067v68.267H153.6
			c-9.426,0-17.067,7.641-17.067,17.067S144.174,256,153.6,256h68.267v68.267c0,9.426,7.641,17.067,17.067,17.067
			S256,333.692,256,324.267V256h68.267c9.426,0,17.067-7.641,17.067-17.067S333.692,221.867,324.267,221.867z"/>
                                </g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g>
                        </svg>
                        <span className="tooltiptext">Tao tin</span>
                    </Link>
                </div>
                <div className="shot_div">
                    {data.length > 0 && data.map(function (value, i) {
                        return <video onClick={e => handleClick(i)} key={i} alt={value.path} src={value.path}></video>
                    })}
                </div>
                <svg style={data.length > 0 ? { display: "flex" } : { display: "none" }} id="arrow" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512.008 512.008" xmlxspace="preserve">
                    <path d="M306.219,45.796c-21.838-21.838-57.245-21.838-79.083,0s-21.838,57.245,0,79.083l77.781,77.803
	H53.333C23.878,202.682,0,226.56,0,256.015c0,29.455,23.878,53.333,53.333,53.333h251.584l-77.781,77.781
	c-21.838,21.838-21.838,57.245,0,79.083c21.838,21.838,57.245,21.838,79.083,0l202.667-202.667c4.164-4.165,4.164-10.917,0-15.083
	L306.219,45.796z"/>
                    <g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg>
            </div>
            {/* Viewing shots */}
            {
                image && <div id="modal-shot" className="percent" style={image ? { display: "block" } : { display: "none" }}>
                    <img className="modal-shot-image" alt={imgBg.slice(0, 12)} src={imgBg} />
                    <div className="modal-shot-header">
                        <span onClick={e => setImage(null)}>
                            x
                        </span>
                    </div>
                    <div className="modal-shot-body" style={load ? { display: "flex" } : { display: "none" }}>
                        <svg onClick={e => handlePre()} className="modal-svg" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                            viewBox="0 0 512 512" xmlSpace="preserve">
                            <g>
                                <g>
                                    <path d="M256,0C114.837,0,0,114.837,0,256s114.837,256,256,256s256-114.837,256-256S397.163,0,256,0z M313.749,347.584
                c8.341,8.341,8.341,21.824,0,30.165c-4.16,4.16-9.621,6.251-15.083,6.251c-5.461,0-10.923-2.091-15.083-6.251L176.917,271.083
                c-8.341-8.341-8.341-21.824,0-30.165l106.667-106.667c8.341-8.341,21.824-8.341,30.165,0s8.341,21.824,0,30.165L222.165,256
                L313.749,347.584z"/>
                                </g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g>
                        </svg>
                        <div className="modal-shot-container percent">
                            <div className="header">
                                <section className="progress-video">
                                    <section style={duration ? { width: `${(duration / videoRef.current.duration) * 100}%` } : { width: "0" }}></section>
                                </section>
                                <section className="ex">
                                    <section onClick={e => handleClickPause()}>
                                        {
                                            play === true ? <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 47.607 47.607">
                                                <g>
                                                    <path d="M17.991,40.976c0,3.662-2.969,6.631-6.631,6.631l0,0c-3.662,0-6.631-2.969-6.631-6.631V6.631C4.729,2.969,7.698,0,11.36,0
            l0,0c3.662,0,6.631,2.969,6.631,6.631V40.976z"/>
                                                    <path d="M42.877,40.976c0,3.662-2.969,6.631-6.631,6.631l0,0c-3.662,0-6.631-2.969-6.631-6.631V6.631
            C29.616,2.969,32.585,0,36.246,0l0,0c3.662,0,6.631,2.969,6.631,6.631V40.976z"/>
                                                </g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g>
                                            </svg> : <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 163.861 163.861" xmlSpace="preserve">
                                                <g>
                                                    <path d="M34.857,3.613C20.084-4.861,8.107,2.081,8.107,19.106v125.637c0,17.042,11.977,23.975,26.75,15.509L144.67,97.275
            c14.778-8.477,14.778-22.211,0-30.686L34.857,3.613z"/>
                                                </g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g>
                                            </svg>
                                        }
                                    </section>
                                    <section onClick={e => setMute(!mute)}>
                                        {
                                            mute === true ? <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                                                viewBox="0 0 384 384" xmlSpace="preserve">
                                                <g>
                                                    <g>
                                                        <g>
                                                            <path d="M288,192c0-37.653-21.76-70.187-53.333-85.867v47.147l52.373,52.373C287.68,201.173,288,196.587,288,192z" />
                                                            <path d="M341.333,192c0,20.053-4.373,38.933-11.52,56.32l32.32,32.32C376,254.08,384,224,384,192
                                                            c0-91.307-63.893-167.68-149.333-187.093V48.96C296.32,67.307,341.333,124.373,341.333,192z"/>
                                                            <polygon points="192,21.333 147.413,65.92 192,110.507 			" />
                                                            <path d="M27.2,0L0,27.2L100.8,128H0v128h85.333L192,362.667V219.2l90.773,90.773c-14.293,10.987-30.4,19.84-48.107,25.173V379.2
                                                            c29.333-6.72,56.107-20.16,78.613-38.613L356.8,384l27.2-27.2l-192-192L27.2,0z"/>
                                                        </g>
                                                    </g>
                                                </g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g>
                                            </svg> : <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 93.038 93.038">
                                                <g>
                                                    <path d="M46.547,75.521c0,1.639-0.947,3.128-2.429,3.823c-0.573,0.271-1.187,0.402-1.797,0.402c-0.966,0-1.923-0.332-2.696-0.973
            l-23.098-19.14H4.225C1.892,59.635,0,57.742,0,55.409V38.576c0-2.334,1.892-4.226,4.225-4.226h12.303l23.098-19.14
            c1.262-1.046,3.012-1.269,4.493-0.569c1.481,0.695,2.429,2.185,2.429,3.823L46.547,75.521L46.547,75.521z M62.784,68.919
            c-0.103,0.007-0.202,0.011-0.304,0.011c-1.116,0-2.192-0.441-2.987-1.237l-0.565-0.567c-1.482-1.479-1.656-3.822-0.408-5.504
            c3.164-4.266,4.834-9.323,4.834-14.628c0-5.706-1.896-11.058-5.484-15.478c-1.366-1.68-1.24-4.12,0.291-5.65l0.564-0.565
            c0.844-0.844,1.975-1.304,3.199-1.231c1.192,0.06,2.305,0.621,3.061,1.545c4.977,6.09,7.606,13.484,7.606,21.38
            c0,7.354-2.325,14.354-6.725,20.24C65.131,68.216,64.007,68.832,62.784,68.919z M80.252,81.976
            c-0.764,0.903-1.869,1.445-3.052,1.495c-0.058,0.002-0.117,0.004-0.177,0.004c-1.119,0-2.193-0.442-2.988-1.237l-0.555-0.555
            c-1.551-1.55-1.656-4.029-0.246-5.707c6.814-8.104,10.568-18.396,10.568-28.982c0-11.011-4.019-21.611-11.314-29.847
            c-1.479-1.672-1.404-4.203,0.17-5.783l0.554-0.555c0.822-0.826,1.89-1.281,3.115-1.242c1.163,0.033,2.263,0.547,3.036,1.417
            c8.818,9.928,13.675,22.718,13.675,36.01C93.04,59.783,88.499,72.207,80.252,81.976z"/>
                                                </g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g>
                                            </svg>
                                        }
                                    </section>
                                </section>
                            </div>
                            <video className="percent" muted={mute} autoPlay ref={videoRef} src={image.path} onLoadedData={e => setLoad(true)} />
                            {
                                targetInput === true ? <div className="bottom">
                                    <form onSubmit={e => handleSubmit(e)}>
                                        <input onChange={e => handleChangeText(e)}></input>
                                        <IconButton type="submit">
                                            <svg xmlns="http://www.w3.org/2000/svg" xmlnsslink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                                                viewBox="-30 -65 550 562" xmlSpace="preserve">
                                                <g><g>
                                                    <path d="M481.508,210.336L68.414,38.926c-17.403-7.222-37.064-4.045-51.309,8.287C2.86,59.547-3.098,78.551,1.558,96.808
            L38.327,241h180.026c8.284,0,15.001,6.716,15.001,15.001c0,8.284-6.716,15.001-15.001,15.001H38.327L1.558,415.193
            c-4.656,18.258,1.301,37.262,15.547,49.595c14.274,12.357,33.937,15.495,51.31,8.287l413.094-171.409
            C500.317,293.862,512,276.364,512,256.001C512,235.638,500.317,218.139,481.508,210.336z"/>
                                                </g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g>
                                            </svg>
                                        </IconButton>
                                    </form>
                                </div> : <div id="input-click" className="bottom">
                                    <input></input>
                                    <div onClick={e => setTargetInput(!targetInput)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" xmlnsslink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                                            viewBox="-10 -65 550 562" xmlSpace="preserve">
                                            <g><g>
                                                <path d="M481.508,210.336L68.414,38.926c-17.403-7.222-37.064-4.045-51.309,8.287C2.86,59.547-3.098,78.551,1.558,96.808
                L38.327,241h180.026c8.284,0,15.001,6.716,15.001,15.001c0,8.284-6.716,15.001-15.001,15.001H38.327L1.558,415.193
                c-4.656,18.258,1.301,37.262,15.547,49.595c14.274,12.357,33.937,15.495,51.31,8.287l413.094-171.409
                C500.317,293.862,512,276.364,512,256.001C512,235.638,500.317,218.139,481.508,210.336z"/>
                                            </g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g>
                                        </svg>
                                    </div>
                                </div>
                            }
                        </div>
                        <svg onClick={e => handleNext(e)} className="modal-svg" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                            viewBox="0 0 512 512" xmlSpace="preserve">
                            <g>
                                <g>
                                    <path d="M256,0C114.837,0,0,114.837,0,256s114.837,256,256,256s256-114.837,256-256S397.163,0,256,0z M335.083,271.083
                L228.416,377.749c-4.16,4.16-9.621,6.251-15.083,6.251c-5.461,0-10.923-2.091-15.083-6.251c-8.341-8.341-8.341-21.824,0-30.165
                L289.835,256l-91.584-91.584c-8.341-8.341-8.341-21.824,0-30.165s21.824-8.341,30.165,0l106.667,106.667
                C343.424,249.259,343.424,262.741,335.083,271.083z"/>
                                </g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g>
                        </svg>
                    </div>
                </div>
            }
        </>
    )
}
export default ShortStatus