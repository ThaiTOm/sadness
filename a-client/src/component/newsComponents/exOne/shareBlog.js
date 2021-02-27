import React, { useState } from 'react'
import { MenuItem, Menu } from '@material-ui/core';
import PresentToAllOutlinedIcon from '@material-ui/icons/PresentToAllOutlined';

function ShareBlog(cb) {
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    return (
        <div className="share">
            <span className="list" aria-controls="share-menu" aria-haspopup="true" onClick={handleClick}>
                <PresentToAllOutlinedIcon />  Share
            </span>
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