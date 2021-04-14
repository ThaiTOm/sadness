import React, { useState, useContext } from 'react'
import { Link } from "react-router-dom"
import { MenuItem, Menu } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import Modal from '@material-ui/core/Modal';
import Dropzone from 'react-dropzone'
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import axios from "axios"
import { toast } from 'react-toastify';
import { Notifications } from '../../userContext';
import { signOut } from '../auth';


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

export const NavbarRight = () => {
    const [openNoti, setOpenNoti] = useState(null)
    const [open, setOpen] = useState(false);
    const [file, setFile] = useState([])
    const [text, setText] = useState(null)
    const { value } = useContext(Notifications)

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
    const handleClickNoti = (e) => {
        setOpenNoti(e.currentTarget)
    }
    const handleCloseNoti = () => {
        setOpenNoti(null);
    };
    const handleLogOut = () => {
        signOut()
        window.location.reload(false);
    }
    return (
        <div className="navbar_right">
            <div style={{ marginBottom: "10px" }} className="header" onClick={e => handleClickNoti(e)}>
                <img height="80px" width="80px" alt="logo" src="data:image/png;base64,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"></img>
                {
                    value.length > 0 ? <span>{value.length}</span> : console.log()
                }

            </div>
            <Menu
                id="menu_main_page"
                anchorEl={openNoti}
                keepMounted
                open={Boolean(openNoti)}
                onClose={handleCloseNoti}
            >
                <p style={{ textAlign: "center" }}>Thông báo</p>
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
            <ul>
                <li className={arr[3] === "" ? "active_title inner_title" : "inner_title"}>
                    <Link to="/">
                        <div>
                            <img alt="messageIcon" src="data:image/png;base64,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" />
                            <span >
                                Cuộc trò chuyện
                        </span>
                        </div>
                    </Link>
                </li>
                <li className={arr[3] === "news" ? "active_title inner_title" : "inner_title"}>
                    <Link className="home_icon icon_nav" to="/news">
                        <div>
                            <img alt="home_icon" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAAAtCAYAAAA6GuKaAAAABmJLR0QA/wD/AP+gvaeTAAAH90lEQVRYhe2ZeXCU5R3HP8/77ibZFFwbWCAHhHAo4b6GRKBTUQkIIxY7WTpVqC2lmVoGEEFgqENaQQRECmgxAo0kHNOlapWWGwKEyCUil3S4NgFykAjkIJts9n3fp39wGPfdXZII/sVnZmd2f8fzfPfZ3/tcCw95yEMeOKmuVDWUX9zvDpdt3hwuKipaqIYRoStKrbTbr00aMcJ7r7yeX075varYPtON2k1AP2Dpif5Lpj0Q0Rkul13XtBekwVCESAYZDyj1QgwQBRLjgCLFdg3j00kvvVTp3073o1MSFUMMRLDqjk1VtFbH+i4vu2+il2dlJSiKZQaCcYCtEak1INdIeHviiy8W1Hf0PjJlkCFE7i1dski3PZpwult63Q8WnZGRYdWaNZsNYgYQ0dj8etSAnF8WEzM/fcgQ7Y6x19HJw5BKkiZYf7rfkvOBEhslesUaV6xh0f8FMvkHiPUTIPJUQ0tNGzu22N/X78sM69H+aT5/u+JvCMYH69Z1NixaXkME65rGlVMn0TXN5KssvUp5SfHdl6bVDdIUS9772dmd6sfF7Fr19+Jy9Rzp6SaNDRK9Yo0rVkfsAOLvFeupKOd/27fQp2tXzu7chqei/K7P6/Fgr6tieHIPhif3YEjvx7hx8TwgE1DUHcs3bIip19QWhMgkPd3w7yNgecTsWL1eKOwrfHr8B+k5OZZWRSV7JHLQvQSXuS9Q5Xbzyuw3sEdFUVVRwYp5bxIZG4uj02P4vF4qTh/jlWkTadHKwfpV2bhLy4nqcHuQJYcs1VU/S0szl0R9zCMtpZBCRhuSKABHUcnsewmWhsHFL/bT0mpl5qLF2KOiuHThPM3tdqa/vRCHzYb7izwsVitq6zhKCm+Vr/ty8XeCAQRJWrNmM+81OCEfxOVZWQmKavmGELNE7c2bXMzdy+ix4+idlEyd18vKBW/hqSrH1szOH2bOJiw8nBOHDvLp2mwe7dQZ58gn6danJ/PmLCQqscfdtlRFASFqNF1L9J8O6xOypoVqnRlK8PXLlynYv4+Js9+gd1IyJZcv8/ark+md1JOBz4+k/6C+vDV5IlfcF+mZlMykOXMoO3UiaH9tHA7atGxpE1K8HkpX0DV+2dq1jyiCLBBWf5+UksLjxwjz1jL5L2/S3G7n0J49fJL5IaNfHsPuYwV89EkeVXUSZ2oKn2R+BAge79GLth06gl5LdFwMuTl52Byt77ZbVV1NVXU1CLo//6sx7/1n48aAy78lmGiLovxSSiL97ZrXy4XcfTz17LMMThmGrutkLV2Ct6aSZ1J/wbtZuyksvQHA0dP5XCm5zgTnSPK/PsGpI0f43bTpHNi2lW596qgoKqRZQifCbKYF1ab5fM8DWYG0BS8PSYq/qbKkhHM5O5nw6lQGpwzjWmkpC6ZOIb5jLPZOiczN+O9dwXe4eq2SBSs34/tpNF16Pc6i6a/R44mBHD1yhuQhT+Het4fKq1cD9C+GBpMWVLREJPnbSk4dZ/bid4lu145jBw+wYu4cho95jl0nr/CPj3Op8+kB2/JpBv/cfIhtX11iuHMUK+am46mp5clRo5n1zjuUnPzalCMETzRKdGZmZsTt3ZpfQyoWazgfr17Fga2b+PkLo/jb+r0cPuEO1v73OHamgMVrcxg4aiRf5e4ka9kSVIsVIcyPloT2LpcrrMGib0ZERAXyGbrOoumv0dwehq1jIgtXb6X0mmmXGZLrFdUsztyOaB1Pm+gWLHp9OoYe8BdSy7i1VvgT8EGUQthAAiCEQMpb7x+JjcVmVdl7PJ+j503bXECiGKZVF0NRqL8kaLqBa8sR+nRsSUJcLJ468x4FQPh8pokgqGghZQ3AoL596d65E5/vzqG4rIzobt05d/gwx08XQHhzU147i5fHOnQ02c9evMAlzTzdn/zGzU96xNN5wICAoqXV6mmwaGm3X+NGuR5pi1BVVSU8LGBpmbCFhzPo6REm++XCDyHwYIZCd8D1QI6ANX37TFew68BB1n6+ifzCwkb3+MMRbqfTaTq1QBDRGak77MrZiG+5plB58+aD1RYMKQ8GcwUsD9Xi26acjRjAOdAGVGM4Qu4Ug1JaWEBdbW2TcqUQ24P5TCPtSnWp8tYRHiSIGyGvIELSKjaeuI6PNyFTemy1nn8H85pEOzc6dWApAFbpMeJ83AiraULHTUdC5vjx46uC+QPW9IQNI6ZpFrW1GKr1kpF6TXHkj1rXNVbdujBUQNBd3h+zh5WSTen769bN71ru+OsduxACVfOCMH9fIzKS4qulZrsES121ya5qXoTwO4cI5qWNc15qkug7lMXEzHcUFacAgwHiunQJGX/m9H6TrU3blrRpGzg+LjGx3idx0FJVGXKUoYH3HhnZ2dGaYskDmdCQ+CZy0XIq8tci3/pbifHntA3PfRsssEFXCGljxxZjaClA/n2T+D2EW1eVFNUd0VIgXrZIpX3I6MY0vXzDhhjVwNWQ64QGI8jFYnH+yeksAXClusKcGwOvhN+lNJL0nByLo6hoFohZNO7i0Q/pQYi3yqKjF9S/y2sITb41fW/dungFZYbE+A2IgFvIwEiPhEyrbl14r1kiGA0WHbNz5VAQzqL9V9LqX1WtXr26eW1ExGgQKQKSJbTn+6d8XUC+lBwQCtvCa2o+C7Vw3F/Ru1ZNQzJV18M6Xx02zjzp3sblcoWVQZTw+SKl1epxwPVgu7UfBynv+98dD3nIQ+D/6JEJbQtFRasAAAAASUVORK5CYII=" />
                            <span >
                                Trang chủ
                    </span>
                        </div>
                    </Link>
                </li>
                <li className={arr[3] === "feedback" ? "active_title inner_title" : "inner_title"} onClick={handleOpen}>
                    <Link className="feedback_icon icon_nav" to="" >
                        <div>
                            <img alt="suggest_icon" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAABmJLR0QA/wD/AP+gvaeTAAAC50lEQVRYhe2YTUhUURTH/+e+MccPBlwkbQpyKcxTYUYCFw1E0ge0EWlhatZCrI2jAy3a6LKVIwgm9qUgEdbGkMEgHNq0eA9xGteuiwgJxjT13tOiycJ5z94d34iUPxgY7r3n3N+c9+55jwGOOcY7YTs+HLbjw37mFH4mI6CNgDY/c2oJxhaHAmYmUeu6gHkFhKzbtJlJ1MYWhwI6e5LOYtOOjwNoY+BCNjLiKuJE2I6HCXgL8MsPkeQdr3FaFWTmOQAhYr6vEwcA+ZgQM17rxGkJZqPJFJNoKaPyXi07AGVU3sskWrLRZEo39kjjeg9Gr96qk5A1hyFhwFiz5p+sOs05CkaudD0EQ/syHgQCxq3UdMHhcb4HGT0lNyrYEredxt0OyYkSurjhuKfnpslKQckdX0yEEQAJbw0kAADR1p7Tskz9fkIoLlh46mQN5qaSEB4Tu6GUwrXufnz68tWboNnaWcuGXBVq/2quf9vAm/R7GMbBBKVUWF/f8LyeAFDkctdzANf3XckM5sLKFgMRAVTYQOzUdMFgAACfrd7oWM0FdwjU4eoHQLHKfysOAQEyDK2YXeP29nZjNReccpOsCVViZHgQRMVf4plX81h4Z/2soANOFdzdbXZ2VtZVb3YzeKZogxJQYByLxQK5ijPbe8eZGUpJlPIS71vBX6TTacdmRwAECQgyiv6ACKwUoHHYPDfq6spy3Lt705c282DsGXKbW57WexasqqzAxfPnYGiewr1IKTH29IX/gh8/ryF66UbRYn+i/ajzAgkBQxz+O4Tbz/BWf3/57jToKEjA49K6OMD0yGn4yL/y/3s0LQ3Wm5lElW6cmUlUNS0N1uvGaXXdRqs/JpWyaFtN6G5E22pCKmU1Wv0xnTgtQSlEJ4AtUnJUyw5APmYrn8MzWoIqGOqTUA3LzaOW07xpD0ya9sCk09xy86gloRpUMNSns6evmHZ8xbTjK37m1Por7G8weMHPfMf8F/wAGwz06hxIwekAAAAASUVORK5CYII=" />
                            <span>
                                Góp ý và cải thiện
                    </span>
                        </div>
                    </Link>

                </li>
                <li className={arr[3] === "help" ? "active_title inner_title" : "inner_title"}>
                    <Link className="contact_icon icon_nav" to="/help">
                        <div>
                            <img alt="helpIcon" src="data:image/png;base64,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" />
                            <span >
                                Trợ giúp
                    </span>
                        </div>
                    </Link>
                </li>
                <li className={arr[3] === "policy" ? "active_title inner_title" : "inner_title"}>
                    <Link className="policy_icon icon_nav" to="/policy">
                        <div>
                            <img alt="policy_icon" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAABmJLR0QA/wD/AP+gvaeTAAAEUklEQVRYhcWYT2hcVRSHv3NnTDqTTmNLEUzdCNpUnzb48igWoYVIsQWhuGhxoyKCmyCIaPeCC2tBUNqNGynqpqULi1KspGMXNbQzaYzhpflTwSotjUradDozL5POOy4yk04mbyaZN5n2t3v33nPPx3333HPuFZqU67rrPc/rBrp83+8AMMZkVfV6LBabtCzrbjPzS6MGqipDQ0MvAQeBPsCqNxwYAwZU9YTjOL+KiLYE0HXdtnw+/ybwEbC1EScVmlTVw/F4/FvLsgprBphKpfaIyNEmwKo1YYzpt217YKWBdQGTyWQ0kUh8AhxaaWwYqepX8Xj8vXqrWdNpOp3uVNXTIrJrrcGWAIicV9X9juPMBvbXggOSwAuthKvQZaAvCNJUN0xNTbWr6mkeHByALSLfu67bVt0RrW6YnZ39rNZvnZ7J0LWliyPHjjNz+04oko2dCd59fR+JjviSdlXd7Xnep8AHle1LfnEpWn+qbgfIegW2busmQp7khYvk83OhAI+fOs+BvbvY0dMd1K3GmD2V0b24gqVz7mgQHMDd3ByPRAzz3h127XgmFBzAiR8HKRaLtbrF9/2j6XR6u+M481CxBz3Pe4u655zQUAoIr22q+kb5IwqL6evDlSxFDJG2Tfxw9hzZnBfKey638tYQkUOq+rWIaBSglFtXlSVMJMapM5eY/ncmFOAq1T08PPwiMFj+xQdb6S2MisXiQbi/B/seIkugRKQPwLiuux549iHzBOn5kZGRjmip2AxVCMRi7Tz1ZBeygrXvw8TVv5mfv9fI9DI3N/d0FOgKAwfwxOObcezAA3eZ/puZ5eZ0Y4FljNliVDURBg5A17wAq5pfdcOyXNyIpv+5xfjUX8jymmOJfC1y63YmlI+oiGRUw+WITCbH4MWxULarkYjcMcCNlnloUr7vX4+uW7duIp/PKyEjORqJ8Oq+nUSjkcD+bDbPmZ8vhZla29vbp6KWZd1Np9Nj1L8+1tS9YpHfRq/S3ha8nbOryL01NNrT05MtzzpASECAP6/dDGtaUyIyAPdT3ck199C8TkAJsLe39wIw8VBxlmrctu2LUAIUEVXVI/Us/JBHURiJyOHyE8niCRuPx7+hzirG2oKjtAW6oqrflT8WAS3LKhhj+iG4sn80EWfyj2uthlOgv3wfgaprp23bA6lU6gsReT/I2veyDP8+zqbODRTvNVSZLMoYw2ObN9bq/txxnGRlw7LD2XXdNs/zzqrq7lAE4ZUEXqlcPQh4WbAsq6Cq+1l4jnhQugy8Vg0HAYAApTeSPuCXFoPBwsoFvstADUBYgMxkMntU9WNqBE6TUuDLWCy2txYcrLJAGBoa6lPVY8C2NYK7wkK0JlcaWL/SLKm3t/ccsF1V36G5jDMhIm8DPauBg5CP6KlUaqeIHBCRl4Hn6syjwKiIDIjISdu2Bxv11/StYmRkpKNQKGwVka7y/aZUpd8QkQnHcXLNzP8/Ly+dX/s8Lt4AAAAASUVORK5CYII=" />
                            <span >
                                Điều khoản và dịch vụ
                    </span>
                        </div>
                    </Link>
                </li>
            </ul>
            <span className="logout_icon" onClick={e => handleLogOut()}>
                <svg enable-background="new 0 0 24 24" height="30" viewBox="0 0 24 24" width="30" xmlns="http://www.w3.org/2000/svg"><g><path d="m15 13c-.553 0-1 .448-1 1v4c0 .551-.448 1-1 1h-3v-15c0-.854-.544-1.617-1.362-1.901l-.296-.099h4.658c.552 0 1 .449 1 1v3c0 .552.447 1 1 1s1-.448 1-1v-3c0-1.654-1.346-3-3-3h-10.75c-.038 0-.07.017-.107.022-.048-.004-.094-.022-.143-.022-1.103 0-2 .897-2 2v18c0 .854.544 1.617 1.362 1.901l6.018 2.006c.204.063.407.093.62.093 1.103 0 2-.897 2-2v-1h3c1.654 0 3-1.346 3-3v-4c0-.552-.447-1-1-1z" /><path d="m23.707 9.293-4-4c-.286-.286-.716-.372-1.09-.217-.373.155-.617.52-.617.924v3h-4c-.552 0-1 .448-1 1s.448 1 1 1h4v3c0 .404.244.769.617.924.374.155.804.069 1.09-.217l4-4c.391-.391.391-1.023 0-1.414z" /></g></svg>
                Đăng xuất
            </span>
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
