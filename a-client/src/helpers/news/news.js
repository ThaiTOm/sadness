import React, { useState } from 'react'
import { Link } from "react-router-dom"
import { MenuItem, Menu, Button } from '@material-ui/core';
import NotificationsIcon from '@material-ui/icons/Notifications';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { signOut } from '../auth';
import IconButton from '@material-ui/core/IconButton';
import Modal from '@material-ui/core/Modal';
import Dropzone from 'react-dropzone'
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import axios from "axios"
import { toast } from 'react-toastify';


export const ImageRender = (cb) => {
    const { value } = cb.props
    switch (value.image.length) {
        case 0:
            return <div></div>
        case 1:
            return <div className="one">
                <Link to={"/posts/id=" + value.idBlog}>
                    <img
                        alt={value.image[0].slice(100, 110)}
                        src={value.image[0]}
                    />
                </Link>
            </div>
        case 2:
            return <div className="two">
                <Link to={"/posts/id=" + value.idBlog}>
                    <img
                        alt={value.image[0].slice(100, 110)}

                        src={value.image[0]}></img>
                    <img
                        alt={value.image[1].slice(100, 110)}

                        src={value.image[1]}></img>
                </Link>
            </div>

        case 3:
            return <div className="three">
                <Link to={"/posts/id=" + value.idBlog}>
                    <div className="two">
                        <img
                            alt={value.image[0].slice(100, 110)}

                            src={value.image[0]}></img>
                        <img

                            alt={value.image[1].slice(100, 110)}
                            src={value.image[1]}></img>
                    </div>
                    <img
                        alt={value.image[2].slice(100, 110)}

                        src={value.image[2]}></img>
                </Link>
            </div>

        case 4:
            return <div className="three">
                <Link to={"/posts/id=" + value.idBlog}>
                    <div className="two">
                        <img
                            alt={value.image[0].slice(100, 110)}

                            src={value.image[0]}></img>
                        <img
                            alt={value.image[1].slice(100, 110)}

                            src={value.image[1]}></img>
                    </div>
                    <div className="two">
                        <img
                            alt={value.image[2].slice(100, 110)}

                            src={value.image[2]}></img>
                        <img
                            alt={value.image[3].slice(100, 110)}

                            src={value.image[3]}></img>
                    </div>
                </Link>
            </div>
        default:
            return <div className="three">
                <Link to={"/posts/id=" + value.idBlog}>
                    <div className="two">
                        <img
                            alt={value.image[0].slice(100, 110)}

                            src={value.image[0]}></img>
                        <img
                            alt={value.image[0].slice(10, 100)}

                            src={value.image[1]}></img>
                    </div>
                    <div className="two" >
                        <img
                            alt={value.image[1].slice(100, 110)}

                            src={value.image[2]}></img>
                        <div style={{ position: "relative", width: "90%" }}>
                            <img
                                alt={value.image[2].slice(100, 110)}
                                className="more_image"
                                src={value.image[3]}></img>
                            <span className="last_image">
                                + {value.image.length - 4}
                            </span>
                        </div>
                    </div>
                </Link>
            </div>
    }
}

export const HeaderPage = (props) => {
    let value = props.value || []
    let arr = window.location.href.split("/")
    const [openNoti, setOpenNoti] = useState(null)
    const [anchorEl, setAnchorEl] = useState(null);
    const [valueSearch, setValueSearch] = useState("")
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogOut = () => {
        signOut();
        window.location.reload(false);
    }
    const handleClickNoti = (e) => {
        setOpenNoti(e.currentTarget)
    }
    const handleCloseNoti = () => {
        setOpenNoti(null);
    };
    return (
        <div className="navbar_auth">
            <img width="75px" height="70px" src="data:image/png;base64,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" />
            <div className="extension_auth">
                <div className="inner_title">
                    <Button className="notify_icon" aria-controls="simple-menu" aria-haspopup="true" onClick={handleClickNoti}>
                        <NotificationsIcon />
                    </Button>
                    <span className="title" id="notify_title">
                        Thông báo
                        </span>
                </div>
                <Menu
                    id="menu_main_page"
                    anchorEl={openNoti}
                    keepMounted
                    open={Boolean(openNoti)}
                    onClose={handleCloseNoti}
                >
                    <p>Thông báo</p>
                    {
                        value.map(function (data, i) {
                            return <Link to={data.type} key={i}>
                                <MenuItem className="notifications_span">
                                    <span className="simple_menu_span">
                                        {data.number}{data.value}
                                    </span>
                                </MenuItem>
                            </Link>
                        })
                    }
                </Menu>
                <div className="inner_title">
                    <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick} className="account_icon">
                        <img className="avatar_image" alt="avatar_image" src="demo.jpeg" />
                    </Button>
                    <span id="account_title" className="title">
                        Tài khoản
                        </span>
                </div>
                <Menu
                    id="menu_main_page"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                >
                    <MenuItem onClick={handleLogOut}>
                        <span className="simple_menu_span">
                            <ExitToAppIcon /> Đăng xuất
                            </span>
                    </MenuItem>
                </Menu>
            </div>
        </div>
    )

}
export const NavbarRight = () => {
    const [open, setOpen] = useState(false);
    const [file, setFile] = useState([])
    const [text, setText] = useState(null)

    let arr = window.location.href.split("/")

    const dragFile = (file) => {
        let data = file[0];
        let reader = new FileReader()
        reader.readAsDataURL(data)
        reader.onloadend = () => {
            setFile(value => [...value, reader.result])
        }
    }
    const handleDeleteImamge = (index) => {
        const arr = [...file]
        arr.splice(index, 1)
        setFile(arr)
    }
    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post("http://localhost:2704/api/idea", { text, file }).then(res => {
            toast.success(res.data.message)
            setText(null)
            setFile([])
            handleClose()
        }).catch(err => {
            console.log(err)
        })
    }
    return (
        <div className="navbar_right">
            <ul>
                <li className={arr[3] === "" ? "active_title inner_title" : "inner_title"}>
                    <Link to="/">
                        <div>
                            <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAABmJLR0QA/wD/AP+gvaeTAAAEl0lEQVRYhe2Ya2xTZRiAn++0Xbv1OroLsAtzmmWMMQ0GAYFogJEsExLjlhBjTJaYGKIG4kBHNLoEyYwhRo0JMfLDn5gSZc5N2YgmRlQQdXKp22DcCmwyOruwQtdzTj9/jG5ldKxlt0R5fjXv+36nT76e97zfKdznPrOLuJdFazc+U6ZoyhIhSJkqESm5KQz82NrkORcbT0pww4YNaSHd/DGCmqkSG0NEwEePLy2tra+vjwAYk1kdkub3ENRkZWXINU+sFlZr2pSZBQIDHDz0vRgcDG796djJq0ADJLGD5Rs3zUfXfOkup9i75wNht9umTC7KRd9lXny5Vuq67nelibkej0dXEl4d0RYCyqNLHp4WOYD8vBweKnxAABmBIUM2QMKCkYgwAVjMlmmRi2KxmAEwhIcb8I57sKKiOlM3RJZLKcaYyEem1WwcbhMsr6yq1YXcJaUwz4ZMPEYE1z1VVYNkt8mUIlc8tgyH3Q6Apkk0Vedav58/jv82O4L19fXK4V9PNhgMinxrxw5RkF8wUhC6qXEzqOLt9MYVvOIf5OT5axRkOyjKnTMS7+0Pcvx8H/mZDorzRuN/B27w59mr5LhtLFqQkZjg4d875gLZ+bn5xMolwpHOHgaCQ/T8E6RwngujYbjvjnb10H89xBX/IIXznKQYDQAc6+qlb+DGrbiL1JS7P4oVGO0YiyX5Ds1yDT+s3XbLiFxsPN1mwRQn7rSaMZsME14/qUkSj5UlOSxakIE99faxvLx4PsV5buypKQgxOg+WFs2lKCcdW6oJRUw8JyYtCOCyxm/68eLOceLxSHySzBL/HUFFGS4Nq+Fpk4n7vYkWZmZkAnD8hJeh8MxJTtgk0T5zp7spKV6Et+MU2+repmL9Wmw265RICCEoKy3B6XQkL2gwjm7yc9XP88lne+jsOkNn15kpkYuy5slV1G3bkryg0aRgNCpoWgS7zU7tS9s51XEC32UfqqomLCAUgdlsQI9EaDn4LYAf2AuAJFJZUb4KWJ20IIDVkULwehhNjSCEoHRhGaULyxKWg+FfwuEyo6pqVLCvrXl/XTS/uNmzGGhnTF8kJKgoArvTjBrW0TWJlDIpueg1ADRNj4b02LwQ4oSUch/wbNKCUUwpBkyTfNH0dniHP0hxNk76TSnlJmJ2cUJBTVM53d2NrusTld4VKSUXfT4am5skIBC37r8YhBDnXti8tReYf5tgxIyOBj29Pfj7/bjnuEcWffl1E41NTZOSi8POtmbPV/ESvb1XL9wh2Nq471J5ZdW+wMDApp0NDXLH9tdEdlYWACuXraC9vb3lvO/ipclaKUL0yIg40NbiaR+vZkhVPweG+voclyHmvbi6utoQCMpPEdQ4HQ5ZV7td5OXmDieFfDo723FgsoL3wtgDmVhfWfWhhFes1jT5+qu1orCgcFYFx85i2dq8fwtSvh8M3hDv7t4tT3d3z4bXCHHP3GdP/9X6YFFJSNW08p+P/CKHQkPeb1oaf5hpOZjgv5l1ldVvCOQ7QighLaIVf9fyxYWZEoty1+PWoWbPLoTcLKU8qoQNgZmSus//in8BKHWM6RpM/68AAAAASUVORK5CYII=" />
                            <span >
                                Cuộc trò chuyện
                        </span>
                        </div>
                    </Link>
                </li>
                <li className={arr[3] === "news" ? "active_title inner_title" : "inner_title"}>
                    <Link className="home_icon icon_nav" to="/news">
                        <div>
                            <img src="data:image/png;base64,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" />
                            <span >
                                Trang chủ
                    </span>
                        </div>
                    </Link>
                </li>
                <li className={arr[3] === "feedback" ? "active_title inner_title" : "inner_title"} onClick={handleOpen}>
                    <Link className="feedback_icon icon_nav" to="" >
                        <div>
                            <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAABmJLR0QA/wD/AP+gvaeTAAAC50lEQVRYhe2YTUhUURTH/+e+MccPBlwkbQpyKcxTYUYCFw1E0ge0EWlhatZCrI2jAy3a6LKVIwgm9qUgEdbGkMEgHNq0eA9xGteuiwgJxjT13tOiycJ5z94d34iUPxgY7r3n3N+c9+55jwGOOcY7YTs+HLbjw37mFH4mI6CNgDY/c2oJxhaHAmYmUeu6gHkFhKzbtJlJ1MYWhwI6e5LOYtOOjwNoY+BCNjLiKuJE2I6HCXgL8MsPkeQdr3FaFWTmOQAhYr6vEwcA+ZgQM17rxGkJZqPJFJNoKaPyXi07AGVU3sskWrLRZEo39kjjeg9Gr96qk5A1hyFhwFiz5p+sOs05CkaudD0EQ/syHgQCxq3UdMHhcb4HGT0lNyrYEredxt0OyYkSurjhuKfnpslKQckdX0yEEQAJbw0kAADR1p7Tskz9fkIoLlh46mQN5qaSEB4Tu6GUwrXufnz68tWboNnaWcuGXBVq/2quf9vAm/R7GMbBBKVUWF/f8LyeAFDkctdzANf3XckM5sLKFgMRAVTYQOzUdMFgAACfrd7oWM0FdwjU4eoHQLHKfysOAQEyDK2YXeP29nZjNReccpOsCVViZHgQRMVf4plX81h4Z/2soANOFdzdbXZ2VtZVb3YzeKZogxJQYByLxQK5ijPbe8eZGUpJlPIS71vBX6TTacdmRwAECQgyiv6ACKwUoHHYPDfq6spy3Lt705c282DsGXKbW57WexasqqzAxfPnYGiewr1IKTH29IX/gh8/ryF66UbRYn+i/ajzAgkBQxz+O4Tbz/BWf3/57jToKEjA49K6OMD0yGn4yL/y/3s0LQ3Wm5lElW6cmUlUNS0N1uvGaXXdRqs/JpWyaFtN6G5E22pCKmU1Wv0xnTgtQSlEJ4AtUnJUyw5APmYrn8MzWoIqGOqTUA3LzaOW07xpD0ya9sCk09xy86gloRpUMNSns6evmHZ8xbTjK37m1Por7G8weMHPfMf8F/wAGwz06hxIwekAAAAASUVORK5CYII=" />
                            <span>
                                Góp ý và cải thiện
                    </span>
                        </div>
                    </Link>

                </li>
                <li className={arr[3] === "help" ? "active_title inner_title" : "inner_title"}>
                    <Link className="contact_icon icon_nav" to="/help">
                        <div>
                            <img src="data:image/png;base64,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" />
                            <span >
                                Trợ giúp
                    </span>
                        </div>
                    </Link>
                </li>
                <li className={arr[3] === "policy" ? "active_title inner_title" : "inner_title"}>
                    <Link className="policy_icon icon_nav" to="/policy">
                        <div>
                            <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAABmJLR0QA/wD/AP+gvaeTAAAEUklEQVRYhcWYT2hcVRSHv3NnTDqTTmNLEUzdCNpUnzb48igWoYVIsQWhuGhxoyKCmyCIaPeCC2tBUNqNGynqpqULi1KspGMXNbQzaYzhpflTwSotjUradDozL5POOy4yk04mbyaZN5n2t3v33nPPx3333HPuFZqU67rrPc/rBrp83+8AMMZkVfV6LBabtCzrbjPzS6MGqipDQ0MvAQeBPsCqNxwYAwZU9YTjOL+KiLYE0HXdtnw+/ybwEbC1EScVmlTVw/F4/FvLsgprBphKpfaIyNEmwKo1YYzpt217YKWBdQGTyWQ0kUh8AhxaaWwYqepX8Xj8vXqrWdNpOp3uVNXTIrJrrcGWAIicV9X9juPMBvbXggOSwAuthKvQZaAvCNJUN0xNTbWr6mkeHByALSLfu67bVt0RrW6YnZ39rNZvnZ7J0LWliyPHjjNz+04oko2dCd59fR+JjviSdlXd7Xnep8AHle1LfnEpWn+qbgfIegW2busmQp7khYvk83OhAI+fOs+BvbvY0dMd1K3GmD2V0b24gqVz7mgQHMDd3ByPRAzz3h127XgmFBzAiR8HKRaLtbrF9/2j6XR6u+M481CxBz3Pe4u655zQUAoIr22q+kb5IwqL6evDlSxFDJG2Tfxw9hzZnBfKey638tYQkUOq+rWIaBSglFtXlSVMJMapM5eY/ncmFOAq1T08PPwiMFj+xQdb6S2MisXiQbi/B/seIkugRKQPwLiuux549iHzBOn5kZGRjmip2AxVCMRi7Tz1ZBeygrXvw8TVv5mfv9fI9DI3N/d0FOgKAwfwxOObcezAA3eZ/puZ5eZ0Y4FljNliVDURBg5A17wAq5pfdcOyXNyIpv+5xfjUX8jymmOJfC1y63YmlI+oiGRUw+WITCbH4MWxULarkYjcMcCNlnloUr7vX4+uW7duIp/PKyEjORqJ8Oq+nUSjkcD+bDbPmZ8vhZla29vbp6KWZd1Np9Nj1L8+1tS9YpHfRq/S3ha8nbOryL01NNrT05MtzzpASECAP6/dDGtaUyIyAPdT3ck199C8TkAJsLe39wIw8VBxlmrctu2LUAIUEVXVI/Us/JBHURiJyOHyE8niCRuPx7+hzirG2oKjtAW6oqrflT8WAS3LKhhj+iG4sn80EWfyj2uthlOgv3wfgaprp23bA6lU6gsReT/I2veyDP8+zqbODRTvNVSZLMoYw2ObN9bq/txxnGRlw7LD2XXdNs/zzqrq7lAE4ZUEXqlcPQh4WbAsq6Cq+1l4jnhQugy8Vg0HAYAApTeSPuCXFoPBwsoFvstADUBYgMxkMntU9WNqBE6TUuDLWCy2txYcrLJAGBoa6lPVY8C2NYK7wkK0JlcaWL/SLKm3t/ccsF1V36G5jDMhIm8DPauBg5CP6KlUaqeIHBCRl4Hn6syjwKiIDIjISdu2Bxv11/StYmRkpKNQKGwVka7y/aZUpd8QkQnHcXLNzP8/Ly+dX/s8Lt4AAAAASUVORK5CYII=" />
                            <span >
                                Điều khoản và dịch vụ
                    </span>
                        </div>
                    </Link>

                </li>
            </ul>
            <Modal
                className="navbar_modal"
                open={open}
                onClose={handleClose}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
            >
                <form>
                    <div className="navbar_modal_header">
                        <p>Đăng tải ý kiến của bạn </p>
                        <IconButton onClick={handleClose}>x</IconButton>
                    </div>
                    <div className="navbar_modal_body">
                        <span>Ý kiến giúp chúng tôi phát triển hơn</span>
                        <div
                            suppressContentEditableWarning={true}
                            contentEditable
                            id="txtSearch"
                            onInput={e => setText(e.target.innerText)}
                        >
                        </div>
                        <span>Thêm ảnh chụp màn hình</span>
                        <Dropzone
                            style={{ marginTop: "20px" }}
                            className="inner_title"
                            onDrop={acceptedFiles => dragFile(acceptedFiles)}>
                            {({ getRootProps, getInputProps }) => (
                                <section >
                                    <div className="drag_file" {...getRootProps()}>
                                        <input {...getInputProps()} />
                                        <div className="icon">
                                            <CloudUploadIcon />
                                        </div>
                                    </div>
                                </section>
                            )}
                        </Dropzone>
                        <div>
                            <div className="image_post_news">
                                {
                                    typeof file !== 'undefined' ? Object.values(file).map(function (value, index) {
                                        return <li key={index}>
                                            <img alt="image_upload" src={value}></img>
                                            <span onClick={() => handleDeleteImamge(index)}>&#10005;</span>
                                        </li>
                                    }) : {}}
                            </div>
                        </div>
                    </div>
                    <IconButton id="MuiIconButton-root" onClick={handleSubmit}>
                        Gửi
                    </IconButton>
                </form>
            </Modal>
        </div >
    )
}
