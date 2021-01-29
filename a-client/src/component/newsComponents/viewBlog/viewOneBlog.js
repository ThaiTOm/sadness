import React, { useState, useEffect } from 'react'
import { getCookie, signOut } from '../../../helpers/auth';
import axios from "axios"
import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css'
import LikePost from "../exNews/seeLike"
import Comment from "../exOne/comment"
import { Link } from "react-router-dom";
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { MenuItem, Menu, Button } from '@material-ui/core';
import NotificationsIcon from '@material-ui/icons/Notifications';

function ViewOneBlog(props) {
    const id = getCookie().token
    const [data, setData] = useState(null)
    const [anchorEl, setAnchorEl] = useState(null);
    const [open, setOpen] = useState(null)
    let arr = props.location.pathname.split("/")

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogOut = () => {
        signOut();
        window.location.reload(false);
    }
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClickNoti = (e) => {
        setOpen(e.currentTarget)
    }
    const handleCloseNoti = () => {
        setOpen(null);
    };
    useEffect(() => {
        axios.get("http://localhost:2704/api/news/post?" + arr[2] + "&user=" + id)
            .then(value => {
                setData(value.data)
            }).catch(err => {
                console.log(err)
            })
    }, [])

    const Slideshow = () => {
        const zoomInProperties = {
            indicators: true,
            scale: 1.4
        }
        return (
            <div className="slide-container flex">
                <Slide {...zoomInProperties} className="slide" autoplay={false}>
                    {
                        data.img.map(function (value, i) {
                            return <div key={i}>
                                <div className="image-container" >
                                    <img src={value} />
                                </div>
                            </div>
                        })
                    }
                </Slide>
            </div>
        )
    }

    return (
        <div className="post_viewing">
            <header>
                <div className="navbar_auth">
                    <p> Recal </p>
                    <div className="extension_auth">
                        <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClickNoti}>
                            <NotificationsIcon />
                        </Button>
                        <Menu
                            id="menuContainerMessage"
                            anchorEl={open}
                            keepMounted
                            open={Boolean(open)}
                            onClose={handleCloseNoti}
                        >
                            <MenuItem onClick={handleLogOut}>
                                <span className="simple_menu_span">
                                    Đăng xuất
                                </span>
                            </MenuItem>
                        </Menu>
                        <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
                            <AccountCircleIcon />
                        </Button>
                        <Menu
                            id="menuContainerMessage"
                            anchorEl={anchorEl}
                            keepMounted
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                        >
                            <MenuItem onClick={handleLogOut}>
                                <span className="simple_menu_span">
                                    Đăng xuất
                                </span>
                            </MenuItem>
                        </Menu>
                    </div>
                </div>
            </header>
            <Link className="go_to_previous" to="/news">
                Quay lại
           </Link>

            {
                data !== null ? <div className="post_viewing_div">
                    {
                        data.img !== undefined ? <Slideshow />
                            : <div className="slide-container flex">

                            </div>
                    }
                    <div className="content flex">
                        <div className="content_div">
                            <img src="/demo.jpeg"></img>
                            <span>{data.time}</span>
                            {
                                data.text.map(function (value, i) {
                                    return <p key={i}>{value}</p>
                                })
                            }

                        </div>
                        <div className="extension_blog">
                            <LikePost props={{ value: data, i: "1", className: "ex" }} />
                            <div className="ex">
                                comment
                            </div>
                            <div className="ex">
                                share
                            </div>
                        </div>
                        <Comment props={{ value: data, id: id }} />
                    </div>
                </div> : console.log()
            }

        </div>

    )
}

export default ViewOneBlog
