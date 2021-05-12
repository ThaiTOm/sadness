import React, { useEffect, useState, useRef } from 'react'
import { emojiInput } from '../../helpers/message/emoji'
import { IconButton, Menu } from '@material-ui/core';
import { Picker } from "emoji-mart"
import 'emoji-mart/css/emoji-mart.css'


function TextAreaCustom({ onChange }) {
    const inputRef = useRef(null)
    const [anchorEl, setAnchorEl] = useState(null)
    const [cursorPosition, setCursorPosition] = useState()
    const [text, setText] = useState("")

    const handleCloseEmo = () => {
        setAnchorEl(null);
    };

    const emojiSubmit = (e, emo) => {
        if (inputRef.current) {
            let { message, position } = emojiInput(inputRef.current, emo, text)
            setText(message)
            setCursorPosition(position)
        }
        handleCloseEmo()
    }
    const changeText = (e) => {
        onChange(e.target.value)
        setText(e.target.value)
    }

    useEffect(() => {
        inputRef.current ? inputRef.current.selectionEnd = cursorPosition && inputRef.current.focus() : console.log()
    }, [cursorPosition])
    return (
        <>
            <textarea
                spellCheck={false}
                ref={inputRef}
                value={text}
                className="type_text_div"
                onInput={e => changeText(e)} />
            <div className="extension">
                <IconButton aria-controls="simple_menu_emoji" aria-haspopup="true" onClick={e => setAnchorEl(e.currentTarget)}>
                    <img alt="emoji_image" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAAABmJLR0QA/wD/AP+gvaeTAAAC/klEQVRIie2SX2jVdRjGn+9vO5PTFuMcK9ESFHXIiiQmjUDCYDbXRX9uRjACwwuhP8JCuoiiIxRUohdBfxbDi9kIpIv+UyAhrjDoJGp6IVoMzTnz7HjmdP9+7/M+XvzOOW47u/Vuz9WX7/t+n8/L+3yBJS3pbilUDkeem2iNQpR2V9zxXdPpuU0/dU201kVMOzXW9XNm+HBHsTnFaH2lTnA6Jm6cO5a9nEPwhZDoziF8IikfAk4defbm9sr9j8+UNst1Jo5DPrbwKgA0ePSBpDxdeTPlGYczwcLFlieKxUOPF74cbP9/w6KQENDrAkkhNvVW7mVhL12B1FWa3gcAc6VIgJToum7UJF0g1eyOntjCiYNthfYayFPfNJ10qp8U3PX0953XN327rbSZVBcpOH3PC0czJQAwA8qm4y/+ns32HF/eCNo60gdIwUxNNsuDOSiaB0mm9rdIjZGCW9jtjvdIBad+e/5oZrDaRwcpkKq+7flzxb/Df93/Mqk/yrXWBzZeeawGsv2X5qI79pabXqKpk4RReiUgVB1tEQgA5BDcXANWrsUeHqmBAMD0rRv9pCZJpMpGQ93Hsn/P7SEBWwQCAIw1QiqpGxoXhYSGxl5S91AaJwW6tg60F7fMMzKBlhgtVExfa5YM4NRoDeTrJ8c30PB2kom/Q2KIVHDj531tSlUhQrIuW7Curap3+k53QQ5rSIWheRBBYTa2T0mlSY3Wh6l+M99nycQPByu8Xum12GEUjHfeHlh3aX3T8MiglOSACF/svrDy2jzIV+3FHU51lL/gh93HV0/tOHHfD6ROJuvx3GcthQeTTCrBe/P+tZeL+9eM3HJG5wF0l+1+jWLfU/GOAGBwSyljrn3JdBptXDbdBwABQTH93SREv3c2zH5UzmTGzEEqSMgASAMQgFNBeO3mmlWdb/y3eqqaMwD0tSm1TIVHYwA+U3dt19nsxbm7/rjl6iaR9TOhrvTmhRX/HHjoUjpEDSsrdU9ZPDEVxnIjqyZrfsKSlnRXdRsr+i4fv8vwiwAAAABJRU5ErkJggg==" />
                </IconButton>
                <Menu
                    id="simple_menu_emoji"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleCloseEmo}>
                    {/* <IconButton type="button"> */}
                    <Picker onSelect={e => emojiSubmit(1, e)} set={"facebook"} theme={"dark"} showPreview={false} showSkinTones={false} />
                    {/* </IconButton> */}
                </Menu>
            </div>
        </>
    )
}

export default TextAreaCustom
