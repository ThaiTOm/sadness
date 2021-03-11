import socketApp from "../socket";
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
            <label for={i}>
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
            {msgs.length > 60 ?
                <div className={one}>
                    <span>{msgs}</span>
                </div> :
                <div className={two}>
                    <span>{msgs}</span>
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