import React, { useState } from 'react'
import Dropzone from 'react-dropzone'
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import CreateOutlinedIcon from '@material-ui/icons/CreateOutlined';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import axios from "axios";
import { getCookie } from '../auth';
import RequireLogin from './requireLogin';
// import { emoji } from '../../../helpers/emoji';
import { IconButton, Menu } from '@material-ui/core';
import { toast } from "react-toastify"

function Index() {
    const [text, setText] = useState("")
    const [file, setFile] = useState([])
    const [url, setUrl] = useState([])
    // const [dataFile, setDataFile] = useState("")
    const [open, setOpen] = useState(false)
    const [login, setLogin] = useState(false)
    const [anchorEl, setAnchorEl] = useState(null)
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
                handleClose()
            }).catch(err => {
                console.log(err)
            })
    }
    const handleOpen = () => {
        if (!id) {
            setLogin(true)
        } else {
            setOpen(true);
        }

    };
    const handleClose = () => {
        setOpen(false);
    };
    const handleDeleteImamge = (index) => {
        const arr = [...file]
        const brr = [...url]
        arr.splice(index, 1)
        brr.splice(index, 1)
        setFile(arr)
        setUrl(brr)
    }
    const handleChangeText = e => {
        setText(e)
    }
    const handleLineBreak = e => {
        if (e.key === "Enter") {
            let value = text + "<br/>"
            setText(value)
        }
    }
    const handleOpenEmo = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseEmo = () => {
        setAnchorEl(null);
    };
    // const emojiSubmit = (e, emo) => {
    //     let value = text + " &#" + emo + ";"
    //     handleChangeText(value)
    //     handleCloseEmo()
    // }

    return (
        <div className="post_data ">
            {login === true ? <RequireLogin onClick={(value) => setLogin(value)} /> : console.log()}
            <button className="post_data_button tooltip" type="button" onClick={handleOpen}>
                <CreateOutlinedIcon />
                <span className="tooltiptext" id="tooltip_post">
                    Biểu tượng
                </span>
            </button>

            <Modal
                className="modal_post_blog"
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                // className={classes.modal}
                open={open}
                onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={open}>
                    <form action="#" onSubmit={handleSubmit} className="form_post_blog" >
                        <div className="close_form_button">
                            <IconButton onClick={handleClose}>
                                x
                            </IconButton>
                        </div>
                        <h4>Đăng tải </h4>
                        <div id="form_post_blog_div">
                            <div className="input_extension">
                                <IconButton aria-controls="simple_menu_emoji" aria-haspopup="true" onClick={handleOpenEmo}>
                                    <img alt="emoji_image" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAAABmJLR0QA/wD/AP+gvaeTAAAC/klEQVRIie2SX2jVdRjGn+9vO5PTFuMcK9ESFHXIiiQmjUDCYDbXRX9uRjACwwuhP8JCuoiiIxRUohdBfxbDi9kIpIv+UyAhrjDoJGp6IVoMzTnz7HjmdP9+7/M+XvzOOW47u/Vuz9WX7/t+n8/L+3yBJS3pbilUDkeem2iNQpR2V9zxXdPpuU0/dU201kVMOzXW9XNm+HBHsTnFaH2lTnA6Jm6cO5a9nEPwhZDoziF8IikfAk4defbm9sr9j8+UNst1Jo5DPrbwKgA0ePSBpDxdeTPlGYczwcLFlieKxUOPF74cbP9/w6KQENDrAkkhNvVW7mVhL12B1FWa3gcAc6VIgJToum7UJF0g1eyOntjCiYNthfYayFPfNJ10qp8U3PX0953XN327rbSZVBcpOH3PC0czJQAwA8qm4y/+ns32HF/eCNo60gdIwUxNNsuDOSiaB0mm9rdIjZGCW9jtjvdIBad+e/5oZrDaRwcpkKq+7flzxb/Df93/Mqk/yrXWBzZeeawGsv2X5qI79pabXqKpk4RReiUgVB1tEQgA5BDcXANWrsUeHqmBAMD0rRv9pCZJpMpGQ93Hsn/P7SEBWwQCAIw1QiqpGxoXhYSGxl5S91AaJwW6tg60F7fMMzKBlhgtVExfa5YM4NRoDeTrJ8c30PB2kom/Q2KIVHDj531tSlUhQrIuW7Curap3+k53QQ5rSIWheRBBYTa2T0mlSY3Wh6l+M99nycQPByu8Xum12GEUjHfeHlh3aX3T8MiglOSACF/svrDy2jzIV+3FHU51lL/gh93HV0/tOHHfD6ROJuvx3GcthQeTTCrBe/P+tZeL+9eM3HJG5wF0l+1+jWLfU/GOAGBwSyljrn3JdBptXDbdBwABQTH93SREv3c2zH5UzmTGzEEqSMgASAMQgFNBeO3mmlWdb/y3eqqaMwD0tSm1TIVHYwA+U3dt19nsxbm7/rjl6iaR9TOhrvTmhRX/HHjoUjpEDSsrdU9ZPDEVxnIjqyZrfsKSlnRXdRsr+i4fv8vwiwAAAABJRU5ErkJggg==" />
                                </IconButton>
                                <IconButton>
                                    <img alt="setting_image" src="data:image/png;base64,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" />                                </IconButton>
                                <Menu
                                    id="simple_menu_emoji"
                                    anchorEl={anchorEl}
                                    keepMounted
                                    open={Boolean(anchorEl)}
                                    onClose={handleCloseEmo}>
                                </Menu>
                            </div>
                            <div
                                contentEditable={true}
                                onKeyPress={handleLineBreak}
                                id="type_text_div"
                                onInput={e => handleChangeText(e.target.innerText)} >
                            </div>
                        </div>
                        <Dropzone
                            className="inner_title"
                            onDrop={acceptedFiles => dragFile(acceptedFiles)}>
                            {({ getRootProps, getInputProps }) => (
                                <section >
                                    <div className="drag_file" {...getRootProps()}>
                                        <input type="file" accept="image/*"  {...getInputProps()} />
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
                                    typeof url !== 'undefined' ? url.map(function (value, index) {
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
                </Fade>
            </Modal>
        </div>
    )
}

export default Index
