import React, { useState } from 'react'
import { getCookie } from '../../../helpers/auth';
import socketApp from '../../../socket';


const SeeLike = (cb) => {
    const { value, i } = cb.props
    let socket = socketApp.getSocket();
    const [like, setLike] = useState(value.likes)
    const id = getCookie().token
    const handleLike = (data) => {
        socket.emit("like", { value: data, id }, error => {
            if (error === "error") {
                setLike(like - 1)
            } else {
                setLike(like + 1)
            }
        })
    }
    return (
        <>
            {
                value.isLiked === true ?
                    <div>
                        <input
                            defaultChecked={true}
                            onClick={e => handleLike(value.idBlog)}
                            type="checkbox"
                            id={"like_button_label" + i} />
                        <label for={"like_button_label" + i} >
                            <li className="like">
                                {like} Like
                    </li>
                        </label>
                    </div> :
                    <div>
                        <input
                            onClick={e => handleLike(value.idBlog)}
                            type="checkbox"
                            id={"like_button_label" + i} />
                        <label for={"like_button_label" + i} >
                            <li className="like">
                                {like} Like
                    </li>
                        </label>
                    </div>
            }
        </>
    )
}

export default SeeLike