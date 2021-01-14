import React, { useState, useEffect } from 'react'
import "../../style/viewBlog.css"
import axios from "axios"
import Skeleton from './Skeleton'

function ViewBlog() {
    const [start, setStatr] = useState(0)
    const [end, setEnd] = useState(3)
    const [blog, setBlog] = useState([])
    useEffect(() => {
        axios.get("http://localhost:2704/api/news/data?start=" + start + "&end=" + end)
            .then(async res => {
                let a = res.data.data
                for await (let value of a) {
                    setBlog(a => [...a, value])
                }
            })
            .catch(err => {
            })
    }, [])
    // { console.log("rn 1") }
    return (
        <div className="viewBlog">
            {blog.length === 0 && <Skeleton />}
            {blog !== undefined ? blog.map(function (value, i) {
                return (
                    <li className="viewBlog_li">
                        <div className="contain_blog">
                            <div className="text_blog">
                                {value.text.map(function (data) {
                                    return <p>{data}</p>
                                })}
                            </div>
                            <div className="image-blog">
                                {value.image.length === 1 ?
                                    <div className="one">
                                        <img src={value.image[0]} />
                                    </div>
                                    : value.image.length === 2 ?
                                        <div>
                                            <img src={value.image[0]}></img>
                                        </div>
                                        : value.image.length >= 3 ?
                                            <div>

                                            </div>
                                            : value.image.length === 0 ?
                                                <div>

                                                </div> : {}
                                }
                            </div>
                            <div className="activities_blog">
                                <li className="like">
                                    Like
                                </li>
                                <li className="comment">
                                    Comment
                                </li>
                                <li className="share">
                                    Share
                                </li>
                            </div>
                        </div>
                    </li>
                )
            }) : {}
            }
        </div>
    )
}

export default ViewBlog
