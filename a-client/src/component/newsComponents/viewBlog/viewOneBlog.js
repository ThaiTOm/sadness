import React, { useState, useEffect } from 'react'
import { getCookie } from '../../../helpers/auth';
import axios from "axios"
import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css'
import LikePost from "../exNews/seeLike"
import Comment from "../exOne/comment"

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
    }, [])
    const Slideshow = () => {
        return (
            <div className="slide-container flex">
                <Slide className="slide" >
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
