import { useRef, useState, useContext } from "react"
import socketApp from "../../socket";
import IconButton from '@material-ui/core/IconButton';
import { encryptTo, getCookie } from "../auth";
import Menu from '@material-ui/core/Menu';
import "../../component/style/chat.css"
import { emoji } from "../emoji";
import { MessageList } from "../../userContext";
import ContactContain from "../../component/chatComponent/miniChatCom/contactContain";
import RenderChat from "../../component/chatComponent/renderChat";
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';


const userId = getCookie().token;
let socket = socketApp.getSocket();

export const handleFileUpload = (e, userId, id) => {
    let file = e.target.files;
    socket.emit("file", { room: id, image: file, userId, originName: file["0"].name, type: file["0"].type })
}
export const messageLiImageRender = (value, i, imgUrl, myRef) => {
    return (
        <li
            ref={myRef}
            key={i}
            className={"messageImage " + value}>
            <input type="checkbox" id={i}></input>
            <label htmlFor={i}>
                <img className={value} alt="" src={`http://localhost:2704/${imgUrl}`}></img>
            </label>
        </li>
    )
}
export const messageLiRender = (li, one, two, msgs, i, myRef) => {
    return (
        <li className={li}
            key={i}
            ref={myRef}
        >
            { msgs.length > 60 ?
                <div className={one} dangerouslySetInnerHTML={{ __html: msgs }}>
                </div> :
                <div className={two} dangerouslySetInnerHTML={{ __html: msgs }}>
                </div>
            }
        </li>
    )
}
export const executeScroll = (myRef) => {
    try {
        myRef.current.scrollIntoView()
    } catch (error) {
    }
}
export const Spinning = () => {
    return (
        <div className="spinner"></div>
    )
}
export const FormSend = (props) => {
    let { id, userId } = props
    const fileRef = useRef(null);
    const [message, setMessage] = useState("")
    const [anchorEl, setAnchorEl] = useState(null);

    const handleSubmit = e => {
        e.preventDefault();
        setMessage("")
        if (message) {
            let value = encryptTo(message)
            socket.emit('sendMessage', { room: id, message: value, id: userId });
        }
    }
    const emojiSubmit = (e, emo) => {
        e.preventDefault()
        let value = encryptTo("&#" + emo + ";")
        socket.emit('sendMessage', { room: id, message: value, id: userId });
        handleClose()
    }
    const useRefTrigger = () => {
        fileRef.current.click()
    }
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <form className="formMessage"
            onSubmit={handleSubmit}>
            <div className="formMessage_div">
                <>
                    <input
                        value={message}
                        className="input"
                        onChange={(e) => setMessage(e.target.value)}
                        type="text"
                        placeholder="Enter text" >
                    </input>
                    <div className="extension_input">
                        <input
                            id="icon_button_file"
                            type="file"
                            onChange={(e) => handleFileUpload(e, userId, id)}
                            ref={fileRef}
                        />
                        <div className="tooltip">
                            <IconButton className="image_upload_message_icon" onClick={useRefTrigger}>
                                <img alt="image_upload_icon" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAABmJLR0QA/wD/AP+gvaeTAAADRUlEQVRIieWVz28bRRTHP7M7dvCPNg0kEWDTQ+khJ6SqF/4CqnIgElIlzsgK4sQBFSFOuXFAnHKJUg5ISOWHIqQQEaFarUoVVaitgdRBdROJipA6tfMDJ66drO2Z10NIm3XsOHZygq+02pk3b95n3uzbGfi/STUbSCQSrzmOMwQUlVJ3RWQWyIyNjVWPFHz+/IU+48gFgZOA7o6G3leKcJ2/sVbWrMiyMXZ5+y3LNWM29gRWbIniZnJy/EpT8Llzb7+kunRaKdUTCUeqIA4QaDMJASwoAZGaMZRK5QDCp8mp8U/qnTWA0e67IR048eEH7znRSLirTeDuJNzdhqvXp7l6ffrjRGJIKyU3YrHY1PDwsH0KViLxnp5uFY2EcSPHCL7Qh3KcDvlgvS22clnisZcRQVlrL2rtXMxms58BHwHsiR7s7UdpDY7T8eOEwujjJxqt6c2dhh+sFMp193h3IsfVjcwLjcGtgqmmf99Bld5pNFxWI0UDmng0RNVYHhTLWJG2qUqpp+ADZxzWLgoIug7a6Tjz9sFrXoWCVyW36VExFoCKNcyv5w8aohYMBjM7nQNvdc0KS+Utn+3aYoa59Tzdr4boDx9rFeL+yMiIt9NpmbEV29A+V8hx759HGGv5cSGNZ2qtQqV3d1qCLyd/4Ne5WZ+t4G2SXLzn7/+dqZ/aOXg6fYfbmbt8nZxkIZcFQET4aeEPKsb4fOfXc8ysLDaNtbui9wU/XMkxcSMJQMVUuTT5LYXHG9zM/clSeb3hnJ+X5smVix2ARRBr8aoVvpwap2KeXb0b5SJfXJvgdv6vplnt/t5ifTtSGh0d9U3cU9XV1Tzfz9wiX1j12V2t4cVepMXBse5tknr0gDM1X04Ztq/N5uBacYPBUwMMnhrYF7CvPEF4lrG1cr/epfO7rw2J0BwsIoe+AZqpVrPNwUqp9k/9A6pU8pqAHYy1jU+ow2inEMtiV+vHtovL8vvK6hq/zczS39d7JFBrLb/cSuG6TvX1MwMPr0z4xxXA2bNDgb5YYdwY+9aRUP+V6zocD3dd+u6br4bqxzRAKjVWJcXgG4PvvELN9HcKei6onw+FgqddR53WrorrgHvnZDz++WEW/9/REz15Yuu7CLn4AAAAAElFTkSuQmCC" />
                            </IconButton>
                            <span className="tooltiptext">
                                Tải ảnh
                            </span>
                        </div>
                        <IconButton className="tooltip" aria-controls="simple_menu_emoji" aria-haspopup="true" onClick={handleClick}>
                            <img alt="emoji_image" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAAABmJLR0QA/wD/AP+gvaeTAAAC/klEQVRIie2SX2jVdRjGn+9vO5PTFuMcK9ESFHXIiiQmjUDCYDbXRX9uRjACwwuhP8JCuoiiIxRUohdBfxbDi9kIpIv+UyAhrjDoJGp6IVoMzTnz7HjmdP9+7/M+XvzOOW47u/Vuz9WX7/t+n8/L+3yBJS3pbilUDkeem2iNQpR2V9zxXdPpuU0/dU201kVMOzXW9XNm+HBHsTnFaH2lTnA6Jm6cO5a9nEPwhZDoziF8IikfAk4defbm9sr9j8+UNst1Jo5DPrbwKgA0ePSBpDxdeTPlGYczwcLFlieKxUOPF74cbP9/w6KQENDrAkkhNvVW7mVhL12B1FWa3gcAc6VIgJToum7UJF0g1eyOntjCiYNthfYayFPfNJ10qp8U3PX0953XN327rbSZVBcpOH3PC0czJQAwA8qm4y/+ns32HF/eCNo60gdIwUxNNsuDOSiaB0mm9rdIjZGCW9jtjvdIBad+e/5oZrDaRwcpkKq+7flzxb/Df93/Mqk/yrXWBzZeeawGsv2X5qI79pabXqKpk4RReiUgVB1tEQgA5BDcXANWrsUeHqmBAMD0rRv9pCZJpMpGQ93Hsn/P7SEBWwQCAIw1QiqpGxoXhYSGxl5S91AaJwW6tg60F7fMMzKBlhgtVExfa5YM4NRoDeTrJ8c30PB2kom/Q2KIVHDj531tSlUhQrIuW7Curap3+k53QQ5rSIWheRBBYTa2T0mlSY3Wh6l+M99nycQPByu8Xum12GEUjHfeHlh3aX3T8MiglOSACF/svrDy2jzIV+3FHU51lL/gh93HV0/tOHHfD6ROJuvx3GcthQeTTCrBe/P+tZeL+9eM3HJG5wF0l+1+jWLfU/GOAGBwSyljrn3JdBptXDbdBwABQTH93SREv3c2zH5UzmTGzEEqSMgASAMQgFNBeO3mmlWdb/y3eqqaMwD0tSm1TIVHYwA+U3dt19nsxbm7/rjl6iaR9TOhrvTmhRX/HHjoUjpEDSsrdU9ZPDEVxnIjqyZrfsKSlnRXdRsr+i4fv8vwiwAAAABJRU5ErkJggg==" />
                            <span className="tooltiptext">
                                Biểu tượng
                            </span>
                        </IconButton>
                        <Menu
                            id="simple_menu_emoji"
                            anchorEl={anchorEl}
                            keepMounted
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                        >
                            {emoji.map(function (emo, i) {
                                return (<span key={i} onClick={(e) => emojiSubmit(e, emo)} dangerouslySetInnerHTML={{ __html: "&#" + emo + ";" }}></span>)
                            })}
                        </Menu>

                    </div>
                </>
            </div>
        </form>
    )
}

export const MessageContainer = () => {
    const [room, setRoom] = useState(null)
    const { listMessage } = useContext(MessageList)
    const [open, setOpen] = useState(false)

    const hanldeSetRoom = value => {
        let id = value.split(",")
        setRoom(id[0])
    }

    const handleCreateRoom = (e) => {
        e.preventDefault()
    }
    return (
        <div className="accordion_div" style={open === true ? { height: "450px" } : { height: "initial" }}>
            <div className="accordion_header">
                {room ? <IconButton onClick={e => setRoom(null)}>
                    <ArrowBackIosIcon />
                </IconButton> : console.log()}
                <div onClick={e => setOpen(!open)} className="accordion_message">
                    <IconButton>
                        Message
                        <div className="sympol">
                            <svg onClick={e => handleCreateRoom} id="audio" width="35pt" height="25pt" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><g><path d="m467 143h-36.868c5.277 19.494 8.11 39.982 8.11 61.122 0 129.095-105.026 234.121-234.121 234.121-11.202 0-22.38-.83-33.436-2.427 6.916 15.975 22.829 27.184 41.315 27.184h212.583l63.61 46.142c2.61 1.893 5.701 2.858 8.809 2.858 2.327 0 4.663-.541 6.813-1.638 5.023-2.561 8.185-7.723 8.185-13.362v-309c0-24.813-20.187-45-45-45z" /><path d="m408.243 204.122c0-112.553-91.569-204.122-204.121-204.122s-204.122 91.569-204.122 204.122c0 39.168 11.028 76.924 31.969 109.698l-31.038 83.98c-2.03 5.493-.678 11.666 3.463 15.807 2.864 2.864 6.699 4.394 10.609 4.394 1.744 0 3.503-.305 5.198-.931l88.229-32.61c29.327 15.58 62.254 23.783 95.691 23.783 112.553 0 204.122-91.568 204.122-204.121zm-308.243 41.697c0 8.284-6.716 15-15 15s-15-6.716-15-15v-83.637c0-8.284 6.716-15 15-15s15 6.716 15 15zm210.001-83.637c0-8.284 6.716-15 15-15s15 6.716 15 15v83.637c0 8.284-6.716 15-15 15s-15-6.716-15-15zm-60 23.999c0-8.284 6.716-15 15-15s15 6.716 15 15v35.639c0 8.284-6.716 15-15 15s-15-6.716-15-15zm-90.001 35.639c0 8.284-6.716 15-15 15s-15-6.716-15-15v-35.639c0-8.284 6.716-15 15-15s15 6.716 15 15zm30.001 56.181v-148.001c0-8.284 6.716-15 15-15s15 6.716 15 15v148c0 8.284-6.716 15-15 15s-15-6.715-15-14.999z" /></g></svg>                            {open === false ?
                                <span >
                                    <ExpandLessIcon />
                                </span> :
                                <span >
                                    <ExpandMoreIcon />
                                </span>
                            }
                        </div>
                    </IconButton>
                </div>
            </div>
            <div style={open === true ? { display: "block" } : { display: "none" }} className="accordion_data">
                {room ? <RenderChat id={room} userId={userId} socket={socket} /> : listMessage && listMessage.length > 0 ? listMessage.map((val, i) => <div key={i}>
                    <ContactContain
                        socket={socket}
                        onClick={(value) => hanldeSetRoom(value)}
                        message={val.data}
                        users={val.user}
                        idRoom={val.idRoom}
                        target={room}
                        nread={val.nread}
                    />
                </div>
                ) : console.log()
                }
            </div>
        </div >
    )
}

export const getTime = (time) => {
    let d = new Date()
    d = Math.ceil(d.getTime())
    let timing = d - time
    let ans = ""
    // get years
    if (timing >= 31556952000) {
        let years = Math.ceil(timing / 31556952000)
        timing = Math.ceil(timing % 31556952000)
        ans += `${years} năm`
    }
    // get months
    if (timing >= 2629800000) {
        let months = Math.ceil(timing / 2629800000)
        timing = Math.ceil(timing % 2629800000)
        ans += `${months} tháng`

    }
    // get days
    if (timing >= 86400000) {
        let days = Math.ceil(timing / 86400000)
        timing = Math.ceil(timing % 86400000)
        ans += `${days} ngày`

    }
    // get hours
    if (timing >= 3600000) {
        let hours = Math.ceil(timing / 3600000)
        timing = Math.ceil(timing % 3600000)
        ans += `${hours} giờ`

    }
    // get minutes
    if (timing >= 60000) {
        let minutes = Math.ceil(timing / 60000)
        timing = Math.ceil(timing % 60000)
        ans += `${minutes} phút `
    }
    return ans
}