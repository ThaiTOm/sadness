import React, { useState, useEffect } from 'react'
import "../../style/viewBlog.css"
import axios from "axios"
import Skeleton from './Skeleton'
import InfiniteScroll from "react-infinite-scroll-component";
import { getCookie } from '../../../helpers/auth';
import classnames from "classnames";

function ViewBlog() {
    const [start, setStatr] = useState(0)
    const [end, setEnd] = useState(3)
    const [blog, setBlog] = useState([])
    const id = getCookie().token

    const fetchData = () => {
        setTimeout(() => {
            setStatr(start + 3)
            setEnd(end + 3)
        }, 1500);
    }
    const handleLike = (value) => {
        axios.post("http://localhost:2704/api/news/like", { value, id })
            .then(res => {
                console.log(res)
            })
            .catch(err => {
                console.log(err)
            })
    }
    useEffect(() => {
        axios.get("http://localhost:2704/api/news/data?start=" + start + "&end=" + end + "&id=" + id)
            .then(async res => {
                let a = res.data.data
                for await (let value of a) {
                    setBlog(a => [...a, value])
                }
            })
            .catch(err => {
                return (
                    <div>
                        Có lỗi đả xảy ra bạn hãy thử lại sau
                    </div>
                )
            })
    }, [end])


    return (
        <div className="viewBlog">
            {blog.length === 0 && <Skeleton />}
            <InfiniteScroll
                dataLength={blog.length}
                next={fetchData}
                hasMore={true}
                loader={<Skeleton />}
            >
                {console.log(blog)}
                {
                    blog !== undefined ? blog.map(function (value, i) {
                        return (
                            <li className="viewBlog_li" key={i}>
                                <div className="contain_blog" >
                                    <div className="text_blog">
                                        {
                                            value.text.map(function (data) {
                                                return <p>{data}</p>
                                            })
                                        }
                                    </div>
                                    <div className="image-blog">
                                        {
                                            value.image.length === 1 ?
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
                                        {value.isLiked === true ?
                                            <div>
                                                <input
                                                    defaultChecked={true}
                                                    onClick={e => handleLike(value.idBlog)}
                                                    type="checkbox"
                                                    id={"like_button_label" + i} />
                                                <label for={"like_button_label" + i} >
                                                    <li className="like">
                                                        Like
                                                    </li>
                                                </label>
                                            </div> :
                                            <div>
                                                <input
                                                    onClick={e => handleLike(value.idBlog)}
                                                    type="checkbox"
                                                    id={"like_button_label" + i} />
                                                <label for={"like_button_label" + i} >
                                                    <li className="like">
                                                        Like
                                                    </li>
                                                </label>
                                            </div>}
                                        <div>
                                            <li className="comment list">
                                                Comment
                                        </li>
                                        </div>
                                        <div>
                                            <li className="share list">
                                                Share
                                        </li>
                                        </div>

                                    </div>
                                </div>
                            </li>
                        )
                    }) : {}
                }
            </InfiniteScroll>
        </div>
    )
}

export default ViewBlog
