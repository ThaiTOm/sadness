import React, { useState } from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Modal from '@material-ui/core/Modal';
import { getCookie } from '../../../helpers/auth';
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import ArrowBackIosOutlinedIcon from '@material-ui/icons/ArrowBackIosOutlined';
import BlockIcon from '@material-ui/icons/Block';
import ReportIcon from '@material-ui/icons/Report';
import { IconButton } from '@material-ui/core';


export default function SimpleMenu({ id, onClick }) {
    const [anchorEl, setAnchorEl] = useState(null);
    const [open, setOpen] = useState(false);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleClickBlock = () => {
        setOpen(true)
    }
    // handleAB = handle Agree block
    const handleAB = () => {
        const idSend = getCookie().token
        axios.post("http://localhost:2704/api/msgC/blockUser", { idSend, id })
            .then(res => {
                toast.success("Yêu cầu của bạn đã được thực hiện")
                setOpen(false)
                setAnchorEl(null)
            }).catch(err => {
                console.log(err)
            })
    }
    const handleCloseBlock = () => {
        setOpen(false)
    }

    return (
        <div className="menuMessage">
            <ToastContainer />
            <IconButton className="back_button" onClick={() => onClick("")}>
                <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAAAtCAYAAAA6GuKaAAAABmJLR0QA/wD/AP+gvaeTAAAFLUlEQVRYhcWYT0wUdxTHv+83s5EaUIFi0oFGYyQmpURgSW1se9DUnqjW2rXcYXaX4AGTejQxaU81aaLUuLuD4eSBbkqLGhKaRg5rjdQoF40pf4Kh9mCFdcWAgd2Z14O7ywKzs8zsuP3efu/3e+/3yS9v3vx+j+Ciuru7q5PJ5C4iqjQMQxZCpIgoLknS7KVLl+bd2oeKce7o6NgrSdIxZj5MRAcAVFssnwdwB8AogF8jkci0031tQ/t8PqmqquokM58CcNDhvszMtwH8mEgkotFoVLfjbAva7/d/AeA8gL12/ApogpnPaJp2bbMOm4IOBoM7mfkKM7c5Z7MWMw+lUim1v7//WaG1BaE7Ozs/EUIMAHjHFTpr/cPMJzVNu221SFhNqqp6VAgxgtIAA0AtEd0MBAJfWS3Ke9Kqqh4noigAyXW0wkox84l8eW4KnU6J3wCUvVE0a71i5k/NUmUDdDAY3GkYxjgApSRo1noCoDkSiczlGuX1q5j5ClwEFkLgyJEjqK+vx8zMDEZGRpBKpTbrXgdAA3A817jmpNN5POgOLiDLMoLBIBobG7O28fFxhEIhW3GI6Gg4HL6eGWerh8/nk4joezdgAXNgAGhubsb27dttxWLm8z6fL1sQstCVlZVfw6U/XT5gADAMA8lk0m7IfTt27DiRGeTW6VPOENfKChgAhoeHsbS0ZDuuECLLJ4DXtzUAHzrkzEqWZfj9/rzAsVgMN27ccBSbmT/u6uraA6ShJUk6jiKvqRng/fv3m87HYjFcvXoVzOx0C9J1/Riwmh6HnEYCSgKc0SFgFfoDp1FKCAykU5j8fv/bAApeB81UYmAAgK7r1TIR7XYStFCVGB0dxcDAgKvAACBJ0m6h6/o2J85tbW0lBwYAIcQ2IYR4y4lzU1OTqX1sbOyNAQMAM28VhmG8cuKcSCRM7Q0NDaitrS0KzEpEtCQkSVpw4jw4OIiVlZUN9vLycvT09KCurq5oQDMZhrEgZFmeceI8OzuLCxcuYHl5ecNcRUXFGwPXdf2xdPfu3Vder/cUgK12A8TjcUxOTqK1tRWyvPZqvmXLFrS0tODhw4d4+fKlW8z/9vX1fSsAgJn/dBplamoKFy9ezHvip0+fdjPH7wCrf8TRYiKVEHwUSEMT0S8AiqpRJQBnSZKuAen2wL179557vd7PALxbTNR4PI7p6Wm0trZCktZ2HjI5/uDBA0c5TkS3QqHQD0DOI4CZe4sBzmhiYgK9vb2m5bCiogKqqkIIyx6RqXL5st6JRCIKYMIh6xpZgSuKYvuNCOCRoig/ZwZZ6Gg0qjPzGcek65QPfGFhAS9evLAb7sy5c+eMzGBN4t2/f/8vr9fbAmCfU9hczc/PY2pqCg0NDSgrK8Pi4iI0TcPc3Fxh51UNRiKR73ING5o1yWSy0+PxjANwpUZNTk7i7NmzqKmpwdOnT+2+xJ8ACKw3mr4Lg8HgR4Zh/I7/t5e3BOBwJBIZWz9h+hmHQqE/iKgdwKb7Vy4rRUTtZsCARX86HA4PEdGXABxdXYvQMjO357bB1qtg20BV1YNE9BNcyvEC+huAL98JZ1SwymuadjuZTDYz85BraOYa9Hg8zYWAAZsNmkAg8Dkzn4dLJTGtR0T0TTgcHt6sg63/aTgcvq4oynvpj/QWnF+ymIhiAE4qivK+HWCgyFZYV1fXHl3XjxHRYWY+AKDGYvkzvL4P3zQMY6ivr8/RiwkoEnq9Ojo6qjwez65UKlVJRB4iWhFCJIjo8eXLl5+7tc9/b08eYXPvRhsAAAAASUVORK5CYII=" />
            </IconButton>
            <button className="tooltip button-option" aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
                &#9776;
                <span className="tooltiptext">
                    Thong tin
                </span>
            </button>
            <Menu
                id="menuContainerMessage"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem onClick={handleClose}>
                    <span
                        className="simple_menu_span"
                        onClick={() => onClick("")}
                        to="/"
                    >
                        <ArrowBackIosOutlinedIcon /> Quay về
                    </span>
                </MenuItem>
                <MenuItem>
                    <span
                        className="simple_menu_span"
                        onClick={handleClickBlock}>
                        <BlockIcon />    Chặn
                    </span>
                    <Modal
                        open={open}
                        aria-labelledby="simple-modal-title"
                        aria-describedby="simple-modal-description" >
                        <div className="contain_block">
                            <div className="head">
                                <button onClick={handleCloseBlock}>&#10005;</button>
                            </div>
                            <div className="middle">
                                <p>Bạn có chắc muốn chặn người này, nếu người này gây hại cho bạn bạn có thể báo cáo chúng tôi sẽ giúp bạn</p>
                            </div>
                            <div className="bottom">
                                <button onClick={handleAB}>Xác nhận</button>
                                <button
                                    onClick={handleCloseBlock}
                                    className="cancel">Hủy bỏ</button>
                            </div>
                        </div>
                    </Modal>
                </MenuItem>
                <MenuItem >
                    <span
                        className="simple_menu_span"
                    >
                        <ReportIcon />   Báo cáo
                    </span>
                </MenuItem>
                {/* <MenuItem onClick={}>Logout</MenuItem> */}
            </Menu>
        </div>
    );
}