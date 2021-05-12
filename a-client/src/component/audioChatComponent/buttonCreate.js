import React, { useState } from 'react'
import { ToastContainer, toast } from "react-toastify"
import { IconButton } from '@material-ui/core'
import TextAreaCustom from '../../helpers/main/textarea'
import axios from "axios"

function ButtonCreate({ id, socket }) {
    const [open, setOpen] = useState(false)
    const [text, setText] = useState()
    const [tag, setTag] = useState()
    const [howL, setHowL] = useState(1)

    let handleSubmit = (e) => {
        e.preventDefault()
        if (text) {
            axios.post("http://localhost:2704/api/audio/create", { id, text, tag, howL })
                .then(success => {
                    toast.success("Dã hoàn thành ")
                    socket.emit("join", { id: success.data._id })
                    setOpen(false)
                })
                .catch(err => {
                    toast.error("Thất bại vui lòng thử lại sau")
                    setOpen(false)
                })
        }
    }
    return (
        <>
            <ToastContainer />
            <IconButton id="podcast-create-button" onClick={e => setOpen(true)}>
                <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                    viewBox="0 0 512 512" xmlSpace="preserve">
                    <g>
                        <g>
                            <path d="M479.999,0C263.145,0,84.777,166.827,65.876,378.837c36.032-50.816,80.171-99.712,135.275-155.925
			c4.096-4.224,10.88-4.309,15.083-0.149c4.203,4.117,4.267,10.88,0.149,15.083c-8.299,8.448-16.725,17.216-25.195,26.091
			c-4.843,5.056-9.579,10.091-14.229,15.04c-0.853,0.917-1.707,1.835-2.56,2.773C106.303,354.667,57.62,418.133,22.27,496.96
			c-2.411,5.376,0,11.691,5.355,14.101c1.429,0.64,2.901,0.939,4.373,0.939c4.075,0,7.979-2.347,9.749-6.293
			c12.587-28.053,27.2-54.08,43.627-79.403c148.992-3.819,284.608-86.699,355.691-218.581c1.771-3.307,1.685-7.296-0.235-10.539
			c-1.941-3.2-5.419-5.184-9.173-5.184h-39.509l70.848-40.491c2.24-1.28,3.968-3.349,4.8-5.781
			c15.189-44.16,22.869-89.6,22.869-135.061C490.665,4.779,485.887,0,479.999,0z"/>
                        </g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g>
                </svg>
            </IconButton>
            <div className="container" style={open === true ? { display: "block" } : { display: "none" }}>
                <form onSubmit={e => handleSubmit(e)} style={open === true ? { display: "block" } : { display: "none" }} className="modal">
                    <div className="modal-container">
                        <div onClick={e => setOpen(false)} className="header">
                            x
                    </div>
                        <div className="top">
                            <p>Tag (Chủ đề) </p>
                            <input spellCheck={false} value={tag} onChange={e => setTag(e.target.value)} className="type_text_div" placeholder="@Tag | Ví dụ: @tinhyeu, @giadinh" />
                        </div>
                        <p>Miêu tả</p>
                        <div id="form_post_blog_div">
                            <TextAreaCustom onChange={(value) => setText(value)} />
                        </div>
                        <div className="bottom">
                            <p>
                                Số người
                        </p>
                            <div className="select-user">
                                <input value={howL} onChange={e => setHowL(e.target.value)} className="type_text_div" type="number" min="1" />
                                <div onClick={e => setHowL("over")}>
                                    <input type="checkbox" id="yes-every" name="vehicle1" />
                                    <label htmlFor="yes-every">Không giới hạn</label>
                                </div>
                            </div>
                        </div>
                        <IconButton type="submit">
                            <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                                viewBox="0 0 490.667 490.667">
                                <path className="y" d="M245.333,0C109.839,0,0,109.839,0,245.333s109.839,245.333,245.333,245.333
	s245.333-109.839,245.333-245.333C490.514,109.903,380.764,0.153,245.333,0z"/>
                                <path className="x" d="M267.968,82.219c-12.496-12.492-32.752-12.492-45.248,0L104.533,200.533
	c-18.889,18.894-18.889,49.522,0,68.416c19.139,18.289,49.277,18.289,68.416,0l19.2-19.2v123.584
	c0,29.455,23.878,53.333,53.333,53.333c29.455,0,53.333-23.878,53.333-53.333V249.749l19.2,19.2
	c19.139,18.289,49.277,18.289,68.416,0c18.889-18.894,18.889-49.522,0-68.416L267.968,82.219z"/>
                                <g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg>
                        </IconButton>
                    </div>
                </form>
            </div>
        </>
    )
}

export default ButtonCreate