import socketApp from "../socket";
import { Link } from "react-router-dom"
let socket = socketApp.getSocket();
export const handleFileUpload = (e, userId, id) => {
    let file = e.target.files;
    let reader = new FileReader()
    for (let i = 0; i < file.length; i++) {
        reader.readAsDataURL(file[i])
        reader.onloadend = () => {
            socket.emit("sendImageOff", { room: id, image: reader.result, userId })
        }
    }
}
export const messageLiImageRender = (value, i, imgUrl, myRef) => {
    return (
        <li
            ref={myRef}
            key={i}
            className={"messageImage" + value}>
            <input type="checkbox" id={i}></input>
            <label for={i}>
                <img alt="" src={imgUrl}></img>
            </label>
        </li>
    )
}
export const messageLiRender = (li, one, two, msgs, i, myRef) => {
    return (
        <li className={li}
            key={i}
            ref={myRef}
        >
            {msgs.length > 60 ?
                <div className={one}>
                    <span>{msgs}</span>
                </div> :
                <div className={two}>
                    <span>{msgs}</span>
                </div>
            })
        </li>
    )
}
export const executeScroll = (myRef) => {
    try {
        myRef.current.scrollIntoView()
    } catch (error) {
    }
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
                        <img alt="home_icon" src="data:image/png;base64,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" />
                    </Link>
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