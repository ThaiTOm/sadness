import React, { useRef, useState } from 'react'
import { Link } from "react-router-dom"
import axios from "axios"
import imageCompression from 'browser-image-compression';
import TextareaAutosize from 'react-textarea-autosize';
import { toast, ToastContainer } from "react-toastify"
import Button from '@material-ui/core/Button';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import { getCookie } from '../../helpers/auth';
import Slider from '@material-ui/core/Slider';

function CreateShots() {
    const id = getCookie().token
    const fileRef = useRef(null);
    const videoRef = useRef(null)
    const mp3Ref = useRef(null)
    const audioRef = useRef()
    const videoSrcRef = useRef()
    const anchorRef = useRef(null)
    const [file, setFile] = useState(null)
    const [text, setText] = useState("")
    const [color, setColor] = useState("#ffffff")
    const [fontSize, setFontSize] = useState(16)
    const [font, setFont] = useState("Arial")
    const [open, setOpen] = useState(false)
    const [audio, setAudio] = useState(null)
    const [video, setVideo] = useState(null)
    const [value, setValue] = React.useState([0, 60]);
    const fontFamily = ["Arial", "Times New Roman", "Times", "Courier New", "Ubuntu Mono", "Verdana", "Georgia", "Palatino", "Garamond", "Bookman", "Tahoma", "Trebuchet MS", "Arial Black", "Comic Sans MS"]
    const [duration, setDuration] = useState(100.1234)

    const handleFileUpload = async (e) => {
        let imageFile = e.target.files[0];
        const options = {
            maxSizeMB: 1,
            maxWidth: 400,
            useWebWorker: true
        }
        try {
            const compressedFile = await imageCompression(imageFile, options);
            var urlCreator = window.URL || window.webkitURL;
            setFile(urlCreator.createObjectURL(compressedFile))
            setVideo(null)
            // await uploadToServer(compressedFile); // write your own logic
        } catch (error) {
            toast.error("Xin hay dang tai dung noi dung")
        }
    }
    const changeSrc = (value) => {
        if (value.current) {
            value.current.pause();
            value.current.load();
            value.current.play();
        }
    }
    const handleVideoUpload = (e) => {
        let videoFile = e.target.files[0]
        var URL = window.URL || window.webkitURL;
        var src = URL.createObjectURL(videoFile);
        setVideo(src)
        setFile(null)
        changeSrc(videoRef)
    }
    const handleChangeMusic = (e) => {
        let music = e.target.files[0]
        var URL = window.URL || window.webkitURL;
        var src = URL.createObjectURL(music);
        setAudio(src)
        setDuration(100.1234)
        changeSrc(audioRef)
    }
    const handleChangeNumber = (e) => {
        if (parseInt(e.target.value) > 50) setFontSize(50)
        else if (parseInt(e.target.value) < 0) setFontSize(1)
        else setFontSize(parseInt(e.target.value))
    }
    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event) => {
        setOpen(false);
    };
    const handleChangeFont = (i) => {
        setFont(fontFamily[i])
        handleClose()
    }
    const handleSubmit = (e) => {
        e.preventDefault()
        axios.post("http://localhost:2704/api/news/post/shot", { id, font, file, color, fontSize, text })
            .then(data => {
                toast.success("Bài viết của ban đã được đăng")
            })
            .catch(err => {

            })
    }
    const handleChange = (event, newValue) => {
        setValue(newValue);
        if (isNaN(audioRef.current.duration) !== true) {
            // put the conditional here 
            if (duration === 100.1234) {
                setDuration(audioRef.current.duration)
            }
            // after run these codes audioRef will target to <video/> not video object
            audioRef.current.pause();
            audioRef.current.load();
            audioRef.current.play();
        }
    };
    return (
        <div className="story">
            <ToastContainer />
            <div className="story-header">
                <Link style={{ marginLeft: "10px", marginRight: "10px" }} to="/">
                    x
                </Link>
                <p>Brand</p>
            </div>
            <div className="story-center">
                <div className="option-1">
                    <div className="header">
                        <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><g><g><g><g><g><g><g><g><g><circle cx="256" cy="256" fill="#ffce00" r="256" /></g></g></g></g></g></g></g></g><path d="m512 256c0-6.83-.268-13.597-.793-20.292l-101.891-101.89-20.318 10.732-91.948-91.948-82.1 40.304 43.075 43.075-123.217 263.266 112.612 112.612c2.849.094 5.709.141 8.581.141 141.384 0 255.999-114.615 255.999-256z" fill="#ffa300" /><g><path d="m231.077 71.403h49.846v64.507h-49.846z" fill="#555a66" /></g><g><path d="m255.818 71.403h25.105v64.507h-25.105z" fill="#333940" /></g><g><path d="m118.19 106.748h49.846v64.507h-49.846z" fill="#555a66" transform="matrix(.707 -.707 .707 .707 -56.372 141.909)" /></g><g><path d="m343.964 106.748h49.846v64.507h-49.846z" fill="#333940" transform="matrix(-.707 -.707 .707 -.707 531.44 498.132)" /></g><g><circle cx="256" cy="280.694" fill="#707789" r="169.548" /></g><g><path d="m256 111.146c-.061 0-.121.002-.182.002v339.091c.061 0 .121.002.182.002 93.639 0 169.548-75.909 169.548-169.548s-75.909-169.547-169.548-169.547z" fill="#555a66" /></g><g><circle cx="256" cy="280.694" fill="#fff" r="128.865" /></g><g><path d="m256 151.829c-.061 0-.121.002-.182.002v257.725c.061 0 .121.002.182.002 71.17 0 128.865-57.695 128.865-128.865s-57.695-128.864-128.865-128.864z" fill="#e9edf5" /></g><g><path d="m214.95 52.602h82.099v40.304h-82.099z" fill="#707789" /></g><g><path d="m255.818 52.602h41.232v40.304h-41.232z" fill="#555a66" /></g><g><path d="m241.355 230.338h100v30h-100z" fill="#333940" transform="matrix(.707 -.707 .707 .707 -88.145 277.873)" /></g><g><circle cx="256" cy="280.694" fill="#707789" r="26.274" /></g><g><path d="m256 254.419c-.061 0-.121.004-.182.005v52.539c.061 0 .121.005.182.005 14.511 0 26.274-11.763 26.274-26.274s-11.763-26.275-26.274-26.275z" fill="#555a66" /></g></g></svg>
                        <p style={{ fontSize: "1.3rem" }}>Thoi gian xuat hien: </p>
                    </div>
                    <div className="time">
                        <input min="0" max="24" placeholder="Gio" type="number"></input>
                    </div>
                    <div className="text">
                        <div className="header">
                            <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path style={{ fill: "orange" }} d="m310 512h-190c-66.168 0-120-53.832-120-120v-272c0-66.168 53.832-120 120-120h272c66.168 0 120 53.832 120 120v191.5c0 11.046-8.954 20-20 20s-20-8.954-20-20v-191.5c0-44.112-35.888-80-80-80h-272c-44.112 0-80 35.888-80 80v272c0 44.112 35.888 80 80 80h190c11.046 0 20 8.954 20 20s-8.954 20-20 20zm102-386c0-11.046-8.954-20-20-20h-183c-11.046 0-20 8.954-20 20s8.954 20 20 20h183c11.046 0 20-8.954 20-20zm0 80c0-11.046-8.954-20-20-20h-272c-11.046 0-20 8.954-20 20s8.954 20 20 20h272c11.046 0 20-8.954 20-20zm-200 80c0-11.046-8.954-20-20-20h-72c-11.046 0-20 8.954-20 20s8.954 20 20 20h72c11.046 0 20-8.954 20-20zm-112-162c0 13.807 11.193 25 25 25s25-11.193 25-25-11.193-25-25-25-25 11.193-25 25zm390.619 366.618c28.462-28.462 28.462-74.774 0-103.237l-70.109-70.108c-20.263-20.264-45.827-33.942-73.926-39.559l-56.664-11.326c-6.554-1.313-13.334.742-18.062 5.47-4.728 4.729-6.78 11.506-5.47 18.063l11.326 56.664c5.617 28.1 19.296 53.662 39.558 73.926l70.109 70.108c13.788 13.787 32.12 21.381 51.619 21.381s37.831-7.594 51.619-21.382zm-151.875-173.68c20.329 4.063 38.822 13.958 53.481 28.618l70.109 70.108c12.867 12.867 12.867 33.803 0 46.67-6.232 6.233-14.52 9.666-23.334 9.666s-17.102-3.433-23.334-9.666l-70.109-70.108c-14.659-14.66-24.555-33.153-28.618-53.481l-5.447-27.253z" /></svg>
                            <p style={{ fontSize: "1.3rem" }}>Noi dung</p>
                        </div>
                        <TextareaAutosize
                            value={text}
                            onChange={e => setText(e.target.value)}
                        />
                    </div>
                </div>
                <div className="story-content">
                    {audio ? <audio autoPlay controls ref={audioRef}>
                        <source src={audio + "#t=" + value[0] + "," + value[1]} />
                    </audio> : console.log()}
                    {!video ? <div className="story_content_div" style={file ? { backgroundImage: "url(" + file + ")" } : console.log()}>
                        <div>
                            {text.split(/\r\n|\r|\n/).map(function (value) {
                                return <p style={{ color: color, fontSize: fontSize ? fontSize : 15, fontFamily: font }} > {value}</p>
                            })}
                        </div>
                    </div> : video ? <div className="story_content_div">
                        <video ref={videoSrcRef} autoPlay muted={audio ? true : false}>
                            <source src={video} type="video/mp4" />
                        </video>
                    </div> : console.log()}
                </div>
                <div className="option-2">
                    <div className="header ">
                        <svg width="25px" height="25px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m22.683 9.394-1.88-.239c-.155-.477-.346-.937-.569-1.374l1.161-1.495c.47-.605.415-1.459-.122-1.979l-1.575-1.575c-.525-.542-1.379-.596-1.985-.127l-1.493 1.161c-.437-.223-.897-.414-1.375-.569l-.239-1.877c-.09-.753-.729-1.32-1.486-1.32h-2.24c-.757 0-1.396.567-1.486 1.317l-.239 1.88c-.478.155-.938.345-1.375.569l-1.494-1.161c-.604-.469-1.458-.415-1.979.122l-1.575 1.574c-.542.526-.597 1.38-.127 1.986l1.161 1.494c-.224.437-.414.897-.569 1.374l-1.877.239c-.753.09-1.32.729-1.32 1.486v2.24c0 .757.567 1.396 1.317 1.486l1.88.239c.155.477.346.937.569 1.374l-1.161 1.495c-.47.605-.415 1.459.122 1.979l1.575 1.575c.526.541 1.379.595 1.985.126l1.494-1.161c.437.224.897.415 1.374.569l.239 1.876c.09.755.729 1.322 1.486 1.322h2.24c.757 0 1.396-.567 1.486-1.317l.239-1.88c.477-.155.937-.346 1.374-.569l1.495 1.161c.605.47 1.459.415 1.979-.122l1.575-1.575c.542-.526.597-1.379.127-1.985l-1.161-1.494c.224-.437.415-.897.569-1.374l1.876-.239c.753-.09 1.32-.729 1.32-1.486v-2.24c.001-.757-.566-1.396-1.316-1.486zm-10.683 7.606c-2.757 0-5-2.243-5-5s2.243-5 5-5 5 2.243 5 5-2.243 5-5 5z" /></svg>
                        <p style={{ fontSize: "1.5rem" }}>Cài đặt:</p>
                    </div>
                    <div className="option ">
                        <section className="section">
                            <p>Font</p>
                            <div id="font" className="div">
                                <section className="tooltip">
                                    <input onChange={e => setColor(e.target.value)} type="color" id="colorpicker" value={color} />
                                    <span className="tooltiptext">
                                        Mau chu
                                    </span>
                                </section>
                                <section className="tooltip">
                                    <input value={fontSize || ""} onChange={e => handleChangeNumber(e)} type="number"></input>
                                    <span className="tooltiptext">
                                        Co chu
                                    </span>
                                </section>
                                <section >
                                    <Button
                                        ref={anchorRef}
                                        aria-controls={open ? 'menu-list-grow' : undefined}
                                        aria-haspopup="true"
                                        onClick={handleToggle}
                                    >
                                        {font}
                                    </Button>
                                    <Popper id="z-index" open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
                                        {({ TransitionProps, placement }) => (
                                            <Grow
                                                {...TransitionProps}
                                                style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
                                            >
                                                <Paper>
                                                    <ClickAwayListener onClickAway={handleClose}>
                                                        <MenuList autoFocusItem={open} id="menu-list-grow" >
                                                            {fontFamily.map(function (value, i) {
                                                                return <MenuItem key={i} style={{ fontFamily: value }} onClick={e => handleChangeFont(i)}>{value}</MenuItem>
                                                            })}
                                                        </MenuList>
                                                    </ClickAwayListener>
                                                </Paper>
                                            </Grow>
                                        )}
                                    </Popper>
                                </section>
                            </div>
                        </section>
                        <section className="section" style={audio || video ? { height: "50%" } : { height: "25%" }}>
                            <p>Da phuong tien</p>
                            <div id="media" className="div">
                                <section className="tooltip">
                                    <svg onClick={(e) => fileRef.current.click()} className="upload-icon" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                                        viewBox="0 0 512.056 512.056" xmlSpace="preserve">
                                        <g>
                                            <g>
                                                <g>
                                                    <path d="M426.635,188.224C402.969,93.946,307.358,36.704,213.08,60.37C139.404,78.865,85.907,142.542,80.395,218.303
				C28.082,226.93-7.333,276.331,1.294,328.644c7.669,46.507,47.967,80.566,95.101,80.379h80v-32h-80c-35.346,0-64-28.654-64-64
				c0-35.346,28.654-64,64-64c8.837,0,16-7.163,16-16c-0.08-79.529,64.327-144.065,143.856-144.144
				c68.844-0.069,128.107,48.601,141.424,116.144c1.315,6.744,6.788,11.896,13.6,12.8c43.742,6.229,74.151,46.738,67.923,90.479
				c-5.593,39.278-39.129,68.523-78.803,68.721h-64v32h64c61.856-0.187,111.848-50.483,111.66-112.339
				C511.899,245.194,476.655,200.443,426.635,188.224z"/>
                                                    <path d="M245.035,253.664l-64,64l22.56,22.56l36.8-36.64v153.44h32v-153.44l36.64,36.64l22.56-22.56l-64-64
				C261.354,247.46,251.276,247.46,245.035,253.664z"/>
                                                </g></g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g>
                                    </svg>
                                    <input onChange={e => handleFileUpload(e)} ref={fileRef} style={{ display: "none" }} type="file" accept="image/*"></input>
                                    <span className="tooltiptext">Anh </span>
                                </section>
                                <section className="tooltip">
                                    <svg onClick={e => mp3Ref.current.click()} viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"><linearGradient id="a"><stop offset="0" stop-color="#ff5e50" /><stop offset=".249" stop-color="#fe5c6c" /><stop offset=".3765" stop-color="#e3658a" /><stop offset=".497" stop-color="#b87eb0" /><stop offset=".6267" stop-color="#916cff" /><stop offset=".7628" stopColor="#70bcfb" stopOpacity=".917647" /><stop offset="1" stop-color="#21c7fe" /></linearGradient><linearGradient id="b" gradientTransform="matrix(2.8346 0 0 -2.8346 -2983.6272 5210.2773)" gradientUnits="userSpaceOnUse" x1="1092.0836" x2="1194.8329" xlinXhref="#a" y1="1813.7263" y2="1680.365" /><linearGradient id="c" gradientTransform="matrix(2.8346 0 0 -2.8346 -2983.6272 5210.2773)" gradientUnits="userSpaceOnUse" x1="1091.8068" x2="1194.556" xlinkHref="#a" y1="1813.5131" y2="1680.1516" /><path d="m256 0c-141.386719 0-256 114.613281-256 256s114.613281 256 256 256 256-114.613281 256-256-114.613281-256-256-256zm0 490.496094c-129.507812 0-234.496094-104.988282-234.496094-234.496094s104.988282-234.496094 234.496094-234.496094 234.496094 104.988282 234.496094 234.496094-104.988282 234.496094-234.496094 234.496094zm0 0" fill="url(#b)" /><path d="m340.269531 376.832031c15.027344-4.511719 25.636719-15.449219 29.984375-30.902343l1.277344-4.546876.167969-121.835937c.128906-91.242187.007812-122.40625-.488281-124.105469-.523438-1.800781-1.347657-3.316406-2.433594-4.511718-1.585938-1.003907-3.5-1.53125-5.664063-1.53125-1.496093 0-6.683593.738281-11.523437 1.640624-21.414063 3.988282-147.636719 29.71875-149.789063 30.53125-3.335937 1.261719-6.640625 4.261719-8.207031 7.445313l-1.328125 2.695313s-.625 190.96875-1.59375 193.121093c-1.472656 3.269531-4.734375 6.371094-7.742187 7.359375-1.425782.46875-7.066407 1.761719-12.535157 2.875-25.324219 5.160156-34.730469 8.875-42.6875 16.867188-4.515625 4.539062-7.863281 10.734375-9.3125 17.238281-1.378906 6.214844-.917969 15.515625 1.054688 21.167969 2.0625 5.917968 5.386719 10.96875 9.734375 14.941406 3.949218 3.117188 8.613281 5.4375 13.855468 6.808594 11.59375 3.039062 33.292969-.339844 44.394532-6.90625 4.636718-2.746094 10.605468-8.511719 13.710937-13.25 1.226563-1.871094 3.078125-5.652344 4.109375-8.390625 3.613282-9.605469 3.726563-180.6875 4.191406-182.84375.78125-3.652344 3.222657-6.332031 6.589844-7.238281 3.03125-.816407 124.570313-25.410157 127.988282-25.898438 3.011718-.429688 5.855468.5625 7.40625 2.515625.921874.507813 1.695312 1.191406 2.242187 2.027344.984375 1.503906 1.046875 4.480469 1.191406 58.644531.171875 62.34375.242188 60.882812-3.066406 64.816406-2.40625 2.863282-5.417969 3.96875-17.769531 6.546875-18.792969 3.925781-25.226563 5.792969-32.421875 9.390625-8.988281 4.492188-13.980469 9.414063-17.835938 17.589844-2.730469 5.785156-3.75 10.121094-3.742187 15.878906.019531 10.292969 3.488281 18.335938 11.316406 26.210938.71875.722656 1.429688 1.398437 2.140625 2.035156 3.945313 3.117188 7.964844 4.996094 13.019531 6.1875 7.625 1.796875 23.144532.613281 33.765625-2.574219zm0 0" fill="url(#c)" /></svg>
                                    <input onChange={e => handleChangeMusic(e)} ref={mp3Ref} style={{ display: "none" }} type="file" accept="audio/*"></input>
                                    <span className="tooltiptext">
                                        Nhac (mp3)
                                    </span>
                                </section>
                                <section className="tooltip">
                                    <svg onClick={(e) => videoRef.current.click()} viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><g><g fill="#dfe7f4"><path d="m15 406v60h241 241v-60h-241z" /><path d="m256 46h-241v60h241 241v-60z" /></g><path d="m256 46h241v60h-241z" fill="#c7cfe1" /><path d="m256 406h241v60h-241z" fill="#c7cfe1" /><path d="m256 106h-226v300h226 226v-300z" fill="#ff641a" /><path d="m256 106h226v300h-226z" fill="#f03800" /><g><g fill="#404a80"><path d="m0 391v90h256 256v-90h-256zm81 60h-51v-30h51zm80 0h-50v-30h50zm80 0h-50v-30h50zm190-30h51v30h-51zm-80 0h50v30h-50zm-80 0h50v30h-50z" /><path d="m256 31h-256v90h256 256v-90zm-175 60h-51v-30h51zm80 0h-50v-30h50zm80 0h-50v-30h50zm80 0h-50v-30h50zm80.001 0h-50.001v-30h50.001zm80.999 0h-51.099v-30h51.099z" /></g><g fill="#283366"><path d="m321 91h-50v-30h50zm80.001 0h-50.001v-30h50.001zm-145.001-60v90h256v-90zm226 60h-51.099v-30h51.099z" /><path d="m512 391h-256v90h256zm-191 60h-50v-30h50zm80 0h-50v-30h50zm81 0h-51v-30h51z" /></g></g><path d="m256 197.976-45-29.998v176.044l45-29.998 87.041-58.024z" fill="#f0f7ff" /><path d="m256 197.976v116.048l87.041-58.024z" fill="#dfe7f4" /></g></svg>
                                    <input onChange={e => handleVideoUpload(e)} ref={videoRef} style={{ display: "none" }} type="file" accept="video/*"></input>
                                    <span className="tooltiptext">
                                        Video
                                    </span>
                                </section>
                            </div>
                            <div className="change">
                                {audio ? <>
                                    <span>
                                        Chinh sua mp3
                                    </span>
                                    <Slider
                                        max={duration}
                                        min={0}
                                        value={value}
                                        onChange={handleChange}
                                        valueLabelDisplay="auto"
                                        aria-labelledby="range-slider"
                                    /></> : console.log()}

                            </div>

                        </section>
                    </div>
                    <div onClick={e => handleSubmit(e)} className="bottom">
                        <svg viewBox="0 0 492 492" xmlSpace="preserve">
                            <g>
                                <g>
                                    <path d="M484.128,104.478l-16.116-16.116c-5.064-5.068-11.816-7.856-19.024-7.856c-7.208,0-13.964,2.788-19.028,7.856
			L203.508,314.81L62.024,173.322c-5.064-5.06-11.82-7.852-19.028-7.852c-7.204,0-13.956,2.792-19.024,7.852l-16.12,16.112
			C2.784,194.51,0,201.27,0,208.47c0,7.204,2.784,13.96,7.852,19.028l159.744,159.736c0.212,0.3,0.436,0.58,0.696,0.836
			l16.12,15.852c5.064,5.048,11.82,7.572,19.084,7.572h0.084c7.212,0,13.968-2.524,19.024-7.572l16.124-15.992
			c0.26-0.256,0.48-0.468,0.612-0.684l244.784-244.76C494.624,132.01,494.624,114.966,484.128,104.478z"/>
                                </g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default CreateShots