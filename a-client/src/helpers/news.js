import React, { useState } from 'react'
import { Link } from "react-router-dom"
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { MenuItem, Menu, Button } from '@material-ui/core';
import NotificationsIcon from '@material-ui/icons/Notifications';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { signOut } from './auth';

export const ImageRender = (cb) => {
    const { value } = cb.props
    switch (value.image.length) {
        case 0:
            return <div></div>

        case 1:
            return <div className="one">
                <Link to={"/posts/id=" + value.idBlog}>
                    <img
                        alt={value.image[0].slice(100, 110)}
                        style={{
                            borderTopLeftRadius: "25px",
                            borderBottomLeftRadius: "25px",
                            borderTopRightRadius: "25px",
                            borderBottomRightRadius: "25px"
                        }}
                        src={value.image[0]} />
                </Link>
            </div>
        case 2:
            return <div className="two">
                <Link to={"/posts/id=" + value.idBlog}>
                    <img
                        alt={value.image[0].slice(100, 110)}
                        style={{
                            borderTopLeftRadius: "25px",
                            borderBottomLeftRadius: "25px"
                        }}
                        src={value.image[0]}></img>
                    <img
                        alt={value.image[1].slice(100, 110)}
                        style={{
                            borderTopRightRadius: "25px",
                            borderBottomRightRadius: "25px"
                        }}
                        src={value.image[1]}></img>
                </Link>
            </div>

        case 3:
            return <div className="three">
                <Link to={"/posts/id=" + value.idBlog}>
                    <div className="two">
                        <img
                            alt={value.image[0].slice(100, 110)}
                            style={{
                                borderTopLeftRadius: "25px"
                            }}
                            src={value.image[0]}></img>
                        <img
                            style={{
                                borderTopRightRadius: "25px"
                            }}
                            alt={value.image[1].slice(100, 110)}
                            src={value.image[1]}></img>
                    </div>
                    <img
                        alt={value.image[2].slice(100, 110)}
                        style={{
                            borderBottomLeftRadius: "25px",
                            borderBottomRightRadius: "25px"
                        }}
                        src={value.image[2]}></img>
                </Link>
            </div>

        case 4:
            return <div className="three">
                <Link to={"/posts/id=" + value.idBlog}>
                    <div className="two">
                        <img
                            alt={value.image[0].slice(100, 110)}
                            style={{
                                borderTopLeftRadius: "25px",
                            }}
                            src={value.image[0]}></img>
                        <img
                            alt={value.image[1].slice(100, 110)}
                            style={{
                                borderTopRightRadius: "25px",
                            }}
                            src={value.image[1]}></img>
                    </div>
                    <div className="two">
                        <img
                            alt={value.image[2].slice(100, 110)}
                            style={{
                                borderBottomLeftRadius: "25px",
                            }}
                            src={value.image[2]}></img>
                        <img
                            alt={value.image[3].slice(100, 110)}
                            style={{
                                borderBottomRightRadius: "25px",
                            }}
                            src={value.image[3]}></img>
                    </div>
                </Link>
            </div>
        default:
            return <div className="three">
                <Link to={"/posts/id=" + value.idBlog}>
                    <div className="two">
                        <img
                            alt={value.image[0].slice(100, 110)}
                            style={{
                                borderTopLeftRadius: "25px",
                            }}
                            src={value.image[0]}></img>
                        <img
                            alt={value.image[0].slice(10, 100)}
                            style={{
                                borderTopRightRadius: "25px",
                            }}
                            src={value.image[1]}></img>
                    </div>
                    <div className="two" >
                        <img
                            alt={value.image[1].slice(100, 110)}
                            style={{
                                borderBottomLeftRadius: "25px",
                            }}
                            src={value.image[2]}></img>
                        <div style={{ position: "relative", width: "90%" }}>
                            <img
                                alt={value.image[2].slice(100, 110)}
                                style={{
                                    borderBottomRightRadius: "25px",
                                }}
                                className="more_image"
                                src={value.image[3]}></img>
                            <span className="last_image">
                                + {value.image.length - 4}
                            </span>
                        </div>
                    </div>
                </Link>
            </div>
    }
}

export const HeaderPage = (props) => {
    let value = props.value || []
    const [openNoti, setOpenNoti] = useState(null)
    const [anchorEl, setAnchorEl] = useState(null);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogOut = () => {
        signOut();
        window.location.reload(false);
    }
    const handleClickNoti = (e) => {
        setOpenNoti(e.currentTarget)
    }
    const handleCloseNoti = () => {
        setOpenNoti(null);
    };
    return (
        <header>
            <div className="navbar_auth">
                <p> Recal </p>
                <div className="extension_auth">
                    <div className="inner_title">
                        <Button className="notify_icon" aria-controls="simple-menu" aria-haspopup="true" onClick={handleClickNoti}>
                            <NotificationsIcon />
                        </Button>
                        <span className="title" id="notify_title">
                            Thông báo
                        </span>
                    </div>
                    <Menu
                        id="menu_main_page"
                        anchorEl={openNoti}
                        keepMounted
                        open={Boolean(openNoti)}
                        onClose={handleCloseNoti}
                    >
                        <p>Thông báo</p>
                        {
                            value.map(function (data, i) {
                                return <Link to={data.type} key={i}>
                                    <MenuItem className="notifications_span">
                                        <span className="simple_menu_span">
                                            {data.number}{data.value}
                                        </span>
                                    </MenuItem>
                                </Link>
                            })
                        }
                    </Menu>
                    <div className="inner_title">
                        <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick} className="account_icon">
                            <AccountCircleIcon />
                        </Button>
                        <span id="account_title" className="title">
                            Tài khoản
                        </span>
                    </div>
                    <Menu
                        id="menu_main_page"
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                    >
                        <MenuItem onClick={handleLogOut}>
                            <span className="simple_menu_span">
                                <ExitToAppIcon /> Đăng xuất
                            </span>
                        </MenuItem>
                    </Menu>
                </div>
            </div>
        </header>
    )

}
export const NavbarRight = () => {
    let arr = window.location.href.split("/")
    return (
        <div className="navbar_right">
            <ul>
                <li className={arr[3] === "" ? "active_title inner_title" : "inner_title"}>
                    <Link className="message_icon" to="/">
                        <img alt="mesage_icon" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABmJLR0QA/wD/AP+gvaeTAAACyklEQVRoge2ZsW/TQBjF33dOQKiNHTtBSLAUlJGhAwjRgSIxgYSAgS4wIRiQYIGRjX8ACdhZKjEwwoLEUgmJChV1gI0MlaBCUJPkbFRa4tzH0ILS2FbPwdEpwr8t372z3vPdxWcfUFDwf0NpDcwswjBsdJWaAixHkSqNwoBgEQE9qYRYqVcqTSJSWfonBmDmfWvt4DRZqOZjUw8BtD3bXiCinxn67ISZhQnzAKAAtxUEs8wc85VGTBiGYcOE+T8owPXDsKGrjwXYmvNmESzO+R35w+/IRV/K2x+Z96ZqE2rOCL1pwarbAjAB4AQYDz0ZLPr++qEkbSyAIhrJv00WWIjujt/ANJW6L5JGQnuxmIaBaTcIbgzWxyYAAIBxZbA0XgGAo4OFcQswOVgYtwAxigCmKQKYpghgmiKAaYoApikCmCYWQDBHJoz0U4Kl/VaYNAIyRy9D0QO7utr4O7EQK/naGQKljutKYwHqlUqTI7TzdaQPAS4Ic7r6WAAiUpvr9oIAWvla2x0CXAD3AOxJkYQJfZJhZhEEwZEu85QCqkRUzsnnTgNKlQjwGOLY9p1PMw8Ab+pVZ6a/kLrat78SNwE0l5aWyocbjUuKyErTWwCU4jkQXcyWQIC1tZiPlzRZa7dnIcTBxMYeCIIvEEh77g7Bu5pjzxDRr/6i9oNMEX1KayPC2VGb53Lp/KB5IEMAf3X1MzPHDx+YzoBw9R8NJiGZ8JrBN2uOfXL/xMSXJJH2FAKAdhieipT6+5HVsqwP3uTk+yzX+N7pXGbQU2wtmzQ2heod8Dxv14dqpr1QtLGxrCK0SNEGES1nNQ8AtWr1GZiuA0g9SiLGKx3zQMYRyBNfyltgPEpqI6ZrNdd+onMdY7vRuuM8JsadhKaobOG57nWMbqdrrvOAGff7a8R4adu2b8rTUKy1g7t+R371O/LtNym1z8cKCgqA31FQ6RIVqOHuAAAAAElFTkSuQmCC" />                    </Link>
                    <span className="title" id="m_title">
                        Tin nhắn
                    </span>
                </li>
                <li className={arr[3] === "news" ? "active_title inner_title" : "inner_title"}>
                    <Link className="home_icon icon_nav" to="/news">
                        <img alt="home_icon" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACMAAAAjCAYAAAAe2bNZAAAABmJLR0QA/wD/AP+gvaeTAAABk0lEQVRYhe3Yv2oUURSA8d9ZdsFKgiBC7BRSppEoSlRQDPgWVqKmtfcRbNRCELGxEgQJYiwE/+AjaKNFJCCi2LtEj0UmmIw72VndzWwxHwzMudxzzwf3cAYmIDN7uIwzOGDv+I6XuBsRG1GIvMDiHkqUeYXzkZnLuNWgyBbXujhdWnyNtziHBXzBQ8zgEmLIoU/wvkbxU6XaZ2Xmau5kATJzqYhvF3Fk5nruzq/MrNVzmXm8lLvaHbDveWZ+xFwRX8nMRezH4SE1Au8yc72Gz9HywiCZGRzbFncwX+PwLQ4Vz8h00P+XxAnQj8ycx8WmTfC0aYEdRGZex9WmRXCniws40rQJljpNG2ynlali0NDrY9gEncW+Scus4WREfN4tKTMP4o0/n4yxUL6mlWEiEBFf8XicIoNkfoyQO8reWkxVA7cyVbQyVQwaen9RzJVl9HA/Ij40JoMTuFG8f8PNxmQiYiUzZ9GLiE+TEKktUwgNncz/y1Q1cCtTRStTxVTJdHHPptQGHo2Q+8zmb41x8BMPfgPzPamgPcvORAAAAABJRU5ErkJggg==" />                    </Link>
                    <span className="title" id="h_title">
                        Trang chủ
                    </span>
                </li>
                <li className={arr[3] === "feedback" ? "active_title inner_title" : "inner_title"}>
                    <Link className="feedback_icon icon_nav" to="/feedback">
                        <img alt="feedback_icon" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABmJLR0QA/wD/AP+gvaeTAAAB+UlEQVRoge2az2oUQRCHvzIKHjxF8OAaES8hevAq+AIGwSfR3HwSH8JH8Am8eAwsyUWQTeJBMDdBMPLzsJOQzEzP9NROzQ7LfLdtuqZ/Vf2niu6FICS9kXQq6UTSftQ4YRTCL1lEjXPLa7hqhNc+Q20RlrRf9FlIet3VPpfbXsM2zOwzsBP1/ZVpi3C0/cTExBJr6yDpEbALbBN4aiW4AM6BYzM7q+vQ6ICkF8CzAGEe5mZ2WG5MZuIi8mMRD/Bc0qzc2FRK7AaK8VLR1OTAdqAQLxVNTQ4MvWFzuFNucFejY6HWAUmtx+tYSC2Texm2j4ED4GFPWs6Aj0Cn0jq1hJ5m2L6nP/EAM+BdV6OKA5J2gL0+FA3BDQckPQFekVFisJzu2vTu5LT4ZieuhEq6C7wFtnoU1Ttm9un67+sz8ICRi69jo/LAT+DfuoR4ucoDZvZH0lfgJXmb2JsHXOd9ihtLyMy+A18AZdh684DrvE9R2QNmdgIc9TVANKlN/C3D1psHXOd9ilQt9DvDdgF86EuIl9oZMLOcPTAKNioPlLkYTEU+f8sNTQ6cBwrxUtHU5MBxoBAvFU1JB4qbsHmonG7MzexHuTHnanHG8j7mPuu5WvzF8mqxIn5iYmIFNv6dONr+krBaaO0RbmPVl/jRvxMP9WePMIaK8H9ym2kLDotU3AAAAABJRU5ErkJggg==" />
                    </Link>
                    <span className="title" id="f_title">
                        Góp ý và cải thiện
                    </span>
                </li>
                <li className={arr[3] === "help" ? "active_title inner_title" : "inner_title"}>
                    <Link className="contact_icon icon_nav" to="/help">
                        <img alt="contact_icon" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABmJLR0QA/wD/AP+gvaeTAAADoUlEQVRoge3ZzWtdRRjH8c80bUqKCqZgqqKmby6UxkLrwtd1QXDhxq0bUXeKf4IIUv8AQTduXLiToitxIairFGkrVZu0xLfaoDWiNSWxzbiYE2numXPvmXuuQWi+uzNnzjO/58zbM8+wxRY3N2EURmKMAbsxhdtxGyawvapyDVfxB5awiMshhNi17U4OxBh34SD2SoJLWMYC5kIIy8NqGMqBGONOzGAftg3beMUaLuB0CGGl9ONiB2KM9+Eoxku/HcAKToYQviv5qLUDMcZtkvD9hcJKmZccWWtTuZUDMcYxPIE7Owgr4SI+CyFcH1RxoAPVn3/S5olf5xI+HdQTbSbgUZsvHvbgyKBK2/u9jDFOKx/zd+EYDmES13EZZ/Axfi6wdSDGuBhC+L6pQuMQqpbKp7CzoMHH8ILmH7OKd/B5gc1VfNi0xPYbQjPKxB/GS/r36jhelDa+toxLvZkl60C1w+4raGQMzzXZy9R9psA27K801Whq8GBLMevcjTt6yn7FR/gqU38GOwrsb6s0ZV9soArMpguMk4Kzv254voLX8B7eQO/uukOa4CXsrbRtIPeXdyPbXX1YkYR+idM4jl+qd2v4NvPNLYVtTMg4nZtwU4WG1zmPNxve9Q4vUmhdypS0JP9LrgdKu3YQh/FQT9nv0hwppaYt58CtQxhu4n68rL7ffIJhDjM1bTkHSg8mTUzhVfWw+zxODGmzpi3nQN/wooDn1f/YgjTB/x7SZm3pHZXYXvbggZ6yH/C6jcttZ3I9cG0Edg9kyt7SXXyt53IOXO3YCPUV5mtp+HSlpi3nwJ8jaOgbvC85chZvj8AmGW21rTnG+KAUq/wfORVCOHtjQa4HFjdJzDBc6i3IrUKXpaRTaTx0IwFP41EpTjqB2Q72VJqWegtrPVCl+7pOuGN4FvdIK9Irys4XORZyqcimmH9OiiKH5fGe54BHOthbw7nci6wDVa7yQocGxzJlXTbN+RBCdnnvd+o6JY3fYTjZsqwNK/KnOvRxIISw2qHRD6QUyhVpL3i3n4gBzPZL+rbJzD0sHxpsBnMhhL6rV5uD+yx+HI2eIi5qMQIGOlAtXV9UBjeLn6Tk7sBDT2l6/Yj/fjjNSen1Vie2YS447pUSviVZuzasSBO2MQ+ao8sV0yEp8TuKK6Z5nKlWviK6XvJNSAf3aeWx0/ol37mmTaoNo7xmnZQO8pPSWXiXjdesy1I8/5sUVS6N4pp1iy1udv4BAFvdN1pTCWgAAAAASUVORK5CYII=" />                    </Link>
                    <span className="title" id="c_title">
                        Trợ giúp
                    </span>
                </li>
                <li className={arr[3] === "policy" ? "active_title inner_title" : "inner_title"}>
                    <Link className="policy_icon icon_nav" to="/policy">
                        <img alt="policy" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABmJLR0QA/wD/AP+gvaeTAAAB2ElEQVRoge2Zu0pDQRCGv/FSSCRaWmljBLERIWBn4TtYaivYiu+gvb1WvoOdXQKiVURiZ+Gl8xIV8TIW5wghkOzunByT4H5dDjO7/0/m7BxmIRKJeKGqBVXdUdVTVW1odl7StbZVdSxv8bOqWu+C6HbUVHXKok08xBeAM2DOskEANaAsIm8hSUMeMVvkLx5gAdgMTRrxiFlr8/wdOAYqwE36OwujgKrqPFAXkS+fJJ8SegbGWx7fA7vAXahKT56AExFpuAJ9SqhV/DuwR37iAYrAiqoOuwJ9DLRyDNwa8kIpAiVXkMVAxZBjZcYVYDFwY8ixUnQFWAxkPW1CcJ6SFgN9hU8f8GUZWAcmA/MegEOgatm0m/+ARTxpzoZ104EvoW4aOCQph1AegAPrpt18B6oY6zgLsYR6zcAbiH2gidgHLMQ+0ETsAxaigV4T+0ATfdsHXq2L/wU+Bi491+rbPnAELHnE9W0f2Acu8hZixWkgndevkszvIZki/xUfrgCvY1RE7lS1TDK//86qKoBnV4BzvN5KOr9fNMkJ51xEOh4ilj5wRTK/z5undK+OBBsQkU/ghHxN/F5wOG9pgkvol/TyoQRMAxNk/yz5BB6Ba+DK94opEvnv/AAb5ySnqFGFWAAAAABJRU5ErkJggg==" />                    </Link>
                    <span className="title" id="p_title">
                        Điều khoản và dịch vụ
                    </span>
                </li>
            </ul>
        </div>
    )
}