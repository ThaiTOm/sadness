import React, { useState } from 'react'
import { MenuItem, Menu } from '@material-ui/core';

function ShareBlog(cb) {
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    return (
        <div className="inner">
            <span className="share list" aria-controls="share-menu" aria-haspopup="true" onClick={handleClick}>
                <svg viewBox="-20 -22 552 511" xmlns="http://www.w3.org/2000/svg"><path d="m512 233.820312-212.777344-233.320312v139.203125h-45.238281c-140.273437 0-253.984375 113.710937-253.984375 253.984375v73.769531l20.09375-22.019531c68.316406-74.851562 164.980469-117.5 266.324219-117.5h12.804687v139.203125zm0 0" /></svg>                   </span>
            <Menu
                id="share-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem >
                    <div
                        className="fb-share-button"
                        data-href="https://developers.facebook.com/docs/plugins/"
                        data-layout="button"
                        data-size="large">
                        <a
                            rel="noreferrer"
                            target="_blank"
                            href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fplugins%2F&amp;src=sdkpreparse"
                            className="fb-xfbml-parse-ignore">
                            Chia sẻ
                            </a>
                    </div>
                </MenuItem>
                <MenuItem >My account</MenuItem>
                <MenuItem >Logout</MenuItem>
            </Menu>
        </div>
    )
}

export default ShareBlog