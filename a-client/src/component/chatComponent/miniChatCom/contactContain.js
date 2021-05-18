import React, { useEffect, useState } from 'react'
import { decryptWithAES, getCookie } from '../../../helpers/auth';
import classNames from "classnames";
import { Modal, Menu, MenuItem, Button } from '@material-ui/core';
import axios from "axios"
import { toast } from "react-toastify"
import { getTime } from '../../../helpers/message/message';


// This function is use for render list of contact
function ContactContain({ onClick, message, users, idRoom, target, nread, socket }) {
    // const [room, setRoom] = useState(idRoom)
    // msg == new message send by real time, message == old message 
    const [read, setRead] = useState(false);
    const [active, setActive] = useState(false);
    const [value, setValue] = useState("");
    const [count, setCount] = useState(nread)
    const [anchorEl, setAnchorEl] = useState(null);
    const [outMessage, setOutMessage] = useState(false)
    // the user in the room is online or not
    const [onl, setOnl] = useState(null)
    // lu last user, clu contain last user and message
    const id = getCookie().token;

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };



    const handleClose = () => {
        setAnchorEl(null);
    };
    // handle close and open out meessge
    const handleOpenOut = () => {
        setOutMessage(true);
        handleClose()
    };

    const handleCloseOut = () => {
        setOutMessage(false);
    };

    let sliceMess = (a, user, value) => {
        if (value.seen === "false") setRead(true)
        if (a.length > 0) {
            let mess = a.length > 10 ? a.slice(0, 10) + "....." : a
            setValue(user + mess)
        }
        else setValue(user + "đã gửi hình ảnh")
    }

    const validateImage = (value) => {
        let a = value.data[0] ? decryptWithAES(value.data[0]) : value.data.data[0] ? decryptWithAES(value.data.data[0]) : "đã gửi hình ảnh"
        if (value.id === id) sliceMess(a, "Bạn: ", value)
        else sliceMess(a, "", value)
    }
    const HandleOutMessage = () => {
        axios.post("http://localhost:2704/api/msgC/outMessage", { id, idRoom, users })
            .then(res => {
                console.log(res.data)
            })
            .catch(err => {
                console.log("error")
            })
        toast.success("Yêu cầu của bạn đã được thực hiện")
        handleCloseOut()
    }
    // if position change call this
    // else validate this
    useEffect(() => {
        message && message.idRoom === idRoom && validateImage(message)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [idRoom, message])

    useEffect(() => {
        socket.emit("joinChatBack", { idRoom })
    }, [idRoom, socket])

    useEffect(() => {
        if (target === idRoom) {
            setActive(true)
            setRead(false)
            setCount(0)
            socket.emit("seenMessage", { id: idRoom, userId: id })
        }
        else {
            setActive(false)
        }
    }, [target, idRoom, id, socket])
    useEffect(() => {
        for (let value in users) {
            if (value !== id && users[value] === "online") {
                setOnl(true)
                break;
            }
        }
    }, [id, users])

    //if last people send is who then assign that
    var classN = classNames({
        "contact_container": true,
        "active_contact": active,
        "not_read_contact": read
    })
    return (
        <div className={classN} >
            <div className="contact_contain_text">
                <section onClick={() => onClick(idRoom, users, id)}>
                    <p>
                        {
                            value.slice(0, 4) === "Bạn:" ? <span className="content">
                                <span style={{ fontWeight: "800", fontSize: "18px" }}>{value.slice(0, 4)}</span>
                                <span dangerouslySetInnerHTML={{ __html: value.slice(4, value.length - 1) }} /></span>
                                : <span dangerouslySetInnerHTML={{ __html: value }} />
                        }
                        {
                            message && message.type === "shot" ? <p className="shot-span">
                                Tin nhắn đang chờ
                    </p> : console.log()
                        }
                    </p>
                    <p className="timing">
                        {message && getTime(message.date)}
                    </p>
                </section>
                <div className="setting_chat">
                    <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
                        ...
                    </Button>
                    <Menu
                        className="setting_chat_modal"
                        id="simple-menu"
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                        keepMounted
                    >
                        <MenuItem>
                            <span onClick={handleOpenOut}>
                                <img alt="out_chat" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABmJLR0QA/wD/AP+gvaeTAAABHklEQVRIidWVMUpDQRRFz1VThCxCsNDKHegOJIJaRMEqrYtwHxZiGi1SiggpRIlbEGNvYy8aEK+FCJ/xj3/m+1Pkdm/evHtm5s0wMO9SOGC7BewCy5Gad2Ak6SGbZrtl+97VmtrergPoJZj/KGkHC0G8mrGetTqAMM6prT/pL9lu216ZGQDoAxPbe7MCnAJj4ML2QeMASa/AFnAHDELIUkX9ETCJJW2PCmEbWATObD9LuoVmjihdto8zHpoLdR3bN7Y/bO8XPZu4ph3gEtgEDiWdF/NVPUhRH9gAepKGYbIJwAlwLempLPlvgKQ3oNQcfvfgM8M7aW4IiK6kRNH3EZW/P5xxwg2d2u6meMa+zB1gnfIevQBXkh6zdzCX+gK5swNxrVtbyQAAAABJRU5ErkJggg==" />
                            Thoát cuộc trò chuyện
                            </span>
                            <Modal
                                aria-labelledby="simple-modal-title"
                                aria-describedby="simple-modal-description"
                                open={outMessage}
                            >
                                <div className="contain_block">
                                    <div className="head">
                                        <button onClick={handleCloseOut}>&#10005;</button>
                                    </div>
                                    <div className="middle cA">
                                        <p> Bạn sẽ không thể nhận và trả lời tin nhắn của người này và đoạn tin nhắn này sẽ bị xóa đi ở cả 2 phía </p>
                                    </div>
                                    <div className="bottom">
                                        <button onClick={HandleOutMessage}>Xác nhận</button>
                                        <button
                                            onClick={handleCloseOut}
                                            className="cancel">Hủy bỏ</button>
                                    </div>
                                </div>
                            </Modal>
                        </MenuItem>
                        <MenuItem onClick={handleClose}>
                            <img alt="delete_icon" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABmJLR0QA/wD/AP+gvaeTAAABoElEQVRIie2Vv2sTYRjHP89zkmTRRadOHqEUXEJyGTNJBynFzbgVcSgI7k4u3XRytujgZvB/cDlx6F1CFreIBTta/FElUO55HLwLSaBJ63XMd3q/75f7ft73veNeYYF6vV5Qr9dfuPsOcG0u/iki70aj0W63283O6riyCBCG4QN3fwyMgc9z8Zq7PwzD8APw+lyAwWBw08yuF97MtvLhUxF5P/fsbXd/rqpbaZoOi0lV/dZsNr8UXgDiOL5aq9XuAy+LuRJyYHc8Hr/tdDq/FKBara4B+5dQTt6xn3f+O6IgCI7N7NkllE8UBMFxQZuo3+/fMrOdMsWq+qbVan0q/MxLzrJsXUSelAFkWfYRmAC0TNl5tAywJyJtYAigqpuquplnwzzb+2+Aux9GUZQCJwBmNjSz4ps/iaIodffDMjsorRVgBVgBllyZwKMkSe4AGwAi8grA3QE2kiTpuXt4EcCPaZP/a9qFd/e7U/EN4J7I7B3l7t+n/cwRVSqVA+Bo0YqW6KuqHpwJaDQav81sG4iB0wsUnwKxqm632+0/08FfUMOI+5EjNxEAAAAASUVORK5CYII=" />
                            Xóa cuộc trò chuyện
                        </MenuItem>
                        <MenuItem onClick={handleClose}>
                            <img alt="seen_icon" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAAABmJLR0QA/wD/AP+gvaeTAAABCklEQVRIie3UPWqEUBSG4dcwjYW4hoDYWWnhVK5jJmtJl61MNuAa/CsUFHQJWlhaWpxUBkfQyRWnCMnXXQ58zz2IF/6jEG1+yPP8Q0QuB/R+ep73Ph1O84mIXIHXA5A34Bt5WQw1jsldzxJ5Sn4HIiJ0XYeIPAcREeI4JgxDiqI4HpmAuq7RNA3TNPchTdNQVdVDIAgCLMta7TmtDYZhIIoiRIRxHHFddxWwbXvrruubGIaB7/sA5HlOlmW7gM1NABzHASBJEsqypG1b+r5XAjY3mUPn8xlgFwAPNplDAGmaKgM/RibIsix0XVcCQPE/2QMoI3uzRNYfILXc9Sy/yQ24HoDcDuj4q/kCxCxyJ7UVsuwAAAAASUVORK5CYII=" />
                            Đánh dấu là đã đọc
                        </MenuItem>
                    </Menu>
                </div>
                <div className="left-side">
                    {count > 0 ? <div className="count"> {count}</div> : ""}
                    {onl === true ? <div className="dot"></div> : console.log()}
                </div>
            </div>
        </div >
    )
}

export default ContactContain
