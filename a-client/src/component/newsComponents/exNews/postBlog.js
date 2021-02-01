import React, { useState } from 'react'
import Dropzone from 'react-dropzone'
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import CreateIcon from '@material-ui/icons/Create';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import axios from "axios";
import { getCookie } from '../../../helpers/auth';
import RequireLogin from '../../../helpers/requireLogin';


function Index() {
    const [text, setText] = useState("")
    const [file, setFile] = useState([])
    // const [dataFile, setDataFile] = useState("")
    const [open, setOpen] = useState(false)
    const [login, setLogin] = useState(false)
    const id = getCookie().token;

    const dragFile = (file) => {
        let data = file[0];
        let reader = new FileReader()
        reader.readAsDataURL(data)
        reader.onloadend = () => {
            setFile(value => [...value, reader.result])
        }
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post("http://localhost:2704/api/news/post", { text, file, id })
            .then(data => {
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
        arr.splice(index, 1)
        setFile(arr)
    }
    const handleChangeText = e => {
        setText(e.target.innerText)
    }
    const handleLineBreak = e => {
        if (e.key === "Enter") {
            let value = text + "<br/>"
            setText(value)
        }
    }
    return (
        <div className="post_data">
            {login === true ? <RequireLogin onClick={(value) => setLogin(value)} /> : console.log()}
            <button className="post_data_button" type="button" onClick={handleOpen}>
                <CreateIcon />
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
                    <form onSubmit={handleSubmit} className="form_post_blog">
                        <h4>Dang tai noi dung cua ban</h4>
                        <div
                            suppressContentEditableWarning={true}
                            onKeyPress={handleLineBreak}
                            id="type_text_div"
                            contentEditable="true"
                            onInput={e => handleChangeText(e)} >
                            Bạn hãy nhập vào đây
                        </div>
                        <Dropzone
                            onDrop={acceptedFiles => dragFile(acceptedFiles)}>
                            {({ getRootProps, getInputProps }) => (
                                <section>
                                    <div className="drag_file" {...getRootProps()}>
                                        <input {...getInputProps()} />
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
                                    typeof file !== 'undefined' ? Object.values(file).map(function (value, index) {
                                        return <li key={index}>
                                            <img src={value}></img>
                                            <span onClick={() => handleDeleteImamge(index)}>&#10005;</span>
                                        </li>
                                    }) : {}}
                            </div>
                        </div>
                        <button type="submit">Submit</button>
                    </form>
                </Fade>
            </Modal>
        </div>
    )
}

export default Index
