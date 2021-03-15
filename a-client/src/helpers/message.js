import { useRef, useState } from "react"
import socketApp from "../socket";
import ImageIcon from '@material-ui/icons/Image';
import IconButton from '@material-ui/core/IconButton';
import { encryptTo } from "./auth";
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
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
                <div className={one}>
                    {msgs}
                </div> :
                <div className={two}>
                    {msgs}
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
                                <ImageIcon />
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
                            {emoji.map(function (emo) {
                                return (<span onClick={(e) => setMessage("&#" + emo + ";")} dangerouslySetInnerHTML={{ __html: "&#" + emo + ";" }}></span>)
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