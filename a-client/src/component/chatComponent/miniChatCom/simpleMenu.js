import React, { useEffect } from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
// import { Link } from 'react-router-dom';
import Modal from '@material-ui/core/Modal';
import { signOut, getCookie } from '../../../helpers/auth';
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

export default function SimpleMenu({ id, onClick }) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [open, setOpen] = React.useState(false);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleClickBlock = () => {
        if (id.length > 2) {
            setOpen(true)
            console.log(id)
        }
    }
    // handleAB = handle Agree block
    const handleAB = async () => {
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
    const handleLogOut = () => {
        signOut();
        window.location.reload(false);
    }
    return (
        <div className="menuMessage" >
            <ToastContainer />
            <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
                &#9776;
            </Button>
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
                        Quay về
                    </span>
                </MenuItem>
                <MenuItem>
                    <span
                        className="simple_menu_span"
                        onClick={handleClickBlock}>
                        Chặn
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
                        Báo cáo
                    </span>
                </MenuItem>
                <MenuItem onClick={handleLogOut}>
                    <span className="simple_menu_span">
                        Đăng xuất
                    </span>
                </MenuItem>
                {/* <MenuItem onClick={}>Logout</MenuItem> */}
            </Menu>
        </div>
    );
}