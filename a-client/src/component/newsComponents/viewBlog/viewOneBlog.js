import React, { useState, useEffect } from 'react'
import { getCookie } from '../../../helpers/auth';
import axios from "axios"
import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css'
import LikePost from "../exNews/seeLike"
import Comment from "../exOne/comment"
import { Link } from "react-router-dom";
import ArrowBackIosOutlinedIcon from '@material-ui/icons/ArrowBackIosOutlined';
import ShareBlog from '../exOne/shareBlog';
import { HeaderPage } from '../../../helpers/news';
import { IconButton } from '@material-ui/core';


function ViewOneBlog(props) {
    const id = getCookie().token
    const [data, setData] = useState(null)

    let arr = props.location.pathname.split("/")

    useEffect(() => {
        axios.get("http://localhost:2704/api/news/post?" + arr[2] + "&user=" + id)
            .then(value => {
                setData(value.data)
            }).catch(err => {
                console.log(err)
            })
    }, [arr[2]])

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
                                    <img alt={value.slice(100, 110)} src={value} />
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
            <HeaderPage />
            <Link className="go_to_previous" to="/news">
                <ArrowBackIosOutlinedIcon />
                <span>
                    Quay lại
                </span>
            </Link>
            {
                data !== null ? <div className="post_viewing_div">
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
                            <img alt="this is your avatar" src="/demo.jpeg"></img>
                            <span>{data.time}</span>
                            {
                                data.text.map(function (value, i) {
                                    return <p key={i}>{value}</p>
                                })
                            }
                        </div>

                        <div className="extension_blog">
                            <LikePost props={{ value: data, i: "1", className: "ex night" }} />
                            <div className="ex night">
                                <ShareBlog />
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
