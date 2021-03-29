import React, { useState } from 'react'
import { getCookie } from '../../../helpers/auth';
import RequireLogin from '../../../helpers/requireLogin';
import socketApp from '../../../socket';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';

const SeeLike = (cb) => {
    const { value, i, className } = cb.props
    let socket = socketApp.getSocket();
    const [like, setLike] = useState(value.likes)
    const [isLiked, setIsLiked] = useState(value.isLiked)
    const id = getCookie().token
    const [login, setLogin] = useState(false)

    const handleLike = (data) => {
        if (!id) {
            setLogin(true)
        } else {
            socket.emit("like", { value: data, id }, error => {
                if (error === "error") {
                    setLike(like - 1)
                    setIsLiked(false)
                } else {
                    setIsLiked(true)
                    setLike(like + 1)
                }
            })
        }
    }
    return (
        <>
            {login === true ? <RequireLogin onClick={(value) => setLogin(value)} /> : console.log()}
            {
                isLiked === true ?
                    <div className={className}>
                        <input
                            defaultChecked={true}
                            onClick={e => handleLike(value.idBlog)}
                            type="checkbox"
                            id={"like_button_label" + i} />
                        <label htmlFor={"like_button_label" + i} >
                            <span className="like" >
                                <FavoriteIcon /> {like}
                            </span>
                        </label>
                    </div> :
                    <div className={className}>
                        <input
                            onClick={e => handleLike(value.idBlog)}
                            type="checkbox"
                            id={"like_button_label" + i} />
                        <label htmlFor={"like_button_label" + i} >
                            <span className="like">
                                <FavoriteBorderIcon /> {like}
                            </span>
                        </label>
                    </div>
            }
        </>
    )
}

export default SeeLike