import React, { useState } from 'react'
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import RequireLogin from './requireLogin';

const SeeLike = (cb) => {
    const { value, i, className, socket, id } = cb.props
    const [like, setLike] = useState(value.likes)
    const [isLiked, setIsLiked] = useState(value.isLiked)
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