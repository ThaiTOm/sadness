import { useRef, useState } from "react"
import socketApp from "../socket";
import ImageIcon from '@material-ui/icons/Image';
import IconButton from '@material-ui/core/IconButton';
import { encryptTo } from "./auth";
import Menu from '@material-ui/core/Menu';
import "../component/style/chat.css"
import { emoji } from "./emoji";

let socket = socketApp.getSocket();

export const handleFileUpload = (e, userId, id) => {
    let file = e.target.files;
    let reader = new FileReader()
    for (let i = 0; i < file.length; i++) {
        reader.readAsDataURL(file[i])
        reader.onloadend = () => {
            socket.emit("sendImageOff", { room: id, image: reader.result, userId })
        }
    }
}
export const messageLiImageRender = (value, i, imgUrl, myRef) => {
    return (
        <li
            ref={myRef}
            key={i}
            className={"messageImage " + value}>
            <input type="checkbox" id={i}></input>
            <label htmlFor={i}>
                <img className={value} alt="" src={imgUrl}></img>
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
export const FormSend = ({ id, userId }) => {
    const fileRef = useRef(null);
    const [message, setMessage] = useState("")
    const [anchorEl, setAnchorEl] = useState(null);

    const handleSubmit = e => {
        e.preventDefault();
        setMessage("")
        if (message) {
            let value = encryptTo(message)
            socket.emit('sendMessageOff', { room: id, message: value, userId });
        }
    }
    const emojiSubmit = (e, emo) => {
        e.preventDefault()
        let value = encryptTo("&#" + emo + ";")
        socket.emit('sendMessageOff', { room: id, message: value, userId });
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
                        <div className="inner_title">
                            <IconButton className="image_upload_message_icon" onClick={useRefTrigger}>
                                <img alt="image_upload_icon" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAABmJLR0QA/wD/AP+gvaeTAAADRUlEQVRIieWVz28bRRTHP7M7dvCPNg0kEWDTQ+khJ6SqF/4CqnIgElIlzsgK4sQBFSFOuXFAnHKJUg5ISOWHIqQQEaFarUoVVaitgdRBdROJipA6tfMDJ66drO2Z10NIm3XsOHZygq+02pk3b95n3uzbGfi/STUbSCQSrzmOMwQUlVJ3RWQWyIyNjVWPFHz+/IU+48gFgZOA7o6G3leKcJ2/sVbWrMiyMXZ5+y3LNWM29gRWbIniZnJy/EpT8Llzb7+kunRaKdUTCUeqIA4QaDMJASwoAZGaMZRK5QDCp8mp8U/qnTWA0e67IR048eEH7znRSLirTeDuJNzdhqvXp7l6ffrjRGJIKyU3YrHY1PDwsH0KViLxnp5uFY2EcSPHCL7Qh3KcDvlgvS22clnisZcRQVlrL2rtXMxms58BHwHsiR7s7UdpDY7T8eOEwujjJxqt6c2dhh+sFMp193h3IsfVjcwLjcGtgqmmf99Bld5pNFxWI0UDmng0RNVYHhTLWJG2qUqpp+ADZxzWLgoIug7a6Tjz9sFrXoWCVyW36VExFoCKNcyv5w8aohYMBjM7nQNvdc0KS+Utn+3aYoa59Tzdr4boDx9rFeL+yMiIt9NpmbEV29A+V8hx759HGGv5cSGNZ2qtQqV3d1qCLyd/4Ne5WZ+t4G2SXLzn7/+dqZ/aOXg6fYfbmbt8nZxkIZcFQET4aeEPKsb4fOfXc8ysLDaNtbui9wU/XMkxcSMJQMVUuTT5LYXHG9zM/clSeb3hnJ+X5smVix2ARRBr8aoVvpwap2KeXb0b5SJfXJvgdv6vplnt/t5ifTtSGh0d9U3cU9XV1Tzfz9wiX1j12V2t4cVepMXBse5tknr0gDM1X04Ztq/N5uBacYPBUwMMnhrYF7CvPEF4lrG1cr/epfO7rw2J0BwsIoe+AZqpVrPNwUqp9k/9A6pU8pqAHYy1jU+ow2inEMtiV+vHtovL8vvK6hq/zczS39d7JFBrLb/cSuG6TvX1MwMPr0z4xxXA2bNDgb5YYdwY+9aRUP+V6zocD3dd+u6br4bqxzRAKjVWJcXgG4PvvELN9HcKei6onw+FgqddR53WrorrgHvnZDz++WEW/9/REz15Yuu7CLn4AAAAAElFTkSuQmCC" />
                            </IconButton>
                        </div>
                        <IconButton aria-controls="simple_menu_emoji" aria-haspopup="true" onClick={handleClick}>
                            <img alt="emoji_image" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAAABmJLR0QA/wD/AP+gvaeTAAAC/klEQVRIie2SX2jVdRjGn+9vO5PTFuMcK9ESFHXIiiQmjUDCYDbXRX9uRjACwwuhP8JCuoiiIxRUohdBfxbDi9kIpIv+UyAhrjDoJGp6IVoMzTnz7HjmdP9+7/M+XvzOOW47u/Vuz9WX7/t+n8/L+3yBJS3pbilUDkeem2iNQpR2V9zxXdPpuU0/dU201kVMOzXW9XNm+HBHsTnFaH2lTnA6Jm6cO5a9nEPwhZDoziF8IikfAk4defbm9sr9j8+UNst1Jo5DPrbwKgA0ePSBpDxdeTPlGYczwcLFlieKxUOPF74cbP9/w6KQENDrAkkhNvVW7mVhL12B1FWa3gcAc6VIgJToum7UJF0g1eyOntjCiYNthfYayFPfNJ10qp8U3PX0953XN327rbSZVBcpOH3PC0czJQAwA8qm4y/+ns32HF/eCNo60gdIwUxNNsuDOSiaB0mm9rdIjZGCW9jtjvdIBad+e/5oZrDaRwcpkKq+7flzxb/Df93/Mqk/yrXWBzZeeawGsv2X5qI79pabXqKpk4RReiUgVB1tEQgA5BDcXANWrsUeHqmBAMD0rRv9pCZJpMpGQ93Hsn/P7SEBWwQCAIw1QiqpGxoXhYSGxl5S91AaJwW6tg60F7fMMzKBlhgtVExfa5YM4NRoDeTrJ8c30PB2kom/Q2KIVHDj531tSlUhQrIuW7Curap3+k53QQ5rSIWheRBBYTa2T0mlSY3Wh6l+M99nycQPByu8Xum12GEUjHfeHlh3aX3T8MiglOSACF/svrDy2jzIV+3FHU51lL/gh93HV0/tOHHfD6ROJuvx3GcthQeTTCrBe/P+tZeL+9eM3HJG5wF0l+1+jWLfU/GOAGBwSyljrn3JdBptXDbdBwABQTH93SREv3c2zH5UzmTGzEEqSMgASAMQgFNBeO3mmlWdb/y3eqqaMwD0tSm1TIVHYwA+U3dt19nsxbm7/rjl6iaR9TOhrvTmhRX/HHjoUjpEDSsrdU9ZPDEVxnIjqyZrfsKSlnRXdRsr+i4fv8vwiwAAAABJRU5ErkJggg==" />
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

            {/* <button type="submit">
                <img alt="submit_button_image" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABmJLR0QA/wD/AP+gvaeTAAABu0lEQVRoge2ZO0oDURSGvyOChYXaRVCitmJlbaWtC7ATUWzEJdjY6AZcgG5BC7W10p1Y+ETE528Rg3EymcmdzONemA9C4Mwk+T8yuTlzLtTU1ASNpZ0gaQHYBuaBF+AcODazx4KzDY6kXUmf6uZO0p6ksaoz9kTSiqTvmPBhiEi6TAnvt4ikeweBNk+SDiSNV52fDOH9EhlQoHqRnASqE8lZoHyRggTKEylYIDeRnq2EJGV90ww8A0fAgZk9uLzQF4E2ziJJApvAFDD7+5gDJoGhwXOm0rdIksBaTHkYaPBfqgmMZI6aTKqIq0AcQ7SkmsDM73MTyLMvugU2zOwseiAPgV6M8yfTlmskfWYK78CSmV13FosUiGMEmKYlMwMs4vZNnZrZamehbIEo08Chw/kPZjbRWShjRUnC9XLqWtqHcwrSL3GXkAtX0UKRAnn/iN+A/WgxD4GyltF1M7uJHnAV8O6PLElglMBbiSCaubJXoV5kbqerFsgcPBXf78SqEgj2pj7YsUqwgy0vRovBD3cvHIJ7OV5flvQVXPBOJO1I+vA5eD+bfPPAFq1NvlfgAjgJYpOvpqbGf34ADyqvY/et3aUAAAAASUVORK5CYII=" />
            </button> */}
        </form>
    )
}