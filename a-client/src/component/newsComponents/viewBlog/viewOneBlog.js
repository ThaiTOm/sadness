import React, { useState, useEffect } from 'react'
import { getCookie } from '../../../helpers/auth';
import axios from "axios"
import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css'
import LikePost from "../../../helpers/news/seeLike"
import Comment from "../../../helpers/news/comment"
import { Link } from "react-router-dom";
import ArrowBackIosOutlinedIcon from '@material-ui/icons/ArrowBackIosOutlined';
import ShareBlog from "../../../helpers/news/shareBlog"
import { IconButton } from '@material-ui/core';
import socketApp from '../../../socket';


function ViewOneBlog(props) {
    const id = getCookie().token
    const [data, setData] = useState(null)
    let socket = socketApp.getSocket()

    useEffect(() => {
        let arr = props.location.pathname.split("/")
        axios.get("http://localhost:2704/api/news/post?" + arr[2] + "&user=" + id)
            .then(value => {
                setData(value.data)
            }).catch(err => {
                console.log(err)
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id])

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
                                    {value.split(".")[1] !== "mp4" ? <img alt={value.slice(100, 110)} src={value} /> : <video alt={value.slice(10, 110)} src={value} />}
                                </div>
                            </div>
                        })
                    }
                </Slide>
            </div>
        )
    }

    return (
        <div className="post_viewing percent">
            <Link className="go_to_previous" to="/news">
                <ArrowBackIosOutlinedIcon />
                <span>
                    Quay lại
                </span>
            </Link>
            {
                data !== null ? <div className="post_viewing_div cA">
                    {
                        data.img !== undefined ? <Slideshow />
                            : <div className="slide-container flex">
                            </div>
                    }
                    <div className="content flex">
                        <IconButton className="menu">
                            <span>&#8942;</span>
                        </IconButton>
                        <div className="content_div">
                            <div>
                                <img alt="this is your avatar" src="/demo.jpeg"></img>
                                <span>{data.time}</span>
                            </div>
                            {
                                data.text.map(function (value, i) {
                                    return <p key={i}>{value}</p>
                                })
                            }
                        </div>
                        <div className="extension_blog">
                            <LikePost props={{ value: data, i: "1", className: "ex night cA", socket, id }} />
                            <div className="ex night cA">
                                <ShareBlog />
                            </div>
                        </div>
                        <Comment props={{ value: data, id: id, socket: socket }} />
                    </div>
                </div> : console.log()
            }
        </div>
    )
}

export default ViewOneBlog
