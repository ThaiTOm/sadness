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
        <div className="share">
            <span className="list" aria-controls="share-menu" aria-haspopup="true" onClick={handleClick}>
                <img alt="something share" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAABmJLR0QA/wD/AP+gvaeTAAABg0lEQVRIie2WzysEYRjHv+PHHJZic1DaktZ1c+MiJ5JNuHAnyd2B8uPs6IirIhcphT9ASXGRy6bkruRCstqPw87UGLvvzOzOlORzmuZ95vm8z/POO/NK//x1rLgTApakMUnDkmxJN5IOLMt6j9vllaaAc35yD/QmKd6tIHW5A5qSkKaBokEMkHfjG2KSZiRtSgqqKOde1Fw6YEualDQnaURSY4jHXoKSZoEZYALo8I3lgC3gKaCtfj6A7mrCVmAfKHkeeAM2gAXgIoSgVOX+qqnS44hVuDwDO0AfMAhceibwAMyapAMRZUXgBJgCmivkawM6jWvqBC6FFBaAFaArMKkB73ainkQ1A/TH3Or2UK12go8iyl28L9cQcOUZewTmg8QtwB7ft8QrsEb922k9TOU9wDQwDqR9Y/F/QKIA2M7kzoDPkPLFusW+SWQor3EQy7GKHXnaaaeJfHCm2uTbBuktSRwEHHEKOK0gLQBZb2xSh71Rlf/RtqRrSYeJHvb++ZV8AUop95XdByhYAAAAAElFTkSuQmCC" />  Share
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