import React, { useState } from 'react'
import Dropzone from 'react-dropzone'
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import CreateIcon from '@material-ui/icons/Create';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import HandleFileUpload from "./handleFiles";

function Index() {
    const [text, setText] = useState("")
    const [file, setFile] = useState("")
    const [open, setOpen] = useState(false)

    const dragFile = (file) => {
        setFile(file)
    }
    const handleSubmit = (e) => {
        e.preventDefault()

    }
    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    return (
        <div className="post_data">
            <button type="button" onClick={handleOpen}>
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
                            id="type_text_div"
                            contentEditable="true"
                            onChange={e => setText(e.target.value)} >
                            Ban hay nhap vao day
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
                            <HandleFileUpload props={file}/>
                        </div>
                        <button type="submit">Submit</button>
                    </form>

                </Fade>
            </Modal>
        </div>

    )
}

export default Index
