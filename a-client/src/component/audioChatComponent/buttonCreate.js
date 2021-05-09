import React, { useEffect, useState } from 'react'


import { IconButton } from '@material-ui/core'


function ButtonCreate() {
    const [open, setOpen] = useState(false)
    return (
        <div className="container">
            <IconButton onClick={e => setOpen(true)}>
                button
            </IconButton>
            <div style={open === true ? { display: "block" } : { display: "none" }} className="modal">
                <div className="modal-container">
                    <div onClick={e => setOpen(false)} className="header">
                        x
                </div>
                    <div className="body">
                        <p>Sometext</p>
                        <textarea>

                        </textarea>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ButtonCreate
