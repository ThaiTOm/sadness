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

    const render = (value) => {
        return (
            <img
                alt={value.slice(100, 110)}
                src={value}
            />
        )
    }
    switch (value.image.length) {
        case 0:
            return <div></div>
        case 1:
            return <div className="one">
                <Link to={"/posts/id=" + value.idBlog}>
                    {render(value.image[0])}
                </Link>
            </div>
        case 2:
            return <div className="two">
                <Link to={"/posts/id=" + value.idBlog}>
                    {render(value.image[0])}
                    {render(value.image[1])}
                </Link>
            </div>
        case 3:
            return <div className="three">
                <Link to={"/posts/id=" + value.idBlog}>
                    <div className="two">
                        {render(value.image[0])}
                        {render(value.image[1])}
                    </div>
                    {render(value.image[2])}
                </Link>
            </div>

        case 4:
            return <div className="three">
                <Link to={"/posts/id=" + value.idBlog}>
                    <div className="two">
                        {render(value.image[0])}
                        {render(value.image[1])}
                    </div>
                    <div className="two">
                        {render(value.image[2])}
                        {render(value.image[3])}
                    </div>
                </Link>
            </div>
        default:
            return <div className="three">
                <Link to={"/posts/id=" + value.idBlog}>
                    <div className="two">
                        {render(value.image[0])}
                        {render(value.image[1])}
                    </div>
                    <div className="two" >
                        {render(value.image[0])}
                        <div style={{ position: "relative", width: "90%" }}>
                            {render(value.image[2])}
                            <span className="last_image">
                                + {value.image.length - 4}
                            </span>
                        </div>
                    </div>
                </Link>
            </div>
    }
}
export const VideoRender = ({ value, idBlog }) => {
    const render = (value) => {
        return (
            <video
                alt={value.slice(100, 110)}
                src={value}
            />
        )
    }
    switch (value.length) {
        case 0:
            return <div></div>
        case 1:
            return <div className="one">
                <Link to={"/posts/id=" + idBlog}>
                    {render(value[0])}
                </Link>
            </div>
        case 2:
            return <div className="two">
                <Link to={"/posts/id=" + idBlog}>
                    {render(value.image[0])}
                    {render(value.image[1])}
                </Link>
            </div>
        case 3:
            return <div className="three">
                <Link to={"/posts/id=" + idBlog}>
                    <div className="two">
                        {render(value.image[0])}
                        {render(value.image[1])}
                    </div>
                    {render(value.image[2])}
                </Link>
            </div>

        case 4:
            return <div className="three">
                <Link to={"/posts/id=" + idBlog}>
                    <div className="two">
                        {render(value.image[0])}
                        {render(value.image[1])}
                    </div>
                    <div className="two">
                        {render(value.image[2])}
                        {render(value.image[3])}
                    </div>
                </Link>
            </div>
        default:
            return <div className="three">
                <Link to={"/posts/id=" + idBlog}>
                    <div className="two">
                        {render(value.image[0])}
                        {render(value.image[1])}
                    </div>
                    <div className="two" >
                        {render(value.image[0])}
                        <div style={{ position: "relative", width: "90%" }}>
                            {render(value.image[2])}
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
                <li className={arr[3] === "" ? "active_title inner_title tooltip" : "inner_title tooltip"}>
                    <Link to="/">
                        <svg viewBox="0 0 511.096 511.096" xmlns="http://www.w3.org/2000/svg"><g id="Speech_Bubble_48_"><g><path d="m74.414 480.548h-36.214l25.607-25.607c13.807-13.807 22.429-31.765 24.747-51.246-59.127-38.802-88.554-95.014-88.554-153.944 0-108.719 99.923-219.203 256.414-219.203 165.785 0 254.682 101.666 254.682 209.678 0 108.724-89.836 210.322-254.682 210.322-28.877 0-59.01-3.855-85.913-10.928-25.467 26.121-59.973 40.928-96.087 40.928z" /></g></g></svg>
                    </Link>
                    <span className="tooltiptext">
                        Tin nhắn
                    </span>
                </li>
                <li className={arr[3] === "news" ? "active_title inner_title tooltip" : "inner_title tooltip"}>
                    <Link className="home_icon icon_nav" to="/news">
                        <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="m498.195312 222.695312c-.011718-.011718-.023437-.023437-.035156-.035156l-208.855468-208.847656c-8.902344-8.90625-20.738282-13.8125-33.328126-13.8125-12.589843 0-24.425781 4.902344-33.332031 13.808594l-208.746093 208.742187c-.070313.070313-.140626.144531-.210938.214844-18.28125 18.386719-18.25 48.21875.089844 66.558594 8.378906 8.382812 19.445312 13.238281 31.277344 13.746093.480468.046876.964843.070313 1.453124.070313h8.324219v153.699219c0 30.414062 24.746094 55.160156 55.167969 55.160156h81.710938c8.28125 0 15-6.714844 15-15v-120.5c0-13.878906 11.289062-25.167969 25.167968-25.167969h48.195313c13.878906 0 25.167969 11.289063 25.167969 25.167969v120.5c0 8.285156 6.714843 15 15 15h81.710937c30.421875 0 55.167969-24.746094 55.167969-55.160156v-153.699219h7.71875c12.585937 0 24.421875-4.902344 33.332031-13.808594 18.359375-18.371093 18.367187-48.253906.023437-66.636719zm0 0" /></svg>
                    </Link>
                    <span className="tooltiptext">
                        Trang chủ
                    </span>
                </li>
                <li className={arr[3] === "audio" ? "active_title inner_title tooltip" : "inner_title tooltip"}>
                    <Link className="home_icon icon_nav" to="/audio">
                        <svg id="audio" width="35pt" height="25pt" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><g><path d="m467 143h-36.868c5.277 19.494 8.11 39.982 8.11 61.122 0 129.095-105.026 234.121-234.121 234.121-11.202 0-22.38-.83-33.436-2.427 6.916 15.975 22.829 27.184 41.315 27.184h212.583l63.61 46.142c2.61 1.893 5.701 2.858 8.809 2.858 2.327 0 4.663-.541 6.813-1.638 5.023-2.561 8.185-7.723 8.185-13.362v-309c0-24.813-20.187-45-45-45z" /><path d="m408.243 204.122c0-112.553-91.569-204.122-204.121-204.122s-204.122 91.569-204.122 204.122c0 39.168 11.028 76.924 31.969 109.698l-31.038 83.98c-2.03 5.493-.678 11.666 3.463 15.807 2.864 2.864 6.699 4.394 10.609 4.394 1.744 0 3.503-.305 5.198-.931l88.229-32.61c29.327 15.58 62.254 23.783 95.691 23.783 112.553 0 204.122-91.568 204.122-204.121zm-308.243 41.697c0 8.284-6.716 15-15 15s-15-6.716-15-15v-83.637c0-8.284 6.716-15 15-15s15 6.716 15 15zm210.001-83.637c0-8.284 6.716-15 15-15s15 6.716 15 15v83.637c0 8.284-6.716 15-15 15s-15-6.716-15-15zm-60 23.999c0-8.284 6.716-15 15-15s15 6.716 15 15v35.639c0 8.284-6.716 15-15 15s-15-6.716-15-15zm-90.001 35.639c0 8.284-6.716 15-15 15s-15-6.716-15-15v-35.639c0-8.284 6.716-15 15-15s15 6.716 15 15zm30.001 56.181v-148.001c0-8.284 6.716-15 15-15s15 6.716 15 15v148c0 8.284-6.716 15-15 15s-15-6.715-15-14.999z" /></g></svg>
                    </Link>
                    <span className="tooltiptext">
                        Trò chuyện âm thanh
                    </span>
                </li>
                <li className={arr[3] === "xyz" ? "active_title inner_title tooltip" : "inner_title tooltip"}>
                    <svg onClick={e => handleClickNoti(e)} id="Layer_4" height="15pt" viewBox="0 0 24 24" width="15pt" xmlns="http://www.w3.org/2000/svg"><g><path d="m21.379 16.913c-1.512-1.278-2.379-3.146-2.379-5.125v-2.788c0-3.519-2.614-6.432-6-6.92v-1.08c0-.553-.448-1-1-1s-1 .447-1 1v1.08c-3.387.488-6 3.401-6 6.92v2.788c0 1.979-.867 3.847-2.388 5.133-.389.333-.612.817-.612 1.329 0 .965.785 1.75 1.75 1.75h16.5c.965 0 1.75-.785 1.75-1.75 0-.512-.223-.996-.621-1.337z" /><path d="m12 24c1.811 0 3.326-1.291 3.674-3h-7.348c.348 1.709 1.863 3 3.674 3z" /></g></svg>
                    {
                        value.length > 0 ? <span>{value.length}</span> : console.log()
                    }
                </li>
                <li className={arr[3] === "feedback" ? "active_title inner_title tooltip" : "inner_title tooltip"} onClick={handleOpen}>
                    <Link className="feedback_icon icon_nav" to="" >
                        <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                            viewBox="0 0 512 512" xmlxspace="preserve">                                <g>                                    <g>                                        <g>
                                <path d="M374.031,241.75c-6.671-54.43-49.629-97.28-104.076-103.813c-4.688-0.535-9.402-0.803-14.121-0.804
				c-48.118,0.074-91.444,29.154-109.742,73.657c-18.298,44.503-7.957,95.649,26.193,129.548c18.16,17.391,28.56,41.357,28.857,66.5
				v13.733h109.714v-13.804c0.083-24.667,10.118-48.256,27.831-65.424c26.754-25.813,39.84-62.686,35.343-99.589V241.75z"/>
                                <path d="M256,512c11.62-0.013,21.975-7.335,25.862-18.286h-51.723C234.025,504.665,244.38,511.987,256,512z" />
                                <path d="M210.286,466.286c0.007,5.047,4.096,9.136,9.143,9.143h73.143c5.047-0.007,9.136-4.096,9.143-9.143v-27.429h-91.429
				V466.286z"/>
                                <path d="M256,82.286c10.099,0,18.286-8.187,18.286-18.286V18.286C274.286,8.187,266.099,0,256,0s-18.286,8.187-18.286,18.286V64
				C237.714,74.099,245.901,82.286,256,82.286z"/>
                                <path d="M101.679,127.54c7.236,6.911,18.626,6.911,25.862,0c3.43-3.429,5.357-8.081,5.357-12.931
				c0-4.85-1.927-9.502-5.357-12.931L95.214,69.357C91.786,65.927,87.135,64,82.286,64s-9.5,1.927-12.929,5.357
				C65.927,72.785,64,77.436,64,82.286s1.927,9.5,5.357,12.929L101.679,127.54z"/>
                                <path d="M82.286,256c0-10.099-8.187-18.286-18.286-18.286H18.286C8.191,237.724,0.01,245.905,0,256
				c0.01,10.095,8.191,18.276,18.286,18.286H64C74.099,274.286,82.286,266.099,82.286,256z"/>
                                <path d="M119.356,379.699c-6.32-1.689-13.06,0.126-17.677,4.761l-32.321,32.326c-3.43,3.428-5.357,8.079-5.357,12.929
				s1.927,9.5,5.357,12.929c7.234,6.911,18.623,6.911,25.857,0l32.326-32.321c4.634-4.617,6.45-11.357,4.761-17.677
				S125.676,381.388,119.356,379.699z"/>
                                <path d="M410.321,384.46c-4.617-4.634-11.357-6.45-17.677-4.761s-11.256,6.625-12.945,12.945s0.126,13.06,4.761,17.677
				l32.326,32.321c7.234,6.911,18.623,6.911,25.857,0c3.43-3.428,5.357-8.079,5.357-12.929s-1.927-9.5-5.357-12.929L410.321,384.46z
				"/>
                                <path d="M493.714,237.714H448c-10.099,0-18.286,8.187-18.286,18.286s8.187,18.286,18.286,18.286h45.714
				c10.099,0,18.286-8.187,18.286-18.286S503.813,237.714,493.714,237.714z"/>
                                <path d="M410.321,127.54l32.321-32.326c4.619-4.619,6.423-11.351,4.732-17.661c-1.691-6.31-6.619-11.238-12.929-12.929
				c-6.31-1.691-13.042,0.113-17.661,4.732l-32.326,32.321c-3.43,3.429-5.357,8.081-5.357,12.931c0,4.85,1.927,9.502,5.357,12.931
				C391.695,134.451,403.086,134.451,410.321,127.54z"/>
                            </g></g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g>
                        </svg>
                    </Link>
                    <span className="tooltiptext">
                        Dóng góp ý kiến
                    </span>
                </li>
                <li className={arr[3] === "help" ? "active_title inner_title tooltip" : "inner_title tooltip"}>
                    <Link className="contact_icon icon_nav" to="/help">
                        <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                            viewBox="0 0 512 512" xmlxspace="preserve">
                            <g>
                                <g>
                                    <path d="M256,0C115.391,0,0.002,115.389,0.002,255.998c0,45.747,12.378,90.526,35.859,130.004L0.778,492.25
			c-1.802,5.391-0.396,11.338,3.618,15.352c4.043,4.043,10.031,5.425,15.352,3.618l106.248-35.083
			c39.478,23.481,84.257,35.859,130.004,35.859c140.609,0,255.998-115.389,255.998-255.998S396.609,0,256,0z M256,450.996
			c-24.814,0-45-20.186-45-45c0-24.814,20.186-45,45-45s45,20.186,45,45C301,430.811,280.814,450.996,256,450.996z M319.237,235.183
			L286,268.42v32.578c0,16.538-13.462,30-30,30s-30-13.462-30-30V268.42c0-16.025,6.24-31.084,17.578-42.422l33.237-33.237
			c7.683-7.683,9.185-15.463,9.185-25.386c0-17.3-14.077-31.377-31.377-31.377c-15.776,0-28.623,12.847-28.623,28.623
			c0,16.538-13.462,30-30,30c-16.538,0-30-13.462-30-30c0-48.867,39.756-88.622,88.622-88.622c50.391,0,91.376,40.986,91.376,91.376
			C345.999,195.725,336.724,217.696,319.237,235.183z"/>
                                </g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg>
                    </Link>
                    <span className="tooltiptext">
                        Trợ giúp
                    </span>
                </li>
                <li className={arr[3] === "policy" ? "active_title inner_title tooltip" : "inner_title tooltip"}>
                    <Link className="policy_icon icon_nav" to="/policy">
                        <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                            viewBox="0 0 296.999 296.999" xmlxspace="preserve">
                            <g>
                                <g>
                                    <g>
                                        <path d="M45.432,35.049c-0.008,0-0.017,0-0.025,0c-2.809,0-5.451,1.095-7.446,3.085c-2.017,2.012-3.128,4.691-3.128,7.543
				v159.365c0,5.844,4.773,10.61,10.641,10.625c24.738,0.059,66.184,5.215,94.776,35.136V84.023c0-1.981-0.506-3.842-1.461-5.382
				C115.322,40.849,70.226,35.107,45.432,35.049z"/>
                                        <path d="M262.167,205.042V45.676c0-2.852-1.111-5.531-3.128-7.543c-1.995-1.99-4.639-3.085-7.445-3.085c-0.009,0-0.018,0-0.026,0
				c-24.793,0.059-69.889,5.801-93.357,43.593c-0.955,1.54-1.46,3.401-1.46,5.382v166.779
				c28.592-29.921,70.038-35.077,94.776-35.136C257.394,215.651,262.167,210.885,262.167,205.042z"/>
                                        <path d="M286.373,71.801h-7.706v133.241c0,14.921-12.157,27.088-27.101,27.125c-20.983,0.05-55.581,4.153-80.084,27.344
				c42.378-10.376,87.052-3.631,112.512,2.171c3.179,0.724,6.464-0.024,9.011-2.054c2.538-2.025,3.994-5.052,3.994-8.301V82.427
				C297,76.568,292.232,71.801,286.373,71.801z"/>
                                        <path d="M18.332,205.042V71.801h-7.706C4.768,71.801,0,76.568,0,82.427v168.897c0,3.25,1.456,6.276,3.994,8.301
				c2.545,2.029,5.827,2.78,9.011,2.054c25.46-5.803,70.135-12.547,112.511-2.171c-24.502-23.19-59.1-27.292-80.083-27.342
				C30.49,232.13,18.332,219.963,18.332,205.042z"/>
                                    </g></g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g>
                        </svg>
                    </Link>
                    <span className="tooltiptext">
                        điều khoản dịch vụ
                    </span>
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
                                        <div className="icon percent">
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
