import React, { useState } from 'react'
import Dropzone from 'react-dropzone'
import CreateOutlinedIcon from '@material-ui/icons/CreateOutlined';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import axios from "axios";
import { getCookie } from '../../helpers/auth';
import RequireLogin from '../../helpers/news/requireLogin';
import { toast } from "react-toastify"
import { IconButton } from '@material-ui/core';
import TextAreaCustom from '../../helpers/main/textarea';



function Index() {
    const [text, setText] = useState()
    const [file, setFile] = useState([])
    const [url, setUrl] = useState([])
    // const [dataFile, setDataFile] = useState("")
    const [open, setOpen] = useState(false)
    const [login, setLogin] = useState(false)
    const id = getCookie().token;

    const dragFile = (file) => {
        let data = file[0];
        var URL = window.URL || window.webkitURL;
        var src = URL.createObjectURL(data);
        setUrl(value => [...value, src])
        setFile(value => [...value, data])
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        let formData = new FormData()
        formData.append("text", text)
        formData.append("id", id)
        for (let value of file) {
            formData.append("files", value)
        }
        text && axios.post("http://localhost:2704/api/news/post", formData)
            .then(data => {
                toast.success("Bài viết của ban đã được đăng")
                setOpen(false)
                setUrl(null)
                setFile(null)
            }).catch(err => {
                console.log(err)
            })
    }

    const handleDeleteImamge = (index) => {
        const arr = [...file]
        const brr = [...url]
        arr.splice(index, 1)
        brr.splice(index, 1)
        setFile(arr)
        setUrl(brr)
    }

    return (
        <div style={open === true ? { width: "100%", height: "100%", position: "fixed" } : { width: 0, height: 0 }} className="post_data ">
            {login === true ? <RequireLogin onClick={(value) => setLogin(value)} /> : console.log()}
            <button className="post_data_button tooltip" type="button" onClick={e => id ? setOpen(true) : setLogin(true)}>
                <CreateOutlinedIcon />
                <span className="tooltiptext" id="tooltip_post">
                    Biểu tượng
                </span>
            </button>
            <div style={open === true ? { display: "flex" } : { display: "none" }} className="modal_post_blog percent cA">
                <form action="#" onSubmit={handleSubmit} className="form_post_blog" >
                    <div className="close_form_button">
                        <IconButton onClick={e => setOpen(false)}>
                            x
                        </IconButton>
                    </div>
                    <h4>Đăng tải </h4>
                    <div id="form_post_blog_div">
                        <TextAreaCustom onChange={(value) => setText(value)} />
                    </div>
                    <Dropzone
                        onDrop={acceptedFiles => dragFile(acceptedFiles)}>
                        {({ getRootProps, getInputProps }) => (
                            <section className="inner_title" >
                                <div className="drag_file cA" {...getRootProps()}>
                                    <input type="file" accept="image/*"  {...getInputProps()} />
                                    <div className="icon ">
                                        <CloudUploadIcon />
                                    </div>
                                </div>
                            </section>
                        )}
                    </Dropzone>
                    <div>
                        <div className="image_post_news">
                            {
                                url && typeof url !== 'undefined' ? url.map(function (value, index) {
                                    return <li key={index}>
                                        <img alt="image_upload" src={value}></img>
                                        <span onClick={() => handleDeleteImamge(index)}>&#10005;</span>
                                    </li>
                                }) : {}}
                        </div>
                    </div>
                    <IconButton id="upload_submit_button" type="submit">
                        <img alt="upload_image" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAABmJLR0QA/wD/AP+gvaeTAAABWUlEQVRoge2XPU7DQBBGZ1AoENAhhUOEboVEQx0uQ86A0kAHFRUiZwAKJCoaKPAJqEC0CA4A6NEswjiOf0I2XsM8aaX1eOT5niXbsohhGIZhRAqwCtz7tdJ0nqkAloAbvrkDlpvOVQsvccU4162RKZBoj0yOxElqf9wKmRyJA6CXOu4Be9HLABepkENf+yHia8NU7bzZ1BkABV7SEr4+JuLrXzKvgDaTegLABtDP1HJF/LmdbC1aikRmzULIi88TE4kNE4kNE4kNE4kNE4mNTuDrP4rIk4ggIg+BZ4UF6AChb5iU/gskSbKmqlvApXPuLXSgzOxFVe0Dt86556LeKs/ICDgTkd3ZxKvFwM8+LWssFQG6frv+21RT0PUZSmf/mbeWicSGicRGnQ/VdpIk+8GSTJhZtbFURFU//HbTr7mTyjCRUhHgSFUHVXoD8Q4cNjTbMAzD+Cd8AmWxfs2z9GiSAAAAAElFTkSuQmCC" />
                    </IconButton>
                </form>
            </div>
        </div>
    )
}

export default Index