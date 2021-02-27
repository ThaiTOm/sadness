import socketApp from "../socket";
import { Link } from "react-router-dom"
import PolicyOutlinedIcon from '@material-ui/icons/PolicyOutlined';
import DynamicFeedOutlinedIcon from '@material-ui/icons/DynamicFeedOutlined';
import ContactSupportOutlinedIcon from '@material-ui/icons/ContactSupportOutlined';
import HomeIcon from '@material-ui/icons/Home';
import MessageIcon from '@material-ui/icons/Message';


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
            className={"messageImage" + value}>
            <input type="checkbox" id={i}></input>
            <label for={i}>
                <img src={imgUrl}></img>
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
            })
        </li>
    )
}
export const executeScroll = (myRef) => {
    try {
        myRef.current.scrollIntoView()
    } catch (error) {
    }
}
export const navbar_right = (
    <div className="navbar_right">
        <ul>
            <li className="inner_title">
                <Link className="message_icon" to="/">
                    <MessageIcon />
                </Link>
                <span className="title" id="m_title">
                    Tin nhắn
                </span>
            </li>
            <li className="inner_title">
                <Link className="home_icon icon_nav" to="/news">
                    <HomeIcon />
                </Link>
                <span className="title" id="h_title">
                    Trang chủ
                </span>
            </li>
            <li className="inner_title">
                <Link className="feedback_icon icon_nav" to="/feedback">
                    <DynamicFeedOutlinedIcon />
                </Link>
                <span className="title" id="f_title">
                    Góp ý và cải thiện
                </span>
            </li>
            <li className="inner_title">
                <Link className="contact_icon icon_nav" to="/help">
                    <ContactSupportOutlinedIcon />
                </Link>
                <span className="title" id="c_title">
                    Trợ giúp
                </span>
            </li>
            <li className="inner_title">
                <Link className="policy_icon icon_nav" to="/policy">
                    <PolicyOutlinedIcon />
                </Link>
                <span className="title" id="p_title">
                    Điều khoản và dịch vụ
                </span>
            </li>
        </ul>
    </div>
)
